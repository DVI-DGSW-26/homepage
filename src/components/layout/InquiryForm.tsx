// The adoption inquiry form (도입 문의), shared by the dialog the inquiry buttons open (InquiryDialog) and the
// block at the end of the page (Contact). Laid out the way B2B sales inquiry forms usually are: four fields
// needed to answer (company, name, work email, phone), three quick choices that tell sales where to start
// (inquiry type, machines to inspect, timing), and a free message; sent to the API, which mails sales.
// No consent checkbox: an inquiry needs none under 개인정보 보호법 (privacy.ko.ts says why), so a line above
// the button tells what happens to the data and links the policy.
//
// A field error takes the space beside the button (reserved under it on a phone), and the outcome covers the
// form at the same size. A failed send keeps what was typed under that cover and offers the sales address.
// The privacy policy opens in a new tab so nothing typed is lost.
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useLang, usePage, useT } from '../../i18n';
import { pathOf } from '../../lib/paths';
import { normalizeEmail, sendInquiry, type InquirySource } from '../../lib/inquiry';
import { SALES_EMAIL } from '../../lib/site';
import { cn } from '../../lib/cn';

/** the fields that must be filled, in the order they show and are checked */
const REQUIRED = [
  { id: 'company', type: 'text', autoComplete: 'organization', max: 100 },
  { id: 'name', type: 'text', autoComplete: 'name', max: 100 },
  { id: 'email', type: 'email', autoComplete: 'email', max: 200 },
  { id: 'phone', type: 'tel', autoComplete: 'tel', max: 40 }
] as const;
/** the optional choices: each sends the index of the chosen option ('' for none) */
const CHOICES = ['type', 'scale', 'timing'] as const;
type Field = (typeof REQUIRED)[number]['id'];
type Status = 'idle' | 'sending' | 'sent' | 'failed';

