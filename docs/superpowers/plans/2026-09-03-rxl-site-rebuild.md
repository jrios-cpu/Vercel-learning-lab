# RXL USA Site Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public Vercel Learning Lab experience with a faithful, production-grade RXL USA website while keeping the technical Lab isolated and preserving the existing Git -> Vercel Preview -> Production workflow.

**Architecture:** The rebuild moves the current monolithic catch-all page into focused Next.js App Router routes and reusable RXL components. Public pages consume typed provider interfaces backed by local representative Preview data; those interfaces are intentionally shaped so Sanity, Algolia, ATS, Epicor, Entra, Resend/CRM, and GA4/GTM can be connected later without rewriting presentation components.

**Tech Stack:** Next.js 16.3.4 App Router, React 19, TypeScript 5.9, CSS, Vercel, Vitest + Testing Library for unit/component tests, existing Next.js API routes for hardened form acknowledgement.

**Spec:** `docs/superpowers/specs/2026-09-03-rxl-site-rebuild-design.md`

## Global Constraints

- Work only on branch `feature/rxl-site-rebuild`; do not update `main` until Preview QA is approved.
- Preserve `npm run lint`, `npm run typecheck`, and `npm run build` as mandatory release gates.
- Preserve current security headers and hardened API behavior unless a task explicitly replaces it with stricter behavior.
- Preserve `/lab` as `noindex` engineering-only functionality, visually separated from the public RXL site.
- Latest `rxl-mockup (1) (2).html` is the global visual/UX authority.
- Rev26 PDP mockup overrides the base prototype for product-detail layout and interaction.
- PDP Content Pack/Page Map is the product-field authority.
- Do not present representative products, jobs, addresses, phone numbers, availability, pricing, certifications, or integrations as verified live RXL facts.
- Do not commit invoices, billing material, credentials, tokens, or unrelated package contents.
- External systems are adapters only in this implementation: Sanity, Algolia, ATS, Epicor, Entra, Resend/CRM, GA4/GTM/Clarity are not silently treated as live.
- Preview is `noindex`, may show a discreet Preview marker, and may expose the analytics inspector; Production must not expose Preview/prototype UI.
- Accessibility acceptance includes keyboard operation, visible focus, reduced motion, 44x44 minimum touch targets, associated labels/errors, and `aria-live` for form status.
- Responsive QA widths: 1440, 1024, 768, and 390 CSS pixels, plus a narrow-mobile regression check.

---

## File Structure

The implementation converges on this structure:

```text
app/
  (marketing)/
    layout.tsx
    page.tsx
    about/page.tsx
    about/team/page.tsx
    industries/page.tsx
    industries/[slug]/page.tsx
    products/page.tsx
    products/[category]/page.tsx
    products/[category]/[sku]/page.tsx
    search/page.tsx
    configurator/page.tsx
    resources/page.tsx
    news/page.tsx
    news/[slug]/page.tsx
    careers/page.tsx
    careers/[job]/page.tsx
    contact/page.tsx
    customer-portal/page.tsx
    legal/privacy/page.tsx
    legal/terms/page.tsx
  employees/page.tsx
  lab/...
  api/forms/contact/route.ts
  api/forms/quote/route.ts
  globals.css
  layout.tsx
  not-found.tsx
  robots.ts
  sitemap.ts
components/rxl/
  layout/RxlHeader.tsx
  layout/RxlFooter.tsx
  layout/RxlLogo.tsx
  navigation/MegaMenu.tsx
  home/HomeHero.tsx
  home/DeliveryFlow.tsx
  catalog/CatalogBrowser.tsx
  catalog/ProductCard.tsx
  catalog/FacetPanel.tsx
  product/ProductGallery.tsx
  product/ProductTabs.tsx
  product/ProductDocuments.tsx
  configurator/Configurator.tsx
  configurator/configuratorReducer.ts
  careers/JobList.tsx
  forms/ContactForm.tsx
  analytics/AnalyticsProvider.tsx
  analytics/AnalyticsInspector.tsx
lib/rxl/
  types/catalog.ts
  types/content.ts
  types/jobs.ts
  types/analytics.ts
  data/products.ts
  data/content.ts
  data/jobs.ts
  providers/catalog.ts
  providers/content.ts
  providers/jobs.ts
  analytics/client.ts
  analytics/attribution.ts
  configurator/payload.ts
  seo/metadata.ts
  validation/forms.ts
  site.ts
tests/
  setup.ts
  rxl/...
vitest.config.ts
```

The existing `app/[[...slug]]/page.tsx`, `components/Interactive.tsx`, `lib/data.ts`, and `lib/site.ts` remain in place until their replacement route/component is verified. They are removed only in the final migration task so every intermediate commit stays buildable.

---

### Task 1: Test Harness, RXL Site Configuration, and Shared Types

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `lib/rxl/site.ts`
- Create: `lib/rxl/types/catalog.ts`
- Create: `lib/rxl/types/content.ts`
- Create: `lib/rxl/types/jobs.ts`
- Create: `lib/rxl/types/analytics.ts`
- Create: `tests/rxl/site.test.ts`

