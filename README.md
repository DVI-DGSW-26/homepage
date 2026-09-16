# DVISION homepage

dvi-ind.com 리메이크. 정적 사이트 + 번들러(esbuild) 구성이며 서버 없이 배포 가능합니다.

## 실행

```bash
npm install
npm run dev
```

`http://127.0.0.1:5173` 에서 확인합니다. `src/` 를 수정하면 자동으로 다시 번들됩니다.

## 빌드

```bash
npm run build
```

- `dist/` 에 배포용 정적 파일(index.html, app.js, css, assets)이 생성됩니다.
- `dist/dvision-single.html` 은 이미지와 스크립트를 모두 인라인한 단일 파일(공유, 시안 검토용)입니다.

## 구조

| 경로 | 내용 |
| --- | --- |
| `index.html` | 페이지 마크업 (정적 카피) |
| `css/style.css` | 디자인 토큰과 전체 스타일. 다크/라이트 두 벌의 `html[data-mode]` 토큰이 있고, 현재는 전 섹션이 다크입니다 |
| `src/main.js` | GSAP ScrollTrigger, 리스트 렌더링, 섹션 테마 전환, About 연출, 인터랙션 전체 |
| `src/i18n.js` | KOR / ENG 전환. 언어 상태, 정적 카피 교체(`data-en*`), 네비게이션 토글 |
| `src/scroll.js` | Lenis 스무스 스크롤, 휠 입력 정규화(마우스 노치 / 트랙패드 구분), 방향성 섹션 스냅 |
| `src/hero.js` | 히어로 파티클(자동차 부품으로 모이는 알루미늄 칩) Three.js 장면 |
| `src/parts.js` | 부품 형상(Brake Hat, Yoke, Inner Pipe, Manifold Block 등) 절차적 지오메트리 |
| `src/extrusion.js` | 프로파일 랩: 프레스 컨테이너, 금형, 프로파일 Three.js 장면과 중량 계산 |
| `src/map.js`, `src/telemetry.js` | 글로벌 거점 지도, R&D 데모 파형 (Canvas 2D) |
| `src/data.js` | 제품, 공정, 인증서, 연혁, 거점, 조직도, 행사 데이터. 사이트 내용 수정은 여기서 |
| `assets/img/events/` | 행사 사진. `<행사 id>-NN.jpg` 본판과 `-NN-t.jpg` 썸네일 한 쌍 |
| `assets/img/` | dvi-ind.com 에서 가져온 이미지(정리, 최적화본). `assets/img/site/` 는 원본 보관 |
| `assets/img/favicon*`, `apple-touch-icon.png` | 탭 아이콘. `디비전_Logo.pdf` 의 심볼을 추출해 생성 (워드마크 제외, 16px 에서 읽히도록) |
| `assets/docs/` | 카탈로그 PDF |

## 디자인 토큰

- 브랜드 보라 `#5F298C` (원본 사이트 `--brand-color`). 다크 배경에서는 `#8A5BC2 / #B79BE3` 로 밝혀 사용
- 그래파이트 `#0C1016`, 알루미늄 라이트 `#D8DBDF`
- 서체: Big Shoulders Display (영문 디스플레이), IBM Plex Sans KR (본문), IBM Plex Mono (수치)

## 배경 테마

섹션마다 `data-theme` 으로 배경 톤을 정하고, `src/main.js` 의 `applyTheme` 이 `html[data-mode]` / `html[data-bg]` 를 바꿉니다. 현재는 `index.html` 의 12개 섹션이 모두 `data-theme="dark"` 라 전환이 일어나지 않고 `#0C1016` 으로 고정됩니다.

특정 섹션만 밝은 톤으로 되돌리려면 그 `<section>` 의 `data-theme` 을 `"light"` 로 바꾸면 됩니다. 라이트 토큰과 크로스페이드 레이어는 그대로 남겨 두었습니다.

