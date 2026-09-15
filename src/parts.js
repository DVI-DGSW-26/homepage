// Procedural stand-ins for DVISION parts (until real CAD/GLTF is available).
// Each factory returns a geometry normalised to a ~1.25 unit bounding sphere so the
// point cloud morphs between them at a constant scale.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V2 = (arr) => arr.map(([x, y]) => new THREE.Vector2(x, y));
const lathe = (pts, seg = 72) => new THREE.LatheGeometry(V2(pts), seg);
const nonIndexed = (list) => list.map(g => (g.index ? g.toNonIndexed() : g));
const merge = (list) => mergeGeometries(nonIndexed(list), false);
const rr = (p, x, y, w, h, r) => {
  r = Math.min(r, w / 2, h / 2);
  p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r);
  p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r);
  p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y);
};

function normalize(geo, radius = 1.25) {
  geo.computeBoundingSphere();
  const s = radius / geo.boundingSphere.radius;
  geo.center();
  geo.scale(s, s, s);
  geo.computeVertexNormals();
  return geo;
}

// 01 ventilated brake disc with hat: two ring plates, radial vanes, stepped hub, five bolt bosses
export function brakeRotor() {
  const outer = 1.85, inner = 1.05, t = 0.09, gap = 0.24;
  const plate = (y) => lathe([[inner, y], [outer, y], [outer, y + t], [inner, y + t], [inner, y]], 96);
  const parts = [plate(-gap / 2 - t), plate(gap / 2)];
  for (let i = 0; i < 30; i++) {
    const v = new THREE.BoxGeometry(outer - inner - 0.1, gap, 0.06);
    v.translate((outer + inner) / 2, 0, 0); v.rotateY((i / 30) * Math.PI * 2 + (i % 2) * 0.04);
    parts.push(v);
  }
  parts.push(lathe([[0.4, 0.66], [0.98, 0.66], [1.04, 0.6], [1.04, 0.12], [inner + 0.02, 0.12], [inner + 0.02, -0.02], [0.92, -0.02], [0.92, 0.54], [0.4, 0.54], [0.4, 0.66]], 72));
  for (let i = 0; i < 5; i++) {
    const b = new THREE.CylinderGeometry(0.085, 0.085, 0.18, 18);
    b.translate(0.7, 0.72, 0); b.rotateY((i / 5) * Math.PI * 2);
    parts.push(b);
  }
  const g = merge(parts); g.rotateX(0.55); g.rotateZ(-0.35);
  return normalize(g);
}

// 02 universal-joint yoke: tapered body, two eared arms with real bores, cross pin
export function ujointYoke() {
  const body = new THREE.CylinderGeometry(0.5, 0.58, 1.3, 40); body.translate(0, -1.0, 0);
  const ear = new THREE.Shape();
  ear.moveTo(-0.44, -0.2); ear.lineTo(0.44, -0.2); ear.lineTo(0.44, 0.85); ear.absarc(0, 0.85, 0.44, 0, Math.PI, false); ear.lineTo(-0.44, -0.2);
  const bore = new THREE.Path(); bore.absarc(0, 0.85, 0.2, 0, Math.PI * 2, true); ear.holes.push(bore);
  const earGeo = () => new THREE.ExtrudeGeometry(ear, { depth: 0.24, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 28 });
  const earL = earGeo(); earL.rotateY(Math.PI / 2); earL.translate(-0.62, 0, 0);
  const earR = earGeo(); earR.rotateY(Math.PI / 2); earR.translate(0.62 - 0.24, 0, 0);
  const bridge = new THREE.BoxGeometry(1.24, 0.34, 0.92); bridge.translate(0, -0.3, 0);
  const pin = new THREE.CylinderGeometry(0.17, 0.17, 1.9, 24); pin.rotateZ(Math.PI / 2); pin.translate(0, 0.85, 0);
  const pin2 = new THREE.CylinderGeometry(0.16, 0.16, 1.0, 24); pin2.rotateX(Math.PI / 2); pin2.translate(0, 0.85, 0);
  const capL = new THREE.CylinderGeometry(0.24, 0.24, 0.12, 24); capL.rotateZ(Math.PI / 2); capL.translate(-0.99, 0.85, 0);
  const capR = capL.clone(); capR.translate(1.98, 0, 0);
  const g = merge([body, earL, earR, bridge, pin, pin2, capL, capR]); g.rotateZ(0.25); g.rotateY(0.5);
  return normalize(g);
}

// 03 a cut length of the company's multi-hollow extrusion profile
export function profileChunk() {
  const W = 3.2, H = 1.5, T = 0.16, cells = 3;
  const shape = new THREE.Shape(); rr(shape, -W / 2, -H / 2, W, H, 0.2);
  const cw = (W - T * (cells + 1)) / cells, ch = H - 2 * T;
  for (let i = 0; i < cells; i++) { const h = new THREE.Path(); rr(h, -W / 2 + T + i * (cw + T), -H / 2 + T, cw, ch, 0.1); shape.holes.push(h); }
  const g = new THREE.ExtrudeGeometry(shape, { depth: 2.6, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 1, curveSegments: 8 });
  g.translate(0, 0, -1.3); g.rotateY(0.95); g.rotateX(0.32);
  return normalize(g);
}

// 04 grooved collar: lathe with four O-ring grooves under a hex flange
export function groovedCollar() {
  const pts = [[0.55, -1.0], [0.92, -1.0]];
  let y = -1.0;
  for (let i = 0; i < 4; i++) { pts.push([0.92, y + 0.22], [0.8, y + 0.26], [0.8, y + 0.36], [0.92, y + 0.4]); y += 0.4; }
  pts.push([0.92, 0.72], [0.55, 0.72], [0.55, -1.0]);
  const ring = lathe(pts, 72);
  const hex = new THREE.CylinderGeometry(1.42, 1.42, 0.24, 6); hex.translate(0, 0.84, 0);
  const boreCap = lathe([[0.55, 0.96], [1.42, 0.96], [1.42, 0.97], [0.55, 0.97], [0.55, 0.96]], 6);
  const g = merge([ring, hex, boreCap]); g.rotateX(0.6); g.rotateZ(0.2);
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

export const PART_META = [
  { id: 'rotor', en: 'Brake Disc Hat', ko: '제동장치', proc: '압출 / CNC / T6', make: brakeRotor },
  { id: 'ujoint', en: 'U-Joint Yoke', ko: '조향장치', proc: '단조재 CNC', make: ujointYoke },
  { id: 'profile', en: 'Multi-hollow Profile', ko: '압출 프로파일', proc: '압출 / T6 / 절단', make: profileChunk },
  { id: 'collar', en: 'Grooved Collar', ko: '조향장치', proc: '압출 / CNC 선반', make: groovedCollar },
  { id: 'inner-pipe', en: 'Inner Pipe', ko: '방진장치', proc: '압출 / 절단 / 디버링', make: innerPipe },
  { id: 'sleeve-bush', en: 'Sleeve Bush', ko: '조향장치', proc: '압출 / CNC 선반', make: sleeveBush }
];

export function makeParts() { return PART_META.map(m => ({ ...m, geo: m.make() })); }