**Interfaces:**
- Produces: `RXL_SITE`, `isPreviewEnvironment()`, `Product`, `ProductDocument`, `ProductMedia`, `ProductComponent`, `Job`, `Article`, `Industry`, `AnalyticsEventName`, and `AnalyticsEvent`.
- Later tasks consume these types rather than defining page-local object shapes.

- [ ] **Step 1: Add the test dependencies and scripts**

Update `package.json` so scripts include:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "check": "npm run lint && npm run typecheck && npm run test && next build"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/react": "^16.3.0",
    "jsdom": "^26.1.0",
    "vitest": "^3.2.4"
  }
}
```

Keep every existing dependency/version unless npm resolution proves incompatible.

- [ ] **Step 2: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

Create `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Write failing site-configuration tests**

Create `tests/rxl/site.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { RXL_SITE } from "@/lib/rxl/site";

describe("RXL site configuration", () => {
  it("uses RXL public identity without inventing unverified contact facts", () => {
    expect(RXL_SITE.name).toBe("RXL USA");
    expect(RXL_SITE.primaryCta.href).toBe("/configurator");
    expect(RXL_SITE.contact.phone).toBeNull();
    expect(RXL_SITE.contact.address).toBeNull();
  });
});
```

- [ ] **Step 4: Run the test and verify failure**

Run:

```bash
npm install
npm run test -- tests/rxl/site.test.ts
```

Expected: FAIL because `@/lib/rxl/site` does not exist.

- [ ] **Step 5: Implement the typed site config**

Create `lib/rxl/site.ts` with this public contract:

```ts
export const RXL_SITE = {
  name: "RXL USA",
  description: "Engineered infrastructure solutions for mission-critical environments.",
  productionUrl: "https://vercel-learning-lab.vercel.app",
  primaryCta: { label: "Start Project", href: "/configurator" },
  contact: {
    phone: null as string | null,
    email: null as string | null,
    address: null as string | null,
  },
} as const;

export function isPreviewEnvironment() {
  return process.env.VERCEL_ENV !== "production";
}
```

Define the catalog types around stable `partNumber`, gallery/documents/BOM/configurator/SEO fields from the approved design. Define `Job`, `Article`, `Industry`, and analytics event names once in their respective files.

- [ ] **Step 6: Run unit and repository gates**

Run:

