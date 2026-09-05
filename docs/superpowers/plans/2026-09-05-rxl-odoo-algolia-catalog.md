# RXL Odoo + Algolia Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the representative RXL catalog with the 10,906-SKU Odoo-derived catalog, preserve source descriptions/specifications and verified media, and use Algolia for grouped search/facets while keeping direct PDPs available without Algolia.

**Architecture:** `Odoo Export.xlsx` is an offline source input and is never committed. A deterministic TypeScript importer creates one canonical normalized product model, partitioned runtime JSON artifacts, a SKU lookup index, media-validation artifacts, an Algolia NDJSON export, and an import manifest/report. Vercel reads only the generated runtime artifacts; Algolia receives the same normalized records and is used by the search API with a local server-side fallback.

**Tech Stack:** Next.js 16.3.4, React 19.2.8, TypeScript 5.9, Vitest 3.2.4, pdfjs-dist 6.3.289, Node 20+, ExcelJS 4.4.0, tsx 4.x, Algolia REST APIs.

**Spec:** `docs/superpowers/specs/2026-09-05-rxl-odoo-algolia-catalog-design.md`

## Global Constraints

- Odoo `Internal Reference` is the exact SKU/part-number source of truth.
- Odoo `Display Name` is the title source; only deterministic formatting cleanup is allowed.
- Odoo `Sales Description` is preserved verbatim as product description except for whitespace normalization.
- The 12 currently observed records without `Sales Description` use only `Display Name + Variant Values`; no AI-generated fallback.
- All continuation-row `Variant Values` must be preserved.
- Current source acceptance target: exactly 10,906 unique SKUs.
- Current category counts: Cable Pathways 2,839; Open Racks 1,693; Cable Management 1,474; Wall Mounts 1,415; Cabinets & Enclosures 3,485.
- Current drawing counts: 10,615 SKUs with drawing URL, 291 without; 4,068 unique populated drawing URLs.
- Real Odoo products never use Unsplash or unrelated representative imagery.
- A stale/invalid drawing never invalidates its SKU.
- Algolia is an index, not the product master; direct PDP rendering must work when Algolia is unavailable.
- Do not statically generate all 10,906 PDPs during every Next build.
- Do not commit `Odoo Export.xlsx`, Algolia Admin keys, Odoo credentials, or other secrets.
- The first Algolia write is blocked unless the write destination application ID exactly matches the frontend application ID `QVGC9APPPY`.
- Existing `Request a Quote` and `Start Project` paths must preserve the exact SKU.
- `main` remains untouched until Preview/data/search/media/conversion gates are green.

---

## File Structure Locked by This Plan

**Importer / build tooling**
- Create `scripts/rxl/catalog/import-odoo.ts` — CLI entry point that reads the external Excel file and writes normalized source artifacts.
- Create `scripts/rxl/catalog/normalize.ts` — pure row-to-product normalization, category mapping, family derivation, description fallback, continuation-row folding.
- Create `scripts/rxl/catalog/validate-drawings.ts` — deduplicated PDF validation with checkpoint cache.
- Create `scripts/rxl/catalog/build-runtime.ts` — combines source records + media validation + official image map into runtime partitions and Algolia records.
- Create `scripts/rxl/catalog/push-algolia.ts` — guarded Algolia settings/index writer using server-side environment variables only.
- Create `scripts/rxl/catalog/report.ts` — import/diff summary generator.

**Canonical contracts / runtime data**
- Create `lib/rxl/catalog/schema.ts` — canonical Odoo catalog types and narrow parsing helpers.
- Create `lib/rxl/catalog/generated.ts` — server-only loader for generated partitions, manifest, and SKU index.
- Create `lib/rxl/catalog/local-search.ts` — local exact-SKU, grouped family browse, filtering, facet, sort, pagination fallback.
- Create `lib/rxl/catalog/algolia-search.ts` — Algolia search adapter using public search credentials.
- Create `lib/rxl/data/generated/catalog/manifest.json` — source hash/counts/categories/media totals.
- Create `lib/rxl/data/generated/catalog/sku-index.json` — compact exact SKU -> category partition lookup.
- Create five partition files under `lib/rxl/data/generated/catalog/products/` — `cable-pathways.json`, `open-racks.json`, `cable-management.json`, `wall-mounts.json`, `cabinets-enclosures.json`.
- Create `lib/rxl/data/generated/catalog/drawing-validation.json` — one entry per unique drawing URL.
- Create `lib/rxl/data/generated/catalog/official-media-map.json` — verified family/SKU image mappings only.
- Create `lib/rxl/data/generated/catalog/algolia-records.ndjson` — one search record per SKU.
- Create `lib/rxl/data/generated/catalog/import-report.json` — machine-readable final report/diff summary.

**Application integration**
- Modify `lib/rxl/types/catalog.ts` — add Odoo/family/source metadata without removing existing fields used by PDP/RFQ/configurator.
- Modify `lib/rxl/providers/catalog.ts` — real catalog provider, Algolia search with local fallback; no public representative mixing.
- Create `app/api/catalog/search/route.ts` — server-side search endpoint.
- Modify `components/rxl/catalog/CatalogBrowser.tsx` — API-driven search/facets instead of shipping all products to the browser.
- Modify `components/rxl/catalog/FacetPanel.tsx` — dynamic facet groups based on returned result set.
- Modify `components/rxl/catalog/ProductCard.tsx` — official image -> live drawing -> RXL fallback, family configuration count, no stock imagery for Odoo products.
- Modify `components/rxl/product/ProductPageView.tsx` — exact Odoo description/specs/media/document behavior and Odoo source badge.
- Modify `app/(marketing)/products/page.tsx` and `app/(marketing)/products/[category]/page.tsx` — pass initial server search result rather than the complete product array.
- Modify `app/(marketing)/products/[category]/[sku]/page.tsx` — exact SKU lookup remains server-side/dynamic and related products come from family-aware provider lookup.
- Modify `package.json` / `package-lock.json` — importer scripts + `exceljs` / `tsx` tooling.

