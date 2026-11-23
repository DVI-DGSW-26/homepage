import { ArrowRight, CalendarDays, CircleCheck, MapPin, ShieldCheck } from 'lucide-react';
import { lines, useT } from '../../../i18n';
import { Band, Eyebrow, H2, Lead, Pill } from '../../../components/ui';
import { openInquiry } from '../../../lib/inquiry';
import { DEMO_VIDEO, HERO_LOOP, openVideo } from '../../../lib/media';
import { BOOTH, CES_END } from '../../../lib/site';
import { PhonePair } from '../parts';

/** In `pnpm dev` only, the places the planned films will take are marked while their files are still to
 * come (HERO_LOOP, DEMO_VIDEO in src/lib/media.ts); the built site shows nothing for them until then. */
const MARK_PENDING = process.env.NODE_ENV === 'development';

/** the CES banner, the name, the promise, the way to a demo (and to the demo film, once there is one),
 * the figures up front, and the app in two phones, the front one playing the hero loop over its still */
export function Intro() {
  const t = useT(), m = t.qf;
  return (
    <Band id="qf-intro" cover>
      <div className="grid items-center gap-stack-sm md:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
        <div>
          <CesBanner />
          <h1 className="rv m-0 mb-4.5 font-display text-wordmark leading-display font-extrabold tracking-heading-sm">QAC<span className="text-qf-ink"> FLOW</span></h1>
          {/* one line on the narrowest phones too: the caps track tighter there */}
          <Eyebrow className="rv max-sm:tracking-wide">{m.expand}</Eyebrow>
          <H2 className="rv mt-5.5">{m.title}</H2>
          <Lead className="rv mt-5.5">{lines(m.lead)}</Lead>
          <div className="rv mt-7 flex flex-wrap gap-3">
            <Pill href="#contact" aria-haspopup="dialog" onClick={openInquiry('hero')}>{m.cta.demo}</Pill>
            {DEMO_VIDEO
              ? <Pill quiet href="#qf-how" aria-haspopup="dialog" onClick={e => { e.preventDefault(); openVideo(true); }}>{t.media.watch(DEMO_VIDEO.seconds)}</Pill>
              : MARK_PENDING && <span aria-hidden="true" className="inline-flex min-h-11 items-center rounded-full border border-dashed border-qf-line px-5.5 py-2.5 text-body-sm text-mute">{t.media.watch(90)} · 영상 자리</span>}
          </div>
          {/* the claims themselves are the headline: what it doesn't need (and what it does), and since when it runs */}
          <ul className="rv m-0 mt-8 grid list-none grid-cols-2 border-t border-line p-0 md:mt-10 max-2xs:grid-cols-1">
            <li className="grid content-start gap-2 pt-5 pr-4">
              <b className="flex items-start gap-2.5 text-title leading-snug font-semibold text-fg">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-6 flex-none text-qf-ink" strokeWidth={2} />{m.stats[0]}
              </b>
              <span className="text-body-sm leading-caption text-fg-2">{m.kit}</span>
            </li>
            <li className="grid content-start gap-2 border-l border-line pt-5 pl-stat-gap max-2xs:border-t max-2xs:border-l-0 max-2xs:pl-0">
              <b className="num font-display text-stat leading-display font-extrabold whitespace-nowrap text-fg">2026.06</b>
              <span className="text-body-sm leading-caption font-medium text-fg">{m.stats[1]}</span>
            </li>
          </ul>
          <p className="rv m-0 mt-5 inline-flex items-center gap-2 rounded-full border border-qf-line bg-qf-soft px-4 py-2 text-body-sm font-medium text-fg">
            <ShieldCheck aria-hidden="true" className="size-4.5 flex-none text-qf-ink" strokeWidth={2} />{m.statsNote}
          </p>
        </div>
        {/* a soft green light behind the phones */}
        <div className="rv relative isolate before:absolute before:inset-[8%_-10%_0] before:-z-1 before:bg-radial-[closest-side] before:from-qf-soft before:to-transparent before:to-70% max-md:before:inset-[8%_0_0]">
          <PhonePair priority back={{ src: 'ocr-input.webp', alt: m.alt.ocr }} front={{ src: 'capture.webp', alt: m.alt.capture, dark: true, loop: HERO_LOOP ?? undefined, marker: !HERO_LOOP && MARK_PENDING ? <><b>반복 영상 자리</b><span>8~12초 · 무음 · 2MB 이하<br />세로 865 × 1672</span></> : undefined }} />
        </div>
      </div>
    </Band>
  );
}

/** Above the name: the booth at CES 2027 until the show closes, then a way to the online demo instead.
 * Read when the page renders, so a page left open across the close changes on its next visit. */
function CesBanner() {
  const c = useT().qf.ces;
  // an event notice: a solid CES 2027 tag at the start of a soft green pill, then when, where and the invitation
  const pill = 'rv mb-7 flex w-fit max-w-full items-center gap-3 rounded-full border border-qf-line bg-qf-soft py-1.5 pr-5 pl-1.5 text-body-sm text-fg max-sm:items-start max-sm:rounded-3xl max-sm:pr-4';
  const tag = (
    <span className="inline-flex flex-none items-center gap-1.5 rounded-full bg-qf px-3 py-1 text-caption font-bold tracking-wide text-on-acc">
      <i aria-hidden="true" className="size-1.5 rounded-full bg-current motion-safe:animate-pulse" />{c.label}
    </span>
  );
  if (Date.now() >= CES_END) {
    return (
      <a href="#contact" aria-haspopup="dialog" onClick={openInquiry('hero')} className={`${pill} transition-colors duration-300 hover:border-qf`}>
        {tag}<span className="self-center font-medium">{c.after}</span><ArrowRight aria-hidden="true" className="size-4 flex-none self-center text-qf-ink" />
      </a>
    );
  }
  return (
    <p className={`${pill} m-0`}>
      {tag}
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1 self-center">
        <span className="inline-flex items-center gap-1.5 font-semibold"><CalendarDays aria-hidden="true" className="size-4 text-qf-ink" />{c.when}</span>
        <span className="inline-flex items-center gap-1.5 font-semibold" title={c.hall}><MapPin aria-hidden="true" className="size-4 text-qf-ink" />{c.where(BOOTH)}</span>
        <span className="basis-full text-fg-2">{c.try}</span>
      </span>
    </p>
  );
}
