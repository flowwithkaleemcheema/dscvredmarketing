# Project notes

- Agency name: **Dscvred Marketing** (always spelled exactly this way; never "Discovered Marketing" or "DSCVRED").
- Strategy source of truth: `docs/01-ideal-customer-profile.md` (ICP) and `docs/02-grand-slam-offer.md` (offer). Landing page copy should draw from these.
- Landing page lives in `site/` (Astro 7 + Tailwind 4, static, deployed on Cloudflare Pages with root dir `site`). Run `npm run build` and `npx astro check` in `site/` before pushing.
- Editable launch details (founder, results, form endpoint, Cal.com link, tracking IDs, founding spots) are centralised in `site/src/config/site.ts`. Never invent client results; keep placeholders until the user supplies real numbers.
- Copy is US English for the US launch.
