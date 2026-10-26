/** the design tokens' names by namespace, read from src/styles/tokens.css (scripts/tw-tokens.ts) */
declare module 'virtual:tw-tokens' {
  const TOKENS: Record<'text' | 'tracking' | 'leading' | 'spacing' | 'container' | 'radius' | 'breakpoint' | 'ease' | 'shadow', string[]>;
  export default TOKENS;
}
