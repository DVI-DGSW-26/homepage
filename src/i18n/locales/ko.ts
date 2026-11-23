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
      title: 'QAC FLOW – 종이 검사표 없는 품질검사, 검사보고서와 SPC까지 | DVISION',
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
    /** the header menu (request doc p.10): sections of QAC FLOW, the data page, and CES until the end of January */
    items: { product: '제품', how: '작동 방식', proof: '현장 검증', roadmap: '로드맵·파트너십', ces: 'CES 2027' },
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
      compare: '모바일 순회검사 결재 화면: 치수별 자주검사와 순회검사 측정값 비교 위로, DIM 1의 자주검사 사진과 순회검사 사진을 나란히 연 모습',
      approval: 'PC 웹 순회검사 결재 화면: 치수별 자주검사와 순회검사 측정값 비교, 반려와 승인(보고서 발행) 버튼',
      reports: [
        '검사보고서 1쪽 일일 품질 요약: 작성·검토·승인 결재 도장과 진위 확인 QR, 합격률·대표 Cpk·총 검사 건수·이상 발생 지표, X̄-R 관리도, ESG 탄소 절감량',
        '검사보고서 2쪽 세부 품질 검사 및 공정능력 분석: 도면의 치수 위치, 항목별 Cp·Cpk와 관리 상태, 초·중·종품 자주검사와 순회검사의 OCR 촬영 사진 대조, 차수별 측정 데이터',
        '검사보고서 3쪽 설비 조치 및 품질 추적성 로그: 설비 이상 2건의 감지·조치·재검사 승인 타임라인, 설비 조치 이력 표, 조치 건수·평균 처리 시간·미결 건수'
      ]
    },
    /** the time an inspection takes before and after QAC FLOW, measured in our plant (the seconds are in
     * src/views/qac-flow/sections/Problem.tsx) */
    problem: {
      kicker: '01 / Problem',
      q: '왜 QAC FLOW가 필요한가요?',
      title: '종이에 적고, 사진 찍고, 엑셀로 옮기던 시간이 60% 줄어듭니다.',
      lead: '측정기를 한 번 촬영하면 치수 기록, 사진 공유, 서버 정리가 동시에 끝나고\n결재와 동시에 보고서가 발행됩니다.',
      audience: '종이 검사표와 엑셀로 자주검사·순회검사를 관리하는 제조 현장을 위해 만들었습니다.',
      pains: [
        { title: '기록은 종이에', body: '측정값은 검사표에 손으로 적고, 사진은 따로 찍어 메신저로 공유합니다.' },
        { title: '정리는 다시 엑셀로', body: '사무실에 돌아와 종이 기록을 엑셀에 한 번 더 옮겨 적습니다.' },
        { title: '기록은 쌓여도 분석은 별도', body: '쌓인 검사 기록을 관리도나 공정능력으로 보려면, 데이터를 따로 모아 다시 정리해야 합니다.' }
      ],
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
      ],
      rules: {
        title: '초품 인터락과 결재 규칙',
        rounds: [
          { title: '초품', body: '검사 → 완료' },
          { title: '중품', body: '검사 → 완료' },
          { title: '종품', body: '검사 → 결재 요청' },
          { title: '결재', body: '품질관리자 승인 · 종품 후 1회' },
          { title: '보고서 1부', body: '결재 1회당 1부 발행' }
        ],
        lock: '초품 완료 전 진입 불가',
        reject: { title: '불합격·반려', body: '반려할 때는 사유를 반드시 입력하고, 보고서는 발행되지 않습니다. 재검사를 거쳐 승인되면 그때 발행됩니다. 건너뛴 항목은 미완료로 남고, 금형에 문제가 생기면 검사를 조기 마감할 수 있습니다.' }
      }
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
    /** SPC (request doc p.11): the place and the copy; the screens follow once they pass review */
    spc: {
      kicker: '06 / SPC analysis',
      q: '쌓인 검사 기록으로 무엇을 볼 수 있나요?',
      title: '한 건은 보고서로, 누적 기록은 SPC로.',
      lead: '결재된 검사 기록이 그대로 SPC 데이터가 됩니다.\n제품·측정 항목·설비·기간을 골라 관리도와 공정능력을 조회합니다.',
      /** three steps, each told beside its own screen(s) (Spc.tsx) */
      steps: [
        { title: '조회 조건 · 지표 · 관리도', body: '제품·측정 항목·설비·기간을 고르면 핵심 지표 6가지와 Xbar-R 관리도가 한 화면에 나옵니다. 관리 한계에 가까워지거나 벗어나면 바로 표시됩니다.' },
        { title: '공정능력', body: '전체 측정값의 분포를 규격 하한·상한과 겹쳐 보고, Cp·Cpk·Pp·Ppk로 공정이 규격 안에 얼마나 여유 있게 들어오는지 확인합니다.' },
        { title: '설비 이상·조치 이력', body: '설비 이상을 신고하면 조치와 완료까지 비가동 시간·비용과 함께 기록되어, 품질이 변한 원인을 짚어 볼 수 있습니다.' }
      ],
      /** under the two equipment issue screens */
      captions: ['신고 목록', '신고 한 건의 처리 과정'],
      /** the labels set on each screen, in the order of its marks (Spc.tsx) */
      marks: [
        ['조회 조건', '관리 한계 근접 경고', '핵심 지표 6가지 · Cpk · Ppk · 평균 · 표준편차 · 측정 수 · 관리 이탈', 'Xbar 관리도 (부분군 평균)', 'R 관리도 (부분군 범위)'],
        ['측정값 분포', '규격 하한·상한', '공정능력 지수'],
        ['상태별로 보기', '비가동 시간·비용', '조치 상태'],
        ['신고 → 조치 → 완료', '조치 내용', '총 비가동·비용']
      ],
      alts: [
        'SPC 분석 화면: 제품·측정 항목·설비·기간 조회 조건, 관리 한계 근접 경고, Cpk·Ppk·평균·σ·측정 수·관리 이탈 지표, X̄ 관리도와 R 관리도',
        'SPC 분석 공정능력: 전체 측정값 분포 히스토그램과 규격 하한·상한, Cp·Cpk·Pp·Ppk',
        '설비 이상 신고 목록: CNC-01·CNC-02의 이상 내용, 신고 일시와 신고자, 비가동 시간과 비용, 조치 중·조치 완료 상태',
        '설비 이상 신고 상세: CNC-01 전장 측정값 상한 쪽 이동 신고가 접수, 엔드밀 교체와 옵셋 보정 조치, 재측정 후 조치 완료로 이어진 타임라인과 총 비가동 시간·조치 비용, 이 설비의 다른 신고'
      ],
      note: 'QAC FLOW의 실제 SPC 분석·설비 이상 화면입니다. 화면을 누르면 크게 볼 수 있습니다. 데이터는 예시입니다.'
    },
    /** the inspection report: the three pages one approval issues, and what its QR code and ESG line are for */
    report: {
      kicker: '07 / Inspection report',
      q: '검사가 끝나면 무엇이 남나요?',
      title: '결재 한 번으로, 읽는 사람에 맞춘 3쪽 보고서가 발행됩니다.',
      lead: '경영진과 바이어는 1쪽에서 결과를, 품질 엔지니어는 2쪽에서 근거를,\n감사와 설비관리자는 3쪽에서 조치 이력을 확인합니다.',
      pageLabel: (n: number) => `${n}쪽`,
      pages: [
        { title: '일일 품질 요약', reader: '경영진 · 바이어', body: '합격률, 대표 Cpk, 검사 건수, 이상 발생을 한눈에 봅니다. Xbar-R 관리도와 작성·검토·승인 결재가 함께 실립니다.' },
        { title: '세부 품질 검사 · 공정능력 분석', reader: '품질 엔지니어', body: '치수 항목별 Cp·Cpk와 관리 상태, 초·중·종품마다 자주검사와 순회검사의 OCR 촬영 사진 대조, 차수별 측정 데이터를 담습니다.' },
        { title: '설비 조치 · 품질 추적성 로그', reader: '감사 · 설비관리자', body: '설비 이상이 감지되고 조치를 거쳐 재검사 승인까지 이어진 과정을 시간순으로 보여 주고, 조치 이력과 처리 시간, 미결 건수를 정리합니다.' }
      ],
      qr: { title: 'QR로 진위 확인', body: '보고서의 QR을 스캔하면 원본과 대조하고, 촬영 사진과 결재 이력을 열람할 수 있습니다.' },
      esg: { title: 'ESG 탄소 절감', body: '종이 성적서를 대체한 양을 CO₂e로 환산해 보고서에 표시합니다.' },
      note: '실제 발행되는 보고서 화면입니다. 쪽을 누르면 크게 볼 수 있습니다. 데이터는 예시입니다.'
    },
    data: {
      kicker: '08 / From report to data',
      q: '쌓인 검사 데이터는 어디에 쓰이나요?',
      title: '결재된 보고서가 쌓이면, 공장이 배우는 데이터가 됩니다.',
      steps: [
        { title: '검사마다 한 부의 보고서', body: '측정값, 공차, 사진, 결재가 한 기록에 담깁니다.' },
        { title: '보고서가 쌓여 데이터로', body: '품목, 설비, 검사 시점별로 매일 쌓입니다.' },
        { title: '학습 자산', body: '불량 예측과 공정 최적화를 위한 바탕이 됩니다.', plan: true }
      ]
    },
    /** field proof (request doc p.14): what can be said now; photos and figures follow from planning */
    proof: {
      kicker: '09 / Field proof',
      q: '실제 현장에서 쓰고 있나요?',
      title: '디비전 공장에서 먼저 쓰고 있습니다.',
      lead: '2026년 6월부터 대구 본사 공장의 자주검사와 순회검사를 QAC FLOW로 하고 있습니다.',
      since: { figure: '2026.06', label: '자사 공장 운영 시작', body: '대구 본사 공장 · 초·중·종품 자주검사와 순회검사' },
      certsLabel: '디비전 인증',
      certs: [
        { name: 'IATF 16949', body: '자동차 품질경영시스템' },
        { name: 'ISO 14001', body: '환경경영시스템' },
        { name: 'ISO 45001', body: '안전보건경영시스템' }
      ]
    },
    /** getting started (request doc p.14): the kit, the four-week trial, six questions */
    adopt: {
      kicker: '10 / Getting started',
      q: '도입하려면 무엇이 필요한가요?',
      title: '스마트폰, 서버 PC 1대, 모니터면 시작할 수 있습니다.',
      kit: [
        { title: '스마트폰', body: '측정기 촬영과 값 입력' },
        { title: '서버 PC 1대', body: '검사 기록과 원본 사진 보관' },
        { title: '모니터', body: '현장 현황판' }
      ],
      kitNote: '전용 측정 장비나 센서 공사는 필요 없습니다.',
      trial: { label: '도입 문의', title: '우리 현장에도 맞을지 궁금하다면 편하게 문의해 주세요.', body: '검사하는 품목과 쓰시는 측정기, 지금의 검사 방식을 알려 주시면 현장에 맞는 적용 방법을 안내해 드립니다. 실제 검사에 4주 동안 시험 적용해 보는 방법도 함께 상의할 수 있습니다.', cta: '도입 문의하기' },
      faqTitle: '자주 묻는 질문',
      faq: [
        { q: '어떤 측정기를 쓸 수 있나요?', a: '측정값이 화면에 숫자로 표시되는 디지털 측정기(디지털 캘리퍼스 등)를 촬영해 OCR로 읽습니다. 현장에서 쓰는 측정기가 맞는지는 상담에서 확인해 드립니다.' },
        { q: 'OCR 인식률은 어느 정도인가요?', a: '인식률 수치는 시험 조건과 표본을 확정한 뒤 공개할 예정입니다. 인식된 값은 저장하기 전에 작업자가 확인하고, 필요하면 직접 고칠 수 있습니다.' },
        { q: '불합격이 나오면 어떻게 처리하나요?', a: '반려할 때는 사유를 반드시 입력하고, 보고서는 발행되지 않습니다. 재검사를 거쳐 승인되면 그때 보고서가 발행됩니다.' },
        { q: '다른 SPC 도구와 무엇이 다른가요?', a: '측정하는 순간 값과 사진이 함께 기록되어, 데이터를 따로 옮겨 입력하지 않아도 그 기록으로 관리도와 공정능력을 봅니다. 값마다 촬영 원본이 남아 있어 근거를 바로 확인할 수 있습니다.' },
        { q: 'ERP·MES와 연동되나요?', a: '연동 범위와 방식은 현장에서 쓰는 시스템에 따라 달라, 도입 상담에서 함께 검토합니다.' },
        { q: '도입 방식과 가격은 어떻게 되나요?', a: '현장 규모와 적용 범위에 따라 달라집니다. 데모 신청이나 문의를 남겨 주시면 맞춰 안내해 드립니다.' }
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
