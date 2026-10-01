/**
 * Dscvred Marketing: Territory Check → Google Sheet + email alert
 *
 * Paste this into Extensions → Apps Script on your leads spreadsheet,
 * set NOTIFY_EMAIL, then Deploy → New deployment → Web app
 * (Execute as: Me · Who has access: Anyone). Copy the /exec URL into
 * site/src/config/site.ts → integrations.formEndpoint.
 */

const SHEET_NAME = 'Territory Checks';
const NOTIFY_EMAIL = 'you@yourdomain.com'; // where new-lead alerts go ('' to disable)

const COLUMNS = [
  'submitted_at', 'qualified', 'market_claimed', 'name', 'company', 'email', 'phone', 'website',
  'area', 'projects', 'project_size', 'revenue', 'lead_sources', 'ad_budget', 'capacity',
  'source', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid', 'referrer', 'landing_page', 'page',
];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.company_fax) return json({ ok: true }); // honeypot

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();
    sheet.appendRow([new Date(), ...COLUMNS.map((c) => clean(p[c]))]);
  } finally {
    lock.releaseLock();
  }

  if (NOTIFY_EMAIL) {
    const fit = p.qualified === 'yes' ? '✅ QUALIFIED' : '⚪ Not a fit';
    const subject = `${fit}: ${p.company || 'New territory check'} (${p.area || 'unknown area'})`;
    const body = COLUMNS.map((c) => `${c}: ${p[c] || ''}`).join('\n');
    MailApp.sendEmail({ to: NOTIFY_EMAIL, subject, body, replyTo: p.email || undefined });
  }
  return json({ ok: true });
}

function doGet() {
  return json({ ok: true, service: 'territory-check' });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['received_at', ...COLUMNS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length + 1).setFontWeight('bold');
  }
  return sheet;
}

// Stop spreadsheet formula injection (values starting with = + - @)
function clean(v) {
  const s = String(v == null ? '' : v).slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
