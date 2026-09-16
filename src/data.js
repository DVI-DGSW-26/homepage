// Site content pulled from dvi-ind.com (2026-09). Edit here, the DOM is generated from these tables.
// Every user-visible Korean string has an English sibling: `desc`/`descEn`, `d`/`dEn`,
// `t`/`tEn`, `l`/`lEn`, `ko`/`en`. src/i18n.js `t(ko, en)` picks between them.
const P = 'assets/img/products/';

export const PRODUCTS = [
  {
    id: 'automotive', ko: '자동차 부품', en: 'Automotive Components',
    desc: '차세대 모빌리티에 최적화된 알루미늄 부품', descEn: 'Aluminum parts optimised for next-generation mobility',
    cover: P + 'cat-automotive.jpg', thumb: P + 'thumb-automotive.jpg', icon: P + 'icon-automotive-white.png',
    groups: [
      { ko: '방진장치', en: 'Anti-vibration', parts: [
        { name: 'Inner Plate', img: 'auto-vibration-01.jpg' }, { name: 'Inner Pipe', img: 'auto-vibration-02.jpg' }, { name: 'Inner Pipe', img: 'auto-vibration-03.jpg' },
        { name: 'Inner Pipe', img: 'auto-vibration-04.jpg' }, { name: 'Inner', img: 'auto-vibration-05.jpg' }, { name: 'Inner', img: 'auto-vibration-06.jpg' },
        { name: 'Inner', img: 'auto-vibration-07.jpg' }, { name: 'Inner', img: 'auto-vibration-08.jpg' }, { name: 'Inner Sleeve', img: 'auto-vibration-09.jpg' } ] },
      { ko: '조향장치', en: 'Steering', parts: [
        { name: 'Collar, Steering Gear Box', img: 'auto-steering-01.jpg' }, { name: 'Collar, Steering Gear Box', img: 'auto-steering-02.jpg' },
        { name: 'Shaft', img: 'auto-steering-03.jpg' }, { name: 'Sleeve Bush', img: 'auto-steering-04.jpg' },
        { name: 'Yoke', img: 'auto-steering-05.jpg' }, { name: 'Yoke', img: 'auto-steering-06.jpg' }, { name: 'Yoke', img: 'auto-steering-07.jpg' } ] },
      { ko: '제동장치', en: 'Brake', parts: [ { name: 'Brake Hat', img: 'auto-brake-01.jpg' }, { name: 'Manifold Block', img: 'auto-brake-02.jpg' } ] },
      { ko: '섀시 프레임', en: 'Chassis frame', parts: [ { name: 'Spacer', img: 'auto-chassis-01.jpg' }, { name: 'Spacer', img: 'auto-chassis-02.jpg' }, { name: 'Sleeve', img: 'auto-chassis-03.jpg' } ] },
      { ko: '전기차 배터리 부품', en: 'EV battery', parts: [ { name: 'Brake-Wiring MTG', img: 'auto-ev-01.jpg' } ] }
    ]
  },
  {
    id: 'industrial', ko: '산업용 부품', en: 'Industrial Components',
    desc: '다양한 산업 현장을 위한 맞춤형 솔루션', descEn: 'Tailored solutions for a wide range of industrial sites',
    cover: P + 'cat-industrial.jpg', thumb: P + 'thumb-industrial.jpg', icon: P + 'icon-industrial-white.png',
    groups: [ { ko: '프레임', en: 'Frames', parts: [ { name: 'Door Frame', img: 'industrial-01.jpg' }, { name: 'Frame', img: 'industrial-02.jpg' }, { name: 'Frame', img: 'industrial-03.jpg' } ] } ]
  },
  {
    id: 'architecture', ko: '건축 및 내외장재 부품', en: 'Architectural Interior & Exterior',
    desc: '도시를 더욱 가볍고 아름답게', descEn: 'Making cities lighter and more beautiful',
    cover: P + 'cat-architecture.jpg', thumb: P + 'thumb-architecture.jpg', icon: P + 'icon-architecture-white.png',
    groups: [ { ko: '프레임', en: 'Frames', parts: [ { name: 'Door Frame', img: 'industrial-01.jpg' }, { name: 'Frame', img: 'industrial-02.jpg' } ] } ]
  },
  {
    id: 'aerospace', ko: '항공 우주 방산 부품', en: 'Aerospace & Defense',
    desc: '극한 환경에서도 빛나는 정밀 경량화', descEn: 'Precision lightweighting that holds up in extreme environments',
    cover: P + 'cat-aerospace.jpg', thumb: P + 'thumb-aerospace.jpg', icon: P + 'icon-aerospace-white.png',
    groups: [ { ko: '파이프', en: 'Pipes', parts: [ { name: 'Pipe', img: 'aero-01.jpg' }, { name: 'Pipe', img: 'aero-02.jpg' }, { name: 'Pipe', img: 'aero-03.jpg' }, { name: 'Pipe', img: 'aero-04.jpg' } ] } ] }
];

