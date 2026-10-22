export const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const FINE = matchMedia('(pointer: fine)').matches;
/** The breakpoints and shape variants of src/token.css and src/styles.css, for matchMedia (keep them in step). */
export const SM = '(width >= 600px)';
export const LG = '(width >= 1200px)';
/** one column: a phone, or any tablet held upright (the `narrow:` variant) */
export const NARROW = '(width < 600px), (width < 1200px) and (orientation: portrait)';
/** a dual-screen device spanned side by side / one screen above the other (`spanned:` / `spanned-y:`) */
export const SPANNED = '(horizontal-viewport-segments: 2)';
export const SPANNED_Y = '(vertical-viewport-segments: 2)';

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const pad2 = (n: number) => String(n).padStart(2, '0');
