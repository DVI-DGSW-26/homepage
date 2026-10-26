// The Q.A.C-Flow floor monitor, rebuilt in React for the live-monitoring block (src/pages/qac-flow/sections/Live.tsx):
// the three screens of the in-house app as one app the visitor can work, switched from its own
// toolbar as on the floor.
//
//   status board      every line's self- and patrol-inspection slots; a line opens its inspection
//   inspection detail the in-progress inspections, each value against its tolerance band
//   quality · defects today's defects (filtered by type) and the actions taken on them
//
// It sits in the Studio Display (<Monitor>, Device.tsx), so it is drawn as a Mac app would be: the
// system colours and type, a toolbar with a segmented control, tinted capsules over solid blocks, in
// the dark appearance on the dark page and the light one on the light page (the .qac-monitor mode
// set and the m-* tokens, src/styles/tokens.css). The layout is the real app's; the data is a sample (data.ts).
import { useState } from 'react';
import { setLang, useLang, useT } from '../../i18n';
import { useInterval } from '../../lib/useInterval';
import { cn } from '../../lib/cn';
import { DEFECTS, LINES, QUEUE } from './data';
import { Fit, type Form } from './Fit';
import { Glyph } from './Glyph';
import { Clock, TOOL, TOOL_ON } from './parts';
import { Board } from './screens/Board';
import { Detail } from './screens/Detail';
import { Defects } from './screens/Defects';

/** the screens, in the order of the page's tabs */
export const SCREENS = ['detail', 'board', 'defects'] as const;
export type MonitorScreen = (typeof SCREENS)[number];
/** the order of the app's own toolbar tabs (the phone's tab bar too) */
export const NAV: readonly MonitorScreen[] = ['board', 'detail', 'defects'];
/** the count beside a toolbar tab */
export const COUNTS: Partial<Record<MonitorScreen, number>> = { detail: LINES.length, defects: DEFECTS.length };
const TOOLBAR_BTN = cn(TOOL, 'flex h-8 gap-1.5 px-2.5 text-m-xs font-medium');

/** `screen` is the one showing, and `onScreen` asks for another; `form` is the screen it is drawn for
 * (the floor's display, or an iPad on its side: the same layout, taller) */
export function QacMonitor({ screen, onScreen, form = 'monitor' }: { screen: MonitorScreen; onScreen: (s: MonitorScreen) => void; form?: Exclude<Form, 'phone'> }) {
  const lang = useLang(), c = useT().monitor;
  const [cycling, setCycling] = useState(false);
  const [picked, setPicked] = useState(0);
  // cycling, it moves on to the next toolbar screen every 8 s, as the floor monitor does on its own
  useInterval(cycling, () => onScreen(NAV[(NAV.indexOf(screen) + 1) % NAV.length]), 8000);
  return (
    <Fit form={form}>
      <div lang={lang} className="qac-monitor relative flex size-full flex-col bg-m-bg font-mac text-m-base tracking-mac text-m-fg">
        {/* the toolbar: the Mac's toolbar tone, solid, since nothing scrolls under it here (a
            backdrop blur would only put it on its own layer and soften its text) */}
        <header className="absolute inset-x-0 top-0 z-1 flex h-14 items-center gap-3 border-b border-m-line bg-m-bar px-5 whitespace-nowrap">
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-lg bg-linear-to-b from-m-icon-hi to-m-icon-lo text-white shadow-m-icon"><Glyph n="check" className="size-4.5" /></span>
          <span className="grid leading-tight">
            <b className="text-m-lg font-semibold tracking-heading-sm">{c.titles[screen]}</b>
            <span className="text-m-2xs text-m-fg2">{c.app} · {c.date}</span>
          </span>
          <nav className="relative ml-8 grid w-117.5 grid-cols-3 rounded-lg bg-m-idle p-0.5">
            <i aria-hidden="true" className="absolute inset-y-0.5 left-0.5 w-[calc((100%-4px)/3)] rounded-md bg-m-raise shadow-m-thumb transition-transform duration-300 ease-m-spring motion-reduce:transition-none"
              style={{ transform: `translateX(${NAV.indexOf(screen) * 100}%)` }} />
            {NAV.map(s => (
              <button key={s} type="button" aria-current={screen === s ? 'page' : undefined} onClick={() => onScreen(s)}
                className={cn('relative flex cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 text-m-xs font-medium text-m-fg2 transition-colors duration-200 hover:text-m-fg', screen === s && 'text-m-fg')}>
                {c.titles[s]}
                {COUNTS[s] != null && <span className={cn('rounded-full px-1.5 text-m-2xs leading-4 font-semibold tabular-nums', s === 'defects' ? 'bg-m-ng-fill text-white' : 'bg-m-fg/10')}>{COUNTS[s]}</span>}
              </button>
            ))}
          </nav>
          <span className="ml-auto flex items-center gap-1.5 text-m-xs font-medium text-m-ok"><i className="size-1.5 rounded-full bg-current shadow-m-halo" />{c.live}</span>
          <span className="text-m-2xs text-m-mute tabular-nums">{c.updated} 10:18:27</span>
          <span className="mx-1 h-5 w-px bg-m-line" />
          <button type="button" aria-pressed={cycling} title={cycling ? c.cycling : c.fixed} onClick={() => setCycling(v => !v)} className={cn(TOOLBAR_BTN, cycling && TOOL_ON)}>
            <Glyph n={cycling ? 'pause' : 'play'} className="size-3" />{cycling ? c.cycling : c.fixed}
          </button>
          <button type="button" onClick={() => setLang(lang === 'en' ? 'ko' : 'en')} className={TOOLBAR_BTN}><Glyph n="globe" className="size-3.5" />{c.otherLang}</button>
          <span className="ml-2"><Clock /></span>
        </header>
        {/* a div, not <main>: the page already has its own main landmark */}
        <div key={screen} className="m-in min-h-0 flex-1 px-4 pt-18 pb-4">
          {screen === 'board' && <Board onOpen={line => { setPicked(QUEUE.indexOf(line)); onScreen('detail'); }} />}
          {screen === 'detail' && <Detail picked={picked} onPick={setPicked} />}
          {screen === 'defects' && <Defects form={form} />}
        </div>
      </div>
    </Fit>
  );
}
