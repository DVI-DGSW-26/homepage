/// <reference types="node" />
// tailwind-merge has to know the design tokens' names (src/lib/cn.ts), or it reads an unknown text-*
// as a colour and drops the real colour next to it. Rather than a hand-kept copy that drifts, this
// reads them out of src/styles/tokens.css at build time: `import TOKENS from 'virtual:tw-tokens'`
// gives { text: ['tag', …], spacing: […], … }, one list per namespace tailwind-merge groups by.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const FILE = fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url));
const NAMESPACES = ['text', 'tracking', 'leading', 'spacing', 'container', 'radius', 'breakpoint', 'ease', 'shadow'];
const ID = 'virtual:tw-tokens', RESOLVED = '\0' + ID;

/** `--text-title: …` → 'title'; a modifier (`--text-title--line-height`) and a reset (`--text-*`) name nothing new */
function read(css: string) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return Object.fromEntries(NAMESPACES.map(ns => {
    const names = [...css.matchAll(new RegExp(`(?<![\\w-])--${ns}-([a-z0-9-]+?)(?:--[a-z-]+)?\\s*:`, 'g'))].map(m => m[1]);
    return [ns, [...new Set(names)]];
  }));
}

export function twTokens(): Plugin {
  return {
    name: 'tw-tokens',
    resolveId: id => (id === ID ? RESOLVED : undefined),
    load(id) {
      if (id !== RESOLVED) return;
      this.addWatchFile(FILE);
      return `export default ${JSON.stringify(read(readFileSync(FILE, 'utf8')))};`;
    }
  };
}
