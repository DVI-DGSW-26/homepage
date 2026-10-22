import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { rich, useT } from '../i18n';
import { COMPANY } from '../data';
import { ArrowIcon, DownloadIcon, Eyebrow, H2, Photo, SEC, SecHead, Section, btn, cn } from './ui';
import { Img } from './Img';

const TILE = 'group rv grid grid-rows-[auto_1fr_auto] overflow-hidden rounded-card border border-line bg-card p-0 [transition:border-color_.4s,translate_.6s_var(--ease-out)] hover:-translate-y-1 hover:border-line-2';
const TILE_IN = 'grid content-start gap-3 px-[26px] pt-6 pb-[26px]';
const TILE_META = 'mono flex justify-between text-mute';
const TILE_H3 = 'm-0 text-[1.35rem] font-semibold tracking-[-.02em]';
const TILE_P = 'm-0 text-[.95rem] text-fg-2';
const GO = 'flex items-center justify-between border-t border-line px-[26px] py-4 text-[.95rem] font-medium text-fg-2';
const GO_ICON = 'size-[18px] transition-transform duration-[450ms] ease-out group-hover:translate-x-1 group-hover:-translate-y-1';

export function Community() {
  const m = useT().community;
  const [playing, setPlaying] = useState(false);
  return (
    <Section id="community" className={SEC}>
      <div className="wrap">
        <SecHead eyebrow={m.eyebrow} title={m.title} />
        <div data-batch className="grid grid-cols-[1.1fr_1.3fr_.9fr] gap-[18px] max-3xl:grid-cols-2 max-sm:grid-cols-1">
          <a className={TILE} href={COMPANY.news} target="_blank" rel="noopener">
            <Photo data-wipe src="assets/img/community/news-2025-11-12.jpg" sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 30vw" className="aspect-video rounded-none" />
            <div className={TILE_IN}>
              <div className={TILE_META}><span>{m.news.tag}</span><span className="num">{m.news.date}</span></div>
              <h3 className={TILE_H3}>{m.news.title}</h3>
              <p className={TILE_P}>{m.news.body}</p>
            </div>
            <div className={GO}><span>{m.news.more}</span><ArrowIcon className={GO_ICON} /></div>
          </a>
          <div className={TILE}>
            <div role="button" tabIndex={0} aria-label={m.video.play}
              onClick={() => setPlaying(true)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlaying(true); } }}
              className="group/video relative aspect-video cursor-pointer overflow-hidden bg-ink">
              <Img src="assets/img/hero/banner-02.jpg" sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 40vw" alt="" className="size-full object-cover opacity-70 transition-transform duration-1000 ease-out group-hover/video:scale-[1.04]" />
              <div className="absolute inset-0 grid place-items-center text-white">
                <i className="grid size-[72px] place-items-center rounded-full border border-white/70 bg-[rgba(12,16,22,.55)] [transition:scale_.5s_var(--ease-out),background-color_.4s] group-hover/video:scale-[1.08] group-hover/video:bg-acc">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                </i>
              </div>
              {playing && <iframe className="absolute inset-0 size-full border-0" src={`https://www.youtube.com/embed/${COMPANY.videoId}?autoplay=1&rel=0`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen title={m.video.frameTitle} />}
            </div>
            <div className={TILE_IN}>
              <div className={TILE_META}><span>{m.video.tag}</span><span>{m.video.source}</span></div>
              <h3 className={TILE_H3}>{m.video.title}</h3>
              <p className={TILE_P}>{m.video.body}</p>
            </div>
            <a className={GO} href={COMPANY.youtube} target="_blank" rel="noopener"><span>{m.video.channel}</span><ArrowIcon className={GO_ICON} /></a>
          </div>
          <div className={cn(TILE, 'max-3xl:col-span-2 max-sm:col-span-1')}>
            <div className={TILE_IN}>
              <div className={TILE_META}><span>{m.catalog.tag}</span><span>{m.catalog.size}</span></div>
              <div className="grid grid-cols-[auto_1fr] items-start gap-[18px]">
                <Photo data-wipe src="assets/img/community/catalog-cover.jpg" sizes="110px" alt={m.catalog.cover} className="aspect-[660/925] w-[110px] border border-line bg-white" />
                <div><h3 className={TILE_H3}>{m.catalog.title}</h3><p className={cn(TILE_P, 'mt-2')}>{m.catalog.body}</p></div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2.5">
                {(['youtube', 'instagram', 'linkedin'] as const).map(k => <a key={k} className={btn({ size: 'sm' })} href={COMPANY[k]} target="_blank" rel="noopener">{m.social[k]}</a>)}
              </div>
            </div>
            <a className={GO} href={COMPANY.catalog} download><span>{m.catalog.download}</span><DownloadIcon className={GO_ICON} /></a>
          </div>
        </div>
      </div>
    </Section>
  );
}


function Info({ k, children }: { k: string; children: ReactNode }) {
  return <div className="grid grid-cols-[90px_1fr] gap-5 border-b border-line py-4"><span className="mono pt-1 text-mute">{k}</span><b className="text-[1rem] font-medium">{children}</b></div>;
}
function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <div className="grid gap-1.5"><label htmlFor={id} className="font-sans text-[.86rem] font-medium text-mute">{label}</label>{children}</div>;
}
const INPUT = 'w-full rounded-none border-0 border-b border-line-2 bg-transparent px-0 py-2.5 text-fg outline-0 transition-[border-color] duration-300 focus:border-acc';

