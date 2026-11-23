// Pieces the QAC FLOW sections share: the question-and-answer head of each block, and the device
// frames the in-house app's screens sit in.
import type { ReactNode } from 'react';
import { lines, useLang } from '../../i18n';
import { Img } from '../../components/Img';
import { Phone, type Loop } from '../../components/Device';
import { Zoomable } from '../../components/Zoom';
import { Kicker, Lead } from '../../components/ui';
import { cn } from '../../lib/cn';

const IMG = 'assets/img/qacflow/';
/** the screens captured again in English, under en/ as WebP; any other shows its Korean capture in English too */
const EN = new Set(['capture', 'ocr-input', 'crop', 'mobile-photo-compare', 'web-approval', 'report-1', 'report-2', 'report-3', 'spc-charts', 'spc-capability', 'equip-issues', 'equip-issue-detail', 'monitor-board', 'monitor-detail', 'monitor-defects']);

/** A screen's path in the language being read. Customer and personal names are masked in the image
 * files themselves, and the phone captures have their status and navigation bars cropped off so they
 * sit in the CSS iPhone (Device.tsx). */
export function useCapture() {
  const en = useLang() === 'en';
  return (src: string) => {
    const name = src.replace(/\.\w+$/, '');
    return IMG + (en && EN.has(name) ? `en/${name}.webp` : src);
  };
}

/** each block opens with the visitor's question, then answers it: a one-line answer, then the detail */
export function Head({ kicker, q, title, lead }: { kicker: string; q: string; title: string; lead?: string }) {
  return (
    <div className="mb-stack-sm max-w-208">
      <Kicker>{kicker}</Kicker>
      <h3 className="rv m-0 mt-3.5 text-h2 leading-h2 font-semibold tracking-tight text-balance">{q}</h3>
      <p className="rv m-0 mt-5 border-l-2 border-qf pl-4 text-title-lg leading-title font-semibold text-balance">{title}</p>
      {lead && <Lead className="rv mt-3.5 max-w-160 pl-4.5">{lines(lead)}</Lead>}
    </div>
  );
}

export type Capture = { src: string; alt: string; dark?: boolean; loop?: Loop; marker?: ReactNode };
/** a phone in a pair is drawn at 3/4 of the pair, at most 460px wide */
const PAIR_SIZES = '(max-width: 599px) 70vw, 350px';

/** two phones turned in toward each other, the front one lower-left over the back one; `priority` on the first screen */
export function PhonePair({ back, front, priority, className }: { back: Capture; front: Capture; priority?: boolean; className?: string }) {
  const capture = useCapture();
  return (
    <div className={cn('relative mx-auto grid w-full max-w-115 grid-cols-12 items-start', className)}>
      <Phone {...back} src={capture(back.src)} sizes={PAIR_SIZES} priority={priority} view="left" className="col-[4/13] row-start-1" />
      <Phone {...front} src={capture(front.src)} sizes={PAIR_SIZES} priority={priority} view="right" className="z-1 col-[1/10] row-start-1 mt-[14%]" />
    </div>
  );
}

/** a browser window around a web screen; no address bar, so no internal URL. The screen opens full size on a click. */
export function Browser({ src, alt, sizes, caption, className }: { src: string; alt: string; sizes: string; caption?: ReactNode; className?: string }) {
  const capture = useCapture();
  return (
    <figure className={cn('m-0 overflow-hidden rounded-window border border-line-2 bg-card', className)}>
      <div aria-hidden="true" className="flex gap-1.5 border-b border-line px-3 py-2.5">{[0, 1, 2].map(i => <i key={i} className="size-2 rounded-full bg-line-2" />)}</div>
      <Zoomable src={capture(src)} alt={alt}>
        <Img src={capture(src)} alt={alt} sizes={sizes} className="app-screen block h-auto w-full bg-plate" />
      </Zoomable>
      {caption && <figcaption className="mono border-t border-line px-3.5 py-2.5 text-mute">{caption}</figcaption>}
    </figure>
  );
}

/** where a label points on a screen, in % of the image (the end of its stem), and which way the label
 * runs from there: centred over the spot, or starting / ending at it near an edge of the screen */
export type Pin = { x: number; y: number; side?: 'start' | 'end' };

/** A web screen with short labels set on it, each on a stem ending at the thing it names, so the screen
 * explains itself; it still opens full size on a click (the labels let the click through). */
export function Annotated({ src, alt, sizes, caption, pins, labels, className }: {
  src: string; alt: string; sizes: string; caption?: ReactNode; pins: Pin[]; labels: readonly string[]; className?: string;
}) {
  const capture = useCapture();
  return (
    <figure className={cn('m-0 overflow-hidden rounded-window border border-line-2 bg-card', className)}>
      <div aria-hidden="true" className="flex gap-1.5 border-b border-line px-3 py-2.5">{[0, 1, 2].map(i => <i key={i} className="size-2 rounded-full bg-line-2" />)}</div>
      <Zoomable src={capture(src)} alt={alt}>
        <div className="relative">
          <Img src={capture(src)} alt={alt} sizes={sizes} className="app-screen block h-auto w-full bg-plate" />
          {pins.map((p, i) => (
            <span key={i} aria-hidden="true" style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className={cn('pointer-events-none absolute grid -translate-y-full drop-shadow-[0_2px_6px_rgb(0_0_0/.3)]',
                p.side === 'start' ? 'justify-items-start -translate-x-1.5' : p.side === 'end' ? 'justify-items-end -translate-x-[calc(100%-.375rem)]' : 'justify-items-center -translate-x-1/2')}>
              <b className="rounded-full bg-qf px-2.5 py-1 text-caption leading-none font-bold whitespace-nowrap text-on-acc ring-2 ring-white max-sm:px-1.5 max-sm:py-0.5 max-sm:text-[.625rem]">{labels[i]}</b>
              {/* the stem, and a dot on the spot */}
              <i className={cn('h-3 w-0.5 bg-qf max-sm:h-1.5', p.side === 'start' ? 'ml-1' : p.side === 'end' ? 'mr-1' : '')} />
              <i className="size-2 -translate-y-px rounded-full bg-qf ring-2 ring-white max-sm:size-1.5" />
            </span>
          ))}
        </div>
      </Zoomable>
      {caption && <figcaption className="mono border-t border-line px-3.5 py-2.5 text-mute">{caption}</figcaption>}
    </figure>
  );
}

/** a step's title and body, beside its number or icon (the grid around it places them) */
export function StepText({ title, body, className }: { title: ReactNode; body: ReactNode; className?: string }) {
  return <>
    <h4 className={cn('m-0 text-title-xs font-semibold', className)}>{title}</h4>
    <p className="m-0 mt-1.5 text-body-sm leading-copy text-fg-2">{body}</p>
  </>;
}

/** In `pnpm dev` only, a dashed box where a screen or photo still to come will go (the built site shows
 * nothing in its place), so the layout can be judged before the files arrive. */
export function Pending({ label, className }: { label: string; className?: string }) {
  if (process.env.NODE_ENV !== 'development') return null;
  return <div aria-hidden="true" className={cn('grid place-items-center rounded-card border border-dashed border-qf-line p-4 text-center text-body-sm text-mute', className)}>{label}</div>;
}
