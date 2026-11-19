import { lines, useT } from '../../../i18n';
import { ICON } from '../../../components/icons';
import { Band, Eyebrow, H2, Lead, LineIcon, Pill } from '../../../components/ui';
import { openInquiry } from '../../../lib/inquiry';
import { PhonePair } from '../parts';

/** the name, the promise, the way to a demo, the figures up front, and the app in two phones */
export function Intro() {
  const m = useT().qf;
  const figures = [
    <LineIcon d={ICON.checkCircle} className="size-[0.9em] text-qf-ink" />,
    <span className="text-unit-lg">2026.06</span>
  ];
  return (
    <Band id="qf-intro" cover>
      <div className="grid items-center gap-stack-sm md:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
        <div>
          <h1 className="rv m-0 mb-4.5 font-display text-wordmark leading-display font-extrabold tracking-heading-sm">QAC<span className="text-qf-ink"> FLOW</span></h1>
          <Eyebrow className="rv">{m.expand}</Eyebrow>
          <H2 className="rv mt-5.5">{m.title}</H2>
          <Lead className="rv mt-5.5">{lines(m.lead)}</Lead>
          <div className="rv mt-7"><Pill href="#contact" aria-haspopup="dialog" onClick={openInquiry('hero')}>{m.cta.demo}</Pill></div>
          <ul className="rv m-0 mt-8 grid list-none grid-cols-2 border-t border-line p-0 md:mt-10">
            {figures.map((fig, i) => (
              <li key={i} className="grid content-start gap-2 pt-4.5 pr-3 not-first:border-l not-first:border-line not-first:pl-stat-gap">
                <b className="num flex h-[1em] items-center font-display text-stat leading-display font-extrabold whitespace-nowrap">{fig}</b>
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
