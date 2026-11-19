// A modal <dialog> for the media viewers (the zoomed capture, the demo video), as InquiryDialog is: open
// while `open`, focus kept inside, Esc and the back button close it (useBackToClose), the page holds still
// behind it (index.css). A click on the backdrop closes it, but not a drag that starts inside and ends
// there. The content mounts only while open.
import { useEffect, useRef, type ComponentProps, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';
import { useBackToClose } from '../lib/history';

type Props = Omit<ComponentProps<'dialog'>, 'open' | 'onClose'> & {
  open: boolean;
  onClose: () => void;
  /** the close button's label */
  closeLabel: string;
};

export function Modal({ open, onClose, closeLabel, className, children, ...rest }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const pressed = useRef<EventTarget | null>(null);
  useBackToClose(open, onClose);

  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const onClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget && pressed.current === e.currentTarget) onClose();
  };

  return (
    <dialog ref={ref} onClose={onClose} onClick={onClick} onMouseDown={e => { pressed.current = e.target; }}
      className={cn('media-dialog m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:bg-ink/90', className)} {...rest}>
      {open && <>
        {children}
        {/* fixed to the screen's corner, clear of whatever the dialog shows */}
        <button type="button" onClick={onClose} aria-label={closeLabel}
          className="fixed top-4 right-4 grid size-11 cursor-pointer place-items-center rounded-full border border-ink-line-2 bg-ink/70 text-ink-fg transition-colors duration-300 hover:border-ink-fg hover:text-on-photo">
          <X className="size-5" strokeWidth={1.6} aria-hidden="true" />
        </button>
      </>}
    </dialog>
  );
}
