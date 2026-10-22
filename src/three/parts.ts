// Procedural stand-ins for DVISION parts (until real CAD/GLTF is available).
// Each factory returns a geometry normalised to a ~1.25 unit bounding sphere so the
// point cloud morphs between them at a constant scale.
import * as THREE from 'three';
import { PART_LABELS, type PartLabel } from './meta';
import { mergeGeometries, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

type Pt = [number, number];
const V2 = (arr: Pt[]) => arr.map(([x, y]) => new THREE.Vector2(x, y));
// LatheGeometry faces outward only for a counter-clockwise profile (x right, y up); a clockwise one
// comes out inside-out, so it is turned around here
const ccw = (pts: Pt[]) => pts.reduce((a, [x, y], i) => { const [nx, ny] = pts[(i + 1) % pts.length]; return a + x * ny - nx * y; }, 0) >= 0;
const lathe = (pts: Pt[], seg = 72) => new THREE.LatheGeometry(V2(ccw(pts) ? pts : [...pts].reverse()), seg);
/** an n-gon hole: straight segments, so it doesn't take the outline's curveSegments */
const hole = (x: number, y: number, r: number, n = 16) => new THREE.Path(Array.from({ length: n + 1 }, (_, i) => new THREE.Vector2(x + r * Math.cos((-i / n) * Math.PI * 2), y + r * Math.sin((-i / n) * Math.PI * 2))));
/**
 * A flat ring lying in the XZ plane, spanning y..y+t, with round holes ([x, z, r]) punched through
 * and its edges lightly chamfered.
 */
const ring = (rIn: number, rOut: number, y: number, t: number, holes: [number, number, number][] = [], seg = 96) => {
  const s = new THREE.Shape(); s.absarc(0, 0, rOut, 0, Math.PI * 2, false);
  const bore = new THREE.Path(); bore.absarc(0, 0, rIn, 0, Math.PI * 2, true); s.holes.push(bore);
  for (const [x, z, r] of holes) s.holes.push(hole(x, z, r));
  const b = 0.01;
  const g = new THREE.ExtrudeGeometry(s, { depth: t - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 1, curveSegments: seg });
  g.rotateX(Math.PI / 2); g.translate(0, y + t - b, 0);
  return g;
};
const nonIndexed = (list: THREE.BufferGeometry[]) => list.map(g => (g.index ? g.toNonIndexed() : g));
const merge = (list: THREE.BufferGeometry[]) => mergeGeometries(nonIndexed(list), false);
const rr = (p: THREE.Path, x: number, y: number, w: number, h: number, r: number) => {
  r = Math.min(r, w / 2, h / 2);
  p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r);
  p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r);
  p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y);
};

function normalize(geo: THREE.BufferGeometry, radius = 1.25) {
  geo.computeBoundingSphere();
  const s = radius / geo.boundingSphere!.radius;
  geo.center();
  geo.scale(s, s, s);
  // smooth across the facets of a curved surface, keep the edges of chamfers, bores and flats sharp
  const out = toCreasedNormals(geo, Math.PI / 6);
  geo.dispose();
  return out;
}

// 01 ventilated brake disc with hat: two cross-drilled ring plates, radial vanes, a stepped hat
// with five lug holes and a centre bore
export function brakeRotor() {
  const outer = 1.85, inner = 1.05, t = 0.09, gap = 0.24, VANES = 30;
  // the drilling sits between the vanes, staggered over three radii
  const drill: [number, number, number][] = Array.from({ length: VANES }, (_, i) => {
    const a = ((i + 0.5) / VANES) * Math.PI * 2, r = [1.3, 1.5, 1.7][i % 3];
    return [r * Math.cos(a), r * Math.sin(a), 0.045];
  });
  const parts: THREE.BufferGeometry[] = [ring(inner, outer, -gap / 2 - t, t, drill), ring(inner, outer, gap / 2, t, drill)];
  for (let i = 0; i < VANES; i++) {
    const v = new THREE.BoxGeometry(outer - inner - 0.1, gap, 0.06);
    v.translate((outer + inner) / 2, 0, 0); v.rotateY(-(i / VANES) * Math.PI * 2);
    parts.push(v);
  }
  // hat: the wall with its chamfered top edge and the flange that meets the inner plate...
  parts.push(lathe([[0.92, -0.02], [inner + 0.02, -0.02], [inner + 0.02, 0.12], [1.04, 0.12], [1.04, 0.6], [0.98, 0.66], [0.92, 0.66], [0.92, -0.02]]));
  // ...and its face, with the lug holes through it
  const lugs: [number, number, number][] = Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2; return [0.7 * Math.cos(a), 0.7 * Math.sin(a), 0.075]; });
  parts.push(ring(0.4, 0.98, 0.54, 0.12, lugs, 72));
  const g = merge(parts); g.rotateX(0.55); g.rotateZ(-0.35);
  return normalize(g);
}

