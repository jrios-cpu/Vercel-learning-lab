# RXL Odoo + Algolia Catalog Rollout Design

Date: 2026-09-05
Status: Approved in chat; pending written-spec review before implementation planning
Branch: `feature/rxl-site-rebuild`

## 1. Goal

Replace the public representative product catalog with the real RXL product dataset derived from the supplied Odoo export, while preserving exact SKU identity, source descriptions, variant attributes, official technical drawings, product-family grouping, and the existing RXL quote/configurator flows.

The target architecture is:

`Odoo export / future Odoo API -> normalizer -> validated RXL dataset -> Vercel catalog + Algolia search index`

Algolia is a search/index layer, not the source of truth. Vercel must remain capable of serving individual product pages from the normalized dataset even if Algolia is temporarily unavailable.

## 2. Current Observed Source Dataset

The supplied `Odoo Export.xlsx` currently yields the following observed normalization targets:

- 10,906 unique SKUs
- 10,615 SKUs with a populated drawing URL
- 291 SKUs without a drawing URL
- 4,068 unique drawing URLs after deduplication
- 12 SKUs without `Sales Description`
- five source product groups/categories from the export

These counts are acceptance targets for the first importer version. A future export is allowed to change the counts, but the importer must report any delta explicitly.

The five current source groups are normalized to the RXL public catalog taxonomy for Cable Pathways, Open Racks, Cable Management, Wall Mounts, and Cabinets & Enclosures. The importer must keep an explicit source-category-to-public-category mapping rather than infer categories from free text.

## 3. Source-of-Truth Rules

### 3.1 Product identity

For every normalized product:

- `partNumber` comes from Odoo `Internal Reference` and is preserved exactly.
- `objectID` for Algolia is the exact part number unless a future migration requires a stable surrogate.
- `title` comes from Odoo `Display Name`, with formatting cleanup only.
- `category` comes from the explicit Odoo source section/category mapping.
- `familyId` is derived deterministically from the normalized RXL base product/family identifier so variants can be grouped without losing SKU identity.

The family derivation implementation must be covered by fixtures from every source category before the full import. If a SKU cannot be assigned to a family deterministically, it remains individually addressable and is reported for review rather than being force-grouped into a guessed family.

No product may be created by inference alone.

### 3.2 Descriptions

- Primary description source: Odoo `Sales Description`.
- The description must not be rewritten by AI during import.
- For the 12 currently observed SKUs with no `Sales Description`, the approved fallback is `Display Name + Variant Values`.
- Missing source content is surfaced as missing; the importer must not invent stock, pricing, lead time, applications, capacities, materials, certifications, or other commercial attributes.

### 3.3 Variant values and specifications

Odoo exports may represent one SKU across a primary row plus continuation/helper rows. The normalizer must collapse all rows belonging to the same SKU before creating the product record.

All source `Variant Values` must be retained and mapped into normalized `specifications`. The importer must not keep only the first variant line or silently discard continuation values.

Examples of variant-driven specifications include, where actually present:

- Color
- Rack Units
- Rail Style
- Width
- Depth
- Door Style
- Top Style
- Runway Width
- J-Bolt Length
- other Odoo variant keys present in the source

Facets are derived from actual normalized attributes instead of from a manually invented global list.

## 4. Normalized Product Contract

The normalized product record should expose at least:

```ts
{
  objectID: string,
  partNumber: string,
  familyId: string,
  title: string,
  category: string,
  categorySlug: string,
  salesDescription: string,
  descriptionSource: "odoo" | "display-name-plus-variants",
  specifications: Record<string, string>,
  drawingPdfUrl: string | null,
  drawingStatus: "live" | "stale" | "invalid" | "missing",
  imageUrl: string | null,
  source: "odoo",
  configuratorEnabled: boolean,
  canonicalPath: string
}
```

The existing site `Product` type may be extended or adapted through a mapping layer, but there must be one canonical normalized data contract rather than separate Vercel and Algolia interpretations.

## 5. Media Strategy

### 5.1 Priority order

For real products, display media in this order:

1. official RXL product/family image when a verified match exists
2. official live technical drawing PDF rendered as a preview
3. clean RXL fallback carrying product/family identity

Do not use Unsplash or invented representative imagery for real Odoo products.

### 5.2 Official product images

A verified family/SKU image from the official RXL site may become `imageUrl`. Family-level imagery may be reused across variants when the association is unambiguous.

A media match must be deterministic and auditable; filename similarity alone is not sufficient if it could map to multiple families.

### 5.3 Technical drawings

The existing Vercel PDF pipeline remains the immediate renderer:

`drawingPdfUrl -> allowlisted same-origin proxy/cache -> PDF.js -> first-page canvas preview`

The original PDF remains available as a document action such as `View Drawing` / `Download PDF`.

The browser renderer is a valid first production implementation. Static WebP thumbnail generation may be added later as a performance optimization without changing the product contract or frontend media-selection logic.

