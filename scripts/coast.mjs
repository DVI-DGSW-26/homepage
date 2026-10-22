// Writes src/canvas/coast.json: the coastlines the Global map draws, cut out of Natural Earth's 1:50m
// land (world-atlas) once, ahead of time, so the page ships a small file and no map library.
//
// The map is a Pacific-centred Mercator, 112°E to 72°W, the same window src/canvas/map.ts draws in.
// Coordinates come out in width units (x 0–1 across, y 0–0.5 down for the 2:1 canvas), simplified to
// about half a pixel at 1500px wide, as integers ×10000. Re-run with `pnpm coast` if the window changes.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const topo = JSON.parse(await fs.readFile(path.join(root, 'node_modules/world-atlas/land-50m.json'), 'utf8'));
const land = feature(topo, topo.objects.land);

// keep in step with src/canvas/map.ts
const LON0 = -68, LON1 = 108;           // longitudes counted from 180° (112°E … 72°W)
const LAT0 = 0;                          // the bottom edge; the top follows from the 2:1 canvas
const SPAN = (LON1 - LON0) * Math.PI / 180;
const merc = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
const s = 1 / SPAN;                      // one width unit = the whole longitude span
const yTop = merc(LAT0) + SPAN / 2;      // so the window is exactly half as tall as it is wide

const projection = geoMercator()
  .rotate([-(180 + (LON0 + LON1) / 2), 0])    // centre on 180° + 20° = 160°W
  .scale(s).translate([0.5, s * yTop * 1])    // x: 0–1; y: 0 at the top edge
  .clipExtent([[0, 0], [1, 0.5]]);

// collect the projected, clipped rings
const rings = []; let cur = null;
geoPath(projection, {
  moveTo(x, y) { cur = [[x, y]]; rings.push(cur); },
  lineTo(x, y) { cur.push([x, y]); },
  closePath() {}, beginPath() {}, arc() {}
})(land);

// Douglas–Peucker
const TOL = 0.0003;
const simplify = pts => {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
    let max = 0, idx = -1;
    for (let i = a + 1; i < b; i++) {
      // distance to the chord; a closed ring starts and ends on the same point, so there it is the distance to that point
      const d = len ? Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len : Math.hypot(pts[i][0] - ax, pts[i][1] - ay);
      if (d > max) { max = d; idx = i; }
    }
    if (max > TOL) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
};

const out = rings.map(simplify).filter(r => r.length >= 3)
  // drop specks smaller than a couple of pixels
  .filter(r => { let x0 = 1, x1 = 0, y0 = 1, y1 = 0; for (const [x, y] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } return (x1 - x0) + (y1 - y0) > 0.0015; })
  .map(r => r.flatMap(([x, y]) => [Math.round(x * 10000), Math.round(y * 10000)]));

const json = JSON.stringify({ lat0: LAT0, rings: out });
await fs.writeFile(path.join(root, 'src/canvas/coast.json'), json + '\n');
console.log(`coast: ${out.length} rings, ${out.reduce((n, r) => n + r.length / 2, 0)} points, ${(json.length / 1024).toFixed(1)} KB`);
