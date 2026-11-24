'use client';
// The floor monitor on the first screen, made to run: over the status board capture (1376 × 753 here, the
// capture's own layout, the same in Korean and English) a few things are drawn in place, in % of the screen:
//   - the clock in the top right ticks every second, and the "live" dot pulses;
//   - every LOOP, as the phone in front finishes its OCR input (HeroSequence's pass mark, 76% into its 10 s),
//     the board takes the result: CNC-02 Drive Shaft's in-process cell (the phone's own part and operator)
//     turns done, "완료" goes 10 → 11 and "진행중" 2 → 1, "마지막 변경" takes the time, and a toast says what
//     came in. It all goes back as the loop starts again.
// The loop is timed from when this mounts, as the phone's CSS animation is, so the two keep in step. With
// reduced motion the board stays as captured (the phone's sequence is hidden too).
import { useEffect, useState } from 'react';
import { useLang, useT } from '../../../i18n';
import { Img } from '../../../components/Img';
import { REDUCED } from '../../../lib/env';
import { cn } from '../../../lib/cn';
import { useCapture } from '../parts';

/** the phone's loop, and when in it the board takes the result and lets it go */
const LOOP = 10000, IN = 7800, OUT = 9800;
/** the capture's clock and last change, per language: the clock runs on from there */
const START = { ko: { clock: [10, 38, 26], last: '10:38:21' }, en: { clock: [10, 27, 46], last: '10:27:41' } } as const;

/** a box over the capture, in px of its 1376 × 753 */
const at = (x: number, y: number, w: number, h: number) => ({ left: `${(x / 1376) * 100}%`, top: `${(y / 753) * 100}%`, width: `${(w / 1376) * 100}%`, height: `${(h / 753) * 100}%` });
const hms = (s: number) => [Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60].map(n => String(n).padStart(2, '0')).join(':');

export function LiveMonitor({ alt }: { alt: string }) {
  const lang = useLang(), c = useT().qf.heroMonitor, capture = useCapture();
  const start = START[lang];
  const base = start.clock[0] * 3600 + start.clock[1] * 60 + start.clock[2];
  const [secs, setSecs] = useState(0);
  const [done, setDone] = useState(false);
  const [last, setLast] = useState<string>(start.last);
  useEffect(() => {
    const t0 = performance.now();
    let shown = false;
    const id = window.setInterval(() => {
      const t = performance.now() - t0;
      setSecs(Math.floor(t / 1000));
      if (REDUCED) return;
      const phase = t % LOOP, on = phase >= IN && phase < OUT;
      if (on !== shown) {
        shown = on; setDone(on);
        setLast(on ? hms(base + Math.floor(t / 1000)) : start.last);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [base, start.last]);

  // what the overlays draw with: the board's own white and inks, sized in cqw of the screen (1376 wide)
  const cover = 'absolute flex items-center bg-white font-bold text-[#1f2937] tabular-nums';
  return (
    <div className="relative size-full">
      <Img src={capture('monitor-board.webp')} alt={alt} sizes="(max-width: 1023px) 92vw, 960px" priority className="app-screen block size-full object-cover object-top" />
      <div aria-hidden="true" className="absolute inset-0 @container">
        {/* the clock, and the live dot breathing */}
        <span className={cn(cover, 'justify-end text-[1.55cqw]')} style={at(1250, 12, 106, 32)}>{hms(base + secs)}</span>
        <span className="absolute rounded-full bg-[#11803f] motion-safe:animate-ping" style={at(1074, 23, 8, 8)} />
        {/* the last change, in the header's grey */}
        <span className={cn(cover, 'justify-end text-[.85cqw] font-medium text-[#6b7280]')} style={at(1192, 18, 50, 18)}>{last}</span>
        {/* the two counts */}
        <span className={cn(cover, 'text-[2.05cqw] transition-colors duration-500', done && 'text-[#097a2d]')} style={at(30, 97, 44, 30)}>{done ? 11 : 10}</span>
        <span className={cn(cover, 'text-[2.05cqw]')} style={at(256, 97, 40, 30)}>{done ? 1 : 2}</span>
        {/* CNC-02 Drive Shaft, in-process: from running (the capture) to done, with a brief ring as it lands */}
        <span className={cn('absolute grid place-items-center rounded-[.3cqw] border border-[#dcfae5] bg-[#ddfce6] text-[1.05cqw] font-bold text-[#097a2d] transition-opacity duration-300',
          done ? 'opacity-100' : 'opacity-0')} style={at(494, 491, 422, 31)}>
          {c.cell}
          {done && <span className="absolute -inset-[.35cqw] animate-[live-ring_1.2s_ease-out_both] rounded-[.5cqw] border-[.25cqw] border-[#3ccb9a]" />}
        </span>
        {/* the toast: what just came in, sliding up at the bottom right */}
        <div className={cn('absolute right-[2.2%] bottom-[3.5%] grid w-[30%] gap-[.5cqw] rounded-[.8cqw] border border-[#e5e7eb] bg-white p-[1.1cqw] shadow-[0_.8cqw_2.4cqw_rgb(0_0_0/.16)] transition-[opacity,translate] duration-500 ease-out',
          done ? 'translate-y-0 opacity-100' : 'translate-y-[1.5cqw] opacity-0')}>
          <span className="flex items-center gap-[.5cqw] text-[.85cqw] font-semibold text-[#097a2d]">
            <i className="size-[.6cqw] rounded-full bg-[#3ccb9a]" />{c.just} · {last}
          </span>
          <span className="text-[1cqw] font-bold text-[#1f2937]">{c.item}</span>
          <span className="flex items-center gap-[.6cqw] text-[.95cqw] text-[#4b5563]">
            {c.value}
            <b className="rounded-full bg-[#ddfce6] px-[.6cqw] py-[.15cqw] text-[.8cqw] font-bold text-[#097a2d]">{c.pass}</b>
          </span>
        </div>
      </div>
    </div>
  );
}
