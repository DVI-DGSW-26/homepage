// Site-wide brightness: DARK (default) or LIGHT.
//
// Sections declare their tone with data-theme and main.js crossfades between them on
// scroll. LIGHT simply re-tags every section as light before those triggers are built,
// except the cinematic ones (hero, statement) whose 3D scene and photo overlays are
// composed for a dark ground. Like the language toggle, the choice is stored and the
// page reloads, and ?theme=light wins so a light link can be shared as-is.

const STORE = 'dv-theme';
const ALLOWED = ['dark', 'light'];
const KEEP_DARK = '#hero, #statement';

const stored = () => { try { return localStorage.getItem(STORE); } catch { return null; } };
const fromUrl = () => { try { return new URL(location.href).searchParams.get('theme'); } catch { return null; } };

const requested = fromUrl();
export const THEME = ALLOWED.includes(requested) ? requested : (stored() === 'light' ? 'light' : 'dark');
export const LIGHT = THEME === 'light';

if (requested && ALLOWED.includes(requested)) {
  try { localStorage.setItem(STORE, requested); } catch { /* private mode */ }
}

export const setTheme = (theme) => {
  if (!ALLOWED.includes(theme) || theme === THEME) return;
  try { localStorage.setItem(STORE, theme); } catch { /* private mode: the toggle just won't stick */ }
  const url = new URL(location.href);
  if (url.searchParams.has('theme')) { url.searchParams.set('theme', theme); location.href = url.toString(); return; }
  location.reload();
};

export function applyTheme(root = document) {
  wireToggle();
  if (!LIGHT) return;
  document.documentElement.classList.add('is-light-site');
  root.querySelectorAll('section[data-theme="dark"]').forEach(sec => { if (!sec.matches(KEEP_DARK)) sec.dataset.theme = 'light'; });
}

function wireToggle() {
  const box = document.querySelector('.tgl-theme');
  if (!box) return;
  box.querySelectorAll('button[data-theme-set]').forEach(b => {
    b.classList.toggle('is-on', b.dataset.themeSet === THEME);
    b.setAttribute('aria-pressed', String(b.dataset.themeSet === THEME));
    b.addEventListener('click', () => setTheme(b.dataset.themeSet));
  });
}
