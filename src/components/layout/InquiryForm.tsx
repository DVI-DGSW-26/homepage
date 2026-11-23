// The demo request form itself, shared by the dialog the demo buttons open (InquiryDialog) and the block at
// the end of the product pages (Contact). Three fields, sent to api/inquiry.ts, which mails sales. No consent
// checkbox: a demo request needs none under 개인정보 보호법 (privacy.ko.ts says why), so a line above the
// button tells what happens to the data and links the policy.
//
// Its height never changes, so the dialog around it holds still: a field error takes the space beside the
// button (reserved under it on a phone), and the outcome
// covers the form at the same size. A failed send keeps what was typed under that cover and offers the
// sales address. The privacy policy opens in a new tab
// so nothing typed is lost.
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useLang, usePage, useT } from '../../i18n';
import { pathOf } from '../../lib/paths';
import { normalizeEmail, sendInquiry, type InquirySource } from '../../lib/inquiry';
import { SALES_EMAIL } from '../../lib/site';
import { cn } from '../../lib/cn';

/** in the order they show and are checked: name and company side by side, the email below */
const FIELDS = [
  { id: 'name', type: 'text', autoComplete: 'name', max: 100 },
  { id: 'company', type: 'text', autoComplete: 'organization', max: 100 },
  { id: 'email', type: 'email', autoComplete: 'email', max: 200 }
] as const;
type Field = (typeof FIELDS)[number]['id'];
type Status = 'idle' | 'sending' | 'sent' | 'failed';

const EMAIL = /^[^\s@<>"(),;:]+@[^\s@<>"(),;:]+\.[^\s@<>"(),;:]+$/;

const INPUT = 'w-full rounded-card border border-line bg-bg px-4 py-3.5 text-body text-fg transition-[border-color,box-shadow] duration-300 outline-none placeholder:text-mute/60 hover:border-line-2 focus:border-qf focus:shadow-[0_0_0_3px_var(--qf-soft)] aria-invalid:border-err';
const BUTTON = 'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-6 py-2.5 text-body-sm font-semibold transition-[filter,border-color,color] duration-300';

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
    const missing = FIELDS.find(f => (f.id === 'email' ? !EMAIL.test(value(f.id)) : !value(f.id)))?.id ?? null;
    setError(missing);
    if (missing) { form.querySelector<HTMLElement>(`[name="${missing}"]`)?.focus(); return; }
    setStatus('sending');
    const ok = await sendInquiry({
      lang, page, source,
      name: value('name'), email: value('email'), company: value('company'), hp: value('hp')
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
          {FIELDS.map(f => (
            <label key={f.id} className={cn('grid gap-2', f.id === 'email' && 'sm:col-span-2')}>
              <span className="text-body-sm font-semibold text-fg-2">{c.fields[f.id]}</span>
              <input name={f.id} type={f.type} autoComplete={f.autoComplete} maxLength={f.max} required placeholder={c.placeholders[f.id]}
                aria-invalid={error === f.id || undefined} aria-describedby={error === f.id ? errorId : undefined} className={INPUT} />
            </label>
          ))}
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
