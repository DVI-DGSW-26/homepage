// The home page's way on: the three engines of the business (manufacturing, solutions, data), one
// screen split three ways by two diagonals — the middle panel narrow at the top and wide at the foot —
// each panel filled with its photograph and colour, its copy at the top. Each links to its page,
// the same pages as the menu.
//
// On arrival the diagonals draw down the screen and the three photographs open behind them together,
// top to bottom. Pointing at a panel (or tabbing to it) singles it out without any glow: the other two
// drop to grey and fall back, its own photograph comes up, its diagonals light in its colour, and one
// slash of light crosses it. Below 1200px the panels stack, split by two shallow diagonals.
// Reduced motion shows it all in place, and singles a panel out without the slash.
import { useRef, useState, type CSSProperties } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { REDUCED, pad2 } from '../lib/env';
import { useT } from '../i18n';
import { ArrowIcon, Section, cn } from './ui';
import { Img } from './Img';

// Each panel's colour: `tint` paints (the wash at the foot, its diagonals, the slash, the arrow);
// `ink` and `lit` are its legible text shades, at rest and singled out.
//
// Where everything sits. The diagonals cross the screen at these points (in % of its width, or of
// its height below 1200px). Each panel is clipped to the shape between them, so a click lands on the
// panel it looks like, and its photograph is framed on the box around that shape. `edges` are the
// diagonals bounding each panel (x1 y1 x2 y2 in the same %), wide then narrow.
//   wide:   x 37% → 26% (top → foot) and 63% → 75%
//   narrow: y 36% → 30% (left → right) and 63% → 69%
const LEFT = [37, 0, 26, 100], RIGHT = [63, 0, 75, 100], UPPER = [0, 36, 100, 30], LOWER = [0, 63, 100, 69];
const PANELS = [
  {
    to: '/company', img: 'assets/img/banners/sub-rnd.jpg', tint: 'var(--fg)', ink: 'text-fg-2', lit: 'group-data-[state=on]:text-fg',
    clip: '[clip-path:polygon(0_0,100%_0,100%_30%,0_36%)] lg:[clip-path:polygon(0_0,37%_0,26%_100%,0_100%)]',
    box: 'inset-x-0 top-0 h-[36%] lg:right-auto lg:bottom-0 lg:h-auto lg:w-[37%]',
    copy: 'top-nav-clear left-gutter w-[64%] lg:left-[max(var(--spacing-gutter),3vw)] lg:w-[28%]',
    edges: [[LEFT], [UPPER]]
  },
  {
    to: '/qac-flow', img: 'assets/img/facility/test-01.jpg', tint: 'var(--color-qf)', ink: 'text-qf-ink', lit: 'group-data-[state=on]:text-qf-ink',
    clip: '[clip-path:polygon(0_36%,100%_30%,100%_69%,0_63%)] lg:[clip-path:polygon(37%_0,63%_0,75%_100%,26%_100%)]',
    box: 'inset-x-0 top-[30%] h-[39%] lg:top-0 lg:right-auto lg:bottom-0 lg:left-[26%] lg:h-auto lg:w-[49%]',
    copy: 'top-[calc(36%+20px)] left-gutter w-[64%] lg:top-nav-clear lg:left-[39.5%] lg:w-[21%]',
    edges: [[LEFT, RIGHT], [UPPER, LOWER]]
  },
  {
    to: '/data', img: 'assets/img/hero/banner-02.jpg', tint: 'var(--acc)', ink: 'text-acc-ink', lit: 'group-data-[state=on]:text-acc-ink',
    clip: '[clip-path:polygon(0_63%,100%_69%,100%_100%,0_100%)] lg:[clip-path:polygon(63%_0,100%_0,100%_100%,75%_100%)]',
    box: 'inset-x-0 top-[63%] bottom-0 lg:top-0 lg:left-[63%]',
    copy: 'top-[calc(69%+20px)] left-gutter w-[64%] lg:top-nav-clear lg:left-[69%] lg:w-[27%]',
    edges: [[RIGHT], [LOWER]]
  }
] as const;

