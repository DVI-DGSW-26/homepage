import { useImperativeHandle, useRef, useState, type RefObject } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap';
import { bootReady } from '../lib/boot';
import { FINE, REDUCED } from '../lib/env';
import { lines, pick, useLang, useT } from '../i18n';
import type { HeroApi } from '../three/hero';
import { getTheme, subscribeTheme } from '../lib/theme';
import { PART_LABELS } from '../three/meta';
import { HudRow, Section, cn } from './ui';
import { Img } from './Img';

/** one banner per headline beat (the copy is in the dictionary: hero.beats) */
const BANNERS = ['banner-01', 'banner-02', 'banner-03', 'banner-04'];
/** seconds each beat stays up before the hero swipes to the next */
const DWELL = 5.5;

const NO_SCENE: HeroApi = { setLight() {}, setBeat() {}, setIntro() {}, setProgress() {}, setActive() {}, destroy() {} };

/**
 * One screen: aluminum chips assemble into four parts in turn while the headline swipes beat by
 * beat on its own (paused while the hero is off screen, and not at all with reduced motion — the
 * HUD ticks pick a beat by hand). Dragging the part turns it to any angle, and the beat holds until
 * it is let go. The entrance plays as soon as the fonts are in; until then the copy, HUD and nav
 * stay hidden (`booting:`) so nothing flashes before it animates in.
 */
export function Hero() {
  const m = useT().hero, lang = useLang();
  const root = useRef<HTMLElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const beatEls = useRef<HTMLElement[]>([]), bgEls = useRef<HTMLImageElement[]>([]);
  const hud = useRef<(i: number) => void>(() => {});
  const choose = useRef<(i: number) => void>(() => {});

  useGSAP((_, contextSafe) => {
    const beats = beatEls.current;
    const bgs = bgEls.current;
    let HERO = NO_SCENE, alive = true, cur = 0, active = true, started = false, held = false, frame = 0, intro = REDUCED ? 1 : 0;
    let timer: gsap.core.Tween | null = null;
    // The WebGL scene (and three.js with it) is a separate chunk: fetched right away, built after the
    // first paint, so the page shows up before either cost. A beat or the intro that arrives first is
    // caught up on when the scene is there.
    const scene = import('../three/hero');
    const build = () => scene.then(({ createHero }) => {
      if (!alive || HERO !== NO_SCENE) return;
      HERO = createHero(canvas.current!, { reduced: REDUCED, fine: FINE, light: getTheme() === 'light', surface: root.current!, onGrab: v => { held = v; schedule(); } });
      HERO.setBeat(cur); HERO.setActive(active); HERO.setIntro(intro);
    });
    frame = requestAnimationFrame(() => { frame = requestAnimationFrame(build); });
    const unTheme = subscribeTheme(() => HERO.setLight(getTheme() === 'light'));

    const showBeat = (i: number) => {
      if (i === cur) return;
      const from = beats[cur], to = beats[i]; cur = i;
      hud.current(i);
      bgs.forEach((b, k) => { gsap.to(b, { opacity: k === i ? 1 : 0, scale: k === i ? 1 : 1.08, duration: 1.4, ease: 'power2.out', overwrite: true }); });
      HERO.setBeat(i);
      gsap.killTweensOf([from, to]);
      to.toggleAttribute('data-active', true); to.style.zIndex = '2'; from.style.zIndex = '1';
      if (REDUCED) { from.removeAttribute('data-active'); return; }
      // the copy swipes: the old beat slides out to the left as the new one comes in from the right
      gsap.to(from, { xPercent: -6, opacity: 0, duration: .45, ease: 'power2.in', onComplete: () => { if (beats[cur] !== from) from.removeAttribute('data-active'); } });
      gsap.fromTo(to, { xPercent: 6, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .7, ease: 'power3.out', delay: .2 });
    };
    const schedule = contextSafe!(() => {
      timer?.kill(); timer = null;
      if (REDUCED || !started || !active || held) return;
      timer = gsap.delayedCall(DWELL, () => go((cur + 1) % beats.length));
    });
    const go = contextSafe!((i: number) => { showBeat(i); schedule(); });
    choose.current = go;
    gsap.set(bgs[0], { scale: 1 });

    // the first headline is split once the fonts are in, so its characters measure in the real face
    const ready = () => document.documentElement.toggleAttribute('data-ready', true);
    if (REDUCED) ready();
    bootReady.then(contextSafe!(() => {
      if (!alive || REDUCED) return;
      const h1 = beats[0].querySelector('h1')!, p = beats[0].querySelector('p')!;
      const chars = new SplitText(h1, { type: 'words,chars', charsClass: 'split-char', wordsClass: 'word' }).chars;
      build();
      ready();
      const o = { v: 0 };
      gsap.timeline({ defaults: { ease: 'power4.out' }, onComplete: () => { started = true; schedule(); } })
        .to(o, { v: 1, duration: 1.3, ease: 'expo.out', onUpdate: () => { intro = o.v; HERO.setIntro(o.v); } }, 0)
        .from(chars, { yPercent: 110, opacity: 0, filter: 'blur(10px)', duration: 1.1, stagger: .018 }, .1)
        .from(p, { opacity: 0, y: 18, duration: .9 }, .7)
        .from('[data-intro]', { opacity: 0, x: 24, duration: .8, stagger: .08 }, .6)
        .from('[data-cue]', { opacity: 0, duration: .8 }, 1.2)
        // clearProps leaves no transform behind on the header once it is in
        .from(document.getElementById('nav'), { y: -24, opacity: 0, duration: .9, clearProps: 'transform' }, .4);
    }));

    // the particle scene and the rotation only run while the hero is on screen
    ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onToggle: s => { active = s.isActive; HERO.setActive(active); schedule(); } });
    return () => { alive = false; unTheme(); cancelAnimationFrame(frame); timer?.kill(); HERO.destroy(); };
  }, { scope: root });

  return (
    <Section ref={root} id="hero" aria-label={m.label} className="h-svh min-h-140 touch-pan-y">
      {/* The banners are dark photographs. On graphite they sit at a third strength; on the light page
          they are lifted (brightness up, contrast and colour down) and the veil turns to the page colour. */}
      <div className="relative h-full overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 opacity-34 transition-[opacity,filter] duration-600 light:opacity-55 light:brightness-230 light:contrast-82 light:saturate-75">
          {BANNERS.map((b, i) => (
            <Img key={b} ref={el => { if (el) bgEls.current[i] = el; }} src={`assets/img/hero/${b}.jpg`} sizes="100vw" priority={i === 0} loading="eager"
              className={cn('absolute inset-0 size-full object-cover opacity-0 [transform:scale(1.08)]', i === 0 && 'opacity-100')} />
          ))}
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_62%_45%,transparent,color-mix(in_srgb,var(--bg)_75%,transparent)_70%,var(--bg)),linear-gradient(180deg,color-mix(in_srgb,var(--bg)_60%,transparent),transparent_30%,transparent_65%,var(--bg))]" />
        </div>
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" />
        <div className="wrap relative grid h-full grid-cols-[minmax(0,1fr)_auto] items-end gap-6 pb-hero-bottom text-fg max-md:grid-cols-1 max-md:content-end">
          <div className="booting:opacity-0">
            <div className="grid">
              {m.beats.map((b, i) => (
                <article key={i} ref={el => { if (el) beatEls.current[i] = el; }} data-active={i === 0 ? '' : undefined} className="invisible col-start-1 row-start-1 data-active:visible">
                  <h1 key={i === 0 ? lang : undefined} className="m-0 mb-hero-gap max-w-hero-title font-display text-hero leading-hero font-extrabold tracking-display text-balance text-fg uppercase">{b.title}</h1>
                  <p className="m-0 max-w-hero-copy text-hero-body leading-hero-body text-fg-2">{lines(b.body)}</p>
                </article>
              ))}
            </div>
          </div>
          <HeroHud bind={hud} choose={choose} />
          <div data-cue className="mono absolute bottom-6.5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5 text-mute booting:opacity-0 max-3xl:hidden">
            <span className="relative h-11 w-px overflow-hidden bg-line-2 after:absolute after:-top-full after:left-0 after:size-full after:animate-cue after:bg-fg motion-reduce:after:animate-none" />{m.cue}
          </div>
        </div>
      </div>
    </Section>
  );
}

