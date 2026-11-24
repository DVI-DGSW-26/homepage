import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Head } from '../parts';

/** 서비스 소개: what QAC FLOW is, in three short statements side by side (why it was made, what it
 * covers, who uses it), each under a hairline */
export function About() {
  const a = useT().qf.about;
  return (
    <Band id="qf-about">
      <Head kicker={a.title} title={a.lead} />
      <dl data-batch className="m-0 grid gap-x-12 gap-y-10 md:grid-cols-3">
        {a.items.map(x => (
          <div key={x.label} className="rv grid content-start gap-3 border-t-2 border-qf pt-6">
            <dt className="text-title-xs font-semibold">{x.label}</dt>
            <dd className="m-0 text-body leading-relaxed text-fg-2">{x.body}</dd>
          </div>
        ))}
      </dl>
    </Band>
  );
}
