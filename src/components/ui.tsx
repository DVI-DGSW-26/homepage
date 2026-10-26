// Small building blocks shared by the sections.
//
// Marker classes / attributes read by the scroll reveals in src/lib/reveals.ts (they carry no styles):
//   .rv           fades up once as it scrolls in
//   [data-batch]  its .rv children reveal together, staggered
//   [data-count]  a number that counts up from 0
import type { ComponentProps } from 'react';
import { extendTailwindMerge } from 'tailwind-merge';

// Tailwind-merge needs the token names from src/token.css, or it reads an unknown text-* as a
// colour and drops the real colour next to it. None of the text sizes carries a line-height, so a
// size must not knock out a leading-* either (tailwind-merge assumes it does, as text-lg would).
export const cn = extendTailwindMerge({
  override: { conflictingClassGroups: { 'font-size': [] } },
  extend: {
    theme: {
      text: ['tag', 'micro', 'label', 'mono-sm', 'mono', 'caption', 'small', 'body-sm', 'body', 'body-lg', 'page', 'title-xs', 'title', 'title-lg',
        'menu', 'h2', 'h2-lg', 'wordmark', 'stat', 'milestone'],
      tracking: ['heading', 'heading-sm'],
      leading: ['display', 'h2', 'title', 'caption', 'copy', 'page'],
      spacing: ['gutter', 'wrap', 'section', 'sec-head', 'stack-sm', 'panel-pad', 'nav-gap', 'nav-gap-tight', 'logo', 'hinge', 'hinge-gap'],
      container: ['page', 'lead'],
      radius: ['card', 'pill'],
      breakpoint: ['2xs', 'sm', 'md', 'lg', 'xl'],
      ease: ['out', 'theme'],
      shadow: ['device']
    }
  }
});

/** One chapter of a page: a full-width band with its own rule, every other one on the second surface,
 * so the chapters read as separate pages-within-the-page rather than one long column.
 * Behind the content, kept quiet so they fill the space without competing with it:
 * - alt: a dot grid, fading out toward the edges
 * - cover: the screen's height, a line grid and a green glow (a page's opening band)
 * - mark: a large outlined chapter mark ("01") at the top right */
export function Band({ alt, cover, mark, className, children, ...rest }: ComponentProps<'section'> & { alt?: boolean; cover?: boolean; mark?: string }) {
  return (
    <section className={cn('relative isolate overflow-hidden border-t border-line py-section first:border-t-0', alt && 'bg-bg-2', cover && 'grid min-h-svh content-center', className)} {...rest}>
      {alt && <div aria-hidden="true" className="absolute inset-0 -z-1 bg-[radial-gradient(var(--color-deco)_1.2px,transparent_1.2px)] bg-size-[22px_22px] mask-[radial-gradient(ellipse_80%_70%_at_50%_40%,#000,transparent)]" />}
      {cover && <>
        <div aria-hidden="true" className="absolute inset-0 -z-1 bg-[linear-gradient(var(--color-deco)_1px,transparent_1px),linear-gradient(90deg,var(--color-deco)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_70%_60%_at_60%_45%,#000,transparent)]" />
        <div aria-hidden="true" className="absolute top-[10%] right-[-10%] -z-1 size-[min(70vw,760px)] rounded-full bg-[radial-gradient(circle,var(--color-acc-glow),transparent_65%)] blur-2xl" />
      </>}
      <div className="wrap relative">
        {mark && <span aria-hidden="true" className="pointer-events-none absolute -top-4 right-0 -z-1 font-display text-[clamp(7rem,16vw,15rem)] leading-none font-extrabold text-transparent select-none [-webkit-text-stroke:1.5px_var(--color-deco)] max-sm:hidden">{mark}</span>}
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({ className, ...rest }: ComponentProps<'div'>) {
  return <div className={cn("mono flex items-center gap-3.5 text-fg-2 before:h-px before:w-8.5 before:bg-line-2", className)} {...rest} />;
}

export function H2({ className, ...rest }: ComponentProps<'h2'>) {
  return <h2 className={cn('m-0 text-h2 leading-h2 font-semibold tracking-tight text-balance', className)} {...rest} />;
}

export function Lead({ className, ...rest }: ComponentProps<'p'>) {
  return <p className={cn('m-0 max-w-lead text-fg-2', className)} {...rest} />;
}

/** a 24×24 line icon drawn with the current colour; `d` is the path (Q.A.C-Flow, the data-industry roadmap) */
export function LineIcon({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('fill-none stroke-current stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]', className)}>
      <path d={d} />
    </svg>
  );
}
