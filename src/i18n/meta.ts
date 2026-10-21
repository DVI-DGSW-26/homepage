// <html lang>, <title> and the meta description follow the language (copy in locales/*.ts → meta).
import { getLang, messages, subscribe } from './store';

const apply = () => {
  const { title, description } = messages().meta;
  document.documentElement.lang = getLang();
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
};

/** Applies the document metadata now and on every language switch. Call once at start-up. */
export function syncMeta() {
  apply();
  return subscribe(apply);
}
