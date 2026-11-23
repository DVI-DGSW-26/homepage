import type { ReactNode } from 'react';
import { ArrowRight, CalendarDays, Camera, CircleCheck, FileCheck2, MapPin, ScanText, ShieldCheck } from 'lucide-react';
import { lines, useT } from '../../../i18n';
import { Phone } from '../../../components/Device';
import { H2, Lead, Pill } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { openInquiry } from '../../../lib/inquiry';
import { DEMO_VIDEO, HERO_LOOP, openVideo } from '../../../lib/media';
import { BOOTH, CES_END, duringCes } from '../../../lib/site';
import { useCapture } from '../parts';
import { HeroSequence } from './HeroSequence';

/** In `pnpm dev` only, the places the planned films will take are marked while their files are still to
 * come (HERO_LOOP, DEMO_VIDEO in src/lib/media.ts); the built site shows nothing for them until then. */
const MARK_PENDING = process.env.NODE_ENV === 'development';

/** each phone drawn at most this wide: the middle one, the two behind it */
const FRONT_SIZES = '(max-width: 1199px) 38vw, 300px';
const SIDE_SIZES = '(max-width: 1199px) 23vw, 180px';

/**
 * The first screen, in two columns: on the left the CES notice, the name and the promise, the way to a
 * demo and the two claims; on the right the app in three phones, face on, at staggered heights — the
 * camera in the middle, the largest, playing the hero loop (or until there is one the captures in turn,
 * HeroSequence), the OCR result and the patrol approval smaller on either side. Below a desktop the
 * columns stack, centred: the copy, the phones, the claims.
 */
export function Intro() {
  const t = useT(), m = t.qf, capture = useCapture();
  return (
    <section id="qf-intro" className="relative isolate overflow-hidden pt-36 pb-section max-sm:pt-28">

      {/* a desktop: the copy and the claims under it on the left, the phones on the right across both;
          below that, stacked: the copy, the phones, the claims */}
      <div className="wrap grid gap-stack-sm lg:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-10">
        <div className="grid justify-items-start self-end text-left max-lg:justify-items-center max-lg:text-center">
          <CesBanner />
          <h1 className="rv m-0 font-display text-wordmark leading-display font-extrabold tracking-heading-sm">QAC<span className="text-qf-ink"> FLOW</span></h1>
          {/* the letters of the name spelled out after a short rule; one line on the narrowest phones too */}
          <p className="rv mono m-0 mt-3 flex items-center gap-3.5 text-fg-2 before:h-px before:w-8.5 before:bg-line-2 max-sm:tracking-wide max-sm:before:hidden">{m.expand}</p>
          <H2 className="rv mt-6">{m.title}</H2>
          <Lead className="rv mt-5 max-w-140">{lines(m.lead)}</Lead>
          <div className="rv mt-8 flex flex-wrap gap-3 max-lg:justify-center">
            <Pill href="#contact" aria-haspopup="dialog" onClick={openInquiry('hero')}>{duringCes() ? m.cta.cesDemo : m.cta.demo}</Pill>
            {DEMO_VIDEO
              ? <Pill quiet href="#qf-how" aria-haspopup="dialog" onClick={e => { e.preventDefault(); openVideo(true); }}>{t.media.watch(DEMO_VIDEO.seconds)}</Pill>
              : <Pill quiet href="#qf-how">{m.cta.how}<ArrowRight aria-hidden="true" className="size-4" /></Pill>}
            {!DEMO_VIDEO && MARK_PENDING && <span aria-hidden="true" className="inline-flex min-h-11 items-center rounded-full border border-dashed border-qf-line px-5.5 py-2.5 text-body-sm text-mute">{t.media.watch(90)} · 영상 자리</span>}
          </div>
        </div>

        {/* The three phones side by side, face on, at staggered heights, whole and apart: the film in the
            middle, the largest and the highest; the OCR result and the patrol approval smaller and lower on
            either side. Each with its name under it. */}
        <ul className="rv m-0 flex w-full list-none items-start justify-center gap-[4%] self-center p-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <li className="grid w-[25%] justify-items-center gap-3.5 pt-[16%]">
            <Phone src={capture('ocr-input.webp')} alt={m.alt.ocr} sizes={SIDE_SIZES} className="w-full" />
            <Caption icon={<ScanText className="size-4" />} className="max-sm:hidden">{m.problem.afterSteps[1]}</Caption>
          </li>
          <li className="grid w-[42%] justify-items-center gap-4">
            <Phone src={capture('capture.webp')} alt={m.alt.capture} sizes={FRONT_SIZES} priority dark loop={HERO_LOOP ?? undefined}
              overlay={HERO_LOOP ? undefined : <HeroSequence />} className="w-full" />
            <Caption strong icon={<Camera className="size-4" />}>{m.how.steps.map(x => x.title).join(' → ')}</Caption>
          </li>
          <li className="grid w-[25%] justify-items-center gap-3.5 pt-[30%]">
            <Phone src={capture('mobile-compare.webp')} alt={m.alt.compare} sizes={SIDE_SIZES} className="w-full" />
            <Caption icon={<FileCheck2 className="size-4" />} className="max-sm:hidden">{m.problem.afterSteps[3]}</Caption>
          </li>
        </ul>

        {/* the two claims */}
        <ul className="rv m-0 grid w-full max-w-140 list-none grid-cols-2 gap-3 self-start p-0 text-left max-lg:mx-auto lg:col-start-1 max-2xs:grid-cols-1">
          <li><Claim icon={<CircleCheck className="size-5" strokeWidth={2} />} title={m.kit} sub={m.stats[0]} big /></li>
          <li><Claim figure="2026.06" title={m.stats[1]} sub={m.statsNote} /></li>
        </ul>
      </div>
    </section>
  );
}

