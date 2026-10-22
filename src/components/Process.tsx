import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { FINE, REDUCED, SM, clamp, pad2 } from '../lib/env';
import { pick, useT } from '../i18n';
import { PROCESSES, type Process as Proc } from '../data';
import { Eyebrow, H2, SEC, Section, cn } from './ui';
import { Img } from './Img';

const PROCESS_IMG = 'assets/img/process/';
const HEAT = { hot: 'text-acc', warm: 'text-acc-2', cool: 'text-fg' } as const;

/**
 * Three process tracks behind tabs. From 600px the active track is a sideways strip: scrolling the
 * wheel with the pointer over it moves it along, and once it reaches an end the page scrolls on.
 * Trackpad swipes, the keyboard and touch use the strip's own native scrolling (on a touch screen
 * the cards snap). On a phone the cards stack. A card with a second photo shows it on hover, or on
 * a tap where there is no hover.
 */
export function Process() {
  const m = useT().process;
  const root = useRef<HTMLElement>(null), bar = useRef<HTMLElement>(null);
  const tracks = useRef<Partial<Record<Proc['id'], HTMLDivElement | null>>>({});
  const [procId, setProcId] = useState<Proc['id']>('ext');
  const proc = PROCESSES.find(p => p.id === procId)!;

  // vertical wheel over the strip -> horizontal travel, eased; the progress bar follows the strip
  useEffect(() => {
    const el = tracks.current[procId]; if (!el) return;
    const strip = matchMedia(SM);
    let target = el.scrollLeft, raf = 0;
    const max = () => el.scrollWidth - el.clientWidth;
    const paint = () => { const m = max(); bar.current!.style.transform = `scaleX(${m > 0 ? el.scrollLeft / m : 0})`; };
    const glide = () => {
      const d = target - el.scrollLeft;
      if (Math.abs(d) < .5) { el.scrollLeft = target; raf = 0; return; }
      el.scrollLeft += d * .2; raf = requestAnimationFrame(glide);
    };
    const onWheel = (e: WheelEvent) => {
      if (!strip.matches || e.ctrlKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      const dy = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? el.clientWidth : 1), m = max();
      if (!raf) target = el.scrollLeft;
      if ((dy > 0 && target >= m - 1) || (dy < 0 && target <= 1)) return;   // at an end: the page scrolls on
      e.preventDefault();
      target = clamp(target + dy, 0, m);
      if (REDUCED) el.scrollLeft = target;
      else if (!raf) raf = requestAnimationFrame(glide);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', paint, { passive: true });
    paint();
    return () => { cancelAnimationFrame(raf); el.removeEventListener('wheel', onWheel); el.removeEventListener('scroll', paint); };
  }, [procId]);

  // a new tab deals its cards in; the first render just sits there
  const shown = useRef(procId);
  useGSAP(() => {
    if (shown.current === procId) return;
    shown.current = procId;
    if (!REDUCED) gsap.from('[data-track][data-on] [data-step]', { y: 24, opacity: 0, duration: .5, stagger: .04, ease: 'power3.out', clearProps: 'all' });
  }, { scope: root, dependencies: [procId] });

  return (
    <Section ref={root} id="process" aria-label={m.label} className={SEC}>
      <div className="flex flex-col gap-process-gap">
        <div className="wrap flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow>{m.eyebrow}</Eyebrow>
            <H2>{pick(proc.title, proc.titleEn)}</H2>
          </div>
          <div className="grid justify-items-end gap-3">
            <div className="flex flex-wrap gap-1.5" role="tablist">
              {PROCESSES.map(p => (
                <button key={p.id} type="button" role="tab" aria-selected={p.id === procId} onClick={() => setProcId(p.id)}
                  className={cn('cursor-pointer rounded-full border border-line-2 px-5 py-3 font-sans text-body-sm font-semibold tracking-button text-fg-2 transition-[background-color,color,border-color] duration-400', p.id === procId && 'border-fg bg-fg text-bg')}>
                  {pick(p.tab, p.tabEn)}
                </button>
              ))}
            </div>
            <span className="mono text-mute max-sm:hidden">{FINE ? m.hint : m.hintTouch}</span>
          </div>
        </div>
        <div>
          {PROCESSES.map(p => (
            <div key={p.id} ref={el => { tracks.current[p.id] = el; }} data-track data-on={p.id === procId || undefined}
              tabIndex={p.id === procId ? 0 : -1} aria-label={pick(p.ko, p.en)}
              className="hidden gap-4.5 pr-gutter pl-[max(var(--spacing-gutter),calc((100vw-var(--container-page))/2))] [scrollbar-width:none] focus-visible:-outline-offset-2 data-on:flex sm:overflow-x-auto sm:overscroll-x-contain sm:pointer-coarse:snap-x sm:pointer-coarse:snap-mandatory sm:pointer-coarse:scroll-pl-[max(var(--spacing-gutter),calc((100vw-var(--container-page))/2))] [&::-webkit-scrollbar]:hidden max-sm:flex-col max-sm:px-gutter">
              {p.steps.map((s, i) => (
                <article key={s.ko} data-step onClick={!FINE && s.imgs.length > 1 ? e => e.currentTarget.toggleAttribute('data-flip') : undefined}
                  className="group/step relative grid w-process-card flex-none snap-start grid-rows-[auto_1fr] overflow-hidden rounded-md border border-line bg-card transition-[border-color] duration-400 hover:border-line-2 max-sm:w-full">
                  <div data-wipe className="relative aspect-505/350 overflow-hidden bg-bg-2">
                    {s.imgs.map((im, k) => (
                      <Img key={im} src={PROCESS_IMG + im} sizes="(max-width: 599px) 100vw, 400px" alt={`${pick(s.ko, s.koEn)} ${k + 1}`}
                        className={cn('absolute inset-0 size-full object-cover transition-opacity duration-600', k > 0 && 'opacity-0 group-hover/step:opacity-100 group-data-flip/step:opacity-100')} />
                    ))}
                    {s.imgs.length > 1 && <span className="absolute right-2.5 bottom-2 font-mono text-micro tracking-widest text-on-photo uppercase opacity-80 text-shadow-photo-sm">{FINE ? m.photoHint : m.photoHintTouch}</span>}
                  </div>
                  <div className="grid grid-cols-[1fr_auto] content-start gap-x-3.5 gap-y-2 px-5 pt-4.5 pb-5">
                    <div className="mono col-span-full flex justify-between text-mute"><span>{m.step(i + 1)}</span><em className={cn('not-italic', (s.heat === 'hot' || s.heat === 'warm') && HEAT[s.heat])}>{s.en}</em></div>
                    <h3 className="m-0 text-title font-semibold">{pick(s.ko, s.koEn)}</h3>
                    <div className={cn('num self-start font-display text-step leading-step font-extrabold tracking-heading', s.heat && HEAT[s.heat])}>{pad2(i + 1)}</div>
                    <p className="col-span-full m-0 text-small leading-copy text-fg-2">{pick(s.d, s.dEn)}</p>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
        <div className="wrap">
          <div className="relative h-0.5 bg-line max-sm:hidden"><i ref={bar} className="absolute inset-0 origin-left bg-linear-to-r/srgb from-fg-2 to-acc [transform:scaleX(0)]" /></div>
          <div className="mono flex justify-between gap-5 text-mute max-sm:hidden"><span>{proc.foot[0]}</span><span>{m.middle}</span><span>{proc.foot[1]}</span></div>
        </div>
      </div>
    </Section>
  );
}
