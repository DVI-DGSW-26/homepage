// App captures at twice the width they are drawn (the CES content spec), taken from the QAC FLOW app's
// offline demo rather than screenshotted by hand.
//
// The demo runs the app on an in-browser fake server with sample data, so nothing real is shown and no
// masking is needed. This drives a headless Chrome over the DevTools protocol (no puppeteer): signs in
// as the demo admin in each language, in light mode at 2× device pixels, sets the screen up, and writes
// the crop as WebP straight to public/assets/img/qacflow/ (the English copy under en/), where
// scripts/images.mjs picks it up.
//
//   1. in the QAC FLOW repo:   npx vite --mode demo-offline --port 5190
//   2. here:                   pnpm capture            (every shot)
//                              pnpm capture report     (by name)
//
// QAC_DEMO (default http://localhost:5190) and CHROME (the browser's path) override the defaults.
// The demo's data lives in memory and is seeded the same way on every load, so record ids are stable;
// anything a shot does to the data (signing a report) is gone on the next load.
import { spawn } from 'node:child_process';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'public/assets/img/qacflow');
const PROFILE = path.join(root, 'node_modules/.cache/dv-capture');
const APP = process.env.QAC_DEMO ?? 'http://localhost:5190';
const PORT = 9333;
const CHROME = process.env.CHROME ?? [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome'
].find(existsSync);
const LANGS = ['ko', 'en'];
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Each shot: the file it writes, the viewport it starts from (CSS px, captured at 2×), `width`, the CSS
 * width the crop must come out at (the viewport is nudged until it does), and `run`, which prepares the
 * page and returns the crop's rectangle. */
const SHOTS = {
  // the report section (Data.tsx): an approved report's head, basic information, the three signatures
  // and the rounds, drawn at most 1000 px wide on the page
  report: {
    file: 'report-summary.webp', viewport: [1280, 1600], width: 1000,
    async run(page) {
      await page.go('/reports/50262');
      // sign all three steps on the admin's behalf, confirming each
      await page.eval(`(async () => {
        for (let i = 0; i < 8; i++) {
          const bs = [...document.querySelectorAll('main button')];
          const b = bs.find(b => /^(Sign|서명)$/.test(b.textContent.trim())) ?? bs.find(b => /behalf|Final approval|대리 서명|최종 승인/.test(b.textContent));
          if (!b) break;
          b.click(); await new Promise(r => setTimeout(r, 800));
        }
      })()`);
      await sleep(800);
      // from the page title down to the rounds' card, the cards' width plus a margin
      return page.eval(`(() => {
        const leaf = re => [...document.querySelectorAll('main *')].find(e => !e.children.length && re.test(e.textContent.trim()));
        const card = el => { while (el && el !== document.body) { const cs = getComputedStyle(el); if (parseFloat(cs.borderRadius) >= 8 && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') return el; el = el.parentElement; } };
        if (/Waiting|대기/.test(document.querySelector('main').innerText)) throw new Error('the report is not signed through');
        const t = leaf(/^(Inspection Report Details|검사보고서 상세)$/).getBoundingClientRect();
        const h = card(leaf(/^QC-MA-IR-/)).getBoundingClientRect();
        const b = card(leaf(/^(Inspection by Round|차수별 검사 정보)$/)).getBoundingClientRect();
        const m = 16;
        return { x: h.left - m, y: t.top + scrollY - m, width: h.width + m * 2, height: b.bottom - t.top + m * 2 };
      })()`);
    }
  }
};

async function chrome() {
  if (!CHROME) throw new Error('Chrome not found: set CHROME to its path');
  await fs.mkdir(PROFILE, { recursive: true });
  const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, '--no-first-run',
    '--hide-scrollbars', '--force-color-profile=srgb', 'about:blank'], { stdio: 'ignore' });
  let targets = [];
  for (let i = 0; i < 50 && !targets.length; i++) {
    targets = await fetch(`http://127.0.0.1:${PORT}/json/list`).then(r => r.json()).catch(() => []);
    if (!targets.length) await sleep(200);
  }
  const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); pending.delete(m.id); };
  const send = (method, params = {}) => new Promise((res, rej) => {
    pending.set(++id, m => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
  const page = {
    send,
    async eval(expression) {
      const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
      return r.result.value;
    },
    async go(url) { await send('Page.navigate', { url: APP + url }); await sleep(3000); },
    close() { ws.close(); proc.kill(); }
  };
  await send('Page.enable');
  return page;
}

/** a fresh page at `w` × `h`, 2×, light, signed in as the demo admin in `lang` */
async function signIn(page, lang, [w, h]) {
  await page.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: false });
  await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }] });
  await page.go('/login');
  const account = { loginId: 'demo-admin', name: 'Admin', role: 'ADMIN', accessToken: 'demo-token-1', refreshToken: 'demo-refresh-1' };
  const storage = {
    i18nextLng: lang, accessToken: account.accessToken, refreshToken: account.refreshToken,
    'auth-persist': 'true', 'auth-active': account.loginId, 'auth-accounts': JSON.stringify([account]),
    'rn:settings:v1': JSON.stringify({ workspace: 'classic', theme: 'light', palettes: { light: 'default', dark: 'default' }, accent: 'theme', motion: 'reduce', font: 'default' }),
    'rn:release-seen:v1': '9.9.9'
  };
  await page.eval(`Object.entries(${JSON.stringify(storage)}).forEach(([k, v]) => localStorage.setItem(k, v))`);
}

async function capture(page, name, shot, lang) {
  let [w, h] = shot.viewport;
  for (let pass = 0; pass < 3; pass++) {
    await signIn(page, lang, [w, h]);
    const clip = await shot.run(page);
    if (Math.abs(clip.width - shot.width) >= .5) { w = Math.round(w + shot.width - clip.width); continue; }
    const { data } = await page.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...clip, width: shot.width, scale: 1 } });
    const file = path.join(OUT, lang === 'ko' ? '' : lang, shot.file);
    const info = await sharp(Buffer.from(data, 'base64')).webp({ quality: 95, smartSubsample: true, effort: 6 }).toFile(file);
    console.log(`capture: ${name} ${lang} → ${path.relative(root, file)} ${info.width}×${info.height}`);
    return;
  }
  throw new Error(`${name} ${lang}: the crop never came out ${shot.width}px wide`);
}

const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SHOTS);
const unknown = names.filter(n => !SHOTS[n]);
if (unknown.length) throw new Error(`unknown shot: ${unknown.join(', ')} (have: ${Object.keys(SHOTS).join(', ')})`);
if (!(await fetch(APP).then(r => r.ok, () => false))) throw new Error(`the QAC FLOW demo is not running at ${APP} (npx vite --mode demo-offline --port 5190)`);

const page = await chrome();
try {
  for (const name of names) for (const lang of LANGS) await capture(page, name, SHOTS[name], lang);
} finally {
  page.close();
}