/** a card with one claim: an icon or a big figure, the claim (`big`: larger, for the one to stand out), a line under it */
function Claim({ icon, figure, title, sub, big }: { icon?: ReactNode; figure?: string; title: string; sub: string; big?: boolean }) {
  return (
    <div className="grid h-full content-start gap-2 rounded-card border border-line bg-card/85 p-4.5 text-left shadow-device backdrop-blur-md">
      {figure
        ? <b className="num font-display text-stat leading-display font-extrabold text-fg">{figure}</b>
        : <span className="grid size-9 place-items-center rounded-full bg-qf text-on-acc">{icon}</span>}
      <b className={cn('leading-snug text-fg', big ? 'text-title-lg font-bold' : 'text-title-xs font-semibold')}>{title}</b>
      <span className="inline-flex items-start gap-1.5 text-caption leading-caption text-fg-2">
        {figure && <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 flex-none text-qf-ink" />}{sub}
      </span>
    </div>
  );
}

/** the name under a phone: what it shows; `strong` for the middle one */
function Caption({ icon, strong, className, children }: { icon: ReactNode; strong?: boolean; className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-flex max-w-full items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-caption font-medium',
      strong ? 'border-qf-line bg-qf-soft text-fg' : 'border-line bg-card/70 text-fg-2', className)}>
      <span aria-hidden="true" className={cn('grid size-7 flex-none place-items-center rounded-full', strong ? 'bg-qf text-on-acc' : 'bg-line text-fg-2')}>{icon}</span>
      <span className="text-balance">{children}</span>
    </span>
  );
}

/** Above the name: the booth at CES 2027 until the show closes (CES_END), then a way to the online demo instead.
 * Read when the page renders, so a page left open across the close changes on its next visit. */
function CesBanner() {
  const c = useT().qf.ces;
  // an event notice: a solid CES 2027 tag at the start of a soft green pill, then when, where and the invitation
  const pill = 'rv mb-7 flex w-fit max-w-full items-center gap-3 rounded-full border border-qf-line bg-qf-soft py-1.5 pr-5 pl-1.5 text-left text-body-sm text-fg max-sm:items-start max-sm:rounded-3xl max-sm:pr-4';
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
        {/* under them, on a line of its own */}
        <span className="basis-full text-fg-2">{c.try}</span>
      </span>
    </p>
  );
}
