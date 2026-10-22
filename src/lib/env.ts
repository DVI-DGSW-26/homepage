export const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const FINE = matchMedia('(pointer: fine)').matches;
/** The desktop / mobile split every layout and scroll scene in the page agrees on. */
export const DESKTOP = '(min-width: 901px)';
export const MOBILE = '(max-width: 900px)';

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const pad2 = (n: number) => String(n).padStart(2, '0');
