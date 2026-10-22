// Korean copy — the source of truth. en.ts must have exactly this shape (the compiler checks it).
//
// Markup inside a string is written as <tag>…</tag> and rendered with rich() (src/i18n/rich.tsx),
// e.g. the manifesto's highlighted words. A "\n" marks where a wrapping line had better break
// (between sentences or phrases) and is rendered with lines(); it is a hint, not a forced break.
// Copy that varies with a number is a function.
// Site content with Korean/English fields side by side (products, processes, history, events,
// certificates, sites, the org chart) lives in src/data.ts and is chosen with pick().

const pad2 = (n: number) => String(n).padStart(2, '0');

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
    links: { about: 'About', rnd: 'R&D', product: 'Product', config: 'Technology', events: 'Events', community: 'Community' },
    langs: { ko: 'KOR', en: 'ENG' },
    theme: { toLight: '라이트 모드로 전환', toDark: '다크 모드로 전환' },
    contact: '제품 문의',
    open: '메뉴 열기',
    close: '메뉴 닫기'
  },

  hero: {
    label: '소개',
    beats: [
      { title: 'Driving Innovation with Precision Aluminum', body: '정밀한 가공기술로 완성한 자동차 부품과 기술력으로\n모빌리티 산업의 미래를 이끌어갑니다.' },
      { title: 'Built Locally, Delivered Globally', body: '설계부터 생산, 수출까지 신뢰를 바탕으로 완성한\n알루미늄 솔루션을 전 세계에 전달합니다.' },
      { title: 'Lighter Structure, Greater Possibilities', body: '불필요한 무게는 줄이고, 성능은 그대로.\n경량화를 통해 더 넓은 가능성을 제시합니다.' },
      { title: 'Greener Materials, Smarter Choices', body: '알루미늄은 재활용률이 높은 친환경 소재입니다.\n지속 가능한 미래를 위한 현명한 선택이 됩니다.' }
    ],
    hud: {
      sequence: 'Sequence', part: 'Part', system: 'System', process: 'Process',
      hint: '부품을 드래그하면 원하는 각도로 돌려 볼 수 있습니다',
      beatOf: (k: number, n: number) => `${pad2(k)} / ${pad2(n)}`,
      // read out by the tick buttons
      beatLabel: (k: number, n: number) => `${k} / ${n}`
    },
    cue: 'Scroll',
    marquee: ['Aluminum Extrusion', 'CNC Machining', 'T6 Heat Treatment', 'Pipe Bending', 'Daegu → Michigan → Monterrey', '1,450 t / 3,500 t Press']
  },

  about: {
    eyebrow: 'About — Company',
    aside: 'Manifesto / Daegu, since 2020',
    manifesto: '알루미늄을 압출하고 가공해 자동차, 산업용, 건축 부품을 만듭니다. <k>연구개발</k>, <k>전문 인력</k>, <k>공급망</k>으로 더 가볍고 더 강하게.',
    frame: {
      label: 'Frame 01 / Greener materials',
      title: 'Greener, Lighter, Global',
      body: '재활용률이 높은 알루미늄으로 더 가볍게 만들어\n대구에서 북미까지 보냅니다.\n사람, 기술, 환경을 생각하는 사회적 기업의 방식입니다.',
      alt: '숲 위로 드러난 세계지도 모양의 호수',
      tagEyebrow: 'Greener Materials, Smarter Choices',
      tagTitle: '사람, 기술, 환경을 생각하는\n사회적 기업',
      tagBody: '알루미늄은 재활용률이 높은 친환경 소재입니다.\n지속 가능한 미래를 위한 현명한 선택이 됩니다.',
      ledger: [
        { value: '30%', label: '에너지 효율 향상, 2단 인버터 압축기' },
        { value: '20%', label: '추가 절감' },
        { value: '14001', label: 'ISO 환경경영, 2021' },
        { value: '5곳', label: '미국, 멕시코 거점' }
      ]
    },
    years: { title: '여섯 해', range: '2020 — 2025', more: '월 단위 전체 연혁 보기 →' },
    pledge: {
      title: '약속', aside: 'Customer, Supplier',
      customer: { title: 'Customer', sub: '고객에게', items: ['고객의 요구에 맞춘 연구개발', '신뢰 기반의 파트너십', '자동차 부품 분야에서 다년간 경력을 가진 전문 인력', '정밀 가공 및 차별화된 기술력'] },
      supplier: { title: 'Supplier', sub: '협력사와', items: ['고품질 소재 제공', '지속 가능한 공급망 관리'] },
      closing: '사람과 환경을 생각하는 지속 가능한 솔루션으로\n글로벌 시장에서 함께 성장해 나가겠습니다.'
    },
    partners: { title: '주요 고객사', aside: 'End users', logoAlt: (n: number) => `고객사 로고 ${n}` },
    projects: { title: '진행 중인 사업', count: (n: number) => `${n}건`, item: (n: number) => `Project ${String(n).padStart(2, '0')}`, status: '진행 중' },
    org: { title: '조직도', aside: 'Organization chart', collapse: '접기', expand: '펼치기' }
  },

  product: {
    eyebrow: 'Product',
    title: '디비전의 제품을 만나보세요',
    lead: '네 개의 산업군, 26장의 실제 부품 사진.\n카테고리를 고르면 부품 목록과 사진이 바뀝니다.',
    labels: { automotive: 'Automotive', industrial: 'Industrial', architecture: 'Architecture', aerospace: 'Aerospace & Defense' },
    tags: { automotive: ['압출', 'CNC', 'T6'], industrial: ['압출', '절단', '가공'], architecture: ['압출', '절단', '마감'], aerospace: ['벤딩', '절단', '디버링'] },
    counts: (parts: number, photos: number) => `${parts} parts / ${photos} photos`,
    photoCount: (n: number) => `${pad2(n)} photo${n > 1 ? 's' : ''}`,
    // Korean rows show the system name with its English name beside it
    showSystemEn: true,
    gallery: '제품 사진'
  },

  statement: {
    label: '슬로건',
    lines: ['Lighter Structure', 'Greater', 'Possibilities'],
    body: '불필요한 무게는 줄이고, 성능은 그대로.\n알루미늄은 재활용률이 높은 친환경 소재이고,\n경량화는 모빌리티의 다음 가능성입니다.'
  },

  config: {
    label: '단면 설계 체험',
    eyebrow: 'Technology — Profile lab',
    title: '단면 하나로 무게가 정해집니다',
    lead: '멀티홀로 단면의 폭, 높이, 셀 수, 살두께를 바꿔 보세요.\n미터당 중량과 외접원 지름으로\n어느 프레스에서 뽑아야 하는지 가늠할 수 있습니다.',
    controls: { w: '폭 W', h: '높이 H', cells: '셀 수', wall: '살두께 t' },
    out: { area: '단면적', weight: '중량', ccd: '외접원 지름', press: '권장 프레스' },
    note: '중량은 알루미늄 밀도 2.7 g/cm³ 기준 단순 계산이며,\n프레스 선정은 외접원 지름 120 mm를 경계로 한 참고값입니다.\n실제 사양은 문의해 주세요.',
    hud: { runOut: 'Run-out', die: 'Die', dieValue: 'Multi-hollow' }
  },

  process: {
    label: '제조 공정',
    eyebrow: 'Technology — Manufacturing process',
    hint: '카드 위에서 스크롤하면 옆으로 넘어갑니다',
    hintTouch: '카드를 옆으로 밀어 넘겨 보세요',
    photoHint: 'Hover: photo',
    photoHintTouch: 'Tap: photo',
    step: (n: number) => `Step ${pad2(n)}`,
    middle: 'DVISION, Daegu'
  },

  equip: {
    eyebrow: 'Technology — Facilities',
    title: '압출과 가공, 측정까지 한 지붕 아래에',
    lead: '대구 국가산단 본사 공장의 설비 현황과 시험장비 현황입니다.\n막대 길이는 보유 대수에 비례합니다.',
    units: (_q: number) => '대',
    machining: {
      title: 'Machining', sub: '가공 설비',
      rows: {
        center: { name: '머시닝센터', spec: 'WIA i-CUT380T 외' },
        tapping: { name: '태핑센터', spec: 'WIA VX380T 외' },
        lathe: { name: 'CNC 선반', spec: 'WIA E-200A, PL 1600G' },
        bending: { name: 'CNC 파이프 벤딩', spec: '최대 Ø50' },
        cutting: { name: '파이프 절단 및 디버링', spec: '최대 Ø120' }
      }
    },
    extrusion: {
      title: 'Extrusion', sub: '압출 설비',
      capacity: 'Press capacity',
      billet: (inch: number) => `${inch} inch billet`,
      oneUnit: '1대',
      aging: { name: '열처리기', spec: 'T6 heat treatment, 1 + 1' }
    },
    test: { title: '시험장비 현황', aside: 'Inspection & testing', cols: ['Equipment', 'Brand', 'Purpose', 'Qty'] },
    facs: {
      machiningHall: { cap: 'Machining hall', alt: '설비 사진 1' },
      extrusionLine: { cap: 'Extrusion line', alt: '설비 사진 2' },
      heatTreatment: { cap: 'Heat treatment', alt: '설비 사진 3' },
      pipeLine: { cap: 'Pipe line', alt: '설비 사진 4' },
      cmm: { cap: 'CMM', alt: '시험장비 사진 1' },
      utm: { cap: 'UTM', alt: '시험장비 사진 2' },
      video: { cap: 'Video measuring', alt: '시험장비 사진 3' },
      hardness: { cap: 'Hardness', alt: '시험장비 사진 4' }
    }
  },

  rnd: {
    heroTag: 'Research & Development',
    eyebrow: 'R&D — Research field',
    title: '데이터로 제어하는 압출 공정',
    lead: '기업부설연구소의 연구 목표는\n지속가능한 친환경 경량 부품 개발입니다.\n그 출발점은 공정의 온도와 속도를\n숫자로 보는 일입니다.',
    signal: {
      title: 'Extrusion line telemetry', badge: 'Demo signal',
      aria: '압출 공정 온도와 속도의 데모 파형',
      temp: 'Billet temp', ram: 'Ram speed',
      note: '예시 파형이며 실제 계측값이 아닙니다'
    },
    research: [
      { tag: 'Process', title: '공정 구축', body: '알루미늄 압출 공정 데이터 수집 시스템(Data Acquisition System) 개선', items: ['공정별 온도, 속도 등 데이터 자동 수집 장치 구축', '기존 아날로그 센서들을 디지털로 전환', '공정별 비접촉식 온도센서 추가 설치'] },
      { tag: 'Analysis', title: '연관 통계 분석 시스템 개발', body: 'AL 압출 공정의 가공조건과 수율, 불량율 간의 연관통계 시각화 분석', items: ['품목별, 투입건별 변동이력 분석', '시간 단위 합산 변동이력 분석'] },
      { tag: 'Status', title: '연구현황', body: '현재 진행 중인 연구 과제입니다.', items: [] as string[], projects: true }
    ],
    esg: {
      e: { eyebrow: 'Environment', title: '환경보호', body: '2단 인버터 공기압축기를 도입해\n기존 대비 에너지 효율을 높이고\n추가 절감을 실현하여\n온실가스 저감에 기여합니다.', kpis: ['에너지 효율 향상', '추가 절감'] },
      s: { eyebrow: 'Social', title: '사회적 책임', body: 'AI 기반 SAFETY 시스템이\n작업자의 위험 구역 접근을 감지하여\n경고 알림을 제공함으로써\n재해를 예방하고\n안전한 작업환경을 조성합니다.', kpis: ['위험 구역 접근 감지'] },
      g: { eyebrow: 'Governance', title: '윤리적 경영', body: '고효율 설비와\n스마트 안전 시스템에 대한 투자로\n에너지, 안전 중심의\n지속 가능한 경영체계를 구축하고 있습니다.', kpis: ['14001 / 45001 / IATF 16949'] }
    },
    certs: { title: '인증서, 수상, 특허', count: (n: number) => `${n} documents` }
  },

  global: {
    eyebrow: 'About — Global network',
    title: '대구에서 만들고, 북미에서 건넵니다',
    lead: '본사 공장은 대구 국가산단에,\n영업사무소와 네 곳의 물류센터는\n미국과 멕시코 자동차 벨트에 있습니다.\n태평양을 건너는 선이 곧 납품 경로입니다.',
    mapAria: '대구 본사와 미국, 멕시코 거점을 잇는 경로 지도'
  },

  history: {
    eyebrow: 'About — History',
    title: '2020년 개인사업자에서 수출 기업까지',
    lead: '여섯 해 동안 프레스를 들이고, 인증을 쌓고,\n바다 건너 물류센터를 열었습니다.\n월 단위 전체 연혁입니다.'
  },

  events: {
    eyebrow: 'About — Events',
    title: '디비전이 참여한 행사',
    filters: '행사 필터',
    all: '전체',
    count: (n: number) => `${n}건의 행사`,
    kind: { out: '사외', in: '사내' },
    host: '주최',
    press: '기사',
    video: '영상',
    coverage: '보도',
    coverageCount: (n: number) => `${n} 보도`,
    none: '등록된 링크가 없습니다.',
    photo: (n: number) => `${n}`
  },

  community: {
    eyebrow: 'Community',
    title: '디비전의 소식을 전합니다',
    news: {
      tag: 'News', date: '2025.11.12',
      title: '홈페이지 리뉴얼 안내',
      body: '더 나은 사용자 경험을 제공하기 위해\n공식 홈페이지를 새롭게 개편하였습니다.\n이번 리뉴얼은 저희의 혁신과 접근성 향상을 위한 노력을 반영하며,\n보다 직관적인 내비게이션과\n최신 정보를 제공합니다.',
      more: '뉴스 더 보기'
    },
    video: {
      tag: 'PR video', source: 'YouTube',
      play: '홍보영상 재생', frameTitle: 'DVISION 홍보영상', close: '닫기',
      title: '홍보영상',
      body: '압출부터 가공, 출하까지\n디비전의 공정을 영상으로 만나보세요.',
      channel: '채널 바로가기'
    },
    catalog: {
      tag: 'Catalog', size: 'PDF 5.6 MB',
      cover: '디비전 카탈로그 표지',
      title: '디비전 카탈로그',
      body: '제품군, 설비, 공정,\n인증 현황을 담은\n공식 카탈로그입니다.',
      download: '카탈로그 다운로드'
    },
    social: { youtube: 'YouTube', instagram: 'Instagram', linkedin: 'LinkedIn' }
  },

  contact: {
    eyebrow: 'Support — Contact us',
    title: '품질과 기술, 그리고 진심으로 답하겠습니다',
    email: '이메일로 문의',
    catalog: '카탈로그 다운로드',
    info: { tel: 'Tel', fax: 'Fax', email: 'E-mail', address: 'Address', overseas: 'Overseas' },
    address: '(43011) 대구광역시 달성군 구지면 국가산단대로 33길 237 <map>오시는 길 ↗</map>',
    overseas: '미시간 영업사무소, 캔턴 / 케레타로 / 라레도 / 몬테레이 물류센터',
    form: {
      title: '문의하기',
      company: '회사명', name: '담당자명', tel: '연락처', email: '이메일', message: '문의 내용',
      send: '문의 보내기',
      note: '전송 서버 연동 전까지는\n작성한 내용이 담긴 메일 창이 열립니다.',
      sent: '메일 앱이 열렸습니다.\n전송 후 영업일 기준 2일 내 회신드립니다.',
      // what the pre-filled e-mail says
      mail: { subject: '[홈페이지 문의] ', company: '회사명', name: '담당자명', tel: '연락처', email: '이메일', message: '문의 내용' }
    },
    footer: { copyright: '© 2026 DVISION. All rights reserved.', tagline: 'Precision aluminum, extruded in Daegu', top: 'Back to top ↑' }
  }
};

export type Messages = typeof ko;
