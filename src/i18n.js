// Language state and the static-copy swap.
//
// Korean is the source of truth in index.html; the English version of each string
// rides along on the element as data-en (text), data-en-html (markup that has to
// survive, e.g. the manifesto's <em class="k">), or data-en-alt / -aria / -ph.
//
// applyStatic() runs as the first statement of main.js, before GSAP splits any
// headline into lines and before any list is rendered, so nothing has to be
// re-split or re-measured afterwards. Switching language stores the choice and
// reloads for the same reason.

const STORE = 'dv-lang';
const ALLOWED = ['ko', 'en'];

const stored = () => { try { return localStorage.getItem(STORE); } catch { return null; } };
const fromUrl = () => { try { return new URL(location.href).searchParams.get('lang'); } catch { return null; } };

// ?lang=en wins over the stored choice, so an English link can be shared as-is.
const requested = fromUrl();
export const LANG = ALLOWED.includes(requested) ? requested : (stored() === 'en' ? 'en' : 'ko');
export const EN = LANG === 'en';

if (requested && ALLOWED.includes(requested)) {
  try { localStorage.setItem(STORE, requested); } catch { /* private mode */ }
}

/** Pick the English string when it exists, otherwise fall back to the Korean one. */
export const t = (ko, en) => (EN && en != null && en !== '' ? en : ko);

export const setLang = (lang) => {
  if (!ALLOWED.includes(lang) || lang === LANG) return;
  try { localStorage.setItem(STORE, lang); } catch { /* private mode: the toggle just won't stick */ }
  // a ?lang= already in the address bar would outrank the stored choice on reload
  const url = new URL(location.href);
  if (url.searchParams.has('lang')) { url.searchParams.set('lang', lang); location.href = url.toString(); return; }
  location.reload();
};

const META = {
  title: 'DVISION — Precision Aluminum',
  desc: 'DVISION supplies automotive, industrial, architectural and aerospace & defense components through aluminum extrusion and precision machining, from Daegu, Korea.'
};

export function applyStatic(root = document) {
  wireToggle();
  if (!EN) return;

  document.documentElement.lang = 'en';
  document.title = META.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', META.desc);

  root.querySelectorAll('[data-en]').forEach(el => { el.textContent = el.dataset.en; });
  root.querySelectorAll('[data-en-html]').forEach(el => { el.innerHTML = el.dataset.enHtml; });
  root.querySelectorAll('[data-en-alt]').forEach(el => { el.setAttribute('alt', el.dataset.enAlt); });
  root.querySelectorAll('[data-en-aria]').forEach(el => { el.setAttribute('aria-label', el.dataset.enAria); });
  root.querySelectorAll('[data-en-ph]').forEach(el => { el.setAttribute('placeholder', el.dataset.enPh); });
}

function wireToggle() {
  const box = document.querySelector('.lang');
  if (!box) return;
  box.querySelectorAll('button[data-lang]').forEach(b => {
    b.classList.toggle('is-on', b.dataset.lang === LANG);
    b.setAttribute('aria-pressed', String(b.dataset.lang === LANG));
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
}
