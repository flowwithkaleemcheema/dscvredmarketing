// Thin wrapper so events go to whichever tools are configured (GA4, Meta) and never throw.
type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}, metaEvent?: { name: string; custom?: boolean }) {
  try {
    window.gtag?.('event', event, params);
  } catch {
    /* ignore */
  }
  if (metaEvent) {
    try {
      window.fbq?.(metaEvent.custom ? 'trackCustom' : 'track', metaEvent.name, params);
    } catch {
      /* ignore */
    }
  }
}