const PR = 'assets/img/process/';
// step.en is the short tag above the heading; step.ko / step.koEn is the heading itself.
export const PROCESSES = [
  { id: 'ext', ko: '알루미늄 압출 공정', en: 'Aluminum extrusion process',
    title: '빌렛 하나가 부품이 되기까지, 11단계', titleEn: 'From one billet to a finished part, in 11 steps',
    foot: ['Billet in', 'Ship out'], steps: [
    { ko: 'Billet 입고', koEn: 'Billet inbound', en: 'Inbound', d: '원소재 알루미늄 빌렛을 입고하고 합금, 치수, 성적서를 검수합니다.', dEn: 'Aluminum billets arrive and are checked for alloy, dimensions and mill certificates.', imgs: ['ext-01-1.jpg', 'ext-01-2.jpg'] },
    { ko: 'Billet 표면 브러싱', koEn: 'Billet surface brushing', en: 'Surface', d: '표면의 산화층과 이물을 제거해 압출 결함을 예방합니다.', dEn: 'The oxide layer and debris are brushed off the surface to prevent extrusion defects.', imgs: ['ext-02-1.jpg', 'ext-02-2.jpg'] },
    { ko: 'Billet 예열 및 절단', koEn: 'Billet preheat & cut', en: 'Heat', heat: 'hot', d: '빌렛을 압출 가능한 온도까지 예열한 뒤 프레스 길이에 맞춰 절단합니다.', dEn: 'Billets are preheated to extrusion temperature, then cut to press length.', imgs: ['ext-03-1.jpg', 'ext-03-2.jpg'] },
    { ko: '금형 예열', koEn: 'Die preheat', en: 'Heat', heat: 'hot', d: '단면 형상을 결정하는 금형을 작업 온도로 예열해 소재와의 온도차를 줄입니다.', dEn: 'The die that sets the section shape is preheated to working temperature, narrowing the gap with the material.', imgs: ['ext-04-1.jpg', 'ext-04-2.jpg'] },
    { ko: '압출', koEn: 'Extrusion', en: 'Press', heat: 'hot', d: '1,450 t와 3,500 t 프레스가 빌렛을 금형으로 밀어 연속된 단면 형상을 뽑아냅니다.', dEn: '1,450 t and 3,500 t presses push the billet through the die, drawing a continuous section.', imgs: ['ext-05-1.jpg', 'ext-05-2.jpg'] },
    { ko: '퀜칭', koEn: 'Quenching', en: 'Quench', heat: 'cool', d: '수냉 또는 공냉으로 급속 냉각해 합금 원소를 고용 상태로 고정합니다.', dEn: 'Rapid water or air cooling locks the alloying elements in solid solution.', imgs: ['ext-06-1.jpg', 'ext-06-2.jpg'] },
    { ko: '스트레칭', koEn: 'Stretching', en: 'Stretch', d: '양 끝을 당겨 잔류응력을 제거하고 직진도와 비틀림을 교정합니다.', dEn: 'Pulling both ends relieves residual stress and corrects straightness and twist.', imgs: ['ext-07-1.jpg', 'ext-07-2.jpg'] },
    { ko: '제품 절단', koEn: 'Cut to length', en: 'Cut', d: '고객 규격 길이로 절단하고 절단면을 정리합니다.', dEn: 'Cut to the length the customer specified, with the cut faces cleaned up.', imgs: ['ext-08-1.jpg', 'ext-08-2.jpg'] },
    { ko: '팔레트 적재', koEn: 'Pallet stacking', en: 'Stack', d: '열처리로에 들어갈 수 있도록 간격을 두고 팔레트에 적재합니다.', dEn: 'Stacked on pallets with spacing so they can enter the aging furnace.', imgs: ['ext-09-1.jpg', 'ext-09-2.jpg'] },
    { ko: '열처리', koEn: 'Aging', en: 'Aging', heat: 'warm', d: 'T6 시효 열처리로 강도와 경도를 최종 물성까지 끌어올립니다.', dEn: 'T6 aging brings strength and hardness up to their final properties.', imgs: ['ext-10-1.jpg'] },
    { ko: '포장, 출하', koEn: 'Packing & shipping', en: 'Ship', d: '치수와 외관 검사를 마친 제품을 포장해 국내외 거점으로 출하합니다.', dEn: 'After dimensional and visual inspection, parts are packed and shipped to sites at home and abroad.', imgs: ['ext-11-1.jpg', 'ext-11-2.jpg'] }
  ] },
  { id: 'mach', ko: '알루미늄 가공 공정', en: 'Aluminum machining process',
    title: '압출재를 정밀 부품으로, 7단계', titleEn: 'From extrusion to precision part, in 7 steps',
    foot: ['Profile in', 'Ship out'], steps: [
    { ko: '절단', koEn: 'Cutting', en: 'Cut', d: '압출재를 부품 길이에 맞춰 정밀 절단합니다.', dEn: 'Extrusions are precision cut to part length.', imgs: ['mach-01.jpg'] },
    { ko: '홀 가공', koEn: 'Hole machining', en: 'Drill', d: '머시닝센터에서 조립 기준이 되는 홀을 가공합니다.', dEn: 'Machining centers cut the holes that serve as assembly datums.', imgs: ['mach-02.jpg'] },
    { ko: '탭 가공', koEn: 'Tapping', en: 'Tap', d: '태핑센터 20대가 체결용 나사산을 가공합니다.', dEn: 'Twenty tapping centers cut the threads used for fastening.', imgs: ['mach-03.jpg'] },
    { ko: '브러쉬', koEn: 'Brushing', en: 'Brush', d: '가공 버를 제거하고 표면을 정리합니다.', dEn: 'Machining burrs are removed and the surface tidied up.', imgs: ['mach-04.jpg'] },
    { ko: '세척', koEn: 'Washing', en: 'Wash', d: '절삭유와 칩을 세척해 청정도를 확보합니다.', dEn: 'Cutting fluid and chips are washed off to reach the required cleanliness.', imgs: ['mach-05.jpg'] },
    { ko: '검사', koEn: 'Inspection', en: 'Inspect', d: '3차원 측정기와 영상 측정기로 치수를 검사합니다.', dEn: 'Dimensions are checked on CMMs and video measuring systems.', imgs: ['mach-06.jpg'] },
    { ko: '출하', koEn: 'Shipping', en: 'Ship', d: '포장 후 국내외 거점으로 출하합니다.', dEn: 'Packed, then shipped to sites at home and abroad.', imgs: ['mach-07.jpg'] }
  ] },
  { id: 'steel', ko: '스틸 가공 공정', en: 'Steel machining process',
    title: '스틸 원소재를 부품으로, 8단계', titleEn: 'From steel stock to finished part, in 8 steps',
    foot: ['Raw in', 'Ship out'], steps: [
    { ko: '원소재 입고', koEn: 'Raw material inbound', en: 'Inbound', d: '스틸 원소재를 입고하고 성적서를 검수합니다.', dEn: 'Steel stock arrives and its mill certificates are checked.', imgs: ['steel-01.jpg'] },
    { ko: '절단', koEn: 'Cutting', en: 'Cut', d: '부품 규격에 맞춰 원소재를 절단합니다.', dEn: 'Stock is cut to the part specification.', imgs: ['steel-02.jpg'] },
    { ko: '면취 가공', koEn: 'Chamfering', en: 'Chamfer', d: '절단면 모서리를 면취해 조립성과 안전성을 확보합니다.', dEn: 'Cut edges are chamfered for easier assembly and safer handling.', imgs: ['steel-03.jpg'] },
    { ko: '프레스 가공', koEn: 'Press forming', en: 'Press', heat: 'warm', d: '프레스로 형상을 성형합니다.', dEn: 'The shape is formed on a press.', imgs: ['steel-04.jpg'] },
    { ko: '쇼트', koEn: 'Shot blasting', en: 'Shot blast', d: '쇼트 블라스트로 스케일을 제거하고 표면을 균일하게 만듭니다.', dEn: 'Shot blasting removes scale and evens out the surface.', imgs: ['steel-05.jpg'] },
    { ko: '제조 LOT 타각', koEn: 'Lot marking', en: 'Marking', d: '추적성을 위해 제조 LOT를 타각합니다.', dEn: 'The production lot is stamped in for traceability.', imgs: ['steel-06.jpg'] },
    { ko: '검사', koEn: 'Inspection', en: 'Inspect', d: '치수와 외관을 검사합니다.', dEn: 'Dimensions and appearance are inspected.', imgs: ['steel-07.jpg'] },
    { ko: '출하', koEn: 'Shipping', en: 'Ship', d: '포장 후 출하합니다.', dEn: 'Packed, then shipped.', imgs: ['steel-08.jpg'] }
  ] }
];
export const PROCESS_IMG = PR;

