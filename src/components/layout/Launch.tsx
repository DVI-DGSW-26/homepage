import { useT } from '../../i18n';
import { Kicker } from '../ui';

/** the foot of every page: just the Q.A.C-Flow launch date */
export function Launch() {
  const m = useT().qf;
  return (
    <footer id="launch" className="relative isolate overflow-hidden border-t border-line bg-bg-2 py-section">
      <div aria-hidden="true" className="absolute inset-0 -z-1 deco-dots mask-l-from-0%" />
      <div className="wrap flex flex-wrap items-end justify-between gap-6">
        <div className="grid gap-3">
          <Kicker className="text-mute">{m.launch}</Kicker>
          <time dateTime="2026-06-01" className="num font-display text-stat leading-display font-extrabold text-qf-ink">2026.06.01</time>
        </div>
        <p aria-hidden="true" className="m-0 font-display text-wordmark leading-display font-extrabold select-none hollow-qf-line max-sm:hidden">Q.A.C-Flow</p>
      </div>
    </footer>
  );
}
