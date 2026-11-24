import { useT } from '../../../i18n';
import { Monitor, Phone } from '../../../components/Device';
import { Img } from '../../../components/Img';
import { Pill } from '../../../components/ui';
import { openInquiry } from '../../../lib/inquiry';
import { DEMO_VIDEO, HERO_LOOP, openVideo } from '../../../lib/media';
import { useCapture } from '../parts';
import { HeroSequence } from './HeroSequence';
import { LiveMonitor } from './LiveMonitor';

/**
 * The first screen, as a product's home page opens: the product's mark, what it is in one sentence and the
 * way to an inquiry and to the features, centred; under them, large, the web app as it is used: the floor
 * monitor taking results live (LiveMonitor) and in front of it the phone that sends them, playing photo →
 * crop → OCR (HeroSequence, or the hero loop once there is one), the two in step. The CES notice is the bar
 * above the header (CesBar), not part of this screen.
 */
export function Intro() {
  const t = useT(), m = t.qf, capture = useCapture();
  return (
    <section id="qf-intro" className="relative isolate overflow-hidden pt-40 pb-20 max-sm:pt-34 max-sm:pb-14">
      <div className="wrap">
        {/* the words, centred */}
        <div className="mx-auto grid max-w-200 justify-items-center text-center">
          {/* the product's mark, its wordmark in light ink on the dark theme */}
          <p className="rv relative m-0 w-[clamp(9rem,13vw,11.5rem)]">
            <Img className="block h-auto w-full transition-opacity duration-500 light:opacity-0" src="assets/img/qacflow-logo-white.png" sizes="184px" priority alt="QAC FLOW" />
            <Img className="absolute inset-0 size-full opacity-0 transition-opacity duration-500 light:opacity-100" src="assets/img/qacflow-logo.png" sizes="184px" priority alt="" />
          </p>
          <h1 className="rv m-0 mt-6 text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.12] font-bold tracking-tight text-balance">{m.title}</h1>
          <p className="rv m-0 mt-5 max-w-160 text-title leading-relaxed text-fg-2 text-pretty">{m.lead}</p>
          <div className="rv mt-8 flex flex-wrap justify-center gap-3">
            <Pill href="#contact" aria-haspopup="dialog" onClick={openInquiry('hero')}>{m.cta.demo}</Pill>
            <Pill quiet href="#qf-features">{m.cta.features}</Pill>
            {DEMO_VIDEO && <Pill quiet href="#qf-preview" aria-haspopup="dialog" onClick={e => { e.preventDefault(); openVideo(true); }}>{t.media.watch(DEMO_VIDEO.seconds)}</Pill>}
          </div>
        </div>

        {/* the web app as it is used, large under the words: the floor monitor taking results live
            (LiveMonitor), and in front of it, lower left, the phone that sends them, playing photo → crop → OCR */}
        <div className="rv relative mx-auto mt-16 max-w-280 pb-[5%] pl-[15%] max-sm:mt-12 max-sm:pl-[20%]">
          <div aria-hidden="true" className="absolute inset-x-[10%] top-[8%] -z-1 h-3/4 rounded-full bg-radial/srgb from-acc-glow to-transparent to-70% opacity-60 blur-3xl" />
          <Monitor><LiveMonitor alt={m.live.alts[0]} /></Monitor>
          <div className="absolute bottom-0 left-0 z-10 w-[25%] drop-shadow-[0_24px_40px_rgb(0_0_0/.28)] max-sm:w-[30%]">
            <Phone src={capture('capture.webp')} alt={m.alt.capture} sizes="(max-width: 1023px) 30vw, 280px" priority dark loop={HERO_LOOP ?? undefined}
              overlay={HERO_LOOP ? undefined : <HeroSequence />} className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

