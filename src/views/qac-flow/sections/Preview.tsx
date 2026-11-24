'use client';
import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useT } from '../../../i18n';
import { Monitor, Phone } from '../../../components/Device';
import { Img } from '../../../components/Img';
import { Band } from '../../../components/ui';
import { REDUCED } from '../../../lib/env';
import { cn } from '../../../lib/cn';
import { Head, useCapture } from '../parts';

/** how long each screen of a tab stays before the next, in ms */
const STEP = 3800;

/**
 * 서비스 미리보기: the app in motion. A segmented control picks one of four uses; its frame plays that use's
 * screens one after another (Cycle): the phone through photo → crop → OCR input, the floor monitor through
 * its three screens, the SPC screens, the report's three pages. A bar of labelled segments under the frame
 * shows where it is and jumps on a click. Until there is a real film (DEMO_VIDEO), this is the moving view.
 */
export function Preview() {
  const m = useT().qf, p = m.preview, capture = useCapture();
  const [at, setAt] = useState(0);
  const n = p.tabs.length;
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = e.key === 'ArrowRight' ? (at + 1) % n : e.key === 'ArrowLeft' ? (at + n - 1) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault(); setAt(next);
    document.getElementById(`pv-tab-${next}`)?.focus();
  };
  const img = (src: string, alt: string, sizes: string, fit = 'size-full object-cover object-top') =>
    <Img src={capture(src)} alt={alt} sizes={sizes} loading="eager" className={cn('app-screen block', fit)} />;
  /** each tab's frame, and its screens in the order they play, each with its label in the bar */
  const tabs: { frame: (screen: ReactNode) => ReactNode; screens: { label: string; node: ReactNode }[] }[] = [
    {
      frame: s => <div className="w-[min(34%,17rem)] max-sm:w-[56%]">{s}</div>,
      screens: (['capture', 'crop', 'ocr-input'] as const).map((src, i) => ({
        label: m.how.steps[i].title,
        node: <Phone src={capture(`${src}.webp`)} alt={m.alt[src === 'ocr-input' ? 'ocr' : src]} sizes="(max-width: 640px) 56vw, 272px" dark={src === 'capture'} />
      }))
    },
    {
      frame: s => <Monitor className="w-[92%]">{s}</Monitor>,
      screens: ['monitor-board', 'monitor-detail', 'monitor-defects'].map((src, i) => ({
        label: m.live.tabs[i], node: img(`${src}.webp`, m.live.alts[i], '(max-width: 1440px) 92vw, 1100px')
      }))
    },
    {
      frame: s => (
        <div className="w-[88%] overflow-hidden rounded-window border border-line-2 bg-card shadow-device">
          <div aria-hidden="true" className="flex gap-1.5 border-b border-line px-3 py-2.5">{[0, 1, 2].map(i => <i key={i} className="size-2 rounded-full bg-line-2" />)}</div>
          <div className="aspect-16/10 bg-white">{s}</div>
        </div>
      ),
      screens: ['spc-charts', 'spc-capability', 'equip-issues', 'equip-issue-detail'].map((src, i) => ({
        label: m.spc.views[i].title, node: img(`${src}.webp`, m.spc.alts[i], '(max-width: 1440px) 88vw, 1000px', 'size-full object-contain object-top')
      }))
    },
    {
      frame: s => <div className="w-[min(46%,26rem)] overflow-hidden rounded-[4px] bg-white shadow-device max-sm:w-[78%]">{s}</div>,
      screens: [0, 1, 2].map(i => ({
        label: m.report.pages[i].title, node: img(`report-${i + 1}.webp`, m.alt.reports[i], '(max-width: 640px) 78vw, 416px', 'h-auto w-full')
      }))
    }
  ];
  const tab = tabs[at];
  return (
    <Band id="qf-preview">
      <Head kicker={p.title} title={p.lead} />
      <div className="rv">
        <div role="tablist" aria-label={p.title} className="mx-auto flex w-fit max-w-full gap-1 rounded-full bg-bg-2 p-1 max-sm:grid max-sm:w-full max-sm:grid-cols-2 max-sm:rounded-[20px]">
          {p.tabs.map((label, i) => (
            <button key={label} id={`pv-tab-${i}`} type="button" role="tab" aria-selected={i === at} aria-controls="pv-panel" tabIndex={i === at ? 0 : -1}
              onClick={() => setAt(i)} onKeyDown={onKey}
              className={cn('flex-none cursor-pointer rounded-full px-5 py-2.5 text-body-sm font-semibold whitespace-nowrap transition-[background-color,color,box-shadow] duration-300 max-sm:rounded-[16px] max-sm:px-2 max-sm:text-body-sm',
                i === at ? 'bg-bg text-fg shadow-[0_1px_3px_rgb(0_0_0/.12)]' : 'text-fg-2 hover:text-fg')}>{label}</button>
          ))}
        </div>
        <div role="tabpanel" id="pv-panel" aria-labelledby={`pv-tab-${at}`}
          className="relative mt-8 overflow-hidden rounded-[28px] bg-bg-2 px-4 py-12 max-sm:-mx-1 max-sm:mt-5 max-sm:rounded-[22px] max-sm:py-9 sm:px-8 sm:py-14">
          <div aria-hidden="true" className="absolute inset-x-[15%] -top-24 h-64 rounded-full bg-radial/srgb from-acc-glow to-transparent to-70% opacity-70 blur-3xl" />
          <div key={at} className="showcase-in relative grid justify-items-center gap-10 max-sm:gap-7">
            {/* what this use is for: a line over it */}
            <div className="grid max-w-170 gap-3.5 text-center">
              <h3 className="m-0 text-[clamp(1.45rem,2.6vw,2.25rem)] leading-tight font-bold tracking-tight">{p.views[at].title}</h3>
              <p className="m-0 text-title leading-relaxed text-fg-2 text-pretty max-sm:text-body">{p.views[at].body}</p>
            </div>
            <Cycle frame={tab.frame} screens={tab.screens} />
          </div>
        </div>
        <p className="m-0 mt-6 text-center text-caption text-mute">{p.note}</p>
      </div>
    </Band>
  );
}

