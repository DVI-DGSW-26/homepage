// The privacy policy (/privacy), linked from the form's notice and the footer. The text is in
// src/i18n/locales/privacy.*.ts.
import { useT } from '../../i18n';
import { Band, Kicker } from '../../components/ui';

export function PrivacyPage() {
  const p = useT().privacy;
  return (
    <Band id="privacy" className="pt-[calc(var(--spacing-section)+4rem)]">
      <article className="max-w-200">
        <Kicker>{p.effective}</Kicker>
        <h1 className="m-0 mt-3.5 text-h2 leading-h2 font-semibold tracking-tight">{p.title}</h1>
        <p className="m-0 mt-6 text-body leading-copy text-fg-2">{p.intro}</p>
        {p.sections.map(s => (
          <section key={s.title} className="mt-10 border-t border-line pt-6">
            <h2 className="m-0 text-title-xs font-semibold">{s.title}</h2>
            {s.body?.map((x, i) => <p key={i} className="m-0 mt-3 text-body-sm leading-copy text-fg-2">{x}</p>)}
            {s.list && (
              <ul className="m-0 mt-3 grid gap-1.5 pl-5 text-body-sm leading-copy text-fg-2">
                {s.list.map(x => <li key={x}>{x}</li>)}
              </ul>
            )}
            {s.rows && (
              <dl className="m-0 mt-4 grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-6 text-body-sm leading-copy max-sm:grid-cols-1">
                {s.rows.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="border-t border-line py-2.5 font-semibold text-fg max-sm:pb-0">{k}</dt>
                    <dd className="m-0 border-t border-line py-2.5 text-fg-2 max-sm:border-t-0 max-sm:pt-1">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}
      </article>
    </Band>
  );
}