// 02 universal-joint yoke: a turned, hollow shank with a circlip groove, two eared arms with real
// bores, a rounded bridge, the cross pin and its bearing caps
export function ujointYoke() {
  const body = lathe([[0.3, -1.66], [0.54, -1.66], [0.58, -1.62], [0.58, -1.2], [0.55, -1.17], [0.55, -1.11], [0.58, -1.08], [0.58, -0.8], [0.5, -0.62], [0.5, -0.45], [0.3, -0.45], [0.3, -1.66]], 64);
  const ear = new THREE.Shape();
  ear.moveTo(-0.44, -0.2); ear.lineTo(0.44, -0.2); ear.lineTo(0.44, 0.85); ear.absarc(0, 0.85, 0.44, 0, Math.PI, false); ear.lineTo(-0.44, -0.2);
  const bore = new THREE.Path(); bore.absarc(0, 0.85, 0.2, 0, Math.PI * 2, true); ear.holes.push(bore);
  const earGeo = () => new THREE.ExtrudeGeometry(ear, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 3, curveSegments: 36 });
  const earL = earGeo(); earL.rotateY(Math.PI / 2); earL.translate(-0.62, 0, 0);
  const earR = earGeo(); earR.rotateY(Math.PI / 2); earR.translate(0.62 - 0.2, 0, 0);
  const bridge = new RoundedBoxGeometry(1.24, 0.34, 0.92, 2, 0.06); bridge.translate(0, -0.3, 0);
  const pin = new THREE.CylinderGeometry(0.17, 0.17, 1.4, 32); pin.rotateZ(Math.PI / 2); pin.translate(0, 0.85, 0);
  const pin2 = new THREE.CylinderGeometry(0.16, 0.16, 1.0, 32); pin2.rotateX(Math.PI / 2); pin2.translate(0, 0.85, 0);
  // bearing cup seated against the outside of each ear: chamfered rim, a grease nipple facing out
  const cap = (side: -1 | 1) => {
    const c = lathe([[0, -0.06], [0.21, -0.06], [0.24, -0.03], [0.24, 0.04], [0.22, 0.06], [0.07, 0.06], [0.07, 0.1], [0, 0.1]], 36);
    c.rotateZ(-side * Math.PI / 2); c.translate(side * 0.7, 0.85, 0);
    return c;
  };
  const g = merge([body, earL, earR, bridge, pin, pin2, cap(-1), cap(1)]); g.rotateZ(0.25); g.rotateY(0.5);
  return normalize(g);
}

// 03 a cut length of the company's multi-hollow extrusion profile, with a screw port where each
// inner web meets the outer wall
export function profileChunk() {
  const W = 3.2, H = 1.5, T = 0.16, cells = 3;
  const shape = new THREE.Shape(); rr(shape, -W / 2, -H / 2, W, H, 0.2);
  const cw = (W - T * (cells + 1)) / cells, ch = H - 2 * T;
  for (let i = 0; i < cells; i++) { const h = new THREE.Path(); rr(h, -W / 2 + T + i * (cw + T), -H / 2 + T, cw, ch, 0.1); shape.holes.push(h); }
  for (let i = 1; i < cells; i++) for (const y of [-H / 2 + T / 2, H / 2 - T / 2]) shape.holes.push(hole(-W / 2 + T / 2 + i * (cw + T), y, 0.05, 12));
  const g = new THREE.ExtrudeGeometry(shape, { depth: 2.6, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 2, curveSegments: 10 });
  g.translate(0, 0, -1.3); g.rotateY(0.95); g.rotateX(0.32);
  return normalize(g);
}

// 04 grooved collar: lathe with four O-ring grooves under a chamfered hex flange, bored through
export function groovedCollar() {
  const pts: Pt[] = [[0.55, -1.0], [0.88, -1.0], [0.92, -0.96]];
  let y = -1.0;
  for (let i = 0; i < 4; i++) { pts.push([0.92, y + 0.22], [0.8, y + 0.26], [0.8, y + 0.36], [0.92, y + 0.4]); y += 0.4; }
  pts.push([0.92, 0.72], [0.55, 0.72], [0.55, -1.0]);
  const body = lathe(pts, 72);
  const hexShape = new THREE.Shape(Array.from({ length: 7 }, (_, k) => new THREE.Vector2(1.38 * Math.cos((k / 6) * Math.PI * 2), 1.38 * Math.sin((k / 6) * Math.PI * 2))));
  const bore = new THREE.Path(); bore.absarc(0, 0, 0.55, 0, Math.PI * 2, true); hexShape.holes.push(bore);
  const hex = new THREE.ExtrudeGeometry(hexShape, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 72 });
  hex.rotateX(Math.PI / 2); hex.translate(0, 0.93, 0);
  const g = merge([body, hex]); g.rotateX(0.6); g.rotateZ(0.2);
  return normalize(g);
}

// 05 thin inner pipe with a flared lip
export function innerPipe() {
  return normalize(lathe([[0.43, -1.3], [0.5, -1.3], [0.5, 1.12], [0.64, 1.3], [0.56, 1.34], [0.43, 1.16], [0.43, -1.3]], 64));
}

// 06 sleeve bush
export function sleeveBush() {
  return normalize(lathe([[0.6, -0.7], [0.82, -0.7], [0.86, -0.66], [0.86, 0.66], [0.82, 0.7], [0.6, 0.7], [0.6, -0.7]], 64));
}

export type PartMeta = PartLabel & { make: () => THREE.BufferGeometry };

// the labels (three/meta.ts, read by the HUD) with the geometry each one is built from
const MAKERS: Record<PartLabel['id'], () => THREE.BufferGeometry> = {
  rotor: brakeRotor, ujoint: ujointYoke, profile: profileChunk, collar: groovedCollar, 'inner-pipe': innerPipe, 'sleeve-bush': sleeveBush
};
export const PART_META: PartMeta[] = PART_LABELS.map(l => ({ ...l, make: MAKERS[l.id] }));

export function makeParts(count = PART_META.length): (PartMeta & { geo: THREE.BufferGeometry })[] { return PART_META.slice(0, count).map(m => ({ ...m, geo: m.make() })); }
