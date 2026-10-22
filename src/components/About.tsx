import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { gsap, ScrollTrigger, SplitText, fontsReady, useGSAP } from '../lib/gsap';
import { REDUCED, pad2 } from '../lib/env';
import { pick, rich, useLang, useT } from '../i18n';
import { ABOUT_YEARS, ORG } from '../data';
import { Eyebrow, IndexHead, SEC, Section, btn, cn } from './ui';
import { Img } from './Img';

const PARTNER_H = [28, 20, 40, 26, 26, 26, 40, 36];   // optical logo heights, px
const $$ = (s: string, r: ParentNode) => Array.from(r.querySelectorAll<HTMLElement>(s));

/** a keyword in the manifesto: underlined once the paragraph has lit up */
function K({ children }: { children: ReactNode }) {
  return <em data-k data-on={REDUCED || undefined} className="relative whitespace-nowrap text-acc-ink not-italic after:absolute after:inset-x-0 after:-bottom-[.06em] after:h-0.5 after:origin-left after:scale-x-0 after:bg-acc after:transition-transform after:duration-500 after:ease-out after:content-[''] data-on:after:scale-x-100">{children}</em>;
}

export function About() {
  const m = useT().about;
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const sec = root.current!;
    const q = <T extends HTMLElement = HTMLElement>(s: string) => sec.querySelector<T>(s)!;

    // six years on one rail: drawn once, start to end, the first time the rail is in view
    const years = q('[data-years]'), rail = q('[data-years-rail]'), dot = q('[data-years-dot]'), ycols = $$('[data-y]', years);
    if (REDUCED) { gsap.set(rail, { scaleX: 1 }); ycols.forEach(c => c.toggleAttribute('data-on', true)); }
    else {
      const RUN = 1.6;
      const tl = gsap.timeline({ paused: true })
        .to(rail, { scaleX: 1, duration: RUN, ease: 'power2.inOut' }, 0)
        .to(dot, { x: () => years.clientWidth, duration: RUN, ease: 'power2.inOut' }, 0);
      ycols.forEach((c, i) => tl.call(() => c.toggleAttribute('data-on', true), [], (i / ycols.length) * RUN));
      ScrollTrigger.create({ trigger: years, start: 'top 80%', once: true, onEnter: () => { tl.play(); } });
    }
  }, { scope: root });

  return (
    <Section ref={root} id="about" className={cn(SEC, 'pt-[clamp(120px,18vh,220px)]')}>
      <div className="wrap">
        <div className="flex items-center justify-between gap-5 max-xs:flex-col max-xs:items-start max-xs:gap-2"><Eyebrow className="rv">{m.eyebrow}</Eyebrow><span className="mono rv text-mute">{m.aside}</span></div>
        <Manifesto />
      </div>

      <Cine />

      <div className="wrap">
        <Years />
        <Pledge />
        <Partners />
        <OrgChart />
      </div>
    </Section>
  );
}

/**
 * The words light up in reading order once, the first time the paragraph is in view.
 * SplitText cuts the paragraph into word spans React doesn't know about, so React can't swap its
 * text in place: each language gets a fresh <p> (keyed), split anew — or, once the lighting has
 * played, simply shown lit.
 */
function Manifesto() {
  const lang = useLang(), text = useT().about.manifesto;
  const ref = useRef<HTMLParagraphElement>(null);
  const played = useRef(REDUCED);
  useGSAP((_, contextSafe) => {
    const mf = ref.current!, ks = $$('[data-k]', mf);
    if (played.current) { ks.forEach(k => k.toggleAttribute('data-on', true)); return; }
    let alive = true;
    fontsReady.then(contextSafe!(() => {
      if (!alive) return;
      const words = new SplitText(mf, { type: 'words', wordsClass: 'w' }).words;
      gsap.set(words, { opacity: .16 });
      ScrollTrigger.create({ trigger: mf, start: 'top 75%', once: true, onEnter: () => gsap.to(words, { opacity: 1, duration: .5, ease: 'power1.out', stagger: .045, onComplete: () => { played.current = true; ks.forEach(k => k.toggleAttribute('data-on', true)); } }) });
    }));
    return () => { alive = false; };
  }, { scope: ref, dependencies: [lang], revertOnUpdate: true });
  return (
    <p key={lang} ref={ref} className="mt-[clamp(40px,6vw,80px)] max-w-[20em] text-[clamp(2rem,3.8vw,3.8rem)] leading-[1.42] font-medium tracking-[-.02em] text-pretty break-keep">
      {rich(text, { k: chunk => <K>{chunk}</K> })}
    </p>
  );
}