/** the diagonals as drawn lines: one svg stretched over the whole screen */
function Diagonals({ lines, className, ...rest }: { lines: readonly (readonly number[])[]; className?: string; 'data-seam'?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className={cn('pointer-events-none absolute inset-0 size-full', className)} {...rest}>
      {lines.map(([x1, y1, x2, y2]) => <line key={`${x1} ${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} vectorEffect="non-scaling-stroke" />)}
    </svg>
  );
}

export function Directory() {
  const t = useT(), m = t.directory;
  const root = useRef<HTMLElement>(null);
  // the panel singled out: under the mouse, or holding keyboard focus
  const [on, setOn] = useState<number | null>(null);

  useGSAP(() => {
    if (REDUCED) return;
    const q = gsap.utils.selector(root);
    const lines = q('[data-seam]'), worlds = q('[data-world]'), copy = q('[data-copy]');
    // the diagonals run down the screen, or across it where the panels stack
    gsap.set(lines, { clipPath: (_: number, el: Element) => (el as HTMLElement).dataset.seam === 'x' ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 100% 0%)' });
    gsap.set(worlds, { clipPath: 'inset(0% 0% 100% 0%)' });
    gsap.set(copy, { y: -18, opacity: 0 });
    const tl = gsap.timeline({ paused: true })
      .to(lines, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut' }, 0)
      // the three open together, a hair apart
      .to(worlds, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut', stagger: .1 }, .25)
      .to(copy, { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .08 }, .7);
    ScrollTrigger.create({ trigger: root.current, start: 'top 65%', once: true, onEnter: () => { tl.play(); } });
  }, { scope: root });

  return (
    <Section ref={root} id="pages" aria-label={m.label} className="h-svh min-h-140 overflow-hidden bg-bg low:min-h-0">
      {PANELS.map(({ to, img, tint, ink, lit, clip, box, copy, edges }, i) => {
        const p = m.pages[to];
        return (
          <a key={to} href={to} style={{ '--tint': tint } as CSSProperties}
            // a tap on a touch screen just follows the link; only a mouse singles a panel out
            onPointerEnter={e => { if (e.pointerType === 'mouse') setOn(i); }} onPointerLeave={() => setOn(null)}
            onFocus={() => setOn(i)} onBlur={() => setOn(null)}
            data-state={on === null ? undefined : on === i ? 'on' : 'off'}
            className={cn('group absolute inset-0 text-fg outline-none', clip)}>
            {/* the panel's photograph under its colour, dark at the top where the copy sits */}
            <span data-world aria-hidden="true" className={cn('absolute overflow-hidden', box)}>
              <Img src={img} sizes="(max-width: 1199px) 100vw, 50vw" alt=""
                className={cn('absolute inset-0 size-full object-cover opacity-55 transition-[opacity,scale,filter] duration-700 ease-out light:opacity-45',
                  'group-data-[state=on]:scale-104 group-data-[state=on]:opacity-85 light:group-data-[state=on]:opacity-65',
                  'group-data-[state=off]:opacity-25 group-data-[state=off]:grayscale light:group-data-[state=off]:opacity-20')} />
              <span className="absolute inset-0 bg-linear-to-t from-(--tint)/35 to-transparent to-60% mix-blend-screen transition-opacity duration-700 group-data-[state=off]:opacity-0 light:mix-blend-multiply light:from-(--tint)/25" />
              <span className="absolute inset-0 bg-linear-to-b from-bg/90 via-bg/40 via-45% to-bg/10 light:from-bg/90 light:via-bg/50" />
              {/* the slash: one band of light that crosses the panel as it is singled out, and is simply gone when it is let go */}
              <span className={cn('absolute inset-0 bg-[linear-gradient(115deg,transparent_42%,color-mix(in_srgb,var(--tint)_32%,transparent)_50%,transparent_58%)] bg-size-[300%_100%] bg-position-[100%_0] opacity-0 mix-blend-screen light:mix-blend-multiply motion-reduce:hidden',
                'group-data-[state=on]:bg-position-[0%_0] group-data-[state=on]:opacity-100 group-data-[state=on]:transition-[background-position] group-data-[state=on]:duration-1200 group-data-[state=on]:ease-in-out')} />
            </span>
            {/* its own diagonals, lit in its colour while it is singled out (half the width shows: the panel is clipped on them) */}
            <Diagonals lines={edges[0]} className="stroke-(--tint) stroke-[3px] opacity-0 transition-opacity duration-500 group-data-[state=on]:opacity-100 max-lg:hidden" />
            <Diagonals lines={edges[1]} className="stroke-(--tint) stroke-[3px] opacity-0 transition-opacity duration-500 group-data-[state=on]:opacity-100 lg:hidden" />

            <span data-copy className={cn('absolute grid content-start gap-3 max-lg:gap-2', copy)}>
              <span className="grid content-start gap-3 transition-opacity duration-500 group-data-[state=off]:opacity-45 max-lg:gap-2">
                <span className={cn('flex items-baseline gap-2.5', ink)}>
                  <span className="mono">Engine {pad2(i + 1)}</span><span className="text-small font-semibold">{p.engine}</span>
                  {/* a rule that runs out from the label */}
                  <i aria-hidden="true" className="h-px w-10 origin-left scale-x-0 self-center bg-current transition-transform duration-500 ease-out group-data-[state=on]:scale-x-100" />
                </span>
                <b className={cn('font-display text-domain leading-none font-extrabold tracking-display uppercase transition-colors duration-500', lit)}>{t.nav.links[to]}</b>
                <span className="text-body-sm leading-copy text-fg-2 max-lg:hidden">{p.body}</span>
                <span className="flex items-center gap-3">
                  <span className="grid size-9 flex-none place-items-center rounded-full border border-line-2 bg-bg/40 transition-[border-color,background-color] duration-500 group-data-[state=on]:border-(--tint) group-data-[state=on]:bg-(--tint)/25 max-sm:size-8">
                    <ArrowIcon className="size-3.5 transition-transform duration-450 ease-out group-data-[state=on]:translate-x-0.5 group-data-[state=on]:-translate-y-0.5" />
                  </span>
                  <span className={cn('flex flex-wrap gap-x-2 gap-y-1 text-caption', ink)}>
                    {p.tags.map((tag, k) => <span key={tag}>{k > 0 && <i aria-hidden="true" className="mr-2 not-italic opacity-50">·</i>}{tag}</span>)}
                  </span>
                </span>
              </span>
            </span>
          </a>
        );
      })}
      {/* the two diagonals */}
      <Diagonals data-seam="y" lines={[LEFT, RIGHT]} className="stroke-line-2 max-lg:hidden" />
      <Diagonals data-seam="x" lines={[UPPER, LOWER]} className="stroke-line-2 lg:hidden" />
    </Section>
  );
}
