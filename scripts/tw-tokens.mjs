// tailwind-merge has to know the design tokens' names (src/lib/cn.ts), or it reads an unknown text-*
// as a colour and drops the real colour next to it. Rather than a hand-kept copy that drifts, this
// reads them out of src/styles/tokens.css before dev and build and writes src/generated/tw-tokens.json:
// { text: ['tag', …], spacing: […], … }, one list per namespace tailwind-merge groups by.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FILE = fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url));
const OUT = fileURLToPath(new URL('../src/generated/tw-tokens.json', import.meta.url));
const NAMESPACES = ['text', 'tracking', 'leading', 'spacing', 'container', 'radius', 'breakpoint', 'ease', 'shadow'];

// `--text-title: …` → 'title'; a modifier (`--text-title--line-height`) and a reset (`--text-*`) name nothing new
const css = readFileSync(FILE, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const tokens = Object.fromEntries(NAMESPACES.map(ns => {
  const names = [...css.matchAll(new RegExp(`(?<![\w-])--${ns}-([a-z0-9-]+?)(?:--[a-z-]+)?\s*:`, 'g'))].map(m => m[1]);
  return [ns, [...new Set(names)]];
}));
mkdirSync(new URL('../src/generated/', import.meta.url), { recursive: true });
writeFileSync(OUT, JSON.stringify(tokens) + '\n');
console.log(`tw-tokens: ${Object.values(tokens).flat().length} token names`);
