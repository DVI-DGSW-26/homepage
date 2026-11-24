import { useT } from '../../../i18n';
import { pad2 } from '../../../lib/env';
import { Phone } from '../../../components/Device';
import { Band, Pill } from '../../../components/ui';
import { DEMO_VIDEO, openVideo } from '../../../lib/media';
import { Head, StepText, useCapture } from '../parts';

/** snap, crop, OCR: the three screens in step, each over its column of the steps below, then the demo film */
export function How() {
  const t = useT(), m = t.qf, h = m.how;
  const capture = useCapture();
  const screens = [{ src: 'capture.webp', alt: m.alt.capture, dark: true }, { src: 'crop.webp', alt: m.alt.crop }, { src: 'ocr-input.webp', alt: m.alt.ocr }];
  return (
    <Band id="qf-how">
      <Head kicker={h.kicker} q={h.q} title={h.title} lead={h.lead} />
      <div data-batch className="mx-auto grid max-w-300 grid-cols-3 gap-phone-gap">
        {screens.map(s => (
          <Phone key={s.src} {...s} src={capture(s.src)} sizes="(max-width: 1200px) 32vw, 390px" className="rv mx-auto w-full max-w-97.5" />
        ))}
      </div>
      <ol data-batch className="m-0 mx-auto mt-10 grid max-w-300 list-none gap-5.5 p-0 sm:grid-cols-3 sm:gap-col-gap">
        {h.steps.map((s, i) => (
          <li key={s.title} className="rv grid grid-cols-[auto_1fr] gap-x-4 border-t border-line pt-4.5">
            <b className="row-span-2 pt-0.75 font-mono text-mono-sm text-qf-ink">{pad2(i + 1)}</b>
            <StepText title={s.title} body={s.body} />
          </li>
        ))}
      </ol>
      {DEMO_VIDEO && (
        <div className="rv mx-auto mt-10 max-w-300">
          <Pill quiet href="#qf-how" aria-haspopup="dialog" onClick={e => { e.preventDefault(); openVideo(true); }}>{t.media.watch(DEMO_VIDEO.seconds)}</Pill>
        </div>
      )}
    </Band>
  );
}
