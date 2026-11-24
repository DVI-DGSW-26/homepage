'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { useT } from '../../../i18n';
import { Monitor, Phone } from '../../../components/Device';
import { Img } from '../../../components/Img';
import { Band } from '../../../components/ui';
import { REDUCED } from '../../../lib/env';
import { cn } from '../../../lib/cn';
import { Head, useCapture } from '../parts';

/** how long each step stays before the next, in ms */
const STEP = 4800;

/**
 * 서비스 미리보기: one inspection followed through QAC FLOW, where 주요 기능 lists what each part does. A rail
 * of five steps (who, what) runs along the top, the current one filling as it plays; under it, the step's
 * line on the left and its real screen on the right, the next step coming in after STEP. A click on the rail
 * goes to that step. With reduced motion (read after hydration) nothing plays by itself.
 */
export function Preview() {
  const m = useT().qf, p = m.preview, capture = useCapture();
  const [at, setAt] = useState(0);
  const [still, setStill] = useState(false);
  const n = p.steps.length;
  useEffect(() => { setStill(REDUCED); }, []);
  useEffect(() => {
    if (still) return;
    const t = window.setTimeout(() => setAt(x => (x + 1) % n), STEP);
    return () => window.clearTimeout(t);
  }, [at, n, still]);

  const phone = (src: string, alt: string, dark?: boolean) =>
    <Phone src={capture(src)} alt={alt} dark={dark} sizes="(max-width: 640px) 46vw, 240px" className="w-60 max-lg:w-52 max-sm:w-44" />;
  /** each step's screen, in the order of the copy's steps */
  const screens: ReactNode[] = [
    phone('capture.webp', m.alt.capture, true),
    <Monitor key="m" className="w-full max-w-160">
      <Img src={capture('monitor-board.webp')} alt={m.live.alts[0]} sizes="(max-width: 1023px) 90vw, 640px" loading="eager" className="app-screen block h-auto w-full" />
    </Monitor>,
    phone('mobile-photo-compare.webp', m.alt.compare),
    <div key="r" className="aspect-[2000/2829] h-full max-h-full overflow-hidden rounded-[4px] bg-white shadow-device">
      <Img src={capture('report-1.webp')} alt={m.alt.reports[0]} sizes="(max-width: 640px) 60vw, 360px" loading="eager" className="app-screen block h-auto w-full" />
    </div>,
    <div key="s" className="w-full max-w-160 overflow-hidden rounded-window border border-line-2 bg-card shadow-device">
      <div aria-hidden="true" className="flex gap-1.5 border-b border-line px-3 py-2.5">{[0, 1, 2].map(i => <i key={i} className="size-2 rounded-full bg-line-2" />)}</div>
      <Img src={capture('spc-charts.webp')} alt={m.spc.alts[0]} sizes="(max-width: 1023px) 90vw, 640px" loading="eager" className="app-screen block h-auto w-full bg-white" />
    </div>
  ];
  const s = p.steps[at];

  return (
    <Band id="qf-preview">
      <Head kicker={p.title} title={p.lead} />
      <div className="rv overflow-hidden rounded-[28px] bg-bg-2 p-8 max-sm:-mx-1 max-sm:rounded-[22px] max-sm:p-5 lg:p-10">
        {/* the steps, in order: a bar each, filling while it plays */}
        <ol className="m-0 grid list-none gap-4 p-0 max-sm:gap-2" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {p.steps.map((x, k) => (
            <li key={x.title}>
              <button type="button" onClick={() => setAt(k)} aria-current={k === at ? 'step' : undefined}
                className="group grid w-full cursor-pointer gap-3 text-left">
                <span className="relative block h-1 overflow-hidden rounded-full bg-line">
                  <span key={k === at ? `on-${at}` : 'off'} style={k === at && !still ? { animationDuration: `${STEP}ms` } : undefined}
                    className={cn('absolute inset-y-0 left-0 w-full rounded-full bg-qf', k < at || (k === at && still) ? '' : k === at ? 'cycle-fill' : 'w-0')} />
                </span>
                <span className="grid gap-0.5 max-sm:hidden">
                  <span className="text-caption text-mute">{x.who}</span>
                  <span className={cn('text-body-sm font-semibold transition-colors duration-300', k === at ? 'text-fg' : 'text-mute group-hover:text-fg-2')}>{x.title}</span>
                </span>
                <span className={cn('num text-caption font-semibold sm:hidden', k === at ? 'text-fg' : 'text-mute')}>{k + 1}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid items-center gap-x-12 gap-y-8 max-sm:mt-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
          {/* the current step in words */}
          <div key={at} aria-live="polite" className="showcase-in grid content-start gap-3 max-lg:min-h-36 max-sm:min-h-40">
            <span className="flex items-center gap-2.5 text-caption font-semibold">
              <span className="text-qf-ink">{p.step(at + 1, n)}</span>
              <span className="rounded-full border border-line-2 bg-bg px-2.5 py-0.5 text-fg-2">{s.who}</span>
            </span>
            <h3 className="m-0 text-[clamp(1.6rem,2.6vw,2.25rem)] leading-tight font-bold tracking-tight">{s.title}</h3>
            <p className="m-0 text-body-lg leading-relaxed text-fg-2 text-pretty max-sm:text-body">{s.body}</p>
          </div>
          {/* its screen: all five stacked in one place, the current one shown */}
          <div className="relative h-128 max-lg:h-112 max-sm:h-92">
            {screens.map((node, k) => (
              <div key={k} aria-hidden={k !== at}
                className={cn('absolute inset-0 flex items-center justify-center transition-[opacity,translate] duration-700 ease-out', k === at ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0')}>
                {node}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="m-0 mt-6 text-center text-caption text-mute">{p.note}</p>
    </Band>
  );
}
