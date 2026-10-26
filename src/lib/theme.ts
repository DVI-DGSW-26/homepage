// Colour mode: dark (graphite, the default) or light (anodized aluminum), switched with the header button.
//
// The inline script in index.html applies a remembered choice before the first paint, so a light
// visitor never sees a dark flash; this module picks the state up from <html> from there on.
// A switch is compositor-only: html[data-bg] turns the page background at once while html[data-fade]
// fades a layer of the old colour out over it (animation.css), and html[data-mode] flips the colour
// tokens a beat later, at the crossfade midpoint. data-fade goes when the fade ends, taking the layer
// with it, so the page is never left composited over it (which turns Windows text greyscale).
import { useSyncExternalStore } from 'react';
import { REDUCED } from './env';

export type Theme = 'dark' | 'light';
const STORE = 'dv-theme';
const root = document.documentElement;
let theme: Theme = root.dataset.mode === 'light' ? 'light' : 'dark';
let timer = 0, fadeTimer = 0;
/** the crossfade's length, --duration-theme in token.css */
const FADE = 620;

const listeners = new Set<() => void>();
export const subscribeTheme = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
export const getTheme = () => theme;
/** The current mode; re-renders the caller when it changes. */
export const useTheme = () => useSyncExternalStore(subscribeTheme, getTheme);

export function setTheme(next: Theme) {
  if (next === theme) return;
  theme = next;
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
    timer = window.setTimeout(() => { root.dataset.mode = next; }, 229);
    fadeTimer = window.setTimeout(() => { delete root.dataset.fade; }, FADE);
  }
  listeners.forEach(fn => fn());
}
