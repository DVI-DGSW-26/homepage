import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { syncMeta } from './i18n';
import App from './App';

syncMeta();
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
