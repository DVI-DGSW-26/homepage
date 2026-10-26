// Device mockups the Q.A.C-Flow screens sit in, drawn in CSS rather than baked into the captures:
// a screen swaps (another language, a sharper capture) without touching the frame, and the frame
// stays sharp at any size and pixel density.
//
//   <Phone>    an iPhone 16 Pro Max to Apple's dimensional drawings: titanium band, black glass, the
//              buttons and Camera Control, the Dynamic Island, an HTML status bar (9:41, so the capture
//              needs none of its own) and the home indicator; face on, or turned in CSS 3D with its
//              side showing its true thickness
//   <Monitor>  a Studio Display: black glass bezel with the camera, aluminum edge, stand and foot;
//              its screen is the floor app in React (src/features/qac-monitor), themed with the page, so not dimmed
//
// Both are container-query sized (@container, cqw units), so they keep their proportions however wide
// they are drawn.
import type { CSSProperties, ReactNode } from 'react';
import { Img } from './Img';
import { cn } from './ui';

/** status bar glyphs, drawn with the current colour; sized in points of the display (--pt) */
function StatusIcons() {
  return (
    <span className="flex items-center gap-[calc(var(--pt)*5.5)]">
      <svg viewBox="0 0 18 12" className="h-[calc(var(--pt)*11.5)] w-auto fill-current">
        <rect x="0" y="8" width="3" height="4" rx=".8" /><rect x="5" y="5.5" width="3" height="6.5" rx=".8" />
        <rect x="10" y="3" width="3" height="9" rx=".8" /><rect x="15" y="0" width="3" height="12" rx=".8" />
      </svg>
      <svg viewBox="0 0 16 12" className="h-[calc(var(--pt)*11.5)] w-auto fill-none stroke-current stroke-[1.9] [stroke-linecap:round]">
        <path d="M1.5 4.4a9.2 9.2 0 0 1 13 0M4.2 7.1a5.4 5.4 0 0 1 7.6 0" /><circle cx="8" cy="10" r="1.3" className="fill-current stroke-none" />
      </svg>
      <svg viewBox="0 0 27 13" className="h-[calc(var(--pt)*12.5)] w-auto fill-current">
        <rect x=".5" y=".5" width="23" height="12" rx="3.5" className="fill-none stroke-current opacity-40" />
        <rect x="2" y="2" width="20" height="9" rx="2" /><rect x="24.8" y="4.5" width="1.6" height="4" rx=".8" className="opacity-40" />
      </svg>
    </span>
  );
}

// The iPhone 16 Pro Max in millimetres, from Apple's "iPhone 16 Pro Max Dimensional Drawings" (2024-09-19)
/** the body, how far in the cover glass and the display (440 × 956 pt) begin, and the display's corner radius */
const BODY = { w: 77.58, h: 163.03, t: 8.25 };
const GLASS = 1, DISPLAY = 2.36, RADIUS = 10.3;
/** the Dynamic Island, its top down from the top of the display */
const ISLAND = { w: 20.76, h: 6.07, top: 2.32 };
/** the buttons, as [top, length, on the left] down the side; all 2.66 across and standing .45 proud */
const BUTTONS = [[30.63, 6.9, true], [42.63, 11.2, true], [56.83, 11.2, true], [46.48, 17.7, false]] as const;
const BUTTON = { wid: 2.66, out: .45 };
/** Camera Control, flush in the right side low down: [top, length, width] */
const CAMERA_CONTROL = [103.07, 17.1, 3.03] as const;

/** millimetres as cqw of the body's width, and as a share of its height */
const mm = (v: number) => `${+(v * 100 / BODY.w).toFixed(3)}cqw`;
const down = (v: number) => `${+(v * 100 / BODY.h).toFixed(3)}%`;

/** how far each view turns the phone about its upright axis (positive: the face turns to the right,
 * showing the left side); it leans a seventh of that in the picture plane as well */
const VIEWS = { front: 0, right: 12, left: -12 };
export type PhoneView = keyof typeof VIEWS;
/** turned, the body behind the face is a stack of slices, close enough that no gap opens between them */
const SLICES = 16;
const METAL = 'bg-linear-to-r from-titanium via-titanium-hi to-titanium';

/** an iPhone around a phone capture (865 × 1672, with its status and navigation bars cropped off),
 * seen from `view` (face on, or turned left or right); `dark` for a screen that runs black to its
 * edges (the camera), so the bars turn white */