/** The beat readout. Holds its own state, so a beat change redraws these rows and nothing else. */
function HeroHud({ bind, choose }: { bind: RefObject<(i: number) => void>; choose: RefObject<(i: number) => void> }) {
  const m = useT().hero, h = m.hud;
  const [beat, setBeat] = useState(0);
  useImperativeHandle(bind, () => setBeat, []);
  const part = PART_LABELS[beat];
  // up to 1280px the part turns behind the readout: a dim panel keeps it legible (no blur — it
  // would re-filter the WebGL canvas under it every frame)
  return (
    <aside className="mono grid min-w-60 gap-2.5 pb-1.5 text-fg-2 booting:opacity-0 max-md:hidden max-4xl:rounded-card max-4xl:bg-bg/65 max-4xl:px-4 max-4xl:pt-2 max-4xl:pb-3">
      <HudRow data-intro label={h.sequence}><span className="num">{h.beatOf(beat + 1, m.beats.length)}</span></HudRow>
      <HudRow data-intro label={h.part}>{part.en}</HudRow>
      <HudRow data-intro label={h.system}>{pick(part.ko, part.koEn)}</HudRow>
      <HudRow data-intro label={h.process}>{pick(part.proc, part.procEn)}</HudRow>
      <div data-intro className="flex gap-1.5 pt-1.5">
        {m.beats.map((_, k) => (
          // a tall hit area around the 2px tick
          <button key={k} type="button" aria-label={h.beatLabel(k + 1, m.beats.length)} aria-current={k === beat || undefined} onClick={() => choose.current(k)}
            className="flex-1 cursor-pointer py-2">
            <i data-on={k <= beat || undefined} className="relative block h-0.5 overflow-hidden bg-line-2 after:absolute after:inset-0 after:origin-left after:scale-x-0 after:bg-acc after:transition-transform after:duration-500 after:ease-out data-on:after:scale-x-100" />
          </button>
        ))}
      </div>
      <span data-intro className="font-sans text-caption font-normal tracking-normal text-mute normal-case">{h.hint}</span>
    </aside>
  );
}

export function Marquee() {
  const items = useT().hero.marquee;
  const track = (
    <div className="marquee flex items-center gap-10 pr-10">
      {items.map((s, i) => (
        <span key={i} className="contents">
          {/* every other word is set in outline */}
          <span className={cn('font-display text-marquee font-extrabold tracking-button whitespace-nowrap uppercase', i % 2 ? 'text-stroke' : 'text-fg')}>{s}</span>
          <i className="size-2.5 flex-none rounded-full bg-acc" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee-host overflow-hidden border-y border-line py-5.5" aria-hidden="true">
      <div className="flex w-max">{track}{track}</div>
    </div>
  );
}
