// The back button closes an open dialog (the zoomed capture, the demo video, the demo request, the menu
// sheet) instead of leaving the page, as it does in an app. Opening one adds a history entry at the same
// address, marked as the dialog's; back pops it and closes the dialog. A dialog closed any other way (Esc,
// its button, the backdrop) takes its entry back off, so the next back leaves the page as it should. A
// page link in a dialog (the menu sheet) waits for that entry to go before it opens its page (afterDialogEntry).
//
// Next's router hears the pop too, finds the same address and keeps the page. Under the dev server's StrictMode
// an open runs twice, leaving one spare entry behind; a pop only closes on reaching an entry that isn't a
// dialog's, so that entry is just one more back.
import { useEffect, useEffectEvent } from 'react';

const KEY = 'dvDialog';

/** whether the current history entry is an open dialog's */
export const onDialogEntry = () => !!(history.state as Record<string, unknown> | null)?.[KEY];

/** Runs `fn` once the current dialog's history entry is gone (at once if there is none): call it, then close the dialog. */
export function afterDialogEntry(fn: () => void) {
  if (!onDialogEntry()) { fn(); return; }
  addEventListener('popstate', () => fn(), { once: true });
}

/** While `open`, the back button calls `close`. */
export function useBackToClose(open: boolean, close: () => void) {
  const onBack = useEffectEvent(close);
  useEffect(() => {
    if (!open) return;
    history.pushState({ ...(history.state as object | null), [KEY]: true }, '');
    let popped = false;
    const onPop = () => { if (onDialogEntry()) return; popped = true; onBack(); };
    addEventListener('popstate', onPop);
    return () => {
      removeEventListener('popstate', onPop);
      if (!popped && onDialogEntry()) history.back();
    };
  }, [open]);
}
