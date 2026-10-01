# Dscvred Marketing: landing page

Astro + Tailwind static site for **The Booked-Out Remodeler System**. Copy and structure come from `../docs/` (ICP + Grand Slam Offer).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

**Everything you'll edit lives in [`src/config/site.ts`](src/config/site.ts)**: domain, email, founder details, results, founding spots, claimed markets, form endpoint, Cal.com link and tracking IDs. The build prints a warning while any `[placeholder]` is left.

| What | Where |
|---|---|
| Page sections (in order) | `src/pages/index.astro` → `src/components/*` |
| Territory Check questions | `src/data/check-steps.ts` |
| Qualification rules + submit + Cal.com | `src/scripts/check-form.ts` |
| FAQ (also feeds FAQ schema) | `src/data/faq.ts` |
| Colours, fonts, design tokens | `src/styles/global.css` (`@theme`) |
| Google Sheet integration | `integrations/google-apps-script/` |

Deploy and launch steps are in [`../docs/03-landing-page.md`](../docs/03-landing-page.md).
