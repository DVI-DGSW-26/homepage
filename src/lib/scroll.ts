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
    const a = (e.target as Element).closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href')!; if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); scroll.scrollTo(id); }
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}

/** A deep link (the CES QR code opens /?lang=en#qac-flow) lands on its section. The browser's own
 * jump happens before React has rendered the target, so this runs once the page is laid out, and
 * again after load in case late fonts moved things. */
export function landOnHash() {
  if (location.hash.length < 2) return;
  const el = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (!el) return;
  const land = () => scroll.scrollTo(el, { immediate: true });
  land();
  if (document.readyState !== 'complete') addEventListener('load', () => requestAnimationFrame(land), { once: true });
}

// Keeping the reader's place across a re-layout (a language switch rewraps every paragraph above
// the fold): hold() notes whatever sits at the middle of the screen, release() scrolls so it is
// back at the same height. Call release() in a layout effect, i.e. before the new layout paints.
let held: { el: Element; top: number } | null = null;
export function holdPosition() {
  const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
  held = el ? { el, top: el.getBoundingClientRect().top } : null;
}
export function releasePosition() {
  if (!held) return;
  const { el, top } = held; held = null;
  if (!el.isConnected) return;
  const d = el.getBoundingClientRect().top - top;
  if (Math.abs(d) >= 1) window.scrollBy({ top: d, behavior: 'instant' });
}
