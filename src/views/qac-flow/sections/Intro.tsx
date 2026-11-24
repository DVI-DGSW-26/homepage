import type { ReactNode } from 'react';
import { Camera, FileCheck2, ScanText } from 'lucide-react';
import { useT } from '../../../i18n';
import { Phone } from '../../../components/Device';
import { Img } from '../../../components/Img';
import { Pill } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { openInquiry } from '../../../lib/inquiry';
import { DEMO_VIDEO, HERO_LOOP, openVideo } from '../../../lib/media';
import { useCapture } from '../parts';
import { HeroSequence } from './HeroSequence';

/** each phone drawn at most this wide: the middle one, the two beside it */
const FRONT_SIZES = '(max-width: 1199px) 38vw, 300px';
const SIDE_SIZES = '(max-width: 1199px) 23vw, 180px';

/**
 * The first screen, as a product's home page opens: on the left the product's mark, what it is in one
 * sentence, the way to an inquiry and to the features; on the right the app itself in three phones — the camera in the middle playing
 * the hero loop (or until there is one the captures in turn, HeroSequence), the OCR result and the patrol
 * approval beside it. The CES notice is the bar above the header (CesBar), not part of this screen.
 */
export function Intro() {
  const t = useT(), m = t.qf, capture = useCapture();
  return (
    <section id="qf-intro" className="relative isolate overflow-hidden pt-44 pb-20 max-sm:pt-36 max-sm:pb-14">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <div className="grid justify-items-start max-lg:justify-items-center max-lg:text-center">
          {/* the product's mark, its wordmark in light ink on the dark theme */}
          <p className="rv relative m-0 w-[clamp(10rem,15vw,13rem)]">
            <Img className="block h-auto w-full transition-opacity duration-500 light:opacity-0" src="assets/img/qacflow-logo-white.png" sizes="208px" priority alt="QAC FLOW" />
            <Img className="absolute inset-0 size-full opacity-0 transition-opacity duration-500 light:opacity-100" src="assets/img/qacflow-logo.png" sizes="208px" priority alt="" />
          </p>
          <h1 className="rv m-0 mt-7 text-[clamp(2.3rem,4.2vw,3.7rem)] leading-[1.15] font-bold tracking-tight text-balance">{m.title}</h1>
          <p className="rv m-0 mt-5 max-w-136 text-title leading-relaxed text-fg-2 text-pretty">{m.lead}</p>
          <div className="rv mt-8 flex flex-wrap gap-3 max-lg:justify-center">
            <Pill href="#contact" aria-haspopup="dialog" onClick={openInquiry('hero')}>{m.cta.demo}</Pill>
            <Pill quiet href="#qf-features">{m.cta.features}</Pill>
            {DEMO_VIDEO && <Pill quiet href="#qf-preview" aria-haspopup="dialog" onClick={e => { e.preventDefault(); openVideo(true); }}>{t.media.watch(DEMO_VIDEO.seconds)}</Pill>}
          </div>
        </div>

        {/* the app in three phones, face on: the camera in the middle, the largest; the OCR result and the
            patrol approval smaller and lower on either side, each with its name under it */}
        <ul className="rv m-0 flex w-full list-none items-start justify-center gap-[4%] p-0">
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
            <Phone src={capture('mobile-photo-compare.webp')} alt={m.alt.compare} sizes={SIDE_SIZES} className="w-full" />
            <Caption icon={<FileCheck2 className="size-4" />} className="max-sm:hidden">{m.trace.points[0].title}</Caption>
          </li>
        </ul>
      </div>
    </section>
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
