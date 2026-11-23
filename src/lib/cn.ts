// Joins class names, a later utility winning over an earlier one of the same kind
// (cn('text-fg-2', active && 'text-acc') → 'text-acc').
import { extendTailwindMerge } from 'tailwind-merge';
import TOKENS from '../generated/tw-tokens.json';

// tailwind-merge learns the token names from src/styles/tokens.css (the list is written before dev and
// build by scripts/tw-tokens.mjs). None of the text sizes carries a line-height, so a size must not knock out a
// leading-* either (tailwind-merge assumes it does, as text-lg would).
export const cn = extendTailwindMerge({
  override: { conflictingClassGroups: { 'font-size': [] } },
  extend: { theme: TOKENS }
});