const EMAIL = /^[^\s@<>"(),;:]+@[^\s@<>"(),;:]+\.[^\s@<>"(),;:]+$/;

const INPUT = 'w-full rounded-card border border-line bg-bg px-4 py-3.5 text-body text-fg transition-[border-color,box-shadow] duration-300 outline-none placeholder:text-mute/60 hover:border-line-2 focus:border-qf focus:shadow-[0_0_0_3px_var(--qf-soft)] aria-invalid:border-err';
const LABEL = 'grid content-start gap-2';
const LABEL_TEXT = 'text-body-sm font-semibold text-fg';
const BUTTON = 'inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full px-7 py-3 text-body font-semibold transition-[filter,border-color,color] duration-300';

/**
 * @param className needs a background (bg-…): the outcome cover takes it
 * @param onDone given in the dialog: the button after a sent request closes it instead of starting a new one
 */
export function InquiryForm({ source, className, onDone }: { source: InquirySource; className?: string; onDone?: () => void }) {
  const c = useT().contact, lang = useLang(), page = usePage();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<Field | null>(null);
  const errorId = useId();
  const outcome = useRef<HTMLButtonElement>(null);
  const done = status === 'sent' || status === 'failed';

  // the cover takes the focus, or it would stay on the submit button underneath
  useEffect(() => { if (done) outcome.current?.focus(); }, [done]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const form = e.currentTarget, data = new FormData(form);
    const value = (id: string) => (id === 'email' ? normalizeEmail : (s: string) => s.trim())(String(data.get(id) ?? ''));
    const missing = REQUIRED.find(f => (f.id === 'email' ? !EMAIL.test(value(f.id)) : !value(f.id)))?.id ?? null;
    setError(missing);
    if (missing) { form.querySelector<HTMLElement>(`[name="${missing}"]`)?.focus(); return; }
    setStatus('sending');
    const ok = await sendInquiry({
      lang, page, source,
      name: value('name'), email: value('email'), company: value('company'), phone: value('phone'),
      type: value('type'), scale: value('scale'), timing: value('timing'), message: value('message'), hp: value('hp')
    });
    setStatus(ok ? 'sent' : 'failed');
    if (ok) form.reset();
  };

  // the error goes as soon as the field it names is touched again
  const onChange = (e: FormEvent<HTMLFormElement>) => {
    if (error && (e.target as HTMLInputElement).name === error) setError(null);
  };

  return (
    <form noValidate onSubmit={onSubmit} onChange={onChange} className={cn('relative', className)}>
      <div inert={done} className="grid content-start gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {REQUIRED.map(f => (
            <label key={f.id} className={LABEL}>
              <span className={LABEL_TEXT}>{c.fields[f.id]}</span>
              <input name={f.id} type={f.type} autoComplete={f.autoComplete} maxLength={f.max} required placeholder={c.placeholders[f.id]}
                aria-invalid={error === f.id || undefined} aria-describedby={error === f.id ? errorId : undefined} className={INPUT} />
            </label>
          ))}
          {CHOICES.map(id => (
            <label key={id} className={cn(LABEL, id === 'timing' && 'sm:col-span-2')}>
              <span className={LABEL_TEXT}>{c.fields[id]} <span className="font-normal text-mute">({c.optional})</span></span>
              <select name={id} defaultValue="" className={cn(INPUT, 'cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27none%27 stroke=%27%23888%27 stroke-width=%272%27%3E%3Cpath d=%27M4 6l4 4 4-4%27/%3E%3C/svg%3E")] bg-[position:right_1rem_center] bg-no-repeat pr-11')}>
                <option value="">{c.choose}</option>
                {c.options[id].map((o, i) => <option key={o} value={i}>{o}</option>)}
              </select>
            </label>
          ))}
          <label className={cn(LABEL, 'sm:col-span-2')}>
            <span className={LABEL_TEXT}>{c.fields.message} <span className="font-normal text-mute">({c.optional})</span></span>
            <textarea name="message" rows={4} maxLength={2000} placeholder={c.placeholders.message} className={cn(INPUT, 'resize-y leading-relaxed')} />
          </label>
        </div>
        {/* honeypot: out of sight and out of the tab order; api/inquiry.ts drops whatever fills it. A name no autofill
            knows ("website" was filled by Chrome and password managers, and those requests were dropped), and the
            password managers' own opt-outs */}
        <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" data-1p-ignore="" data-lpignore="true" data-bwignore="" data-form-type="other" />
        </div>

        <p className="m-0 border-t border-line pt-5 text-caption leading-caption text-fg-2">
          {c.notice} <a href={pathOf('/privacy', lang)} target="_blank" rel="noopener" className="whitespace-nowrap text-qf-ink underline underline-offset-4">{c.policy}</a>
        </p>

        <div className="grid gap-2 sm:flex sm:items-center sm:gap-5">
          <button type="submit" disabled={status === 'sending'}
            className={cn(BUTTON, 'flex-none border border-qf bg-qf text-on-acc hover:brightness-110 disabled:cursor-wait disabled:opacity-60')}>
            {status === 'sending' ? c.sending : c.submit}
          </button>
          <p role="status" id={errorId} className="m-0 min-h-[2lh] text-body-sm leading-snug text-err sm:min-h-0 sm:flex-1">
            {error && c.invalid[error]}
          </p>
        </div>
      </div>

      {done && (
        <div className="absolute inset-0 grid place-content-center justify-items-center gap-4 bg-inherit p-6 text-center">
          {status === 'sent'
            ? <CircleCheck className="size-11 text-qf" strokeWidth={1.5} aria-hidden="true" />
            : <CircleAlert className="size-11 text-err" strokeWidth={1.5} aria-hidden="true" />}
          <p role="alert" className="m-0 max-w-sm text-body text-fg">{status === 'sent' ? c.sent : c.failed}</p>
          {status === 'failed' && (
            <a href={`mailto:${SALES_EMAIL}?subject=${encodeURIComponent(c.mailSubject)}`} className="text-body font-semibold text-qf-ink underline underline-offset-4">{SALES_EMAIL}</a>
          )}
          <button ref={outcome} type="button" onClick={() => (status === 'sent' && onDone ? onDone() : setStatus('idle'))}
            className={cn(BUTTON, 'mt-2 border border-line-2 text-fg hover:border-qf hover:text-qf-ink')}>
            {status === 'failed' ? c.retry : onDone ? c.close : c.again}
          </button>
        </div>
      )}
    </form>
  );
}
