// Colour mode: dark (graphite, the default) or light (anodized aluminum), switched with the header button.
//
// The inline script in index.html applies a remembered choice before the first paint, so a light
// visitor never sees a dark flash; this module picks the state up from <html> from there on.
// A switch is compositor-only: html[data-bg] crossfades the two fixed background layers at once
// (animation.css), and html[data-mode] flips the colour tokens a beat later, at the crossfade midpoint.
import { useSyncExternalStore } from 'react';
import { REDUCED } from './env';

export type Theme = 'dark' | 'light';
const STORE = 'dv-theme';
const root = document.documentElement;
let theme: Theme = root.dataset.mode === 'light' ? 'light' : 'dark';
let timer = 0;

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
  if (REDUCED) root.dataset.mode = next;
  else timer = window.setTimeout(() => { root.dataset.mode = next; }, 229);
  listeners.forEach(fn => fn());
}
