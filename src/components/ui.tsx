// Small building blocks shared by the sections.
//
// Marker classes / attributes read by the scroll reveals in src/lib/reveals.ts (they carry no styles):
//   .rv           fades up once as it scrolls in
//   [data-batch]  its .rv children reveal together, staggered
//   [data-count]  a number that counts up from 0
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';

/** One chapter of a page: a full-width band with its own rule, every other one on the second surface,
 * so the chapters read as separate pages-within-the-page rather than one long column.
 * Behind the content, kept quiet so they fill the space without competing with it:
 * - alt: a dot grid, fading out toward the edges
 * - cover: the screen's height, a line grid and a green glow (a page's opening band)
 * - mark: a large outlined chapter mark ("01") at the top right */
export function Band({ alt, cover, mark, className, children, ...rest }: ComponentProps<'section'> & { alt?: boolean; cover?: boolean; mark?: string }) {
  return (
    <section className={cn('relative isolate overflow-hidden border-t border-line py-section first:border-t-0', alt && 'bg-bg-2', cover && 'grid min-h-svh content-center', className)} {...rest}>
      {alt && <div aria-hidden="true" className="absolute inset-0 -z-1 deco-dots mask-[radial-gradient(ellipse_80%_70%_at_50%_40%,#000,transparent)]" />}
      {cover && <>
        <div aria-hidden="true" className="absolute inset-0 -z-1 deco-grid mask-[radial-gradient(ellipse_70%_60%_at_60%_45%,#000,transparent)]" />
        <div aria-hidden="true" className="absolute top-1/10 -right-1/10 -z-1 size-glow rounded-full bg-radial/srgb from-acc-glow to-transparent to-65% blur-2xl" />
      </>}
      <div className="wrap relative">
        {mark && <span aria-hidden="true" className="pointer-events-none absolute -top-4 right-0 -z-1 font-display text-mark leading-none font-extrabold select-none hollow-deco max-sm:hidden">{mark}</span>}
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({ className, ...rest }: ComponentProps<'div'>) {
  return <div className={cn("mono flex items-center gap-3.5 text-fg-2 before:h-px before:w-8.5 before:bg-line-2", className)} {...rest} />;
}

/** a block's kicker: mono caps after a short green rule; `center` rules it on both sides */
export function Kicker({ center, className, ...rest }: ComponentProps<'p'> & { center?: boolean }) {
  return <p className={cn('mono m-0 flex items-center gap-3 text-qf-ink before:h-0.5 before:w-6 before:rounded-full before:bg-qf', center && 'after:h-0.5 after:w-6 after:rounded-full after:bg-qf', className)} {...rest} />;
}

export function H2({ className, ...rest }: ComponentProps<'h2'>) {
  return <h2 className={cn('m-0 text-h2 leading-h2 font-semibold tracking-tight text-balance', className)} {...rest} />;
}

export function Lead({ className, ...rest }: ComponentProps<'p'>) {
  return <p className={cn('m-0 max-w-lead text-fg-2', className)} {...rest} />;
}

/** a 24×24 line icon drawn with the current colour; `d` is its path (ICON in ./icons) */
export function LineIcon({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('fill-none stroke-current stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]', className)}>
      <path d={d} />
    </svg>
  );
}
