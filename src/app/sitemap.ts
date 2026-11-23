// /sitemap.xml: every page in both languages, each listing its other-language twin (hreflang), so search
// engines find the English pages and pair them with the Korean ones. Submit it in Google Search Console
// and Naver Search Advisor.
import type { MetadataRoute } from 'next';
import { LANGS, PAGES, type Page } from '../lib/paths';
import { urlOf } from '../site/seo';

/** how much each page matters next to the others, for the crawler's order */
const PRIORITY: Record<Page, number> = { '/qac-flow': 1, '/data': 0.8, '/privacy': 0.3 };

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.flatMap(page => LANGS.map(lang => ({
    url: urlOf(page, lang),
    lastModified,
    changeFrequency: page === '/privacy' ? 'yearly' as const : 'monthly' as const,
    priority: lang === 'ko' ? PRIORITY[page] : PRIORITY[page] * 0.9,
    alternates: { languages: { ko: urlOf(page, 'ko'), en: urlOf(page, 'en'), 'x-default': urlOf(page, 'ko') } }
  })));
}
