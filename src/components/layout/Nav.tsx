// The header: a pill floating over the top of the page, the width of the content column. The menu
// links to the pages in the language being read, the current one lit; KOR / ENG link to the same page
// in the other language (/data ↔ /en/data), so search engines find both.
// Below 1200px (tablets, phones, a spanned dual-screen device) the menu moves into a sheet behind a button.
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { House } from 'lucide-react';
import { LANGS, pathOf, type Page } from '../../lib/paths';
import { SITES } from '../../lib/site';
import { useLang, useT } from '../../i18n';
import { noteLangPosition } from '../../lib/scroll';
import { setTheme, useTheme } from '../../lib/theme';
import { LG, pad2 } from '../../lib/env';
import { cn } from '../../lib/cn';
import { afterDialogEntry, useBackToClose } from '../../lib/history';
import { Img } from '../Img';

const LINKS = ['/qac-flow', '/data'] as const satisfies readonly Page[];

const ROUND_BTN = 'relative grid size-9 flex-none cursor-pointer place-items-center rounded-full border border-line text-fg-2 transition-colors duration-300 hover:border-line-2 hover:text-fg max-sm:size-8';

export function Nav({ page }: { page: Page }) {
  const sheet = useRef<HTMLDialogElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const lang = useLang(), theme = useTheme(), t = useT(), m = t.nav, router = useRouter();
  // turned to a desktop width with the sheet open (a tablet rotated, a window widened): the bar has the menu again
  useEffect(() => {
    const lg = matchMedia(LG), close = () => { if (lg.matches) sheet.current?.close(); };
    lg.addEventListener('change', close);
    return () => lg.removeEventListener('change', close);
  }, []);
  const closeSheet = () => sheet.current?.close();
  useBackToClose(sheetOpen, closeSheet);
  // a page link in the sheet: the sheet closes (taking its history entry back off), then the page opens
  const openFromSheet = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href')!;
    afterDialogEntry(() => router.push(href));
    closeSheet();
  };
  return (
    <>
    <header id="nav" className="fixed inset-x-0 top-0 z-100 booting:opacity-0">
      <div className="relative mx-auto mt-4 flex w-wrap items-center justify-between gap-6 rounded-full border border-line bg-nav py-2.5 pr-3 pl-5 max-sm:gap-3 max-sm:pr-2 max-sm:pl-3.5">
        <Link className="relative block aspect-800/216 w-logo flex-none max-sm:w-24 max-2xs:w-22" href={pathOf('/qac-flow', lang)} aria-label={m.home}>
          <Img className="absolute inset-0 size-full object-contain transition-opacity duration-500 light:opacity-0" src="assets/img/logo-white.png" sizes="136px" priority={theme === 'dark'} alt={t.brand} />
          <Img className="absolute inset-0 size-full object-contain opacity-0 transition-opacity duration-500 light:opacity-100" src="assets/img/logo.png" sizes="136px" priority={theme === 'light'} alt="" />
        </Link>
        {/* below 1200px the menu is in the sheet (the button at the end of the bar) */}
        <nav aria-label={m.menu} className="max-lg:hidden">
          <ul className="mono m-0 flex list-none gap-nav-gap p-0 max-xl:gap-nav-gap-tight">
            {LINKS.map(to => (
              <li key={to}>
                <Link href={pathOf(to, lang)} aria-current={page === to ? 'page' : undefined} data-active={page === to || undefined} className={cn(
                  'relative py-1.5 text-fg-2 transition-colors duration-300 hover:text-fg data-active:text-fg',
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-fg after:transition-transform after:duration-500 after:ease-out",
                  'hover:after:origin-left hover:after:scale-x-100 data-active:after:origin-left data-active:after:scale-x-100'
                )}>{m.links[to]}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3.5 max-sm:gap-2">
          {/* DVISION's other sites: the start page (dvi-ind.com), and manufacturing | solutions, this one lit; in the sheet below 1200px */}
          <nav aria-label={m.sites.label} className="mono flex items-center gap-2.5 border-r border-line pr-3.5 text-mute max-lg:hidden">
            <a href={SITES.gateway(lang)} aria-label={m.sites.gateway} title={m.sites.gateway} className="-m-1 p-1 transition-colors duration-300 hover:text-fg"><House className="size-4" strokeWidth={1.6} aria-hidden="true" /></a>
            <a href={SITES.manufacturing(lang)} className="transition-colors duration-300 hover:text-fg">{m.sites.manufacturing}</a>
            <i aria-hidden="true" className="not-italic opacity-50">|</i>
            <span aria-current="page" className="font-medium text-fg">{m.sites.solution}</span>
          </nav>
          <span className="mono flex gap-0.5 text-mute max-sm:text-micro">
            {LANGS.map((l, i) => (
              <span key={l} className="contents">
                {i > 0 && <i aria-hidden="true" className="mx-0.5 not-italic opacity-50">/</i>}
                {l === lang
                  ? <span aria-current="true" lang={l} className="-my-2 px-1 py-2 font-medium text-fg max-2xs:px-0.5">{m.langs[l]}</span>
                  : <a href={pathOf(page, l)} hrefLang={l} lang={l} onClick={() => noteLangPosition(page)}
                    className="-my-2 px-1 py-2 transition-colors duration-300 hover:text-fg-2 max-2xs:px-0.5">{m.langs[l]}</a>}
              </span>
            ))}
          </span>
          <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? m.theme.toLight : m.theme.toDark} className={ROUND_BTN}>
            <SunIcon className="col-start-1 row-start-1 transition-[opacity,rotate] duration-500 ease-out light:-rotate-90 light:opacity-0" />
            <MoonIcon className="col-start-1 row-start-1 rotate-90 opacity-0 transition-[opacity,rotate] duration-500 ease-out light:rotate-0 light:opacity-100" />
          </button>
          <button type="button" onClick={() => { sheet.current?.showModal(); setSheetOpen(true); }} aria-label={m.open} aria-haspopup="dialog" className={cn(ROUND_BTN, 'lg:hidden')}>
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
    {/* The sheet: the whole screen, the links large and numbered. A modal <dialog>, so focus stays inside, Esc
        and the back button close it and the page holds still behind it; a link closes it and opens its page. */}
    <dialog ref={sheet} aria-label={m.menu} onClose={() => setSheetOpen(false)} className="menu-sheet m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-bg p-0 text-fg backdrop:bg-transparent">
      <div className="wrap flex min-h-full flex-col pt-4 pb-8">
        <div className="flex items-center justify-between py-2.5">
          <span className="mono text-mute">{m.menu}</span>
          <button type="button" onClick={closeSheet} aria-label={m.close} className={ROUND_BTN}><CloseIcon /></button>
        </div>
        <nav aria-label={m.menu} className="mt-6 spanned:max-w-[calc(50%-var(--spacing-hinge-gap)/2)]">
          <ul className="m-0 grid list-none border-t border-line p-0">
            {LINKS.map((to, i) => (
              <li key={to}>
                <a href={pathOf(to, lang)} onClick={openFromSheet} aria-current={page === to ? 'page' : undefined} data-active={page === to || undefined}
                  className="group/link flex items-baseline gap-4 border-b border-line py-4 text-menu leading-tight font-semibold tracking-heading text-fg-2 transition-colors duration-300 hover:text-fg data-active:text-fg max-sm:py-3.5">
                  <span className="mono w-8 flex-none text-mute group-data-active/link:text-acc-ink">{pad2(i + 1)}</span>{m.links[to]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={m.sites.label} className="mt-auto pt-10">
          <span className="mono text-mute">{m.sites.label}</span>
          <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
            {[{ href: SITES.gateway(lang), label: m.sites.gateway }, { href: SITES.manufacturing(lang), label: m.sites.manufacturing }].map(s => (
              <li key={s.label}><a href={s.href} className="inline-flex min-h-11 items-center rounded-full border border-line px-4.5 text-body-sm text-fg-2 transition-colors duration-300 hover:border-line-2 hover:text-fg">{s.label}</a></li>
            ))}
            <li><span aria-current="page" className="inline-flex min-h-11 items-center rounded-full border border-qf-line bg-qf-soft px-4.5 text-body-sm font-semibold text-qf-ink">{m.sites.solution}</span></li>
          </ul>
        </nav>
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
