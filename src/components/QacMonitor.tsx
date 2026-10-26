// The Q.A.C-Flow floor monitor, rebuilt in React for the live-monitoring block (QacFlow.tsx, Live):
// the three screens of the in-house app (status board, inspection details, quality · defects) as one
// app the visitor can work, switched from its own toolbar as on the floor.
//
//   status board      every line's self- and patrol-inspection slots; a line opens its inspection
//   inspection detail the in-progress inspections, each value against its tolerance band
//   quality · defects today's defects (filtered by type) and the actions taken on them
//
// It sits in the Studio Display (<Monitor>, Device.tsx), so it is drawn as a Mac app would be: the
// system colours and type, a translucent toolbar with a segmented control, tinted capsules over
// solid blocks, in the dark appearance on the dark page and the light one on the light page (the
// .qac-monitor palette, styles.css). The layout is the real app's.
//
// The data is a sample shaped like the deployment's, not a live feed. The app is drawn at the
// 1600 × 876 of the floor monitor and scaled to the screen it sits in.
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { setLang, useLang } from '../i18n';
import { cn } from './ui';

export const SCREENS = ['detail', 'board', 'defects'] as const;
export type MonitorScreen = (typeof SCREENS)[number];
/** the order of the app's own toolbar tabs */
const NAV: readonly MonitorScreen[] = ['board', 'detail', 'defects'];

/** the floor monitor's own size, in CSS px */
const W = 1600, H = 876;

const CARD = 'rounded-[14px] bg-(--m-card) shadow-(--m-shadow)';
/** a count beside a heading */
const COUNT = 'rounded-full bg-(--m-idle) px-2 py-px text-[12px] font-semibold text-(--m-fg2) tabular-nums tracking-[.01em]';
/** a tinted capsule; colour it with text-(--m-…) and bg-(--m-…)/15 */
const PILL = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[13px] font-semibold whitespace-nowrap tracking-[.01em]';

// ---- sample data --------------------------------------------------------------------------------

type Tr = readonly [ko: string, en: string];
type Self = 'done' | 'ok' | 'run' | 'miss' | 'skip' | 'idle';
type Patrol = 'done' | 'run' | 'queue' | 'reject' | 'none';
/** a self-inspection slot: its state, whether it is past its time, and a note (why it was skipped) */
type SelfSlot = readonly [Self, late?: boolean, note?: Tr];
type PatrolSlot = readonly [Patrol, by?: number];

const SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00'];
/** the patrol inspectors */
const PATROL: Tr[] = [['한서준', 'Han Seo-jun'], ['오지현', 'Oh Ji-hyun'], ['최현우', 'Choi Hyun-woo'], ['문가영', 'Moon Ga-young']];

type Item = { name: Tr; nom?: number; up?: number; lo?: number };
/** a measured item: nominal and its tolerance (±up, or +up/−lo); no nominal is an OK/NG judgement */
const it = (ko: string, en: string, nom?: number, up?: number, lo = up): Item => ({ name: [ko, en], nom, up, lo });
const VISUAL = it('외관 상태', 'Visual Check');

type Line = {
  no: number; product: Tr; operator: Tr;
  self: SelfSlot[]; patrol: PatrolSlot[];
  /** the next deadline [slot, minutes left], or minutes overdue */
  due?: readonly [string, number]; late?: number;
  /** the inspection in progress: stage (initial, mid, final), minutes since its last update, the
   * verdict on its looks, and the values measured so far ('ok' / 'ng' for a judgement) */
  stage: 0 | 1 | 2; ago: number; visual?: 'ok' | 'ng'; items: Item[]; values: (number | 'ok' | 'ng')[];
};

