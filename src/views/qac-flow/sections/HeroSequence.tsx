// The first screen's phone while there is no screen recording yet (HERO_LOOP in src/lib/media.ts): the
// app's own captures played in turn as a 10 s loop — the camera framing the gauge (a shutter flash), the
// crop to its reading, then the value filled in by OCR and passed — with the part that matters lit at
// each step. The keyframes are .hero-* in src/styles/animation.css; without motion nothing here is drawn
// and the still capture underneath shows. Decorative: the capture under it carries the description.
import { Img } from '../../../components/Img';
import { useLang } from '../../../i18n';
import { useCapture } from '../parts';

/** where on each 865 × 1672 capture the lit part sits, in % of its width and height */
const GUIDE = { left: '12%', top: '13.4%', width: '76%', height: '39.3%' };  // the camera's guide box
/** the photo on the crop screen, in % of the screen; the English screen's header is a line taller */
const PHOTO = {
  ko: { left: '10.17%', top: '28.83%', width: '79.77%', height: '54.43%' },
  en: { left: '10.17%', top: '26.79%', width: '79.77%', height: '54.31%' }
};
// the last screen sits in a box 1.3 times its height (so it can scroll up without showing what is under
// it): its marks are in % of that box
const FIELD = { left: '8.4%', top: '62.3%', width: '83.2%', height: '4.3%' };   // the OCR-filled value
const PASS = { left: '78.8%', top: '59.9%', width: '12.8%', height: '1.6%' };   // the pass badge

const SIZES = '(max-width: 599px) 62vw, 340px';

export function HeroSequence() {
  const capture = useCapture(), lang = useLang();
  const layer = 'absolute inset-0 block size-full';
  return (
    <div aria-hidden="true" className="hero-sequence pointer-events-none absolute inset-0 overflow-hidden">
      <Img src={capture('capture.webp')} alt="" sizes={SIZES} priority className={`hero-a ${layer}`} />
      <Img src={capture('crop.webp')} alt="" sizes={SIZES} loading="eager" className={`hero-b ${layer} bg-plate`} />
      {/* step 1: the guide box lights up, then the shutter */}
      <i className="hero-guide absolute rounded-[3%] border-2 border-qf shadow-[0_0_0_9999px_rgb(0_0_0/.18)]" style={GUIDE} />
      <i className="hero-flash absolute inset-0 bg-white" />
      {/* step 2: the app's crop frame dragged in until only the reading is left; outside it the photo is
          shaded and softened (which also hides the frame the capture itself shows). The insets animate
          (--crop-*, animation.css) */}
      <div className="hero-crop @container absolute" style={PHOTO[lang]}>
        <i className="absolute inset-x-0 top-0 h-(--crop-t) bg-black/60 backdrop-blur-[6px]" />
        <i className="absolute inset-x-0 bottom-0 h-(--crop-b) bg-black/60 backdrop-blur-[6px]" />
        <i className="absolute top-(--crop-t) bottom-(--crop-b) left-0 w-(--crop-l) bg-black/60 backdrop-blur-[6px]" />
        <i className="absolute top-(--crop-t) right-0 bottom-(--crop-b) w-(--crop-r) bg-black/60 backdrop-blur-[6px]" />
        <span className="absolute inset-[var(--crop-t)_var(--crop-r)_var(--crop-b)_var(--crop-l)] border-[1.5px] border-dashed border-white">
          {['top-0 left-0', 'top-0 left-full', 'top-full left-0', 'top-full left-full'].map(at => (
            <i key={at} className={`absolute size-[6cqw] -translate-1/2 border-[1.5px] border-white ${at}`} />
          ))}
        </span>
      </div>
      {/* step 3: the screen scrolls up to the value OCR filled in, which lights up, and its pass (the value
          sits low on the screen, where the first screen's bottom edge cuts the phone off) */}
      <div className="hero-c absolute inset-x-0 top-0 h-[130%] bg-plate">
        <Img src={capture('ocr-input.webp')} alt="" sizes={SIZES} loading="eager" className="absolute inset-x-0 top-0 block h-auto w-full" />
        <i className="hero-field absolute rounded-[6px] border-2 border-qf shadow-[0_0_0_6px_rgb(60_203_154/.25)]" style={FIELD} />
        <i className="hero-pass absolute rounded-full border-2 border-qf shadow-[0_0_14px_rgb(60_203_154/.7)]" style={PASS} />
      </div>
    </div>
  );
}
