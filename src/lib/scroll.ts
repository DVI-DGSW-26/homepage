// Native scrolling, 1:1 with the wheel. Nothing on the page is tied to the scroll position any more:
// animations play once when their block comes into view, or run on their own (the hero).
import { REDUCED } from './env';

type Target = number | string | HTMLElement;

export const scroll = {
  scrollTo(target: Target, { immediate = false } = {}) {
    const behavior: ScrollBehavior = immediate || REDUCED ? 'auto' : 'smooth';
    if (typeof target === 'number') { window.scrollTo({ top: target, behavior }); return; }
    (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior });
  }
};

/** In-page #anchor links glide to their section. Returns the teardown. */
export function smoothAnchors() {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented) return; // handled already (a demo button opens the dialog instead)
    const a = (e.target as Element).closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href')!; if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); scroll.scrollTo(id); }
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}

/** A deep link (the CES QR code opens /?lang=en#qac-flow, now /en#qac-flow) lands on its section. The browser's own
 * jump happens before React has rendered the target, so this runs once the page is laid out, and
 * again after load in case late fonts moved things. */
export function landOnHash() {
  if (location.hash.length < 2) return;
  const el = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (!el) return;
  const land = () => scroll.scrollTo(el, { immediate: true });
  land();
  if (document.readyState !== 'complete') addEventListener('load', () => requestAnimationFrame(land), { once: true });
}

// Keeping the reader's place across a language switch, which is a link to the other language's address
// (/data → /en/data) and so a new page load: the link notes how far down the page the reader was, and the
// page in the other language scrolls there once it is laid out. The copy differs in length, so the place
// is kept as a share of the page's height rather than in pixels.
const KEY = 'dv-lang-position';
export function noteLangPosition(page: string) {
  const max = document.documentElement.scrollHeight - innerHeight;
  try { sessionStorage.setItem(KEY, JSON.stringify({ page, at: max > 0 ? scrollY / max : 0 })); } catch { /* storage off: start at the top */ }
}
export function restoreLangPosition(page: string) {
  let held: { page?: string; at?: number } | null = null;
  try { held = JSON.parse(sessionStorage.getItem(KEY) ?? 'null'); sessionStorage.removeItem(KEY); } catch { return; }
  if (!held || held.page !== page || typeof held.at !== 'number' || location.hash.length > 1) return;
  window.scrollTo({ top: held.at * (document.documentElement.scrollHeight - innerHeight), behavior: 'instant' });
}
