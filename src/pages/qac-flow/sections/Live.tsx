import { useState, type KeyboardEvent } from 'react';
import { useT } from '../../../i18n';
import { Monitor } from '../../../components/Device';
import { Band, cn } from '../../../components/ui';
import { QacMonitor, SCREENS } from '../../../features/qac-monitor/QacMonitor';
import { Head } from '../parts';

const N = SCREENS.length;

/** the floor monitor, worked by hand: tabs above it, and its own toolbar switches screens too */
export function Live() {
  const l = useT().qf.live;
  const [tab, setTab] = useState(0);
  // the tablist's keys, as the ARIA pattern has them: arrows wrap around, Home and End jump
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = e.key === 'ArrowRight' ? (tab + 1) % N : e.key === 'ArrowLeft' ? (tab + N - 1) % N : e.key === 'Home' ? 0 : e.key === 'End' ? N - 1 : -1;
    if (next < 0) return;
    e.preventDefault(); setTab(next);
    document.getElementById(`qf-tab-${next}`)?.focus();
  };
  return (
    <Band id="qf-live" mark="04">
      <Head kicker={l.kicker} q={l.q} title={l.title} lead={l.lead} />
      <div role="tablist" aria-label={l.tabsAria} className="mono mb-4.5 flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
        {l.tabs.map((label, i) => (
          <button key={label} id={`qf-tab-${i}`} type="button" role="tab" aria-selected={tab === i} aria-controls={`qf-panel-${i}`} tabIndex={tab === i ? 0 : -1}
            onClick={() => setTab(i)} onKeyDown={onKey}
            className={cn('flex-none cursor-pointer rounded-full border px-4 py-2.5 text-label transition-colors duration-300',
              tab === i ? 'border-qf bg-qf text-on-acc' : 'border-line text-fg-2 hover:border-line-2 hover:text-fg')}>{label}</button>
        ))}
      </div>
      <Monitor className="rv mx-auto mb-8 max-w-300">
        <div role="tabpanel" id={`qf-panel-${tab}`} aria-labelledby={`qf-tab-${tab}`} className="size-full">
          <QacMonitor screen={SCREENS[tab]} onScreen={s => setTab(SCREENS.indexOf(s))} />
        </div>
      </Monitor>
      <p className="mono m-0 text-micro text-mute">{l.note}</p>
    </Band>
  );
}