/** One use's screens playing in turn inside its frame: all stacked in one cell, the current one shown, the
 * next fading in after STEP. Under the frame, a segment per screen with its label, the current one filling
 * up as it plays; a click on a segment shows that screen. With reduced motion (read after hydration, so the
 * server's markup and the first client render agree) nothing plays by itself; the segments are the way through. */
function Cycle({ frame, screens }: { frame: (screen: ReactNode) => ReactNode; screens: { label: string; node: ReactNode }[] }) {
  const [i, setI] = useState(0);
  const [still, setStill] = useState(false);
  const n = screens.length;
  useEffect(() => { setStill(REDUCED); }, []);
  useEffect(() => {
    if (still) return;
    const t = window.setTimeout(() => setI(x => (x + 1) % n), STEP);
    return () => window.clearTimeout(t);
  }, [i, n, still]);
  return (
    <div className="grid w-full justify-items-center gap-8">
      <div className="flex w-full justify-center">
        {frame(
          <div className="grid size-full [&>*]:col-start-1 [&>*]:row-start-1">
            {screens.map((s, k) => (
              <div key={s.label} aria-hidden={k !== i} className={cn('size-full transition-opacity duration-700 ease-out', k === i ? 'opacity-100' : 'opacity-0')}>{s.node}</div>
            ))}
          </div>
        )}
      </div>
      <ol className="m-0 grid w-full max-w-170 list-none gap-3 p-0" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {screens.map((s, k) => (
          <li key={s.label}>
            <button type="button" onClick={() => setI(k)} aria-current={k === i || undefined}
              className="group grid w-full cursor-pointer gap-2.5 text-left">
              <span className="relative block h-1 overflow-hidden rounded-full bg-line">
                <span key={k === i ? `on-${i}` : 'off'} style={k === i && !still ? { animationDuration: `${STEP}ms` } : undefined}
                  className={cn('absolute inset-y-0 left-0 w-full rounded-full bg-qf', k < i || (k === i && still) ? '' : k === i ? 'cycle-fill' : 'w-0')} />
              </span>
              <span className={cn('text-body-sm font-semibold transition-colors duration-300 max-sm:text-caption', k === i ? 'text-fg' : 'text-mute group-hover:text-fg-2')}>{s.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
