import { useRef, type CSSProperties } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useT, type Messages } from '../i18n';
import { TEST_EQUIPMENT } from '../data';
import { IndexHead, Photo, SEC, SecHead, Section, cn } from './ui';

type Eq = Messages['equip'];
// unit counts; n = bar length, proportional to the number of units. Names and specs: equip.machining.rows
const MACHINING: { id: keyof Eq['machining']['rows']; q: number; n: number }[] = [
  { id: 'center', q: 3, n: .15 }, { id: 'tapping', q: 20, n: 1 }, { id: 'lathe', q: 4, n: .2 }, { id: 'bending', q: 1, n: .05 }, { id: 'cutting', q: 12, n: .6 }
];
const PRESSES = [{ ton: '1,450', inch: 6, n: .414 }, { ton: '3,500', inch: 10, n: 1 }];
// photo files under assets/img/facility/; captions and alt text: equip.facs
const FACS: [keyof Eq['facs'], string][] = [
  ['machiningHall', 'fac-01'], ['extrusionLine', 'fac-02'], ['heatTreatment', 'fac-03'], ['pipeLine', 'fac-04'],
  ['cmm', 'test-01'], ['utm', 'test-02'], ['video', 'test-03'], ['hardness', 'test-04']
];
const GROUP_H3 = 'm-0 mb-3 flex items-baseline gap-3.5 font-display text-figure font-extrabold tracking-button uppercase';
const GROUP_SUB = 'font-sans text-body-sm font-medium tracking-normal text-mute normal-case';

function ERow({ name, spec, q, n, acc = false }: { name: string; spec: string; q: number; n: number; acc?: boolean }) {
  const units = useT().equip.units;
  return (
    <div style={{ '--n': n } as CSSProperties} className="relative grid grid-cols-[1.3fr_1.1fr_auto] items-center gap-4 border-t border-line py-4 last:border-b max-xs:grid-cols-[1fr_auto] max-xs:gap-y-1">
      <span className="font-semibold">{name}</span>
      <span className="font-mono text-label tracking-spec text-mute max-xs:col-start-1 max-xs:row-start-2">{spec}</span>
      <span className="num flex min-w-[3.2ch] items-baseline justify-end gap-1 text-right font-display text-figure leading-none font-extrabold max-xs:col-start-2 max-xs:row-span-2 max-xs:row-start-1">{q}<small className="font-sans text-mono font-medium text-mute">{units(q)}</small></span>
      <i data-erow-bar className={cn('absolute -bottom-px left-0 h-px w-[calc(var(--n)*100%)] origin-left [transform:scaleX(0)]', acc ? 'bg-acc' : 'bg-fg')} />
    </div>
  );
}

export function Equipment() {
  const m = useT().equip;
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const st = { trigger: root.current, start: 'top 70%', once: true };
    gsap.to('[data-erow-bar]', { scaleX: 1, duration: 1.4, ease: 'power4.out', stagger: .08, scrollTrigger: st });
    gsap.to('[data-press-bar]', { scaleX: 1, duration: 1.6, ease: 'power4.out', stagger: .15, delay: .2, scrollTrigger: st });
  }, { scope: root });

  return (
    <Section ref={root} id="equip" className={SEC}>
      <div className="wrap">
        <SecHead eyebrow={m.eyebrow} title={m.title} lead={m.lead} />
        <div className="grid grid-cols-[1.4fr_1fr] items-start gap-col-gap max-lg:grid-cols-1">
          <div className="rv">
            <h3 className={GROUP_H3}>{m.machining.title} <span className={GROUP_SUB}>{m.machining.sub}</span></h3>
            {MACHINING.map(r => <ERow key={r.id} {...m.machining.rows[r.id]} q={r.q} n={r.n} />)}
          </div>
          <div className="rv">
            <h3 className={GROUP_H3}>{m.extrusion.title} <span className={GROUP_SUB}>{m.extrusion.sub}</span></h3>
            <div className="grid grid-cols-[auto_1fr] gap-4.5 rounded-card border border-line bg-card p-7 *:col-span-full max-xs:p-5">
              <span className="mono text-mute">{m.extrusion.capacity}</span>
              {PRESSES.map(p => (
                <div key={p.ton} style={{ '--n': p.n } as CSSProperties} className="grid grid-cols-subgrid items-end gap-x-5">
                  <b className="num flex items-baseline gap-1.5 font-display text-kpi leading-figure font-extrabold">{p.ton}<small className="text-unit-sm text-fg-2">t</small></b>
                  <div>
                    <div className="mono mb-2 flex flex-wrap justify-between gap-x-3 text-mute"><span className="whitespace-nowrap">{m.extrusion.billet(p.inch)}</span><span className="whitespace-nowrap">{m.extrusion.oneUnit}</span></div>
                    <div className="mb-2 h-2.5 overflow-hidden rounded-xs bg-line"><i data-press-bar className="block h-full w-[calc(var(--n)*100%)] origin-left bg-linear-to-r/srgb from-fg-2 to-fg [transform:scaleX(0)]" /></div>
                  </div>
                </div>
              ))}
              <ERow acc {...m.extrusion.aging} q={2} n={.1} />
            </div>
          </div>
        </div>

        <div className="rv mt-stack-sm">
          <IndexHead title={m.test.title} aside={m.test.aside} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-140 border-collapse text-body-sm">
              <thead><tr>{m.test.cols.map((h, i) => <th key={h} className={cn('border-b border-line-2 py-2.5 pr-3 pl-0 text-left font-mono text-tag font-medium tracking-label text-mute uppercase', i === 3 && 'text-right')}>{h}</th>)}</tr></thead>
              <tbody>
                {TEST_EQUIPMENT.map((e, i) => (
                  <tr key={i} className="*:border-b *:border-line *:py-3.5 *:pr-3 *:align-top">
                    <td className="font-semibold">{e.name}</td><td className="text-fg-2">{e.brand || '—'}</td><td className="text-fg-2">{e.spec}</td>
                    <td className="num text-right font-display text-figure-xs leading-none font-extrabold">{e.q}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div data-batch className="mt-stack-sm grid grid-cols-4 gap-3 max-lg:grid-cols-2">
          {FACS.map(([id, file]) => (
            <Photo key={id} data-wipe src={`assets/img/facility/${file}.jpg`} sizes="(max-width: 900px) 50vw, 25vw" alt={m.facs[id].alt} className="group rv aspect-4/3" imgClassName="transition-transform duration-1000 ease-out group-hover:scale-105">
              <span className="absolute bottom-2.5 left-3 font-mono text-micro tracking-widest text-on-photo uppercase text-shadow-photo">{m.facs[id].cap}</span>
            </Photo>
          ))}
        </div>
      </div>
    </Section>
  );
}