export const CERT_KINDS = { '인증서': 'Certificate', '수상': 'Award', '특허': 'Patent' };

const C = 'assets/img/certs/';
export const CERTS = [
  { t: 'IATF 16949', k: '인증서', f: 'cert-63.png' }, { t: 'ISO 14001', k: '인증서', f: 'cert-65.png' }, { t: 'ISO 45001', k: '인증서', f: 'cert-64.png' },
  { t: '기업부설연구소', tEn: 'Corporate R&D Institute', k: '인증서', f: 'cert-62.png' },
  { t: '소재, 부품, 장비 전문기업', tEn: 'Materials, Components & Equipment Specialist Company', k: '인증서', f: 'cert-61.png' },
  { t: 'NICE 평가정보 2022년 기술평가 우수기업 (T-5등급)', tEn: 'NICE Information Service 2022 Technology Evaluation, Excellent Company (T-5)', k: '인증서', f: 'cert-60.png' },
  { t: '벤처기업 인증', tEn: 'Venture Company Certification', k: '인증서', f: 'cert-59.png' },
  { t: '메인비즈 인증', tEn: 'Mainbiz Certification', k: '인증서', f: 'cert-58.png' },
  { t: '이노비즈 인증', tEn: 'Innobiz Certification', k: '인증서', f: 'cert-57.png' },
  { t: '뿌리기업 인증', tEn: 'Root Industry Company Certification', k: '인증서', f: 'cert-56.png' },
  { t: '2023년 우수벤처기업 (지속성장, 글로벌)', tEn: '2023 Excellent Venture Company (Sustained Growth, Global)', k: '인증서', f: 'cert-51.png' },
  { t: '2024년 대구스타트업어워즈 대상', tEn: '2024 Daegu Startup Awards, Grand Prize', k: '수상', f: 'cert-54.png' },
  { t: '2024년 중기부 장관 표창 (제13기 청창사 우수졸업)', tEn: '2024 Commendation from the Minister of SMEs and Startups (13th Youth Startup Academy, outstanding graduate)', k: '수상', f: 'cert-53.png' },
  { t: '2022년 500만불 수출의 탑', tEn: '2022 USD 5 Million Export Tower', k: '수상', f: 'cert-50.png' },
  { t: '특허 등록증', tEn: 'Patent Registration Certificate', k: '특허', f: 'cert-55.png' },
  { t: '상표등록증', tEn: 'Trademark Registration Certificate', k: '특허', f: 'cert-67.jpg' }
].map(c => ({ ...c, src: C + c.f }));

