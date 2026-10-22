// The home page's way on: the three engines of the business (manufacturing, solutions, data), one
// screen split three ways by two diagonals — the middle panel narrow at the top and wide at the foot —
// each panel filled with its photograph and colour, its copy at the top. Each links to its page,
// the same pages as the menu.
//
// On arrival the diagonals draw down the screen and the three photographs open behind them together,
// top to bottom. Pointing at a panel (or tabbing to it) widens it: the diagonals slide to make room
// (their positions are registered properties, src/animation.css), its photograph comes up and its
// edges light in its colour, while the other two narrow and dim. Below 1200px the panels stack,
// split by two shallow diagonals, and stay put. Reduced motion shows it all in place.
import { useRef, useState, type CSSProperties } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { REDUCED, pad2 } from '../lib/env';
import { useT } from '../i18n';
import { ArrowIcon, Section, cn } from './ui';
import { Img } from './Img';

// Where the two diagonals cut the top and the foot of the screen (% of its width, from 1200px),
// at rest and with each panel widened.  [first top, first foot, second top, second foot]
const CUTS: Record<'rest' | 0 | 1 | 2, readonly number[]> = {
  rest: [37, 26, 63, 75],
  0: [53, 43, 73, 83],
  1: [24, 12, 76, 88],
  2: [25, 14, 47, 57]
};
const SHAPE = [
  'polygon(0 0, var(--cut-1t) 0, var(--cut-1b) 100%, 0 100%)',
  'polygon(var(--cut-1t) 0, var(--cut-2t) 0, var(--cut-2b) 100%, var(--cut-1b) 100%)',
  'polygon(var(--cut-2t) 0, 100% 0, 100% 100%, var(--cut-2b) 100%)'
];
/** a diagonal as a band `w` either side of it */
const band = (n: 1 | 2, w: string) =>
  `polygon(calc(var(--cut-${n}t) - ${w}) 0, calc(var(--cut-${n}t) + ${w}) 0, calc(var(--cut-${n}b) + ${w}) 100%, calc(var(--cut-${n}b) - ${w}) 100%)`;

// Each panel's colour: `tint` paints (the wash at the foot, its lit edges, the arrow); `ink` and `lit`
// are its legible text shades, at rest and widened. Below 1200px the panels are fixed bands:
//   y 36% → 30% (left → right) and 63% → 69%
// From 1200px the copy follows the diagonals, and each photograph is framed wide enough to fill its
// panel at its widest.
const PANELS = [
  {
    to: '/company', img: 'assets/img/banners/sub-rnd.jpg', tint: 'var(--fg)', ink: 'text-fg-2', lit: 'group-data-[state=on]:text-fg',
    narrow: 'polygon(0 0, 100% 0, 100% 30%, 0 36%)', edges: [1] as const,
    box: 'inset-x-0 top-0 h-[36%] lg:right-auto lg:bottom-0 lg:h-auto lg:w-[60%]',
    copy: 'top-nav-clear left-gutter w-[64%] lg:left-[max(var(--spacing-gutter),3vw)] lg:w-[calc(var(--cut-1t)_-_9%)]'
  },
  {
    to: '/qac-flow', img: 'assets/img/facility/test-01.jpg', tint: 'var(--color-qf)', ink: 'text-qf-ink', lit: 'group-data-[state=on]:text-qf-ink',
    narrow: 'polygon(0 36%, 100% 30%, 100% 69%, 0 63%)', edges: [1, 2] as const,
    box: 'inset-x-0 top-[30%] h-[39%] lg:top-0 lg:right-auto lg:bottom-0 lg:left-[10%] lg:h-auto lg:w-[80%]',
    copy: 'top-[calc(36%+20px)] left-gutter w-[64%] lg:top-nav-clear lg:left-[calc(var(--cut-1t)_+_2.5%)] lg:w-[calc(var(--cut-2t)_-_var(--cut-1t)_-_5%)]'
  },
  {
    to: '/data', img: 'assets/img/hero/banner-02.jpg', tint: 'var(--acc)', ink: 'text-acc-ink', lit: 'group-data-[state=on]:text-acc-ink',
    narrow: 'polygon(0 63%, 100% 69%, 100% 100%, 0 100%)', edges: [2] as const,
    box: 'inset-x-0 top-[63%] bottom-0 lg:top-0 lg:left-[44%]',
    copy: 'top-[calc(69%+20px)] left-gutter w-[64%] lg:top-nav-clear lg:left-[calc(var(--cut-2t)_+_6%)] lg:w-[calc(94%_-_var(--cut-2t)_-_max(var(--spacing-gutter),3vw))]'
  }
] as const;

