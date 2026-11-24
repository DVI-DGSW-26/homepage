import { Check } from 'lucide-react';
import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Head } from '../parts';

/** 서비스 소개: the old way beside QAC FLOW, one row per part of an inspection record (the reading, its
 * photo, the report), the QAC FLOW column on a faint mint ground. On a phone each row stacks, each side
 * named in front of its text since the column heads are gone. */
export function About() {
  const a = useT().qf.about;
  const cell = 'px-6 py-7 align-baseline max-sm:px-0 max-sm:py-0';
  const tag = 'mr-2 inline-block w-20 flex-none pt-0.5 text-caption font-semibold whitespace-nowrap sm:hidden';
  return (
    <Band id="qf-about">
      <Head kicker={a.title} title={a.lead} />
      <table className="rv w-full border-collapse text-left">
        <thead className="max-sm:hidden">
          <tr>
            <td className="w-[20%]" />
            <th scope="col" className="px-6 pt-6 pb-4 text-body-sm font-semibold text-mute">{a.before}</th>
            <th scope="col" className="rounded-t-[20px] bg-qf/8 px-6 pt-6 pb-4 text-body-sm font-bold text-qf-ink">{a.after}</th>
          </tr>
        </thead>
        <tbody>
          {a.rows.map((r, i) => (
            <tr key={r.label} className="border-t border-line max-sm:grid max-sm:gap-2.5 max-sm:py-6 max-sm:last:border-b">
              <th scope="row" className={`${cell} pl-0 text-body-sm font-semibold text-fg-2`}>{r.label}</th>
              <td className={`${cell} text-title-xs text-mute max-sm:flex max-sm:px-3.5 max-sm:text-body`}>
                <span className={`${tag} text-mute`}>{a.before}</span>{r.before}
              </td>
              <td className={`${cell} bg-qf/8 text-title-xs font-semibold max-sm:flex max-sm:rounded-[12px] max-sm:px-3.5 max-sm:py-3 max-sm:text-body ${i === a.rows.length - 1 ? 'rounded-b-[20px]' : ''}`}>
                <span className={`${tag} text-qf-ink`}>{a.after}</span>
                <Check aria-hidden="true" className="mr-2.5 inline size-5 -translate-y-px align-middle text-qf-ink max-sm:hidden" strokeWidth={2.4} />
                {r.after}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="rv m-0 mt-10 max-w-180 text-body leading-relaxed text-fg-2 max-sm:mt-8">{a.note}</p>
    </Band>
  );
}
