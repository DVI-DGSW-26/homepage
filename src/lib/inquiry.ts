// The demo request form: in a dialog that every "demo" button on the pages opens
// (src/components/layout/InquiryDialog.tsx), and inline at the end of the two product pages (#contact).
// Either posts to api/inquiry.ts, a Vercel Function (also served by `pnpm dev`, see vite.config.ts) that
// mails it with Resend to sales. The mail settings live on the server (.env.example), never in this bundle.
import type { MouseEvent } from 'react';
import type { Lang } from '../i18n';
import { createStore, useStore } from './store';

/** where the visitor asked from: a button (the hero, the live monitor, the partnership tags) or the form at the page's end */
export type InquirySource = 'hero' | 'live' | 'partner' | 'page';

export type Inquiry = {
  lang: Lang;
  name: string;
  email: string;
  company: string;
  /** the page the form was sent from ("/qac-flow", "/data") */
  page: string;
  source: InquirySource;
  /** honeypot (a hidden field): only bots fill it */
  hp: string;
};

/** An email as typed with a Korean IME or pasted: full-width ＠ ． and letters become ASCII (NFKC), zero-width
 * characters go. The same as api/inquiry.ts does. */
export const normalizeEmail = (s: string) => s.normalize('NFKC').replace(/[​-‍﻿]/g, '').trim();

/** the button the open dialog came from; null while it is closed */
const dialog = createStore<InquirySource | null>(null);
export const useInquiryDialog = () => useStore(dialog);
export const closeInquiry = () => dialog.set(null);

/** A demo button's onClick: opens the dialog. The button is a link to #contact, which is where it goes if the
 * script hasn't run; here that jump is cancelled. */
export const openInquiry = (source: Exclude<InquirySource, 'page'>) => (e: MouseEvent) => {
  e.preventDefault();
  dialog.set(source);
};

/** true when the server accepted (and sent) the inquiry */
export async function sendInquiry(inquiry: Inquiry): Promise<boolean> {
  try {
    const res = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    return res.ok;
  } catch {
    return false;
  }
}
