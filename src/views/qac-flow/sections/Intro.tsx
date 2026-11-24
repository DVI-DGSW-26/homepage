import { useT } from '../../../i18n';
import { Monitor, Phone } from '../../../components/Device';
import { Img } from '../../../components/Img';
import { Pill } from '../../../components/ui';
import { openInquiry } from '../../../lib/inquiry';
import { DEMO_VIDEO, HERO_LOOP, openVideo } from '../../../lib/media';
import { useCapture } from '../parts';
import { HeroSequence } from './HeroSequence';

/**
 * The first screen, as a product's home page opens: on the left the product's mark, what it is in one
 * sentence, the way to an inquiry and to the features; on the right the web app as it is used: the floor
 * monitor and, in front of it, the phone that feeds it, playing photo → crop → OCR (HeroSequence, or the
 * hero loop once there is one). The CES notice is the bar above the header (CesBar), not part of this screen.
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

        {/* the web app as it is used: the floor monitor's status board, and in front of it, lower left, the phone
            that feeds it, playing photo → crop → OCR (the hero loop once there is one) */}
        <div className="rv relative pb-[6%] pl-[14%] max-lg:mx-auto max-lg:w-full max-lg:max-w-170 max-sm:pl-[18%]">
          <Monitor>
            <Img src={capture('monitor-board.webp')} alt={m.live.alts[0]} sizes="(max-width: 1023px) 86vw, 640px" priority className="app-screen block size-full object-cover object-top" />
          </Monitor>
          <div className="absolute bottom-0 left-0 z-10 w-[29%] drop-shadow-[0_24px_40px_rgb(0_0_0/.28)] max-sm:w-[32%]">
            <Phone src={capture('capture.webp')} alt={m.alt.capture} sizes="(max-width: 1023px) 30vw, 190px" priority dark loop={HERO_LOOP ?? undefined}
              overlay={HERO_LOOP ? undefined : <HeroSequence />} className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