export function Directory() {
  const t = useT(), m = t.directory;
  const root = useRef<HTMLElement>(null);
  // the panel widened: under the mouse, or holding keyboard focus
  const [on, setOn] = useState<0 | 1 | 2 | null>(null);
  const [c1t, c1b, c2t, c2b] = CUTS[on ?? 'rest'];
  const cuts = { '--cut-1t': `${c1t}%`, '--cut-1b': `${c1b}%`, '--cut-2t': `${c2t}%`, '--cut-2b': `${c2b}%` } as CSSProperties;

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
    <Section ref={root} id="pages" aria-label={m.label} style={cuts} className="engines h-svh min-h-140 overflow-hidden bg-bg low:min-h-0">
      {PANELS.map(({ to, img, tint, ink, lit, narrow, edges, box, copy }, i) => {
        const p = m.pages[to];
        return (
          <a key={to} href={to} style={{ '--tint': tint, '--shape': narrow, '--shape-wide': SHAPE[i] } as CSSProperties}
            // a tap on a touch screen just follows the link; only a mouse widens a panel
            onPointerEnter={e => { if (e.pointerType === 'mouse') setOn(i as 0 | 1 | 2); }} onPointerLeave={() => setOn(null)}
            onFocus={() => setOn(i as 0 | 1 | 2)} onBlur={() => setOn(null)}
            data-state={on === null ? undefined : on === i ? 'on' : 'off'}
            className="group absolute inset-0 text-fg outline-none [clip-path:var(--shape)] lg:[clip-path:var(--shape-wide)]">
            {/* the panel's photograph under its colour, dark at the top where the copy sits */}
            <span data-world aria-hidden="true" className={cn('absolute overflow-hidden', box)}>
              <Img src={img} sizes="(max-width: 1199px) 100vw, 80vw" alt=""
                className={cn('absolute inset-0 size-full object-cover opacity-55 transition-[opacity,scale] duration-800 ease-out light:opacity-45',
                  'group-data-[state=on]:scale-103 group-data-[state=on]:opacity-85 light:group-data-[state=on]:opacity-65',
                  'group-data-[state=off]:opacity-30 light:group-data-[state=off]:opacity-25')} />
              <span className="absolute inset-0 bg-linear-to-t from-(--tint)/35 to-transparent to-60% mix-blend-screen light:mix-blend-multiply light:from-(--tint)/25" />
              <span className="absolute inset-0 bg-linear-to-b from-bg/90 via-bg/40 via-45% to-bg/10 light:from-bg/90 light:via-bg/50" />
            </span>
            {/* its own diagonals, lit in its colour while it is widened (half of each band shows: the panel is clipped on it) */}
            {edges.map(n => (
              <span key={n} aria-hidden="true" style={{ clipPath: band(n, '1.5px') }}
                className="absolute inset-0 bg-(--tint) opacity-0 transition-opacity duration-500 group-data-[state=on]:opacity-100 max-lg:hidden" />
            ))}

            <span data-copy className={cn('absolute', copy)}>
              <span className="grid content-start gap-3 transition-opacity duration-500 group-data-[state=off]:opacity-50 max-lg:gap-2">
                <span className={cn('flex items-baseline gap-2.5', ink)}><span className="mono">Engine {pad2(i + 1)}</span><span className="text-small font-semibold">{p.engine}</span></span>
                <b className={cn('font-display text-domain leading-none font-extrabold tracking-display uppercase transition-colors duration-500', lit)}>{t.nav.links[to]}</b>
                {/* a narrowed panel keeps only its label and name */}
                <span className="grid gap-3 transition-opacity duration-400 group-data-[state=off]:opacity-0">
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
            </span>
          </a>
        );
      })}
      {/* the two diagonals: bands that follow the cuts from 1200px, drawn lines where the panels stack */}
      <div data-seam="y" aria-hidden="true" className="pointer-events-none absolute inset-0 max-lg:hidden">
        <span className="absolute inset-0 bg-line-2" style={{ clipPath: band(1, '.5px') }} />
        <span className="absolute inset-0 bg-line-2" style={{ clipPath: band(2, '.5px') }} />
      </div>
      <svg data-seam="x" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full stroke-line-2 lg:hidden">
        <line x1="0" y1="36" x2="100" y2="30" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="63" x2="100" y2="69" vectorEffect="non-scaling-stroke" />
      </svg>
    </Section>
  );
}
