import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { FINE, REDUCED } from '../lib/env';
import { lines, useT } from '../i18n';
import { getTheme, subscribeTheme } from '../lib/theme';
import { REST_LEN, metricsFor, type ProfileParams } from '../three/meta';
import type { ExtrusionApi } from '../three/extrusion';
import { Eyebrow, H2, HudRow, Lead, Section, cn } from './ui';

const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
// slider ranges; the labels are in the dictionary under config.controls
const CTRLS: { k: keyof ProfileParams; min: number; max: number; step: number; show: (v: number) => string }[] = [
  { k: 'w', min: 60, max: 160, step: 2, show: v => `${v} mm` },
  { k: 'h', min: 24, max: 80, step: 2, show: v => `${v} mm` },
  { k: 'cells', min: 1, max: 4, step: 1, show: v => String(v) },
  { k: 'wall', min: 1.5, max: 6, step: .5, show: v => `${fmt(v)} mm` }
];
/** the walls can't eat the cells: thin the wall back to what still leaves a hollow */
const fitWall = (p: ProfileParams): ProfileParams => {
  const maxWall = Math.min((p.w - 8 * p.cells) / (p.cells + 1), (p.h - 6) / 2);
  return p.wall > maxWall ? { ...p, wall: Math.max(1.5, Math.floor(maxWall * 2) / 2) } : p;
};
const HIDE_SHORT = 'short:hidden';

/** Profile lab: tune a multi-hollow section and read its weight. */
export function Config() {
  const t = useT().config;
  const root = useRef<HTMLElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const ext = useRef<ExtrusionApi | null>(null);
  const [params, setParams] = useState<ProfileParams>(() => fitWall({ w: 90, h: 40, cells: 3, wall: 4.5 }));
  const m = metricsFor(params);
  const latest = useRef(params);

  useGSAP(() => {
    let EXT: ExtrusionApi | null = null, active = false, alive = true, loading: Promise<void> | null = null;
    // The WebGL scene (a separate chunk) is built a viewport before the section arrives, not at page load...
    const build = () => loading ??= import('../three/extrusion').then(({ createExtrusion }) => {
      if (!alive) return;
      EXT = createExtrusion(canvas.current!, { reduced: REDUCED, fine: FINE, light: getTheme() === 'light' });
      ext.current = EXT;
      EXT.setParams(latest.current); EXT.setActive(active);
    });
    ScrollTrigger.create({ trigger: root.current, start: 'top bottom+=100%', once: true, onEnter: build });
    const unTheme = subscribeTheme(() => EXT?.setLight(getTheme() === 'light'));
    // ...or earlier, in idle time once the hero entrance is over, so arriving costs nothing
    let wait = 0, idleId = 0;
    const later = () => { wait = window.setTimeout(() => { idleId = typeof requestIdleCallback === 'function' ? requestIdleCallback(() => { build(); }, { timeout: 4000 }) : window.setTimeout(build, 0); }, 2500); };
    if (document.readyState === 'complete') later(); else addEventListener('load', later, { once: true });
    if (!REDUCED) gsap.from('[data-copy] > *', { x: -30, opacity: 0, duration: .9, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } });
    ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onToggle: s => { active = s.isActive; if (active) build(); EXT?.setActive(active); } });
    // the profile stays at its resting run-out: the section is one screen, not a scroll-driven press
    return () => { alive = false; unTheme(); clearTimeout(wait); removeEventListener('load', later); if (typeof cancelIdleCallback === 'function') cancelIdleCallback(idleId); EXT?.destroy(); ext.current = null; };
  }, { scope: root });
  useEffect(() => { latest.current = params; ext.current?.setParams(params); }, [params]);

  const out = [
    { label: t.out.area, v: fmt(m.area / 100, 1), u: 'cm²' },
    { label: t.out.weight, v: fmt(m.kgPerM, 2), u: 'kg/m' },
    { label: t.out.ccd, v: fmt(m.ccd, 0), u: 'mm' },
    { label: t.out.press, v: m.press.ton.toLocaleString('en-US'), u: `t / ${m.press.inch}"`, acc: true }
  ];
  return (
    <Section ref={root} id="config" aria-label={t.label}>
      <div className="grid min-h-svh grid-cols-[minmax(360px,1fr)_1.4fr] items-center gap-config-gap overflow-hidden pt-config-top pb-config-bottom max-3xl:min-h-0 max-3xl:grid-cols-1 max-3xl:overflow-visible max-3xl:pt-config-top-narrow max-3xl:pb-10">
        {/* up to 1100px the stage stacks above the copy, and the scene keeps to it instead of sitting under the copy;
            wider, the copy floats on a glass pane and the press shows through it, frosted */}
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 z-0 size-full max-3xl:bottom-auto max-3xl:h-[calc(var(--spacing-config-stage)+var(--spacing-config-top-narrow))]" />
        <div data-copy className="relative z-2 grid max-w-150 content-center gap-3.5 px-gutter max-3xl:max-w-none 3xl:ml-gutter 3xl:glass 3xl:rounded-glass 3xl:px-7 3xl:py-6">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <H2 className="text-h2-sm">{t.title}</H2>
          <Lead className={cn('text-body-sm leading-copy', HIDE_SHORT)}>{lines(t.lead)}</Lead>
          <div className="grid gap-2 border-t border-line-2 pt-3">
            {CTRLS.map(c => (
              <div key={c.k} className="grid grid-cols-[1fr_auto] items-center gap-x-3.5 gap-y-0.5">
                <label htmlFor={'cfg-' + c.k} className="text-small text-fg-2">{t.controls[c.k]}</label>
                <output htmlFor={'cfg-' + c.k} className="font-mono text-label tracking-mono-sm text-fg">{c.show(params[c.k])}</output>
                <input id={'cfg-' + c.k} className="range col-span-full" type="range" min={c.min} max={c.max} step={c.step} value={params[c.k]}
                  onChange={e => { const v = +e.target.value; setParams(p => fitWall({ ...p, [c.k]: v })); }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 overflow-hidden rounded-card border border-line bg-card 3xl:bg-card/45">
            {out.map((o, i) => (
              <div key={o.label} className={cn('grid gap-0.5 border-line px-3.5 py-2.5', i % 2 === 0 && 'border-r', i < 2 && 'border-b')}>
                <span className="font-mono text-micro tracking-widest text-mute uppercase">{o.label}</span>
                <b className={cn('num flex items-baseline gap-1.25 font-display text-figure-sm leading-none font-extrabold', o.acc && 'text-acc-2')}>{o.v}<small className="text-unit-lg font-bold text-fg-2">{o.u}</small></b>
              </div>
            ))}
          </div>
          <p className={cn('m-0 text-label leading-normal text-mute', HIDE_SHORT)}>{lines(t.note)}</p>
        </div>
        <div className="pointer-events-none relative h-full min-h-105 max-3xl:-order-1 max-3xl:h-config-stage max-3xl:min-h-90">
          <div className="mono pointer-events-auto absolute right-gutter bottom-0 z-2 grid min-w-50 gap-2 text-fg-2 max-3xl:bottom-3">
            <HudRow label={t.hud.runOut}><span className="num">{REST_LEN.toFixed(1)} m</span></HudRow>
            <HudRow label={t.hud.die}>{t.hud.dieValue}</HudRow>
          </div>
        </div>
      </div>
    </Section>
  );
}