export const HISTORY = [
  { y: 2025, ev: [
    { m: '11', l: ['벤처기업협회 중진공 대구지역 본부장상 수상', 'Plug and Play (Silicon Valley) November Summit 참여, IR Pitch 발표'],
      lEn: ['Daegu Regional Director’s Award, Korea Venture Business Association / KOSME', 'Plug and Play (Silicon Valley) November Summit, IR pitch'], h: true },
    { m: '10', l: ['자동화 가공라인 증설'], lEn: ['Automated machining line expanded'], h: true },
    { m: '06', l: ['Plug and Play (Silicon Valley) June Summit 참여, Demo Round 참여'], lEn: ['Plug and Play (Silicon Valley) June Summit, demo round'] },
    { m: '03', l: ['글로벌창업사관학교 6기 입교'], lEn: ['Admitted to the 6th Global Startup Academy'] },
    { m: '01', l: ['2024년 우수대응협력업체 상패 수상 (해외고객)'], lEn: ['2024 Outstanding Responsive Supplier award (overseas customer)'] } ] },
  { y: 2024, ev: [
    { m: '11', l: ['제8회 대구스타트업어워즈 대상 수상'], lEn: ['Grand Prize, 8th Daegu Startup Awards'], h: true },
    { m: '05', l: ['신규 사무동, 제2공장 준공 완료'], lEn: ['New office building and second plant completed'], h: true },
    { m: '02', l: ['청년창업사관학교 우수 졸업기업, 중소벤처기업부 장관 표창'], lEn: ['Outstanding graduate of the Youth Startup Academy; commendation from the Minister of SMEs and Startups'] },
    { m: '01', l: ['메인비즈 인증 획득', '이노비즈 인증 획득', '우수산학협력 경일대학교 총장 표창'],
      lEn: ['Mainbiz certification', 'Innobiz certification', 'Commendation from the President of Kyungil University for industry-academia cooperation'] } ] },
  { y: 2023, ev: [
    { m: '06', l: ['벤처기업협회 2023년 우수 벤처기업 선정 (지속성장, 글로벌)', '성과공유기업 인증 획득'],
      lEn: ['Named a 2023 Excellent Venture Company by the Korea Venture Business Association (sustained growth, global)', 'Performance-sharing company certification'], h: true },
    { m: '04', l: ['뿌리기업 선정'], lEn: ['Designated a Root Industry company'] },
    { m: '03', l: ['2022년 우수대응협력업체 상패 수상 (해외고객사)'], lEn: ['2022 Outstanding Responsive Supplier award (overseas customer)'] } ] },
  { y: 2022, ev: [
    { m: '12', l: ['59회 무역의 날 500만불 수출의 탑 수상', '미래성과공유기업 인증 획득', '벤처기업 인증 획득'],
      lEn: ['USD 5 Million Export Tower at the 59th Trade Day', 'Future performance-sharing company certification', 'Venture company certification'], h: true },
    { m: '11', l: ['ISO 45001 인증 획득'], lEn: ['ISO 45001 certification'] },
    { m: '09', l: ['소재, 부품, 장비 전문기업 인증'], lEn: ['Certified as a materials, components and equipment specialist company'] },
    { m: '04', l: ['NICE 평가정보 기술평가 우수기업 (T-5) 인증'], lEn: ['NICE Information Service technology evaluation, Excellent Company (T-5)'] } ] },
  { y: 2021, ev: [
    { m: '12', l: ['신공장 이전 (현 소재지)'], lEn: ['Moved to the new plant (current location)'], h: true },
    { m: '10', l: ['알루미늄 압출라인 투자 (1,450톤 압출 라인)', 'IATF 16949, ISO 14001 품질 인증 획득'],
      lEn: ['Invested in an aluminum extrusion line (1,450 t press)', 'IATF 16949 and ISO 14001 certification'], h: true },
    { m: '07', l: ['법인 (주)디비전 설립'], lEn: ['DVISION Co., Ltd. incorporated'] } ] },
  { y: 2020, ev: [ { m: '10', l: ['개인사업자 대영 설립'], lEn: ['Daeyoung founded as a sole proprietorship'], h: true } ] }
];

