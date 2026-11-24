import { Fragment } from 'react';
import { ChevronDown, Monitor, Plus, Server, Smartphone } from 'lucide-react';
import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Head } from '../parts';

const KIT = [Smartphone, Server, Monitor];

/** getting started: the whole kit, and the six questions asked
 * most (gauges, recognition, failures, other SPC tools, ERP/MES, deployment and price) */
export function Adopt() {
  const a = useT().qf.adopt;
  return (
    <Band id="qf-adopt">
      <Head kicker={a.kicker} q={a.q} title={a.title} />
      <div data-batch className="grid gap-4">
        {/* the kit: three things joined by plus signs */}
        <article className="rv grid content-center gap-5 rounded-card border border-line bg-card/60 p-panel-pad">
          <ul className="m-0 flex list-none items-start justify-center gap-3 p-0 max-sm:flex-col max-sm:items-center">
            {a.kit.map((k, i) => {
              const Icon = KIT[i];
              return (
                <Fragment key={k.title}>
                  {i > 0 && <li aria-hidden="true" className="grid h-16 place-items-center text-mute max-sm:h-auto"><Plus className="size-5" /></li>}
                  <li className="grid w-40 justify-items-center gap-2 text-center">
                    <span className="grid size-16 place-items-center rounded-full bg-qf-soft text-qf-ink"><Icon aria-hidden="true" className="size-7" strokeWidth={1.6} /></span>
                    <b className="text-title-xs font-semibold">{k.title}</b>
                    <span className="text-caption text-fg-2">{k.body}</span>
                  </li>
                </Fragment>
              );
            })}
          </ul>
          <p className="m-0 border-t border-line pt-4 text-center text-body-sm text-fg-2">{a.kitNote}</p>
        </article>
      </div>
      <h4 className="rv m-0 mt-12 mb-4 text-title-xs font-semibold">{a.faqTitle}</h4>
      <ul className="m-0 grid list-none border-t border-line p-0 md:grid-cols-2 md:gap-x-8">
        {a.faq.map(f => (
          <li key={f.q} className="rv border-b border-line">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-body font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}<ChevronDown aria-hidden="true" className="size-4 flex-none text-mute transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="m-0 pb-4 text-body-sm leading-copy text-fg-2">{f.a}</p>
            </details>
          </li>
        ))}
      </ul>
    </Band>
  );
}
