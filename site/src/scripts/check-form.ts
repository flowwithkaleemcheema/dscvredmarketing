import { site } from '../config/site';
import { steps } from '../data/check-steps';
import { getAttribution } from './attribution';
import { track } from './track';

const dialog = document.getElementById('check-dialog') as HTMLDialogElement;
const form = document.getElementById('check-form') as HTMLFormElement;
const panels = [...form.querySelectorAll<HTMLFieldSetElement>('[data-step]')];
const results = Object.fromEntries(
  [...form.querySelectorAll<HTMLElement>('[data-result]')].map((el) => [el.dataset.result!, el]),
);
const nav = dialog.querySelector<HTMLElement>('[data-nav]')!;
const backBtn = dialog.querySelector<HTMLButtonElement>('[data-back]')!;
const nextBtn = dialog.querySelector<HTMLButtonElement>('[data-next]')!;
const nextLabel = dialog.querySelector<HTMLElement>('[data-next-label]')!;
const progress = dialog.querySelector<HTMLElement>('[data-progress]')!;
const progressWrap = dialog.querySelector<HTMLElement>('[data-progress-wrap]')!;
const stepNum = dialog.querySelector<HTMLElement>('[data-step-num]')!;

let current = 0;
let source = 'unknown';
let started = false;
let submitted = false;

/* ---------- helpers ---------- */

const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | RadioNodeList | null;

function values(name: string): string[] {
  return [...form.querySelectorAll<HTMLInputElement>(`[name="${name}"]`)]
    .filter((i) => (i.type === 'radio' || i.type === 'checkbox' ? i.checked : true))
    .map((i) => i.value.trim())
    .filter(Boolean);
}

function showError(panel: HTMLElement, msg: string) {
  const el = panel.querySelector<HTMLElement>('[data-error]')!;
  el.textContent = msg;
  el.hidden = !msg;
}

function validate(i: number): boolean {
  const panel = panels[i];
  const step = steps[i];
  showError(panel, '');
  panel.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));

  if (step.kind === 'text') {
    if (!values(step.id)[0]) {
      const input = panel.querySelector('input')!;
      input.setAttribute('aria-invalid', 'true');
      showError(panel, 'Please enter your service area.');
      input.focus();
      return false;
    }
  } else if (step.kind === 'single' || step.kind === 'multi') {
    if (!values(step.id).length) {
      showError(panel, step.kind === 'multi' ? 'Pick at least one option.' : 'Pick one option to continue.');
      return false;
    }
  } else if (step.kind === 'contact') {
    const checks: [string, (v: string) => boolean, string][] = [
      ['name', (v) => v.length > 1, 'Please enter your name.'],
      ['company', (v) => v.length > 1, 'Please enter your company name.'],
      ['email', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), 'Please enter a valid email address.'],
      ['phone', (v) => v.replace(/\D/g, '').length >= 10, 'Please enter a valid mobile number.'],
    ];
    for (const [name, ok, msg] of checks) {
      const input = field(name) as HTMLInputElement;
      if (!ok(input.value.trim())) {
        input.setAttribute('aria-invalid', 'true');
        showError(panel, msg);
        input.focus();
        return false;
      }
    }
  }
  return true;
}

function go(i: number, { focus = true } = {}) {
  current = Math.max(0, Math.min(i, panels.length - 1));
  panels.forEach((p, idx) => (p.hidden = idx !== current));
  Object.values(results).forEach((r) => (r.hidden = true));
  nav.hidden = false;
  progressWrap.hidden = false;
  backBtn.classList.toggle('invisible', current === 0);
  const last = current === panels.length - 1;
  nextLabel.textContent = last ? 'See if my market is open' : 'Continue';
  stepNum.textContent = String(current + 1);
  progress.style.width = `${((current + 1) / panels.length) * 100}%`;
  form.scrollTop = 0;
  if (focus) {
    const target = panels[current].querySelector<HTMLInputElement>('input:not([type=radio]):not([type=checkbox])')
      ?? panels[current].querySelector<HTMLInputElement>('input:checked')
      ?? panels[current].querySelector<HTMLInputElement>('input');
    // Avoid popping the mobile keyboard for choice steps
    if (target && (target.type === 'text' || target.type === 'email' || target.type === 'tel' || window.matchMedia('(min-width: 640px)').matches)) {
      target.focus({ preventScroll: true });
    }
  }
}

