// Small building blocks shared by the sections.
//
// Marker classes / attributes read by the scroll reveals in src/lib/reveals.ts (they carry no styles):
//   .rv           fades up once as it scrolls in
//   [data-batch]  its .rv children reveal together, staggered
//   [data-wipe]   photo frame that wipes open from the bottom
//   [data-count]  a number that counts up from 0
import type { ComponentProps, ReactNode } from 'react';
import { Img } from './Img';
import { extendTailwindMerge } from 'tailwind-merge';

// Every font size here is an arbitrary value (text-[...]), which sets font-size only, so a size must
// not knock out a leading-* next to it — tailwind-merge's default assumes it does (as text-lg would).
export const cn = extendTailwindMerge({
  override: { conflictingClassGroups: { 'font-size': [] } },
  extend: { theme: { radius: ['card'] } }   // rounded-card (styles.css @theme)
});

/** Every page section. */
export function Section({ className, ...rest }: ComponentProps<'section'>) {
  return <section className={cn('relative', className)} {...rest} />;
}
/** the default vertical rhythm of a content section */
export const SEC = 'py-[clamp(96px,12vw,180px)]';

export function Eyebrow({ className, ...rest }: ComponentProps<'div'>) {
  return <div className={cn("mono flex items-center gap-3.5 text-fg-2 before:h-px before:w-[34px] before:bg-line-2 before:content-['']", className)} {...rest} />;
}

export function H2({ className, ...rest }: ComponentProps<'h2'>) {
  return <h2 className={cn('m-0 text-[clamp(1.85rem,3.9vw,3.5rem)] leading-[1.22] font-semibold tracking-[-.025em] text-balance', className)} {...rest} />;
}

export function Lead({ className, ...rest }: ComponentProps<'p'>) {
  return <p className={cn('m-0 max-w-[34em] text-fg-2', className)} {...rest} />;
}

/** eyebrow + headline on the left, lead paragraph on the right */
export function SecHead({ eyebrow, title, lead }: { eyebrow: ReactNode; title: ReactNode; lead?: ReactNode }) {
  return (
    <div className="mb-[clamp(48px,6vw,88px)] grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-end gap-[clamp(24px,4vw,64px)] max-md:grid-cols-1">
      <div>
        <Eyebrow className="rv mb-[22px]">{eyebrow}</Eyebrow>
        <H2 className="rv">{title}</H2>
      </div>
      {lead && <Lead className="rv">{lead}</Lead>}
    </div>
  );
}

/** a list heading with a hairline under it and a small label on the right */
export function IndexHead({ title, aside, as: H = 'h3', className, titleClassName }: { title: ReactNode; aside?: ReactNode; as?: 'h3' | 'h4'; className?: string; titleClassName?: string }) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-x-5 gap-y-1 border-b border-line-2 pb-3.5 text-mute', className)}>
      <H className={cn('m-0 text-[1.4rem] font-semibold text-fg', titleClassName)}>{title}</H>
      {aside != null && <span className="mono">{aside}</span>}
    </div>
  );
}

/** the photo frame: rounded, clipped, a tone behind the image while it loads */
export function Photo({ src, alt = '', sizes, className, imgClassName, children, ...rest }: Omit<ComponentProps<'div'>, 'children'> & { src: string; alt?: string; sizes?: string; imgClassName?: string; children?: ReactNode }) {
  return (
    <div className={cn('relative overflow-hidden rounded-card bg-bg-2', className)} {...rest}>
      <Img src={src} alt={alt} sizes={sizes} className={cn('size-full object-cover', imgClassName)} />
      {children}
    </div>
  );
}

/** Pill button with a fill that rises from below on hover. Returns classes, so it works on <a>, <button> and <span>. */
export function btn({ acc = false, size = 'md' }: { acc?: boolean; size?: 'sm' | 'md' | 'lg' } = {}) {
  return cn(
    "group/btn relative isolate inline-flex cursor-pointer items-center gap-3 overflow-hidden whitespace-nowrap rounded-full border border-line-2 bg-transparent px-[26px] py-4 font-sans text-[.95rem] leading-none font-semibold tracking-[.01em] text-fg",
    'transition-[color,border-color] duration-[450ms] ease-out hover:border-fg hover:text-bg',
    "before:absolute before:inset-0 before:-z-1 before:translate-y-[101%] before:bg-fg before:transition-transform before:duration-[550ms] before:ease-out before:content-[''] hover:before:translate-y-0",
    acc && 'border-acc before:bg-acc hover:border-acc hover:text-white',
    size === 'sm' && 'px-5 py-3 text-[.9rem]',
    size === 'lg' && 'px-9 py-[22px] text-[1.05rem]'
  );
}
const BTN_ICON = 'size-4 transition-transform duration-[450ms] ease-out group-hover/btn:translate-x-[3px] group-hover/btn:-translate-y-[3px]';

export function ArrowIcon({ className = BTN_ICON }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M3 13L13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function DownloadIcon({ className = BTN_ICON }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M8 2v9m0 0l4-4M8 11L4 7M3 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** a label / value row in the hero and configurator HUDs */
export function HudRow({ label, children, className, ...rest }: ComponentProps<'div'> & { label: string }) {
  return (
    <div className={cn('flex justify-between gap-6 border-b border-line py-2', className)} {...rest}>
      <span>{label}</span><b className="text-right font-medium text-fg">{children}</b>
    </div>
  );
}
