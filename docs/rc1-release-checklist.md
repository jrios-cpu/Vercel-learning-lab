# RXL Website RC1 Checklist

## Locked visual direction
- Winning RXL mockup is the visual source of truth.
- Navy/near-black surfaces, white editorial sections, electric blue only for actions and emphasis.
- Primary navigation: Capabilities, Solutions, Workflow, Case Studies, Contact.
- Home composition: hero, About RXL, featured solutions, seven-step workflow, Why RXL, RXL logo band, case studies, footer.

## RC1 included before next Vercel Preview
- Shared winning-design visual pass across marketing routes.
- Dedicated `/workflow` and `/case-studies` routes.
- Catalog search/facets/pagination with representative data warnings.
- PDP quick specifications, detail tabs, document/CAD/compliance boundaries, configurator handoff.
- Dual quote paths: `/configurator` for the five-step engineering flow and `/rfq` for a fast product/quantity/project-notes request.
- Catalog and PDP carry the selected part number into the quick RFQ.
- Quick RFQ and Configurator share `/api/forms/quote` with explicit `source` values instead of maintaining two quote backends.
- Five-step configurator with browser-session persistence and editable completed steps.
- Careers search/department/location filters and ATS-ready boundary.
- Hardened contact/quote routes retained.
- Customer Portal and Employee Hub remain explicit integration boundaries.
- Preview analytics attribution/inspector retained.
- SEO, sitemap, robots, security headers, 404, accessibility and Lab separation retained.

## Integration-day work
- Connect only verified endpoints/credentials supplied by RXL.
- Do not replace representative data with guessed production data.
- Route both `quick_rfq` and `configurator` quote sources into the approved commercial integration without changing their front-end flows.
- Run lint, typecheck, full Vitest suite and Next build before requesting a Vercel Preview.
- Spend one consolidated Preview deployment on visual/functional QA.
- Compare desktop, tablet and mobile against the approved mockup before any merge to `main`.

## Promotion rule
`feature/rxl-site-rebuild` -> CI green -> one Vercel Preview -> visual QA -> approval -> `main` -> Production.
