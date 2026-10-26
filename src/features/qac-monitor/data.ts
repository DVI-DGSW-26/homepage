// The floor monitor's sample data, shaped like the deployment's (not a live feed): nine lines with
// their self- and patrol-inspection slots, the inspections in progress, today's defects and the
// actions taken on them. Names come as [ko, en] pairs (useTr picks one).
import type { Tr } from './tr';

export type Self = 'done' | 'ok' | 'run' | 'miss' | 'skip' | 'idle';
export type Patrol = 'done' | 'run' | 'queue' | 'reject' | 'none';
/** a self-inspection slot: its state, whether it is past its time, and a note (why it was skipped) */
export type SelfSlot = readonly [Self, late?: boolean, note?: Tr];
/** a patrol slot: its state and the inspector (an index into PATROL) */
export type PatrolSlot = readonly [Patrol, by?: number];

/** a measured item: nominal and its tolerance (±up, or +up/−lo); no nominal is an OK/NG judgement */
export type Item = { name: Tr; nom?: number; up?: number; lo?: number };
export type Value = number | 'ok' | 'ng';

export type Line = {
  no: number; product: Tr; operator: Tr;
  self: SelfSlot[]; patrol: PatrolSlot[];
  /** the next deadline [slot, minutes left], or minutes overdue */
  due?: readonly [string, number]; late?: number;
  /** the inspection in progress: stage (initial, mid, final), minutes since its last update, the
   * verdict on its looks, and the values measured so far */
  stage: 0 | 1 | 2; ago: number; visual?: 'ok' | 'ng'; items: Item[]; values: Value[];
};

export const SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00'];
/** the patrol inspectors */
export const PATROL: Tr[] = [['한서준', 'Han Seo-jun'], ['오지현', 'Oh Ji-hyun'], ['최현우', 'Choi Hyun-woo'], ['문가영', 'Moon Ga-young']];

const it = (ko: string, en: string, nom?: number, up?: number, lo = up): Item => ({ name: [ko, en], nom, up, lo });
const VISUAL = it('외관 상태', 'Visual Check');

