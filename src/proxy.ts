// Runs before a page is served, for the addresses that changed or never existed (the planning brief:
// a wrong address goes to the main page rather than a broken one):
//   /?lang=en, /data?lang=en …  →  /en, /en/data …   (the CES QR code; permanent, so search engines move
//                                                      the old ?lang=en addresses' standing to the new ones)
//   /en?lang=ko …               →  / …
//   /qac-flow, /en/qac-flow     →  /, /en             (QAC FLOW lives at the root; permanent)
//   /ko, /ko/data …             →  /, /data …
//   anything else               →  /, or /en under /en  (temporary)
// A #anchor (/?lang=en#qac-flow) stays: the browser keeps it across a redirect.
import { NextResponse, type NextRequest } from 'next/server';

/** the pages, without the /en */
const PAGES = new Set(['/', '/data', '/privacy']);

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const prefix = /^\/(en|ko)(?=\/|$)/.exec(path)?.[1];
  let rest = prefix ? path.slice(prefix.length + 1) || '/' : path;
  const asked = url.searchParams.get('lang');
  const en = asked === 'en' || asked === 'ko' ? asked === 'en' : prefix === 'en';
  url.searchParams.delete('lang');

  let permanent = asked != null || prefix === 'ko';
  if (rest === '/qac-flow') { rest = '/'; permanent = true; }
  else if (!PAGES.has(rest)) { rest = '/'; permanent = false; }

  const target = en ? '/en' + (rest === '/' ? '' : rest) : rest;
  if (target === url.pathname && asked == null) return NextResponse.next();
  url.pathname = target;
  return NextResponse.redirect(url, permanent ? 308 : 307);
}

export const config = {
  // pages only: not the form's endpoint, Next's own files, the public folder, or the files Next writes at
  // the root (named one by one: backslash escapes in a regex do not survive the matcher's path syntax)
  matcher: ['/((?!api/|_next/|assets/|og/|favicon|sitemap|robots|manifest).*)']
};
