import { FileCheck2, Images, ListChecks, MonitorDot, ScanText, TrendingUp } from 'lucide-react';
import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Head } from '../parts';

/** each feature's icon and the section that tells it in full, in the order of the copy's items */
const ITEMS = [
  { icon: ScanText, to: '#qf-how' },
  { icon: ListChecks, to: '#qf-workflow' },
  { icon: MonitorDot, to: '#qf-live' },
  { icon: Images, to: '#qf-trace' },
  { icon: TrendingUp, to: '#qf-spc' },
  { icon: FileCheck2, to: '#qf-report' }
];

/** the features at a glance, right under the first screen: six, each a link down to its own section */
export function Features() {
  const f = useT().qf.features;
  return (
    <Band id="qf-features">
      <Head kicker={f.title} title={f.lead} />
      <ul data-batch className="m-0 grid list-none gap-x-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {f.items.map((x, i) => {
          const { icon: Icon, to } = ITEMS[i];
          return (
            <li key={x.name} className="rv border-t border-line">
              <a href={to} className="group grid h-full content-start gap-2.5 py-7 transition-colors duration-300">
                <span className="grid size-10 place-items-center rounded-[10px] bg-qf-soft text-qf-ink"><Icon aria-hidden="true" className="size-5" strokeWidth={1.8} /></span>
                <h3 className="m-0 mt-2 text-title-xs font-semibold transition-colors duration-300 group-hover:text-qf-ink">{x.name}</h3>
                <p className="m-0 text-body-sm leading-copy text-fg-2">{x.body}</p>
                <span className="mt-1 text-body-sm font-semibold text-qf-ink underline decoration-qf-line underline-offset-4 transition-colors duration-300 group-hover:decoration-qf-ink">{f.more}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </Band>
  );
}
