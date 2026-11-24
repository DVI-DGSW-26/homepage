// Everything search engines and link previews read, built on the server from the same dictionaries the
// pages print (src/i18n/locales): each page's <head> (title, description, canonical, hreflang, Open
// Graph, Twitter card) through Next's Metadata API, and the structured data (JSON-LD) that tells them
// who the company is, what QAC FLOW is, and where a page sits in the site.
import type { Metadata } from 'next';
import { ko } from '../i18n/locales/ko';
import { en } from '../i18n/locales/en';
import { pathOf, type Lang, type Page } from '../lib/paths';
import { ORIGIN, SALES_EMAIL, SITES, TEL } from '../lib/site';

const DICTS = { ko, en };
const LOCALE = { ko: 'ko_KR', en: 'en_US' } as const;
/** the link preview image, 1200×630, one per language (public/og/; the QAC FLOW hero at 1200 px, dark, the header hidden, captured from the built site) */
const OG = { ko: '/og/qac-flow-ko.png', en: '/og/qac-flow-en.png' } as const;
const LOGO = '/assets/img/logo.png';
/** the name search results and link previews should show for this site (WebSite.name, og:site_name) */
const SITE_NAME = 'QAC FLOW';
/** the screens named in the product's structured data, one per feature */
const SCREENS = ['ocr-input', 'mobile-photo-compare', 'report-1', 'monitor-board', 'spc-charts'];
/** a screen's address in the language (all five were captured in English as well) */
const shotOf = (name: string, lang: Lang) => `assets/img/qacflow/${lang === 'en' ? 'en/' : ''}${name}.webp`;

/** a page's full address */
export const urlOf = (page: Page, lang: Lang) => ORIGIN + (pathOf(page, lang) === '/' ? '' : pathOf(page, lang));

/** The <head> of one page in one language. The addresses are relative to metadataBase (the root layout). */
export function pageMetadata(page: Page, lang: Lang): Metadata {
  const m = DICTS[lang].meta, { title, description } = m[page];
  const other: Lang = lang === 'ko' ? 'en' : 'ko';
  // a link preview already says where it comes from (og:site_name), so it drops the " | DVISION"
  const short = title.replace(/ \| DVISION$/, '');
  const image = { url: OG[lang], width: 1200, height: 630, alt: m.image };
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: pathOf(page, lang),
      languages: { ko: pathOf(page, 'ko'), en: pathOf(page, 'en'), 'x-default': pathOf(page, 'ko') }
    },
    openGraph: {
      type: 'website',
      // the same name as the WebSite block's, so search results settle on one site name
      siteName: SITE_NAME,
      title: short,
      description,
      url: pathOf(page, lang),
      locale: LOCALE[lang],
      alternateLocale: [LOCALE[other]],
      images: [image]
    },
    twitter: { card: 'summary_large_image', title: short, description, images: [image] }
  };
}

type Json = Record<string, unknown>;

/** the company, the same on every page (its @id lets the other blocks point at it) */
function organization(lang: Lang): Json {
  const d = DICTS[lang];
  return {
    '@type': 'Organization',
    '@id': `${ORIGIN}/#organization`,
    name: lang === 'ko' ? '(주)디비전' : 'DVISION Co., Ltd.',
    alternateName: ['DVISION', '디비전'],
    url: ORIGIN,
    logo: ORIGIN + LOGO,
    email: SALES_EMAIL,
    telephone: TEL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: lang === 'ko' ? '국가산단대로33길 237' : '237, Gukgasandan-daero 33-gil',
      addressLocality: lang === 'ko' ? '달성군 구지면' : 'Guji-myeon, Dalseong-gun',
      addressRegion: lang === 'ko' ? '대구광역시' : 'Daegu',
      addressCountry: 'KR'
    },
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: SALES_EMAIL, telephone: TEL, availableLanguage: ['Korean', 'English'] },
    // the company's other sites: the start page and manufacturing
    sameAs: [SITES.gateway('ko'), SITES.manufacturing('ko')],
    description: d.qf.label
  };
}

/** the site itself */
function website(lang: Lang): Json {
  return {
    '@type': 'WebSite',
    '@id': `${ORIGIN}/#website`,
    url: ORIGIN,
    name: SITE_NAME,
    alternateName: ['콱플로우', 'QAC FLOW by DVISION', 'QAC FLOW · DVISION'],
    inLanguage: lang,
    publisher: { '@id': `${ORIGIN}/#organization` }
  };
}

/** QAC FLOW as a piece of software: what it is, on what, by whom. No price or rating is claimed. */
function product(lang: Lang): Json {
  const d = DICTS[lang], m = d.meta['/qac-flow'];
  return {
    '@type': 'SoftwareApplication',
    '@id': `${ORIGIN}/#qac-flow`,
    name: 'QAC FLOW',
    // how people search for it in Korean
    alternateName: ['콱플로우', 'QAC-FLOW'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: lang === 'ko' ? '품질검사 관리' : 'Quality inspection management',
    operatingSystem: 'Android, iOS, Web',
    description: m.description,
    url: urlOf('/qac-flow', lang),
    image: ORIGIN + OG[lang],
    inLanguage: lang,
    // the five features as the page names them, each with what it changes
    featureList: d.qf.features.items.map(x => `${x.name}: ${x.gain}`),
    // the app's real screens, in this language where they were captured in it
    screenshot: SCREENS.map(s => ORIGIN + '/' + shotOf(s, lang)),
    publisher: { '@id': `${ORIGIN}/#organization` }
  };
}

/** where a page sits under QAC FLOW, for the breadcrumb a search result can show */
function breadcrumb(page: Page, lang: Lang): Json {
  const d = DICTS[lang];
  const name = page === '/data' ? d.nav.links['/data'] : d.meta[page].title.replace(/ \| DVISION$/, '');
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'QAC FLOW', item: urlOf('/qac-flow', lang) },
      { '@type': 'ListItem', position: 2, name, item: urlOf(page, lang) }
    ]
  };
}

/** One page's structured data, as a single @graph: the company and the site on every page, QAC FLOW on
 * its own page, a breadcrumb on the others. */
export function structuredData(page: Page, lang: Lang): Json {
  const graph = [organization(lang), website(lang), page === '/qac-flow' ? product(lang) : breadcrumb(page, lang)];
  return { '@context': 'https://schema.org', '@graph': graph };
}
