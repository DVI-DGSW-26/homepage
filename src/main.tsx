import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// the webfonts, served from this site rather than Google Fonts, so no visitor's IP goes to Google (privacy
// policy). Only the weights the type scale uses. Plex Sans KR is cut down to the site's own characters
// (scripts/fonts.mjs); the full face is declared only when a form field needs it (src/lib/fonts.ts).
import '@fontsource/big-shoulders-display/700';
import '@fontsource/big-shoulders-display/800';
import '@fontsource/big-shoulders-display/900';
import '@fontsource/ibm-plex-mono/400';
import '@fontsource/ibm-plex-mono/500';
import './generated/fonts/fonts.css';
import './styles/index.css';
import { syncMeta } from './i18n';
import { bootReady } from './lib/boot';
import { fullFaceOnInput } from './lib/fonts';
import App from './App';

syncMeta();
fullFaceOnInput();
// what is marked booting: (the header) stays hidden until the fonts are in, so it never reflows in view
bootReady.then(() => document.documentElement.toggleAttribute('data-ready', true));
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
