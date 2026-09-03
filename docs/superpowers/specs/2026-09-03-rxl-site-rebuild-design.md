# RXL USA Site Rebuild — Design Specification

Date: 2026-09-03
Branch: `feature/rxl-site-rebuild`
Status: Proposed design for implementation approval

## 1. Goal

Rebuild the existing `vercel-learning-lab` frontend into a faithful, production-grade RXL USA website using the supplied RXL prototype, product-page mockup, build specification, content-pack/page-map, photography brief, architecture diagrams, and visitor-journey/site-map diagrams as the design and behavior sources of truth.

The result must look and behave like the approved RXL concept while remaining a real Next.js application rather than a pasted single-file prototype.

The first implementation target is a Vercel Preview from this feature branch. `main` and the current public Production deployment remain untouched until visual, functional, accessibility, and regression QA pass.

## 2. Source precedence

When supplied artifacts disagree, implementation follows this order:

1. **Latest RXL base prototype (`rxl-mockup (1) (2).html`)** — global visual language, shell, navigation, home, catalog interaction, configurator interaction, careers, portal, employee hub, analytics behavior, responsive rules.
2. **Rev26 product-page mockup** — overrides the generic product-detail treatment for the production-style PDP.
3. **RXL PDP Content Pack and Page Map** — authoritative field inventory and content placement for products.
4. **RXL Website Build Spec v1.1** — architecture, sitemap, ownership, integration boundaries, analytics, SEO, accessibility, build phases, and launch requirements.
5. **Photography Shot Brief / Hero Film Brief** — image slots, crops, aspect ratios, safe areas, and eventual real-asset replacement plan.
6. **Architecture / Visitor Journey / Site Map diagrams** — system and funnel reference.

Prototype-only labels, sample commercial facts, representative product data, fake availability, sample jobs, placeholder social URLs, and simulated authentication are not treated as verified RXL business data.

## 3. Existing baseline

The repository currently runs Next.js 16.3.4, React 19, TypeScript, ESLint, and Vercel. Quality scripts already enforce lint, typecheck, and production build. The current application is concentrated in a catch-all page plus a small interactive component layer.

The rebuild will preserve:

- Next.js App Router and TypeScript.
- Existing Vercel Git workflow: feature branches -> Preview, `main` -> Production.
- Existing security headers and hardened form/API patterns where they remain applicable.
- Existing hidden/noindex technical Lab, but it will be visually separated from the public RXL experience.
- Existing lint/typecheck/build gates.

The rebuild will replace the current Learning Lab public brand, information architecture, page presentation, and placeholder industrial products with the RXL experience.

## 4. Design system

### Brand language

The coded design system will reproduce the prototype tokens rather than approximate them visually.

Core palette:

- Navy 950 `#04091a`
- Navy 900 `#081436`
- Navy 800 `#0d2158`
- Navy 700 `#12307e`
- Blue 600 `#1b45d7`
- Blue 500 `#2b5ce6`
- Blue 400 `#4a7bf7`
- Blue 300 `#8fb0ff`
- Gray 50 `#f2f4f7`
- Gray 100 `#e8ecf2`
- Gray 200 `#d7dee9`
- Gray 300 `#b9c4d4`
- Ink `#0c1524`
- Muted `#5a6b85`
- Success `#159c6b`
- Warning `#c9860a`
- Error `#c0392b`

Typography:

- Display: Barlow Semi Condensed
- Body: Inter
- Technical/part numbers: JetBrains Mono

Spacing, radius, elevation, focus states, reduced motion, responsive breakpoints, button variants, card behavior, and sticky elements will be ported from the supplied prototype into reusable components/tokens.

### Asset strategy

The RXL vector wordmark from the supplied prototype is used for the coded logo.

Until verified RXL photography is supplied, visual slots use clearly representative assets or generated/abstract industrial artwork with correct dimensions/crops. The app structure must make replacement with shot-brief assets trivial.

No sensitive or unrelated files from source packages are committed. In particular, accidental invoices or billing documents are excluded.

## 5. Public information architecture

The Preview will implement the RXL sitemap as real Next.js routes:

