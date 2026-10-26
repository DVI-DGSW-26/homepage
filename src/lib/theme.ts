// Colour mode: dark (graphite, the default) or light (anodized aluminum), switched with the header button.
//
// The inline script in index.html applies a remembered choice before the first paint, so a light
// visitor never sees a dark flash; this module picks the state up from <html> from there on.
// A switch is compositor-only: html[data-bg] turns the page background at once while html[data-fade]
// fades a layer of the old colour out over it (src/styles/animation.css), and html[data-mode] flips the colour
// tokens a beat later, at the crossfade's visual midpoint. data-fade goes when the fade ends, taking the layer
// with it, so the page is never left composited over it (which turns Windows text greyscale).
import { REDUCED } from './env';
import { createStore, useStore } from './store';

export type Theme = 'dark' | 'light';
const STORE = 'dv-theme';
const root = document.documentElement;
const theme = createStore<Theme>(root.dataset.mode === 'light' ? 'light' : 'dark');
let timer = 0, fadeTimer = 0;
/** how far into the crossfade --ease-theme (cubic-bezier(.45, 0, .2, 1)) has the old colour half
 * gone, so the tokens flip unseen */
const MIDPOINT = .369;
/** the crossfade's length in ms, read from --duration-theme so the two never disagree */
const fadeMs = () => parseFloat(getComputedStyle(root).getPropertyValue('--duration-theme')) * 1000 || 620;

/** The current mode; re-renders the caller when it changes. */
export const useTheme = () => useStore(theme);

export function setTheme(next: Theme) {
  if (next === theme.get()) return;
  try { localStorage.setItem(STORE, next); } catch { /* private mode: the choice just won't stick */ }
  root.dataset.bg = next;
  clearTimeout(timer);
  clearTimeout(fadeTimer);
  if (REDUCED) { root.dataset.mode = next; delete root.dataset.fade; }
  else {
    // the old colour, restarted if a fade is still running
    delete root.dataset.fade;
    void root.offsetWidth;
    root.dataset.fade = next === 'light' ? 'dark' : 'light';
    const fade = fadeMs();
    timer = window.setTimeout(() => { root.dataset.mode = next; }, fade * MIDPOINT);
    fadeTimer = window.setTimeout(() => { delete root.dataset.fade; }, fade);
  }
  theme.set(next);
}
