// Korean copy — the source of truth. en.ts must have exactly this shape (the compiler checks it).
//
// Markup inside a string is written as <tag>…</tag> and rendered with rich() (src/i18n/rich.tsx),
// e.g. the manifesto's highlighted words. A "\n" marks where a wrapping line had better break
// (between sentences or phrases) and is rendered with lines(); it is a hint, not a forced break.
// Copy that varies with a number is a function.

/** a span of minutes as hours and minutes: 186 → "3시간 6분" */
const dur = (m: number) => `${m >= 60 ? `${Math.floor(m / 60)}시간 ` : ''}${m % 60}분`;

export const ko = {
  /** the wordmark's alt text */
  brand: 'DVISION',

  meta: {
    title: 'DVISION Remake',
    description: '디비전(DVISION)은 알루미늄 압출과 정밀 가공으로 자동차, 산업용, 건축, 항공우주방산 부품을 공급하는 대구의 소재부품 전문기업입니다.'
  },

  nav: {
    home: 'DVISION 홈',
    menu: '주요 메뉴',
    links: { '/qac-flow': 'Q.A.C-Flow', '/data': 'Data Industry' },
    langs: { ko: 'KOR', en: 'ENG' },
    theme: { toLight: '라이트 모드로 전환', toDark: '다크 모드로 전환' },
    open: '메뉴 열기',
    close: '메뉴 닫기'
  },

  qf: {
    launch: 'Q.A.C-Flow 출시일',
    label: 'Q.A.C-Flow 품질검사 솔루션',
    expand: 'Quality · Analysis · Control',
    title: '종이 검사표 없는 품질검사',
    lead: '스마트폰 하나로 측정, 판정, 보고서 발행까지.\n디비전 공장에서 직접 만들고 검증했습니다.',
    stats: ['OCR 인식률', '추가 하드웨어', '대구 본사 공장 실운영'],
    statsNote: '대구 본사 공장 사내 검증 · IATF 16949',
    alt: {
      capture: '스마트폰 카메라로 디지털 캘리퍼스 화면을 촬영하는 장면',
      ocr: '측정값이 OCR로 자동 입력되고 합격으로 판정된 화면',
      crop: '촬영한 사진에서 모서리 핸들을 끌어 측정값 부위만 잘라내는 화면',
      compare: '모바일 순회검사 결재 화면: 치수별 자주검사와 순회검사 측정값 비교, 불일치 항목은 불합격 표시',
      photos: '자주검사와 순회검사의 측정 사진을 나란히 대조하는 화면',
      approval: 'PC 웹 결재 화면: 자주검사와 순회검사 결과 비교 후 승인, 보고서 발행 버튼',
      report: '승인된 검사보고서 요약: 공정, 설비, 검사 차수별 자주검사와 순회검사 결과'
    },
    problem: {
      kicker: '01 / Problem',
      q: '왜 Q.A.C-Flow가 필요한가요?',
      title: '숫자를 두 번 옮겨 적는 순간, 데이터는 신뢰를 잃습니다.',
      before: '기존 방식',
      after: 'Q.A.C-Flow',
      beforeSteps: ['측정기 읽기', '종이에 기록', '엑셀에 재입력'],
      pains: ['같은 숫자를 다시 옮기는 시간', '입력 오류', '주간 집계가 끝나야 보이는 품질 상태'],
      afterSteps: ['측정기 화면 촬영', 'OCR 자동 인식', '공차 기준 즉시 합격, 불합격 판정', '승인과 동시에 보고서 발행']
    },
    how: {
      kicker: '02 / How it works',
      q: '측정은 어떻게 하나요?',
      title: '찍고, 자르고, 끝. 측정기에서 데이터까지 세 단계.',
      lead: '장비 교체는 필요 없습니다.\n지금 쓰는 캘리퍼스와 측정기, 그리고 스마트폰 카메라면 됩니다.\n모바일과 PC 웹을 지원합니다.',
      steps: [
        { title: '촬영', body: '측정기 화면에 카메라를 맞추고 촬영합니다.' },
        { title: '자르기', body: '측정값 부분만 남도록 영역을 맞춥니다.' },
        { title: 'OCR 입력', body: '값이 자동으로 입력되고, 그 자리에서 공차 기준으로 판정됩니다.' }
      ]
    },
    workflow: {
      kicker: '03 / Workflow',
      q: '검사는 어떤 순서로 진행되나요?',
      title: '하나의 검사, 다섯 단계, 하나의 기록.',
      step: (n: number) => `Step ${n}`,
      steps: [
        { title: '검사지시 등록', body: '생산관리자가 품목, 설비, 검사 시점을 등록합니다.' },
        { title: '자주검사', body: '작업자가 측정기를 촬영하고, OCR이 값을 입력합니다.' },
        { title: '순회검사', body: '순회검사자가 같은 항목을 다시 측정하고 사진을 대조합니다.' },
        { title: '결재', body: '품질관리자가 두 결과를 나란히 보고 결재합니다.' },
        { title: '보고서 발행', body: '검사보고서가 자동으로 발행되고 PDF로 내려받을 수 있습니다.' }
      ]
    },
    live: {
      kicker: '04 / Live monitoring',
      q: '불량은 언제 알 수 있나요?',
      title: '불량은 생기는 순간 보입니다.',
      lead: '측정값은 측정하는 그 순간 현장 모니터에 올라옵니다.\n설비별 진행 현황, 공차 대비 측정값, 불량과 조치, 검사 지연 알림까지.',
      tabsAria: '모니터 화면',
      tabs: ['측정 상세', '현황판', '불량, 조치'],
      note: '운영 화면을 그대로 옮긴 데모입니다. 화면 속 탭, 호기, 불량 유형을 눌러 보세요. 데이터는 예시입니다.'
    },
    trace: {
      kicker: '05 / Traceability',
      q: '측정값은 어떻게 믿을 수 있나요?',
      title: '모든 측정값에는 사진이 붙어 있습니다.',
      lead: '자주검사와 순회검사 결과가 나란히 놓여,\n불일치는 결재 전에 드러나고\n모든 기록은 고객사 감사와 IATF 심사에서 추적할 수 있습니다.',
      points: [
        { title: '모든 값에 사진 증빙', body: '측정기 사진이 그 숫자와 함께 저장됩니다.' },
        { title: '자주검사와 순회검사를 나란히', body: '두 사람, 두 번의 측정을 한 화면에서 비교합니다.' },
        { title: '한 번의 결재로 보고서 완성', body: '결재와 동시에 감사 대응용 보고서가 발행됩니다.' }
      ]
    },
    data: {
      kicker: '06 / From report to data',
      q: '쌓인 검사 데이터는 어디에 쓰이나요?',
      title: '결재된 보고서가 쌓이면, 공장이 배우는 데이터가 됩니다.',
      caption: '검사보고서, 결재와 동시에 발행 / PDF',
      steps: [
        { title: '검사마다 한 장의 보고서', body: '측정값, 공차, 사진, 결재가 한 기록에 담깁니다.' },
        { title: '보고서가 쌓여 데이터로', body: '품목, 설비, 검사 시점별로 매일 쌓입니다.' },
        { title: '학습 자산', body: '불량 예측과 공정 최적화를 위한 바탕이 됩니다.' }
      ]
    }
  },

  future: {
    label: '데이터 산업 진입',
    /** the step at the end of Q.A.C-Flow's last block that leads here: the label above, then this */
    bridge: '쌓인 검사 데이터가\n데이터 산업의 출발점이 됩니다',
    eyebrow: 'Data Industry',
    title: '검사 한 건이,\n<k>데이터 자산</k>이 됩니다',
    lead: '데이터/AI 시장으로의 확장. Q.A.C-Flow가 데이터를 모으고, Data Industry가 그 데이터로 사업을 만듭니다.',
    storyLabel: '데이터의 입구에서 출구까지',
    story: [
      { tag: 'Input', title: 'Q.A.C-Flow', body: '데이터의 입구. 촬영 한 번으로 검사 데이터를 수집' },
      { tag: 'Asset', title: '검증된 데이터', body: '측정값 + 사진 증빙 + 판정 + 조치 이력' },
      { tag: 'Output', title: 'Data Industry', body: '데이터의 출구. SaaS · 데이터 사업 · 크레딧' }
    ],
    why: {
      kicker: '02 / Why us',
      title: '우리는 데이터를 직접 ‘만드는’ 기업입니다',
      from: '데이터는 Q.A.C-Flow에서 모입니다',
      items: [
        { title: '측정값', sub: 'DIM · 기준값 · 공차' },
        { title: '측정 사진', sub: '자주 · 순회 이중 증빙' },
        { title: '맥락 정보', sub: '설비 · 제품 · 작업자 · 시점' },
        { title: '판정 결과', sub: 'OK/NG · 불량 유형' },
        { title: '조치 이력', sub: '조기마감 · 미완료 · 반려' },
        { title: '승인 이력', sub: '결재자 · 발행 시각' }
      ],
      note: '사진으로 검증된 데이터 = <k>신뢰할 수 있는 학습 데이터</k>'
    },
    chain: {
      kicker: '03 / Value Chain',
      title: '데이터 확보에서 사업까지 5단계',
      steps: [
        { title: '데이터 확보', sub: '현장 실시간 수집' },
        { title: 'Internal PoC', sub: '내부 검증' },
        { title: 'External PoC', sub: '외부 고객 검증' },
        { title: 'SaaS', sub: '서비스화' },
        { title: 'Data Business', sub: '데이터 사업' }
      ]
    },
    roadmap: {
      kicker: '04 / Roadmap',
      title: '검증 기반 단계적 확장, 지금은 1단계',
      here: 'Now',
      stages: [
        { year: '2026', title: 'Internal PoC', items: ['내부 검증', '데이터 모델 테스트', '운영 최적화'] },
        { year: '2027', title: 'External PoC', items: ['외부 고객 검증', '시스템 구축', '실증 테스트'] },
        { year: '2028', title: 'SaaS 제품화', items: ['서비스 출시', '고객 확대', '수익화 시작'] },
        { year: '2029', title: 'Data / Credit', items: ['데이터 사업', '크레딧 시스템', '글로벌 확장'] }
      ],
      proof: '<k>Q.A.C-Flow 현장 운영 중 (2026.06.01~)</k> — 로드맵은 계획이 아니라 진행 중입니다'
    },
    asset: {
      kicker: '05 / Data Asset',
      title: '쌓인 데이터가 만드는 가치',
      items: [
        { title: '불량 예측 모델', body: '쌓인 측정값과 판정으로 불량이 생기기 전에 미리 알아챕니다.' },
        { title: '공정 파라미터 최적화', body: '측정값을 설비 · 제품 맥락과 함께 보고 더 나은 공정 조건을 찾습니다.' },
        { title: '데이터 크레딧 시스템', body: '검증된 품질 데이터가 거래하고 활용할 수 있는 자산이 됩니다.' },
        { title: '품질 데이터 격차 해소', body: '데이터를 쌓기 어려운 제조 현장도 검증된 데이터를 쓸 수 있게 합니다.' }
      ]
    },
    partner: {
      kicker: '06 / Partnership',
      title: '함께 데이터를 만들 파트너',
      tags: ['External PoC 참여', '파트너십'],
      closing: '찍는 순간 기록되고,\n기록이 쌓여 <k>산업이 됩니다.</k>'
    }
  },

  /** the floor monitor rebuilt in React (src/features/qac-monitor); its sample data carries its own ko/en names */
  monitor: {
    app: '검사 진행 현황', titles: { board: '현황판', detail: '검사 상세', defects: '품질·불량' }, date: '10월 2일 (금)',
    fixed: '고정', cycling: '순환', otherLang: 'EN', live: '실시간', updated: '마지막 변경', prev: '이전', next: '다음',
    self: '자주', patrol: '순회', line: (n: number) => `${n}호기`,
    kpi: ['완료', '진행중', '건너뜀', '남은 시점', '지연'], over: ['칸', '시각 경과'],
    queue: '순회 대기', queueSub: ['작성중', '승인대기', '반려'],
    progress: '시점별 진행도', boardCols: ['라인', '상태', '진행'], legendSelf: ['완료', '진행중', '건너뜀', '미완료', '미완료 승인', '미시작', '지연'], legendPatrol: ['완료', '작성중', '대기', '반려'],
    due: (t: string, m: number) => `${t}까지 ${dur(m)}`, late: (m: number) => `지연 ${dur(m)}`,
    dueToday: '오늘 마감 1줄', dueName: '배준호', dueLine: '10호기',
    inProgress: '진행중 검사', stages: ['초물', '중물', '종물'], ago: (m: number) => m >= 60 ? `${Math.floor(m / 60)}시간 전` : `${m}분 전`,
    running: '진행중', refreshed: (m: number) => `${m}분 전 갱신`, visual: '외관', defectItems: '불량 항목', measured: '측정 진행',
    items: '측정 항목', cols: ['No', '항목', '기준 · 공차', '측정값', '허용 범위', '판정'], judgeSpec: 'OK/NG 판정 항목', judgeHint: '작업자가 OK/NG를 고르는 항목', pending: '대기', auto: '자동',
    today: '오늘 검사', done: '검사 완료', cases: '불량 검사', stopped: '조기종료', unit: '건', risk: (r: string) => `불량률 ${r}% · 위험`, stopSub: '품질 문제로 중단',
    defectList: '불량 항목', includes: '결재 전 진행중 검사도 포함', kinds: { spec: '치수 이탈', visual: '외관 NG', judge: 'OK/NG' },
    valueLabel: '측정', specLabel: '허용', visualNg: '외관 판정에서 NG', judgeNg: 'OK/NG 항목에서 NG',
    types: '불량 유형', actions: '조치 현황', actionKinds: { stop: '조기종료', open: '미완료' }, states: { report: '보고서 발행 · 재검사 시작', wait: '결재 대기', ok: '승인 완료' }, hoursAgo: (h: number) => `${h}시간 전`
  }
};

export type Messages = typeof ko;