- `/` — Home
- `/about` — Capabilities/company overview
- `/about/team` — Leadership placeholder structure, only if supported content is available
- `/industries` — Industries overview
- `/industries/[slug]` — Industry detail template
- `/products` — Catalog landing / all solutions
- `/products/[category]` — Category catalog with facets
- `/products/[category]/[sku]` — production-style PDP
- `/search` — catalog search route
- `/configurator` — guided configuration experience
- `/resources` — document/resource index
- `/news` — case studies / insight index
- `/news/[slug]` — article detail
- `/careers` — careers shell and sample/adapter-driven jobs
- `/careers/[job]` — job detail
- `/contact` — RXL contact experience
- `/customer-portal` — Epicor handoff interstitial
- `/employees` — employee-hub shell / authentication boundary
- `/legal/privacy`
- `/legal/terms`

Existing legacy RXL-style paths and the current technical paths will receive explicit redirects or isolated handling rather than silently disappearing.

`/lab` remains available for engineering/QA only and stays `noindex`.

## 6. Global shell

### Header

Desktop:

- RXL wordmark.
- Primary navigation using the RXL labels and hierarchy.
- Product/Solutions mega menu.
- Phone CTA only when the business value is verified; otherwise a clearly configured placeholder is not exposed as factual production data.
- Primary `Start Project` CTA -> configurator.
- Persistent portal access.

Mobile:

- Accessible menu button with expanded state.
- Full touch targets >= 44px.
- Customer Portal and Employee Login shortcuts.
- Call/Start Project actions only when valid destinations exist.

### Footer

- RXL wordmark.
- Configurable address, phone, and email fields.
- Capabilities, Solutions, Careers, Case Studies, Portal, Employees, Contact, Privacy, Terms.
- Social controls render only for verified URLs; prototype placeholders do not ship as links.

## 7. Home page

Reproduce the base prototype structure and tone:

- Dark RXL hero with display typography and strong Start Project CTA.
- Hero visual/film slot based on the photography and 22-second hero-film brief.
- Capabilities / integrated-delivery narrative.
- Featured solution families.
- Workflow / project-delivery sequence.
- Value/capability columns.
- Case-study/credibility blocks where supported.
- Strong configurator conversion CTA.

The home must feel like an engineered infrastructure company, not the current generic Learning Lab.

## 8. Catalog and search

### Preview data source

Create a typed catalog repository/adaptor using local representative RXL data for Preview. Component code must not depend directly on hard-coded arrays so Sanity/Algolia can replace the adapter later.

### Catalog behavior

Port the prototype behavior:

- Search by title, part number, series, and useful text fields.
- Typeahead after meaningful input.
- Faceted filtering with live counts.
- Applied-filter chips and clear-all.
- Sort controls.
- Pagination.
- Empty states.
- Category route state.
- Keyboard-accessible product cards.
- Mobile filter treatment.

For the local Preview, search/filter executes in-app. The API boundary is designed to map to Algolia InstantSearch later without rewriting page composition.

## 9. Product Detail Page

The Rev26 PDP is the visual/interaction authority.

### PDP structure

Above fold:

- Breadcrumbs.
- Product media gallery with thumbnails.
- Series/category, title, exact part number/SKU.
- Short description.
- Verified availability/lead-time fields only when present in the data model.
- Finish/options summary where applicable.
- Primary Configure / Start Project / Request Quote action.
- Secondary document/download actions.

Below fold tabs/sections:

- Specifications.
- Description.
- What Is Included / components / BOM.
- Documents.
- Compliance.
- CAD / drawings (DWG, STEP, Revit or other available formats).
- Applications.
- Related products and accessories.

### Product model

The typed model mirrors the PDP Content Pack:

- Identity.
- Copy.
- Specifications.
- Images/gallery.
- CAD/drawings.
- Documents.
- Components/BOM.
- Related/accessories.
- Configurator data.
- SEO.

`partNumber` is treated as a stable key from day one so future Epicor integration does not require a model rewrite.

No fake pricing or live Epicor inventory is introduced.

## 10. Configurator

Build the five-step prototype as React/Next.js, preserving business logic separately from presentation.

Preview flow:

1. Application/use case.
2. Product line.
3. Required configuration options.
4. Accessories/add-ons.
5. Contact/project context and submit.

Persistent side summary on large screens, inline summary on small screens.

Structured submission shape includes:

- contact name, company, email, phone, location when requested;
- selected application and product line;
- configuration selections;
- selected accessories;
- derived part numbers;
- quantity and target timeline;
- notes;
- attribution/session data;
- generated quote reference;
- routing placeholder/adaptor field.

The first Preview does not pretend Resend, CRM, territory routing, or Epicor is connected. Submission is safely acknowledged through the existing hardened API pattern and clearly identified as non-production routing until integrations are supplied.

## 11. Careers

