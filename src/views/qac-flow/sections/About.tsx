'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Img } from '../../../components/Img';
import { REDUCED } from '../../../lib/env';
import { cn } from '../../../lib/cn';
import { Browser, Head } from '../parts';

/** 'rest': drawn where it ends (no script yet, reduced motion, or already on screen when the page opened);
 * 'apart': waiting below the screen, the pieces scattered wider and the screen not there yet; 'in': played */
type Stage = 'rest' | 'apart' | 'in';
const EASE = 'cubic-bezier(.215, .61, .355, 1)';

/** One piece of the old way, a paper or a file lying a little askew, with its tag. While 'apart' it lies
 * further out and turned more (`from`), and drifts in to where it rests (`r`) once the block is on screen. */
function Piece({ stage, tag, right, r, from, delay, className, children }: {
  stage: Stage; tag: string; right?: boolean; r: number; from: [x: number, y: number, r: number]; delay: number; className: string; children: ReactNode;
}) {
  const apart = stage === 'apart';
  const style: CSSProperties = {
    transform: apart ? `translate(${from[0]}px, ${from[1]}px) rotate(${from[2]}deg)` : `rotate(${r}deg)`,
    opacity: apart ? 0 : 1,
    transition: stage === 'in' ? `transform 1s ${EASE} ${delay}ms, opacity .6s ${EASE} ${delay}ms` : undefined
  };
  return (
    <div className={cn('absolute', className)} style={style}>
      <span className={cn("absolute -top-3 z-1 rounded-full border border-line-2 bg-bg px-2.5 py-1 text-caption leading-none font-semibold whitespace-nowrap text-fg-2 max-sm:text-[.75rem]", right ? "right-3" : "left-3")}>{tag}</span>
      {children}
    </div>
  );
}

/** the ink of a hand-filled check sheet: Windows and Mac script faces for the figures */
const HAND: CSSProperties = { fontFamily: "'Segoe Print', 'Bradley Hand', 'Noteworthy', 'Comic Sans MS', cursive", color: '#2b4aa0' };

/** 서비스 소개: a record as it used to be, split into a handwritten check sheet, a photo taken separately
 * and a spreadsheet typed up again, scattered on the left, and the same record on one QAC FLOW screen on the
 * right. When the block comes into view the three pieces drift together, then the screen comes up. */