## 스크롤 동작

- 휠 한 노치는 뷰포트의 32% 이상 움직이지 않도록 제한하고, 마우스 노치는 0.6배, 트랙패드는 0.9배로 정규화합니다 (`src/scroll.js`).
- 스크롤이 멈추면 진행 방향의 다음 스냅 포인트(뷰포트 90% 이내)로 자동으로 이어서 이동합니다. 스냅 포인트는 섹션 시작, 히어로 4박자, `data-snap` / `data-snap-range` 요소입니다. 터치 기기와 `prefers-reduced-motion` 에서는 꺼집니다.

## KOR / ENG 전환

네비게이션의 KOR / ENG 버튼으로 전환합니다. 선택은 `localStorage` 에 저장되고, `?lang=en` / `?lang=ko` 를 붙이면 그 값이 우선하므로 영문 링크를 그대로 공유할 수 있습니다.

전환하면 페이지를 새로 읽습니다. GSAP SplitText 가 제목을 줄 단위로 쪼갠 뒤라 텍스트만 바꾸면 다시 쪼개고 다시 측정해야 하는데, 새로고침이 그 경로를 통째로 없앱니다.

**영문 카피를 고치는 곳**

- 마크업에 있는 문구: `index.html` 의 해당 요소에 붙은 `data-en` (텍스트), `data-en-html` (마크업이 남아야 하는 경우), `data-en-alt` / `data-en-aria` / `data-en-ph` (속성). 한국어가 원본이고 영문이 옆에 붙는 구조라 두 언어가 항상 같은 자리에 보입니다.
- 데이터에서 생성되는 문구: `src/data.js` 의 영문 짝 필드 — `desc`/`descEn`, `d`/`dEn`, `t`/`tEn`, `l`/`lEn`, `ko`/`en`. `src/i18n.js` 의 `t(ko, en)` 이 골라 씁니다.
- `<title>` 과 meta description: `src/i18n.js` 의 `META`.

## 행사 목록 (#events)

`src/data.js` 의 `EVENTS` 배열이 원본이고, 회사의 "사외 행사 참석" 엑셀에서 옮겨 왔습니다. 한 행사는 이렇게 생겼습니다.

```js
{
  id: '2026-posco-tech-share',   // 사진 파일 이름의 접두사
  date: '2026-03-18',
  kind: 'out',                   // 'out' 사외 / 'in' 사내
  photos: 5,                     // assets/img/events/<id>-01..05.jpg 가 있다는 뜻
  ko: '...', en: '...',          // 행사명
  org: '...', orgEn: '...',      // 주최
  note: '...', noteEn: '...',    // 한 줄 설명
  press: [{ n: '동아일보', nEn: 'Dong-A Ilbo', u: 'https://...' }],
  video: [{ n: '...', nEn: '...', u: 'https://...' }]
}
```

행사를 추가하려면 사진을 `assets/img/events/` 에 `<id>-01.jpg` (본판, 가로 1280px) 와 `<id>-01-t.jpg` (썸네일, 가로 460px) 한 쌍으로 넣고 `EVENTS` 맨 앞에 항목을 추가하면 됩니다. 목록은 수상한 행사(`award` 가 있는 것)가 먼저, 그중 `featured` 가 맨 위, 나머지는 최신순으로 정렬됩니다. 연도 필터는 `date` 에서 자동으로 만들어지고 같은 규칙으로 정렬됩니다. `featured` 행사는 섹션을 열었을 때 기본으로 선택됩니다.

엑셀에 있던 사진 속 인물 메모(누가 몇 번째 줄에 있는지, 영상 타임코드 등)는 사내용이라 옮기지 않았습니다.

## 아직 없는 것

- 문의 폼 백엔드 (현재는 메일 앱으로 열림)
- 실제 부품 3D 모델 (현재는 절차적 형상, GLTF 교체 지점은 `src/parts.js`)
