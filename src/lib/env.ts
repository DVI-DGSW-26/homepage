/** read once in the browser; false while rendering on the server */
export const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
/** --breakpoint-sm / --breakpoint-lg in src/styles/tokens.css, for matchMedia (keep them in step):
 * below SM a phone, from SM a tablet, from LG a laptop or desktop */
export const SM = '(width >= 600px)';
export const LG = '(width >= 1200px)';

export const pad2 = (n: number) => String(n).padStart(2, '0');
