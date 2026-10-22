import { Fragment, useMemo, useRef, useState, type CSSProperties } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { REDUCED } from '../lib/env';
import { pick, useT } from '../i18n';
import { PRODUCTS, type ProductCategory } from '../data';
import { IndexHead, SEC, SecHead, Section, cn } from './ui';
import { Img } from './Img';

type CatId = ProductCategory['id'];

/** one row per distinct part name, with every photo of it */
const rowsOf = (cat: ProductCategory) => {
  const map = new Map<string, { name: string; sys: string; sysEn: string; imgs: string[] }>();
  cat.groups.forEach(g => g.parts.forEach(p => { if (!map.has(p.name)) map.set(p.name, { name: p.name, sys: g.ko, sysEn: g.en, imgs: [] }); map.get(p.name)!.imgs.push('assets/img/products/' + p.img); }));
  return [...map.values()];
};

/**
 * The part name rolls up and is replaced by a copy rising from below, one character at a time.
 * Each word is its own roll and the spaces between them are ordinary, so the name wraps like text.
 */
const ROLL_CHAR = 'inline-block transition-transform duration-550 ease-out delay-[calc(var(--i)*18ms)]';
const ROLL_OUT = ROLL_CHAR + ' group-hover/row:-translate-y-[105%]';
const ROLL_IN = ROLL_CHAR + ' translate-y-[105%] group-hover/row:translate-y-0';

function Roll({ text }: { text: string }) {
  let n = 0;   // the stagger runs on across the words
  return text.split(' ').map((word, w) => {
    const from = n; n += word.length + 1;
    const chars = (b: boolean) => (
      <span className="col-start-1 row-start-1 inline-block whitespace-nowrap">
        {[...word].map((c, i) => (
          <span key={i} style={{ '--i': from + i } as CSSProperties} className={b ? ROLL_IN : ROLL_OUT}>{c}</span>
        ))}
      </span>
    );
    return <Fragment key={w}>{w > 0 && ' '}<span className="inline-grid overflow-hidden align-top">{chars(false)}{chars(true)}</span></Fragment>;
  });
}

export function Product() {
  const m = useT().product;
  return (
    <Section id="product" className={SEC}>
      <div className="wrap">
        <SecHead eyebrow={m.eyebrow} title={m.title} lead={m.lead} />
        <Catalogue />
      </div>
    </Section>
  );
}

