import { useState, type KeyboardEvent } from 'react';
import { useT } from '../../../i18n';
import { Monitor } from '../../../components/Device';
import { Img } from '../../../components/Img';
import { Zoomable } from '../../../components/Zoom';
import { Band, Pill } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { Head, useCapture } from '../parts';

/** the floor monitor's screens, captured from the app (CES final, Korean and English), in the app's own order */
const SCREENS = ['monitor-board.webp', 'monitor-detail.webp', 'monitor-defects.webp'];
const N = SCREENS.length;

/** the floor monitor: tabs above it switch its screen, and a click opens the screen full size */
export function Live() {
  const { live: l, cta } = useT().qf;
  const capture = useCapture();
  const [tab, setTab] = useState(0);
  // the tablist's keys, as the ARIA pattern has them: arrows wrap around, Home and End jump
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = e.key === 'ArrowRight' ? (tab + 1) % N : e.key === 'ArrowLeft' ? (tab + N - 1) % N : e.key === 'Home' ? 0 : e.key === 'End' ? N - 1 : -1;
    if (next < 0) return;
    e.preventDefault(); setTab(next);
    document.getElementById(`qf-tab-${next}`)?.focus();
  };
  const src = capture(SCREENS[tab]), alt = l.alts[tab];
  return (
    <Band id="qf-live">
      <Head kicker={l.kicker} q={l.q} title={l.title} lead={l.lead} />
      <div role="tablist" aria-label={l.tabsAria} className="mono mb-4.5 flex gap-1.5 overflow-x-auto [scrollbar-width:none] max-sm:flex-wrap">
        {l.tabs.map((label, i) => (
          <button key={label} id={`qf-tab-${i}`} type="button" role="tab" aria-selected={tab === i} aria-controls="qf-panel" tabIndex={tab === i ? 0 : -1}
            onClick={() => setTab(i)} onKeyDown={onKey}
            className={cn('flex-none cursor-pointer rounded-full border px-4 py-2.5 text-label transition-colors duration-300',
              tab === i ? 'border-qf bg-qf text-on-acc' : 'border-line text-fg-2 hover:border-line-2 hover:text-fg')}>{label}</button>
        ))}
      </div>
      <div role="tabpanel" id="qf-panel" aria-labelledby={`qf-tab-${tab}`} className="rv mb-8">
        {/* what the screen is for, above it */}
        <div className="mb-6 grid max-w-200 gap-2">
          <h3 className="m-0 text-title font-bold">{l.tabs[tab]}</h3>
          <p className="m-0 text-body text-fg-2">{l.bodies[tab]}</p>
        </div>
        <Monitor>
          <Zoomable src={src} alt={alt} className="h-full">
            <Img key={src} src={src} alt={alt} sizes="(max-width: 1440px) 100vw, 1376px" className="app-screen block size-full object-cover object-top" />
          </Zoomable>
        </Monitor>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <p className="mono m-0 text-micro text-mute">{l.note}</p>
        {/* goes down to the demo request form at the end of the page (smoothAnchors glides there) */}
        <Pill quiet href="#contact" className="flex-none">{cta.apply}</Pill>
      </div>
    </Band>
  );
}
