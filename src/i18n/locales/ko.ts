// Korean copy — the source of truth. en.ts must have exactly this shape (the compiler checks it).
//
// Markup inside a string is written as <tag>…</tag> and rendered with rich() (src/i18n/rich.tsx),
// e.g. the manifesto's highlighted words. A "\n" marks where a wrapping line had better break
// (between sentences or phrases) and is rendered with lines(); it is a hint, not a forced break.
// Copy that varies with a number is a function.
import { privacyKo } from './privacy.ko';


export const ko = {
  /** the wordmark's alt text */
  brand: 'DVISION',

  /** each page's browser tab, search result and link preview (the SEO head in scripts/seo.ts reads these too);
   * a link preview drops the " | DVISION" */
  meta: {
    '/qac-flow': {
      title: 'QAC FLOW – 종이 검사표 없는 품질검사 | DVISION',
      description: '스마트폰으로 측정기를 찍으면 OCR이 값을 읽어 공차 판정과 검사보고서 발행까지 이어집니다.'
    },
    '/data': {
      title: 'QAC FLOW 데이터 산업 – 검사 한 건이 데이터 자산으로 | DVISION',
      description: 'QAC FLOW가 현장에서 사진 증빙과 함께 모은 검사 데이터로 데이터 사업을 만듭니다. 2026–2029 로드맵과 파트너십.'
    },
    '/privacy': {
      title: '개인정보처리방침 | DVISION',
      description: '(주)디비전 솔루션 홈페이지(solution.dvi-ind.com)의 개인정보처리방침입니다.'
    },
    /** the link preview image's alt text */
    image: 'QAC FLOW 첫 화면: 종이 검사표 없는 품질검사, 스마트폰으로 측정기를 촬영하는 앱 화면'
  },

  nav: {
    home: 'QAC FLOW 처음으로',
    menu: '주요 메뉴',
    links: { '/qac-flow': 'QAC FLOW', '/data': 'Data Industry' },
    /** DVISION's sites: the gateway (dvi-ind.com), manufacturing, and this one */
    sites: { label: 'DVISION 사이트', gateway: 'DVISION 첫 화면', manufacturing: '제조', solution: '솔루션' },
    langs: { ko: 'KOR', en: 'ENG' },
    theme: { toLight: '라이트 모드로 전환', toDark: '다크 모드로 전환' },
    open: '메뉴 열기',
    close: '메뉴 닫기'
  },

  /** the tag on what is still a plan (defect prediction, process tuning) */
  planned: '계획',

  /** the zoomed capture, the demo video and the downloads (src/lib/media.ts) */
  media: {
    zoom: '크게 보기',
    zoomIn: '확대',
    zoomOut: '축소',
    fit: '화면에 맞춤',
    close: '닫기',
    watch: (s: number) => `${s}초 영상 보기`,
    title: 'QAC FLOW 데모 영상',
    downloads: '자료 내려받기',
    kinds: { catalog: '카탈로그', leaflet: '영문 리플릿' },
    file: (mb: number) => `PDF · ${mb}MB`
  },

  qf: {
    label: 'QAC FLOW 품질검사 솔루션',
    expand: 'Quality · Analysis · Control',
    title: '종이 검사표 없는 품질검사',
    lead: '스마트폰 하나로 측정, 판정, 보고서 발행까지.\n디비전 공장에서 직접 만들고 검증했습니다.',
    /** the figures up front: what it doesn't need, and since when it runs in our own plant */
    stats: ['전용 측정 장비·센서 공사 불필요', '자사 공장 운영 시작'],
    /** the first claim's headline: what it takes (stats[0], what it doesn't, is the line under it) */
    kit: '스마트폰 · 서버 PC 1대 · 모니터면 충분',
    statsNote: '대구 본사 공장 사내 검증 · IATF 16949',
    /** the buttons that lead to the demo request form (#contact) */
    /** demo: the demo buttons, cesDemo in its place until CES 2027 closes (duringCes, src/lib/site.ts) */
    cta: { demo: '데모 신청', cesDemo: 'CES 데모 신청', apply: '우리 현장에 적용 문의', how: '작동 방식 보기' },
    /** the banner above the name: the booth until the show closes (CES_END in src/lib/site.ts), then the online demo */
    ces: {
      label: 'CES 2027',
      when: '1. 6.~9. 라스베이거스',
      where: (booth: string) => `Eureka Park 부스 ${booth}`,
      hall: 'Venetian Expo Hall G',
      try: '부스에서 직접 측정·촬영해 보세요',
      after: 'CES 2027 부스 시연을 온라인 데모로 안내해 드립니다'
    },
    alt: {
      capture: '스마트폰 카메라로 디지털 캘리퍼스 화면을 촬영하는 장면',
      ocr: '측정값이 OCR로 자동 입력되고 합격으로 판정된 화면',
      crop: '촬영한 사진에서 모서리 핸들을 끌어 측정값 부위만 잘라내는 화면',
      compare: '모바일 순회검사 결재 화면: 치수별 자주검사와 순회검사 측정값을 나란히 비교, 반려와 승인(보고서 발행) 버튼',
      approval: 'PC 웹 순회검사 결재 화면: 치수별 자주검사와 순회검사 측정값 비교, 반려와 승인(보고서 발행) 버튼',
      report: '일일 품질 요약 보고서: 합격률·대표 Cpk·검사 건수·이상 발생 지표, X̄-R 관리도, 작성·검토·승인 결재와 진위 확인 QR'
    },
    /** the time an inspection takes before and after QAC FLOW, measured in our plant (the seconds are in
     * src/views/qac-flow/sections/Problem.tsx) */
    problem: {
      kicker: '01 / Problem',
      q: '왜 QAC FLOW가 필요한가요?',
      title: '종이에 적고, 사진 찍고, 엑셀로 옮기던 시간이 60% 줄어듭니다.',
      lead: '측정기를 한 번 촬영하면 치수 기록, 사진 공유, 서버 정리가 동시에 끝나고\n결재와 동시에 보고서가 발행됩니다.',
      before: '기존 방식',
      after: 'QAC FLOW',
      cut: '검사 시간 단축',
      totalsLabel: '초품·중품·종품 3회 합계',
      totals: [{ item: '측정부 5포인트 품목', from: '37분 30초', to: '15분' }, { item: '측정부 10포인트 품목', from: '1시간 13분 30초', to: '30분' }],
      chart: '검사 1회 소요 시간 · 측정부 5포인트 품목',
      beforeParts: ['치수 측정', '종이에 기록', '사진 촬영', '사진 공유 발송', '엑셀로 정리'],
      afterParts: ['치수 측정', '촬영 · 치수 기록 · 사진 공유 · 서버 정리 (동시 진행)'],
      time: (s: number) => s >= 60 ? `${Math.floor(s / 60)}분${s % 60 ? ` ${s % 60}초` : ''}` : `${s}초`,
      note: '대구 본사 공장 사내 측정 기준 (QAC FLOW 도입 전후 소모시간 비교)',
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
      q: '공장 전체의 검사를 어떻게 한눈에 보나요?',
      title: '공장 전체 검사 현황을 모니터 한 대로, 실시간으로.',
      lead: '작업자가 휴대폰으로 결과를 입력하면 저장과 동시에 현장 모니터에 반영됩니다.\n진행 현황, 측정값, 불량까지 현장 모두가 실시간으로 확인합니다.',
      tabsAria: '모니터 화면',
      tabs: ['검사 현황판', '측정 상세', '품질·불량 관리'],
      bodies: [
        '설비마다 초·중·종품 자주검사와 순회검사가 어디까지 진행됐는지 보여 줍니다. 완료된 검사, 진행 중인 검사, 지연되거나 건너뛴 검사를 한눈에 구분합니다.',
        '측정값을 기준치·공차와 나란히 놓고 항목마다 OK/NG를 판정합니다. 허용 범위 막대에 측정값의 위치가 표시되어, 한계에 가까워진 값을 바로 알아볼 수 있습니다.',
        '오늘 발생한 불량을 항목·유형별로, 불량률과 함께 확인합니다. 조치마다 담당자, 지시 내용, 진행 상태가 기록되어 문제가 해결될 때까지 따라갈 수 있습니다.'
      ],
      alts: [
        '검사 현황판 화면: 완료·진행 중·건너뜀·지연 건수와 설비별 초·중·종품 자주검사, 순회검사 진행 상황',
        '측정 상세 화면: 진행 중인 검사의 항목별 기준치·공차, 측정값, 허용 범위 막대와 OK 판정',
        '품질·불량 관리 화면: 오늘 검사 건수와 불량률, 치수 이탈 불량 항목, 불량 유형, 작업자가 재측정 중인 순회검사 반려 조치'
      ],
      note: '현장 모니터의 실제 화면입니다. 화면을 누르면 크게 볼 수 있습니다. 데이터는 예시입니다.'
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
        { title: '학습 자산', body: '불량 예측과 공정 최적화를 위한 바탕이 됩니다.', plan: true }
      ]
    }
  },

  future: {
    label: '데이터 산업 진입',
    /** the step at the end of QAC FLOW's last block that leads here: the label above, then this */
    bridge: '쌓인 검사 데이터가\n데이터 산업의 출발점이 됩니다',
    eyebrow: 'Data Industry',
    title: '검사 한 건이,\n<k>데이터 자산</k>이 됩니다',
    lead: '데이터/AI 시장으로의 확장. QAC FLOW가 데이터를 모으고, Data Industry가 그 데이터로 사업을 만듭니다.',
    storyLabel: '데이터의 입구에서 출구까지',
    story: [
      { tag: 'Input', title: 'QAC FLOW', body: '데이터의 입구. 촬영 한 번으로 검사 데이터를 수집' },
      { tag: 'Asset', title: '검증된 데이터', body: '측정값 + 사진 증빙 + 판정 + 조치 이력' },
      { tag: 'Output', title: 'Data Industry', body: '데이터의 출구. SaaS · 데이터 사업 · 크레딧' }
    ],
    why: {
      kicker: '02 / Why us',
      title: '우리는 데이터를 직접 ‘만드는’ 기업입니다',
      from: '데이터는 QAC FLOW에서 모입니다',
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
      proof: '<k>QAC FLOW 자사 공장 운영 중 (2026.06~)</k> — 로드맵은 계획이 아니라 진행 중입니다'
    },
    asset: {
      kicker: '05 / Data Asset',
      title: '쌓인 데이터가 만드는 가치',
      items: [
        { title: '불량 예측 모델', body: '쌓인 측정값과 판정으로 불량이 생기기 전에 미리 알아챕니다.', plan: true },
        { title: '공정 파라미터 최적화', body: '측정값을 설비 · 제품 맥락과 함께 보고 더 나은 공정 조건을 찾습니다.', plan: true },
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

  /** the demo request form at the end of every page (#contact); api/inquiry.ts mails it to sales */
  contact: {
    kicker: 'Demo / Contact',
    title: '데모 신청·문의',
    lead: '현장에 맞는 적용 방법을 안내해 드립니다.',
    close: '닫기',
    booth: (n: string) => `CES 2027 ·\nEureka Park ·\nBooth ${n}`,
    show: '2027. 1. 6.~9. ·\n라스베이거스 Venetian Expo Hall G',
    fields: { name: '이름', email: '회사 이메일', company: '회사명' },
    placeholders: { name: '홍길동', email: 'name@company.com', company: '(주)회사명' },
    /** how the form's data is handled, above the button: no consent is asked (see privacy.ko.ts) */
    notice: '데모 신청 응대와 후속 상담을 위해 이름·회사 이메일·회사명을 받아 상담 종료 후 1년간 보관한 뒤 파기합니다. 접수·발송 과정에서 미국의 Vercel·Resend를 거쳐 회사 메일(Google Workspace)로 전달됩니다.',
    policy: '개인정보처리방침',
    submit: '데모 신청',
    submitCes: 'CES 데모 신청',
    sending: '보내는 중…',
    /** after sending: the page-end form starts a new one, a failed one goes back to the filled form */
    again: '새로 작성',
    retry: '다시 시도',
    sent: '접수되었습니다. 담당자가 회사 이메일로 연락드리겠습니다.',
    failed: '보내지 못했습니다. 잠시 후 다시 시도하시거나 아래 주소로 메일을 보내 주세요.',
    invalid: {
      name: '이름을 입력해 주세요.',
      email: '회사 이메일 주소를 확인해 주세요.',
      company: '회사명을 입력해 주세요.'
    },
    /** the subject of the mail a visitor writes when the form fails */
    mailSubject: 'QAC FLOW 데모 신청'
  },

  footer: {
    company: '(주)디비전',
    address: '대구광역시 달성군 구지면 국가산단대로33길 237',
    email: '문의',
    sites: 'DVISION 사이트',
    links: { gateway: 'DVISION 첫 화면', manufacturing: '제조 홈페이지', solution: 'QAC FLOW 솔루션' },
    privacy: '개인정보처리방침',
    copyright: '© 2026 DVISION Co., Ltd. All rights reserved.'
  },

  privacy: privacyKo
};

export type Messages = typeof ko;
