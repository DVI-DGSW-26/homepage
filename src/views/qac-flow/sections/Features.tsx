'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useT } from '../../../i18n';
import { Phone } from '../../../components/Device';
import { Img } from '../../../components/Img';
import { Zoomable } from '../../../components/Zoom';
import { Band } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { useBackToClose } from '../../../lib/history';
import { Browser, Head, useCapture } from '../parts';

/** 주요 기능: five cards, each a feature's name, one sentence and its real screen rising from the card's
 * foot (three portrait ones in the first row, the two wide screens in the second). A card opens a side
 * panel on the right, as a product page tells one feature in full: its name, a few sentences, its screens
 * larger, and what it does as a two-column table (FeaturePanel). */
export function Features() {
  const m = useT().qf, f = m.features, capture = useCapture();
  const [open, setOpen] = useState<number | null>(null);
  const shot = (src: string, alt: string, sizes: string) => (
    <Zoomable src={capture(src)} alt={alt}>
      <Img src={capture(src)} alt={alt} sizes={sizes} className="app-screen block h-auto w-full" />
    </Zoomable>
  );
  const page = (i: number, sizes: string) => <div className="overflow-hidden rounded-[4px] bg-white shadow-device">{shot(`report-${i + 1}.webp`, m.alt.reports[i], sizes)}</div>;
  const wide = 'ml-[8%] max-sm:ml-[6%] overflow-hidden rounded-tl-[10px] border-t border-l border-line-2 bg-white shadow-device';

  /** each card's span in the grid, the screen at its foot, and the larger screens in its panel */
  const cards: { span: string; view: ReactNode; panel: ReactNode }[] = [
    {
      span: 'lg:col-span-2',
      view: <Focus src={capture('ocr-focus.webp')} alt={m.alt.ocr} box={[8.4, 74.6, 83.2, 14.8]} label={f.focus[0]} inside />,
      panel: (
        <ul className="m-0 flex list-none items-start justify-center gap-[5%] p-0">
          {(['capture', 'crop', 'ocr-input'] as const).map(s => (
            <li key={s} className="w-[30%]"><Phone src={capture(`${s}.webp`)} alt={m.alt[s === 'ocr-input' ? 'ocr' : s]} sizes="(max-width: 640px) 28vw, 180px" dark={s === 'capture'} /></li>
          ))}
        </ul>
      )
    },
    {
      span: 'lg:col-span-2',
      view: <Focus src={capture('compare-focus.webp')} alt={m.alt.compare} box={[4.6, 28.8, 90.8, 64]} label={f.focus[1]} />,
      panel: (
        <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,.42fr)_minmax(0,1fr)]">
          <Phone src={capture('mobile-photo-compare.webp')} alt={m.alt.compare} sizes="(max-width: 640px) 60vw, 220px" className="mx-auto w-full max-w-55" />
          <Browser src="web-approval.webp" alt={m.alt.approval} sizes="(max-width: 640px) 92vw, 420px" />
        </div>
      )
    },
    {
      span: 'lg:col-span-2',
      view: <div className="mx-auto w-[74%] rounded-t-[4px]">{page(0, '(max-width: 1023px) 70vw, 320px')}</div>,
      panel: <ul className="m-0 grid list-none grid-cols-3 gap-3 p-0">{[0, 1, 2].map(i => <li key={i}>{page(i, '(max-width: 640px) 30vw, 190px')}</li>)}</ul>
    },
    {
      span: 'lg:col-span-3',
      view: <div className={wide}>{shot('monitor-board.webp', m.live.alts[0], '(max-width: 1023px) 92vw, 620px')}</div>,
      panel: <Slides items={['monitor-board', 'monitor-detail', 'monitor-defects'].map((src, k) => ({ src: capture(`${src}.webp`), alt: m.live.alts[k], label: m.live.tabs[k] }))} ratio="aspect-[16/9.4]" />
    },
    {
      span: 'lg:col-span-3',
      view: <div className={wide}>{shot('spc-charts.webp', m.spc.alts[0], '(max-width: 1023px) 92vw, 620px')}</div>,
      panel: <Slides items={['spc-charts', 'spc-capability', 'equip-issues', 'equip-issue-detail'].map((src, k) => ({ src: capture(`${src}.webp`), alt: m.spc.alts[k], label: m.spc.views[k].title }))} />
    }
  ];

  return (
    <Band id="qf-features">
      <Head kicker={f.title} title={f.lead} />
      <ul data-batch className="m-0 grid list-none gap-5 p-0 lg:grid-cols-6">
        {f.items.map((x, i) => (
          <li key={x.name} className={cn('rv group relative grid grid-rows-[auto_1fr] overflow-hidden rounded-[24px] bg-bg-2 transition-[background-color,box-shadow] duration-300 hover:bg-card hover:shadow-[0_0_0_1px_var(--color-line-2)] has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-qf', cards[i].span)}>
            <div className="grid gap-2 p-6 pb-5 sm:p-8 sm:pb-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="m-0 text-title-xs font-semibold">
                  {/* the whole card is this button's target (it covers the card); the screen below is a picture here */}
                  <button type="button" aria-haspopup="dialog" onClick={() => setOpen(i)} className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:z-1 after:content-['']">{x.name}</button>
                </h3>
                <span aria-hidden="true" className="grid size-8 flex-none place-items-center rounded-full border border-line-2 text-fg-2 transition-colors duration-300 group-hover:border-qf group-hover:bg-qf group-hover:text-on-acc">
                  <Plus className="size-4" strokeWidth={2} />
                </span>
              </div>
              <p className="m-0 max-w-120 text-body-sm leading-copy text-fg-2">{x.body}</p>
            </div>
            <div inert aria-hidden="true" className={cn('relative h-80 overflow-hidden lg:h-96', i < 2 ? 'max-sm:h-auto max-sm:pb-6' : i < 3 ? 'max-sm:h-64' : 'max-sm:h-44')}>
              <div className={cn('absolute inset-x-0 top-0 transition-transform duration-500 ease-out group-hover:-translate-y-2', i < 2 && 'max-sm:static')}>{cards[i].view}</div>
            </div>
          </li>
        ))}
      </ul>
      <FeaturePanel at={open} onClose={() => setOpen(null)} screens={cards.map(c => c.panel)} />
    </Band>
  );
}

