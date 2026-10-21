// Design tokens (src/token.css) for code that can't use classes: the canvases and the WebGL scenes.
const root = document.documentElement;

/** The current value of a custom property, e.g. token('--scene-alu') → '#D9DEE5'. */
export const token = (name: string) => getComputedStyle(root).getPropertyValue(name).trim();

/** A `#rrggbb` token as an rgba() string, for canvas gradient stops. */
export function withAlpha(hex: string, a: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** A set of mode tokens, read once and again after every colour-mode switch (html[data-mode]). */
export function modeTokens<K extends string>(names: Record<K, string>) {
  let cache: Record<K, string> | null = null;
  const mo = new MutationObserver(() => { cache = null; });
  mo.observe(root, { attributes: true, attributeFilter: ['data-mode'] });
  return {
    get(): Record<K, string> {
      if (!cache) { const cs = getComputedStyle(root); cache = {} as Record<K, string>; for (const k in names) cache[k] = cs.getPropertyValue(names[k]).trim(); }
      return cache;
    },
    destroy() { mo.disconnect(); }
  };
}
