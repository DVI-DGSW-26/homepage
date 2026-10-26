export const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
/** --breakpoint-lg in src/styles/tokens.css, for matchMedia (keep them in step) */
export const LG = '(width >= 1200px)';

export const pad2 = (n: number) => String(n).padStart(2, '0');