const LINES: Line[] = [
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
    self: [['done'], ['skip', false, ['금형 교체로 라인 정지', 'Die change']], ['done'], ['run'], ['idle']], patrol: [['done', 3], ['none'], ['done', 1], ['none'], ['none']], due: ['14:00', 186],
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
/** the in-progress list, in the order the floor sees it (most recently updated first) */
const QUEUE = [0, 2, 4, 1, 6, 8, 3, 5, 7];

type DefectKind = 'spec' | 'visual' | 'judge';
/** today's defects, newest first: line (index into LINES), slot or stage, kind, item, and for an out-of-spec value [measured, lower, upper] */
type Defect = { line: number; slot: string | number; kind: DefectKind; item?: Tr; at: string; ago: number; value?: readonly [number, number, number] };
const DEFECTS: Defect[] = [
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
const KINDS: DefectKind[] = ['spec', 'visual', 'judge'];

/** the actions taken: early stop or left incomplete, on which line, why, and where it stands */
type Action = { kind: 'stop' | 'open'; line: number; hours: number; why: Tr; state: 'report' | 'wait' | 'ok' };
const ACTIONS: Action[] = [
  { kind: 'stop', line: 1, hours: 2, why: ['소재 이물', 'Material contamination'], state: 'report' },
  { kind: 'open', line: 1, hours: 2, why: ['압출 1호기 모터 고장으로 측정 불가', 'Cannot measure: motor failure on Extrusion Line 1'], state: 'wait' },
  { kind: 'stop', line: 3, hours: 3, why: ['설비 이상 — 스핀들 진동', 'Equipment fault — spindle vibration'], state: 'report' },
  { kind: 'open', line: 4, hours: 4, why: ['금형 교체로 라인 정지', 'Line stopped for a die change'], state: 'ok' },
  { kind: 'stop', line: 7, hours: 5, why: ['치수 이탈 3회 연속', 'Out of spec three times in a row'], state: 'report' },
  { kind: 'open', line: 8, hours: 6, why: ['측정기 교정 중', 'Gauge being calibrated'], state: 'ok' }
];

// ---- copy ---------------------------------------------------------------------------------------

const dur = (m: number, en: boolean) => { const h = Math.floor(m / 60), r = m % 60; return en ? `${h ? `${h}h ` : ''}${r}m` : `${h ? `${h}시간 ` : ''}${r}분`; };
const COPY = {
  ko: {
    app: '검사 진행 현황', titles: { board: '현황판', detail: '검사 상세', defects: '품질·불량' }, date: '10월 2일 (금)',
    fixed: '고정', cycling: '순환', otherLang: 'EN', live: '실시간', updated: '마지막 변경',
    self: '자주', patrol: '순회', line: (n: number) => `${n}호기`,
    kpi: ['완료', '진행중', '건너뜀', '남은 시점', '지연'], over: ['칸', '시각 경과'],
    queue: '순회 대기', queueSub: ['작성중', '승인대기', '반려'],
    progress: '시점별 진행도', legendSelf: ['완료', '진행중', '건너뜀', '미완료', '미완료 승인', '미시작', '지연'], legendPatrol: ['완료', '작성중', '대기', '반려'],
    due: (t: string, m: number) => `${t}까지 ${dur(m, false)}`, late: (m: number) => `지연 ${dur(m, false)}`,
    dueToday: '오늘 마감 1줄', dueName: '배준호', dueLine: '10호기',
    inProgress: '진행중 검사', stages: ['초물', '중물', '종물'], ago: (m: number) => m >= 60 ? `${Math.floor(m / 60)}시간 전` : `${m}분 전`,
    running: '진행중', refreshed: (m: number) => `${m}분 전 갱신`, visual: '외관', defectItems: '불량 항목', measured: '측정 진행',
    items: '측정 항목', cols: ['No', '항목', '기준 · 공차', '측정값', '허용 범위', '판정'], judgeSpec: 'OK/NG 판정 항목', judgeHint: '작업자가 OK/NG를 고르는 항목', pending: '대기', auto: '자동',
    today: '오늘 검사', done: '검사 완료', cases: '불량 검사', stopped: '조기종료', unit: '건', risk: (r: string) => `불량률 ${r}% · 위험`, stopSub: '품질 문제로 중단',
    defectList: '불량 항목', all: '전체', includes: '결재 전 진행중 검사도 포함', kinds: { spec: '치수 이탈', visual: '외관 NG', judge: 'OK/NG' },
    valueLabel: '측정', specLabel: '허용', visualNg: '외관 판정에서 NG', judgeNg: 'OK/NG 항목에서 NG',
    types: '불량 유형', actions: '조치 현황', actionKinds: { stop: '조기종료', open: '미완료' }, states: { report: '보고서 발행 · 재검사 시작', wait: '결재 대기', ok: '승인 완료' }, hoursAgo: (h: number) => `${h}시간 전`
  },
  en: {
    app: 'Inspection Status', titles: { board: 'Dashboard', detail: 'Inspection Details', defects: 'Quality · Defects' }, date: 'Oct 2 (Fri)',
    fixed: 'Fixed', cycling: 'Cycling', otherLang: 'KO', live: 'Real-time', updated: 'Last updated',
    self: 'Self', patrol: 'Patrol', line: (n: number) => `Line ${n}`,
    kpi: ['Completed', 'In Progress', 'Skipped', 'Remaining Slots', 'Delayed'], over: ['slots', 'over time'],
    queue: 'Patrol Queue', queueSub: ['Drafting', 'Awaiting', 'Rejected'],
    progress: 'Progress by Time Slot', legendSelf: ['Completed', 'In Progress', 'Skipped', 'Incomplete', 'Incomplete Approved', 'Not Started', 'Late'], legendPatrol: ['Completed', 'Drafting', 'Queue', 'Rejected'],
    due: (t: string, m: number) => `${t} deadline ${dur(m, true)}`, late: (m: number) => `Delayed ${dur(m, true)}`,
    dueToday: '1 line due today', dueName: 'Bae Jun-ho', dueLine: 'Line 10',
    inProgress: 'In-Progress Inspections', stages: ['Initial', 'Mid', 'Final'], ago: (m: number) => m >= 60 ? `${Math.floor(m / 60)} hour${m >= 120 ? 's' : ''} ago` : `${m} min ago`,
    running: 'In Progress', refreshed: (m: number) => `Updated ${m} min ago`, visual: 'Visual', defectItems: 'Defect Items', measured: 'Measurement Progress',
    items: 'Measurement Items', cols: ['No', 'Item', 'Spec / Tolerance', 'Measured Value', 'Tolerance Range', 'Result'], judgeSpec: 'OK/NG judgement item', judgeHint: 'Operator selects OK/NG', pending: 'Pending', auto: 'Auto',
    today: "Today's Inspections", done: 'Completed', cases: 'Defect Cases', stopped: 'Early Stop', unit: 'cases', risk: (r: string) => `Defect Rate ${r}% · At Risk`, stopSub: 'Stopped for quality issues',
    defectList: 'Defect Items', all: 'All', includes: 'Includes in-progress inspections before approval', kinds: { spec: 'Out of Spec', visual: 'Visual NG', judge: 'OK/NG' },
    valueLabel: 'Measured', specLabel: 'Spec', visualNg: 'NG in visual inspection', judgeNg: 'NG in OK/NG item',
    types: 'Defect Types', actions: 'Action Status', actionKinds: { stop: 'Early Stop', open: 'Incomplete' }, states: { report: 'Report issued · Reinspection started', wait: 'Awaiting approval', ok: 'Approved' }, hoursAgo: (h: number) => `${h} hour${h > 1 ? 's' : ''} ago`
  }
};
type Copy = (typeof COPY)['ko'];

// ---- pieces -------------------------------------------------------------------------------------

const RING = 'M8 2a6 6 0 1 0 0 12A6 6 0 1 0 8 2z';
const GLYPHS = {
  check: 'M3 8.5l3 3 7-7', play: 'M5 3l8 5-8 5z', pause: 'M4 3h3v10H4zM9 3h3v10H9z', bang: 'M8 3v6M8 12v1',
  clock: `${RING}M8 5v3l2 1.5`, ban: `${RING}M4 12l8-8`, prev: 'M10 3L5 8l5 5', next: 'M6 3l5 5-5 5', warn: 'M8 1.5l7 12.5H1z',
  spec: 'M1.5 8h13M4.5 5L1.5 8l3 3M11.5 5l3 3-3 3', visual: `${RING}M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z`, judge: 'M4 4l8 8M12 4l-8 8',
  globe: `${RING}M2 8h12M8 2c2.2 2 2.2 10 0 12M8 2c-2.2 2-2.2 10 0 12`
};
const FILLED = new Set(['play', 'pause', 'warn']);
function G({ n, className }: { n: keyof typeof GLYPHS; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn('size-[1em] flex-none', FILLED.has(n) ? 'fill-current' : 'fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]', className)}>
      <path d={GLYPHS[n]} />
    </svg>
  );
}

/** a toolbar-style icon button: it answers on the press, as a Mac control does */
const TOOL = 'grid cursor-pointer place-items-center rounded-[7px] text-(--m-fg2) transition-[background-color,color,scale] duration-150 hover:bg-(--m-idle) hover:text-(--m-fg) active:scale-[.94]';

/** the floor monitor at its own size, scaled to fill the box it is in. With zoom, not a scale
 * transform: zoom lays the text out again at the size it is shown, so it is hinted to the pixel
 * grid and keeps ClearType on Windows; a transform scales a rasterised layer and blurs it */
function Fit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current!;
    setK(el.clientWidth / W);
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="absolute inset-0">
      <div style={{ width: W, height: H, zoom: k }}>{children}</div>
    </div>
  );
}