export const LINES: Line[] = [
  {
    no: 1, product: ['브라켓 A-2201', 'Bracket A-2201'], operator: ['김철수', 'Kim Cheol-su'],
    self: [['done'], ['done'], ['run'], ['idle'], ['idle']], patrol: [['done', 0], ['done', 0], ['none'], ['none'], ['none']], due: ['12:00', 66],
    stage: 0, ago: 2, visual: 'ok',
    items: [it('전장', 'Overall Length', 10, .1), it('폭', 'Width', 48, .1, .2), it('내경', 'Inner Diameter', 25, .05), it('두께', 'Thickness', 3.45, .05), it('높이', 'Height', 62, .2), it('홀 피치', 'Hole Pitch', 18.5, .1), it('버 제거 상태', 'Burr Removal'), it('모따기', 'Chamfer', 1.2, .1), it('단차', 'Step Height', 4.8, .08), it('평행도', 'Parallelism', .05, .02)],
    values: [10.42, 47.96, 25.01, 3.44]
  },
  {
    no: 2, product: ['리테이너 링 R-12', 'Retainer Ring R-12'], operator: ['최지훈', 'Choi Ji-hoon'],
    self: [['done'], ['done'], ['done'], ['miss'], ['idle']], patrol: [['reject', 2], ['done', 1], ['queue'], ['none'], ['none']], due: ['16:00', 306],
    stage: 0, ago: 1,
    items: [it('외경', 'Outer Diameter', 32, .05), it('내경', 'Inner Diameter', 24, .05), it('두께', 'Thickness', 1.6, .03), it('갭', 'Gap', 2.5, .1), it('평면도', 'Flatness', .04, .02), VISUAL],
    values: [32.01, 23.98]
  },
  {
    no: 3, product: ['하우징 커버 HX-9', 'Housing Cover HX-9'], operator: ['이영희', 'Lee Young-hee'],
    self: [['done'], ['run', true], ['idle'], ['idle'], ['idle']], patrol: [['done', 1], ['none'], ['none'], ['none'], ['none']], late: 114,
    stage: 1, ago: 7, visual: 'ok',
    items: [it('전장', 'Length', 120, .2), it('폭', 'Width', 80, .15), it('높이', 'Height', 35, .1), it('보스 경', 'Boss Diameter', 8, .05), it('탭 상태', 'Thread Check'), it('벽 두께', 'Wall Thickness', 2.5, .1), it('평면도', 'Flatness', .1, .05)],
    values: [120.05, 79.93, 35.02]
  },
  {
    no: 4, product: ['가이드 바 G-8', 'Guide Bar G-8'], operator: ['윤서아', 'Yoon Seo-a'],
    self: [['done'], ['run', true], ['idle'], ['idle'], ['idle']], patrol: [['queue'], ['none'], ['none'], ['none'], ['none']], late: 114,
    stage: 2, ago: 11, visual: 'ok',
    items: [it('전장', 'Length', 300, .3), it('폭', 'Width', 25, .05), it('두께', 'Thickness', 8, .05), it('진직도', 'Straightness', .1, .05), VISUAL, it('홀 피치', 'Hole Pitch', 50, .1)],
    values: [300.12, 25.02, 8.01, .12, 'ok']
  },
  {
    no: 5, product: ['샤프트 B-77', 'Shaft B-77'], operator: ['박민수', 'Park Min-soo'],
    self: [['done'], ['skip', false, ['금형 교체로 라인 정지', 'Line stopped for a die change']], ['done'], ['run'], ['idle']], patrol: [['done', 3], ['none'], ['done', 1], ['none'], ['none']], due: ['14:00', 186],
    stage: 2, ago: 15, visual: 'ok',
    items: [it('전장', 'Length', 150, .1), it('외경 A', 'Diameter A', 20, .02), it('외경 B', 'Diameter B', 16, .02), it('키홈 폭', 'Keyway Width', 5, .03), it('표면 상태', 'Surface Check'), it('모따기', 'Chamfer', .5, .1)],
    values: [150.03, 20.01, 15.99, 5.02, 'ok']
  },
  {
    no: 6, product: ['베어링 캡 BC-2', 'Bearing Cap BC-2'], operator: ['임태경', 'Lim Tae-kyung'],
    self: [['done'], ['run', true], ['idle'], ['idle'], ['idle']], patrol: [['done', 1], ['none'], ['none'], ['none'], ['none']], late: 114,
    stage: 0, ago: 33,
    items: [it('내경', 'Bore', 47, .025), it('외경', 'Outer Diameter', 72, .05), it('높이', 'Height', 62, .2), it('볼트 홀', 'Bolt Hole', 9, .1), VISUAL],
    values: [47.01, 72.03]
  },
  {
    no: 7, product: ['커넥터 하우징 C-3', 'Connector Housing C-3'], operator: ['정수민', 'Jung Su-min'],
    self: [['done'], ['done'], ['run'], ['idle'], ['idle']], patrol: [['done', 1], ['queue'], ['none'], ['none'], ['none']], due: ['12:00', 66],
    stage: 2, ago: 23, visual: 'ok',
    items: [it('전장', 'Length', 42, .1), it('폭', 'Width', 18, .08), it('두께', 'Thickness', 3.45, .05), it('핀 홀 경', 'Pin Hole Diameter', 1.2, .03), VISUAL, it('래치 높이', 'Latch Height', 6.4, .1)],
    values: [42.02, 18.03, 3.47, 1.21, 'ok']
  },
  {
    no: 8, product: ['스페이서 S-5', 'Spacer S-5'], operator: ['노하늘', 'Noh Ha-neul'],
    self: [['run', true], ['idle', true], ['idle'], ['idle'], ['idle']], patrol: [], late: 174,
    stage: 1, ago: 6,
    items: [it('외경', 'Outer Diameter', 12, .05), it('내경', 'Inner Diameter', 6.2, .05), it('두께', 'Thickness', 5, .03), it('모따기', 'Chamfer', 1.2, .1)],
    values: [12.01]
  },
  {
    no: 9, product: ['플랜지 C-40', 'Flange C-40'], operator: ['강도현', 'Kang Do-hyun'],
    self: [['ok'], ['run', true], ['idle'], ['idle'], ['idle']], patrol: [['queue'], ['run', 1], ['none'], ['none'], ['none']], late: 114,
    stage: 1, ago: 4,
    items: [it('외경', 'Outer Diameter', 140, .2), it('볼트 홀 피치', 'Bolt Circle', 110, .1), it('두께', 'Thickness', 12, .1), it('보어', 'Bore', 60, .05), it('평면도', 'Flatness', .05, .02)],
    values: [139.94, 110.04]
  }
];
/** the in-progress list, in the order the floor sees it (most recently updated first): indexes into LINES */
export const QUEUE = [0, 2, 4, 1, 6, 8, 3, 5, 7];