const G = 'assets/img/global/';
export const SITES = [
  { k: 'HQ', ko: '디비전 본사', en: 'DVISION head office', where: '대구광역시 달성군 구지면 국가산단대로 33길 237', whereEn: 'Guji-myeon, Dalseong-gun, Daegu, Korea', lat: 35.87, lon: 128.60, img: G + 'site-01.jpg', hq: true, map: 'DAEGU HQ' },
  { k: 'Sales office', ko: '영업 사무소', en: 'Sales office', where: '미국 미시간', whereEn: 'Michigan, USA', lat: 42.33, lon: -83.05, img: G + 'site-02.jpg', map: 'MICHIGAN SALES', dy: -14 },
  { k: 'Logistics 01', ko: '제1 물류센터', en: 'Logistics center 01', where: '미국 미시간 캔턴', whereEn: 'Canton, Michigan, USA', lat: 42.31, lon: -83.48, img: G + 'site-03.jpg', map: 'CANTON, MI / LC 01', dy: 8 },
  { k: 'Logistics 02', ko: '제2 물류센터', en: 'Logistics center 02', where: '멕시코 케레타로', whereEn: 'Querétaro, Mexico', lat: 20.59, lon: -100.39, img: G + 'site-04.jpg', map: 'QUERETARO / LC 02', dy: 8 },
  { k: 'Logistics 03', ko: '제3 물류센터', en: 'Logistics center 03', where: '미국 텍사스 라레도', whereEn: 'Laredo, Texas, USA', lat: 27.51, lon: -99.51, img: G + 'site-05.jpg', map: 'LAREDO, TX / LC 03', dy: -6 },
  { k: 'Logistics 04', ko: '제4 물류센터', en: 'Logistics center 04', where: '멕시코 몬테레이', whereEn: 'Monterrey, Mexico', lat: 25.69, lon: -100.32, img: G + 'site-06.jpg', map: 'MONTERREY / LC 04', dy: 8 }
];