### 5.4 Drawing validation

Do not assume that a populated Odoo URL is live. The supplied export has already demonstrated at least one stale upstream PDF URL.

Validate unique drawing URLs, not every SKU independently. For each of the approximately 4,068 currently observed unique URLs:

1. request the allowlisted upstream resource using a controlled timeout
2. require an acceptable HTTP response
3. verify the response is actually a PDF rather than an HTML error page
4. validate that the PDF is parseable enough for the renderer
5. record `live`, `stale`, or `invalid`

All variants that share a URL inherit the same validation result.

A stale/invalid drawing never invalidates the SKU itself. The SKU remains available and falls back to image/fallback media.

## 6. Catalog and PDP Behavior

### 6.1 Solutions catalog

The public Solutions experience must be backed by the normalized real dataset after the rollout gate passes.

The old representative catalog may remain available only as an explicitly isolated preview/test fixture if still useful. It must not be mixed into public real-product search results.

### 6.2 SKU versus family presentation

All 10,906 currently observed SKUs remain individually indexed and addressable, but the default browse experience should avoid showing hundreds of nearly identical cards for one family.

Default Solutions browse behavior:

- group/distinct by `familyId`
- show a representative family card
- expose available configuration/variant count where useful
- let user filters progressively narrow matching variants

Exact SKU search behavior:

- an exact part-number query must return that exact SKU at highest relevance
- opening that result preserves the exact part number

### 6.3 Product detail pages

Each SKU has an unambiguous URL, following the current site convention, for example:

`/products/cabinets/RXL-5550-BK422432S`

A SKU PDP must show the data for that exact configuration:

- exact part number
- source title/display name
- source Sales Description or approved fallback
- all normalized variant specifications
- verified image and/or drawing media
- documents
- quote/configurator actions preserving the part number

Family media can be shared when appropriate, but variant specifications and SKU identity may never bleed across products.

## 7. Algolia Design

### 7.1 Role

Algolia powers discovery, text search, facets, relevance, and family distinct behavior. It does not become the product master.

### 7.2 Target application identity gate

The currently embedded Algolia Experiences frontend uses application ID `QVGC9APPPY`.

Before any production index write:

- verify that the write-capable Algolia connection/credential targets `QVGC9APPPY`
- verify the intended production index name explicitly
- create or replace records only in that confirmed target
- stop the import if the connected write destination cannot be proven to match the frontend application

A successful write to a different Algolia application is considered a failed rollout, not a partial success.

### 7.3 Records

Use one Algolia record per SKU. Each record includes the exact SKU fields plus `familyId` and searchable/facet attributes.

### 7.4 Search relevance

Recommended priority:

1. exact `partNumber`
2. part-number prefix / family identifier
3. `title` / display name
4. `salesDescription`
5. normalized specification/variant values

Exact part-number search must not be outranked by a description match.

### 7.5 Distinct/grouping

Use `familyId` for distinct/grouped browse behavior. The implementation must preserve the ability to return an exact SKU when the user searches for or filters down to it.

### 7.6 Facets

Facet candidates are generated from real normalized specifications. The UI only exposes facets relevant to the current result set/category.

A cabinet may expose Rack Units, Rail Style, Width, Depth, Color, and other applicable attributes. A J-bolt or cable-pathway product should not inherit irrelevant cabinet facets simply because another category uses them.

### 7.7 Failure behavior

If Algolia is unavailable:

- individual PDPs must still render from the normalized dataset
- direct SKU URLs remain valid
- search/browse may degrade gracefully to the local provider where practical
- an Algolia outage must not make all product content unavailable

## 8. Vercel Data Strategy

Do not statically generate 10,906 product routes on every build.

Keep SKU PDP routing dynamic and resolve products from the normalized dataset/provider at request time or through an efficient generated lookup artifact.

The data artifact must be practical for Vercel deployment size/runtime constraints. If a single JSON artifact becomes unnecessarily heavy, partition by category/family or generate an indexed lookup format, but do not introduce a second divergent product model.

## 9. Import Pipeline

First production importer flow:

```text
Odoo Export.xlsx
  -> parse rows
  -> associate continuation rows with their SKU
  -> normalize exact product fields
  -> apply explicit source-category mapping
  -> derive family keys deterministically
  -> consolidate variant specifications
  -> apply 12-SKU description fallback rule when needed
  -> deduplicate drawing URLs
  -> validate drawings
  -> cross-reference verified official RXL imagery
  -> generate normalized dataset
  -> generate Algolia records
  -> verify Algolia target application/index identity
  -> run QA gates
  -> publish Preview
```

Future flow should allow replacing the Excel source with an Odoo API/export source without changing downstream contracts.

## 10. Update and Diff Workflow

Every future catalog update should produce a diff report against the prior normalized version:

- added SKUs
- changed SKUs
- removed SKUs
- new/changed drawing URLs
- drawing validation state changes
- new/changed image matches
- changed descriptions/specifications

