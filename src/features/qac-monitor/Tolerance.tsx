import { cn } from '../../components/ui';

/** where a value sits on the bar: the limits at 15% and 85%, clamped to the ends */
const place = (v: number, lo: number, hi: number) => Math.min(100, Math.max(0, 15 + 70 * (v - lo) / (hi - lo)));
const trim = (v: number) => +v.toFixed(3);

/** A value against its tolerance: red beyond the limits, green within, ticks at the limits and the
 * nominal, and a bar from the nominal out to the value, red when it is out. */
export function Tolerance({ value, lo, hi, nom = (lo + hi) / 2, labels, className }: { value?: number; lo: number; hi: number; nom?: number; labels?: boolean; className?: string }) {
  const at = (v: number) => place(v, lo, hi);
  const out = value != null && (value < lo || value > hi);
  const tone = out ? 'bg-m-ng' : 'bg-m-ok';
  return (
    <span className={cn('relative block', className)}>
      <span className="absolute inset-0 flex overflow-hidden rounded-full"><i className="w-[15%] bg-m-ng/22" /><i className="flex-1 bg-m-ok/22" /><i className="w-[15%] bg-m-ng/22" /></span>
      {[lo, nom, hi].map((v, i) => <span key={i} className={cn('absolute top-0 h-full w-px', i === 1 ? 'bg-m-fg/25' : 'bg-m-fg/45')} style={{ left: `${at(v)}%` }} />)}
      {value != null && (
        <span className={cn('absolute top-1/2 h-1/2 -translate-y-1/2 rounded-full', tone)}
          style={{ left: `${Math.min(at(nom), at(value))}%`, width: `${Math.max(Math.abs(at(value) - at(nom)), .6)}%` }}>
          <span className={cn('absolute top-1/2 h-[200%] w-0.75 -translate-y-1/2 rounded-full', tone, value < nom ? 'left-0' : 'right-0')} />
        </span>
      )}
      {labels && <>
        {[lo, hi].map(v => <span key={v} className="absolute top-full mt-1 -translate-x-1/2 text-m-2xs font-medium text-m-fg2 tabular-nums" style={{ left: `${at(v)}%` }}>{trim(v)}</span>)}
        {value != null && <span className={cn('absolute top-full mt-1 -translate-x-1/2 text-m-xs font-semibold tabular-nums', out ? 'text-m-ng' : 'text-m-ok')} style={{ left: `${out ? Math.min(at(value), 96) : at(value)}%` }}>{trim(value)}</span>}
      </>}
    </span>
  );
}
