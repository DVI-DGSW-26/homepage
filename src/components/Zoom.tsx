// A capture seen full size: every app screen on the page (the phones, the browser windows) is a button
// that opens it in a dialog covering the screen, in three rows that never overlap: the picture, fitted
// into what is left from the widest copy the image pipeline made; its description; the zoom controls.
// It zooms up to MAX times the fitted size: the wheel and a two-finger pinch zoom about the pointer, a
// double click toggles, the controls (and +, −, 0 on the keyboard) step; zoomed in, a drag pans, never
// past the picture's edge, and the picture stays inside its row. Esc, the back button, the close button
// or a tap on the empty space around the picture closes it. A capture inside a [data-gallery] (a feature panel's
// screens) opens with the others there: arrows on either side, ← → on the keyboard and a sideways swipe at
// the fitted size step through them.
import { useEffect, useRef, useState, type PointerEvent, type ReactNode, type WheelEvent } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Scan, ZoomIn, ZoomOut } from 'lucide-react';
import { useT } from '../i18n';
import { useZoomed, zoom, type Zoomed } from '../lib/media';
import { cn } from '../lib/cn';
import { Img } from './Img';
import { Modal } from './Modal';

/** the capture `children` draws, as a button that opens it full size; a corner chip says so on hover
 * and focus, and always on a touch screen, which has no hover */
export function Zoomable({ src, alt, className, children }: { src: string; alt: string; className?: string; children: ReactNode }) {
  const label = useT().media.zoom;
  return (
    <button type="button" aria-haspopup="dialog" data-zoom-src={src} data-zoom-alt={alt}
      onClick={e => {
        // the captures of the same gallery, in page order, once each
        const g = e.currentTarget.closest('[data-gallery]');
        const set = g ? [...new Map([...g.querySelectorAll<HTMLElement>('[data-zoom-src]')].map(b => [b.dataset.zoomSrc!, { src: b.dataset.zoomSrc!, alt: b.dataset.zoomAlt ?? '' }])).values()] : [];
        zoom({ src, alt, set: set.length > 1 ? set : undefined });
      }}
      className={cn('group relative block w-full cursor-zoom-in p-0 text-left', className)}>
      {children}
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="pointer-events-none absolute right-2.5 bottom-2.5 grid size-8 place-items-center max-sm:right-1.5 max-sm:bottom-1.5 max-sm:size-6 rounded-full bg-ink/75 text-ink-fg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100">
        <Maximize2 className="size-4 max-sm:size-3" strokeWidth={1.8} />
      </span>
    </button>
  );
}

export function ZoomDialog() {
  const z = useZoomed(), m = useT().media;
  return (
    <Modal open={z != null} onClose={() => zoom(null)} closeLabel={m.close} aria-label={z?.alt} className="fixed inset-0 m-0 h-dvh w-full backdrop:bg-ink">
      {z && <Viewer key={z.src} z={z} go={d => {
        const set = z.set; if (!set) return;
        const k = set.findIndex(x => x.src === z.src);
        zoom({ ...set[(k + d + set.length) % set.length], set });
      }} />}
    </Modal>
  );
}

/** how far it zooms past the fitted size, and how much a button press or a key steps */
const MAX = 4, STEP = 1.6, DOUBLE = 2.5;
/** a press that travels less than this is a tap */
const TAP = 6;
/** s: the scale over the fitted size; x, y: the picture's offset from its fitted place, in px */
type View = { s: number; x: number; y: number };
const FIT: View = { s: 1, x: 0, y: 0 };
type Pt = { x: number; y: number };

/** a sideways swipe this long, at the fitted size, steps to the next or previous capture */
const SWIPE = 60;

