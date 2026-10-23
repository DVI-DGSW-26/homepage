// The header: a full-width bar over the hero that draws in to a floating pill once the hero is behind
// (the change itself is .nav-morph in animation.css); on a page without the hero it is a pill from the
// start. The menu links to the pages, the current one lit.
// Below 1200px (tablets, phones, a spanned dual-screen device) the menu moves into a sheet behind a button.
import { useEffect, useRef } from 'react';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import type { Page } from '../lib/router';
import { setLang, useLang, useT, type Lang } from '../i18n';
import { holdPosition } from '../lib/scroll';
import { setTheme, useTheme } from '../lib/theme';
import { LG, pad2 } from '../lib/env';
import { ArrowIcon, btn, cn } from './ui';
import { Img } from './Img';

const LINKS = ['/qac-flow', '/data'] as const satisfies readonly Page[];
const LANGS: Lang[] = ['ko', 'en'];

const ROUND_BTN = 'relative grid size-9 flex-none cursor-pointer place-items-center rounded-full border border-line text-fg-2 transition-colors duration-300 hover:border-line-2 hover:text-fg max-sm:size-8';

export function Nav({ page }: { page: Page }) {
  const ref = useRef<HTMLElement>(null), sheet = useRef<HTMLDialogElement>(null);
  const lang = useLang(), theme = useTheme(), t = useT(), m = t.nav;
  // turned to a desktop width with the sheet open (a tablet rotated, a window widened): the bar has the menu again
  useEffect(() => {
    const lg = matchMedia(LG), close = () => { if (lg.matches) sheet.current?.close(); };
    lg.addEventListener('change', close);
    return () => lg.removeEventListener('change', close);
  }, []);
  const closeSheet = () => sheet.current?.close();
  useGSAP(() => {
    const nav = ref.current!, hero = document.getElementById('hero');
    nav.toggleAttribute('data-pill', !hero);
    // a pill from the moment the hero's bottom edge reaches the bar
    if (hero) ScrollTrigger.create({ trigger: hero, start: 'bottom top+=88', end: 'max', onToggle: s => nav.toggleAttribute('data-pill', s.isActive) });
  }, { dependencies: [page], revertOnUpdate: true });
  return (
    <>
    <header ref={ref} id="nav" className="group/nav fixed inset-x-0 top-0 z-100 booting:opacity-0">
      <div className={cn(
        // bar: edge to edge, the content inset to the page's wrap column
        'nav-morph relative mx-auto flex w-full items-center justify-between gap-6 border border-transparent border-b-line bg-nav pad-wrap py-3.5 max-sm:gap-3',
        // pill: the wrap column's width, floating 16px down
        'group-data-pill/nav:mt-4 group-data-pill/nav:w-wrap group-data-pill/nav:rounded-pill group-data-pill/nav:border-line group-data-pill/nav:py-2.5 group-data-pill/nav:pr-3 group-data-pill/nav:pl-5 max-sm:group-data-pill/nav:pl-3.5 max-sm:group-data-pill/nav:pr-2'
      )}>
        <a className="relative block aspect-800/216 w-logo flex-none max-sm:w-24 max-2xs:w-22" href="/qac-flow" aria-label={m.home}>
          <Img className="absolute inset-0 size-full object-contain transition-opacity duration-500 light:opacity-0" src="assets/img/logo-white.png" sizes="136px" priority={theme === 'dark'} alt={t.brand} />
          <Img className="absolute inset-0 size-full object-contain opacity-0 transition-opacity duration-500 light:opacity-100" src="assets/img/logo.png" sizes="136px" priority={theme === 'light'} alt="" />
        </a>
        {/* below 1200px the menu is in the sheet (the button at the end of the bar) */}
        <nav aria-label={m.menu} className="max-lg:hidden">
          <ul className="mono m-0 flex list-none gap-nav-gap p-0 max-xl:gap-nav-gap-tight">
            {LINKS.map(to => (
              <li key={to}>
                <a href={to} aria-current={page === to ? 'page' : undefined} data-active={page === to || undefined} className={cn(
                  'relative py-1.5 text-fg-2 transition-colors duration-300 hover:text-fg data-active:text-fg',
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-fg after:transition-transform after:duration-500 after:ease-out",
                  'hover:after:origin-left hover:after:scale-x-100 data-active:after:origin-left data-active:after:scale-x-100'
                )}>{m.links[to]}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3.5 max-sm:gap-2">
          <span className="mono flex gap-0.5 text-mute max-sm:text-micro">
            {LANGS.map((l, i) => (
              <span key={l} className="contents">
                {i > 0 && <i aria-hidden="true" className="mx-0.5 not-italic opacity-50">/</i>}
                <button type="button" aria-pressed={l === lang} onClick={() => { if (l === lang) return; holdPosition(); setLang(l); }}
                  className={cn('-my-2 cursor-pointer px-1 py-2 transition-colors duration-300 max-2xs:px-0.5', l === lang ? 'font-medium text-fg' : 'hover:text-fg-2')}>{m.langs[l]}</button>
              </span>
            ))}
          </span>
          <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? m.theme.toLight : m.theme.toDark} className={ROUND_BTN}>
            <SunIcon className="col-start-1 row-start-1 transition-[opacity,rotate] duration-500 ease-out light:-rotate-90 light:opacity-0" />
            <MoonIcon className="col-start-1 row-start-1 rotate-90 opacity-0 transition-[opacity,rotate] duration-500 ease-out light:rotate-0 light:opacity-100" />
          </button>
          {/* on a phone the logo, the toggles and the pill don't fit one line: the pill keeps only its arrow (the label is
              still read out), and on a cover screen it goes (contact is at the foot of the sheet) */}
          <a className={cn(btn({ size: 'sm' }), 'max-sm:size-8 max-sm:justify-center max-sm:p-0 max-2xs:hidden')} href="#contact"><span className="max-sm:sr-only">{m.contact}</span><ArrowIcon /></a>
          <button type="button" onClick={() => sheet.current?.showModal()} aria-label={m.open} aria-haspopup="dialog" className={cn(ROUND_BTN, 'lg:hidden')}>
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
    {/* The sheet: the whole screen, the links large and numbered. A modal <dialog>, so focus stays inside, Esc
        closes it and the page holds still behind it; a link closes it and opens its page. */}
    <dialog ref={sheet} aria-label={m.menu} className="menu-sheet m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-bg p-0 text-fg backdrop:bg-transparent">
      <div className="wrap flex min-h-full flex-col pt-4 pb-8">
        <div className="flex items-center justify-between py-2.5">
          <span className="mono text-mute">{m.menu}</span>
          <button type="button" onClick={closeSheet} aria-label={m.close} className={ROUND_BTN}><CloseIcon /></button>
        </div>
        <nav aria-label={m.menu} className="mt-6 spanned:max-w-[calc(50%-var(--spacing-hinge-gap)/2)]">
          <ul className="m-0 grid list-none border-t border-line p-0">
            {LINKS.map((to, i) => (
              <li key={to}>
                <a href={to} onClick={closeSheet} aria-current={page === to ? 'page' : undefined} data-active={page === to || undefined}
                  className="group/link flex items-baseline gap-4 border-b border-line py-4 text-menu leading-tight font-semibold tracking-heading text-fg-2 transition-colors duration-300 hover:text-fg data-active:text-fg max-sm:py-3.5">
                  <span className="mono w-8 flex-none text-mute group-data-active/link:text-acc-ink">{pad2(i + 1)}</span>{m.links[to]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#contact" onClick={closeSheet} className={cn(btn({ acc: true }), 'mt-auto self-start')}><span>{m.contact}</span><ArrowIcon /></a>
      </div>
    </dialog>
    </>
  );
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="M2.5 5.5h11M2.5 10.5h11" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" />
    </svg>
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