**Tests**
- Create `tests/rxl/catalog-normalize.test.ts`.
- Create `tests/rxl/catalog-generated.test.ts`.
- Create `tests/rxl/catalog-local-search.test.ts`.
- Create `tests/rxl/catalog-algolia.test.ts`.
- Create `tests/rxl/catalog-search-route.test.ts`.
- Modify `tests/rxl/catalog-browser.test.tsx`, `tests/rxl/product-card.test.tsx`, `tests/rxl/catalog.test.ts`, `tests/rxl/drawing-thumbnail.test.tsx`, and conversion-flow regression tests as needed.

---

### Task 1: Canonical Catalog Contract and Import Tooling

**Files:**
- Create: `lib/rxl/catalog/schema.ts`
- Modify: `lib/rxl/types/catalog.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Test: `tests/rxl/catalog-normalize.test.ts`

**Interfaces:**
- Produces: `OdooSourceRow`, `ImportedOdooProduct`, `RuntimeCatalogProduct`, `DrawingValidation`, `CatalogManifest`, `normalizeText(value)`, `normalizeCategory(section)`, `deriveFamilyId(partNumber, displayName)`.
- Consumed by: Tasks 2-10.

- [ ] **Step 1: Add the failing contract test**

```ts
import { describe, expect, it } from "vitest";
import { deriveFamilyId, normalizeCategory } from "@/lib/rxl/catalog/schema";