export const TEST_EQUIPMENT = [
  { name: 'CMM [3-dimension]', brand: 'METRIS', spec: 'Measuring dimension for statistics control', q: 1 },
  { name: 'CMM [3-dimension]', brand: 'ZEISS', spec: 'Measuring dimension for statistics control', q: 1 },
  { name: 'UTM', brand: '', spec: 'Measuring tensile & impact strength', q: 1 },
  { name: 'Video Measuring System', brand: '', spec: 'Measuring dimension', q: 1 },
  { name: 'Contracer', brand: '', spec: 'Measuring dimension for statistics control', q: 1 },
  { name: 'Hardness Tester [R]', brand: 'Mitutoyo', spec: 'Measuring hardness of material & products', q: 1 }
];

export const HERO_BEATS = [
  { part: 0 }, { part: 1 }, { part: 2 }, { part: 3 }
];

export const ABOUT_YEARS = [
  { y: 2020, t: '개인사업자 대영 설립', tEn: 'Daeyoung founded as a sole proprietorship' },
  { y: 2021, t: '법인 (주)디비전 설립, 1,450톤 압출 라인, IATF 16949, ISO 14001, 신공장 이전', tEn: 'DVISION incorporated, 1,450 t extrusion line, IATF 16949, ISO 14001, move to the new plant', h: true },
  { y: 2022, t: '500만불 수출의 탑, ISO 45001', tEn: 'USD 5 Million Export Tower, ISO 45001' },
  { y: 2023, t: '우수 벤처기업 선정, 뿌리기업 선정', tEn: 'Named an Excellent Venture Company and a Root Industry company' },
  { y: 2024, t: '제2공장, 신규 사무동 준공, 대구스타트업어워즈 대상', tEn: 'Second plant and new office building completed, Daegu Startup Awards Grand Prize', h: true },
  { y: 2025, t: '자동화 가공라인 증설', tEn: 'Automated machining line expanded' }
];