function Catalogue() {
  const m = useT().product;
  const root = useRef<HTMLDivElement>(null), gallery = useRef<HTMLDivElement>(null);
  const [catId, setCatId] = useState<CatId>('automotive');
  const cat = PRODUCTS.find(c => c.id === catId)!;
  const rows = useMemo(() => rowsOf(cat), [cat]);
  const photos = cat.groups.reduce((n, g) => n + g.parts.length, 0);

  // a new category deals its rows in and wipes its photos open; the first render just sits there
  const shown = useRef(catId);
  useGSAP(() => {
    if (shown.current === catId) return;
    shown.current = catId;
    if (!REDUCED) {
      gsap.from('[data-row]', { y: 24, opacity: 0, duration: .7, ease: 'power3.out', stagger: .05, clearProps: 'all' });
      gsap.from('[data-gallery] [data-ph]', { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power4.out', stagger: .04, clearProps: 'clipPath' });
    }
    ScrollTrigger.refresh();
  }, { scope: root, dependencies: [catId] });

  // hovering a row lights its photos in the gallery: a DOM attribute, so the catalogue doesn't re-render
  const mark = (name: string | null) => {
    const g = gallery.current; if (!g) return;
    g.querySelectorAll('figure[data-on]').forEach(f => f.removeAttribute('data-on'));
    if (name) g.querySelectorAll(`figure[data-name="${CSS.escape(name)}"]`).forEach(f => f.toggleAttribute('data-on', true));
  };
  const reveal = (name: string) => gallery.current?.querySelector(`figure[data-name="${CSS.escape(name)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

  return (
    <div ref={root}>
      <div data-batch className="grid grid-cols-4 gap-3.5 max-lg:grid-cols-2 max-xs:grid-cols-1">
        {PRODUCTS.map(c => (
          <button key={c.id} type="button" data-on={c.id === catId || undefined} onClick={() => setCatId(c.id)}
            className="group/cat rv relative isolate aspect-3/4 cursor-pointer overflow-hidden rounded-card border border-line bg-ink text-left text-on-photo max-lg:aspect-4/3 max-xs:aspect-video">
            <Img src={c.cover} sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 25vw" className="absolute inset-0 size-full object-cover opacity-85 [transition:scale_1.2s_var(--ease-out),opacity_.6s] group-hover/cat:scale-106 group-data-on/cat:scale-106" />
            <div className="absolute inset-0 z-1 bg-(image:--scrim-card)" />
            <div className="absolute inset-0 z-2 flex flex-col justify-between p-5.5">
              <Img className="size-9.5 object-contain" src={c.icon} sizes="38px" />
              <div>
                <h3 className="m-0 text-card-title leading-tight font-semibold"><small className="mb-2 block font-mono text-label font-medium tracking-widest text-on-photo/70 uppercase">{m.labels[c.id]}</small>{pick(c.ko, c.en)}</h3>
                <p className="mt-1.5 text-small text-on-photo/75">{pick(c.desc, c.descEn)}</p>
              </div>
            </div>
            <i className="absolute inset-x-0 bottom-0 z-3 h-0.75 origin-left scale-x-0 bg-acc transition-transform duration-500 ease-out group-data-on/cat:scale-x-100" />
          </button>
        ))}
      </div>

      <div className="mt-stack-sm">
        <IndexHead title={pick(cat.ko, cat.en)} aside={m.counts(rows.length, photos)} />
        <ul className="m-0 list-none p-0">
          {rows.map(r => (
            <li key={catId + r.name} data-row onPointerEnter={() => mark(r.name)} onPointerLeave={() => mark(null)} onClick={() => reveal(r.name)}
              // fixed last column: each row is its own grid, so an auto column would shift the others row to row
              className="group/row relative grid cursor-pointer grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_7.5rem] items-center gap-5 border-b border-line py-4.5 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-fg after:transition-transform after:duration-600 after:ease-out hover:after:scale-x-100 max-lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_7.5rem] max-sm:grid-cols-[minmax(0,1fr)_auto]">
              <span className="font-display text-subhead-lg leading-none font-extrabold tracking-name uppercase">
                <Roll text={r.name} />
              </span>
              <span className="text-body-sm text-fg-2 max-sm:hidden">{m.showSystemEn ? <>{r.sys} <span className="mono ml-1.5 text-mute">{r.sysEn}</span></> : r.sysEn}</span>
              <span className="flex flex-wrap gap-1.5 max-lg:hidden">{m.tags[catId].map(tag => <span key={tag} className="rounded-full border border-line px-2.25 py-1 font-sans text-caption font-medium tracking-normal text-mute">{tag}</span>)}</span>
              <span className="num text-right font-mono text-mono-sm tracking-tag text-mute">{m.photoCount(r.imgs.length)}</span>
            </li>
          ))}
        </ul>
        <div ref={gallery} data-gallery aria-label={m.gallery}
          className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3.5 [scrollbar-color:var(--line-2)_transparent] [scrollbar-width:thin]">
          {cat.groups.flatMap(g => g.parts.map((p, i) => (
            <figure key={catId + g.en + i} data-name={p.name} className="group/fig m-0 grid w-product-thumb flex-none snap-start gap-2">
              <div data-ph className="relative aspect-335/300 overflow-hidden rounded-card border border-line bg-plate group-data-on/fig:border-acc">
                <Img src={'assets/img/products/' + p.img} sizes="(max-width: 640px) 50vw, 240px" alt={p.name} className="size-full object-cover transition-transform duration-800 ease-out group-hover/fig:scale-106 group-data-on/fig:scale-106" />
              </div>
              <figcaption className="flex justify-between gap-2.5 text-caption"><b>{p.name}</b><span className="font-mono text-tag tracking-widest text-mute uppercase">{pick(g.ko, g.en)}</span></figcaption>
            </figure>
          )))}
        </div>
      </div>
    </div>
  );
}

export function Statement() {
  const m = useT().statement;
  const root = useRef<HTMLElement>(null);
  // the three lines slide into place once, from alternating sides, the first time the slogan is in view
  useGSAP(() => {
    if (REDUCED) return;
    const lines = gsap.utils.toArray<HTMLElement>('[data-line]');
    gsap.set(lines, { xPercent: i => [-14, 12, -6][i], opacity: 0 });
    ScrollTrigger.create({ trigger: root.current, start: 'top 70%', once: true, onEnter: () => gsap.to(lines, { xPercent: 0, opacity: 1, duration: 1.4, ease: 'power3.out', stagger: .08 }) });
  }, { scope: root });
  const LINE = 'font-display text-statement leading-statement font-black whitespace-nowrap uppercase max-sm:whitespace-normal';
  return (
    <Section ref={root} id="statement" aria-label={m.label} className="h-[110vh] min-h-160 overflow-hidden bg-ink text-ink-fg">
      <div data-photo className="absolute inset-0 overflow-hidden bg-ink">
        <Img src="assets/img/company/company-bg.jpg" sizes="100vw" className="size-full object-cover opacity-42" />
        <div className="absolute inset-0 bg-(image:--scrim-band)" />
      </div>
      <div className="absolute inset-0 grid content-center px-gutter" aria-hidden="true">
        {/* outline, accent and plain, the middle line set to the right */}
        <div data-line className={cn(LINE, 'text-transparent [-webkit-text-stroke:1.5px_var(--stroke-on-ink)]')}>{m.lines[0]}</div>
        <div data-line className={cn(LINE, 'text-right text-ink-acc')}>{m.lines[1]}</div>
        <div data-line className={LINE}>{m.lines[2]}</div>
      </div>
      <p className="absolute bottom-statement-bottom left-gutter m-0 max-w-measure text-ink-fg-2">{m.body}</p>
    </Section>
  );
}
