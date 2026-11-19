import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// the webfonts, served from this site rather than Google Fonts, so no visitor's IP goes to Google (privacy
// policy). Only the weights the type scale uses; Plex Sans KR comes in unicode-range slices, so a page loads
// just the Hangul it shows.
import '@fontsource/big-shoulders-display/700';
import '@fontsource/big-shoulders-display/800';
import '@fontsource/big-shoulders-display/900';
import '@fontsource/ibm-plex-mono/400';
import '@fontsource/ibm-plex-mono/500';
import '@fontsource/ibm-plex-sans-kr/400';
import '@fontsource/ibm-plex-sans-kr/500';
import '@fontsource/ibm-plex-sans-kr/600';
import '@fontsource/ibm-plex-sans-kr/700';
import './styles/index.css';
import { syncMeta } from './i18n';
import { bootReady } from './lib/boot';
import App from './App';

syncMeta();
// what is marked booting: (the header) stays hidden until the fonts are in, so it never reflows in view
bootReady.then(() => document.documentElement.toggleAttribute('data-ready', true));
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