Only new or changed media URLs need revalidation where the previous validation result is still trusted under the chosen cache policy.

Do not silently delete a SKU from the public catalog because it disappears from a new export without reporting the removal in the import summary.

## 11. QA and Release Gates

The rollout is not complete until the following pass.

### 11.1 Data integrity

For the current source export:

- exactly 10,906 unique normalized SKUs
- zero duplicate part numbers
- zero silent SKU loss
- zero products without a normalized category
- zero silent loss of continuation-row Variant Values
- 12 missing Sales Description records use exactly the approved fallback rule
- source descriptions are otherwise preserved without AI rewriting
- all family assignments are deterministic or explicitly reported as ungrouped exceptions

### 11.2 Media integrity

- every `drawingStatus = live` URL is actually a usable PDF
- stale, missing, HTML, 404, timeout, and invalid PDFs are not exposed as live drawings
- stale drawings do not break product pages
- technical-drawing preview stays bounded to its media frame
- real product cards never fall back to unrelated stock imagery

### 11.3 Search integrity

- Algolia write destination is verified as the same application used by the frontend
- exact SKU searches resolve the exact SKU
- family-name searches group variants appropriately
- facet combinations return only matching variants
- no incompatible global facet pollution
- category filters do not cross-contaminate unrelated product groups

### 11.4 Routing and conversion integrity

- representative samples from every source category open valid PDPs
- SKU URLs are stable and deterministic
- Request a Quote carries the exact SKU
- Start Project/configurator carries the exact SKU
- direct PDP rendering does not require Algolia availability

### 11.5 Existing application gates

Before merge to `main`:

- lint passes
- TypeScript passes
- Vitest passes
- Next production build passes
- Vercel Preview is READY
- smoke QA covers Solutions, exact SKU search, family browse, PDP, RFQ, configurator, responsive behavior, and drawing fallback

## 12. Import Report

Every import should emit a human-readable summary similar to:

```text
SKUs normalized:          10,906
Descriptions from Odoo:   10,894
Description fallbacks:        12
SKUs with drawing URL:    10,615
SKUs without drawing URL:    291
Unique drawing URLs:       4,068
Drawings live:                  X
Drawings stale/invalid:         Y
Official images matched:        Z
Ungrouped family exceptions:    U
Duplicate part numbers:         0
Normalization errors:           0
```

`X`, `Y`, `Z`, and `U` are discovered report outputs, not placeholders that may be skipped or predeclared success values.

## 13. Security and Credentials

- Never store an Algolia Admin/write key in client code.
- Browser code may use only a search/experience credential intended for frontend use.
- Server-side write/index synchronization must use a protected credential or approved connected integration.
- The write-capable destination must be verified against frontend application ID `QVGC9APPPY` before mutation.
- The PDF proxy remains strictly allowlisted to approved RXL PDF hosts/paths and must reject arbitrary URL proxying.
- No Odoo, Algolia, Sanity, or other secret may be committed to GitHub.

## 14. Explicit Non-Goals for This Rollout

This catalog rollout does not connect or invent:

- live pricing
- inventory
- lead-time feeds
- Epicor
- ATS
- Entra
- CRM/outbound email
- Sanity as the source of product truth
- GA4/GTM/Clarity

Sanity may later manage marketing/editorial content or enriched product copy if RXL approves it, but Odoo product identity/configuration remains authoritative unless the architecture is explicitly changed.

## 15. Release Strategy

Do not merge the current PR to `main` merely because the PDF proof-of-concept works.

Implementation occurs on `feature/rxl-site-rebuild` using TDD and incremental gates. The public representative product catalog is replaced only after the full normalized source dataset and search/media gates are green in Preview.

Once the rollout passes, update the PR description with the final import report and verified counts, run the full production gate, then merge to `main` and perform a production smoke QA.

## 16. Approved Decisions

The following decisions were explicitly approved during design discussion:

- hybrid normalized-dataset + Algolia architecture
- Odoo remains source of truth
- one normalized contract feeds both Vercel and Algolia
- real SKU descriptions come from `Sales Description`
- the 12 currently observed missing descriptions use `Display Name + Variant Values`, with no AI-generated fallback
- all continuation-row Variant Values are retained
- source category mapping is explicit rather than inferred from free text
- family grouping must be deterministic; uncertain SKUs remain ungrouped and are reported instead of guessed
- all SKUs remain individually addressable
- default browse groups variants by product family
- exact SKU search resolves exact SKU
- official RXL imagery takes priority over drawing previews
- live drawings render as technical media and retain their original PDF download/view action
- stale drawings degrade safely and never invalidate the SKU
- media URLs are deduplicated and validated before being treated as live
- representative/stock imagery is not used for real Odoo products
- dynamic PDP routing is preferred over statically generating every SKU per build
- Algolia production writes are blocked until the target application/index identity is verified
- release is blocked on data, search, media, routing, and existing application QA gates