```bash
npm run test -- tests/rxl/site.test.ts
npm run lint
npm run typecheck
```

Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts tests lib/rxl
git commit -m "test: establish RXL typed foundation"
```

---

### Task 2: RXL Design Tokens, Logo, Header, Mega Menu, Mobile Navigation, and Footer

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `components/rxl/layout/RxlLogo.tsx`
- Create: `components/rxl/layout/RxlHeader.tsx`
- Create: `components/rxl/layout/RxlFooter.tsx`
- Create: `components/rxl/navigation/MegaMenu.tsx`
- Create: `tests/rxl/shell.test.tsx`

**Interfaces:**
- Consumes: `RXL_SITE` from Task 1.
- Produces: `<RxlHeader />`, `<RxlFooter />`, `<RxlLogo />`, `<MegaMenu />`, and global RXL token classes used by every public page.

- [ ] **Step 1: Write shell tests first**

Create `tests/rxl/shell.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RxlHeader } from "@/components/rxl/layout/RxlHeader";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("RXL header", () => {
  it("renders RXL navigation and a configurator CTA", () => {
    render(<RxlHeader preview />);
    expect(screen.getByRole("link", { name: /RXL home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Solutions/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Start Project/i })).toHaveAttribute("href", "/configurator");
  });

  it("does not expose unverified phone data", () => {
    render(<RxlHeader preview />);
    expect(screen.queryByRole("link", { name: /call/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the shell test and verify failure**

```bash
npm run test -- tests/rxl/shell.test.tsx
```

Expected: FAIL because RXL shell components do not exist.

- [ ] **Step 3: Port the exact prototype design tokens**

At the top of `app/globals.css`, add the approved variables:

```css
:root {
  --rxl-navy-950: #04091a;
  --rxl-navy-900: #081436;
  --rxl-navy-800: #0d2158;
  --rxl-navy-700: #12307e;
  --rxl-blue-600: #1b45d7;
  --rxl-blue-500: #2b5ce6;
  --rxl-blue-400: #4a7bf7;
  --rxl-blue-300: #8fb0ff;
  --rxl-gray-50: #f2f4f7;
  --rxl-gray-100: #e8ecf2;
  --rxl-gray-200: #d7dee9;
  --rxl-gray-300: #b9c4d4;
  --rxl-ink: #0c1524;
  --rxl-muted: #5a6b85;
  --rxl-ok: #159c6b;
  --rxl-warn: #c9860a;
  --rxl-error: #c0392b;
  --rxl-max-width: 1240px;
  --rxl-header-height: 74px;
}
```

Port the prototype spacing/radius/shadow/focus/reduced-motion rules, keeping selectors scoped with `rxl-` class names where collision with the old UI is possible.

- [ ] **Step 4: Implement shell components**

`RxlLogo.tsx` uses the supplied RXL vector path as an inline SVG with `currentColor`.

`RxlHeader.tsx` must expose this interface:

```tsx
export function RxlHeader({ preview }: { preview: boolean }) { /* ... */ }
```

Desktop nav order:

```ts
[
  ["Capabilities", "/about"],
  ["Solutions", "/products"],
  ["Industries", "/industries"],
  ["Resources", "/resources"],
  ["Case Studies", "/news"],
  ["Careers", "/careers"],
  ["Contact", "/contact"],
]
```

The mega menu must be keyboard-operable with native buttons/links and close on Escape. Mobile navigation must use a button with `aria-expanded` and touch targets >=44px.

- [ ] **Step 5: Replace the public root shell without deleting the old route implementation**

Update `app/layout.tsx` so it retains metadata and skip-navigation behavior, renders the Preview marker only outside Production, and replaces the Learning Lab header/footer with `<RxlHeader />` and `<RxlFooter />`.

Do not alter `/lab` behavior yet; the root shell may visually wrap it until the final migration task isolates the Lab layout.

- [ ] **Step 6: Run tests and gates**

```bash
npm run test -- tests/rxl/shell.test.tsx
npm run lint
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css app/layout.tsx components/rxl tests/rxl/shell.test.tsx
git commit -m "feat: add RXL global shell"
```

---

### Task 3: Local Content Providers and Core Marketing Routes

**Files:**
- Create: `lib/rxl/data/content.ts`
- Create: `lib/rxl/providers/content.ts`
- Create: `components/rxl/home/HomeHero.tsx`
- Create: `components/rxl/home/DeliveryFlow.tsx`
- Create: `app/(marketing)/layout.tsx`
- Create: `app/(marketing)/page.tsx`
- Create: `app/(marketing)/about/page.tsx`
- Create: `app/(marketing)/industries/page.tsx`
- Create: `app/(marketing)/industries/[slug]/page.tsx`
- Create: `app/(marketing)/resources/page.tsx`
- Create: `app/(marketing)/news/page.tsx`
- Create: `app/(marketing)/news/[slug]/page.tsx`
- Create: `app/(marketing)/legal/privacy/page.tsx`
- Create: `app/(marketing)/legal/terms/page.tsx`
- Create: `tests/rxl/content-provider.test.ts`

**Interfaces:**
- Produces: `contentProvider.getHome()`, `contentProvider.listIndustries()`, `contentProvider.getIndustry(slug)`, `contentProvider.listArticles()`, `contentProvider.getArticle(slug)`, and `contentProvider.listResources()`.
- Consumers must not import representative arrays directly.

- [ ] **Step 1: Write failing provider tests**

```ts
import { describe, expect, it } from "vitest";
import { contentProvider } from "@/lib/rxl/providers/content";

describe("contentProvider", () => {
  it("returns a home model with conversion CTA", async () => {
    const home = await contentProvider.getHome();
    expect(home.hero.primaryCta.href).toBe("/configurator");
  });

  it("returns stable article slugs", async () => {
    const articles = await contentProvider.listArticles();
    expect(new Set(articles.map((item) => item.slug)).size).toBe(articles.length);
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/rxl/content-provider.test.ts
```

Expected: FAIL because the provider does not exist.

- [ ] **Step 3: Implement provider-backed representative content**

`lib/rxl/providers/content.ts` exports:

```ts
export interface ContentProvider {
  getHome(): Promise<HomeContent>;
  listIndustries(): Promise<Industry[]>;
  getIndustry(slug: string): Promise<Industry | null>;
  listArticles(): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | null>;
  listResources(): Promise<ResourceRecord[]>;
}

export const contentProvider: ContentProvider = localContentProvider;
```

Representative copy must stay clearly Preview-safe and avoid unsupported commercial claims.

- [ ] **Step 4: Build the Home page from the supplied prototype**

`app/(marketing)/page.tsx` composes:

```tsx
<HomeHero />
<CapabilitiesSection />
<SolutionFamilies />
<DeliveryFlow />
<ValueColumns />
<CaseStudyTeasers />
<StartProjectBand />
```

The hero uses a swappable media slot sized from the photography brief; use abstract/generated industrial artwork until verified RXL photography is available.

- [ ] **Step 5: Build the remaining core marketing routes**

Use shared section, card, breadcrumb, and page-hero patterns. `notFound()` must be used for unknown industry/article slugs. Legal pages must state only project-safe generic policy/terms placeholder copy and carry a visible Preview/demo qualifier until RXL legal text is supplied.

- [ ] **Step 6: Run provider tests and build gates**

```bash
npm run test -- tests/rxl/content-provider.test.ts
npm run lint
npm run typecheck
npm run build
```

Expected: PASS with static/dynamic route generation succeeding.

- [ ] **Step 7: Commit**

```bash
git add app/'(marketing)' components/rxl/home lib/rxl/data/content.ts lib/rxl/providers/content.ts tests/rxl/content-provider.test.ts
git commit -m "feat: build RXL marketing experience"
```

---

### Task 4: Catalog Provider, Search, Facets, Chips, Sorting, and Pagination

**Files:**
- Create: `lib/rxl/data/products.ts`
- Create: `lib/rxl/providers/catalog.ts`
- Create: `components/rxl/catalog/ProductCard.tsx`
- Create: `components/rxl/catalog/FacetPanel.tsx`
- Create: `components/rxl/catalog/CatalogBrowser.tsx`
- Create: `app/(marketing)/products/page.tsx`
- Create: `app/(marketing)/products/[category]/page.tsx`
- Create: `app/(marketing)/search/page.tsx`
- Create: `tests/rxl/catalog-provider.test.ts`
- Create: `tests/rxl/catalog-browser.test.tsx`

**Interfaces:**
- Produces: `catalogProvider.listProducts()`, `catalogProvider.getProductByPartNumber()`, `catalogProvider.search(input)`, `CatalogSearchInput`, and `CatalogSearchResult`.
- Product cards link to `/products/{category}/{encoded partNumber}`.

- [ ] **Step 1: Define a failing provider search test**

```ts
it("searches title, part number, and series", async () => {
  const byPart = await catalogProvider.search({ query: "RXL-", filters: {}, sort: "relevance", page: 1, perPage: 12 });
  expect(byPart.items.length).toBeGreaterThan(0);
  expect(byPart.total).toBeGreaterThan(0);
});
```

Add another test asserting facet counts are calculated from the filtered result set rather than static totals.

- [ ] **Step 2: Verify provider tests fail**

```bash
npm run test -- tests/rxl/catalog-provider.test.ts
```

Expected: FAIL because the provider does not exist.

- [ ] **Step 3: Implement the local catalog provider**

Use this public shape:

```ts
export type CatalogSearchInput = {
  query: string;
  category?: string;
  filters: Record<string, string[]>;
  sort: "relevance" | "az" | "part" | "availability";
  page: number;
  perPage: number;
};

export type CatalogSearchResult = {
  items: Product[];
  total: number;
  page: number;
  pages: number;
  facetCounts: Record<string, Record<string, number>>;
};
```

Search title, `partNumber`, series, short description, applications, and category. Do not add live pricing/inventory fields.

- [ ] **Step 4: Write the failing CatalogBrowser interaction test**

```tsx
it("filters and clears catalog state", async () => {
  render(<CatalogBrowser initial={fixtureResult} />);
  await userEvent.click(screen.getByLabelText(/Cabinets/i));
  expect(screen.getByRole("button", { name: /Cabinets.*remove/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /Clear all/i }));
  expect(screen.queryByRole("button", { name: /Cabinets.*remove/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 5: Implement the responsive CatalogBrowser**

Port prototype behavior: typeahead at >=2 characters, live facet counts, applied chips, clear-all, sort, pagination, empty state, keyboard-operable cards, and mobile filter disclosure.

All state changes call `trackAnalytics()` with `catalog_search` or `filter_applied`; the function is a no-op adapter until Task 10.

- [ ] **Step 6: Wire `/products`, category routes, and `/search`**

Pages read URL query parameters as the serializable source of truth where practical so filters/search can be shared/bookmarked. Category pages constrain `category` before applying other facets.

- [ ] **Step 7: Run focused and repository gates**

```bash
npm run test -- tests/rxl/catalog-provider.test.ts tests/rxl/catalog-browser.test.tsx
npm run lint
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add app/'(marketing)'/products app/'(marketing)'/search components/rxl/catalog lib/rxl/data/products.ts lib/rxl/providers/catalog.ts tests/rxl/catalog*
git commit -m "feat: add RXL searchable catalog"
```

---

### Task 5: Rev26 Production-Style Product Detail Page

**Files:**
- Create: `components/rxl/product/ProductGallery.tsx`
- Create: `components/rxl/product/ProductTabs.tsx`
- Create: `components/rxl/product/ProductDocuments.tsx`
- Create: `components/rxl/product/ProductRelated.tsx`
- Create: `app/(marketing)/products/[category]/[sku]/page.tsx`
- Create: `tests/rxl/product-page.test.tsx`

**Interfaces:**
- Consumes: `Product` and `catalogProvider` from Tasks 1/4.
- Produces: Rev26-faithful PDP UI; CTA carries `partNumber`/product context into `/configurator`.

- [ ] **Step 1: Write failing PDP semantics test**

```tsx
it("shows identity, specifications, documents, and configure CTA", () => {
  render(<ProductPageView product={productFixture} />);
  expect(screen.getByRole("heading", { name: productFixture.title })).toBeInTheDocument();
  expect(screen.getByText(productFixture.partNumber)).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /Specifications/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Configure|Start Project/i })).toHaveAttribute("href", expect.stringContaining(productFixture.partNumber));
});
```

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/rxl/product-page.test.tsx
```

Expected: FAIL because the PDP components do not exist.

- [ ] **Step 3: Implement media gallery and above-fold buy box**

Match Rev26 hierarchy: breadcrumb, large media, thumbnails, series/category, title, exact part number, summary, option/finish summary, verified-only status fields, primary configurator CTA, secondary document actions.

The gallery buttons require `aria-label="View image N"`; selected thumb uses `aria-current="true"`.

- [ ] **Step 4: Implement accessible tabs/sections**

Tabs include:

```ts
[
  "Specifications",
  "Description",
  "What Is Included",
  "Documents",
  "Compliance",
  "CAD / Drawings",
  "Applications",
]
```

Use WAI-ARIA tab semantics only if tabs truly switch one visible panel. On small screens, the implementation may render stacked sections while preserving deep-linkable headings.

- [ ] **Step 5: Add related/accessory cards and Product JSON-LD**

Metadata/JSON-LD must use `partNumber` as SKU. Do not emit `Offer`/price/inventory schema without verified values.

- [ ] **Step 6: Run tests and gates**

```bash
npm run test -- tests/rxl/product-page.test.tsx
npm run lint
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app/'(marketing)'/products/'[category]'/'[sku]' components/rxl/product tests/rxl/product-page.test.tsx
git commit -m "feat: implement RXL Rev26 product detail"
```

---

### Task 6: Five-Step Configurator, Structured Quote Payload, and Hardened Quote API

**Files:**
- Create: `components/rxl/configurator/configuratorReducer.ts`
- Create: `components/rxl/configurator/Configurator.tsx`
- Create: `lib/rxl/configurator/payload.ts`
- Create: `lib/rxl/validation/forms.ts`
- Create: `app/(marketing)/configurator/page.tsx`
- Modify or replace behind compatibility wrapper: `app/api/[...slug]/route.ts`
- Prefer final target: `app/api/forms/quote/route.ts`
- Create: `tests/rxl/configurator-reducer.test.ts`
- Create: `tests/rxl/quote-payload.test.ts`

**Interfaces:**
- Produces: `ConfiguratorState`, `ConfiguratorAction`, `configuratorReducer`, `buildQuotePayload(state, contact, attribution)`, and `POST /api/forms/quote`.
- Payload contains no fake routing result; `routing.status` is `"unconfigured"` until a real provider exists.

- [ ] **Step 1: Write reducer and payload tests first**

```ts
it("does not advance when required step data is missing", () => {
  const next = configuratorReducer(initialConfiguratorState, { type: "NEXT" });
  expect(next.step).toBe(1);
});

it("builds a deterministic structured payload shape", () => {
  const payload = buildQuotePayload(completeState, contactFixture, attributionFixture);
  expect(payload.configuration.partNumbers.length).toBeGreaterThan(0);
  expect(payload.routing.status).toBe("unconfigured");
  expect(payload.quoteRef).toMatch(/^RXL-/);
});
```

- [ ] **Step 2: Verify tests fail**

```bash
npm run test -- tests/rxl/configurator-reducer.test.ts tests/rxl/quote-payload.test.ts
```

Expected: FAIL because reducer/payload modules do not exist.

- [ ] **Step 3: Implement reducer as pure business logic**

Required steps:

```ts
export const CONFIGURATOR_STEPS = [
  "Application",
  "Product Line",
  "Configuration",
  "Accessories",
  "Project Details",
] as const;
```

The reducer owns selections and validation eligibility; React components own only presentation and field wiring.

- [ ] **Step 4: Implement Configurator UI**

Desktop: content column + sticky summary. Mobile: summary becomes in-flow. Back/Continue buttons must disable correctly. Starting from a PDP query such as `?part=RXL-123` preloads product line/configuration context when it maps safely.

- [ ] **Step 5: Implement the quote payload builder**

Public shape:

```ts
export type QuotePayload = {
  quoteRef: string;
  submittedAt: string;
  contact: QuoteContact;
  application: string;
  productLine: string;
  configuration: {
    selections: Record<string, string>;
    accessories: string[];
    partNumbers: string[];
  };
  quantity: number;
  targetTimeline: string | null;
  notes: string | null;
  attribution: Attribution;
  routing: { status: "unconfigured" };
};
```

- [ ] **Step 6: Preserve and migrate hardened server validation**

`POST /api/forms/quote` retains: 16KB maximum body, server email validation, max lengths, honeypot, idempotency key, basic rate-limit abstraction, no form-content logging, and bounded error responses.

Response example:

```json
{
  "ok": true,
  "quoteRef": "RXL-ABC123",
  "delivery": "not-configured"
}
```

Never claim an email/CRM record was sent in Preview.

- [ ] **Step 7: Run focused tests and gates**

```bash
npm run test -- tests/rxl/configurator-reducer.test.ts tests/rxl/quote-payload.test.ts
npm run lint
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add app/'(marketing)'/configurator app/api components/rxl/configurator lib/rxl/configurator lib/rxl/validation tests/rxl/configurator-reducer.test.ts tests/rxl/quote-payload.test.ts
git commit -m "feat: build RXL configurator and quote contract"
```

---

### Task 7: Careers Provider, Job Pages, and ATS Boundary

**Files:**
- Create: `lib/rxl/data/jobs.ts`
- Create: `lib/rxl/providers/jobs.ts`
- Create: `components/rxl/careers/JobList.tsx`
- Create: `app/(marketing)/careers/page.tsx`
- Create: `app/(marketing)/careers/[job]/page.tsx`
- Create: `tests/rxl/jobs-provider.test.ts`

**Interfaces:**
- Produces: `jobsProvider.listJobs()` and `jobsProvider.getJob(slug)`.
- `Job.applyUrl` is nullable; no apply flow is faked when null.

- [ ] **Step 1: Write failing provider test**

```ts
it("keeps representative openings explicitly non-live", async () => {
  const jobs = await jobsProvider.listJobs();
  expect(jobs.every((job) => job.status === "representative")).toBe(true);
});
```

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/rxl/jobs-provider.test.ts
```

- [ ] **Step 3: Implement jobs provider**

Use:

```ts
export interface JobsProvider {
  listJobs(): Promise<Job[]>;
  getJob(slug: string): Promise<Job | null>;
}

export const jobsProvider: JobsProvider = localJobsProvider;
```

Representative roles are clearly labeled in Preview. `applyUrl: null` renders "Application system not connected" rather than a fake submit button.

- [ ] **Step 4: Build Careers and job-detail pages**

Match the RXL mockup: department/location/type/req metadata, role summaries, responsive job rows, and an ATS-ready mount point. Only verified/live future jobs may emit `JobPosting` structured data.

- [ ] **Step 5: Run tests and gates**

```bash
npm run test -- tests/rxl/jobs-provider.test.ts
npm run lint
npm run typecheck
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add app/'(marketing)'/careers components/rxl/careers lib/rxl/data/jobs.ts lib/rxl/providers/jobs.ts tests/rxl/jobs-provider.test.ts
git commit -m "feat: add ATS-ready RXL careers"
```

---

### Task 8: Contact, Customer Portal, and Employee Hub Boundaries

**Files:**
- Create: `components/rxl/forms/ContactForm.tsx`
- Create: `app/(marketing)/contact/page.tsx`
- Create: `app/(marketing)/customer-portal/page.tsx`
- Create: `app/employees/page.tsx`
- Prefer final target: `app/api/forms/contact/route.ts`
- Create: `tests/rxl/contact-form.test.tsx`
- Create: `tests/rxl/integration-boundaries.test.tsx`

**Interfaces:**
- Contact API acknowledges safely without pretending delivery.
- Portal URL comes from `process.env.RXL_EPICOR_PORTAL_URL` and is disabled when absent.
- Employee authentication state is `"not-configured" | "preview-demo" | "authenticated"`; this build may only use the first two and may never claim real Entra auth.

- [ ] **Step 1: Write failing boundary tests**

```tsx
it("does not render an active Epicor handoff without a configured endpoint", () => {
  render(<CustomerPortalView portalUrl={null} />);
  expect(screen.getByRole("button", { name: /Continue to the Portal/i })).toBeDisabled();
});

it("labels employee access as Preview-only when Entra is not configured", () => {
  render(<EmployeeHub authState="preview-demo" />);
  expect(screen.getByText(/Preview demo/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/rxl/integration-boundaries.test.tsx
```

- [ ] **Step 3: Implement Contact with current hardening**

Reuse server validation limits from the existing form implementation. Client form uses associated labels, inline error text, `aria-invalid`, `aria-describedby`, `aria-live`, timeout handling, and double-submit protection.

- [ ] **Step 4: Implement Customer Portal interstitial**

Explain the Epicor handoff, never collect credentials, track click intent, and only navigate when `RXL_EPICOR_PORTAL_URL` is a valid `https:` URL.

- [ ] **Step 5: Implement Employee Hub shell**

Render the six launchpad groups from the approved prototype (HR/SharePoint, Epicor, IT support, Safety/Training, Timesheets/Payroll, Drawing systems). In Preview, any demo reveal must be explicitly labelled and contain no real internal URLs.

- [ ] **Step 6: Run tests and gates**

```bash
npm run test -- tests/rxl/contact-form.test.tsx tests/rxl/integration-boundaries.test.tsx
npm run lint
npm run typecheck
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add app/'(marketing)'/contact app/'(marketing)'/customer-portal app/employees app/api/forms components/rxl/forms tests/rxl
git commit -m "feat: add safe RXL access boundaries"
```

---

### Task 9: Analytics Event Contract, Attribution Persistence, and Preview Inspector

**Files:**
- Create: `lib/rxl/analytics/client.ts`
- Create: `lib/rxl/analytics/attribution.ts`
- Create: `components/rxl/analytics/AnalyticsProvider.tsx`
- Create: `components/rxl/analytics/AnalyticsInspector.tsx`
- Modify: `app/(marketing)/layout.tsx`
- Create: `tests/rxl/analytics.test.ts`

**Interfaces:**
- Produces: `trackAnalytics(name, params)`, `getAttribution()`, `AnalyticsProvider`, and Preview-only inspector.
- Every event name is restricted to the union from `lib/rxl/types/analytics.ts`.

- [ ] **Step 1: Write failing event/attribution tests**

```ts
it("captures first-touch UTM attribution once", () => {
  const storage = new MemoryStorage();
  const first = captureAttribution(new URL("https://example.test/?utm_source=linkedin&utm_medium=paid"), storage);
  const second = captureAttribution(new URL("https://example.test/?utm_source=google"), storage);
  expect(second.utmSource).toBe("linkedin");
  expect(second).toEqual(first);
});
```

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/rxl/analytics.test.ts
```

- [ ] **Step 3: Implement analytics client adapter**

```ts
export function trackAnalytics<T extends AnalyticsEventName>(
  name: T,
  params: AnalyticsParams[T],
): void {
  window.dispatchEvent(new CustomEvent("rxl:analytics", { detail: { name, params, at: Date.now() } }));
}
```

No GA4 network request is added in this task.

- [ ] **Step 4: Implement first-touch attribution**

Persist source/medium/campaign/landing-page/session identifier in `sessionStorage` with a versioned key such as `rxl-attribution-v1`.

- [ ] **Step 5: Implement Preview-only inspector**

`AnalyticsInspector` subscribes to `rxl:analytics`, displays name/time/params, distinguishes conversion events, supports Clear, closes on Escape, and is only rendered when `VERCEL_ENV !== "production"`.

- [ ] **Step 6: Wire the supplied event contract**

Ensure components call the exact events:

```text
page_view
catalog_search
product_view
filter_applied
spec_sheet_download
configurator_start
configurator_step
configurator_abandon
quote_submit
contact_submit
phone_click
email_click
careers_apply_click
portal_click
```

Do not add analytics to unverified phone/email links that are not rendered.

- [ ] **Step 7: Run tests and gates**

```bash
npm run test -- tests/rxl/analytics.test.ts
npm run lint
npm run typecheck
npm run build
```

- [ ] **Step 8: Commit**

```bash
git add app/'(marketing)'/layout.tsx components/rxl/analytics lib/rxl/analytics lib/rxl/types/analytics.ts tests/rxl/analytics.test.ts
git commit -m "feat: add RXL analytics contract"
```

---

### Task 10: SEO, Sitemap, Robots, Structured Data, Redirects, and Lab Isolation

**Files:**
- Create: `lib/rxl/seo/metadata.ts`
- Modify: `app/robots.ts`
- Modify: `app/sitemap.ts`
- Modify: `next.config.ts`
- Create or move: `app/lab/...`
- Modify: `app/layout.tsx`
- Create: `tests/rxl/seo.test.ts`

**Interfaces:**
- Produces metadata builders that accept provider records and never emit fabricated offers/jobs.
- `/lab` remains noindex and unsafe Production tools remain restricted.

- [ ] **Step 1: Write failing SEO tests**

```ts
it("does not emit Offer schema for representative product data", () => {
  const schema = productJsonLd(productFixture);
  expect(schema).not.toHaveProperty("offers");
});

it("keeps lab disallowed", () => {
  const rules = buildRobotsRules({ production: true });
  expect(JSON.stringify(rules)).toContain("/lab");
});
```

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/rxl/seo.test.ts
```

- [ ] **Step 3: Implement metadata/JSON-LD helpers**

Provide helpers for Organization/WebSite, Product without Offer, breadcrumbs, Article, and JobPosting only when `job.status === "verified-live"`.

- [ ] **Step 4: Expand sitemap and robots**

Sitemap enumerates public static routes plus local provider product/category/article routes for Preview testing. Preview returns `Disallow: /`; Production continues to disallow `/lab`, `/api/lab/`, and form API routes from crawling.

- [ ] **Step 5: Preserve security headers and redirects**

Retain current CSP and security headers. Add explicit redirects from superseded Learning Lab public routes only after equivalent RXL routes exist. Keep technical legacy redirects pointed at `/lab`.

- [ ] **Step 6: Isolate Lab from the RXL marketing shell**

Move the existing Lab rendering into focused `app/lab` routes or a dedicated Lab layout so public RXL navigation/footer are not confused with engineering tooling. Preserve noindex metadata and Production guards for self-test/intentional 500 tooling.

- [ ] **Step 7: Run tests and gates**

```bash
npm run test -- tests/rxl/seo.test.ts
npm run lint
npm run typecheck
npm run build
```

- [ ] **Step 8: Commit**

```bash
git add app/robots.ts app/sitemap.ts app/lab app/layout.tsx lib/rxl/seo next.config.ts tests/rxl/seo.test.ts
git commit -m "feat: finalize RXL SEO and lab isolation"
```

---

### Task 11: Remove the Legacy Public Catch-All and Dead Learning Lab Data

**Files:**
- Delete after verification: `app/[[...slug]]/page.tsx`
- Delete or reduce after migration: `components/Interactive.tsx`
- Delete or reduce after migration: `lib/data.ts`
- Delete or reduce after migration: `lib/site.ts`
- Modify: `README.md`
- Create: `tests/rxl/route-regression.test.ts`

**Interfaces:**
- All public RXL routes are now owned by dedicated App Router files.
- Remaining legacy modules may only contain technical Lab compatibility code that has a documented consumer.

- [ ] **Step 1: Add a route inventory regression test**

Test the expected route manifest source list or route-builder functions so all required paths remain represented:

```ts
expect(PUBLIC_ROUTE_PATHS).toEqual(expect.arrayContaining([
  "/",
  "/about",
  "/industries",
  "/products",
  "/search",
  "/configurator",
  "/resources",
  "/news",
  "/careers",
  "/contact",
  "/customer-portal",
  "/employees",
  "/legal/privacy",
  "/legal/terms",
]));
```

- [ ] **Step 2: Run it before deletion**

```bash
npm run test -- tests/rxl/route-regression.test.ts
```

Expected: PASS only after the route inventory is exported from the new RXL site config.

- [ ] **Step 3: Delete the replaced public catch-all implementation**

Remove `app/[[...slug]]/page.tsx` only after dedicated routes cover every required public page and `/lab` has its own route tree.

Remove unused legacy product/job arrays and old interactive form components only after `rg`/GitHub code search proves there are no imports.

- [ ] **Step 4: Update README**

README must describe:

```text
RXL USA Preview implementation
Next.js 16 / React 19 / TypeScript
feature branches -> Vercel Preview
main -> Production
external integrations currently adapter-only
npm run check as the full local quality gate
```

Do not include secrets or internal RXL endpoints.

- [ ] **Step 5: Run the full gate**

```bash
npm run check
```

Expected: lint PASS, typecheck PASS, all tests PASS, Next production build PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: complete RXL route migration"
```

---

### Task 12: Vercel Preview QA, Accessibility Regression, and PR Readiness

**Files:**
- Modify only if QA finds defects: relevant RXL components/routes/styles
- Create: `docs/qa/2026-09-03-rxl-preview-qa.md`

**Interfaces:**
- Produces one Vercel Preview candidate and a QA record suitable for deciding whether to merge to `main`.

- [ ] **Step 1: Push the feature branch and wait for Vercel**

```bash
git push -u origin feature/rxl-site-rebuild
```

Expected: Vercel creates a Preview deployment from this branch, not Production.

- [ ] **Step 2: Verify Vercel build metadata**

Confirm branch = `feature/rxl-site-rebuild`, target = Preview, commit SHA = branch HEAD, and state = READY.

- [ ] **Step 3: Run the route smoke matrix**

Verify HTTP 200/expected 404 for:

```text
/
/about
/industries
/products
/search
/configurator
/resources
/news
/careers
/contact
/customer-portal
/employees
/legal/privacy
/legal/terms
/lab
/does-not-exist -> 404
```

Also open one category, one PDP, one article detail, one job detail, and one industry detail.

- [ ] **Step 4: Run visual QA at approved widths**

Record results at 1440, 1024, 768, and 390px for Home, header/mega menu, catalog, PDP, configurator, Careers, portal/employees, and footer. Check text wrapping, sticky elements, overflow, media crops, touch targets, and menu behavior.

- [ ] **Step 5: Run keyboard/accessibility QA**

Verify:

```text
Skip link reaches #main-content
Mega menu opens/closes with keyboard
Escape closes menu/modal/analytics drawer
Catalog filters are reachable and labeled
PDP tabs are keyboard operable
Configurator announces validation/submission state
No status relies on color alone
Reduced-motion media query suppresses nonessential motion
```

- [ ] **Step 6: Run functional QA**

Exercise: typeahead, filters/chips/clear-all/sort/pagination, PDP gallery/tabs/docs, all five configurator steps, quote acknowledgement, contact validation, job navigation, disabled-unconfigured Epicor handoff, employee Preview boundary, analytics event inspector, Lab Production guards.

- [ ] **Step 7: Run final automated gate**

```bash
npm run check
```

Expected: PASS.

- [ ] **Step 8: Write the QA record**

`docs/qa/2026-09-03-rxl-preview-qa.md` records:

```markdown
# RXL Preview QA

- Branch: feature/rxl-site-rebuild
- Commit: <exact SHA>
- Vercel deployment: <exact deployment id>
- Preview URL: <exact URL>
- npm run check: PASS/FAIL
- Route smoke: PASS/FAIL
- Desktop visual QA: PASS/FAIL
- Tablet visual QA: PASS/FAIL
- Mobile visual QA: PASS/FAIL
- Keyboard/accessibility QA: PASS/FAIL
- Known non-blocking debt: <explicit list or "none">
- External integrations intentionally not connected: Sanity, Algolia, ATS, Epicor, Entra, Resend/CRM, GA4/GTM/Clarity
```

- [ ] **Step 9: Commit QA fixes and record**

```bash
git add -A
git commit -m "test: complete RXL Preview QA"
git push
```

- [ ] **Step 10: Open a PR to `main` only after the user approves the Preview**

PR title:

```text
feat: rebuild public site as RXL USA
```

PR body must include Preview URL, `npm run check` result, QA summary, known debt, and explicit statement that external integrations remain adapter-only.

Do not merge automatically.

---

## Self-Review

### Spec coverage

- Global RXL design system and shell: Tasks 1-2.
- Home/about/industries/resources/news/legal: Task 3.
- Catalog/search/facets/typeahead: Task 4.
- Rev26 PDP and PDP Content Pack field model: Task 5.
- Five-step configurator and structured quote contract: Task 6.
- Careers/ATS boundary: Task 7.
- Contact/Epicor/Employee/Entra boundaries: Task 8.
- Analytics event contract and first-touch attribution: Task 9.
- SEO/robots/sitemap/structured data/redirects/Lab isolation/security preservation: Task 10.
- Monolith retirement and route migration: Task 11.
- Visual/mobile/accessibility/functional/Vercel QA: Task 12.
- Sanity/Algolia/ATS/Epicor/Entra/Resend/CRM/GA4 integrations remain explicitly deferred adapters as required.

### Placeholder scan

There are no implementation `TBD`/`TODO` instructions. Angle-bracket values in the final QA record are explicitly values to be captured from the actual deployment, not unresolved design requirements.

### Type consistency

- `RXL_SITE` is defined in Task 1 and consumed by Task 2 onward.
- `Product` and stable `partNumber` are defined in Task 1 and consumed by Tasks 4-6/10.
- Provider signatures are defined in their producing tasks before page consumers use them.
- `AnalyticsEventName` is defined in Task 1; analytics implementation in Task 9 restricts calls to that union.
- `QuotePayload` and `routing.status = "unconfigured"` are fixed in Task 6 and preserved through QA.