function Viewer({ z, go }: { z: Zoomed; go: (d: 1 | -1) => void }) {
  const m = useT().media;
  const [view, setView] = useState(FIT);
  /** eased for the buttons, keys and the double click; a wheel, a pinch and a drag follow the hand */
  const [eased, setEased] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, Pt>());
  const pinch = useRef<{ d: number; s: number } | null>(null);
  /** how far the current press has travelled, to tell a tap from a drag */
  const travel = useRef(0);
  /** where the current press started, to tell a sideways swipe */
  const start = useRef<Pt | null>(null);
  const many = (z.set?.length ?? 0) > 1;
  const at = many ? z.set!.findIndex(x => x.src === z.src) : -1;

  // zoomed past its row the picture pans until its edge meets the row's; until then it stays centred
  const clamp = (s: number, x: number, y: number): View => {
    const box = stage.current!, pic = img.current!;
    const mx = Math.max(0, (pic.offsetWidth * s - box.clientWidth) / 2), my = Math.max(0, (pic.offsetHeight * s - box.clientHeight) / 2);
    return { s, x: Math.max(-mx, Math.min(mx, x)), y: Math.max(-my, Math.min(my, y)) };
  };
  /** to scale `next`, keeping the point under `at` (client coordinates; the middle if none) where it is */
  const zoomTo = (next: (s: number) => number, at?: Pt, ease = false) => {
    setEased(ease);
    setView(v => {
      const s = Math.max(1, Math.min(MAX, next(v.s)));
      const r = stage.current!.getBoundingClientRect();
      const px = at ? at.x - (r.left + r.width / 2) : 0, py = at ? at.y - (r.top + r.height / 2) : 0;
      return clamp(s, px - (px - v.x) * s / v.s, py - (py - v.y) * s / v.s);
    });
  };
  const step = (k: number) => zoomTo(s => s * k, undefined, true);
  const fit = () => { setEased(true); setView(FIT); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') step(STEP);
      else if (e.key === '-') step(1 / STEP);
      else if (e.key === '0') fit();
      else if (many && e.key === 'ArrowRight') go(1);
      else if (many && e.key === 'ArrowLeft') go(-1);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
  const mid = (a: Pt, b: Pt) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const onPointerDown = (e: PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) { travel.current = 0; start.current = { x: e.clientX, y: e.clientY }; }
    const [a, b] = [...pointers.current.values()];
    if (b) pinch.current = { d: dist(a, b), s: view.s };
  };
  const onPointerMove = (e: PointerEvent) => {
    const last = pointers.current.get(e.pointerId); if (!last) return;
    const now = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, now);
    travel.current += dist(last, now);
    const [a, b] = [...pointers.current.values()];
    if (b && pinch.current) { const p = pinch.current; zoomTo(() => p.s * dist(a, b) / p.d, mid(a, b)); return; }
    if (view.s > 1) { setEased(false); setView(v => clamp(v.s, v.x + now.x - last.x, v.y + now.y - last.y)); }
  };
  const onPointerUp = (e: PointerEvent) => {
    const s0 = start.current, dx = s0 ? e.clientX - s0.x : 0, dy = s0 ? e.clientY - s0.y : 0;
    if (many && view.s === 1 && pointers.current.size === 1 && Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy) * 1.5) {
      travel.current = TAP; // not a tap: the swipe must not also close it
      go(dx < 0 ? 1 : -1);
    }
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };
  // a tap on the empty space around the picture (not a drag or a pinch) closes it, as a backdrop would
  const onClick = (e: { target: EventTarget }) => { if (e.target !== img.current && travel.current < TAP) zoom(null); };
  const onWheel = (e: WheelEvent) => zoomTo(s => s * Math.exp(-e.deltaY * .002), { x: e.clientX, y: e.clientY });
  const onDoubleClick = (e: { clientX: number; clientY: number }) =>
    view.s > 1 ? fit() : zoomTo(() => DOUBLE, { x: e.clientX, y: e.clientY }, true);

  const side = 'absolute top-1/2 z-1 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-ink-line-2 bg-ink/80 text-ink-fg transition-colors duration-300 hover:text-on-photo max-sm:size-10';
  const button = 'grid size-11 cursor-pointer place-items-center rounded-full text-ink-fg transition-colors duration-300 hover:text-on-photo disabled:cursor-default disabled:opacity-40';
  return (
    // the top band is left to the close button (Modal)
    <figure className="relative m-0 grid h-full grid-rows-[minmax(0,1fr)_auto_auto] justify-items-center gap-3 px-4 pt-16 pb-4">
      <div ref={stage} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        onClick={onClick} onWheel={onWheel} onDoubleClick={onDoubleClick}
        className={cn('relative size-full touch-none overflow-hidden select-none', view.s > 1 && 'cursor-grab active:cursor-grabbing')}>
        {/* the widest copy: zoomed in, the screen asks for more pixels than the fitted size shows */}
        <Img ref={img} src={z.src} alt={z.alt} sizes="2400px" priority draggable={false}
          className={cn('app-screen absolute inset-0 m-auto h-auto max-h-full w-auto max-w-full origin-center rounded-card bg-plate', view.s === 1 && 'cursor-zoom-in', eased && 'transition-transform duration-300 ease-out')}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }} />
      </div>
      {many && <>
        <button type="button" onClick={() => go(-1)} aria-label={m.prev} className={cn(side, 'left-4 max-sm:left-2')}><ChevronLeft className="size-6" strokeWidth={1.8} aria-hidden="true" /></button>
        <button type="button" onClick={() => go(1)} aria-label={m.next} className={cn(side, 'right-4 max-sm:right-2')}><ChevronRight className="size-6" strokeWidth={1.8} aria-hidden="true" /></button>
      </>}
      <figcaption className="max-w-3xl text-center text-body-sm text-ink-fg-2 max-sm:line-clamp-2">
        {many && <span className="num mr-2 font-semibold text-ink-fg">{at + 1} / {z.set!.length}</span>}{z.alt}
      </figcaption>
      <div className="flex items-center gap-1 rounded-full border border-ink-line-2 bg-ink/80 p-1">
        <button type="button" onClick={() => step(1 / STEP)} disabled={view.s <= 1} aria-label={m.zoomOut} className={button}><ZoomOut className="size-5" strokeWidth={1.6} aria-hidden="true" /></button>
        <output aria-live="polite" className="num min-w-14 text-center text-body-sm text-ink-fg">{Math.round(view.s * 100)}%</output>
        <button type="button" onClick={() => step(STEP)} disabled={view.s >= MAX} aria-label={m.zoomIn} className={button}><ZoomIn className="size-5" strokeWidth={1.6} aria-hidden="true" /></button>
        <button type="button" onClick={fit} disabled={view.s === 1} aria-label={m.fit} className={button}><Scan className="size-5" strokeWidth={1.6} aria-hidden="true" /></button>
      </div>
    </figure>
  );
}
