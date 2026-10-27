// The floor app's phone version, for the live-monitoring block on a phone (src/pages/qac-flow/sections/Live.tsx):
// the same three screens laid out for an upright iPhone, an iOS large title above and a tab bar below
// in place of the Mac toolbar. Drawn at the display's 440 × 894 pt below its status bar and zoomed to
// fit, so its sizes are points; type runs a step larger than the monitor's, as iOS text does.
import { useState } from 'react';
import { ClipboardList, LayoutGrid, TriangleAlert, type LucideIcon } from 'lucide-react';
import { useLang, useT } from '../../i18n';
import { cn } from '../../lib/cn';
import { QUEUE } from './data';
import { Fit } from './Fit';
import { COUNTS, NAV, type MonitorScreen } from './QacMonitor';
import { PhoneBoard } from './phone/Board';
import { PhoneDetail } from './phone/Detail';
import { PhoneDefects } from './phone/Defects';

const TAB_ICON: Record<MonitorScreen, LucideIcon> = { board: LayoutGrid, detail: ClipboardList, defects: TriangleAlert };

/** `screen` is the one showing, and `onScreen` asks for another */
export function QacPhone({ screen, onScreen }: { screen: MonitorScreen; onScreen: (s: MonitorScreen) => void }) {
  const lang = useLang(), c = useT().monitor;
  const [picked, setPicked] = useState(0);
  return (
    <Fit form="phone">
      <div lang={lang} className="flex size-full flex-col font-mac tracking-mac text-m-fg">
        <header className="flex-none px-5 pt-1 pb-3">
          <span className="flex items-center gap-2 text-m-label text-m-fg2">
            {c.app} · {c.date}
            <span className="ml-auto flex items-center gap-1.5 font-medium text-m-ok"><i className="size-1.5 rounded-full bg-current shadow-m-halo" />{c.live}</span>
          </span>
          <h3 className="m-0 mt-0.5 text-m-figure leading-tight font-bold tracking-heading">{c.titles[screen]}</h3>
        </header>
        <div key={screen} className="m-in min-h-0 flex-1 px-4">
          {screen === 'board' && <PhoneBoard onOpen={line => { setPicked(QUEUE.indexOf(line)); onScreen('detail'); }} />}
          {screen === 'detail' && <PhoneDetail picked={picked} onPick={setPicked} />}
          {screen === 'defects' && <PhoneDefects />}
        </div>
        {/* the tab bar, its foot left clear for the home indicator */}
        <nav className="mt-3 grid flex-none grid-cols-3 border-t border-m-line bg-m-bar px-2 pt-2 pb-9">
          {NAV.map(s => { const Icon = TAB_ICON[s]; return (
            <button key={s} type="button" aria-current={screen === s ? 'page' : undefined} onClick={() => onScreen(s)}
              className={cn('relative grid cursor-pointer justify-items-center gap-1 text-m-caption font-medium text-m-mute transition-colors duration-200', screen === s && 'text-m-brand')}>
              <Icon className="size-6" strokeWidth={1.75} />
              {c.titles[s]}
              {COUNTS[s] != null && <span className={cn('absolute -top-1 left-1/2 ml-2.5 min-w-5 rounded-full px-1.5 text-m-caption leading-5 font-semibold text-white tabular-nums', s === 'defects' ? 'bg-m-ng-fill' : 'bg-m-fg2 text-m-bg')}>{COUNTS[s]}</span>}
            </button>
          ); })}
        </nav>
      </div>
    </Fit>
  );
}
