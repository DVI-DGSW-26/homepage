import { cn } from '../../lib/cn';

const RING = 'M8 2a6 6 0 1 0 0 12A6 6 0 1 0 8 2z';
const GLYPHS = {
  check: 'M3 8.5l3 3 7-7', play: 'M5 3l8 5-8 5z', pause: 'M4 3h3v10H4zM9 3h3v10H9z', bang: 'M8 3v6M8 12v1',
  clock: `${RING}M8 5v3l2 1.5`, ban: `${RING}M4 12l8-8`, prev: 'M10 3L5 8l5 5', next: 'M6 3l5 5-5 5', warn: 'M8 1.5l7 12.5H1z',
  spec: 'M1.5 8h13M4.5 5L1.5 8l3 3M11.5 5l3 3-3 3', visual: `${RING}M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z`, judge: 'M4 4l8 8M12 4l-8 8',
  globe: `${RING}M2 8h12M8 2c2.2 2 2.2 10 0 12M8 2c-2.2 2-2.2 10 0 12`
};
export type GlyphName = keyof typeof GLYPHS;
const FILLED = new Set<GlyphName>(['play', 'pause', 'warn']);

/** a 16 × 16 system-style glyph in the current colour, 1em square unless sized */
export function Glyph({ n, className }: { n: GlyphName; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn('size-[1em] flex-none', FILLED.has(n) ? 'fill-current' : 'fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]', className)}>
      <path d={GLYPHS[n]} />
    </svg>
  );
}
