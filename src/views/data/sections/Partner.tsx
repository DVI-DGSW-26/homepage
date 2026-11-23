import { lines, useT } from '../../../i18n';
import { Band, H2, Kicker, Pill } from '../../../components/ui';
import { openInquiry } from '../../../lib/inquiry';
import { RichLines } from '../parts';

/** 06 the partnership, and the page's one line, over a soft green light */
export function Partner() {
  const p = useT().future.partner;
  return (
    <Band id="future-partner" alt className="bg-radial-[45%_70%] from-qf-soft to-transparent to-70%">
      <div className="grid justify-items-center text-center">
        <Kicker center className="rv mb-5.5">{p.kicker}</Kicker>
        <H2 className="rv max-w-240"><RichLines src={p.closing} /></H2>
        <p className="rv m-0 mt-8 text-title-xs font-semibold text-fg-2">{lines(p.title)}</p>
        <ul className="rv m-0 mt-4 flex list-none flex-wrap justify-center gap-2.5 p-0">
          {/* each one opens the demo request / contact form at the foot of the page */}
          {p.tags.map(x => <li key={x}><Pill quiet href="#contact" aria-haspopup="dialog" onClick={openInquiry('partner')}>{x}</Pill></li>)}
        </ul>
      </div>
    </Band>
  );
}