/** calls `step` every `ms` while `on` */
function useEvery(on: boolean, step: () => void, ms: number) {
  const ref = useRef(step);
  useEffect(() => { ref.current = step; });
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [on, ms]);
}

/** the wall clock, from the moment the sample was taken */
function Clock() {
  const [s, setS] = useState(0);
  useEvery(true, () => setS(v => v + 1), 1000);
  const t = 10 * 3600 + 18 * 60 + 35 + s;
  const p = (v: number) => String(v).padStart(2, '0');
  return <time className="text-[22px] leading-none font-semibold tracking-[-.02em] tabular-nums">{p(Math.floor(t / 3600) % 24)}:{p(Math.floor(t / 60) % 60)}:{p(t % 60)}</time>;
}

/** ‹ page / pages › and the auto-advance switch */
function Pager({ page, pages, onPage, auto, onAuto, c }: { page: number; pages: number; onPage: (p: number) => void; auto: boolean; onAuto: () => void; c: Copy }) {
  return (
    <span className="flex items-center gap-0.5 text-[13px] text-(--m-fg2) font-medium tracking-[.01em]">
      <button type="button" aria-label="‹" className={cn(TOOL, 'size-7')} onClick={() => onPage((page + pages - 1) % pages)}><G n="prev" className="size-3.5" /></button>
      <span className="min-w-10 text-center tabular-nums">{page + 1} / {pages}</span>
      <button type="button" aria-label="›" className={cn(TOOL, 'size-7')} onClick={() => onPage((page + 1) % pages)}><G n="next" className="size-3.5" /></button>
      <button type="button" aria-pressed={auto} onClick={onAuto}
        className={cn(TOOL, 'ml-1 flex h-7 gap-1.5 px-2.5', auto && 'bg-(--m-brand)/14 text-(--m-brand) hover:bg-(--m-brand)/20 hover:text-(--m-brand)')}>
        <G n={auto ? 'pause' : 'play'} className="size-3" />{c.auto}
      </button>
    </span>
  );
}

/** a value against its tolerance: red beyond the limits, green within, ticks at the limits and the
 * nominal, and a bar from the nominal out to the value, red when it is out */
