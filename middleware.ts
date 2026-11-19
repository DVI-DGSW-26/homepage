// Vercel Routing Middleware: a page opened in English (?lang=en, as the CES QR code does) is served the
// English head that scripts/seo.ts wrote, so link previews and crawlers read English too. vercel.json
// can't do this: Vercel serves an existing file (index.html at "/") before any rewrite is tried, and
// middleware runs before that. Every other request passes straight through.
import { next, rewrite } from '@vercel/functions/middleware';

export const config = { matcher: ['/', '/qac-flow', '/data', '/privacy'] };

const NAMES: Record<string, string> = { '/': 'qac-flow', '/qac-flow': 'qac-flow', '/data': 'data', '/privacy': 'privacy' };

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const name = NAMES[url.pathname];
  if (!name || url.searchParams.get('lang') !== 'en') return next();
  return rewrite(new URL(`/_seo/${name}.en.html`, url));
}
