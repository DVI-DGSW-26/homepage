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
const FRONT_SIZES = '(max-width: 849px) 40vw, 340px';
const SIDE_SIZES = '(max-width: 1086px) 23vw, 250px';

/**
 * The first screen, centred: the CES notice, the name and the promise, the way to a demo, then the app in
 * three phones side by side — the camera in the middle, large, playing the hero loop (or until there is
 * one the captures in turn, HeroSequence), the OCR result and the patrol approval smaller on either side —
 * and the two claims under them. Concentric rings and a green light behind the middle phone.
 */
export function Intro() {
  const t = useT(), m = t.qf, capture = useCapture();
  return (
    <section id="qf-intro" className="relative isolate overflow-hidden pt-36 pb-section max-sm:pt-28">
      {/* rings spreading from the middle phone, fading out toward the edges, and a green light behind it */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 bg-[repeating-radial-gradient(circle_at_50%_68%,transparent_0_119px,var(--color-deco)_119px_120px)] mask-[radial-gradient(ellipse_75%_60%_at_50%_68%,#000_20%,transparent)]" />
      <div aria-hidden="true" className="absolute top-[45%] left-1/2 -z-1 aspect-square w-[min(900px,130vw)] -translate-x-1/2 bg-radial-[closest-side] from-qf-soft to-transparent" />

      <div className="wrap grid justify-items-center text-center">
        <CesBanner />
        <h1 className="rv m-0 font-display text-wordmark leading-display font-extrabold tracking-heading-sm">QAC<span className="text-qf-ink"> FLOW</span></h1>
        {/* the letters of the name spelled out, ruled on both sides; one line on the narrowest phones too */}
        <p className="rv mono m-0 mt-3 flex items-center gap-3.5 text-fg-2 before:h-px before:w-8.5 before:bg-line-2 after:h-px after:w-8.5 after:bg-line-2 max-sm:tracking-wide max-sm:before:hidden max-sm:after:hidden">{m.expand}</p>
        <H2 className="rv mt-6">{m.title}</H2>
        <Lead className="rv mx-auto mt-5 max-w-160">{lines(m.lead)}</Lead>
        <div className="rv mt-8 flex flex-wrap justify-center gap-3">
          <Pill href="#contact" aria-haspopup="dialog" onClick={openInquiry('hero')}>{duringCes() ? m.cta.cesDemo : m.cta.demo}</Pill>
          {DEMO_VIDEO
            ? <Pill quiet href="#qf-how" aria-haspopup="dialog" onClick={e => { e.preventDefault(); openVideo(true); }}>{t.media.watch(DEMO_VIDEO.seconds)}</Pill>
            : <Pill quiet href="#qf-how">{m.cta.how}<ArrowRight aria-hidden="true" className="size-4" /></Pill>}
          {!DEMO_VIDEO && MARK_PENDING && <span aria-hidden="true" className="inline-flex min-h-11 items-center rounded-full border border-dashed border-qf-line px-5.5 py-2.5 text-body-sm text-mute">{t.media.watch(90)} · 영상 자리</span>}
        </div>

        {/* The three phones side by side, whole and apart: the film in the middle, large and face on; the OCR
            result and the patrol approval smaller on either side, turned toward it. Each with its name under it. */}
        <ul className="rv m-0 mt-14 flex w-full list-none items-center justify-center gap-[clamp(10px,3.5vw,56px)] p-0 max-sm:mt-10">
          <li className="grid w-[min(250px,23vw)] justify-items-center gap-4">
            <Phone src={capture('ocr-input.webp')} alt={m.alt.ocr} sizes={SIDE_SIZES} view="right" className="w-full" />
            <Caption icon={<ScanText className="size-4" />} className="max-sm:hidden">{m.problem.afterSteps[1]}</Caption>
          </li>
          <li className="grid w-[min(340px,40vw)] justify-items-center gap-4">
            <Phone src={capture('capture.webp')} alt={m.alt.capture} sizes={FRONT_SIZES} priority dark loop={HERO_LOOP ?? undefined}
              overlay={HERO_LOOP ? undefined : <HeroSequence />} className="w-full" />
            <Caption strong icon={<Camera className="size-4" />}>{m.how.steps.map(x => x.title).join(' → ')}</Caption>
          </li>
          <li className="grid w-[min(250px,23vw)] justify-items-center gap-4">
            <Phone src={capture('mobile-compare.webp')} alt={m.alt.compare} sizes={SIDE_SIZES} view="left" className="w-full" />
            <Caption icon={<FileCheck2 className="size-4" />} className="max-sm:hidden">{m.problem.afterSteps[3]}</Caption>
          </li>
        </ul>

        {/* the two claims, under the phones */}
        <ul className="rv m-0 mt-12 grid w-full max-w-200 list-none grid-cols-2 gap-3 p-0 text-left max-2xs:grid-cols-1">
          <li><Claim icon={<CircleCheck className="size-5" strokeWidth={2} />} title={m.stats[0]} sub={m.kit} /></li>
          <li><Claim figure="2026.06" title={m.stats[1]} sub={m.statsNote} /></li>
        </ul>
      </div>
    </section>
  );
}

/** a card with one claim: an icon or a big figure, the claim, a line under it */
function Claim({ icon, figure, title, sub }: { icon?: ReactNode; figure?: string; title: string; sub: string }) {
  return (
    <div className="grid h-full content-start gap-2 rounded-card border border-line bg-card/85 p-4.5 text-left shadow-device backdrop-blur-md">
      {figure
        ? <b className="num font-display text-stat leading-display font-extrabold text-fg">{figure}</b>
        : <span className="grid size-9 place-items-center rounded-full bg-qf text-on-acc">{icon}</span>}
      <b className="text-title-xs leading-snug font-semibold text-fg">{title}</b>
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
        {/* on one line beside them on a desktop, under them below that */}
        <span className="text-fg-2 max-lg:basis-full lg:border-l lg:border-qf-line lg:pl-3">{c.try}</span>
      </span>
    </p>
  );
}
