/**
 * POST /api/inquiry — the demo request form mailer, served by the route handler src/app/api/inquiry/route.ts
 * (a Vercel Function in production, and in `next dev` locally). Adapted from the company site's mailer (homepage_new,
 * api/inquiry.ts); both send through the same Resend account and verified domain (dvi-ind.com).
 *
 * Sends the request with Resend (https://resend.com):
 *   From:     "QAC FLOW 데모 신청" <INQUIRY_MAIL_FROM>  — an address on the domain verified in Resend. A fixed name:
 *             a visitor's name on a company address with a free-mail Reply-To (gmail…) reads as impersonation to
 *             Gmail's filters, and such requests went to spam; the visitor's name is in the subject instead
 *   Reply-To: the visitor's email, so "reply" in the mail app answers the visitor
 *   To:       INQUIRY_MAIL_TO (default sales@dvi-ind.com)
 *   Tags:     form / source / page / lang, to filter the sends in the Resend dashboard
 * The visitor's address can't be the From itself: their domain's SPF / DMARC would reject or spam-folder it.
 * The mail is for the sales team, so it is in Korean whichever language the visitor read; the subject says which.
 * Where the visitor asked from (button, page) goes only into the Resend tags, not the mail.
 *
 * Env (Vercel Project Settings > Environment Variables, or .env.local for `pnpm dev`): see .env.example.
 * Self-contained on purpose (no imports from the rest of src/): it runs only on the server.
 */

const DEFAULT_TO = 'sales@dvi-ind.com';

/** max length per field (characters) */
const limits = { name: 100, email: 200, company: 100 } as const;
type Field = keyof typeof limits;
type Lang = 'ko' | 'en';

const labels: Record<Field, string> = { name: '이름', email: '회사 이메일', company: '회사명' };
const subjects: Record<Lang, string> = { ko: '[QAC FLOW 데모 신청]', en: '[QAC FLOW 데모 신청 · 영문]' };
/** which button brought the visitor to the form, and from which page (Resend tags only) */
const sources = ['hero', 'live', 'partner', 'page'];
const pages = ['/qac-flow', '/data'];

const emailPattern = /^[^\s@<>"(),;:]+@[^\s@<>"(),;:]+\.[^\s@<>"(),;:]+$/;

const json = (status: number, body: object) => Response.json(body, { status });

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** a Resend tag value: ASCII letters, digits, _ and - only */
const tag = (s: string) => s.replace(/[^\w-]/g, '-').slice(0, 256) || 'none';

// The mail's look: the site's graphite and QAC FLOW green, on white so it reads in any mail app.
// Tables and inline styles only: Gmail and Outlook drop <style> blocks and most layout CSS.
const C = { ink: '#2A2D33', text: '#1F2328', sub: '#5B616B', mute: '#8A9099', line: '#E6E8EB', bg: '#F1F3F5', green: '#3CCB9A', greenInk: '#157A57' };
const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI','Apple SD Gothic Neo','Malgun Gothic',sans-serif`;

export type MailInput = { fields: Record<Field, string>; lang: Lang; at: Date };

/** The subject, HTML and plain-text bodies of one request (exported for a local preview) */
export function renderMail({ fields, lang, at }: MailInput) {
  const when = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', dateStyle: 'long', timeStyle: 'short' }).format(at);
  const subject = `${subjects[lang]} ${fields.company} / ${fields.name}`.replace(/[\r\n]/g, ' ');
  const reply = `mailto:${fields.email}?subject=${encodeURIComponent(`Re: ${subjects[lang]} ${fields.company}`)}`;
  const e = (s: string) => escapeHtml(s);

  const rows = (Object.keys(labels) as Field[])
    .map(id => {
      const value = id === 'email' ? `<a href="mailto:${e(fields.email)}" style="color:${C.greenInk};text-decoration:none">${e(fields.email)}</a>` : e(fields[id]);
      return `<tr>
        <td style="padding:13px 0;border-bottom:1px solid ${C.line};width:104px;color:${C.mute};font-size:13px;line-height:22px;vertical-align:top">${labels[id]}</td>
        <td style="padding:13px 0;border-bottom:1px solid ${C.line};color:${C.text};font-size:15px;line-height:22px;font-weight:600">${value}</td>
      </tr>`;
    })
    .join('');

  const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.bg}">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${e(fields.company)} ${e(fields.name)}님의 데모 신청</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};font-family:${FONT}">
<tr><td align="center" style="padding:32px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${C.line};border-radius:12px;overflow:hidden">
    <tr><td style="background:${C.ink};padding:18px 28px;border-top:4px solid ${C.green}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="color:#ffffff;font-size:17px;font-weight:800;letter-spacing:1px">QAC <span style="color:${C.green}">FLOW</span></td>
        <td align="right"><span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${C.green};color:#0E3B2C;font-size:12px;font-weight:700">데모 신청</span></td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:28px 28px 8px">
      <p style="margin:0;color:${C.sub};font-size:13px">새 데모 신청이 접수되었습니다</p>
      <h1 style="margin:6px 0 4px;color:${C.text};font-size:24px;line-height:32px;font-weight:700">${e(fields.company)}</h1>
      <p style="margin:0 0 14px;color:${C.sub};font-size:14px">${e(fields.name)}님 · ${e(fields.email)}</p>
    </td></tr>
    <tr><td style="padding:8px 28px 4px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line}">${rows}</table>
    </td></tr>
    <tr><td style="padding:24px 28px 28px">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:${C.green}">
        <a href="${e(reply)}" style="display:inline-block;padding:12px 22px;color:#0E3B2C;font-size:14px;font-weight:700;text-decoration:none">${e(fields.name)}님에게 회신하기</a>
      </td></tr></table>
      <p style="margin:12px 0 0;color:${C.mute};font-size:12px;line-height:18px">이 메일에 바로 답장해도 신청자에게 전달됩니다.</p>
    </td></tr>
    <tr><td style="padding:16px 28px;background:#F7F8FA;border-top:1px solid ${C.line};color:${C.mute};font-size:12px;line-height:19px">
      접수 ${e(when)} (KST) · solution.dvi-ind.com 데모 신청 폼<br>
      개인정보처리방침에 따라 상담 종료 후 1년이 지나면 이 메일을 삭제해 주세요.
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

  const text = [
    '새 데모 신청이 접수되었습니다',
    '',
    ...(Object.keys(labels) as Field[]).map(id => `${labels[id]}: ${fields[id]}`),
    '',
    `접수: ${when} (KST)`,
    '',
    '이 메일에 답장하면 신청자에게 전달됩니다.',
    '개인정보처리방침에 따라 상담 종료 후 1년이 지나면 이 메일을 삭제해 주세요.'
  ].join('\n');

  return { subject, html, text };
}

