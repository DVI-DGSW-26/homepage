// A capture seen full size: every app screen on the page (the phones, the browser windows) is a button
// that opens it in a dialog, fitted to the screen from the widest copy the image pipeline made, with its
// description under it. There it zooms up to MAX times the fitted size: the wheel and a two-finger
// pinch zoom about the pointer, a double click toggles, the buttons below (and +, −, 0 on the keyboard)
// step; zoomed in, a drag pans, never past the picture's edge. Esc or a click outside closes it.
import { useEffect, useRef, useState, type PointerEvent, type ReactNode, type WheelEvent } from 'react';
import { Maximize2, Scan, ZoomIn, ZoomOut } from 'lucide-react';
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
    <button type="button" aria-haspopup="dialog" onClick={() => zoom({ src, alt })}
      className={cn('group relative block w-full cursor-zoom-in p-0 text-left', className)}>
      {children}
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="pointer-events-none absolute right-2.5 bottom-2.5 grid size-8 place-items-center rounded-full bg-ink/75 text-ink-fg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100">
        <Maximize2 className="size-4" strokeWidth={1.8} />
      </span>
    </button>
  );
}

export function ZoomDialog() {
  const z = useZoomed(), m = useT().media;
  return (
    <Modal open={z != null} onClose={() => zoom(null)} closeLabel={m.close} aria-label={z?.alt}>
      {z && <Viewer key={z.src} z={z} />}
    </Modal>
  );
}

/** how far it zooms past the fitted size, and how much a button press or a key steps */
const MAX = 4, STEP = 1.6, DOUBLE = 2.5;
/** s: the scale over the fitted size; x, y: the picture's offset from its fitted place, in px */
type View = { s: number; x: number; y: number };
const FIT: View = { s: 1, x: 0, y: 0 };
type Pt = { x: number; y: number };

function Viewer({ z }: { z: Zoomed }) {
  const m = useT().media;
  const [view, setView] = useState(FIT);
  /** eased for the buttons, keys and the double click; a wheel, a pinch and a drag follow the hand */
  const [eased, setEased] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, Pt>());
  const pinch = useRef<{ d: number; s: number } | null>(null);

  // the offset kept within what the zoom adds on each side, so the picture always covers its fitted box
  const clamp = (s: number, x: number, y: number): View => {
    const el = stage.current!, mx = el.offsetWidth * (s - 1) / 2, my = el.offsetHeight * (s - 1) / 2;
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
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
  const mid = (a: Pt, b: Pt) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const onPointerDown = (e: PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const [a, b] = [...pointers.current.values()];
    if (b) pinch.current = { d: dist(a, b), s: view.s };
  };
  const onPointerMove = (e: PointerEvent) => {
    const last = pointers.current.get(e.pointerId); if (!last) return;
    const now = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, now);
    const [a, b] = [...pointers.current.values()];
    if (b && pinch.current) { const p = pinch.current; zoomTo(() => p.s * dist(a, b) / p.d, mid(a, b)); return; }
    if (view.s > 1) { setEased(false); setView(v => clamp(v.s, v.x + now.x - last.x, v.y + now.y - last.y)); }
  };
  const onPointerUp = (e: PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };
  const onWheel = (e: WheelEvent) => zoomTo(s => s * Math.exp(-e.deltaY * .002), { x: e.clientX, y: e.clientY });
  const onDoubleClick = (e: { clientX: number; clientY: number }) =>
    view.s > 1 ? fit() : zoomTo(() => DOUBLE, { x: e.clientX, y: e.clientY }, true);

  const button = 'grid size-11 cursor-pointer place-items-center rounded-full text-ink-fg transition-colors duration-300 hover:text-on-photo disabled:cursor-default disabled:opacity-40';
  return <>
    <figure className="m-0 grid justify-items-center gap-3">
      <div ref={stage} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        onWheel={onWheel} onDoubleClick={onDoubleClick}
        className={cn('relative z-1 touch-none select-none', view.s > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in')}>
        {/* the widest copy: zoomed in, the screen asks for more pixels than the fitted size shows */}
        <Img src={z.src} alt={z.alt} sizes="2400px" priority draggable={false}
          className={cn('app-screen block h-auto max-h-[calc(100dvh-10rem)] w-auto max-w-[calc(100vw-2rem)] origin-center rounded-card bg-plate', eased && 'transition-transform duration-300 ease-out')}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }} />
      </div>
      <figcaption className="max-w-[min(48rem,calc(100vw-2rem))] text-center text-body-sm text-ink-fg-2">{z.alt}</figcaption>
    </figure>
    {/* the zoom controls, fixed at the foot of the screen over whatever the zoomed picture covers */}
    <div className="fixed bottom-4 left-1/2 z-2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-ink-line-2 bg-ink/80 p-1">
      <button type="button" onClick={() => step(1 / STEP)} disabled={view.s <= 1} aria-label={m.zoomOut} className={button}><ZoomOut className="size-5" strokeWidth={1.6} aria-hidden="true" /></button>
      <output aria-live="polite" className="num min-w-14 text-center text-body-sm text-ink-fg">{Math.round(view.s * 100)}%</output>
      <button type="button" onClick={() => step(STEP)} disabled={view.s >= MAX} aria-label={m.zoomIn} className={button}><ZoomIn className="size-5" strokeWidth={1.6} aria-hidden="true" /></button>
      <button type="button" onClick={fit} disabled={view.s === 1} aria-label={m.fit} className={button}><Scan className="size-5" strokeWidth={1.6} aria-hidden="true" /></button>
    </div>
  </>;
}
