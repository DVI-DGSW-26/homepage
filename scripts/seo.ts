// Vite plugin: the head that crawlers and link previews (KakaoTalk, LinkedIn, mail) read without running
// the page's script — title, description, canonical, hreflang, Open Graph — for each page in each language.
//
// index.html carries a <!--seo--> marker. Here it becomes the head of QAC FLOW in Korean (also in
// `pnpm dev`), and after a build every other page × language is written next to it, under dist/_seo/:
//   /             index.html             /?lang=en          _seo/qac-flow.en.html
//   /data         _seo/data.ko.html      /data?lang=en      _seo/data.en.html
//   /privacy      _seo/privacy.ko.html   /privacy?lang=en   _seo/privacy.en.html
// vercel.json serves the Korean ones, middleware.ts the ?lang=en ones. The page itself still sets the
// title and canonical as the reader switches language or page (src/i18n/meta.ts).
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
// With extensions, unlike the rest of src/: these files (and what they import) load in Vite's own config
// loader, which wants them spelled out (`configLoader: 'native'`)
import { ko } from '../src/i18n/locales/ko.ts';
import { en } from '../src/i18n/locales/en.ts';
import { ORIGIN } from '../src/lib/site.ts';

type Lang = 'ko' | 'en';
type Page = keyof typeof ko.meta & `/${string}`;

/** each page: its public path and its file name under _seo/ */
export const SEO_PAGES: { page: Page; path: string; name: string }[] = [
  { page: '/qac-flow', path: '/', name: 'qac-flow' },
  { page: '/data', path: '/data', name: 'data' },
  { page: '/privacy', path: '/privacy', name: 'privacy' }
];

/** the link preview image, 1200×630, one per language (public/og/; for now the QAC FLOW hero, captured) */
const OG = { ko: '/og/qac-flow-ko.png', en: '/og/qac-flow-en.png' };
const DICTS = { ko, en };
const LOCALE = { ko: 'ko_KR', en: 'en_US' };
const MARK = /<!--seo-->(?:[\s\S]*?<!--\/seo-->)?/;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const url = (p: string, lang: Lang) => ORIGIN + p + (lang === 'en' ? '?lang=en' : '');

function head(page: Page, lang: Lang) {
  const { path: p } = SEO_PAGES.find(x => x.page === page)!;
  const m = DICTS[lang].meta, { title, description } = m[page];
  const other: Lang = lang === 'ko' ? 'en' : 'ko';
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="canonical" href="${url(p, lang)}">`,
    `<link rel="alternate" hreflang="ko" href="${url(p, 'ko')}">`,
    `<link rel="alternate" hreflang="en" href="${url(p, 'en')}">`,
    `<link rel="alternate" hreflang="x-default" href="${url(p, 'ko')}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="DVISION">`,
    `<meta property="og:title" content="${esc(title.replace(/ \| DVISION$/, ''))}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${url(p, lang)}">`,
    `<meta property="og:locale" content="${LOCALE[lang]}">`,
    `<meta property="og:locale:alternate" content="${LOCALE[other]}">`,
    `<meta property="og:image" content="${ORIGIN}${OG[lang]}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(m.image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`
  ];
  return `<!--seo-->\n${tags.join('\n')}\n<!--/seo-->`;
}

const variant = (html: string, page: Page, lang: Lang) =>
  html.replace(MARK, head(page, lang)).replace(/<html lang="\w+"/, `<html lang="${lang}"`);

export function seo(): Plugin {
  return {
    name: 'dv-seo',
    transformIndexHtml: { order: 'pre', handler: html => variant(html, '/qac-flow', 'ko') },
    async writeBundle({ dir }) {
      if (!dir) return;
      const html = await fs.readFile(path.join(dir, 'index.html'), 'utf8');
      await fs.mkdir(path.join(dir, '_seo'), { recursive: true });
      await Promise.all(SEO_PAGES.flatMap(({ page, name }) => (['ko', 'en'] as const).map(lang =>
        fs.writeFile(path.join(dir, '_seo', `${name}.${lang}.html`), variant(html, page, lang)))));
    }
  };
}
