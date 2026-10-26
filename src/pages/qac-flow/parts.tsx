// Pieces the Q.A.C-Flow sections share: the question-and-answer head of each block, and the device
// frames the in-house app's screens sit in.
import type { ReactNode } from 'react';
import { lines, useLang } from '../../i18n';
import { Img } from '../../components/Img';
import { Phone } from '../../components/Device';
import { Kicker, Lead } from '../../components/ui';
import { cn } from '../../lib/cn';

const IMG = 'assets/img/qacflow/';
/** the screens captured again in English, under en/ as WebP; any other shows its Korean capture in English too */
const EN = new Set(['capture', 'ocr-input', 'crop', 'mobile-compare', 'mobile-photo-compare', 'web-approval', 'report-summary']);

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

export type Capture = { src: string; alt: string; dark?: boolean };
/** a phone in a pair is drawn at 3/4 of the pair, at most 460px wide */
const PAIR_SIZES = '(max-width: 599px) 70vw, 350px';

/** two phones turned in toward each other, the front one lower-left over the back one */
export function PhonePair({ back, front, className }: { back: Capture; front: Capture; className?: string }) {
  const capture = useCapture();
  return (
    <div className={cn('relative mx-auto grid w-full max-w-115 grid-cols-12 items-start', className)}>
      <Phone {...back} src={capture(back.src)} sizes={PAIR_SIZES} view="left" className="col-[4/13] row-start-1" />
      <Phone {...front} src={capture(front.src)} sizes={PAIR_SIZES} view="right" className="z-1 col-[1/10] row-start-1 mt-[14%]" />
    </div>
  );
}

/** a browser window around a web screen; no address bar, so no internal URL */
export function Browser({ src, alt, sizes, caption, className }: { src: string; alt: string; sizes: string; caption?: ReactNode; className?: string }) {
  const capture = useCapture();
  return (
    <figure className={cn('m-0 overflow-hidden rounded-window border border-line-2 bg-card', className)}>
      <div aria-hidden="true" className="flex gap-1.5 border-b border-line px-3 py-2.5">{[0, 1, 2].map(i => <i key={i} className="size-2 rounded-full bg-line-2" />)}</div>
      <Img src={capture(src)} alt={alt} sizes={sizes} className="app-screen h-auto w-full bg-plate" />
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
