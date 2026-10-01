// Remember where a visitor came from (first touch) so it can be saved with their form submission.
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const;
const STORAGE_KEY = 'dscvred_attribution';

export type Attribution = Partial<Record<(typeof KEYS)[number] | 'referrer' | 'landing_page', string>>;

function read(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function capture(): Attribution {
  const params = new URLSearchParams(location.search);
  const data: Attribution = {};
  for (const key of KEYS) {
    const value = params.get(key);
    if (value) data[key] = value.slice(0, 200);
  }
  data.referrer = document.referrer.slice(0, 300);
  data.landing_page = (location.pathname + location.search).slice(0, 300);
  return data;
}

let current = read();
if (!current) {
  current = capture();
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    /* storage unavailable: fall back to this page's values */
  }
}

export function getAttribution(): Attribution {
  return read() ?? current ?? capture();
}
