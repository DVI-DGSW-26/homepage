import { rich, useT } from '../../../i18n';
import { ICON } from '../../../components/icons';
import { Band, LineIcon } from '../../../components/ui';
import { Head, em } from '../parts';

/** measurements, photos, context, verdicts, actions, approvals: in the order of the copy */
const KINDS = [ICON.ruler, ICON.camera, ICON.layers, ICON.checkCircle, ICON.history, ICON.signed];

/** 02 why us: the six kinds of data Q.A.C-Flow gathers, and a link back to it */
export function WhyUs() {
  const w = useT().future.why;
  return (
    <Band id="future-why" alt mark="02">
      <Head kicker={w.kicker} title={w.title}>
        <a href="/qac-flow" className="rv mt-5 inline-flex items-center gap-2 text-body text-qf-ink transition-colors duration-300 hover:text-fg">
          {w.from}<LineIcon d={ICON.arrow} className="size-4" />
        </a>
      </Head>
      <ul data-batch className="m-0 grid list-none grid-cols-3 gap-4.5 p-0 max-lg:grid-cols-2 max-sm:grid-cols-1 spanned:gap-x-hinge">
        {w.items.map((d, i) => (
          <li key={d.title} className="rv grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-0.5 rounded-card border border-line bg-card p-5.5">
            <LineIcon d={KINDS[i]} className="row-span-2 size-11 rounded-full border border-qf-line p-2.5 text-qf-ink" />
            <b className="text-title-xs leading-tight font-semibold">{d.title}</b>
            <span className="text-small text-mute">{d.sub}</span>
          </li>
        ))}
      </ul>
      <p className="rv m-0 mt-8 flex items-center gap-3 text-body-lg font-medium">
        <LineIcon d={ICON.checkCircle} className="size-6 flex-none text-qf-ink" />
        <span>{rich(w.note, { k: em })}</span>
      </p>
    </Band>
  );
}