// Organisation chart, transcribed from the site's org.png
export const ORG = { root: '대표이사', rootEn: 'CEO', staff: '기술고문', staffEn: 'Technical advisor', teams: [
  { n: '생산관리팀', nEn: 'Production management', s: ['생산팀', '생산, 공무, 현장'], sEn: ['Production', 'Production, maintenance, shop floor'] },
  { n: '구매팀', nEn: 'Purchasing', s: ['원소재', '소모품'], sEn: ['Raw materials', 'Consumables'] },
  { n: '해외영업팀', nEn: 'Overseas sales', s: ['고객관리, 해외물류'], sEn: ['Account management, overseas logistics'] },
  { n: '품질팀', nEn: 'Quality', s: ['품질보증', '시험, 측정'], sEn: ['Quality assurance', 'Testing, measurement'] },
  { n: '경영관리팀', nEn: 'Management support', s: ['재무, 인사, 노무', '안전보건, 환경'], sEn: ['Finance, HR, labour', 'Safety, health, environment'] },
  { n: '기술부설연구소', nEn: 'R&D institute', s: ['R&D, 신규제품개발'], sEn: ['R&D, new product development'] } ] };

// Events DVISION has taken part in, transcribed from the company's "사외 행사 참석" workbook.
// kind: 'out' = external event, 'in' = in-house. photos = how many <id>-NN.jpg files exist in
// EVENT_IMG (each also has a -t thumbnail). press/video hold the coverage the company logged.
// award/awardEn names the prize, when the event came with one, and medal/medalEn is the short
// form that fits on the medal pinned to the photo. Awarded events sort above the rest;
// featured is the flagship — it opens by default and sits at the very top.
export const EVENT_IMG = 'assets/img/events/';
export const EVENTS = [
  {
    id: '2026-promotion', date: '2026-06-22', kind: 'in', photos: 4,
    ko: '사내 진급행사', en: 'In-house promotion ceremony',
    org: '디비전', orgEn: 'DVISION',
    note: '대표이사 사령장 수여', noteEn: 'Letters of appointment presented by the CEO',
    press: [], video: []
  },
  {
    id: '2026-workplace-forum', date: '2026-05-21', kind: 'out', photos: 4,
    ko: '2026년 제2차 일터혁신 상생컨설팅 사례공유 포럼', en: '2026 2nd Workplace Innovation Consulting Case-Sharing Forum',
    org: '고용노동부, 노사발전재단', orgEn: 'Ministry of Employment and Labor, Labor and Management Development Foundation',
    note: '대구상공회의소', noteEn: 'Daegu Chamber of Commerce and Industry',
    press: [
      { n: '참여와혁신', nEn: 'Participation and Innovation', u: 'https://www.laborplus.co.kr/news/articleView.html?idxno=40893' },
      { n: '노사발전재단 보도자료', nEn: 'LMDF press release', u: 'https://www.nosa.or.kr/portal/nosa/FoundNews/reportData' }
    ], video: []
  },
  {
    id: '2026-posco-tech-share', date: '2026-03-18', kind: 'out', photos: 5,
    ko: '2026 산업통상자원부·포스코그룹 기술나눔 행사', en: '2026 MOTIE / POSCO Group Technology Sharing Event',
    org: '산업통상자원부, 포스코그룹, 한국산업기술진흥원', orgEn: 'MOTIE, POSCO Group, KIAT',
    note: '기술나눔 업무협약 및 특허 양도증 수여', noteEn: 'Technology-sharing agreement and patent assignment certificate',
    press: [
      { n: '동아일보', nEn: 'Dong-A Ilbo', u: 'https://www.donga.com/news/Economy/article/all/20260318/133556970/1' },
      { n: '글로벌이코노믹', nEn: 'Global Economic', u: 'https://www.g-enews.com/view.php?ud=20260319094227468324debea800_1' },
      { n: '문화저널21', nEn: 'Munhwa Journal 21', u: 'https://www.mhj21.com/news/articleView.html?idxno=251101' }
    ],
    video: [{ n: '한국산업기술진흥원', nEn: 'KIAT', u: 'https://www.youtube.com/watch?v=D30EcovDgis' }]
  },
  {
    id: '2025-workplace-innovation', date: '2025-12-12', kind: 'out', photos: 1,
    ko: '2025 일터혁신 컨퍼런스', en: '2025 Workplace Innovation Conference',
    org: '고용노동부, 노사발전재단', orgEn: 'Ministry of Employment and Labor, Labor and Management Development Foundation',
    award: '일터혁신 우수기업', awardEn: 'Workplace Innovation Excellence', medal: '우수기업', medalEn: 'Excellence',
    note: '고용노동부·노사발전재단 선정 17개사', noteEn: 'One of 17 companies selected',
    press: [
      { n: '매일경제', nEn: 'Maeil Business Newspaper', u: 'https://www.mk.co.kr/news/special-edition/11489883' },
      { n: '매일경제', nEn: 'Maeil Business Newspaper', u: 'https://www.mk.co.kr/news/special-edition/11489885' }
    ], video: []
  },
  {
    id: '2025-venture-night', date: '2025-11-18', kind: 'out', photos: 4,
    ko: '벤처기업인의 밤', en: 'Venture Entrepreneurs’ Night',
    org: '', orgEn: '',
    award: '대구지역본부장상', awardEn: 'Daegu Regional Director’s Award', medal: '본부장상', medalEn: 'Award', note: '', noteEn: '',
    press: [], video: []
  },
  {
    id: '2025-export-roundtable', date: '2025-04-03', kind: 'out', photos: 3,
    ko: '수출 중소기업 현장 간담회', en: 'Roundtable with exporting SMEs',
    org: '중소벤처기업부, 관세청', orgEn: 'Ministry of SMEs and Startups, Korea Customs Service',
    note: '', noteEn: '',
    press: [
      { n: '중소기업투데이', nEn: 'SME Today', u: 'https://www.sbiztoday.kr/news/articleView.html?idxno=23876' },
      { n: 'economy21', nEn: 'economy21', u: 'http://www.economy21.co.kr/news/articleView.html?idxno=1014968' }
    ],
    video: [{ n: '연합뉴스TV', nEn: 'Yonhap News TV', u: 'https://m.yonhapnewstv.co.kr/news/MYH20250403231303622' }]
  },
  {
    id: '2024-daegu-startup-awards', date: '2024-11-20', kind: 'out', photos: 2, featured: true,
    ko: '제8회 대구 스타트업 어워즈', en: '8th Daegu Start-up Awards',
    org: '대구광역시, 대구창조경제혁신센터', orgEn: 'Daegu Metropolitan City, Daegu Center for Creative Economy & Innovation',
    award: '대상', awardEn: 'Grand Prize', medal: '대상', medalEn: 'Grand Prize', note: '', noteEn: '',
    press: [
      { n: '헤럴드경제', nEn: 'Herald Business', u: 'https://biz.heraldcorp.com/article/10002120?ref=naver' },
      { n: '대구일보', nEn: 'Daegu Ilbo', u: 'https://www.idaegu.com/news/articleView.html?idxno=621052' },
      { n: '대구광역시 뉴스룸', nEn: 'Daegu City Newsroom', u: 'https://info.daegu.go.kr/newshome/mtnmain.php?mtnkey=articleview&aid=268762' },
      { n: '일요신문', nEn: 'Ilyo Shinmun', u: 'https://www.ilyo.co.kr/?ac=article_view&entry_id=482432' },
      { n: '뉴데일리', nEn: 'New Daily', u: 'https://tk.newdaily.co.kr/site/data/html/2024/11/20/2024112000339.html' },
      { n: '메트로신문', nEn: 'Metro Seoul', u: 'https://www.metroseoul.co.kr/article/20241120500598' },
      { n: '경북신문', nEn: 'Gyeongbuk Shinmun', u: 'https://www.kbsm.net/news/view.php?idx=454477' },
      { n: '대경일보', nEn: 'Daekyung Ilbo', u: 'https://www.dkilbo.com/news/articleView.html?idxno=470780' }
    ],
    video: [
      { n: '경북타임', nEn: 'Gyeongbuk Time', u: 'https://www.youtube.com/watch?v=C7f1JHHBF9E' },
      { n: '다경뉴스', nEn: 'Dagyeong News', u: 'https://tv.naver.com/v/64940932' }
    ]
  }
];
