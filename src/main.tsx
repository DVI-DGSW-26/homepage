import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { syncMeta } from './i18n';
import { bootReady } from './lib/boot';
import App from './App';

syncMeta();
// what is marked booting: (the header) stays hidden until the fonts are in, so it never reflows in view
bootReady.then(() => document.documentElement.toggleAttribute('data-ready', true));
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
