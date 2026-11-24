// The <html> of every page, rendered on the server: the language the address says (<html lang>), the
// webfonts and styles, and the inline script that applies a remembered light mode before the first paint
// (the rest lives in src/lib/theme.ts). Korean (src/app/(ko)) and English (src/app/(en)/en) each have a
// root layout that renders this with its language.
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
// the webfonts, served from this site rather than Google Fonts, so no visitor's IP goes to Google (privacy
// policy). Only the weights the type scale uses. Plex Sans KR is cut down to the site's own characters
// (scripts/fonts.mjs); the full face is declared only when a form field needs it (src/lib/fonts.ts).
import '@fontsource/big-shoulders-display/700';
import '@fontsource/big-shoulders-display/800';
import '@fontsource/big-shoulders-display/900';
import '@fontsource/ibm-plex-mono/400';
import '@fontsource/ibm-plex-mono/500';
import '../generated/fonts/fonts.css';
import '../styles/index.css';
import type { Lang } from '../lib/paths';
import { ORIGIN } from '../lib/site';

/** before the first paint: the saved dark mode (light, white, is the default), and the CES notice bar if it was closed (CesBar) */
const THEME = `try{var r=document.documentElement;if(localStorage.getItem('dv-theme')==='dark'){r.dataset.mode=r.dataset.bg='dark'}if(localStorage.getItem('dv-ces-bar-2')==='closed'){r.dataset.cesBar='closed'}}catch(e){}`;

/** what every page shares in its <head>; each page adds its own title, description and addresses (src/site/seo.ts) */
export const siteMetadata: Metadata = {
  metadataBase: new URL(ORIGIN),
  applicationName: 'QAC FLOW',
  authors: [{ name: 'DVISION', url: ORIGIN }],
  creator: 'DVISION',
  publisher: 'DVISION',
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [
      { url: '/assets/img/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/assets/img/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/assets/img/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/assets/img/favicon-192.png', type: 'image/png', sizes: '192x192' }
    ],
    apple: '/assets/img/apple-touch-icon.png'
  },
  // Search Console (Google) and Search Advisor (Naver) ownership, once the codes are set in the environment
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NAVER_SITE_VERIFICATION ? { 'naver-site-verification': process.env.NAVER_SITE_VERIFICATION } : undefined
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
};

export const siteViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // the browser's bar in the page's own graphite (dark) or aluminum (light)
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' }
  ]
};

export function RootLayout({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    // the theme script may change data-mode / data-bg before React hydrates
    <html lang={lang} data-mode="light" data-bg="light" suppressHydrationWarning>
      <head>
        <script id="dv-theme" dangerouslySetInnerHTML={{ __html: THEME }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

/** structured data for search engines (src/site/seo.ts), as a script in the page */
export function JsonLd({ data }: { data: object }) {
  // "<" escaped, so no string in the data can close the script
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
