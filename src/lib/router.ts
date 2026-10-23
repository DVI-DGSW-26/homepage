// Pages. The site is one bundle with a page per path, switched in place: a click on a same-site
// link (href="/data") swaps the page without a reload, and back / forward work as usual.
// Every other path ("/", a typo, the single-file build opened from disk) shows Q.A.C-Flow.
//
// The site used to be one long page, so links into it are #anchors on "/" (the CES QR code opens
// /?lang=en#qac-flow). Such a link is moved to the page that section now lives on, keeping the
// query and the hash, before anything renders.
import { useSyncExternalStore } from 'react';
import { scroll } from './scroll';

export const PAGES = ['/qac-flow', '/data'] as const;
export type Page = (typeof PAGES)[number];

/** the old one-page sections, by id, and the page each is on now */
const MOVED: Record<string, Page> = { 'qac-flow': '/qac-flow', future: '/data' };

const clean = (path: string) => path.replace(/\/+$/, '') || '/';
const toPage = (path: string): Page => {
  const p = clean(path);
  return (PAGES as readonly string[]).includes(p) ? p as Page : '/qac-flow';
};

let page = toPage(location.pathname);
{
  const moved = clean(location.pathname) === '/' ? MOVED[decodeURIComponent(location.hash.slice(1))] : undefined;
  if (moved) { page = moved; try { history.replaceState(history.state, '', moved + location.search + location.hash); } catch { /* file:// */ } }
}

const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const set = (next: Page) => { if (next === page) return; page = next; listeners.forEach(fn => fn()); };

export const getPage = () => page;
/** The page being shown; re-renders the caller when it changes. */
export const usePage = () => useSyncExternalStore(subscribe, getPage);

/** Shows the page at `href` ("/data", "/company#history"). */
export function navigate(href: string) {
  const url = new URL(href, location.href);
  // opened from disk (the single-file build) the address can't change; the page still does
  try { history.pushState(null, '', url.pathname + location.search + url.hash); } catch { /* file:// */ }
  const next = toPage(url.pathname);
  // already on it: just glide to the anchor, or back to the top
  if (next === page) scroll.scrollTo(url.hash.length > 1 ? url.hash : 0);
  else set(next);
}

/** Same-site links switch the page in place; back / forward follow. Returns the teardown. */
export function followLinks() {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest('a[href^="/"]'); if (!a || a.hasAttribute('target') || a.hasAttribute('download')) return;
    e.preventDefault(); navigate(a.getAttribute('href')!);
  };
  const onPop = () => set(toPage(location.pathname));
  document.addEventListener('click', onClick);
  addEventListener('popstate', onPop);
  return () => { document.removeEventListener('click', onClick); removeEventListener('popstate', onPop); };
}
