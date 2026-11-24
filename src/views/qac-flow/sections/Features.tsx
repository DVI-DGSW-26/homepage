import type { ReactNode } from 'react';
import { useT } from '../../../i18n';
import { Phone } from '../../../components/Device';
import { Img } from '../../../components/Img';
import { Zoomable } from '../../../components/Zoom';
import { Band } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { Head, useCapture } from '../parts';

/** 주요 기능: five cards, each a feature's name, one sentence and its real screen rising from the card's
 * foot. Three portrait ones in the first row (two phones and a report page), the two wide screens (the
 * floor monitor, SPC) in the second. */
export function Features() {
  const m = useT().qf, f = m.features, capture = useCapture();
  const shot = (src: string, alt: string, sizes: string) => (
    <Zoomable src={capture(src)} alt={alt}>
      <Img src={capture(src)} alt={alt} sizes={sizes} className="app-screen block h-auto w-full" />
    </Zoomable>
  );
  const views: { span: string; view: ReactNode }[] = [
    { span: 'lg:col-span-2', view: <Phone src={capture('ocr-input.webp')} alt={m.alt.ocr} sizes="(max-width: 1023px) 60vw, 260px" className="mx-auto w-[62%] max-w-65" /> },
    { span: 'lg:col-span-2', view: <Phone src={capture('mobile-photo-compare.webp')} alt={m.alt.compare} sizes="(max-width: 1023px) 60vw, 260px" className="mx-auto w-[62%] max-w-65" /> },
    { span: 'lg:col-span-2', view: <div className="mx-auto w-[74%] overflow-hidden rounded-t-[4px] bg-white shadow-device">{shot('report-1.webp', m.alt.reports[0], '(max-width: 1023px) 70vw, 320px')}</div> },
    { span: 'lg:col-span-3', view: <div className="ml-[8%] overflow-hidden rounded-tl-[10px] border-t border-l border-line-2 bg-white shadow-device">{shot('monitor-board.webp', m.live.alts[0], '(max-width: 1023px) 92vw, 620px')}</div> },
    { span: 'lg:col-span-3', view: <div className="ml-[8%] overflow-hidden rounded-tl-[10px] border-t border-l border-line-2 bg-white shadow-device">{shot('spc-charts.webp', m.spc.alts[0], '(max-width: 1023px) 92vw, 620px')}</div> }
  ];
  return (
    <Band id="qf-features">
      <Head kicker={f.title} title={f.lead} />
      <ul data-batch className="m-0 grid list-none gap-5 p-0 lg:grid-cols-6">
        {f.items.map((x, i) => (
          <li key={x.name} className={cn('rv grid grid-rows-[auto_1fr] overflow-hidden rounded-[24px] bg-bg-2', views[i].span)}>
            <div className="grid gap-2 p-7 pb-6 sm:p-8 sm:pb-6">
              <h3 className="m-0 text-title-xs font-semibold">{x.name}</h3>
              <p className="m-0 max-w-120 text-body-sm leading-copy text-fg-2">{x.body}</p>
            </div>
            {/* the screen, cropped at the card's foot */}
            <div className="relative h-80 overflow-hidden max-sm:h-72 lg:h-96">
              <div className="absolute inset-x-0 top-0 px-0">{views[i].view}</div>
            </div>
          </li>
        ))}
      </ul>
    </Band>
  );
}
