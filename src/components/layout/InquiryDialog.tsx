// The demo request dialog: every "demo" button on the pages opens it (openInquiry, src/lib/inquiry.ts), so
// the visitor fills the form where they are instead of being sent to the end of the page. A modal <dialog>:
// focus stays inside, Esc closes it, the page holds still behind it (index.css). The close button or a
// click on the backdrop closes it too; a drag that starts inside (selecting a field's text) and ends
// outside does not. The form is mounted only while it is open, so each opening starts empty, and it keeps
// one height whatever it shows (InquiryForm), so the dialog never jumps.
import { useEffect, useId, useRef, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import { useT } from '../../i18n';
import { closeInquiry, useInquiryDialog } from '../../lib/inquiry';
import { BOOTH } from '../../lib/site';
import { Kicker } from '../ui';
import { InquiryForm } from './InquiryForm';

export function InquiryDialog() {
  const source = useInquiryDialog();
  const ref = useRef<HTMLDialogElement>(null);
  const pressed = useRef<EventTarget | null>(null);
  const c = useT().contact, titleId = useId();

  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (source && !d.open) { d.showModal(); d.querySelector<HTMLInputElement>('input[name="name"]')?.focus(); }
    if (!source && d.open) d.close();
  }, [source]);

  // the dialog itself is only hit on its backdrop (the content fills it); both the press and the release must be there
  const onClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget && pressed.current === e.currentTarget) closeInquiry();
  };

  return (
    <dialog ref={ref} aria-labelledby={titleId} onClose={closeInquiry} onClick={onClick} onMouseDown={e => { pressed.current = e.target; }}
      className="inquiry-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(42rem,calc(100%-2rem))] max-w-none overflow-y-auto overscroll-contain rounded-card border border-line-2 bg-bg-2 p-0 text-fg shadow-2xl backdrop:bg-ink/75">
      {source && (
        <div className="p-8 max-sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <Kicker>{c.kicker}</Kicker>
            <button type="button" onClick={closeInquiry} aria-label={c.close}
              className="-my-1 grid size-9 flex-none cursor-pointer place-items-center rounded-full border border-line text-fg-2 transition-colors duration-300 hover:border-line-2 hover:text-fg">
              <X className="size-4" strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
          <h2 id={titleId} className="m-0 mt-4 text-h2 leading-h2 font-semibold tracking-tight">{c.title}</h2>
          <p className="m-0 mt-2 text-body text-fg-2">{c.lead}</p>
          <p className="mono m-0 mt-4 text-qf-ink">{c.booth(BOOTH)}</p>
          <InquiryForm source={source} onDone={closeInquiry} className="mt-7 border-t border-line bg-bg-2 pt-7" />
        </div>
      )}
    </dialog>
  );
}
