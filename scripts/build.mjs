// Build: bundles src/main.js -> dist/app.js, copies the static site to dist/,
// and writes dist/dvision-single.html (everything inlined) for sharing as a single file.
import { build } from 'esbuild';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const dist = path.join(root, 'dist');
const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });

await build({ entryPoints: [path.join(root, 'src/main.js')], bundle: true, minify: true, format: 'iife', target: ['es2020'], outfile: path.join(dist, 'app.js'), logLevel: 'info' });

// static copy
const copyDir = async (from, to) => { await fs.mkdir(to, { recursive: true }); for (const e of await fs.readdir(from, { withFileTypes: true })) { const a = path.join(from, e.name), b = path.join(to, e.name); if (e.isDirectory()) { if (e.name === 'site') continue; await copyDir(a, b); } else await fs.copyFile(a, b); } };
await copyDir(path.join(root, 'assets'), path.join(dist, 'assets'));
await copyDir(path.join(root, 'css'), path.join(dist, 'css'));
let html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
await fs.writeFile(path.join(dist, 'index.html'), html.replace(/dist\/app\.js(\?v=\d+)?/, `app.js?v=${Date.now()}`).replace(/css\/style\.css(\?v=\d+)?/, `css/style.css?v=${Date.now()}`));

// single file
const css = await fs.readFile(path.join(root, 'css/style.css'), 'utf8');
let js = await fs.readFile(path.join(dist, 'app.js'), 'utf8');
const cache = new Map();
const dataUri = async (rel) => {
  if (cache.has(rel)) return cache.get(rel);
  const file = path.join(root, rel);
  try { const buf = await fs.readFile(file); const uri = `data:${mime[path.extname(rel).toLowerCase()] || 'application/octet-stream'};base64,${buf.toString('base64')}`; cache.set(rel, uri); return uri; }
  catch { console.warn('missing asset', rel); return rel; }
};
const inline = async (s) => { const refs = [...new Set(s.match(/assets\/img\/[\w\-./]+?\.(?:jpg|jpeg|png|svg|webp)/g) || [])]; for (const r of refs) s = s.split(r).join(await dataUri(r)); return s; };
js = await inline(js);
const bodyStart = html.indexOf('<body'); const bodyOpenEnd = html.indexOf('>', bodyStart) + 1; const bodyEnd = html.lastIndexOf('</body>');
let body = html.slice(bodyOpenEnd, bodyEnd);
body = body.replace(/<script[^>]*src="dist\/app\.js[^"]*"[^>]*><\/script>/, '');
body = await inline(body);
body = body.split('assets/docs/DVISION-catalog.pdf').join('https://dvi-ind.com/img/dvision/catalog.pdf');
// the artifact viewer blocks downloads, so the single file opens the PDF in a new tab instead
body = body.replace(/ download(?=[\s>])/g, ' target="_blank" rel="noopener"');
// Paths assembled at runtime (data.js joins folder + file name) cannot be found by the regex above,
// so every asset whose file name is mentioned anywhere is shipped in a map and swapped in by a tiny observer.
const walk = async (dir, acc = []) => { for (const e of await fs.readdir(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) { if (e.name !== 'site') await walk(p, acc); } else acc.push(p); } return acc; };
const all = await walk(path.join(root, 'assets/img'));
const mentioned = js + body;
const map = {};
for (const file of all) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  if (!mime[path.extname(rel).toLowerCase()]) continue;
  if (!mentioned.includes(path.basename(rel))) continue;
  map[rel] = await dataUri(rel);
}
const swapper = `<script>window.__ASSETS__=${JSON.stringify(map)};(function(){var M=window.__ASSETS__;function fix(el){if(!el||!el.getAttribute)return;var s=el.getAttribute('src');if(s&&M[s])el.src=M[s];}function scan(r){if(r.querySelectorAll)r.querySelectorAll('img[src^="assets/"]').forEach(fix);}var o=new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='attributes')fix(m.target);m.addedNodes&&m.addedNodes.forEach(function(n){if(n.nodeType===1){fix(n);scan(n);}});});});o.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});document.addEventListener('DOMContentLoaded',function(){scan(document);});scan(document);})();</script>`;
const title = (html.match(/<title>(.*?)<\/title>/) || [, 'DVISION'])[1];
const fonts = (html.match(/<link[^>]+fonts\.googleapis[^>]*>/g) || []).join('\n');
const single = `<title>${title}</title>\n${fonts}\n<style>\n${css}\n</style>\n${body}\n${swapper}\n<script>\n${js}\n</script>\n`;
console.log(`inlined ${Object.keys(map).length} assets into the single file`);
await fs.writeFile(path.join(dist, 'dvision-single.html'), single);
const kb = (Buffer.byteLength(single) / 1024 / 1024).toFixed(2);
console.log(`dist/dvision-single.html ${kb} MB`);
