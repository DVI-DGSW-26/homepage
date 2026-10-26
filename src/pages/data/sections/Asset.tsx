import { useT } from '../../../i18n';
import { ICON } from '../../../components/icons';
import { Band, LineIcon } from '../../../components/ui';
import { Head } from '../parts';

/** defect prediction, process tuning, data credits, closing the gap */
const WORTH = [ICON.bolt, ICON.sliders, ICON.coin, ICON.people];

/** 05 what the data is worth */
export function Asset() {
  const a = useT().future.asset;
  return (
    <Band id="future-asset" mark="05">
      <Head kicker={a.kicker} title={a.title} />
      <ul data-batch className="m-0 grid list-none grid-cols-4 gap-4.5 p-0 max-lg:grid-cols-2 max-sm:grid-cols-1 spanned:gap-x-hinge">
        {a.items.map((x, i) => (
          <li key={x.title} className="rv grid content-start gap-3 rounded-card border border-line bg-card p-panel-pad">
            <LineIcon d={WORTH[i]} className="size-11 rounded-card bg-qf-soft p-2.5 text-qf-ink" />
            <h3 className="m-0 mt-2 text-title-xs leading-tight font-semibold">{x.title}</h3>
            <p className="m-0 text-body-sm leading-copy text-fg-2">{x.body}</p>
          </li>
        ))}
      </ul>
    </Band>
  );
}