The public page uses the RXL careers styling and remains ATS-ready.

For Preview:

- Use representative/sample role records only.
- Clearly avoid presenting demo records as verified live openings.
- Job list and job-detail UI are componentized behind a jobs provider.
- Apply CTA can open an integration placeholder or supported external URL; it must not fake application storage.

Future ATS adapter target: JazzHR, Breezy HR, Workable, or whichever RXL selects.

Switching ATS must be configuration/provider work rather than a page rebuild.

## 12. Customer Portal and Employee Hub

### Customer Portal

Implement the branded interstitial from the prototype. It explains the handoff and tracks the click. The actual Epicor destination remains configuration-driven and disabled/clearly non-live until RXL supplies the verified endpoint.

No customer credentials are collected or stored by this website.

### Employee Hub

Implement the RXL launchpad shell for:

- HR/SharePoint.
- Epicor.
- IT support.
- Safety/training.
- Timesheets/payroll.
- Drawing/document systems.

The Preview must not simulate a successful real login as if Entra ID were connected. Instead it presents the intended Microsoft sign-in boundary and a safe demo state that is visibly Preview-only.

Real Production authentication is Microsoft Entra ID against the RXL tenant/security group when credentials/configuration are supplied.

## 13. Resources, news, industries, about and contact

These pages reuse the same RXL design system and content adapters.

- Resources support categorized spec sheets, manuals, certificates, CAD/drawings.
- News supports Case Study, Engineering, and News article types.
- Industries expose relevant solution families and applications.
- About focuses on RXL capabilities, fabrication, engineering, installation, and project ownership.
- Contact uses the hardened form approach already present in the repo.

All copy that comes from representative prototype data remains separable from verified RXL production content.

## 14. Analytics architecture

Build an internal analytics abstraction that maps the supplied event specification one-to-one:

- `page_view`
- `catalog_search`
- `product_view`
- `filter_applied`
- `spec_sheet_download`
- `configurator_start`
- `configurator_step`
- `configurator_abandon`
- `quote_submit`
- `contact_submit`
- `phone_click`
- `email_click`
- `careers_apply_click`
- `portal_click`

Capture first-landing UTM source/medium/campaign and persist attribution through the session.

The prototype-style Analytics Inspector is available only in Preview/Development. It is excluded from Production UI.

GA4/GTM/Measurement Protocol and Clarity are adapters/configuration for a later integration phase; the event contract is implemented now so instrumentation does not require rewriting components.

## 15. SEO

Preserve and expand the existing Next.js Metadata foundation:

- Per-page titles and descriptions.
- Canonicals.
- Open Graph.
- Sitemap.
- Robots.
- Product structured data.
- JobPosting structured data for verified jobs only.
- Organization/WebSite structured data.
- Breadcrumb structured data where useful.
- Real 404 responses.
- Redirect map support for future legacy-RXL cutover.

Preview deployments remain protected from indexing.

## 16. Accessibility and responsive behavior

Minimum acceptance:

- Semantic landmarks and heading hierarchy.
- Skip navigation.
- Keyboard-operable mega menu, filters, tabs, dialogs, cards, and configurator.
- Visible `:focus-visible` treatment.
- Escape closes overlays/drawers where appropriate.
- Minimum 44x44 touch targets.
- Labels and errors programmatically associated with controls.
- `aria-live` for form/submission status.
- Reduced-motion support.
- No color-only status communication.
- Tested at 1440, 1024, 768, and 390px design widths plus narrow mobile regression.

## 17. Security and data handling

Preserve current form hardening and security headers.

Public forms retain:

- strict body-size limits;
- field max lengths;
- server-side email validation;
- honeypot;
- idempotency/double-submit protection;
- rate-limit abstraction;
- network/timeout handling;
- no sensitive form-content logging.

Internal tools and analytics inspector remain non-production or protected.

No secrets, tokens, invoices, personal billing data, or RXL employee credentials are committed to the public repository.

## 18. Code architecture

Move away from the monolithic catch-all implementation into focused modules.

Proposed structure:

```text
app/
  (marketing)/
    page.tsx
    about/
    industries/
    products/
    search/
    configurator/
    resources/
    news/
    careers/
    contact/
    customer-portal/
    legal/
  employees/
  lab/
  api/
components/
  rxl/
    layout/
    navigation/
    home/
    catalog/
    product/
    configurator/
    careers/
    content/
    forms/
    analytics/
lib/
  rxl/
    types/
    data/
    providers/
    analytics/
    seo/
    validation/
```

