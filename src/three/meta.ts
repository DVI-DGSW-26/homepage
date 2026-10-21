// What the page needs to know about the WebGL scenes without loading three.js: the hero parts' HUD
// labels and the profile lab's arithmetic. The scenes themselves (hero.ts, extrusion.ts, parts.ts)
// are loaded on demand, so three.js stays out of the bundle the page starts with.

/** the hero's parts, in beat order (their geometry is in parts.ts) */
export const PART_LABELS = [
  { id: 'rotor', en: 'Brake Disc Hat', ko: '제동장치', koEn: 'Brake', proc: '압출 / CNC / T6', procEn: 'Extrusion / CNC / T6' },
  { id: 'ujoint', en: 'U-Joint Yoke', ko: '조향장치', koEn: 'Steering', proc: '단조재 CNC', procEn: 'Forged stock, CNC' },
  { id: 'profile', en: 'Multi-hollow Profile', ko: '압출 프로파일', koEn: 'Extruded profile', proc: '압출 / T6 / 절단', procEn: 'Extrusion / T6 / cutting' },
  { id: 'collar', en: 'Grooved Collar', ko: '조향장치', koEn: 'Steering', proc: '압출 / CNC 선반', procEn: 'Extrusion / CNC lathe' },
  { id: 'inner-pipe', en: 'Inner Pipe', ko: '방진장치', koEn: 'Anti-vibration', proc: '압출 / 절단 / 디버링', procEn: 'Extrusion / cutting / deburring' },
  { id: 'sleeve-bush', en: 'Sleeve Bush', ko: '조향장치', koEn: 'Steering', proc: '압출 / CNC 선반', procEn: 'Extrusion / CNC lathe' }
] as const;
export type PartLabel = (typeof PART_LABELS)[number];

// Run-out readout in metres. REST is what the bar measures before the section is scrolled —
// 6.2 m, a standard aluminium stock length — and it runs out to MAX as the press pushes.
export const REST_LEN = 6.2;
export const MAX_LEN = 42;

export interface ProfileParams { w: number; h: number; cells: number; wall: number }
export interface ProfileMetrics { area: number; kgPerM: number; ccd: number; press: { inch: number; ton: number }; cw: number; ch: number }

export function metricsFor({ w, h, cells, wall }: ProfileParams): ProfileMetrics {
  const cw = (w - wall * (cells + 1)) / cells, ch = h - 2 * wall;
  const area = Math.max(0, w * h - cells * Math.max(0, cw) * Math.max(0, ch)); // mm²
  const kgPerM = area * 1000 * 2.7e-6; // AL density 2.7 g/cm³
  const ccd = Math.sqrt(w * w + h * h);
  const press = ccd <= 120 ? { inch: 6, ton: 1450 } : { inch: 10, ton: 3500 };
  return { area, kgPerM, ccd, press, cw, ch };
}