function Tolerance({ value, lo, hi, nom = (lo + hi) / 2, labels, className }: { value?: number; lo: number; hi: number; nom?: number; labels?: boolean; className?: string }) {
  const at = (v: number) => Math.min(100, Math.max(0, 15 + 70 * (v - lo) / (hi - lo)));
  const out = value != null && (value < lo || value > hi);
  const tone = out ? 'bg-(--m-ng)' : 'bg-(--m-ok)';
  const d = (v: number) => +v.toFixed(3);
  return (
    <span className={cn('relative block', className)}>
      <span className="absolute inset-0 flex overflow-hidden rounded-full"><i className="w-[15%] bg-(--m-ng)/22" /><i className="flex-1 bg-(--m-ok)/22" /><i className="w-[15%] bg-(--m-ng)/22" /></span>
      {[lo, nom, hi].map((v, i) => <span key={i} className={cn('absolute top-0 h-full w-px', i === 1 ? 'bg-(--m-fg)/25' : 'bg-(--m-fg)/45')} style={{ left: `${at(v)}%` }} />)}
      {value != null && (
        <span className={cn('absolute top-1/2 h-1/2 -translate-y-1/2 rounded-full', tone)}
          style={{ left: `${Math.min(at(nom), at(value))}%`, width: `${Math.max(Math.abs(at(value) - at(nom)), .6)}%` }}>
          <span className={cn('absolute top-1/2 h-[200%] w-[3px] -translate-y-1/2 rounded-full', tone, value < nom ? 'left-0' : 'right-0')} />
        </span>
      )}
      {labels && <>
        {[lo, hi].map(v => <span key={v} className="absolute top-full mt-1 -translate-x-1/2 text-[12px] font-medium text-(--m-fg2) tabular-nums tracking-[.01em]" style={{ left: `${at(v)}%` }}>{d(v)}</span>)}
        {value != null && <span className={cn('absolute top-full mt-1 -translate-x-1/2 text-[13px] font-semibold tabular-nums tracking-[.01em]', out ? 'text-(--m-ng)' : 'text-(--m-ok)')} style={{ left: `${out ? Math.min(at(value), 96) : at(value)}%` }}>{d(value)}</span>}
      </>}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return <span className="relative grid size-6 flex-none place-items-center rounded-full bg-(--m-brand)/14 text-[12px] font-semibold text-(--m-brand) tracking-[.01em]">{name[0]}<i className="absolute -right-px -bottom-px size-2 rounded-full bg-(--m-ok) ring-2 ring-(--m-card)" /></span>;
}

// ---- the app ------------------------------------------------------------------------------------

/** the floor monitor; `screen` is the one showing, and `onScreen` asks for another */
export function QacMonitor({ screen, onScreen }: { screen: MonitorScreen; onScreen: (s: MonitorScreen) => void }) {
  const en = useLang() === 'en';
  const c = COPY[en ? 'en' : 'ko'];
  const tr = (p: Tr) => p[en ? 1 : 0];
  const [cycling, setCycling] = useState(false);
  const [picked, setPicked] = useState(0);
  useEvery(cycling, () => onScreen(NAV[(NAV.indexOf(screen) + 1) % NAV.length]), 8000);

  const counts = { detail: LINES.length, defects: DEFECTS.length } as Partial<Record<MonitorScreen, number>>;
  return (
    <Fit>
      <div lang={en ? 'en' : 'ko'} className="qac-monitor relative flex size-full flex-col bg-(--m-bg) text-[15px] text-(--m-fg)">
        {/* the toolbar: the Mac's toolbar tone, solid, since nothing scrolls under it here (a
            backdrop blur would only put it on its own layer and soften its text) */}
        <header className="absolute inset-x-0 top-0 z-1 flex h-14 items-center gap-3 border-b border-(--m-line) bg-(--m-bar) px-5 whitespace-nowrap">
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-[8px] bg-linear-to-b from-[#C66BE8] to-[#8A35B8] text-white shadow-[inset_0_.5px_0_rgb(255_255_255/.35),0_1px_2px_rgb(0_0_0/.2)]"><G n="check" className="size-4.5" /></span>
          <span className="grid leading-tight">
            <b className="text-[17px] font-semibold tracking-[-.01em]">{c.titles[screen]}</b>
            <span className="text-[12px] text-(--m-fg2) font-medium tracking-[.01em]">{c.app} · {c.date}</span>
          </span>
          <nav className="relative ml-8 grid w-[470px] grid-cols-3 rounded-[9px] bg-(--m-idle) p-0.5">
            <i aria-hidden="true" className="absolute inset-y-0.5 left-0.5 w-[calc((100%-4px)/3)] rounded-[7px] bg-(--m-raise) shadow-[0_1px_3px_rgb(0_0_0/.12),0_0_0_.5px_rgb(0_0_0/.05)] transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)] motion-reduce:transition-none"
              style={{ transform: `translateX(${NAV.indexOf(screen) * 100}%)` }} />
            {NAV.map(s => (
              <button key={s} type="button" aria-current={screen === s ? 'page' : undefined} onClick={() => onScreen(s)}
                className={cn('relative flex cursor-pointer items-center justify-center gap-1.5 rounded-[7px] py-1.5 text-[13.5px] font-medium text-(--m-fg2) transition-colors duration-200 hover:text-(--m-fg)', screen === s && 'text-(--m-fg)')}>
                {c.titles[s]}
                {counts[s] != null && <span className={cn('rounded-full px-1.5 text-[12px] leading-4 font-semibold tabular-nums tracking-[.01em]', s === 'defects' ? 'bg-(--m-ng-fill) text-white' : 'bg-(--m-fg)/10')}>{counts[s]}</span>}
              </button>
            ))}
          </nav>
          <span className="ml-auto flex items-center gap-1.5 text-[13px] font-medium text-(--m-ok) tracking-[.01em]"><i className="size-1.5 rounded-full bg-current shadow-[0_0_0_3px_color-mix(in_srgb,currentColor_22%,transparent)]" />{c.live}</span>
          <span className="text-[12px] text-(--m-mute) tabular-nums font-medium tracking-[.01em]">{c.updated} 10:18:27</span>
          <span className="mx-1 h-5 w-px bg-(--m-line)" />
          <button type="button" aria-pressed={cycling} aria-label={cycling ? c.cycling : c.fixed} title={cycling ? c.cycling : c.fixed} onClick={() => setCycling(v => !v)}
            className={cn(TOOL, 'flex h-8 gap-1.5 px-2.5 text-[13px] font-medium tracking-[.01em]', cycling && 'bg-(--m-brand)/14 text-(--m-brand) hover:bg-(--m-brand)/20 hover:text-(--m-brand)')}>
            <G n={cycling ? 'pause' : 'play'} className="size-3" />{cycling ? c.cycling : c.fixed}
          </button>
          <button type="button" onClick={() => setLang(en ? 'ko' : 'en')} className={cn(TOOL, 'flex h-8 gap-1.5 px-2.5 text-[13px] font-medium tracking-[.01em]')}><G n="globe" className="size-3.5" />{c.otherLang}</button>
          <span className="ml-2"><Clock /></span>
        </header>
        <main key={screen} className="qm-in min-h-0 flex-1 px-4 pt-[72px] pb-4">
          {screen === 'board' && <Board c={c} tr={tr} onOpen={i => { setPicked(QUEUE.indexOf(i)); onScreen('detail'); }} />}
          {screen === 'detail' && <Detail c={c} tr={tr} picked={picked} onPick={setPicked} />}
          {screen === 'defects' && <Defects c={c} tr={tr} />}
        </main>
      </div>
    </Fit>
  );
}

type ScreenProps = { c: Copy; tr: (p: Tr) => string };

/** "self" / "patrol", the two kinds of inspection, as small tinted tags */
function Kind({ patrol, c }: { patrol?: boolean; c: Copy }) {
  return <span className={cn('rounded-[5px] px-1.5 text-[12px] leading-5 font-semibold tracking-[.01em]', patrol ? 'bg-(--m-rov)/14 text-(--m-rov)' : 'bg-(--m-idle) text-(--m-fg2)')}>{patrol ? c.patrol : c.self}</span>;
}

function Board({ c, tr, onOpen }: ScreenProps & { onOpen: (line: number) => void }) {
  const self = LINES.flatMap(l => l.self), patrol = LINES.flatMap(l => l.patrol);
  const n = (s: Self) => self.filter(x => x[0] === s).length, p = (s: Patrol) => patrol.filter(x => x[0] === s).length;
  const kpis = [[n('done') + n('ok'), 'text-(--m-ok)'], [n('run'), 'text-(--m-brand)'], [n('skip'), 'text-(--m-fg2)'], [n('idle'), '']] as const;
  const legendSelf = ['bg-(--m-done)', 'bg-(--m-run)', 'bg-(--m-fg)/12', 'bg-(--m-miss-fill)', 'bg-(--m-done)/20', 'bg-(--m-idle)', 'ring-2 ring-inset ring-(--m-late)'];
  const legendPatrol = ['bg-(--m-done)', 'bg-(--m-run)', 'bg-(--m-rov)/14', 'ring-2 ring-inset ring-(--m-ng)'];
  const big = 'mt-1 block text-[34px] leading-tight font-semibold tracking-[-.02em] tabular-nums';
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid flex-none grid-cols-6 gap-3">
        {kpis.map(([v, color], i) => (
          <div key={i} className={cn(CARD, 'px-4 py-3')}>
            <span className="flex items-center gap-2 text-[14px] text-(--m-fg2)"><Kind c={c} />{c.kpi[i]}</span>
            <b className={cn(big, color)}>{v}</b>
          </div>
        ))}
        <div className={cn(CARD, 'px-4 py-3')}>
          <span className="flex items-center gap-2 text-[14px] text-(--m-fg2)"><Kind c={c} />{c.kpi[4]}</span>
          <span className="flex items-baseline gap-1.5 text-[17px] font-semibold text-(--m-miss)"><b className={big}>{self.filter(x => x[1]).length}</b>{c.over[0]}<span className="ml-1 font-medium">{c.over[1]}</span></span>
        </div>
        <div className={cn(CARD, 'px-4 py-3')}>
          <span className="flex items-center gap-2 text-[14px] text-(--m-fg2)"><Kind patrol c={c} />{c.queue}</span>
          <span className="flex items-baseline gap-3">
            <b className={cn(big, 'text-(--m-rov)')}>{p('run') + p('queue') + p('reject')}</b>
            <span className="text-[12px] whitespace-nowrap text-(--m-fg2) font-medium tracking-[.01em]">{c.queueSub.map((t, i) => <span key={t} className={cn(i && 'ml-2 border-l border-(--m-line) pl-2', i === 2 && 'text-(--m-ng)')}>{t} {[p('run'), p('queue'), p('reject')][i]}</span>)}</span>
          </span>
        </div>
      </div>
      <section className={cn(CARD, 'flex min-h-0 flex-1 flex-col overflow-hidden px-5 pt-3.5')}>
        <div className="flex flex-none items-center gap-3">
          <h3 className="m-0 mr-auto text-[20px] font-semibold tracking-[-.01em]">{c.progress}</h3>
          <Kind c={c} />
          {c.legendSelf.map((t, i) => <span key={t} className="flex items-center gap-1.5 text-[12px] text-(--m-fg2) font-medium tracking-[.01em]"><i className={cn('size-2.5 rounded-[3px] shadow-[inset_0_0_0_.5px_color-mix(in_srgb,var(--m-fg)_18%,transparent)]', legendSelf[i])} />{t}</span>)}
          <span className="ml-2" /><Kind patrol c={c} />
          {c.legendPatrol.map((t, i) => <span key={t} className="flex items-center gap-1.5 text-[12px] text-(--m-fg2) font-medium tracking-[.01em]"><i className={cn('size-2.5 rounded-[3px] shadow-[inset_0_0_0_.5px_color-mix(in_srgb,var(--m-fg)_18%,transparent)]', legendPatrol[i])} />{t}</span>)}
        </div>
        <div className="mt-2 grid min-h-0 flex-1 grid-cols-2 grid-rows-5 gap-x-6">
          {LINES.map((l, i) => <LineRow key={l.no} l={l} c={c} tr={tr} onOpen={() => onOpen(i)} />)}
        </div>
        <div className="-mx-5 flex flex-none items-center gap-4 border-t border-(--m-line) bg-(--m-idle)/50 px-5 py-2.5 text-[14px]">
          <span className="text-(--m-fg2)">{c.dueToday}</span>
          <span className="flex items-center gap-2 rounded-full bg-(--m-card) px-3 py-1 shadow-(--m-shadow)"><i className="size-1.5 rounded-full bg-(--m-ok)" /><b className="font-semibold">{c.dueName}</b><span className="text-(--m-fg2)">{c.dueLine}</span><span className="border-l border-(--m-line) pl-2">{c.self} 5</span><span className="text-(--m-rov)">{c.patrol} 5</span></span>
        </div>
      </section>
    </div>
  );
}

const SELF_CELL: Record<Self, string> = {
  done: 'bg-(--m-done) text-white', ok: 'bg-(--m-done)/20 text-(--m-ok)', run: 'bg-(--m-run) text-white',
  miss: 'bg-(--m-miss-fill) text-white', skip: 'bg-(--m-fg)/12 text-(--m-fg2)', idle: 'bg-(--m-idle) text-(--m-fg2) font-medium'
};
const SELF_GLYPH: Partial<Record<Self, keyof typeof GLYPHS>> = { done: 'check', ok: 'check', run: 'play', miss: 'bang', skip: 'ban' };
const PATROL_CELL: Record<Patrol, string> = {
  done: 'bg-(--m-done) text-white', run: 'bg-(--m-run) text-white', queue: 'bg-(--m-rov)/14 text-(--m-rov)',
  reject: 'text-(--m-ng) ring-2 ring-inset ring-(--m-ng)', none: 'bg-(--m-idle)/60 text-(--m-mute)'
};

/** one line on the status board: what it makes and who, then its self and patrol slots; opens its inspection */
function LineRow({ l, c, tr, onOpen }: ScreenProps & { l: Line; onOpen: () => void }) {
  const done = l.self.filter(s => s[0] === 'done' || s[0] === 'ok').length;
  const patrol = l.patrol.filter(s => s[0] !== 'none');
  return (
    <button type="button" onClick={onOpen}
      className="group -mx-2 grid cursor-pointer grid-cols-[60px_1fr] content-center gap-x-2 gap-y-1 rounded-[10px] border-b border-(--m-line) px-2 text-left transition-[background-color] duration-150 last:border-0 hover:bg-(--m-idle)/70 active:bg-(--m-idle)">
      <span className="col-span-2 mb-0.5 flex items-center gap-2.5 text-[15px]">
        <b className="font-semibold">{c.line(l.no)}</b>
        <span className="text-(--m-fg2) transition-colors group-hover:text-(--m-brand)">{tr(l.product)}</span>
        <Avatar name={tr(l.operator)} /><span className="text-(--m-fg2)">{tr(l.operator)}</span>
        <span className="ml-auto" />
        {l.late ? <span className={cn(PILL, 'bg-(--m-warn) text-[#1D1D1F]')}><G n="warn" className="size-3" />{c.late(l.late)}</span>
          : l.due && <span className={cn(PILL, 'bg-(--m-idle) font-medium text-(--m-fg2)')}>{c.due(...l.due)}</span>}
        <span className="text-[13.5px] text-(--m-fg2)">{c.self} <b className="text-(--m-fg)">{done}</b> / 5</span>
        <span className="text-[13.5px] text-(--m-rov)">{c.patrol} {patrol.length ? <><b>{patrol.filter(s => s[0] === 'done').length}</b> / {patrol.length}</> : '–'}</span>
      </span>
      <span className="self-center text-[13.5px] text-(--m-fg2)">{c.self}</span>
      <span className="grid grid-cols-5 gap-[3px]">
        {l.self.map(([s, late, note], i) => (
          <span key={i} className={cn('relative flex h-7 flex-col items-center justify-center rounded-[6px] text-[14px] leading-none font-semibold tabular-nums', SELF_CELL[s], late && 'ring-2 ring-inset ring-(--m-late)')}>
            <span className="flex items-center gap-1.5">{SELF_GLYPH[s] ? <G n={SELF_GLYPH[s]} className="size-3" /> : null}{SLOTS[i]}</span>
            {note && <small className="mt-0.5 max-w-full truncate px-1 text-[12px] font-normal tracking-[.01em]">{tr(note)}</small>}
            {late && <i className="absolute top-0 right-0 size-2.5 rounded-tr-[6px] bg-(--m-late) [clip-path:polygon(0_0,100%_0,100%_100%)]" />}
          </span>
        ))}
      </span>
      <span className="self-center text-[13.5px] text-(--m-rov)">{c.patrol}</span>
      <span className="grid grid-cols-5 gap-[3px]">
        {SLOTS.map((_, i) => { const [s, by] = l.patrol[i] ?? ['none']; return (
          <span key={i} className={cn('flex h-5.5 items-center justify-center gap-1 rounded-[6px] text-[13px] leading-none font-semibold tracking-[.01em]', PATROL_CELL[s])}>
            {s === 'queue' ? <G n="clock" className="size-3" /> : by != null ? <><G n={s === 'run' ? 'play' : s === 'reject' ? 'ban' : 'check'} className="size-2.5" />{tr(PATROL[by])}</> : '–'}
          </span>
        ); })}
      </span>
    </button>
  );
}

function Detail({ c, tr, picked, onPick }: ScreenProps & { picked: number; onPick: (i: number) => void }) {
  const [auto, setAuto] = useState(false);
  useEvery(auto, () => onPick((picked + 1) % QUEUE.length), 6000);
  const l = LINES[QUEUE[picked]];
  const run = l.self.findIndex(s => s[0] === 'run');
  const verdict = (v: Line['values'][number] | undefined, x: Item) => v == null ? null : typeof v === 'string' ? v : v > x.nom! + x.up! + 1e-9 || v < x.nom! - x.lo! - 1e-9 ? 'ng' : 'ok';
  const verdicts = l.items.map((x, i) => verdict(l.values[i], x));
  /** decimals to show a value in: as many as it or its spec has */
  const digits = (x: Item, v: number) => Math.max(...[v, x.nom!, x.up!, x.lo!].map(n => (String(n).split('.')[1] ?? '').length));
  const COLS = 'grid-cols-[52px_250px_160px_140px_1fr_84px]';
  return (
    <div className="grid h-full grid-cols-[300px_1fr] gap-4">
      {/* the sidebar: the in-progress inspections, the picked one highlighted as a Mac sidebar does */}
      <aside className={cn(CARD, 'flex min-h-0 flex-col p-2.5')}>
        <h3 className="m-0 flex items-center gap-2 px-2.5 pt-1.5 pb-2.5 text-[15px] font-semibold">{c.inProgress}<span className={COUNT}>{QUEUE.length}</span></h3>
        <ol className="m-0 flex min-h-0 flex-1 list-none flex-col gap-0.5 p-0">
          {QUEUE.map((li, i) => { const x = LINES[li], t = x.self.findIndex(s => s[0] === 'run'), on = picked === i; return (
            <li key={li}>
              <button type="button" aria-current={on} onClick={() => onPick(i)}
                className={cn('grid w-full cursor-pointer grid-cols-[40px_1fr] items-center gap-2.5 rounded-[9px] px-2 py-[7px] text-left transition-[background-color] duration-150 hover:bg-(--m-idle) active:bg-(--m-fg)/10', on && 'bg-(--m-brand)/14 hover:bg-(--m-brand)/14')}>
                <span className={cn('grid size-9 place-items-center rounded-full text-[12px] font-semibold transition-colors tracking-[.01em]', on ? 'bg-(--m-brand) text-white' : 'bg-(--m-brand)/14 text-(--m-brand)')}>{c.stages[x.stage]}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-[15px] font-semibold"><span className="truncate">{tr(x.product)}</span>{t >= 0 && <span className="flex-none text-[12.5px] font-medium text-(--m-fg2) tabular-nums tracking-[.01em]">{SLOTS[t]}</span>}</span>
                  <span className="block truncate text-[12.5px] text-(--m-fg2) font-medium tracking-[.01em]">{c.line(x.no)} · {tr(x.operator)} · {c.ago(x.ago)}</span>
                </span>
              </button>
            </li>
          ); })}
        </ol>
        <div className="flex flex-none justify-center border-t border-(--m-line) pt-2">
          <Pager c={c} page={picked} pages={QUEUE.length} onPage={onPick} auto={auto} onAuto={() => setAuto(v => !v)} />
        </div>
      </aside>
      <section className={cn(CARD, 'flex min-h-0 flex-col')}>
        <div className="flex flex-none items-end gap-7 border-b border-(--m-line) px-6 pt-4 pb-3.5">
          <div className="mr-auto">
            <h3 className="m-0 flex items-center gap-3 text-[30px] leading-tight font-bold tracking-[-.02em]">{tr(l.product)}
              {run >= 0 && <span className={cn(PILL, 'bg-(--m-run) text-[14px] tracking-normal text-white tabular-nums')}>{SLOTS[run]}</span>}
              <span className={cn(PILL, 'bg-(--m-brand)/14 text-[14px] tracking-normal text-(--m-brand)')}><G n="play" className="size-2.5" />{c.running}</span>
            </h3>
            <p className="m-0 mt-1 flex items-center gap-2.5 text-[16px] text-(--m-fg2)">{c.line(l.no)}<span className="h-3.5 w-px bg-(--m-line)" /><Avatar name={tr(l.operator)} /><span className="text-(--m-fg)">{tr(l.operator)}</span>· {c.refreshed(l.ago)}</p>
          </div>
          <span className="grid justify-items-center gap-1.5 text-[13px] text-(--m-fg2) font-medium tracking-[.01em]">{c.visual}
            <b className={cn(PILL, 'text-[15px]', l.visual === 'ng' ? 'bg-(--m-ng-fill) text-white' : l.visual ? 'bg-(--m-ok)/14 text-(--m-ok)' : 'bg-(--m-idle) text-(--m-mute)')}>{l.visual ? l.visual.toUpperCase() : '—'}</b>
          </span>
          <span className="grid justify-items-center gap-0.5 text-[13px] text-(--m-fg2) font-medium tracking-[.01em]">{c.defectItems}
            <b className={cn('text-[30px] leading-none font-semibold tabular-nums', verdicts.includes('ng') ? 'text-(--m-ng)' : 'text-(--m-fg)')}>{verdicts.filter(v => v === 'ng').length}</b>
          </span>
          <span className="grid w-38 gap-1 text-[13px] text-(--m-fg2) font-medium tracking-[.01em]">{c.measured}
            <span className="text-[30px] leading-none font-semibold tracking-[-.02em] text-(--m-fg) tabular-nums">{l.values.length}<span className="text-[18px] font-normal text-(--m-mute)"> / {l.items.length}</span></span>
            <span className="mt-1 h-1.5 overflow-hidden rounded-full bg-(--m-idle)"><span className="block h-full rounded-full bg-(--m-brand) transition-[width] duration-500 ease-[cubic-bezier(.32,.72,0,1)]" style={{ width: `${100 * l.values.length / l.items.length}%` }} /></span>
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-6 pt-3 pb-3">
          <h4 className="m-0 flex items-center gap-2 text-[15px] font-semibold">{c.items}<span className={COUNT}>{l.items.length}</span></h4>
          <div className={cn('mt-2 grid flex-none border-b border-(--m-line) pb-1.5 text-[12.5px] font-medium text-(--m-fg2) tracking-[.01em]', COLS)}>
            {c.cols.map((t, i) => <span key={t} className={cn(i === 5 && 'text-right')}>{t}</span>)}
          </div>
          <ol className="m-0 flex min-h-0 flex-1 list-none flex-col p-0">
            {l.items.map((x, i) => { const v = l.values[i], r = verdicts[i], num = typeof v === 'number' ? v : undefined; return (
              <li key={i} className={cn('relative grid max-h-[62px] flex-1 items-center border-b border-(--m-line) last:border-0', COLS, r === 'ng' && 'before:absolute before:inset-y-1.5 before:-left-3 before:w-[3px] before:rounded-full before:bg-(--m-ng)')}>
                <span className="grid size-6.5 place-items-center rounded-full bg-(--m-idle) text-[12px] font-medium text-(--m-fg2) tabular-nums tracking-[.01em]">{i + 1}</span>
                <b className="text-[17px] font-semibold">{tr(x.name)}</b>
                <span className="text-[14px] text-(--m-fg2) tabular-nums">{x.nom == null ? c.judgeSpec : x.up === x.lo ? `${x.nom} ±${x.up}` : `${x.nom} +${x.up}/-${x.lo}`}</span>
                <span className="leading-none tabular-nums">
                  {num != null ? <>
                    <b className={cn('block text-[26px] font-semibold tracking-[-.02em]', r === 'ng' && 'text-(--m-ng)')}>{num.toFixed(digits(x, num))}</b>
                    <small className={cn('text-[12px] font-medium tracking-[.01em]', r === 'ng' ? 'text-(--m-ng)' : 'text-(--m-fg2)')}>{num >= x.nom! ? '+' : ''}{(num - x.nom!).toFixed(digits(x, num))}</small>
                  </> : <span className="text-(--m-mute)">{typeof v === 'string' ? v.toUpperCase() : '—'}</span>}
                </span>
                {x.nom == null ? <span className="text-[14px] text-(--m-fg2)">{c.judgeHint}</span>
                  : <Tolerance className="mr-6 mb-5 h-3" lo={x.nom - x.lo!} hi={x.nom + x.up!} nom={x.nom} value={num} labels />}
                <span className="justify-self-end">
                  {r ? <b className={cn(PILL, 'text-[14px]', r === 'ng' ? 'bg-(--m-ng-fill) text-white' : 'bg-(--m-ok)/14 text-(--m-ok)')}>{r.toUpperCase()}</b>
                    : <span className={cn(PILL, 'bg-(--m-idle) font-medium text-(--m-fg2)')}>{c.pending}</span>}
                </span>
              </li>
            ); })}
          </ol>
        </div>
      </section>
    </div>
  );
}

const PER_PAGE = 8, ACTIONS_PER_PAGE = 3;

function Defects({ c, tr }: ScreenProps) {
  const [kind, setKind] = useState<DefectKind | null>(null);
  const [page, setPage] = useState(0), [aPage, setAPage] = useState(0);
  const [auto, setAuto] = useState(false), [aAuto, setAAuto] = useState(false);
  const list = kind ? DEFECTS.filter(d => d.kind === kind) : DEFECTS;
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE)), aPages = Math.ceil(ACTIONS.length / ACTIONS_PER_PAGE);
  useEvery(auto, () => setPage(p => (p + 1) % pages), 6000);
  useEvery(aAuto, () => setAPage(p => (p + 1) % aPages), 6000);
  const filter = (k: DefectKind | null) => { setKind(k); setPage(0); };
  const stage = (s: string | number) => typeof s === 'number' ? c.stages[s] : s;
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid flex-none grid-cols-[1fr_1fr_1.3fr_1fr] gap-3">
        {[[c.today, '46', '', ''], [c.done, '28', 'text-(--m-ok)', '61%'], [c.cases, '8', 'text-(--m-ng)', c.risk('17.4')], [c.stopped, String(ACTIONS.filter(a => a.kind === 'stop').length), 'text-(--m-miss)', c.stopSub]].map(([label, v, color, sub], i) => (
          <div key={label} className={cn(CARD, 'px-5 py-3.5', i === 2 && 'bg-(--m-ng)/10 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--m-ng)_40%,transparent)]')}>
            <span className={cn('text-[14px] text-(--m-fg2)', i === 2 && 'font-semibold text-(--m-ng)')}>{label}</span>
            <span className={cn('flex items-baseline gap-1.5', color)}>
              <b className="text-[40px] leading-tight font-semibold tracking-[-.02em] tabular-nums">{v}</b><span className="text-[17px] font-semibold">{c.unit}</span>
              <span className="ml-2 text-[14px] text-(--m-fg2)">{sub}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_500px] gap-3">
        <section className={cn(CARD, 'flex min-h-0 flex-col px-5 py-3')}>
          <div className="flex flex-none items-center gap-3 border-b border-(--m-line) pb-2.5">
            <h3 className="m-0 flex items-center gap-2 text-[15px] font-semibold">{c.defectList}<span className={COUNT}>{list.length}</span></h3>
            {kind && <button type="button" onClick={() => filter(null)} className={cn(PILL, 'cursor-pointer bg-(--m-ng)/14 text-(--m-ng) transition-[scale] active:scale-95')}><G n={kind} className="size-3" />{c.kinds[kind]}<G n="judge" className="ml-0.5 size-2.5 opacity-70" /></button>}
            <Pager c={c} page={Math.min(page, pages - 1)} pages={pages} onPage={setPage} auto={auto} onAuto={() => setAuto(v => !v)} />
            <span className={cn(PILL, 'ml-auto bg-(--m-idle) font-normal text-(--m-fg2)')}>{c.includes}</span>
          </div>
          <ol key={`${kind}-${page}`} className="qm-in m-0 flex min-h-0 flex-1 list-none flex-col p-0">
            {list.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE).map((d, i) => { const l = LINES[d.line]; return (
              <li key={i} className="grid max-h-[78px] flex-1 grid-cols-[250px_70px_130px_150px_1fr_80px] items-center gap-2 border-b border-(--m-line) last:border-0">
                <span><b className="block text-[16px] font-semibold">{tr(l.product)}</b><span className="text-[12.5px] text-(--m-fg2) font-medium tracking-[.01em]">{c.line(l.no)}-1 · {tr(l.operator)}</span></span>
                <span className={cn(PILL, 'justify-self-start rounded-[6px] bg-(--m-idle) font-medium text-(--m-fg2) tabular-nums')}>{stage(d.slot)}</span>
                <span className={cn(PILL, 'justify-self-start bg-(--m-ng)/14 text-(--m-ng)')}><G n={d.kind} className="size-3" />{c.kinds[d.kind]}</span>
                <b className="text-[14.5px] font-semibold">{d.item ? tr(d.item) : '–'}</b>
                {d.value ? (
                  <span className="grid grid-cols-[auto_1fr] items-center gap-4">
                    <span className="text-right text-[12.5px] text-(--m-fg2) tabular-nums font-medium tracking-[.01em]">{c.valueLabel} <b className="text-[21px] font-semibold tracking-[-.02em] text-(--m-ng)">{d.value[0]}</b><br />{c.specLabel} {d.value[1]} ~ {d.value[2]}</span>
                    <Tolerance className="h-2" lo={d.value[1]} hi={d.value[2]} value={d.value[0]} />
                  </span>
                ) : <span className="text-[14px] text-(--m-fg2)">{d.kind === 'visual' ? c.visualNg : c.judgeNg}</span>}
                <span className="text-right text-[14px] tabular-nums">{d.at}<small className="block text-[12px] text-(--m-mute) font-medium tracking-[.01em]">{c.ago(d.ago)}</small></span>
              </li>
            ); })}
          </ol>
        </section>
        <div className="flex min-h-0 flex-col gap-3">
          <section className={cn(CARD, 'flex-none px-5 py-3.5')}>
            <h3 className="m-0 text-[15px] font-semibold">{c.types}</h3>
            <div className="mt-2.5 grid grid-cols-3 gap-3">
              {KINDS.map(k => { const n = DEFECTS.filter(d => d.kind === k).length; return (
                <button key={k} type="button" aria-pressed={kind === k} onClick={() => filter(kind === k ? null : k)}
                  className={cn('-m-1.5 cursor-pointer rounded-[10px] p-1.5 text-left transition-[background-color,opacity,scale] duration-200 hover:bg-(--m-ng)/8 active:scale-[.97]', kind === k && 'bg-(--m-ng)/12 hover:bg-(--m-ng)/12', kind && kind !== k && 'opacity-40')}>
                  <span className="flex items-center gap-2 text-[15px] font-medium"><span className="grid size-6.5 place-items-center rounded-[7px] bg-(--m-ng-fill) text-white"><G n={k} className="size-3.5" /></span>{c.kinds[k]}</span>
                  <b className="mt-1 block text-[44px] leading-tight font-semibold tracking-[-.02em] text-(--m-ng) tabular-nums">{n}</b>
                  <span className="block h-1.5 overflow-hidden rounded-full bg-(--m-idle)"><span className="block h-full rounded-full bg-(--m-ng)" style={{ width: `${100 * n / DEFECTS.length}%` }} /></span>
                </button>
              ); })}
            </div>
          </section>
          <section className={cn(CARD, 'flex min-h-0 flex-1 flex-col px-5 py-3')}>
            <div className="flex flex-none items-center gap-2">
              <h3 className="m-0 flex items-center gap-2 text-[15px] font-semibold">{c.actions}<span className={COUNT}>{ACTIONS.length}</span></h3>
              <Pager c={c} page={aPage} pages={aPages} onPage={setAPage} auto={aAuto} onAuto={() => setAAuto(v => !v)} />
            </div>
            <ol key={aPage} className="qm-in m-0 mt-1 flex min-h-0 flex-1 list-none flex-col p-0">
              {ACTIONS.slice(aPage * ACTIONS_PER_PAGE, aPage * ACTIONS_PER_PAGE + ACTIONS_PER_PAGE).map((a, i) => { const l = LINES[a.line]; return (
                <li key={i} className="grid content-center gap-1 border-b border-(--m-line) py-2.5 last:border-0">
                  <span className="flex items-center gap-2.5">
                    <b className={cn(PILL, 'text-[13.5px]', a.kind === 'stop' ? 'bg-(--m-ng)/14 text-(--m-ng)' : 'bg-(--m-miss)/14 text-(--m-miss)')}>{c.actionKinds[a.kind]}</b>
                    <b className="text-[19px] font-semibold tracking-[-.01em]">{tr(l.product)}</b><span className="text-[14px] text-(--m-fg2)">{c.line(l.no)}</span>
                    <span className="ml-auto text-[12.5px] text-(--m-mute) font-medium tracking-[.01em]">{c.hoursAgo(a.hours)}</span>
                  </span>
                  <span className="text-[16px]">{tr(a.why)}</span>
                  <span className="text-[14px]"><span className="mr-2 text-(--m-fg2)">{tr(l.operator)}</span>
                    <b className={cn('font-semibold', a.state === 'report' ? 'text-(--m-ng)' : a.state === 'wait' ? 'text-(--m-miss)' : 'text-(--m-ok)')}>{c.states[a.state]}</b>
                  </span>
                </li>
              ); })}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
