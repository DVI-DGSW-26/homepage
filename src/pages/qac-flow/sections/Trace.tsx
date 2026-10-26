import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Browser, Head, PhonePair } from '../parts';

/** traceability: the photo behind every value, the two inspections compared, the approval */
export function Trace() {
  const m = useT().qf, t = m.trace;
  return (
    <Band id="qf-trace" alt mark="05">
      <Head kicker={t.kicker} q={t.q} title={t.title} lead={t.lead} />
      <div className="grid items-center gap-stack-sm md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <PhonePair className="rv max-w-105" back={{ src: 'mobile-compare.webp', alt: m.alt.compare }} front={{ src: 'mobile-photo-compare.webp', alt: m.alt.photos }} />
        <div className="grid gap-block-gap">
          <ul data-batch className="m-0 grid list-none gap-4.5 p-0">
            {t.points.map(x => (
              // a tick drawn with two borders of a rotated box
              <li key={x.title} className="rv relative grid gap-1.5 border-t border-line pt-4 pl-7.5 before:absolute before:top-4.75 before:left-1 before:h-2.75 before:w-1.5 before:rotate-45 before:border-r-[1.5px] before:border-b-[1.5px] before:border-qf-ink">
                <b className="font-semibold">{x.title}</b>
                <span className="text-body-sm leading-copy text-fg-2">{x.body}</span>
              </li>
            ))}
          </ul>
          <Browser className="rv" src="web-approval.jpg" alt={m.alt.approval} sizes="(max-width: 1000px) 100vw, 860px" />
        </div>
      </div>
    </Band>
  );
}