export function About() {
  const a = useT().qf.about;
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>('rest');

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED || el.getBoundingClientRect().top < innerHeight * .85) return;
    setStage('apart');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      requestAnimationFrame(() => setStage('in'));
    }, { rootMargin: '100000px 0px -25% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const apart = stage === 'apart';
  const after = (delay: number, y = 0): CSSProperties => ({
    opacity: apart ? 0 : 1,
    transform: apart ? `translateY(${y}px) scale(${y ? .97 : .6})` : 'none',
    transition: stage === 'in' ? `opacity .7s ${EASE} ${delay}ms, transform .9s ${EASE} ${delay}ms` : undefined
  });
  const th = 'border-b border-[#d9d9d9] px-1.5 py-1 text-left font-normal';

  return (
    <Band id="qf-about">
      <Head kicker={a.title} title={a.lead} />
      <div ref={ref} className="grid items-center gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,4.6fr)_auto_minmax(0,7.4fr)]">
        <figure className="m-0 grid gap-5">
          <figcaption className="text-body-sm font-semibold text-mute">{a.before}</figcaption>
          <div className="relative aspect-[6/5] max-sm:aspect-[6/7]" role="img" aria-label={`${a.pieces.sheet}, ${a.pieces.photo}, ${a.pieces.excel}`}>
            {/* the photo of the caliper, printed with its file name */}
            <Piece stage={stage} tag={a.pieces.photo} right r={6} from={[60, -30, 16]} delay={120} className="top-[2%] right-[1%] w-[40%] max-sm:w-[44%]">
              <div className="bg-white p-2 pb-1.5 shadow-[0_10px_30px_-12px_rgba(20,30,40,.35)] ring-1 ring-black/5">
                <Img src="assets/img/qacflow/caliper-photo.webp" alt="" sizes="220px" className="block aspect-square h-auto w-full object-cover" />
                <span className="block pt-1.5 font-mono text-[.6875rem] text-[#777]">{a.photo}</span>
              </div>
            </Piece>
            {/* the paper check sheet, filled in by hand */}
            <Piece stage={stage} tag={a.pieces.sheet} r={-5} from={[-50, -20, -14]} delay={0} className="top-[8%] left-[1%] w-[52%] max-sm:w-[58%]">
              <div aria-hidden="true" className="bg-[#fffdf7] px-3.5 pt-4 pb-3 text-[.75rem] text-[#333] shadow-[0_10px_30px_-12px_rgba(20,30,40,.35)] ring-1 ring-black/5 max-sm:px-2.5 max-sm:text-[.6875rem]">
                <div className="flex items-baseline justify-between border-b-2 border-[#333] pb-1 font-bold">{a.sheet.title}<span className="font-normal text-[#888]">No. 1123</span></div>
                <table className="w-full border-collapse">
                  <tbody>
                    {[[a.sheet.part, 'Drive Shaft'], ['DIM 1', '29.97'], ['DIM 2', '240.0'], ['DIM 1', '29.98'], [a.sheet.sign, '']].map(([k, v], i) => (
                      <tr key={i} className="border-b border-[#ccc]">
                        <td className="w-[45%] border-r border-[#ccc] py-1.5 pr-1.5 text-[#555]">{k}</td>
                        <td className="py-0.5 pl-2 text-[.875rem] leading-none max-sm:text-[.75rem]" style={HAND}>
                          {i === 4
                            ? <svg viewBox="0 0 60 18" className="h-4.5 w-14"><path d="M2 13c6-9 9-10 10-4s4 5 8-2 5-3 6 2 6 3 10-4 8 2 12 3 10-5" fill="none" stroke="#2b4aa0" strokeWidth="1.6" strokeLinecap="round" /></svg>
                            : v}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Piece>
            {/* the spreadsheet the readings were typed into again */}
            <Piece stage={stage} tag={a.pieces.excel} right r={-1.5} from={[-20, 50, -8]} delay={240} className="bottom-[1%] left-[16%] w-[70%] max-sm:left-[6%] max-sm:w-[88%]">
              <div aria-hidden="true" className="overflow-hidden rounded-[6px] bg-white text-[.6875rem] text-[#222] shadow-[0_14px_36px_-14px_rgba(20,30,40,.4)] ring-1 ring-black/10 max-sm:text-[.625rem]">
                <div className="bg-[#1f7244] px-2.5 py-1.5 font-semibold text-white">{a.file}</div>
                <table className="w-full border-collapse font-mono">
                  <thead className="bg-[#f2f2f2] text-[#666]">
                    <tr><th className={cn(th, 'w-5 border-r text-center')} />{['A', 'B', 'C', 'D'].map(c => <th key={c} className={cn(th, 'border-r text-center')}>{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[[a.sheet.part, 'DIM 1', 'DIM 2', ''], ['Drive Shaft', '29.975', '240.0', 'OK'], ['Drive Shaft', '29.977', '239.94', 'OK'], ['', '', '', '']].map((row, i) => (
                      <tr key={i}>
                        <td className="border-r border-b border-[#d9d9d9] bg-[#f2f2f2] text-center text-[#666]">{i + 1}</td>
                        {row.map((v, j) => (
                          <td key={j} className={cn('h-5.5 border-r border-b border-[#d9d9d9] px-1.5 whitespace-nowrap', i === 3 && j === 1 && 'outline-2 -outline-offset-1 outline-[#1f7244]')}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Piece>
          </div>
        </figure>

        <span aria-hidden="true" style={after(650)} className="mx-auto grid size-12 place-items-center rounded-full bg-qf text-on-acc">
          <ArrowRight className="size-5.5 max-lg:hidden" strokeWidth={2.2} />
          <ArrowDown className="size-5.5 lg:hidden" strokeWidth={2.2} />
        </span>

        <figure className="m-0 grid gap-5" style={after(850, 24)}>
          <figcaption className="text-body-sm font-semibold text-qf-ink">{a.after}</figcaption>
          <Browser src="web-approval-main.webp" alt={a.alt} sizes="(max-width: 1023px) 92vw, 680px" className="shadow-[0_24px_60px_-28px_rgba(20,30,40,.35)]" />
          <p className="m-0 text-body-sm text-fg-2">{a.caption}</p>
        </figure>
      </div>
      <p className="rv m-0 mt-12 max-w-180 text-body leading-relaxed text-fg-2 max-sm:mt-9">{a.note}</p>
    </Band>
  );
}
