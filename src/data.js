// Site content pulled from dvi-ind.com (2026-09). Edit here, the DOM is generated from these tables.
const P = 'assets/img/products/';

export const PRODUCTS = [
  {
    id: 'automotive', ko: '자동차 부품', en: 'Automotive Components', desc: '차세대 모빌리티에 최적화된 알루미늄 부품',
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
    id: 'industrial', ko: '산업용 부품', en: 'Industrial Components', desc: '다양한 산업 현장을 위한 맞춤형 솔루션',
    cover: P + 'cat-industrial.jpg', thumb: P + 'thumb-industrial.jpg', icon: P + 'icon-industrial-white.png',
    groups: [ { ko: '프레임', en: 'Frames', parts: [ { name: 'Door Frame', img: 'industrial-01.jpg' }, { name: 'Frame', img: 'industrial-02.jpg' }, { name: 'Frame', img: 'industrial-03.jpg' } ] } ]
  },
  {
    id: 'architecture', ko: '건축 및 내외장재 부품', en: 'Architectural Interior & Exterior', desc: '도시를 더욱 가볍고 아름답게',
    cover: P + 'cat-architecture.jpg', thumb: P + 'thumb-architecture.jpg', icon: P + 'icon-architecture-white.png',
    groups: [ { ko: '프레임', en: 'Frames', parts: [ { name: 'Door Frame', img: 'industrial-01.jpg' }, { name: 'Frame', img: 'industrial-02.jpg' } ] } ]
  },
  {
    id: 'aerospace', ko: '항공 우주 방산 부품', en: 'Aerospace & Defense', desc: '극한 환경에서도 빛나는 정밀 경량화',
    cover: P + 'cat-aerospace.jpg', thumb: P + 'thumb-aerospace.jpg', icon: P + 'icon-aerospace-white.png',
    groups: [ { ko: '파이프', en: 'Pipes', parts: [ { name: 'Pipe', img: 'aero-01.jpg' }, { name: 'Pipe', img: 'aero-02.jpg' }, { name: 'Pipe', img: 'aero-03.jpg' }, { name: 'Pipe', img: 'aero-04.jpg' } ] } ]
  }
];

