import { BadgeCheck, Factory } from 'lucide-react';
import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Head, Pending } from '../parts';

/** field proof: in use in our own plant since 2026. 06, and the company's certifications. The request doc
 * (p.14) adds six photos (shooting, the floor monitor, the extrusion and machining lines) and the
 * operating figures; planning sends them once they are settled, and they take the places marked in dev. */
export function Proof() {
  const p = useT().qf.proof;
  return (
    <Band id="qf-proof">
      <Head kicker={p.kicker} q={p.q} title={p.title} lead={p.lead} />
      <div data-batch className="grid gap-4 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
        <article className="rv grid content-start gap-3 rounded-card border border-qf-line bg-linear-160 from-qf-soft to-transparent to-70% p-panel-pad">
          <Factory aria-hidden="true" className="size-7 text-qf-ink" strokeWidth={1.6} />
          <b className="num font-display text-[clamp(3rem,7vw,5rem)] leading-none font-extrabold text-qf-ink">{p.since.figure}</b>
          <span className="text-title leading-snug font-bold">{p.since.label}</span>
          <span className="text-body-sm leading-copy text-fg-2">{p.since.body}</span>
        </article>
        <article className="rv grid content-start gap-4 rounded-card border border-line bg-card/60 p-panel-pad">
          <span className="mono text-micro text-mute">{p.certsLabel}</span>
          <ul className="m-0 grid list-none gap-3 p-0">
            {p.certs.map(c => (
              <li key={c.name} className="flex flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-line pt-3 first:border-t-0 first:pt-0">
                <BadgeCheck aria-hidden="true" className="size-6 flex-none text-qf-ink" strokeWidth={1.6} />
                <b className="min-w-30 text-title-xs font-semibold">{c.name}</b>
                <span className="text-body-sm text-fg-2">{c.body}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
      <Pending label="운영 실적 수치 자리 (기획 확정 후)" className="mt-4" />
      <div className="mt-4 grid grid-cols-2 gap-4 empty:hidden md:grid-cols-3">
        {['촬영 장면', '촬영 장면', '현장 모니터', '현장 모니터', '압출 라인', '가공 라인'].map((x, i) => <Pending key={i} label={`현장 사진 자리 · ${x}`} className="aspect-4/3" />)}
      </div>
    </Band>
  );
}
