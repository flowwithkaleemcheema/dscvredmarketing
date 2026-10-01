# Dscvred Marketing: Landing Page v1

> Code: [`site/`](../site). Astro + Tailwind, static, hosted free on Cloudflare Pages.
> Copy source of truth: [ICP](./01-ideal-customer-profile.md) and [Grand Slam Offer](./02-grand-slam-offer.md).

---

## 1. Conversion strategy

**One goal:** a qualified remodeler completes the **Territory Check** and books a **Pipeline Audit** on Cal.com.

| Principle | How the page does it |
|---|---|
| **Specific promise above the fold** | "20 qualified design consultations in 90 days. Or we work for free." The guarantee *is* the headline. |
| **Foot in the door** | The hero's first field is one easy question ("Where do you build?"). Typing a city starts the form with that step already answered. |
| **Scarcity that's true** | One remodeler per market, plus a Founding Partner counter driven by `site.founding.spotsLeft`. No fake timers. |
| **Self-qualification** | The form asks project size, revenue and ad budget. Qualified prospects see Cal.com; everyone else gets a polite "not yet" with useful tips, so your calendar stays clean. |
| **Risk reversal everywhere** | Guarantee seal, "what counts as qualified", "your side of the deal", 90-day term, "you own every account." |
| **Honest about having no case studies** | The founder section says it outright and pairs it with the founding-partner terms. Being upfront builds trust; claims you can't back up lose it. |
| **Engagement** | The ROI calculator lets owners plug in their own numbers ("What are 20 consultations worth to you?"). |
| **CTA repetition** | Nav, hero, value stack, founding card, final section, and a sticky bottom bar on mobile, all opening the same form. |
| **Speed** | Static HTML, self-hosted fonts, no images over the network, ~0 JS except the form, calculator and scroll reveal. |

### Section order (each one answers the next objection)
1. **Hero:** promise, guarantee, territory check (+ illustrative calendar / speed-to-lead UI)
2. **Lead-platform strip:** "Stop renting leads from Angi, HomeAdvisor…"
3. **01 Problem:** feast-or-famine referrals and shared leads, in their own words
4. **02 Comparison:** lead platforms vs. typical agency vs. Booked-Out System
5. **03 How it works:** Attract → Qualify → Respond → Book → Measure
6. **04 Week one + timeline:** quick wins and "live in 14 days"
7. **05 Value stack:** spec-sheet style, $20,500 + $4,500/mo value; price on the call
8. **06 ROI calculator**
9. **07 Guarantee:** seal, qualified definition, client conditions
10. **08 Exclusivity + Founding Partner Program**
11. **09 Founder letter + results from other industries**
12. **10 Fit / not a fit**
13. **11 FAQ** (12 objections; also emitted as FAQ schema)
14. **Final CTA:** "Check if your market is still available."

### Territory Check flow
`Service area → Project types → Avg project size → Revenue → Lead sources → Ad budget → Capacity → Contact`

- Single-choice steps auto-advance, so it feels like a 60-second quiz.
- **Not a fit** if average project is under $25k **or** ad budget is under $3k/mo. These leads are still saved to the sheet, marked `qualified = no`.
- **Qualified** → "Good news, {name}: {area} is open." → Cal.com inline calendar, prefilled with name, email and notes.
- If the area matches `site.claimedMarkets`, the copy switches to "we may already have a partner near {area}" and still offers the audit.
- UTM parameters, gclid, fbclid, referrer and landing page are saved with every submission.
- Deep link for cold email: `https://yourdomain.com/#check-market` opens the form directly.

---

## 2. Launch checklist

### A. Fill in the placeholders: `site/src/config/site.ts`
- [ ] `url`: your real domain
- [ ] `email`: your contact email
- [ ] `founder`: name, initials, years of experience, photo (`site/public/images/founder.jpg`, about 680×820)
- [ ] `results`: **real** numbers from past clients (or delete the array and the strip disappears)
- [ ] `founding.spotsLeft`: keep it honest as partners sign
- [ ] The build prints `⚠ site config still has placeholders` until all of these are done

### B. Google Sheet + email alerts
- [ ] Follow [`site/integrations/google-apps-script/README.md`](../site/integrations/google-apps-script/README.md)
- [ ] Paste the `/exec` URL into `integrations.formEndpoint`

### C. Cal.com
- [ ] Create a free Cal.com account and a **30-minute event** called "Pipeline Audit"
- [ ] Add booking questions you want (company and website are already sent in the notes)
- [ ] Set `integrations.calLink` to `your-username/pipeline-audit`
- [ ] Until this is set, qualified leads see "We'll be in touch within one business day."

### D. Tracking
- [ ] GA4: create a property and paste the `G-…` ID into `tracking.ga4Id`
- [ ] Meta Pixel: paste the pixel ID into `tracking.metaPixelId`
- [ ] In GA4, mark **`generate_lead`** and **`book_audit`** as key events

| Event | When | GA4 | Meta |
|---|---|---|---|
| `territory_check_start` | Form opened | ✓ | |
| `territory_check_step` | Each step completed (`step`, `step_id`) | ✓ | |
| `generate_lead` | Qualified submission | ✓ | `Lead` |
| `territory_check_not_fit` | Disqualified submission (`reason`) | ✓ | |
| `book_audit` | Cal.com booking completed | ✓ | `Schedule` |
| `roi_calculator_used` | First slider move | ✓ | |

### E. Deploy on Cloudflare Pages (free)
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick `dscvredmarketing`
2. Settings:
   - **Production branch:** `main` (merge this branch first) or this branch for a preview
   - **Framework preset:** Astro
   - **Root directory:** `site`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `NODE_VERSION` = `22`
3. Deploy, then **Custom domains → Set up a domain** and point your domain at it (free SSL).
4. Every push to the production branch redeploys automatically; other branches get preview URLs.

### F. Before sending traffic
- [ ] Submit a test lead on mobile and desktop and confirm the sheet row, email alert and Cal.com booking
- [ ] Check GA4 Realtime and Meta Events Manager for the events above
- [ ] Share the URL in Slack, iMessage or LinkedIn to confirm the preview image (`/og.png`)
- [ ] For UK/AU traffic later: add a cookie-consent banner before enabling GA4/Meta

---

## 3. What to test first (CRO roadmap)
1. **Headline:** guarantee-led (current) vs. pain-led ("Stop fighting 4 contractors for every Angi lead")
2. **Hero CTA:** inline city field (current) vs. a single "Check my market" button
3. **Form length:** drop the revenue step if completion rate is under ~35% from form start
4. **Proof:** once the first founding partner hits the guarantee, replace the founder results strip with a remodeling case study plus video above the fold
5. **Pricing:** test showing "Plans from $3,500/mo + ad spend" in the value stack to pre-qualify harder