/** Screens shown one at a time, large: a window that swipes (scroll snap) or steps with the arrows, every
 * screen fitted into the same box so the panel does not jump, and under it the screen's name, which of how
 * many, and a dot per screen. Each screen still opens full size on a click. */
function Slides({ items, ratio = "aspect-16/11" }: { items: { src: string; alt: string; label: string }[]; ratio?: string }) {
  const f = useT().qf.features;
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const n = items.length;
  const go = (k: number) => { const el = ref.current; if (el) el.scrollTo({ left: Math.max(0, Math.min(n - 1, k)) * el.clientWidth, behavior: 'smooth' }); };
  const arrow = 'grid size-10 flex-none cursor-pointer place-items-center rounded-full border border-line-2 bg-bg text-fg transition-colors duration-300 hover:border-qf hover:text-qf-ink disabled:cursor-default disabled:opacity-35 disabled:hover:border-line-2 disabled:hover:text-fg';
  return (
    <div className="grid gap-4">
      <div ref={ref} onScroll={e => setAt(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-window border border-line-2 bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((x, k) => (
          <div key={x.src} aria-hidden={k !== at || undefined} className="w-full flex-none snap-center">
            <Zoomable src={x.src} alt={x.alt}>
              <div className={cn("relative flex items-center justify-center p-3 max-sm:p-2", ratio)}>
                <Img src={x.src} alt={x.alt} sizes="(max-width: 640px) 92vw, 640px" className="app-screen absolute block h-auto max-h-[calc(100%-1.5rem)] w-auto max-w-[calc(100%-1.5rem)] max-sm:max-h-[calc(100%-1rem)] max-sm:max-w-[calc(100%-1rem)]" />
              </div>
            </Zoomable>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => go(at - 1)} disabled={at === 0} aria-label={f.prev} className={arrow}><ChevronLeft className="size-4.5" strokeWidth={2} aria-hidden="true" /></button>
        <div className="grid min-w-0 flex-1 justify-items-center gap-2 text-center">
          <span aria-live="polite" className="truncate text-body-sm font-semibold"><span className="num mr-2 font-normal text-mute">{at + 1} / {n}</span>{items[at].label}</span>
          <span className="flex gap-1.5">
            {items.map((x, k) => (
              <button key={x.src} type="button" onClick={() => go(k)} aria-label={x.label} aria-current={k === at || undefined}
                className={cn('h-1.5 cursor-pointer rounded-full transition-[width,background-color] duration-300', k === at ? 'w-5 bg-qf' : 'w-1.5 bg-line-2 hover:bg-mute')} />
            ))}
          </span>
        </div>
        <button type="button" onClick={() => go(at + 1)} disabled={at === n - 1} aria-label={f.next} className={arrow}><ChevronRight className="size-4.5" strokeWidth={2} aria-hidden="true" /></button>
      </div>
    </div>
  );
}

/** A close-up of the part of a phone screen a card is about, large enough to read (the whole screen is in
 * the panel), with a mint box round the spot and its name on the box's bottom edge; box in % of the image */
function Focus({ src, alt, box, label, inside }: { src: string; alt: string; box: [x: number, y: number, w: number, h: number]; label: string; inside?: boolean }) {
  return (
    <div className="relative mx-auto w-[86%] overflow-hidden rounded-[20px] bg-white shadow-device ring-1 ring-black/5 max-sm:w-[92%]">
      <Img src={src} alt={alt} sizes="(max-width: 1023px) 86vw, 360px" className="app-screen block h-auto w-full" />
      <span aria-hidden="true" style={{ left: `${box[0]}%`, top: `${box[1]}%`, width: `${box[2]}%`, height: `${box[3]}%` }}
        className="absolute rounded-[10px] border-2 border-qf">
        <b className={cn('absolute right-3 -translate-y-1/2 rounded-full bg-qf px-2.5 py-1 text-caption leading-none font-bold whitespace-nowrap text-on-acc ring-2 ring-white', inside ? 'top-1/2 max-sm:right-2' : 'top-full')}>{label}</b>
      </span>
    </div>
  );
}

/** The side panel: a modal <dialog> sliding in from the right (focus stays inside, Esc, the back button
 * and a click on the backdrop close it). The feature's name, what it changes large, its intro and the problem
 * it ends, its screens on a soft plate, then what it does as rows of label | description. Every feature's
 * words are in the page from the start, each hidden until its card is opened, so search engines and AI
 * search read them; the screens are put in only for the open one. */
function FeaturePanel({ at, onClose, screens }: { at: number | null; onClose: () => void; screens: ReactNode[] }) {
  const f = useT().qf.features;
  const ref = useRef<HTMLDialogElement>(null);
  const baseId = useId();
  const open = at != null;
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  useBackToClose(open, onClose);
  return (
    <dialog ref={ref} aria-labelledby={at == null ? undefined : `${baseId}-${at}`} onClose={onClose}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      className="feature-panel fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(44rem,100%)] max-w-none overflow-y-auto overscroll-contain border-0 border-l border-line bg-bg p-0 text-fg shadow-2xl backdrop:bg-ink/45">
      <div className="grid">
          <div className="sticky top-0 z-1 flex items-center justify-between border-b border-line bg-bg/90 px-8 py-4 backdrop-blur-md max-sm:px-5">
            <span className="text-caption font-semibold text-fg-2">{f.title}</span>
            <button type="button" onClick={onClose} aria-label={f.close}
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-line text-fg-2 transition-colors duration-300 hover:border-line-2 hover:text-fg">
              <X className="size-4" strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
          {f.items.map((x, i) => (
          <div key={x.name} hidden={i !== at} className="px-8 pt-10 pb-14 max-sm:px-5 max-sm:pt-8">
            <h2 id={`${baseId}-${i}`} className="m-0 text-body font-semibold text-qf-ink">{x.name}</h2>
            <p className="m-0 mt-3 text-[clamp(1.75rem,3.6vw,2.5rem)] leading-tight font-bold tracking-tight text-balance">{x.gain}</p>
            <p className="m-0 mt-5 text-body-lg leading-relaxed text-fg-2">{x.intro}</p>
            {/* the problem it ends */}
            <div className="mt-6 grid gap-1.5 border-l-2 border-line-2 py-1 pl-4">
              <span className="text-caption font-semibold text-mute">{f.beforeHead}</span>
              <p className="m-0 text-body leading-relaxed text-fg-2">{x.before}</p>
            </div>
            {i === at && <div data-gallery className="mt-10 overflow-hidden rounded-[20px] bg-bg-2 p-6 max-sm:p-4">{screens[i]}</div>}
            <table className="mt-12 w-full border-collapse text-left">
              <thead className="sr-only"><tr><th scope="col">{f.rowsHead[0]}</th><th scope="col">{f.rowsHead[1]}</th></tr></thead>
              <tbody>
                {x.rows.map(r => (
                  <tr key={r.label} className="border-t border-line last:border-b">
                    <th scope="row" className="w-[36%] py-5 pr-6 align-top text-body-sm font-semibold max-sm:w-[40%]">{r.label}</th>
                    <td className="py-5 align-top text-body-sm leading-copy text-fg-2">{r.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ))}
      </div>
    </dialog>
  );
}
