// An address no page answers that the proxy (src/proxy.ts) didn't send home — a file name that doesn't
// exist, for one. A plain page with the way back, marked noindex.
import type { Metadata } from 'next';
import '../styles/index.css';

export const metadata: Metadata = { title: '404 | DVISION', robots: { index: false, follow: true } };

export default function GlobalNotFound() {
  return (
    <html lang="ko" data-mode="dark" data-bg="dark">
      <body className="grid min-h-svh place-content-center gap-4 text-center">
        <p className="mono text-mute">404</p>
        <h1 className="m-0 text-h2 font-semibold">페이지를 찾을 수 없습니다 · Page not found</h1>
        <p className="m-0"><a href="/" className="text-qf-ink underline underline-offset-4">QAC FLOW</a> · <a href="/en" className="text-qf-ink underline underline-offset-4">English</a></p>
      </body>
    </html>
  );
}