export async function POST(request: Request): Promise<Response> {
  let input: Record<string, unknown>;
  try {
    input = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { error: 'invalid' });
  }
  if (!input || typeof input !== 'object') return json(400, { error: 'invalid' });

  // honeypot: hidden from people, bots fill it — pretend success, but leave a trace in the function log
  if (typeof input.hp === 'string' && input.hp) {
    console.warn('[inquiry] honeypot filled; dropped as a bot');
    return json(200, { ok: true });
  }

  const str = (id: string) => (typeof input[id] === 'string' ? (input[id] as string) : '').trim();
  // full-width ＠ ． and letters (a Korean IME) become ASCII, zero-width characters go; as src/lib/inquiry.ts does
  const normalizeEmail = (s: string) => s.normalize('NFKC').replace(/[​-‍﻿]/g, '').trim();
  const fields = Object.fromEntries(
    (Object.keys(limits) as Field[]).map(id => [id, id === 'email' ? normalizeEmail(str(id)) : str(id)])
  ) as Record<Field, string>;
  const lang: Lang = input.lang === 'en' ? 'en' : 'ko';

  if (!fields.name || !fields.company || !emailPattern.test(fields.email)) return json(400, { error: 'invalid' });
  if ((Object.keys(limits) as Field[]).some(id => fields[id].length > limits[id])) return json(400, { error: 'invalid' });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_MAIL_FROM?.trim();
  // while developing (`next dev`), INQUIRY_MAIL_TO_DEV, when set, keeps test requests out of the real inbox
  const devTo = process.env.NODE_ENV === 'development' ? process.env.INQUIRY_MAIL_TO_DEV?.trim() : '';
  const to = devTo || process.env.INQUIRY_MAIL_TO?.trim() || DEFAULT_TO;
  if (!apiKey || !from) {
    console.error('[inquiry] RESEND_API_KEY or INQUIRY_MAIL_FROM is not set');
    return json(500, { error: 'not_configured' });
  }

  const source = sources.includes(str('source')) ? str('source') : 'page';
  const page = pages.includes(str('page')) ? str('page') : '-';
  const { subject, html, text } = renderMail({ fields, lang, at: new Date() });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `"QAC FLOW 데모 신청" <${from}>`,
      to: [to],
      reply_to: fields.email,
      subject,
      text,
      html,
      tags: [
        { name: 'form', value: 'qac-flow-demo' },
        { name: 'source', value: tag(source) },
        { name: 'page', value: tag(page.replace(/^\//, '')) },
        { name: 'lang', value: lang }
      ]
    })
  }).catch((error: unknown) => {
    console.error('[inquiry] Resend request failed', error);
    return null;
  });
  if (!response?.ok) {
    if (response) console.error('[inquiry] Resend error', response.status, await response.text());
    return json(502, { error: 'send_failed' });
  }
  return json(200, { ok: true });
}
