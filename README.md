# RXL USA Preview

Production-grade RXL USA website implementation built with Next.js 16, React 19, and TypeScript.

## Release workflow

- Feature branches deploy to Vercel Preview.
- `main` is the Vercel Production branch.
- Preview QA and user approval are required before merging to `main`.
- The full repository gate is `npm run check`.

`npm run check` runs lint, TypeScript validation, Vitest, and the optimized Next.js build.

## Current integration boundaries

The public experience is implemented against typed local providers and explicit integration boundaries. The following systems are intentionally adapter-only until verified credentials/endpoints/content are supplied:

- Sanity CMS
- Algolia
- ATS
- Epicor customer portal / ERP
- Microsoft Entra ID
- Resend / CRM delivery
- GA4 / GTM / Clarity

Representative Preview products, roles, lead-time labels, documents, articles, and application content must not be treated as verified live commercial facts.

## Architecture

- `app/(marketing)` — public RXL routes and marketing shell
- `components/rxl` — RXL UI, catalog, configurator, careers, forms, analytics, and access boundaries
- `lib/rxl` — typed data/provider contracts, validation, analytics, SEO, and configuration
- `app/lab` — isolated noindex engineering Lab
- `app/api/forms` — hardened Preview form acknowledgement endpoints
- `app/api/lab` — bounded engineering diagnostic endpoints

Do not add secrets, credentials, private RXL endpoints, or billing material to this repository.