const PR = 'assets/img/process/';
export const PROCESSES = [
  { id: 'ext', ko: '알루미늄 압출 공정', en: 'Aluminum extrusion', foot: ['Billet in', 'Ship out'], steps: [
    { ko: 'Billet 입고', en: 'Inbound', d: '원소재 알루미늄 빌렛을 입고하고 합금, 치수, 성적서를 검수합니다.', imgs: ['ext-01-1.jpg', 'ext-01-2.jpg'] },
    { ko: 'Billet 표면 브러싱', en: 'Surface', d: '표면의 산화층과 이물을 제거해 압출 결함을 예방합니다.', imgs: ['ext-02-1.jpg', 'ext-02-2.jpg'] },
    { ko: 'Billet 예열 및 절단', en: 'Heat', heat: 'hot', d: '빌렛을 압출 가능한 온도까지 예열한 뒤 프레스 길이에 맞춰 절단합니다.', imgs: ['ext-03-1.jpg', 'ext-03-2.jpg'] },
    { ko: '금형 예열', en: 'Heat', heat: 'hot', d: '단면 형상을 결정하는 금형을 작업 온도로 예열해 소재와의 온도차를 줄입니다.', imgs: ['ext-04-1.jpg', 'ext-04-2.jpg'] },
    { ko: '압출', en: 'Press', heat: 'hot', d: '1,450 t와 3,500 t 프레스가 빌렛을 금형으로 밀어 연속된 단면 형상을 뽑아냅니다.', imgs: ['ext-05-1.jpg', 'ext-05-2.jpg'] },
    { ko: '퀜칭', en: 'Quench', heat: 'cool', d: '수냉 또는 공냉으로 급속 냉각해 합금 원소를 고용 상태로 고정합니다.', imgs: ['ext-06-1.jpg', 'ext-06-2.jpg'] },
    { ko: '스트레칭', en: 'Stretch', d: '양 끝을 당겨 잔류응력을 제거하고 직진도와 비틀림을 교정합니다.', imgs: ['ext-07-1.jpg', 'ext-07-2.jpg'] },
    { ko: '제품 절단', en: 'Cut', d: '고객 규격 길이로 절단하고 절단면을 정리합니다.', imgs: ['ext-08-1.jpg', 'ext-08-2.jpg'] },
    { ko: '팔레트 적재', en: 'Stack', d: '열처리로에 들어갈 수 있도록 간격을 두고 팔레트에 적재합니다.', imgs: ['ext-09-1.jpg', 'ext-09-2.jpg'] },
    { ko: '열처리', en: 'Aging', heat: 'warm', d: 'T6 시효 열처리로 강도와 경도를 최종 물성까지 끌어올립니다.', imgs: ['ext-10-1.jpg'] },
    { ko: '포장, 출하', en: 'Ship', d: '치수와 외관 검사를 마친 제품을 포장해 국내외 거점으로 출하합니다.', imgs: ['ext-11-1.jpg', 'ext-11-2.jpg'] }
  ] },
  { id: 'mach', ko: '알루미늄 가공 공정', en: 'Aluminum machining', foot: ['Profile in', 'Ship out'], steps: [
    { ko: '절단', en: 'Cut', d: '압출재를 부품 길이에 맞춰 정밀 절단합니다.', imgs: ['mach-01.jpg'] },
    { ko: '홀 가공', en: 'Drill', d: '머시닝센터에서 조립 기준이 되는 홀을 가공합니다.', imgs: ['mach-02.jpg'] },
    { ko: '탭 가공', en: 'Tap', d: '태핑센터 20대가 체결용 나사산을 가공합니다.', imgs: ['mach-03.jpg'] },
    { ko: '브러쉬', en: 'Brush', d: '가공 버를 제거하고 표면을 정리합니다.', imgs: ['mach-04.jpg'] },
    { ko: '세척', en: 'Wash', d: '절삭유와 칩을 세척해 청정도를 확보합니다.', imgs: ['mach-05.jpg'] },
    { ko: '검사', en: 'Inspect', d: '3차원 측정기와 영상 측정기로 치수를 검사합니다.', imgs: ['mach-06.jpg'] },
    { ko: '출하', en: 'Ship', d: '포장 후 국내외 거점으로 출하합니다.', imgs: ['mach-07.jpg'] }
  ] },
  { id: 'steel', ko: '스틸 가공 공정', en: 'Steel machining', foot: ['Raw in', 'Ship out'], steps: [
    { ko: '원소재 입고', en: 'Inbound', d: '스틸 원소재를 입고하고 성적서를 검수합니다.', imgs: ['steel-01.jpg'] },
    { ko: '절단', en: 'Cut', d: '부품 규격에 맞춰 원소재를 절단합니다.', imgs: ['steel-02.jpg'] },
    { ko: '면취 가공', en: 'Chamfer', d: '절단면 모서리를 면취해 조립성과 안전성을 확보합니다.', imgs: ['steel-03.jpg'] },
    { ko: '프레스 가공', en: 'Press', heat: 'warm', d: '프레스로 형상을 성형합니다.', imgs: ['steel-04.jpg'] },
    { ko: '쇼트', en: 'Shot blast', d: '쇼트 블라스트로 스케일을 제거하고 표면을 균일하게 만듭니다.', imgs: ['steel-05.jpg'] },
    { ko: '제조 LOT 타각', en: 'Marking', d: '추적성을 위해 제조 LOT를 타각합니다.', imgs: ['steel-06.jpg'] },
    { ko: '검사', en: 'Inspect', d: '치수와 외관을 검사합니다.', imgs: ['steel-07.jpg'] },
    { ko: '출하', en: 'Ship', d: '포장 후 출하합니다.', imgs: ['steel-08.jpg'] }
  ] }
];
export const PROCESS_IMG = PR;

const C = 'assets/img/certs/';
export const CERTS = [
  { t: 'IATF 16949', k: '인증서', f: 'cert-63.jpg' }, { t: 'ISO 14001', k: '인증서', f: 'cert-65.jpg' }, { t: 'ISO 45001', k: '인증서', f: 'cert-64.jpg' },
  { t: '기업부설연구소', k: '인증서', f: 'cert-62.jpg' }, { t: '소재, 부품, 장비 전문기업', k: '인증서', f: 'cert-61.jpg' },
  { t: 'NICE 평가정보 2022년 기술평가 우수기업 (T-5등급)', k: '인증서', f: 'cert-60.jpg' }, { t: '벤처기업 인증', k: '인증서', f: 'cert-59.jpg' },
  { t: '메인비즈 인증', k: '인증서', f: 'cert-58.jpg' }, { t: '이노비즈 인증', k: '인증서', f: 'cert-57.jpg' }, { t: '뿌리기업 인증', k: '인증서', f: 'cert-56.png' },
  { t: '2023년 우수벤처기업 (지속성장, 글로벌)', k: '인증서', f: 'cert-51.png' },
  { t: '2024년 대구스타트업어워즈 대상', k: '수상', f: 'cert-54.jpg' }, { t: '2024년 중기부 장관 표창 (제13기 청창사 우수졸업)', k: '수상', f: 'cert-53.jpg' },
  { t: '2022년 500만불 수출의 탑', k: '수상', f: 'cert-50.jpg' },
  { t: '특허 등록증', k: '특허', f: 'cert-55.jpg' }, { t: '상표등록증', k: '특허', f: 'cert-67.jpg' }
].map(c => ({ ...c, src: C + c.f }));