/** Until the send server is wired up, the form opens the visitor's mail app with the message filled in. */
function InquiryForm() {
  const m = useT().contact.form;
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const f = e.currentTarget;
    if (!f.reportValidity()) return;
    const d = Object.fromEntries(new FormData(f).entries()) as Record<string, string>;
    const L = m.mail;
    const body = `${L.company}: ${d.company}\n${L.name}: ${d.name}\n${L.tel}: ${d.tel}\n${L.email}: ${d.email}\n\n${L.message}:\n${d.message}`;
    location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(L.subject + d.company)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    <form className="rv grid gap-3.5 rounded-card border border-line bg-card p-[clamp(20px,3vw,36px)]" noValidate onSubmit={submit}>
      <h3 className="m-0 mb-1.5 text-[1.25rem] font-semibold">{m.title}</h3>
      <div className="grid grid-cols-2 gap-3.5 max-lg:grid-cols-1">
        <Field id="fCompany" label={m.company}><input id="fCompany" name="company" type="text" autoComplete="organization" required className={INPUT} /></Field>
        <Field id="fName" label={m.name}><input id="fName" name="name" type="text" autoComplete="name" required className={INPUT} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3.5 max-lg:grid-cols-1">
        <Field id="fTel" label={m.tel}><input id="fTel" name="tel" type="tel" autoComplete="tel" required className={INPUT} /></Field>
        <Field id="fMail" label={m.email}><input id="fMail" name="email" type="email" autoComplete="email" required className={INPUT} /></Field>
      </div>
      <Field id="fMsg" label={m.message}><textarea id="fMsg" name="message" required className={cn(INPUT, 'min-h-[110px] resize-y')} /></Field>
      <button className={cn(btn({ acc: true }), 'justify-self-start')} type="submit"><span>{m.send}</span> <ArrowIcon /></button>
      <p className="m-0 text-[.8rem] text-mute">{sent ? m.sent : m.note}</p>
    </form>
  );
}

export function Contact() {
  const t = useT(), m = t.contact;
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.from('[data-biglogo] img', { yPercent: 40, opacity: 0, scale: .96, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: '[data-biglogo]', start: 'top 95%', once: true } });
  }, { scope: root });
  return (
    <Section ref={root} id="contact" className={cn(SEC, 'overflow-hidden pb-0')}>
      <Img src="assets/img/company/symbol-bg.png" sizes="min(46vw, 620px)" alt="" aria-hidden="true" className="pointer-events-none absolute top-[8vh] -right-[6vw] w-[min(46vw,620px)] opacity-[.06]" />
      <div className="wrap">
        <div className="relative grid grid-cols-[1.1fr_1fr] items-start gap-[clamp(32px,5vw,90px)] max-lg:grid-cols-1">
          <div>
            <Eyebrow className="rv">{m.eyebrow}</Eyebrow>
            <H2 className="rv mt-[22px] text-[clamp(2.2rem,4.6vw,4.2rem)]">{m.title}</H2>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a className={btn({ acc: true, size: 'lg' })} href={`mailto:${COMPANY.email}`}><span>{m.email}</span> <ArrowIcon /></a>
              <a className={btn({ size: 'lg' })} href={COMPANY.catalog} download><span>{m.catalog}</span> <DownloadIcon /></a>
            </div>
            <div className="rv mt-9 grid border-t border-line-2">
              <Info k={m.info.tel}><span className="num"><a href={COMPANY.telHref} className="hover:text-acc-2">{COMPANY.tel}</a></span></Info>
              <Info k={m.info.fax}><span className="num">{COMPANY.fax}</span></Info>
              <Info k={m.info.email}><a href={`mailto:${COMPANY.email}`} className="hover:text-acc-2">{COMPANY.email}</a></Info>
              <Info k={m.info.address}>{rich(m.address, { map: label => <a className="ml-2 font-sans text-[.86rem] font-normal whitespace-nowrap text-mute" href={`https://map.kakao.com/?q=${COMPANY.mapQuery}`} target="_blank" rel="noopener">{label}</a> })}</Info>
              <Info k={m.info.overseas}>{m.overseas}</Info>
            </div>
          </div>
          <InquiryForm />
        </div>
        <footer className="mt-[clamp(80px,10vw,150px)] overflow-hidden border-t border-line pt-10 pb-[30px]">
          <div data-biglogo className="relative mb-7 aspect-[800/216] w-[min(100%,340px)] opacity-95">
            <Img className="absolute inset-0 size-full origin-bottom-left object-contain object-left transition-opacity duration-500 light:opacity-0" src="assets/img/logo-white.png" sizes="340px" alt={t.brand} />
            <Img className="absolute inset-0 size-full origin-bottom-left object-contain object-left opacity-0 transition-opacity duration-500 light:opacity-100" src="assets/img/logo.png" sizes="340px" alt="" />
          </div>
          <div className="mono flex flex-wrap justify-between gap-5 text-[.84rem] text-mute max-xs:flex-col max-xs:gap-2">
            <span>{m.footer.copyright}</span>
            <span>{m.footer.tagline}</span>
            <a href="#top" className="hover:text-fg">{m.footer.top}</a>
          </div>
        </footer>
      </div>
    </Section>
  );
}
