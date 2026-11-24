'use client';
import { useState, type KeyboardEvent } from 'react';
import { useT } from '../../../i18n';
import { Monitor, Phone } from '../../../components/Device';
import { Img } from '../../../components/Img';
import { Zoomable } from '../../../components/Zoom';
import { Band } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { Browser, Head, useCapture } from '../parts';
import { HeroSequence } from './HeroSequence';

/** 서비스 미리보기: the app's main screens in one large frame, a segmented control above it choosing which, and
 * a line over each screen saying what it is for:
 * the mobile app (the camera playing photo → crop → OCR, beside the crop and the result), the floor
 * monitor, the PC analysis, and the report's three pages. */
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
  const page = (i: number) => (
    <figure className="m-0 w-full overflow-hidden rounded-[4px] bg-white shadow-device">
      <Zoomable src={capture(`report-${i + 1}.webp`)} alt={m.alt.reports[i]}>
        <Img src={capture(`report-${i + 1}.webp`)} alt={m.alt.reports[i]} sizes="(max-width: 767px) 30vw, 300px" className="app-screen block h-auto w-full" />
      </Zoomable>
    </figure>
  );
  const views = [
    <ul key="mobile" className="m-0 flex w-full list-none items-start justify-center gap-[5%] p-0">
      <li className="w-[27%] pt-[10%]"><Phone src={capture('crop.webp')} alt={m.alt.crop} sizes="(max-width: 767px) 26vw, 220px" /></li>
      <li className="w-[33%]"><Phone src={capture('capture.webp')} alt={m.alt.capture} sizes="(max-width: 767px) 32vw, 270px" dark overlay={<HeroSequence />} /></li>
      <li className="w-[27%] pt-[10%]"><Phone src={capture('ocr-input.webp')} alt={m.alt.ocr} sizes="(max-width: 767px) 26vw, 220px" /></li>
    </ul>,
    <Monitor key="monitor" className="w-[92%]">
      <Zoomable src={capture('monitor-board.webp')} alt={m.live.alts[0]} className="h-full">
        <Img src={capture('monitor-board.webp')} alt={m.live.alts[0]} sizes="(max-width: 1440px) 92vw, 1100px" className="app-screen block size-full object-cover object-top" />
      </Zoomable>
    </Monitor>,
    <Browser key="pc" src="spc-charts.webp" alt={m.spc.alts[0]} sizes="(max-width: 1440px) 92vw, 1000px" className="w-[86%]" />,
    <ul key="report" className="m-0 grid w-[92%] list-none grid-cols-3 gap-[3%] p-0">
      {[0, 1, 2].map(i => <li key={i}>{page(i)}</li>)}
    </ul>
  ];
  return (
    <Band id="qf-preview">
      <Head kicker={p.title} title={p.lead} />
      <div className="rv">
        <div role="tablist" aria-label={p.title} className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-bg-2 p-1 [scrollbar-width:none]">
          {p.tabs.map((label, i) => (
            <button key={label} id={`pv-tab-${i}`} type="button" role="tab" aria-selected={i === at} aria-controls="pv-panel" tabIndex={i === at ? 0 : -1}
              onClick={() => setAt(i)} onKeyDown={onKey}
              className={cn('flex-none cursor-pointer rounded-full px-5 py-2.5 text-body-sm font-semibold whitespace-nowrap transition-[background-color,color,box-shadow] duration-300 max-sm:px-3 max-sm:text-caption',
                i === at ? 'bg-bg text-fg shadow-[0_1px_3px_rgb(0_0_0/.12)]' : 'text-fg-2 hover:text-fg')}>{label}</button>
          ))}
        </div>
        {/* the frame: a soft mint light at its top, the chosen screen inside */}
        <div role="tabpanel" id="pv-panel" aria-labelledby={`pv-tab-${at}`}
          className="relative mt-8 grid min-h-[min(46rem,70vw)] place-items-center overflow-hidden rounded-[28px] bg-bg-2 px-4 py-10 sm:px-8 sm:py-14 max-sm:min-h-0">
          <div aria-hidden="true" className="absolute inset-x-[15%] -top-24 h-64 rounded-full bg-radial/srgb from-acc-glow to-transparent to-70% opacity-70 blur-3xl" />
          <div key={at} className="showcase-in relative grid w-full justify-items-center gap-10 max-sm:gap-7">
            {/* what this screen is for: a line over it */}
            <div className="grid max-w-150 gap-2.5 text-center">
              <h3 className="m-0 text-title leading-snug font-bold">{p.views[at].title}</h3>
              <p className="m-0 text-body leading-relaxed text-fg-2 text-pretty">{p.views[at].body}</p>
            </div>
            <div className="flex w-full justify-center">{views[at]}</div>
          </div>
        </div>
        <p className="m-0 mt-6 text-center text-caption text-mute">{p.note}</p>
      </div>
    </Band>
  );
}