describe("RXL catalog contract", () => {
  it("maps the five Odoo sections to stable public slugs", () => {
    expect(normalizeCategory("Section 1: Cable Pathways").slug).toBe("cable-pathways");
    expect(normalizeCategory("Section 2: Open Racks").slug).toBe("open-racks");
    expect(normalizeCategory("Section 3: Cable Management").slug).toBe("cable-management");
    expect(normalizeCategory("Section 4: Wall Mounts").slug).toBe("wall-mounts");
    expect(normalizeCategory("Section 5: Cabinets and Enclosures").slug).toBe("cabinets-enclosures");
  });

  it("derives family identity from the cleaned Odoo display name", () => {
    expect(deriveFamilyId("RXL-1001-BZ01", "[RXL-1001-BZ01] RXL-1001 (Black Zinc, 2.25\" L)")).toBe("RXL-1001");
    expect(deriveFamilyId("RXL-5550-BK422432S", "[RXL-5550-BK422432S] RXL-5550 (Black, 42U)")).toBe("RXL-5550");
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run:
```bash
npm test -- tests/rxl/catalog-normalize.test.ts
```
Expected: FAIL because `@/lib/rxl/catalog/schema` does not exist.

- [ ] **Step 3: Add importer dependencies and scripts**

Run:
```bash
npm install --save-dev exceljs@4.4.0 tsx@^4.0.0
```

Add scripts:
```json
{
  "catalog:import": "tsx scripts/rxl/catalog/import-odoo.ts",
  "catalog:validate-drawings": "tsx scripts/rxl/catalog/validate-drawings.ts",
  "catalog:build-runtime": "tsx scripts/rxl/catalog/build-runtime.ts",
  "catalog:push-algolia": "tsx scripts/rxl/catalog/push-algolia.ts",
  "catalog:report": "tsx scripts/rxl/catalog/report.ts"
}
```

- [ ] **Step 4: Implement the canonical schema**

`lib/rxl/catalog/schema.ts` must define exact categories and runtime types. The category map is explicit, never inferred from description text:

```ts
export const ODOO_CATEGORY_MAP = {
  "Section 1: Cable Pathways": { name: "Cable Pathways", slug: "cable-pathways" },
  "Section 2: Open Racks": { name: "Open Racks", slug: "open-racks" },
  "Section 3: Cable Management": { name: "Cable Management", slug: "cable-management" },
  "Section 4: Wall Mounts": { name: "Wall Mounts", slug: "wall-mounts" },
  "Section 5: Cabinets and Enclosures": { name: "Cabinets & Enclosures", slug: "cabinets-enclosures" },
} as const;

export type DrawingStatus = "live" | "stale" | "invalid" | "missing";
export type DescriptionSource = "odoo" | "display-name-plus-variants";

export type RuntimeCatalogProduct = {
  objectID: string;
  partNumber: string;
  familyId: string;
  title: string;
  category: string;
  categorySlug: string;
  salesDescription: string;
  descriptionSource: DescriptionSource;
  competitorCross: string | null;
  specifications: Record<string, string>;
  drawingPdfUrl: string | null;
  drawingStatus: DrawingStatus;
  imageUrl: string | null;
  source: "odoo";
  canonicalPath: string;
};
```

`deriveFamilyId()` first removes the leading `[SKU]` segment from `Display Name`, then reads the first `RXL-...` token before the variant parenthesis. If no distinct family token exists, it returns the exact `partNumber`; it never guesses by truncating arbitrary suffixes.

- [ ] **Step 5: Extend the existing `Product` type without breaking current callers**

Add:
```ts
familyId: string;
source: "odoo" | "representative";
variantCount?: number;
```

Change `status` to:
```ts
status: "representative" | "verified" | "odoo";
```

Existing representative fixtures receive `familyId: series` and `source: "representative"` until Task 6 removes them from the public provider.

- [ ] **Step 6: Run focused tests and typecheck**

```bash
npm test -- tests/rxl/catalog-normalize.test.ts tests/rxl/catalog.test.ts
npm run typecheck
```
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json lib/rxl/catalog/schema.ts lib/rxl/types/catalog.ts tests/rxl/catalog-normalize.test.ts lib/rxl/data/products.ts lib/rxl/data/verified-products.ts
git commit -m "feat: define real RXL catalog contract"
```

---

### Task 2: Odoo Excel Parser and Continuation-Row Folding

**Files:**
- Create: `scripts/rxl/catalog/normalize.ts`
- Create: `scripts/rxl/catalog/import-odoo.ts`
- Create: `tests/fixtures/rxl/odoo-rows.json`
- Modify: `tests/rxl/catalog-normalize.test.ts`

**Interfaces:**
- Consumes: `RuntimeCatalogProduct` primitives and category helpers from Task 1.
- Produces: `parseOdooRows(rows): ImportedOdooProduct[]`, `readOdooWorkbook(path): Promise<ImportedOdooProduct[]>`.

- [ ] **Step 1: Add a fixture reproducing the real row shape**

`tests/fixtures/rxl/odoo-rows.json`:
```json
[
  ["Competitor Cross","Internal Reference","Display Name","Sales Description","Variant Values","URL Link"],
  ["Section 1: Cable Pathways (2882)","","","","",""],
  ["","RXL-1001-BZ01","[RXL-1001-BZ01] RXL-1001 (Black Zinc, 2.25\" L)","J-Bolt Kit","Color: Black Zinc","https://www.rxlusa.com/wp-content/uploads/SolidDrawings/RXL-1001-X01.pdf"],
  ["","","","","Section 1: J-Bolt Length: 2.25\" L",""]
]
```

- [ ] **Step 2: Add failing continuation/fallback tests**

```ts
it("folds continuation variant rows into the preceding SKU", () => {
  const [product] = parseOdooRows(fixtureRows);
  expect(product.partNumber).toBe("RXL-1001-BZ01");
  expect(product.specifications).toEqual({ Color: "Black Zinc", "J-Bolt Length": "2.25\" L" });
  expect(product.salesDescription).toBe("J-Bolt Kit");
});

it("uses only Display Name plus variants when Sales Description is empty", () => {
  const rows = fixtureRows.map((row) => [...row]);
  rows[2][3] = "";
  const [product] = parseOdooRows(rows);
  expect(product.descriptionSource).toBe("display-name-plus-variants");
  expect(product.salesDescription).toContain("RXL-1001");
  expect(product.salesDescription).toContain("Color: Black Zinc");
});
```

- [ ] **Step 3: Run RED**

```bash
npm test -- tests/rxl/catalog-normalize.test.ts
```
Expected: FAIL because parser functions do not exist.

- [ ] **Step 4: Implement row parsing**

Rules in `normalize.ts`:
- Require header cells exactly: `Competitor Cross`, `Internal Reference`, `Display Name`, `Sales Description`, `Variant Values`, `URL Link`.
- A row whose column A starts with `Section N:` updates current category but is not a SKU.
- A non-empty `Internal Reference` starts a new product.
- A following row with blank `Internal Reference` and a non-empty `Variant Values` belongs to the current SKU until the next SKU/section.
- Remove `Section N:` prefix from continuation variant labels before parsing `Key: Value`.
- Multiple values for the same key are de-duplicated and joined with ` | ` in source order.
- Ignore a blank helper row; throw if a non-empty variant continuation appears before any SKU.

- [ ] **Step 5: Implement ExcelJS reader/CLI**

`import-odoo.ts` accepts exactly:
```bash
npm run catalog:import -- --input "/absolute/path/Odoo Export.xlsx" --out "/absolute/path/catalog-work"
```

It reads worksheet `Sheet1`, converts each worksheet row into the six-column array expected by `parseOdooRows`, hashes the source file with SHA-256, and writes:
- `catalog-work/imported-products.json`
- `catalog-work/source-meta.json`

It must exit non-zero if input/header/category mapping is invalid.

- [ ] **Step 6: Verify deterministic parser tests**

```bash
npm test -- tests/rxl/catalog-normalize.test.ts
npm run typecheck
```
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/rxl/catalog/normalize.ts scripts/rxl/catalog/import-odoo.ts tests/fixtures/rxl/odoo-rows.json tests/rxl/catalog-normalize.test.ts
git commit -m "feat: parse Odoo product export deterministically"
```

---

### Task 3: Full Source Import Integrity Gate

**Files:**
- Create: `tests/rxl/catalog-generated.test.ts`
- Generate during execution: temporary `catalog-work/imported-products.json` and `catalog-work/source-meta.json` outside Git.

**Interfaces:**
- Consumes: importer from Task 2 and the supplied `Odoo Export.xlsx` outside the repository.
- Produces: verified imported-product array and immutable acceptance counts for this source version.

- [ ] **Step 1: Run the importer against the supplied file**

```bash
npm run catalog:import -- --input "/path/to/Odoo Export.xlsx" --out "$PWD/catalog-work"
```

- [ ] **Step 2: Add generated-data assertions using the imported JSON**

`tests/rxl/catalog-generated.test.ts` reads `catalog-work/imported-products.json` only when `RXL_CATALOG_WORK_DIR` is set and asserts:

```ts
expect(products).toHaveLength(10906);
expect(new Set(products.map((p) => p.partNumber)).size).toBe(10906);
expect(countByCategory(products)).toEqual({
  "cable-pathways": 2839,
  "open-racks": 1693,
  "cable-management": 1474,
  "wall-mounts": 1415,
  "cabinets-enclosures": 3485,
});
expect(products.filter((p) => p.descriptionSource === "display-name-plus-variants")).toHaveLength(12);
expect(products.filter((p) => p.drawingPdfUrl)).toHaveLength(10615);
expect(new Set(products.flatMap((p) => p.drawingPdfUrl ? [p.drawingPdfUrl] : [])).size).toBe(4068);
```

Also assert no missing category, title, part number, familyId, or description.

- [ ] **Step 3: Run the full-source data gate**

```bash
RXL_CATALOG_WORK_DIR="$PWD/catalog-work" npm test -- tests/rxl/catalog-generated.test.ts
```
Expected: PASS with exactly the current-source counts above.

- [ ] **Step 4: Inspect representative records**

The test must assert:
```ts
expect(bySku("RXL-1001-BZ01").specifications).toMatchObject({ Color: "Black Zinc", "J-Bolt Length": "2.25\" L" });
expect(bySku("RXL-5550-BK422432S").familyId).toBe("RXL-5550");
```

- [ ] **Step 5: Commit only the test, never the source workbook or temporary work directory**

Add to `.gitignore`:
```gitignore
catalog-work/
Odoo Export.xlsx
```

Commit:
```bash
git add .gitignore tests/rxl/catalog-generated.test.ts
git commit -m "test: gate full Odoo catalog integrity"
```

---

### Task 4: Deduplicated Drawing Validation and Checkpoint Cache

**Files:**
- Create: `scripts/rxl/catalog/validate-drawings.ts`
- Create: `tests/rxl/catalog-drawing-validation.test.ts`
- Generate: `catalog-work/drawing-validation.json`

**Interfaces:**
- Produces: `validateDrawingUrl(url, fetchImpl): Promise<DrawingValidation>` and a URL-keyed checkpoint cache.
- Consumed by: Task 5.

- [ ] **Step 1: Write failing validator tests**

Mock four cases: valid `%PDF-` response, HTTP 404, HTML response with 200, timeout/network failure. Expected statuses: `live`, `stale`, `invalid`, `invalid`.

```ts
expect(await validateDrawingUrl(validPdfUrl, validPdfFetch)).toMatchObject({ status: "live" });
expect(await validateDrawingUrl(missingUrl, notFoundFetch)).toMatchObject({ status: "stale", httpStatus: 404 });
expect(await validateDrawingUrl(htmlUrl, htmlFetch)).toMatchObject({ status: "invalid" });
```

- [ ] **Step 2: Run RED**

```bash
npm test -- tests/rxl/catalog-drawing-validation.test.ts
```

- [ ] **Step 3: Implement safe URL validation**

Validation requirements:
- URL protocol `https:`.
- Host exactly `www.rxlusa.com` or `rxlusa.com`.
- Path begins `/wp-content/uploads/SolidDrawings/` and ends `.pdf` case-insensitively.
- Abort after 10 seconds.
- Follow normal redirects only when final host/path remains allowlisted.
- Require 2xx response and PDF signature `%PDF-`; do not trust content type alone.
- Use `pdfjs-dist/legacy/build/pdf.mjs` to open the returned bytes and `getPage(1)` before marking `live`.
- `404`/`410` => `stale`; other non-2xx/HTML/broken PDF => `invalid`.

- [ ] **Step 4: Implement dedupe/checkpoint CLI**

Run:
```bash
npm run catalog:validate-drawings -- --products "$PWD/catalog-work/imported-products.json" --cache "$PWD/catalog-work/drawing-validation.json" --concurrency 6
```

The script deduplicates URLs before requests, reuses already-complete cache entries, writes a checkpoint atomically every 25 completed URLs, and resumes without re-fetching completed URLs after interruption.

- [ ] **Step 5: Verify validator tests**

```bash
npm test -- tests/rxl/catalog-drawing-validation.test.ts tests/rxl/drawing-thumbnail.test.tsx tests/rxl/drawing-pdp-regression.test.ts
```
Expected: PASS.

- [ ] **Step 6: Run the 4,068-URL validation in a network-enabled environment**

Do not run this as part of every `npm run build`. Resume until every unique URL has a terminal `live|stale|invalid` result.

- [ ] **Step 7: Commit**

```bash
git add scripts/rxl/catalog/validate-drawings.ts tests/rxl/catalog-drawing-validation.test.ts
git commit -m "feat: validate RXL drawings with resumable cache"
```

---

### Task 5: Official Media Crosswalk and Runtime Artifact Builder

**Files:**
- Create: `scripts/rxl/catalog/build-runtime.ts`
- Create: `tests/rxl/catalog-media.test.ts`
- Generate/commit: `lib/rxl/data/generated/catalog/**`

**Interfaces:**
- Consumes: imported products, drawing-validation cache, verified official media map.
- Produces: five runtime partitions, SKU index, manifest, NDJSON Algolia records, import report.

- [ ] **Step 1: Write failing media-priority tests**

```ts
expect(selectProductMedia({ imageUrl: officialImage, drawingStatus: "live", drawingPdfUrl })).toEqual({ kind: "image", src: officialImage });
expect(selectProductMedia({ imageUrl: null, drawingStatus: "live", drawingPdfUrl })).toEqual({ kind: "drawing", src: drawingPdfUrl });
expect(selectProductMedia({ imageUrl: null, drawingStatus: "stale", drawingPdfUrl })).toEqual({ kind: "fallback" });
```

- [ ] **Step 2: Run RED**

```bash
npm test -- tests/rxl/catalog-media.test.ts
```

- [ ] **Step 3: Build deterministic official image map**

Use the validated RXL public catalog snapshot as an offline input and map only unambiguous family/SKU associations. For example, `RXL-5550` may map to the official `RXL-5550-169x300.png` family image. Reject ambiguous duplicate family keys rather than guessing.

The builder accepts:
```bash
npm run catalog:build-runtime -- --products "$PWD/catalog-work/imported-products.json" --drawings "$PWD/catalog-work/drawing-validation.json" --media "/path/to/catalog_products_validated_clean.csv" --out "$PWD/lib/rxl/data/generated/catalog"
```

- [ ] **Step 4: Emit runtime Product-compatible records**

Mapping rules:
- `shortDescription = salesDescription`.
- `longDescription = salesDescription`; do not append Preview copy or invented enrichment.
- `status = "odoo"`, `source = "odoo"`, `familyId = normalized familyId`.
- `media` gets official image only when verified.
- `documents` gets a `drawing` document only when `drawingStatus === "live"`.
- `availability`, `leadTime`, `finish` remain `null` unless the exact source field exists; Variant Values remain in `specifications`.
- `applications`, `components`, `accessories` remain empty unless sourced elsewhere later.
- `configurator.defaults.partNumber` is the exact SKU.
- SEO description equals source description with safe length handling only at metadata rendering time, not by rewriting stored data.

- [ ] **Step 5: Emit Algolia search records from the same canonical object**

Each NDJSON record contains:
```ts
{
  objectID: product.partNumber,
  partNumber: product.partNumber,
  familyId: product.familyId,
  title: product.title,
  salesDescription: product.shortDescription,
  category: product.category,
  categorySlug: product.categorySlug,
  specifications: product.specifications,
  specificationSearchText: Object.entries(product.specifications).map(([k,v]) => `${k} ${v}`).join(" "),
  drawingStatus,
  imageUrl,
  canonicalPath,
}
```

- [ ] **Step 6: Verify generated artifacts**

`tests/rxl/catalog-generated.test.ts` now also loads committed runtime files and asserts 10,906 total records, 0 duplicate SKUs, exact category counts, 12 description fallbacks, and 0 `representative` source records.

- [ ] **Step 7: Commit generated public runtime data and build tooling**

The original Excel and temporary work directory remain excluded.

```bash
git add scripts/rxl/catalog/build-runtime.ts tests/rxl/catalog-media.test.ts tests/rxl/catalog-generated.test.ts lib/rxl/data/generated/catalog
git commit -m "feat: generate verified RXL runtime catalog"
```

---

### Task 6: Real Local Catalog Provider and Exact PDP Lookup

**Files:**
- Create: `lib/rxl/catalog/generated.ts`
- Create: `lib/rxl/catalog/local-search.ts`
- Modify: `lib/rxl/providers/catalog.ts`
- Modify: `app/(marketing)/products/[category]/[sku]/page.tsx`
- Test: `tests/rxl/catalog-local-search.test.ts`
- Modify: `tests/rxl/catalog.test.ts`

**Interfaces:**
- Produces: `getRealProductBySku(sku)`, `listRealProducts()`, `searchLocalCatalog(input)`, `getFamilyProducts(familyId)`.
- Consumed by: Tasks 7-10.

- [ ] **Step 1: Write RED tests for exact lookup and family grouping**

```ts
it("resolves an exact Odoo SKU without Algolia", async () => {
  const product = await catalogProvider.getProductByPartNumber("RXL-5550-BK422432S");
  expect(product?.partNumber).toBe("RXL-5550-BK422432S");
  expect(product?.source).toBe("odoo");
});

it("groups ordinary browse by family but not exact SKU queries", async () => {
  const browse = await searchLocalCatalog({ query: "Nemesis Cabinet", filters: {}, sort: "relevance", page: 1, perPage: 12 });
  expect(browse.items.filter((item) => item.familyId === "RXL-5550")).toHaveLength(1);
  const exact = await searchLocalCatalog({ query: "RXL-5550-BK422432S", filters: {}, sort: "relevance", page: 1, perPage: 12 });
  expect(exact.items[0].partNumber).toBe("RXL-5550-BK422432S");
});
```

- [ ] **Step 2: Run RED**

```bash
npm test -- tests/rxl/catalog-local-search.test.ts tests/rxl/catalog.test.ts
```

- [ ] **Step 3: Implement server-only generated loader**

Build one module-level `Map<string, Product>` from the five static JSON imports. `sku-index.json` is used for audit/debugging and may be used to avoid unnecessary partition scans, but no generated artifact is fetched from the browser.

- [ ] **Step 4: Implement local grouped search**

Behavior:
- Exact case-insensitive SKU match bypasses family grouping and ranks first.
- General browse/search groups by `familyId`; representative item is deterministic: lexicographically lowest matching part number after filters.
- `variantCount` equals number of matching variants in that family under current filters.
- Facets are generated from actual `specifications` in the current candidate set plus category/family.
- Filter matching is exact per facet value; unrelated facets disappear when no result exposes them.
- Remove representative lead-time sort/filter from real-catalog mode.

- [ ] **Step 5: Switch public provider to real catalog only**

`lib/rxl/providers/catalog.ts` must stop concatenating `VERIFIED_PRODUCTS` and `PRODUCTS` into public results. Keep representative fixtures imported only by tests/Lab if needed.

- [ ] **Step 6: Make PDP related lookup family-aware**

Instead of calling `listProducts()` and scanning all 10,906 records, call `getFamilyProducts(product.familyId)` and choose up to three sibling SKUs different from the current SKU.

- [ ] **Step 7: Verify focused tests and build-size safety**

```bash
npm test -- tests/rxl/catalog-local-search.test.ts tests/rxl/catalog.test.ts tests/rxl/route-regression.test.ts
npm run typecheck
```
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add lib/rxl/catalog/generated.ts lib/rxl/catalog/local-search.ts lib/rxl/providers/catalog.ts app/'(marketing)'/products/'[category]'/'[sku]'/page.tsx tests/rxl/catalog-local-search.test.ts tests/rxl/catalog.test.ts
git commit -m "feat: serve real RXL catalog locally"
```

---

### Task 7: Guarded Algolia Index Writer and Search Adapter

**Files:**
- Create: `scripts/rxl/catalog/push-algolia.ts`
- Create: `lib/rxl/catalog/algolia-search.ts`
- Create: `tests/rxl/catalog-algolia.test.ts`
- Modify: `lib/rxl/providers/catalog.ts`
- Modify: `lib/rxl/algolia/experience.ts`

**Interfaces:**
- Produces: `searchAlgoliaCatalog(input)`, guarded index writer.
- Requires runtime env: `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`, `ALGOLIA_INDEX_NAME`.
- Requires write-only execution env: `ALGOLIA_ADMIN_API_KEY`.

- [ ] **Step 1: Write RED tests for identity guard**

```ts
expect(() => assertAlgoliaWriteTarget({ frontendAppId: "QVGC9APPPY", writeAppId: "WRONG" })).toThrow(/application id mismatch/i);
expect(() => assertAlgoliaWriteTarget({ frontendAppId: "QVGC9APPPY", writeAppId: "QVGC9APPPY" })).not.toThrow();
```

Also mock Algolia search failure and assert provider falls back to `searchLocalCatalog()`.

- [ ] **Step 2: Run RED**

```bash
npm test -- tests/rxl/catalog-algolia.test.ts
```

- [ ] **Step 3: Centralize frontend identity**

`lib/rxl/algolia/experience.ts` uses:
```ts
export const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "QVGC9APPPY";
export const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME ?? "rxl_products";
```

Do not expose the Admin key.

- [ ] **Step 4: Implement write guard before any network mutation**

`push-algolia.ts` must exit before making an HTTP request unless:
```ts
process.env.ALGOLIA_APP_ID === (process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "QVGC9APPPY")
```
and for the first rollout that resolved value is exactly `QVGC9APPPY`.

If `ALGOLIA_ADMIN_API_KEY` is absent, exit with:
`ALGOLIA_ADMIN_API_KEY is required in the secure execution environment; do not paste it into source or chat.`

- [ ] **Step 5: Configure index settings through Algolia REST API**

Set:
```json
{
  "attributeForDistinct": "familyId",
  "distinct": 1,
  "searchableAttributes": ["partNumber", "familyId", "title", "salesDescription", "specificationSearchText"],
  "attributesForFaceting": ["searchable(categorySlug)", "searchable(familyId)"]
}
```

Append every discovered specification key from the generated dataset as `searchable(specifications.<key>)`, sorted deterministically, de-duplicated. Never hand-maintain a partial facet list.

- [ ] **Step 6: Upload records in bounded batches**

Read `algolia-records.ndjson`; send `addObject`/`updateObject` batch actions in chunks of 500; wait for Algolia task completion after settings and after all batches. Verify record count is 10,906 before reporting success.

- [ ] **Step 7: Implement Algolia read adapter**

For normal queries, POST to the Algolia search endpoint with `distinct=1`, dynamic facet filters, `facets=["*"]`, page/perPage. For an exact SKU that exists in the local SKU map, return exact local product immediately rather than allowing distinct logic to hide it.

On timeout, 429, 5xx, invalid payload, or missing public credentials, fall back to `searchLocalCatalog()` and mark response source `local-fallback` for Preview analytics/debugging.

- [ ] **Step 8: Verify tests**

```bash
npm test -- tests/rxl/catalog-algolia.test.ts tests/rxl/catalog-local-search.test.ts
npm run typecheck
```

- [ ] **Step 9: Commit code before executing the write**

```bash
git add scripts/rxl/catalog/push-algolia.ts lib/rxl/catalog/algolia-search.ts lib/rxl/providers/catalog.ts lib/rxl/algolia/experience.ts tests/rxl/catalog-algolia.test.ts
git commit -m "feat: add guarded Algolia catalog indexing"
```

- [ ] **Step 10: Execute Algolia write only after secure credential/app identity is confirmed**

```bash
ALGOLIA_APP_ID=QVGC9APPPY NEXT_PUBLIC_ALGOLIA_APP_ID=QVGC9APPPY ALGOLIA_INDEX_NAME=rxl_products ALGOLIA_ADMIN_API_KEY="$ALGOLIA_ADMIN_API_KEY" npm run catalog:push-algolia -- --records "$PWD/lib/rxl/data/generated/catalog/algolia-records.ndjson"
```

Expected report: index `rxl_products`, 10,906 records, task complete. If secure write access is not available, stop the release at this gate; do not substitute a different Algolia app.

---

### Task 8: Server Search API and Dynamic Catalog UI

**Files:**
- Create: `app/api/catalog/search/route.ts`
- Modify: `components/rxl/catalog/CatalogBrowser.tsx`
- Modify: `components/rxl/catalog/FacetPanel.tsx`
- Modify: `app/(marketing)/products/page.tsx`
- Modify: `app/(marketing)/products/[category]/page.tsx`
- Create: `tests/rxl/catalog-search-route.test.ts`
- Modify: `tests/rxl/catalog-browser.test.tsx`

**Interfaces:**
- API: `GET /api/catalog/search?q=&category=&page=1&sort=relevance&filter.<facet>=value` returns `{ items, total, page, pages, facets, source }`.

- [ ] **Step 1: Add RED route tests**

Test exact SKU, grouped family query, category filtering, invalid page, and local fallback source.

- [ ] **Step 2: Add RED browser test proving it no longer needs all 10,906 products as props**

The component contract becomes:
```ts
<CatalogBrowser initialResult={result} initialQuery="" initialCategory={undefined} />
```
not `products={allProducts}`.

- [ ] **Step 3: Run RED**

```bash
npm test -- tests/rxl/catalog-search-route.test.ts tests/rxl/catalog-browser.test.tsx
```

- [ ] **Step 4: Implement search route validation**

Clamp `page >= 1`, `perPage = 12`, allow only known sort values, cap query length at 120 characters, parse dynamic facet filters without allowing arbitrary prototype keys (`__proto__`, `constructor`, `prototype`). Return 400 for invalid parameters rather than throwing 500.

- [ ] **Step 5: Refactor CatalogBrowser to API-driven search**

- Initial results are server-rendered.
- Search/filter/sort/page updates call `/api/catalog/search`.
- Debounce text input 200 ms.
- Abort prior in-flight request with `AbortController`.
- Keep previous results visible while loading and expose an accessible loading status.
- Typeahead comes from current API results; do not scan a 10K client-side array.
- Replace copy `Representative catalog` with `RXL product catalog`.
- Replace `Preview data only` with source-accurate wording that does not claim live inventory/pricing.

- [ ] **Step 6: Make facets dynamic**

`FacetPanel` renders the returned facet groups and counts. It does not assume the old fixed keys `rackUnits`, `width`, `material`, `leadTime`.

- [ ] **Step 7: Verify**

```bash
npm test -- tests/rxl/catalog-search-route.test.ts tests/rxl/catalog-browser.test.tsx
npm run typecheck
```

- [ ] **Step 8: Commit**

```bash
git add app/api/catalog/search/route.ts components/rxl/catalog/CatalogBrowser.tsx components/rxl/catalog/FacetPanel.tsx app/'(marketing)'/products/page.tsx app/'(marketing)'/products/'[category]'/page.tsx tests/rxl/catalog-search-route.test.ts tests/rxl/catalog-browser.test.tsx
git commit -m "feat: drive Solutions from real catalog search"
```

---

### Task 9: Real Product Media, Cards, PDP Copy, and Conversion Preservation

**Files:**
- Modify: `components/rxl/catalog/ProductCard.tsx`
- Modify: `components/rxl/product/ProductPageView.tsx`
- Modify: `app/rxl-catalog.css`
- Modify: `app/rxl-product.css`
- Modify: `tests/rxl/product-card.test.tsx`
- Modify: `tests/rxl/drawing-thumbnail.test.tsx`
- Modify: RFQ/configurator regression tests that assert part-number carry-through.

**Interfaces:**
- Consumes: real `Product` records from Tasks 5-8.

- [ ] **Step 1: Write RED card tests**

For `source: "odoo"`:
- official `media[0]` wins over drawing;
- live drawing wins when media is empty;
- stale/missing drawing uses RXL-branded fallback with part number/family text;
- no Unsplash URL may render;
- family browse card displays `variantCount` when > 1.

- [ ] **Step 2: Write RED PDP source-copy tests**

Assert PDP renders exact `shortDescription`, exact specification keys/values, live drawing document action only when href is non-null, and does not show `Representative` badge/copy for Odoo records.

- [ ] **Step 3: Run RED**

```bash
npm test -- tests/rxl/product-card.test.tsx tests/rxl/drawing-thumbnail.test.tsx tests/rxl/product-page.test.tsx
```

- [ ] **Step 4: Remove stock imagery path for real products**

Keep `representativeMedia` only for isolated representative fixtures if tests/Lab still need them. Real Odoo fallback is a CSS/markup RXL fallback, not an external image.

- [ ] **Step 5: Render source description/specs cleanly**

Do not append generated marketing prose. Preserve line breaks where Odoo descriptions include them; escape/render as text, never raw HTML.

- [ ] **Step 6: Preserve exact SKU in conversion URLs**

Card/PDP quote link:
```ts
`/rfq?part=${encodeURIComponent(product.partNumber)}`
```
Configurator link/default must contain the same exact part number.

- [ ] **Step 7: Verify focused regressions**

```bash
npm test -- tests/rxl/product-card.test.tsx tests/rxl/drawing-thumbnail.test.tsx tests/rxl/drawing-pdp-regression.test.ts tests/rxl/quick-quote-form.test.tsx tests/rxl/configurator-reducer.test.ts
```
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add components/rxl/catalog/ProductCard.tsx components/rxl/product/ProductPageView.tsx app/rxl-catalog.css app/rxl-product.css tests/rxl
git commit -m "feat: render real RXL product media and copy"
```

---

### Task 10: Import Report, Diff Safety, and Release Gate

**Files:**
- Create: `scripts/rxl/catalog/report.ts`
- Modify: `tests/rxl/catalog-generated.test.ts`
- Modify: `.github/workflows/rxl-feature-gate.yml` only to verify committed generated artifacts; do not make CI fetch the Excel or 4,068 PDFs.
- Modify: PR #1 description after successful execution.

**Interfaces:**
- Produces: `import-report.json` + human-readable console summary and previous-version diff.

- [ ] **Step 1: Write RED report tests**

Given previous/current manifest fixtures, assert report includes added/changed/removed SKUs, drawing state changes, image changes, and exact current totals.

- [ ] **Step 2: Implement report output**

Current-source success output must include:
```text
SKUs normalized:          10,906
Descriptions from Odoo:   10,894
Description fallbacks:        12
SKUs with drawing URL:    10,615
SKUs without drawing URL:    291
Unique drawing URLs:       4,068
Drawings live:                  <computed>
Drawings stale/invalid:         <computed>
Official images matched:        <computed>
Duplicate part numbers:         0
Normalization errors:           0
```

Do not hardcode live/stale/image result counts; derive them from artifacts.

- [ ] **Step 3: Add committed-artifact CI verification**

The normal feature gate runs a test that validates `manifest.json`, partition totals, SKU uniqueness, description fallback count, and that every `drawingStatus: live` record references an entry marked live in `drawing-validation.json`. It must not need `Odoo Export.xlsx` or network access.

- [ ] **Step 4: Run complete local gate**

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
Expected: all green.

- [ ] **Step 5: Verify Algolia after write**

Required checks against app `QVGC9APPPY`, index `rxl_products`:
- record count 10,906;
- exact search `RXL-5550-BK422432S` returns that objectID;
- family query `RXL-5550` returns grouped family behavior;
- a category/facet query returns only compatible records;
- index settings show `attributeForDistinct: familyId`.

- [ ] **Step 6: Deploy Preview and smoke QA**

Verify on the feature alias:
- `/products` loads real catalog wording and grouped real products;
- exact SKU search opens exact PDP;
- sample one SKU from each of the five categories;
- product with official image;
- product with live drawing/no image;
- product with stale/missing drawing;
- RFQ retains exact SKU;
- configurator retains exact SKU;
- mobile and desktop catalog layouts;
- drawing preview stays bounded;
- no representative product appears in public real search.

- [ ] **Step 7: Verify GitHub Actions and Vercel deployment state**

Do not claim completion until the exact final feature SHA has a successful `RXL Feature Gate` run and the matching Vercel Preview is `READY`.

- [ ] **Step 8: Update PR #1 release report**

Replace provisional catalog notes with final computed import report, Algolia record/index verification, final SHA, CI run, Vercel deployment ID, and remaining deliberately disconnected integrations.

- [ ] **Step 9: Commit final report/workflow changes**

```bash
git add scripts/rxl/catalog/report.ts lib/rxl/data/generated/catalog/import-report.json tests/rxl/catalog-generated.test.ts .github/workflows/rxl-feature-gate.yml
git commit -m "chore: gate real RXL catalog release"
```

- [ ] **Step 10: Stop before `main`**

Present the final Preview + import report to the user. Merge PR #1 only after explicit approval of that Preview/release state.

---

## Plan Self-Review

### Spec coverage
- Odoo source truth, exact SKU/title/description: Tasks 1-3, 5.
- 12-description fallback: Tasks 2, 3, 5, 10.
- continuation Variant Values: Tasks 2-3.
- five category mapping: Tasks 1-3.
- official image -> drawing -> fallback: Tasks 4-5, 9.
- drawing dedupe/validation/stale behavior: Tasks 4-5, 9-10.
- 10,906 individual SKU identity + family browse: Tasks 5-8.
- Algolia relevance/distinct/facets + app identity guard: Task 7.
- local fallback / PDP without Algolia: Tasks 6-8.
- no 10K static-generation requirement: Tasks 6 and existing dynamic route preserved in 9.
- RFQ/configurator SKU preservation: Task 9.
- import diff/report: Task 10.
- security/no admin key/no Excel commit: Tasks 2-3, 7, global constraints.
- final CI/Vercel/Preview gate before main: Task 10.

### Type consistency
- Canonical `familyId`, `source`, `variantCount` introduced in Task 1 and used consistently in Tasks 5-9.
- Intermediate import records are distinct from runtime records so `drawingStatus` is never falsely marked before Task 4 validation.
- Algolia records are derived only from runtime records from Task 5.
- Search provider returns one shared catalog result shape to both Algolia and local fallback.

### Placeholder scan
The plan contains no implementation `TODO`/`TBD` placeholders. Values that are genuinely discovered outputs (`Drawings live`, `stale/invalid`, `Official images matched`) are explicitly computed rather than predetermined.
