// Runs after `vite build`: writes dist/dvision-single.html, the whole page in one file (images, script
// and styles inlined) for sharing or design review where the site can't be served.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const pub = path.join(root, 'public');
const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon' };

// The site splits the WebGL scenes (and three.js) into chunks it loads on demand; a single file has
// nowhere to load them from, so it gets its own build with every dynamic import folded into one script.
const out = path.join(root, 'node_modules/.cache/dv-single');
await build({
  root, logLevel: 'warn', configFile: path.join(root, 'vite.config.ts'),
  build: { outDir: out, emptyOutDir: true, copyPublicDir: false, chunkSizeWarningLimit: 1300, rolldownOptions: { output: { inlineDynamicImports: true } } }
});

const html = await fs.readFile(path.join(out, 'index.html'), 'utf8');
const ref = (re, what) => { const m = html.match(re); if (!m) throw new Error(`single: no ${what} in the single-file build`); return m[1]; };
const jsPath = ref(/<script[^>]+src="\/?([^"]+\.js)"/, 'module script');
const cssPath = ref(/<link[^>]+rel="stylesheet"[^>]+href="\/?(assets\/[^"]+\.css)"/, 'stylesheet');
const js = await fs.readFile(path.join(out, jsPath), 'utf8');
const css = await fs.readFile(path.join(out, cssPath), 'utf8');

const cache = new Map();
const dataUri = async (rel) => {
  if (cache.has(rel)) return cache.get(rel);
  const buf = await fs.readFile(path.join(pub, rel));
  const uri = `data:${mime[path.extname(rel).toLowerCase()] || 'application/octet-stream'};base64,${buf.toString('base64')}`;
  cache.set(rel, uri); return uri;
};

// Image paths are assembled at runtime ('assets/img/products/' + p.img, `assets/img/${src}.jpg`), so no
// regex can find them in the bundle. Instead every image the code could reach is shipped in a map and
// swapped in by a tiny observer: an image counts when the source mentions its file name, the folder the
// code joins names onto, or its path below assets/img/ without the extension. (The source, not the
// bundle: the bundle also carries the image manifest, which names every file whether used or not.)
// The AVIF / WebP copies are left out; <Img> sees window.__ASSETS__ and renders plain <img>s here.
const walk = async (dir, acc = []) => { for (const e of await fs.readdir(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) await walk(p, acc); else acc.push(p); } return acc; };
const map = {};
const srcFiles = (await walk(path.join(root, 'src'))).filter(f => /\.tsx?$/.test(f));
const code = (await Promise.all(srcFiles.map(f => fs.readFile(f, 'utf8')))).join('\n');
for (const file of await walk(path.join(pub, 'assets/img'))) {
  const rel = path.relative(pub, file).split(path.sep).join('/');
  if (!mime[path.extname(rel).toLowerCase()]) continue;
  const folder = path.posix.dirname(rel) + '/', stem = rel.slice('assets/img/'.length).replace(/\.[^.]+$/, '');
  if (!code.includes(path.basename(rel)) && !code.includes(folder) && !code.includes(stem)) continue;
  map[rel] = await dataUri(rel);
}

// the artifact viewer blocks downloads, so the single file opens the catalog PDF in a new tab instead
const CATALOG = 'https://dvi-ind.com/img/dvision/catalog.pdf';
const swapper = `<script>window.__ASSETS__=${JSON.stringify(map)};(function(){var M=window.__ASSETS__;function fix(el){if(!el||!el.getAttribute)return;var s=el.getAttribute('src');if(s&&M[s])el.src=M[s];if(el.tagName==='A'&&el.hasAttribute('download')){el.removeAttribute('download');el.target='_blank';el.rel='noopener';}}function scan(r){if(r.querySelectorAll)r.querySelectorAll('img[src^="assets/"],a[download]').forEach(fix);}var o=new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='attributes')fix(m.target);m.addedNodes&&m.addedNodes.forEach(function(n){if(n.nodeType===1){fix(n);scan(n);}});});});o.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','download']});document.addEventListener('DOMContentLoaded',function(){scan(document);});scan(document);})();</script>`;

const title = (html.match(/<title>(.*?)<\/title>/) || [, 'DVISION'])[1];
// the pre-paint theme script (index.html), so a remembered light mode applies here too
const themeScript = (html.match(/<script id="dv-theme">.*?<\/script>/) || [''])[0];
const fonts = (html.match(/<link[^>]+fonts\.googleapis[^>]*>/g) || []).join('\n');
// the head isn't carried over wholesale, so the tab icon is inlined explicitly
const icon = `<link rel="icon" type="image/png" href="${await dataUri('assets/img/favicon-32.png')}">`;
const app = js.split('assets/docs/DVISION-catalog.pdf').join(CATALOG).replace(/<\/script/gi, '<\\/script');
// declared explicitly: opened from disk with no charset, the Korean copy in the bundle decodes as garbage
const single = `<meta charset="utf-8">\n<title>${title}</title>\n${icon}\n${themeScript}\n${fonts}\n<style>\n${css}\n</style>\n${swapper}\n<div id="root"></div>\n<script type="module">\n${app}\n</script>\n`;
await fs.writeFile(path.join(dist, 'dvision-single.html'), single);
console.log(`inlined ${Object.keys(map).length} assets into the single file`);
console.log(`dist/dvision-single.html ${(Buffer.byteLength(single) / 1024 / 1024).toFixed(2)} MB`);
