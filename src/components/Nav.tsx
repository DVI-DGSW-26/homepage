// The header: a full-width bar over the hero that draws in to a floating pill once the hero is behind
// (the change itself is .nav-morph in animation.css). Lights the menu item of the section in view.
import { useRef, useState } from 'react';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { setLang, useLang, useT, type Lang } from '../i18n';
import { holdPosition } from '../lib/scroll';
import { setTheme, useTheme } from '../lib/theme';
import { ArrowIcon, btn, cn } from './ui';
import { Img } from './Img';

const LINKS = ['about', 'rnd', 'product', 'config', 'events', 'community'] as const;
// which menu item lights up while each section is under the 45% line
const LINK_FOR: Record<string, string> = { about: 'about', statement: 'about', product: 'product', config: 'config', process: 'config', equip: 'config', rnd: 'rnd', global: 'about', history: 'about', events: 'events', community: 'community', contact: 'community' };
const LANGS: Lang[] = ['ko', 'en'];

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string>();
  const lang = useLang(), theme = useTheme(), t = useT(), m = t.nav;
  useGSAP(() => {
    const nav = ref.current!;
    // a pill from the moment the hero's bottom edge reaches the bar
    ScrollTrigger.create({ trigger: '#hero', start: 'bottom top+=88', end: 'max', onToggle: s => nav.toggleAttribute('data-pill', s.isActive) });
    // back on the hero nothing is lit
    ScrollTrigger.create({ trigger: '#hero', start: 'top 45%', end: 'bottom 45%', onToggle: s => { if (s.isActive) setActive(undefined); } });
    Object.entries(LINK_FOR).forEach(([id, to]) => {
      const el = document.getElementById(id); if (!el) return;
      ScrollTrigger.create({ trigger: el, start: 'top 45%', end: 'bottom 45%', onToggle: s => { if (s.isActive) setActive(to); } });
    });
  });
  return (
    <header ref={ref} id="nav" className="group/nav fixed inset-x-0 top-0 z-100 booting:opacity-0">
      <div className={cn(
        // bar: edge to edge, the content inset to the page's wrap column
        'nav-morph relative mx-auto flex w-full items-center justify-between gap-6 border border-transparent border-b-line bg-nav pad-wrap py-3.5 max-xs:gap-3',
        // pill: the wrap column's width, floating 16px down
        'group-data-pill/nav:mt-4 group-data-pill/nav:w-wrap group-data-pill/nav:rounded-pill group-data-pill/nav:border-line group-data-pill/nav:py-2.5 group-data-pill/nav:pr-3 group-data-pill/nav:pl-5 max-xs:group-data-pill/nav:pl-3.5 max-xs:group-data-pill/nav:pr-2'
      )}>
        <a className="relative block aspect-800/216 w-logo flex-none max-xs:w-24 max-2xs:w-22" href="#top" aria-label={m.home}>
          <Img className="absolute inset-0 size-full object-contain transition-opacity duration-500 light:opacity-0" src="assets/img/logo-white.png" sizes="136px" priority={theme === 'dark'} alt={t.brand} />
          <Img className="absolute inset-0 size-full object-contain opacity-0 transition-opacity duration-500 light:opacity-100" src="assets/img/logo.png" sizes="136px" priority={theme === 'light'} alt="" />
        </a>
        {/* no menu up to 900px: the sections follow one another, and the pill keeps contact in reach */}
        <nav aria-label={m.menu} className="max-lg:hidden">
          <ul className="mono m-0 flex list-none gap-nav-gap p-0 max-3xl:gap-nav-gap-tight">
            {LINKS.map(id => (
              <li key={id}>
                <a href={'#' + id} data-active={active === id || undefined} className={cn(
                  'relative py-1.5 text-fg-2 transition-colors duration-300 hover:text-fg data-active:text-fg',
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-fg after:transition-transform after:duration-500 after:ease-out",
                  'hover:after:origin-left hover:after:scale-x-100 data-active:after:origin-left data-active:after:scale-x-100'
                )}>{m.links[id]}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3.5 max-xs:gap-2">
          <span className="mono flex gap-0.5 text-mute max-xs:text-micro">
            {LANGS.map((l, i) => (
              <span key={l} className="contents">
                {i > 0 && <i aria-hidden="true" className="mx-0.5 not-italic opacity-50">/</i>}
                <button type="button" aria-pressed={l === lang} onClick={() => { if (l === lang) return; holdPosition(); setLang(l); }}
                  className={cn('-my-2 cursor-pointer px-1 py-2 transition-colors duration-300 max-2xs:px-0.5', l === lang ? 'font-medium text-fg' : 'hover:text-fg-2')}>{m.langs[l]}</button>
              </span>
            ))}
          </span>
          <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? m.theme.toLight : m.theme.toDark}
            className="relative grid size-9 flex-none cursor-pointer place-items-center rounded-full border border-line text-fg-2 transition-colors duration-300 hover:border-line-2 hover:text-fg max-xs:size-8">
            <SunIcon className="col-start-1 row-start-1 transition-[opacity,rotate] duration-500 ease-out light:-rotate-90 light:opacity-0" />
            <MoonIcon className="col-start-1 row-start-1 rotate-90 opacity-0 transition-[opacity,rotate] duration-500 ease-out light:rotate-0 light:opacity-100" />
          </button>
          {/* on a phone the logo, the toggle and the pill don't fit one line: the pill keeps only its arrow (the label is still read out) */}
          <a className={cn(btn({ size: 'sm' }), 'max-xs:size-8 max-xs:justify-center max-xs:p-0')} href="#contact"><span className="max-xs:sr-only">{m.contact}</span><ArrowIcon /></a>
        </div>
      </div>
    </header>
  );
}

// the button shows the mode a click switches to: a sun in dark mode, a moon in light mode
function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
    </svg>
  );
}
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.6 9.9A6 6 0 0 1 6.1 2.4a6 6 0 1 0 7.5 7.5Z" />
    </svg>
  );
}
