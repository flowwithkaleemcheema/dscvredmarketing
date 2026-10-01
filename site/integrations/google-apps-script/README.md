# Territory Check → Google Sheet + email

1. Create a Google Sheet (e.g. "Dscvred Leads").
2. **Extensions → Apps Script.** Replace the default code with [`Code.gs`](./Code.gs).
3. Set `NOTIFY_EMAIL` at the top to the inbox that should get new-lead alerts.
4. **Deploy → New deployment →** type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorise when asked, then copy the **Web app URL** (ends in `/exec`).
6. Paste it into `site/src/config/site.ts` → `integrations.formEndpoint`, commit and push.

Test it: complete the Territory Check on the live site. A row should appear in the "Territory Checks" tab, and you should get an email marked ✅ QUALIFIED or ⚪ Not a fit.

> If you change `Code.gs` later, use **Deploy → Manage deployments → Edit → New version**. That keeps the same URL.