function next() {
  if (!validate(current)) return;
  track('territory_check_step', { step: current + 1, step_id: steps[current].id });
  if (current < panels.length - 1) go(current + 1);
  else submit();
}

/* ---------- qualification ---------- */

function qualify() {
  const size = values('project_size')[0];
  const budget = values('ad_budget')[0];
  const reasons: string[] = [];
  if (size === 'under_25k') {
    reasons.push('Our system and guarantee are built around remodels of $25k and up, so we can’t promise results for smaller average jobs.');
  }
  if (budget === 'under_3k') {
    reasons.push(`To hit our guarantee we need at least $${site.offer.minAdSpend.toLocaleString('en-US')}/month in ad spend. Below that, there isn’t enough data to do it reliably.`);
  }
  return { qualified: reasons.length === 0, reasons };
}

function marketClaimed(area: string) {
  const a = area.toLowerCase();
  return site.claimedMarkets.some((m) => m && a.includes(m.toLowerCase()));
}

/* ---------- submission ---------- */

function payload(qualified: boolean, claimed: boolean) {
  const data: Record<string, string> = {
    submitted_at: new Date().toISOString(),
    source,
    qualified: qualified ? 'yes' : 'no',
    market_claimed: claimed ? 'yes' : 'no',
  };
  for (const s of steps) {
    if (s.kind === 'contact') continue;
    data[s.id] = values(s.id).join(', ');
  }
  for (const k of ['name', 'company', 'email', 'phone', 'website']) {
    data[k] = ((field(k) as HTMLInputElement)?.value ?? '').trim().slice(0, 300);
  }
  Object.assign(data, getAttribution());
  data.page = location.href.slice(0, 300);
  return data;
}

async function send(data: Record<string, string>) {
  const endpoint = site.integrations.formEndpoint;
  if (!endpoint) {
    console.warn('[territory-check] No formEndpoint configured in src/config/site.ts. Submission:', data);
    return;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    // Apps Script web apps don't return CORS headers, so send as a simple no-cors form post.
    await fetch(endpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data), signal: controller.signal });
  } catch (err) {
    console.error('[territory-check] submit failed', err);
  } finally {
    clearTimeout(timer);
  }
}

function show(result: 'sending' | 'qualified' | 'not-fit') {
  panels.forEach((p) => (p.hidden = true));
  Object.entries(results).forEach(([k, el]) => (el.hidden = k !== result));
  nav.hidden = true;
  progressWrap.hidden = result !== 'sending';
  if (result === 'sending') progress.style.width = '100%';
  form.scrollTop = 0;
}

async function submit() {
  if (submitted) return;
  // Bots fill the honeypot; quietly pretend everything worked.
  if ((field('company_fax') as HTMLInputElement)?.value) {
    show('not-fit');
    return;
  }
  submitted = true;
  const area = values('area')[0] ?? '';
  const { qualified, reasons } = qualify();
  const claimed = marketClaimed(area);
  const data = payload(qualified, claimed);

  show('sending');
  await Promise.all([send(data), new Promise((r) => setTimeout(r, 900))]);

  const firstName = data.name.split(/\s+/)[0] || 'there';
  if (qualified) {
    track('generate_lead', { source, market_claimed: claimed }, { name: 'Lead' });
    renderQualified(area, firstName, claimed, data);
    show('qualified');
  } else {
    track('territory_check_not_fit', { source, reason: reasons.length > 1 ? 'size+budget' : values('project_size')[0] === 'under_25k' ? 'size' : 'budget' });
    results['not-fit'].querySelector('[data-first-name]')!.textContent = firstName;
    results['not-fit'].querySelector('[data-not-fit-reason]')!.textContent = reasons.join(' ');
    show('not-fit');
  }
}

/* ---------- qualified: Cal.com booking ---------- */

