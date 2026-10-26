// Responsive images, generated before dev and build (the job next/image does at request time).
//
// For every photo and logo under public/assets/img/ (JPEG, PNG or WebP) this writes AVIF and WebP
// copies at the widths a screen might ask for (never wider than the source) to public/assets/opt/, and a manifest,
// src/generated/images.json, that <Img> (src/components/Img.tsx) turns into srcset/sizes, intrinsic
// width/height and a placeholder. File names carry a hash of the source, so they can be cached
// forever and a replaced photo gets new URLs.
//
// Encoding is slow, so results are kept in node_modules/.cache/dv-img (Vercel keeps that between
// builds) and only new or changed sources are encoded. Run by hand with `pnpm images`.
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'public/assets/img');
const OUT = path.join(root, 'public/assets/opt');
const CACHE = path.join(root, 'node_modules/.cache/dv-img');
const MANIFEST = path.join(root, 'src/generated/images.json');

/** widths offered to srcset; a source narrower than one of these also gets its own width */
const WIDTHS = [480, 828, 1200, 1600, 2048];
const FORMATS = { avif: { quality: 52, effort: 4 }, webp: { quality: 76, effort: 4 } };
/** app screens are small type on flat colour, which AVIF at photo quality smears: WebP only, near lossless */
const SCREENS = /^qacflow\//;
const SCREEN_FORMATS = { webp: { quality: 90, smartSubsample: true, effort: 5 } };
/** ...and one width more, so the monitor (1200px at most) stays sharp on a 2× screen */
const SCREEN_WIDTHS = [...WIDTHS, 2400];
/** tab icons and the like are not shown through <img> */
const SKIP = /^(favicon|apple-touch-icon)/;
/** below this the original is already as small as AVIF gets (icons, small logos): no copies */
const TINY = 4096;
const PARALLEL = 4;

const walk = async (dir, acc = []) => {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc); else acc.push(p);
  }
  return acc;
};
const exists = p => fs.access(p).then(() => true, () => false);
const t0 = Date.now();

const files = (await walk(SRC)).filter(f => /\.(jpe?g|png|webp)$/i.test(f) && !SKIP.test(path.basename(f))).sort();
const manifest = {};
const wanted = new Set();
let encoded = 0;

async function one(file) {
  const rel = path.relative(SRC, file).split(path.sep).join('/');        // hero/banner-01.jpg
  const buf = await fs.readFile(file);
  const hash = createHash('sha1').update(buf).digest('hex').slice(0, 8);
  const img = sharp(buf);
  const { width: w, height: h } = await img.metadata();
  const { isOpaque, dominant } = await img.stats();
  const screen = SCREENS.test(rel);
  const ladder = screen ? SCREEN_WIDTHS : WIDTHS, formats = screen ? SCREEN_FORMATS : FORMATS;
  const widths = buf.length < TINY ? [] : [...new Set([...ladder.filter(x => x < w), Math.min(w, ladder.at(-1))])];
  const stem = rel.replace(/\.[^.]+$/, '');
  for (const width of widths) {
    for (const [fmt, opts] of Object.entries(formats)) {
      const name = `${stem}.${hash}-${width}.${fmt}`;
      wanted.add(name);
      const cached = path.join(CACHE, name), out = path.join(OUT, name);
      if (!(await exists(cached))) {
        await fs.mkdir(path.dirname(cached), { recursive: true });
        await sharp(buf).resize({ width, withoutEnlargement: true })[fmt](opts).toFile(cached);
        encoded++;
      }
      if (!(await exists(out))) { await fs.mkdir(path.dirname(out), { recursive: true }); await fs.copyFile(cached, out); }
    }
  }
  const entry = { w, h, v: hash, ws: widths };   // ws empty: the original is served as is
  if (formats !== FORMATS) entry.f = Object.keys(formats);   // the copies' formats, when not AVIF + WebP
  // opaque pictures get a placeholder: the average colour, and for photos big enough to be seen
  // loading, a 16px blurred preview
  if (isOpaque) {
    entry.c = '#' + [dominant.r, dominant.g, dominant.b].map(n => n.toString(16).padStart(2, '0')).join('');
    if (w >= 800) entry.b = 'data:image/webp;base64,' + (await sharp(buf).resize(16).webp({ quality: 40 }).toBuffer()).toString('base64');
  }
  manifest['assets/img/' + rel] = entry;
}

for (let i = 0; i < files.length; i += PARALLEL) await Promise.all(files.slice(i, i + PARALLEL).map(one));

// drop copies of sources that were replaced or deleted
let removed = 0;
for (const f of (await exists(OUT)) ? await walk(OUT) : []) {
  if (!wanted.has(path.relative(OUT, f).split(path.sep).join('/'))) { await fs.rm(f); removed++; }
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
const json = JSON.stringify(sorted);
await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
if ((await fs.readFile(MANIFEST, 'utf8').catch(() => '')) !== json) await fs.writeFile(MANIFEST, json);
console.log(`images: ${files.length} sources, ${wanted.size} variants (${encoded} encoded, ${removed} removed), manifest ${(json.length / 1024).toFixed(1)} KB, ${((Date.now() - t0) / 1000).toFixed(1)}s`);