export type DefectKind = 'spec' | 'visual' | 'judge';
export const KINDS: DefectKind[] = ['spec', 'visual', 'judge'];
/** a defect: line (index into LINES), slot or stage, kind, item, and for an out-of-spec value [measured, lower, upper] */
export type Defect = { line: number; slot: string | number; kind: DefectKind; item?: Tr; at: string; ago: number; value?: readonly [number, number, number] };
/** today's defects, newest first */
export const DEFECTS: Defect[] = [
  { line: 1, slot: '14:00', kind: 'spec', item: ['두께', 'Thickness'], value: [1.65, 1.57, 1.63], at: '10:12', ago: 6 },
  { line: 4, slot: '12:00', kind: 'spec', item: ['외경 A', 'Diameter A'], value: [20.03, 19.98, 20.02], at: '10:05', ago: 13 },
  { line: 3, slot: '10:00', kind: 'judge', item: ['외관 상태', 'Visual Check'], at: '09:58', ago: 20 },
  { line: 1, slot: '12:00', kind: 'visual', at: '09:51', ago: 27 },
  { line: 7, slot: '08:00', kind: 'spec', item: ['두께', 'Thickness'], value: [5.04, 4.97, 5.03], at: '09:44', ago: 34 },
  { line: 6, slot: '12:00', kind: 'spec', item: ['두께', 'Thickness'], value: [3.51, 3.4, 3.5], at: '09:37', ago: 41 },
  { line: 8, slot: 1, kind: 'spec', item: ['폭', 'Width'], value: [48.2, 47.8, 48.1], at: '09:26', ago: 52 },
  { line: 3, slot: '08:00', kind: 'visual', at: '09:15', ago: 63 },
  { line: 5, slot: '10:00', kind: 'spec', item: ['높이', 'Height'], value: [61.55, 61.8, 62.2], at: '09:03', ago: 75 },
  { line: 0, slot: '10:00', kind: 'judge', item: ['버 제거 상태', 'Burr Removal'], at: '08:50', ago: 88 },
  { line: 7, slot: 0, kind: 'spec', item: ['모따기', 'Chamfer'], value: [1.34, 1.1, 1.3], at: '08:42', ago: 96 },
  { line: 2, slot: 0, kind: 'spec', item: ['홀 피치', 'Hole Pitch'], value: [18.31, 18.4, 18.6], at: '08:28', ago: 110 },
  { line: 6, slot: '08:00', kind: 'visual', at: '08:07', ago: 131 }
];

/** an action taken: early stop or left incomplete, on which line (index into LINES), why, and where it stands */
export type Action = { kind: 'stop' | 'open'; line: number; hours: number; why: Tr; state: 'report' | 'wait' | 'ok' };
export const ACTIONS: Action[] = [
  { kind: 'stop', line: 1, hours: 2, why: ['소재 이물', 'Material contamination'], state: 'report' },
  { kind: 'open', line: 1, hours: 2, why: ['압출 1호기 모터 고장으로 측정 불가', 'Cannot measure: motor failure on Extrusion Line 1'], state: 'wait' },
  { kind: 'stop', line: 3, hours: 3, why: ['설비 이상 — 스핀들 진동', 'Equipment fault — spindle vibration'], state: 'report' },
  { kind: 'open', line: 4, hours: 4, why: ['금형 교체로 라인 정지', 'Line stopped for a die change'], state: 'ok' },
  { kind: 'stop', line: 7, hours: 5, why: ['치수 이탈 3회 연속', 'Out of spec three times in a row'], state: 'report' },
  { kind: 'open', line: 8, hours: 6, why: ['측정기 교정 중', 'Gauge being calibrated'], state: 'ok' }
];

// ---- figures derived from the sample, counted once (it never changes) ----
const SELF_ALL = LINES.flatMap(l => l.self), PATROL_ALL = LINES.flatMap(l => l.patrol);
const nSelf = (s: Self) => SELF_ALL.filter(x => x[0] === s).length;
const nPatrol = (s: Patrol) => PATROL_ALL.filter(x => x[0] === s).length;
/** self-inspection slots completed, in progress, skipped, remaining */
export const SELF_COUNTS = [nSelf('done') + nSelf('ok'), nSelf('run'), nSelf('skip'), nSelf('idle')];
/** self-inspection slots past their time */
export const LATE = SELF_ALL.filter(x => x[1]).length;
/** the patrol queue: drafting, awaiting, rejected */
export const QUEUED = [nPatrol('run'), nPatrol('queue'), nPatrol('reject')];
export const BY_KIND = Object.fromEntries(KINDS.map(k => [k, DEFECTS.filter(d => d.kind === k).length])) as Record<DefectKind, number>;
export const STOPPED = ACTIONS.filter(a => a.kind === 'stop').length;
/** the day's inspections: run, completed (and the share), with a defect (and the defect rate) */
export const TODAY = { run: 46, done: 28, donePct: 61, ng: 8, ngRate: '17.4' };

/** a value's verdict: a judgement as given, a measurement against its limits (none until measured) */
export const verdictOf = (v: Value | undefined, x: Item) =>
  v == null ? null : typeof v === 'string' ? v : v > x.nom! + x.up! + 1e-9 || v < x.nom! - x.lo! - 1e-9 ? 'ng' : 'ok';
/** decimals to show a value in: as many as it or its spec has */
export const digits = (x: Item, v: number) => Math.max(...[v, x.nom!, x.up!, x.lo!].map(n => (String(n).split('.')[1] ?? '').length));
/** an item's spec as the floor writes it: 10 ±0.1, 48 +0.1/-0.2, or none for an OK/NG judgement */
export const specOf = (x: Item) => x.nom == null ? null : x.up === x.lo ? `${x.nom} ±${x.up}` : `${x.nom} +${x.up}/-${x.lo}`;