function renderQualified(area: string, firstName: string, claimed: boolean, data: Record<string, string>) {
  const el = results.qualified;
  const status = el.querySelector<HTMLElement>('[data-market-status]')!;
  const title = el.querySelector<HTMLElement>('[data-qualified-title]')!;
  const sub = el.querySelector<HTMLElement>('[data-qualified-sub]')!;
  if (claimed) {
    status.textContent = 'Market may be claimed';
    status.classList.replace('text-sage', 'text-[#8a6a33]');
    title.textContent = `${firstName}, we may already have a partner near ${area}.`;
    sub.textContent = 'Book your audit anyway. We’ll confirm the exact boundaries and check the neighboring service areas, which are often still open.';
  } else {
    title.textContent = `Good news, ${firstName}: ${area} is open.`;
    sub.textContent = 'Claim it with a free 30-minute Pipeline Audit. We’ll come prepared with your market’s search demand, your competitors’ ads and a plan for your budget.';
  }

  const calLink = site.integrations.calLink;
  const calBox = el.querySelector<HTMLElement>('#cal-inline')!;
  const noCal = el.querySelector<HTMLElement>('[data-no-cal]')!;
  const fallback = el.querySelector<HTMLElement>('[data-cal-fallback]')!;
  if (!calLink) {
    noCal.hidden = false;
    return;
  }
  const notes = `${data.company} · ${area} · avg project ${data.project_size} · ad budget ${data.ad_budget}`;
  const url = new URL(`https://cal.com/${calLink}`);
  url.searchParams.set('name', data.name);
  url.searchParams.set('email', data.email);
  url.searchParams.set('notes', notes);
  fallback.querySelector<HTMLAnchorElement>('[data-cal-link]')!.href = url.toString();
  fallback.hidden = false;
  calBox.hidden = false;
  loadCal(calBox, calLink, { name: data.name, email: data.email, notes });
}

type CalFn = ((...args: unknown[]) => void) & { ns: Record<string, (...args: unknown[]) => void>; loaded?: boolean; q?: unknown[] };

function loadCal(container: HTMLElement, calLink: string, prefill: Record<string, string>) {
  const w = window as unknown as { Cal?: CalFn };
  // Official Cal.com embed loader
  /* eslint-disable */
  (function (C: any, A: string, L: string) {
    const p = function (a: any, ar: any) { a.q.push(ar); };
    const d = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal;
      const ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement('script')).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api: any = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ['initNamespace', namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');
  /* eslint-enable */

  const Cal = w.Cal!;
  Cal('init', 'audit', { origin: 'https://app.cal.com' });
  const ns = Cal.ns.audit;
  ns('inline', { elementOrSelector: container, calLink, config: { layout: 'month_view', ...prefill } });
  ns('ui', {
    theme: 'light',
    hideEventTypeDetails: true,
    layout: 'month_view',
    cssVarsPerTheme: { light: { 'cal-brand': site.integrations.calBrandColor } },
  });
  const onBooked = () => track('book_audit', { source }, { name: 'Schedule' });
  ns('on', { action: 'bookingSuccessful', callback: onBooked });
}

/* ---------- open / close ---------- */

function open(src: string, area?: string) {
  source = src;
  if (!started) {
    started = true;
    track('territory_check_start', { source });
  }
  if (!dialog.open) dialog.showModal();
  document.documentElement.style.overflow = 'hidden';
  if (submitted) return; // keep showing the result
  if (area) {
    (field('area') as HTMLInputElement).value = area;
    go(Math.max(current, 1));
  } else {
    go(current);
  }
}

dialog.addEventListener('close', () => {
  document.documentElement.style.overflow = '';
});
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close(); // backdrop click
});
dialog.querySelector('[data-close-check]')!.addEventListener('click', () => dialog.close());

nextBtn.addEventListener('click', next);
backBtn.addEventListener('click', () => go(current - 1));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  next();
});
form.addEventListener('keydown', (e) => {
  const t = e.target as HTMLInputElement;
  if (e.key === 'Enter' && t.tagName === 'INPUT' && t.type !== 'checkbox' && t.type !== 'radio') {
    e.preventDefault();
    next();
  }
});

// Single-choice steps advance automatically, so it feels like a quick quiz
form.addEventListener('change', (e) => {
  const t = e.target as HTMLInputElement;
  if (t.type === 'radio') {
    showError(panels[current], '');
    setTimeout(() => {
      if (!panels[current].hidden && panels[current].contains(t)) next();
    }, 260);
  } else if (t.type === 'checkbox') {
    showError(panels[current], '');
  }
});

document.querySelectorAll<HTMLElement>('[data-open-check]').forEach((btn) =>
  btn.addEventListener('click', () => open(btn.dataset.source ?? 'button')),
);

document.querySelectorAll<HTMLFormElement>('[data-territory-form]').forEach((f) =>
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const area = (f.elements.namedItem('area') as HTMLInputElement).value.trim();
    open(f.dataset.source ?? 'inline', area || undefined);
  }),
);

// Deep link: /#check-market opens the form directly (handy for cold email links)
if (location.hash === '#check-market') open('deeplink');