function Cine() {
  const m = useT().about.frame;
  // everything is set on the photo: the heading at the top, the caption and the figures at the bottom.
  // The frame grows with its copy, so on a phone the two blocks stack instead of overlapping.
  return (
    <div className="mt-[clamp(48px,8vh,110px)] max-lg:mt-12">
      <div data-wipe className="pad-wrap relative isolate flex min-h-[72svh] w-full flex-col justify-between gap-14 overflow-hidden rounded-card bg-ink py-[clamp(28px,6vh,64px)] text-white max-lg:min-h-[60svh] max-lg:gap-10 max-lg:rounded-none">
        <Img src="assets/img/company/company.jpg" sizes="100vw" alt={m.alt}
          className="absolute inset-0 -z-2 size-full object-cover object-[center_62%]" />
        {/* dark at the top and the bottom where the copy sits, clear through the middle */}
        <div className="pointer-events-none absolute inset-0 -z-1 bg-[linear-gradient(180deg,rgba(12,16,22,.78),rgba(12,16,22,.2)_42%,rgba(12,16,22,.2)_52%,rgba(12,16,22,.82))] max-lg:bg-[linear-gradient(180deg,rgba(12,16,22,.82),rgba(12,16,22,.45)_45%,rgba(12,16,22,.85))]" />
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-end gap-x-[clamp(24px,4vw,64px)] gap-y-5 max-lg:grid-cols-1">
          <div className="rv grid gap-3.5">
            <span className="mono text-white/70">{m.label}</span>
            <b className="disp text-[clamp(2.6rem,6vw,6rem)]">{m.title}</b>
          </div>
          <p className="rv m-0 max-w-[26em] text-white/85">{m.body}</p>
        </div>
        {/* caption left, figures right; up to 1100px the figures go under the caption, two a row */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-12 gap-y-7 max-3xl:grid-cols-1">
          <div className="grid max-w-[640px] gap-1.5">
            <span className="mono text-white/70">{m.tagEyebrow}</span>
            <b className="font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-none font-extrabold uppercase">{m.tagTitle}</b>
            <small className="text-[.9rem] text-white/75">{m.tagBody}</small>
          </div>
          <ul className="mono m-0 grid list-none gap-2 p-0 text-right text-white/80 max-3xl:grid-cols-2 max-3xl:gap-x-8 max-3xl:text-left max-xs:grid-cols-1">
            {m.ledger.map((l, i) => (
              <li key={i}><b className="num mr-2.5 font-display text-[1.5em] font-extrabold tracking-normal text-white">{l.value}</b>{l.label}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Years() {
  const m = useT().about.years;
  return (
    <div className="mt-[clamp(64px,9vw,120px)] grid gap-[18px]">
      <IndexHead title={m.title} aside={m.range} />
      <div data-years className="relative grid grid-cols-6 pt-[26px] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-line before:content-[''] max-lg:grid-cols-2 max-lg:gap-x-5 max-lg:gap-y-7">
        <i data-years-rail className="absolute inset-x-0 top-0 h-px origin-left bg-[linear-gradient(90deg,var(--fg),var(--acc))] [transform:scaleX(0)] max-lg:hidden" />
        <i data-years-dot className="absolute -top-[3.5px] -left-1 size-2 rounded-full bg-acc will-change-transform max-lg:hidden" />
        {ABOUT_YEARS.map(y => (
          <div key={y.y} data-y className="group/y grid content-start gap-2.5 pr-5">
            <div className="overflow-hidden">
              <div className={cn('num translate-y-[105%] font-display text-[clamp(2.6rem,5vw,5.4rem)] leading-[.9] font-extrabold transition-transform duration-700 ease-out group-data-on/y:translate-y-0 max-lg:translate-y-0 motion-reduce:translate-y-0', y.h && 'text-acc-ink')}>{y.y}</div>
            </div>
            <p className="m-0 text-[.95rem] text-fg-2 opacity-0 transition-opacity delay-150 duration-600 group-data-on/y:opacity-100 max-lg:opacity-100 motion-reduce:opacity-100">{pick(y.t, y.tEn)}</p>
          </div>
        ))}
      </div>
      <a className="-my-2 justify-self-end py-2 text-[.95rem] font-medium text-fg-2 hover:text-acc-ink" href="#history">{m.more}</a>
    </div>
  );
}

function PromiseItem({ children }: { children: ReactNode }) {
  return <li className="rv grid grid-cols-[auto_1fr] gap-3 text-fg-2 transition-colors duration-300 before:mt-[.6em] before:size-1.5 before:rounded-full before:bg-line-2 before:transition-[background-color,scale] before:duration-300 before:ease-out before:content-[''] hover:text-fg hover:before:scale-[1.4] hover:before:bg-acc">{children}</li>;
}
const PROMISE_H3 = 'rv m-0 mb-3.5 flex items-baseline gap-3 font-display text-[1.6rem] leading-none font-extrabold uppercase';
const PROMISE_SUB = 'font-sans text-[.9rem] font-medium tracking-normal text-mute normal-case';

function Pledge() {
  const m = useT().about.pledge;
  return (
    <div data-batch className="mt-[clamp(64px,9vw,120px)] grid gap-[22px]">
      <IndexHead className="rv" title={m.title} aside={m.aside} />
      <div className="grid grid-cols-2 gap-[clamp(24px,4vw,64px)] border-t border-line-2 pt-7 max-lg:grid-cols-1">
        <div>
          <h3 className={PROMISE_H3}>{m.customer.title} <span className={PROMISE_SUB}>{m.customer.sub}</span></h3>
          <ul className="m-0 grid list-none gap-2.5 p-0">{m.customer.items.map(x => <PromiseItem key={x}>{x}</PromiseItem>)}</ul>
        </div>
        <div>
          <h3 className={PROMISE_H3}>{m.supplier.title} <span className={PROMISE_SUB}>{m.supplier.sub}</span></h3>
          <ul className="m-0 grid list-none gap-2.5 p-0">{m.supplier.items.map(x => <PromiseItem key={x}>{x}</PromiseItem>)}</ul>
          <p className="rv mt-[18px] text-fg-2">{m.closing}</p>
        </div>
      </div>
    </div>
  );
}

/** end users: one logo marquee sharing the text marquee's skew */
function Partners() {
  const m = useT().about.partners;
  const group = (copy: number) => (
    <div className="marquee flex gap-3.5 pr-3.5 [--marquee-duration:48s]" aria-hidden={copy > 0 || undefined}>
      {PARTNER_H.map((h, i) => (
        <div key={i} className="group/logo grid h-[78px] place-items-center rounded-full border border-line bg-white px-8">
          <Img src={`assets/img/partners/partner-${pad2(i + 1)}.png`} sizes="210px" alt={copy ? '' : m.logoAlt(i + 1)} style={{ '--h': `${h}px` } as CSSProperties}
            className="h-(--h) w-auto max-w-[210px] object-contain opacity-75 grayscale transition-[filter,opacity] duration-400 group-hover/logo:opacity-100 group-hover/logo:grayscale-0" />
        </div>
      ))}
    </div>
  );
  return (
    <div className="rv mt-[clamp(64px,9vw,120px)] grid gap-[18px]">
      <IndexHead title={m.title} aside={m.aside} />
      <div className="marquee-host relative overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-1 before:w-[8%] before:bg-[linear-gradient(90deg,var(--bg),transparent)] before:content-[''] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-1 after:w-[8%] after:bg-[linear-gradient(270deg,var(--bg),transparent)] after:content-['']">
        <div className="flex w-max">{group(0)}{group(1)}</div>
      </div>
    </div>
  );
}

const STEM = 'block h-[22px] w-px origin-top bg-line-2 [transform:scaleY(0)] max-lg:hidden';

/** organisation chart: an HTML tree that draws its connectors when it scrolls in */
function OrgChart() {
  const m = useT().about.org;
  const root = useRef<HTMLDetailsElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(true);
  useGSAP(() => {
    const tree = root.current!.querySelector('[data-org-tree]')!;
    if (REDUCED) { gsap.set('[data-stem], [data-bus], [data-branch]', { scale: 1 }); return; }
    const teams = gsap.utils.toArray<HTMLElement>('[data-team]', tree);
    tl.current = gsap.timeline({ paused: true })
      .fromTo('[data-org-root]', { clipPath: 'inset(50% 0 50% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: .6, ease: 'power4.out' })
      .to('[data-org-root] [data-stem]', { scaleY: 1, duration: .35 }, .25)
      .to('[data-bus]', { scaleX: 1, duration: .7, ease: 'power3.out' }, .45)
      .to('[data-branch]', { scaleX: 1, duration: .4 }, .45).from('[data-staff]', { opacity: 0, y: 12, duration: .5 }, .55)
      .from(teams, { y: 24, opacity: 0, duration: .8, ease: 'power3.out', stagger: { each: .07, from: 'center' } }, .75)
      .to(teams.map(el => el.querySelector('[data-stem]')), { scaleY: 1, duration: .3, stagger: { each: .07, from: 'center' } }, .75)
      .from('[data-team] li', { opacity: 0, duration: .4, stagger: .02 }, 1.05);
    ScrollTrigger.create({ trigger: tree, start: 'top 85%', once: true, onEnter: () => { if (root.current?.open) tl.current?.play(); } });
    return () => { tl.current = null; };
  }, { scope: root });

  return (
    <details ref={root} open={open} className="group/org rv mt-[clamp(64px,9vw,120px)]"
      onToggle={e => { const isOpen = e.currentTarget.open; setOpen(isOpen); ScrollTrigger.refresh(); if (isOpen) tl.current?.play(); }}>
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-x-5 gap-y-3 [&::-webkit-details-marker]:hidden">
        <IndexHead title={m.title} aside={m.aside} />
        <span className={btn({ size: 'sm' })}>
          <span className="hidden group-open/org:inline">{m.collapse}</span><span className="group-open/org:hidden">{m.expand}</span>
        </span>
      </summary>
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-600 ease-out group-open/org:grid-rows-[1fr] motion-reduce:transition-none">
        <div className="overflow-hidden">
          <div data-org-tree className="relative grid grid-cols-6 gap-3.5 pt-7 max-lg:grid-cols-2">
            <div data-org-root className="relative col-[3/5] self-center justify-self-center rounded-full border border-line-2 px-7 py-3.5 font-semibold max-lg:col-span-full">
              {pick(ORG.root, ORG.rootEn)}<i data-stem className={cn(STEM, 'absolute top-full left-1/2 h-7')} />
            </div>
            <div data-staff className="relative col-start-6 self-center rounded-card border border-dashed border-line-2 px-[18px] py-3 text-fg-2 max-lg:col-span-full max-lg:justify-self-start">
              <i data-branch className="absolute top-1/2 right-full h-px w-10 origin-right border-t border-dashed border-line-2 [transform:scaleX(0)] max-lg:hidden" />{pick(ORG.staff, ORG.staffEn)}
            </div>
            <i data-bus className="col-span-full h-px origin-center bg-line-2 [transform:scaleX(0)] max-lg:hidden" />
            {ORG.teams.map((team, i) => (
              <article key={team.n} data-team className="relative grid content-start gap-2 rounded-card border border-line bg-card p-[18px]">
                <i data-stem className={cn(STEM, 'absolute bottom-full left-1/2 m-0')} />
                <span className="mono">{pad2(i + 1)}</span>
                <h4 className="m-0 font-semibold tracking-[-.01em]">{pick(team.n, team.nEn)}</h4>
                <ul className="m-0 grid list-none gap-1 p-0 text-[.92rem] text-mute">{pick(team.s, team.sEn).map(x => <li key={x}>{x}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}