export const HISTORY = [
  { y: 2025, ev: [
    { m: '11', l: ['벤처기업협회 중진공 대구지역 본부장상 수상', 'Plug and Play (Silicon Valley) November Summit 참여, IR Pitch 발표'], h: true },
    { m: '10', l: ['자동화 가공라인 증설'], h: true },
    { m: '06', l: ['Plug and Play (Silicon Valley) June Summit 참여, Demo Round 참여'] },
    { m: '03', l: ['글로벌창업사관학교 6기 입교'] },
    { m: '01', l: ['2024년 우수대응협력업체 상패 수상 (해외고객)'] } ] },
  { y: 2024, ev: [
    { m: '11', l: ['제8회 대구스타트업어워즈 대상 수상'], h: true },
    { m: '05', l: ['신규 사무동, 제2공장 준공 완료'], h: true },
    { m: '02', l: ['청년창업사관학교 우수 졸업기업, 중소벤처기업부 장관 표창'] },
    { m: '01', l: ['메인비즈 인증 획득', '이노비즈 인증 획득', '우수산학협력 경일대학교 총장 표창'] } ] },
  { y: 2023, ev: [
    { m: '06', l: ['벤처기업협회 2023년 우수 벤처기업 선정 (지속성장, 글로벌)', '성과공유기업 인증 획득'], h: true },
    { m: '04', l: ['뿌리기업 선정'] },
    { m: '03', l: ['2022년 우수대응협력업체 상패 수상 (해외고객사)'] } ] },
  { y: 2022, ev: [
    { m: '12', l: ['59회 무역의 날 500만불 수출의 탑 수상', '미래성과공유기업 인증 획득', '벤처기업 인증 획득'], h: true },
    { m: '11', l: ['ISO 45001 인증 획득'] },
    { m: '09', l: ['소재, 부품, 장비 전문기업 인증'] },
    { m: '04', l: ['NICE 평가정보 기술평가 우수기업 (T-5) 인증'] } ] },
  { y: 2021, ev: [
    { m: '12', l: ['신공장 이전 (현 소재지)'], h: true },
    { m: '10', l: ['알루미늄 압출라인 투자 (1,450톤 압출 라인)', 'IATF 16949, ISO 14001 품질 인증 획득'], h: true },
    { m: '07', l: ['법인 (주)디비전 설립'] } ] },
  { y: 2020, ev: [ { m: '10', l: ['개인사업자 대영 설립'], h: true } ] }
];

const G = 'assets/img/global/';
export const SITES = [
  { k: 'HQ', ko: '디비전 본사', where: '대구광역시 달성군 구지면 국가산단대로 33길 237', lat: 35.87, lon: 128.60, img: G + 'site-01.jpg', hq: true, map: 'DAEGU HQ' },
  { k: 'Sales office', ko: '영업 사무소', where: '미국 미시간', lat: 42.33, lon: -83.05, img: G + 'site-02.jpg', map: 'MICHIGAN SALES', dy: -14 },
  { k: 'Logistics 01', ko: '제1 물류센터', where: '미국 미시간 캔턴', lat: 42.31, lon: -83.48, img: G + 'site-03.jpg', map: 'CANTON, MI / LC 01', dy: 8 },
  { k: 'Logistics 02', ko: '제2 물류센터', where: '멕시코 케레타로', lat: 20.59, lon: -100.39, img: G + 'site-04.jpg', map: 'QUERETARO / LC 02', dy: 8 },
  { k: 'Logistics 03', ko: '제3 물류센터', where: '미국 텍사스 라레도', lat: 27.51, lon: -99.51, img: G + 'site-05.jpg', map: 'LAREDO, TX / LC 03', dy: -6 },
  { k: 'Logistics 04', ko: '제4 물류센터', where: '멕시코 몬테레이', lat: 25.69, lon: -100.32, img: G + 'site-06.jpg', map: 'MONTERREY / LC 04', dy: 8 }
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
  { y: 2020, t: '개인사업자 대영 설립' },
  { y: 2021, t: '법인 (주)디비전 설립, 1,450톤 압출 라인, IATF 16949, ISO 14001, 신공장 이전', h: true },
  { y: 2022, t: '500만불 수출의 탑, ISO 45001' },
  { y: 2023, t: '우수 벤처기업 선정, 뿌리기업 선정' },
  { y: 2024, t: '제2공장, 신규 사무동 준공, 대구스타트업어워즈 대상', h: true },
  { y: 2025, t: '자동화 가공라인 증설' }
];

// Organisation chart, transcribed from the site's org.png
export const ORG = { root: '대표이사', staff: '기술고문', teams: [
  { n: '생산관리팀', s: ['생산팀', '생산, 공무, 현장'] },
  { n: '구매팀', s: ['원소재', '소모품'] },
  { n: '해외영업팀', s: ['고객관리, 해외물류'] },
  { n: '품질팀', s: ['품질보증', '시험, 측정'] },
  { n: '경영관리팀', s: ['재무, 인사, 노무', '안전보건, 환경'] },
  { n: '기술부설연구소', s: ['R&D, 신규제품개발'] } ] };
