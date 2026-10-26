import { lines, useT } from '../../../i18n';
import { Band, Eyebrow, H2, Lead } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { PhonePair } from '../parts';

const UNIT = 'text-unit text-fg-2';

/** the name, the promise, the figures up front, and the app in two phones */
export function Intro() {
  const m = useT().qf;
  const figures = [
    <><small className={UNIT}>~</small><span data-count="98">0</span><small className={UNIT}>%</small></>,
    <span data-count="0">0</span>,
    <><span className="text-unit-lg">2026.06.01</span><small className={UNIT}>~</small></>
  ];
  return (
    <Band id="qf-intro" cover>
      <div className="grid items-center gap-stack-sm md:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
        <div>
          <p className="rv m-0 mb-4.5 font-display text-wordmark leading-display font-extrabold tracking-heading-sm">Q.A.C<span className="text-qf-ink">-Flow</span></p>
          <Eyebrow className="rv">{m.expand}</Eyebrow>
          <H2 className="rv mt-5.5">{m.title}</H2>
          <Lead className="rv mt-5.5">{lines(m.lead)}</Lead>
          <ul className="rv m-0 mt-8 grid list-none grid-cols-3 border-t border-line p-0 md:mt-12">
            {figures.map((fig, i) => (
              <li key={i} className="grid content-start gap-2 pt-4.5 pr-3 not-first:border-l not-first:border-line not-first:pl-stat-gap">
                <b className={cn('num flex items-baseline gap-0.5 font-display text-stat leading-display font-extrabold whitespace-nowrap', i === 0 && 'text-qf-ink')}>{fig}</b>
                <span className="text-caption leading-caption text-fg-2">{m.stats[i]}</span>
              </li>
            ))}
          </ul>
          <p className="rv mono m-0 mt-4 text-mute">{m.statsNote}</p>
        </div>
        {/* a soft green light behind the phones */}
        <div className="rv relative isolate before:absolute before:inset-[8%_-10%_0] before:-z-1 before:bg-radial-[closest-side] before:from-qf-soft before:to-transparent before:to-70% max-md:before:inset-[8%_0_0]">
          <PhonePair back={{ src: 'ocr-input.webp', alt: m.alt.ocr }} front={{ src: 'capture.webp', alt: m.alt.capture, dark: true }} />
        </div>
      </div>
    </Band>
  );
}