Component boundaries should allow Sanity, Algolia, ATS, Epicor, Entra, Resend/CRM, and analytics providers to be swapped in without changing visual components.

## 19. Integration boundaries

The Preview build implements contracts/adapters but does not silently claim external services are live.

### Implement now

- Next.js/Vercel frontend.
- Local typed content/catalog/jobs providers.
- Search/facet behavior on local data.
- Configurator UI and structured payload.
- Hardened local/API acknowledgement for forms.
- Analytics event abstraction and Preview inspector.
- SEO/accessibility/security.
- RXL visual system.

### Prepare, but do not fake

- Sanity content provider.
- Algolia search provider.
- ATS provider.
- Epicor portal URL/inventory bridge.
- Entra ID authentication.
- Resend/CRM quote routing.
- GA4/GTM/Clarity server/client integration.

Each external connection becomes a separate reviewed change after credentials, ownership, and business rules are confirmed.

## 20. Environment behavior

`main` remains Production.

`feature/rxl-site-rebuild` produces a Vercel Preview.

Preview:

- May show a discreet Preview/demo marker.
- May expose Analytics Inspector.
- Uses representative content and safe integration placeholders.
- Must be `noindex`.

Production after eventual merge:

- No prototype/Preview banners.
- No Analytics Inspector.
- No fake integrations or fake data presented as live.
- Unsafe Lab functionality remains restricted.

## 21. Testing and QA

Every implementation slice must pass:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Before merge to `main`:

### Visual QA

- Home at desktop/tablet/mobile.
- Header/mega-menu/mobile menu.
- Catalog, filters, chips, sort, pagination and empty states.
- PDP gallery/tabs/specs/docs/related products.
- Configurator all five steps and responsive summary.
- Careers/job detail.
- Portal/employee boundaries.
- Footer and legal pages.

### Functional QA

- Real route URLs and 404s.
- Keyboard navigation.
- Form constraints and failure states.
- Quote payload validity.
- Analytics events fire exactly once at intended transitions.
- Attribution survives route changes.
- No unsafe internal controls in Production mode.

### Technical QA

- Security headers.
- robots/sitemap/canonical behavior.
- Lab noindex/protection.
- No console/runtime errors.
- Image sizing and layout stability.
- Core Web Vitals-oriented review for Home, Catalog, PDP.
- No accidental sensitive files in Git diff.

## 22. Delivery sequence

Implementation is intentionally staged so visual review happens early without sacrificing architecture.

1. **Foundation:** route structure, tokens, fonts, RXL shell, header/footer, data/provider contracts.
2. **Home + common content:** RXL home, about, industries, resources/news skeletons.
3. **Catalog:** local product model, search, filters, category pages.
4. **PDP:** Rev26 product page and PDP Content Pack fields.
5. **Configurator:** five-step flow, summary, structured quote payload.
6. **Careers + access points:** careers adapter, portal interstitial, employee hub boundary.
7. **Analytics + SEO + hardening:** event abstraction, Preview inspector, metadata, redirects, accessibility/security regression.
8. **Deep Preview QA:** desktop/tablet/mobile and functional testing.
9. **User approval:** only then merge to `main` for Production.
10. **External integrations:** Sanity, Algolia, ATS, Resend/CRM, Epicor, Entra, GA4/GTM/Clarity as separately approved work.

## 23. Definition of success for this rebuild

The Preview is successful when:

- It is recognizably the supplied RXL design, not the Learning Lab skin.
- The major prototype flows work as real Next.js routes/components.
- The Rev26 PDP is represented faithfully.
- Catalog discovery takes no more than a few interactions on mobile.
- The configurator produces a structured, inspectable quote payload.
- Careers, portal, and employee flows accurately communicate their integration boundaries.
- All demo/representative data is distinguishable from verified live business data.
- Lint, typecheck, build, accessibility and responsive QA pass.
- `main`/Production remain untouched until explicit final approval.

## 24. Explicit non-goals for the first Preview

- No ecommerce checkout or payments.
- No live Epicor pricing/inventory/order history.
- No fake CRM or sales routing.
- No production Entra sign-in without RXL tenant configuration.
- No invented ATS integration.
- No claim that sample jobs are live vacancies.
- No claim that representative product availability/certification data is factual.
- No accidental exposure of technical Lab, secrets, invoices, or billing documents.

This design intentionally gives RXL a high-fidelity, reviewable website first, while keeping the architecture ready for the external systems defined in the build specification.