export function Phone({ src, alt, sizes, dark, view = 'front', className }: { src: string; alt: string; sizes: string; dark?: boolean; view?: PhoneView; className?: string }) {
  const turn = VIEWS[view];
  const r = RADIUS + DISPLAY;
  return (
    // turned, the phone is a 3D scene on its own compositor layers, and Chrome treats everything
    // painted after a 3D layer as overlapping it, compositing the rest of the page and drawing its text
    // greyscale on Windows instead of ClearType; paint containment bounds the scene to the figure (the
    // clip margin keeps the shadow and buttons whole)
    <figure className={cn('@container relative m-0', turn !== 0 && '[contain:paint] [overflow-clip-margin:120px]', className)}>
      <div style={turn ? { perspective: mm(600) } : undefined}>
        <div className={cn('relative', turn !== 0 && 'transform-3d')} style={turn ? { transform: `rotateY(${turn}deg) rotateZ(${-turn / 7}deg)` } : undefined}>
          {/* the body behind the face: brushed titanium, lightest across the middle of the side, the back slice casting the shadow */}
          {turn !== 0 && Array.from({ length: SLICES }, (_, i) => {
            const t = (i + 1) / SLICES;
            return <i key={i} aria-hidden="true" className={cn('absolute inset-0', t === 1 && 'shadow-device')}
              style={{ borderRadius: mm(r), transform: `translateZ(${mm(-BODY.t * t)})`, background: `color-mix(in srgb, var(--color-titanium-hi) ${Math.round(15 + 50 * Math.sin(Math.PI * t))}%, var(--color-titanium))` }} />;
          })}
          {/* the buttons: face on, a sliver past the edge behind the body; turned, a plate standing out
              from the middle of the side, facing the way the side does */}
          {BUTTONS.map(([top, len, left]) => (
            <i key={top} aria-hidden="true"
              className={cn('absolute', turn ? cn('rounded-[.8cqw] bg-linear-to-b from-titanium-hi via-alu-lo to-titanium-hi', left ? 'origin-left' : 'origin-right')
                : cn('w-[1.4cqw]', METAL, left ? 'rounded-l-[.6cqw]' : 'rounded-r-[.6cqw]'))}
              style={{
                top: down(top), height: down(len), [left ? 'left' : 'right']: mm(-BUTTON.out),
                ...(turn && { width: mm(BUTTON.wid), transform: `translateZ(${mm(BUTTON.wid / 2 - BODY.t / 2)}) rotateY(${left ? 90 : -90}deg)` })
              }} />
          ))}
          {/* Camera Control: sapphire in a polished ring, flush with the side, so it only shows turned */}
          {turn !== 0 && (
            <i aria-hidden="true" className="absolute right-0 origin-right rounded-full bg-glass ring-[.35cqw] ring-alu ring-inset"
              style={{ top: down(CAMERA_CONTROL[0]), height: down(CAMERA_CONTROL[1]), width: mm(CAMERA_CONTROL[2]), transform: `translateZ(${mm(CAMERA_CONTROL[2] / 2 - BODY.t / 2)}) rotateY(-90deg)` }} />
          )}
          {/* the face: the titanium band, the black glass, the display */}
          <div className={cn('relative bg-linear-135 from-titanium-hi via-titanium to-titanium-hi', !turn && 'shadow-device')}
            style={{ aspectRatio: `${BODY.w} / ${BODY.h}`, borderRadius: mm(r) }}>
            <div className="absolute bg-glass ring-1 ring-white/10" style={{ inset: mm(GLASS), borderRadius: mm(r - GLASS) }}>
              <div className={cn('app-screen absolute flex flex-col overflow-hidden', dark ? 'bg-glass text-on-photo' : 'bg-plate text-glass')}
                style={{ '--pt': mm((BODY.w - 2 * DISPLAY) / 440), inset: mm(DISPLAY - GLASS), borderRadius: mm(RADIUS) } as CSSProperties}>
                <div aria-hidden="true" className="relative grid h-[calc(var(--pt)*62)] flex-none grid-cols-[1fr_calc(var(--pt)*126)_1fr] items-center pt-[calc(var(--pt)*4)]">
                  <span className="num justify-self-center pl-[calc(var(--pt)*10)] text-[calc(var(--pt)*17)] leading-none font-semibold tracking-tight">9:41</span>
                  <span className="absolute left-1/2 -translate-x-1/2 rounded-full bg-glass" style={{ top: mm(ISLAND.top), width: mm(ISLAND.w), height: mm(ISLAND.h) }} />
                  <span className="col-start-3 justify-self-center pr-[calc(var(--pt)*4)]"><StatusIcons /></span>
                </div>
                <Img src={src} alt={alt} sizes={sizes} className="block aspect-865/1672 h-auto w-full flex-none" />
                <div aria-hidden="true" className="relative flex-1">
                  <span className={cn('absolute bottom-[calc(var(--pt)*8)] left-1/2 h-[calc(var(--pt)*5)] w-[calc(var(--pt)*139)] -translate-x-1/2 rounded-full', dark ? 'bg-on-photo' : 'bg-glass')} />
                </div>
                {/* the glass catches a little light across its face */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-120 from-white/14 via-white/0 via-40% to-transparent mix-blend-soft-light" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

/** a Studio Display; `children` is its screen, 1600 × 876 */
export function Monitor({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <figure className={cn('@container m-0', className)}>
      {/* the aluminum edge shows as a hairline around the glass */}
      <div className="relative z-1 rounded-[1.5cqw] bg-linear-to-b from-alu-hi via-alu to-alu-lo p-[.18cqw] shadow-device">
        <div className="relative rounded-[1.35cqw] bg-glass p-[1.6cqw]">
          <i aria-hidden="true" className="absolute top-[.6cqw] left-1/2 size-[.45cqw] -translate-x-1/2 rounded-full bg-titanium ring-[.12cqw] ring-white/5" />
          <div className="relative aspect-1600/876 overflow-hidden rounded-[.3cqw] bg-glass">
            {children}
            {/* a faint reflection across the glass */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-115 from-white/5 via-white/0 via-30% to-transparent" />
          </div>
        </div>
      </div>
      {/* the stand: a sheet of aluminum dropping from behind, shaded where the display overhangs it, onto its foot */}
      <div aria-hidden="true" className="mx-auto h-[9cqw] w-[24%] bg-linear-to-b from-alu-lo via-alu to-alu-hi [clip-path:polygon(3%_0,97%_0,100%_100%,0_100%)]" />
      <div aria-hidden="true" className="mx-auto h-[.9cqw] w-[34%] rounded-b-[.6cqw] bg-linear-to-b from-alu-hi to-alu-lo" />
      <div aria-hidden="true" className="mx-auto -mt-[.4cqw] h-[2cqw] w-[44%] rounded-[50%] bg-glass/45 blur-[1.2cqw]" />
    </figure>
  );
}
