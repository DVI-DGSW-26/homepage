# DVISION homepage

dvi-ind.com 리메이크. React + Vite + Tailwind CSS(v4) + TypeScript 정적 사이트이며 서버 없이 배포 가능합니다. 패키지 매니저는 pnpm 입니다.
전에 있던 JS로 만든 homepage는 main-old 브런치로 옮겼습니다. https://github.com/DVI-DGSW-26/homepage/tree/main-old

또한 [feature/Separation](https://github.com/DVI-DGSW-26/homepage/tree/main)
는 현재 페이지 스크롤을 많이 해야하는 문제를 줄인 브런치입니다. 

다른 브런치에 push , merge , pull 등 다른 branch와 관여하지않습니다.


전에 있던 JS로 만든 homepage는 main-old 브런치로 옮겼습니다.
https://github.com/DVI-DGSW-26/homepage/tree/main-old
## 실행

```bash
pnpm install
pnpm dev
```

`http://127.0.0.1:5173` 에서 확인합니다. 개발 서버는 `<StrictMode>` 로 돌기 때문에 모든 effect 가 마운트 직후 한 번 정리되고 다시 실행됩니다. GSAP, Three.js, Canvas 장면은 이 정리를 견디도록 만들어져 있습니다 (아래 "애니메이션 규칙").

## 빌드

```bash
pnpm build      # 이미지 변환 → 타입 검사 → vite build → 단일 파일
pnpm preview    # dist/ 를 http://127.0.0.1:4173 에서 확인
pnpm typecheck  # 타입 검사만
pnpm images     # 이미지 변환만 (dev / build 가 자동으로 먼저 실행)
pnpm coast      # 지도 해안선 데이터 다시 만들기 (결과는 커밋돼 있어 평소엔 필요 없음)
```

- `dist/` 에 배포용 정적 파일(index.html, 해시가 붙은 JS/CSS, `public/` 의 에셋)이 생성됩니다. Vercel 은 `vercel.json` 대로 `pnpm build` 후 `dist/` 를 배포하고, `/company` 같은 페이지 경로는 `index.html` 로 보냅니다(rewrites). 페이지를 더하면 `src/lib/router.ts` 의 `PAGES` 와 함께 여기도 고칩니다.
- `dist/dvision-single.html` 은 이미지, 스크립트, 스타일을 모두 인라인한 단일 파일(공유, 시안 검토용)입니다. `scripts/single.mjs` 가 만들며, 다운로드가 막힌 뷰어를 위해 카탈로그 PDF 는 dvi-ind.com 원본을 새 탭으로 엽니다.

## 구조

| 경로 | 내용 |
| --- | --- |
| `index.html` | Vite 진입점. `<head>`(파비콘, 폰트, meta, 저장된 라이트 모드를 첫 페인트 전에 적용하는 인라인 스크립트)와 `#root` |
| `src/main.tsx` | 영문 meta 적용 후 `<App>` 렌더 |
| `src/App.tsx` | 페이지별 섹션 배치(`/` 홈, `/company`, `/qac-flow`, `/data`, 모든 페이지 끝에 문의), 앵커 스크롤, 페이지마다 스크롤 연출 시작 |
| `src/lib/router.ts` | 페이지 경로와 새로고침 없는 이동(`navigate`, 뒤로/앞으로 포함). 한 페이지 시절의 `/#섹션` 링크는 그 섹션이 있는 페이지로 옮김 (`/?lang=en#qac-flow` → `/qac-flow`). 없는 경로는 홈 |
| `src/token.css` | 모든 디자인 값: 브레이크포인트, 서체, 글자 크기·자간·행간, 유동 간격, 측정폭, 모서리, 이징, 그림자, 색(고정 / 모드별), 사진 스크림, WebGL·캔버스·메달 색, 모션 시간 |
| `src/styles.css` | Tailwind 진입점. 변형(`light:`, `booting:`, 화면 모양·자세 `narrow:` `wide:` `low:` `tall:` `short:` `spanned:` `spanned-y:`), 기본 요소 스타일, 공용 유틸리티, 유틸리티로 표현할 수 없는 것(슬라이더 thumb, 히어로 제목을 쪼갠 글자 노드) |
| `src/animation.css` | CSS 로 움직이는 것 전부: keyframes, 마키(`.marquee`), 스크롤 큐, 테마 크로스페이드, 헤더 바 ↔ 알약 전환, 각각의 reduced-motion 처리 |
| `src/components/Img.tsx` | 모든 사진·로고를 그리는 `<Img>` (next/image 대응: AVIF/WebP srcset, 고유 크기, 지연 로딩, 플레이스홀더, `priority`) |
| `scripts/images.mjs` | 빌드 전 이미지 변환: `public/assets/opt/` 에 폭별 AVIF/WebP, `src/generated/images.json` 에 목록(둘 다 생성물, git 제외) |
| `src/components/ui.tsx` | 공용 조각: `Section`, `SecHead`, `Eyebrow`, `H2`, `IndexHead`, `Photo`, `btn()`, `cn()` |
| `src/components/Nav.tsx` | 헤더(홈은 히어로 위 전폭 바 → 알약, 다른 페이지는 처음부터 알약), 페이지 메뉴, KOR / ENG 토글, 테마 버튼 |
| `src/components/Hero.tsx` | 히어로 4박자 카피, HUD, 마키 |
| `src/components/Directory.tsx` | 홈의 3-Engine 화면: 대각선 두 줄로 한 화면을 제조(`/company`), 솔루션(`/qac-flow`), 데이터(`/data`) 세 칸으로 나누고(가운데 칸은 위가 좁은 사다리꼴), 칸마다 사진과 색으로 채우고 위에 문구. 들어오면 선이 그어지고 세 사진이 함께 열림. 마우스를 올리거나 탭 키로 고른 칸만 남기고 나머지 둘은 흑백으로 가라앉음(고른 칸은 사진이 밝아지고, 경계 대각선이 그 칸 색으로 켜지고, 빛줄기가 한 번 사선으로 지나감). 1200px 아래에서는 완만한 대각선으로 위아래로 쌓임 |
| `src/components/About.tsx` | 매니페스토, Frame 01(사진 위에 제목·캡션·수치), 여섯 해 레일, 약속, 고객사 마키, 조직도 |
| `src/components/Product.tsx` | 제품 카테고리 / 부품 행 / 갤러리, 슬로건(Statement) |
| `src/components/Config.tsx` | 프로파일 랩(단면 설정기 + 압출 장면) |
| `src/components/Process.tsx` | 제조 공정 탭과 가로 스크롤 |
| `src/components/Equipment.tsx` | 설비, 시험장비 표, 설비 사진 |
| `src/components/Rnd.tsx` | R&D, 텔레메트리, ESG, 인증서 마키 |
| `src/components/Global.tsx` | 글로벌 거점 지도와 거점 목록, 연혁(History) |
| `src/components/QacFlow.tsx` | Q.A.C-Flow 품질검사 솔루션 페이지(`/qac-flow`). 화면 캡처는 `public/assets/img/qacflow/` (고객사명, 작업자 실명은 이미지에서 가림). 제품색 마젠타는 `qf-*` 토큰으로 이 섹션에서만 씀. CES QR 코드 `/?lang=en#qac-flow` 는 이 페이지로 이동 |
| `src/components/Future.tsx` | 데이터 산업 페이지(`/data`): 제조에서 데이터 사업까지의 흐름, 2026–2029 로드맵 |
| `src/components/Events.tsx` | 행사 목록과 상세 (지금은 어느 페이지에도 없음) |
| `src/components/Contact.tsx` | 문의, 푸터(모든 페이지), 커뮤니티(지금은 어느 페이지에도 없음) |
| `src/i18n/` | KOR / ENG. `locales/ko.ts`·`locales/en.ts` 화면 문구 사전, `store.ts` 언어 상태·`useT`·`pick`·`useLang`·`setLang`, `rich.tsx` 태그가 섞인 문구 렌더, `meta.ts` `<html lang>`·`<title>`·meta description, `index.ts` 진입점 |
| `src/lib/tokens.ts` | 스크립트에서 토큰 읽기: `token('--scene-alu')`, `withAlpha()`, 모드 전환 때 다시 읽는 `modeTokens()` (캔버스, WebGL 장면) |
| `src/lib/theme.ts` | 다크 / 라이트 모드 상태(`useTheme`, `setTheme`), 저장, 크로스페이드 |
| `src/lib/scroll.ts` | 네이티브 스크롤 이동(`scroll.scrollTo`)과 앵커 링크 처리 |
| `src/lib/reveals.ts` | 마커 클래스 기반 페이지 전역 리빌(한 번만 재생), 사진 와이프, 숫자 카운트업 |
| `src/lib/gsap.ts`, `boot.ts`, `env.ts` | GSAP 플러그인 등록, 부팅 시점(웹폰트, 최대 1.5초), 환경 상수 |
| `src/three/hero.ts` | 히어로 파티클(자동차 부품으로 모이는 알루미늄 칩) Three.js 장면 |
| `src/three/parts.ts` | 부품 형상(Brake Hat, Yoke, Inner Pipe 등) 절차적 지오메트리와 HUD 라벨 |
| `src/three/extrusion.ts` | 프로파일 랩: 프레스 컨테이너, 금형, 프로파일 Three.js 장면과 중량 계산 |
| `src/canvas/map.ts`, `telemetry.ts` | 글로벌 거점 지도(태평양 중심 메르카토르, 실제 해안선), R&D 데모 파형 (Canvas 2D) |
| `src/canvas/coast.json`, `scripts/coast.mjs` | 지도 해안선. Natural Earth 1:50m 육지(world-atlas, 공개 데이터)를 지도 범위로 잘라 단순화한 것. 범위를 바꾸면 `pnpm coast` 로 다시 만듭니다(map.ts 와 같은 LON0/LON1/LAT0) |
| `src/data.ts` | 제품, 공정, 인증서, 연혁, 거점, 조직도, 행사 데이터와 타입. 사이트 내용 수정은 여기서 |
| `public/assets/img/` | dvi-ind.com 에서 가져온 이미지(정리, 최적화본). 코드에서는 `assets/img/...` 로 참조 |
| `public/assets/img/events/` | 행사 사진. `<행사 id>-NN.jpg` 본판과 `-NN-t.jpg` 썸네일 한 쌍 |
| `public/assets/img/favicon*`, `apple-touch-icon.png` | 탭 아이콘. `디비전_Logo.pdf` 의 심볼을 추출해 생성 (워드마크 제외, 16px 에서 읽히도록) |
| `public/assets/docs/` | 카탈로그 PDF |
| `archive/site/` | dvi-ind.com 원본 이미지 보관 (배포에 포함되지 않음) |

## 디자인 토큰과 Tailwind

디자인 값은 전부 `src/token.css` 에 있고, 컴포넌트는 그 토큰이 만드는 Tailwind v4 유틸리티로만 씁니다. `.tsx` 에 hex·rgba 나 반복되는 임의값을 쓰지 않습니다.

- **색**: 모드를 따르는 색 `bg-bg` `bg-bg-2` `bg-card` `text-fg` `text-fg-2` `text-mute` `border-line` `border-line-2` `text-acc` `text-acc-2` `text-acc-ink` `bg-acc-glow` `bg-nav` `text-gold`. 두 모드에서 같은 색 `ink-*`(늘 그래파이트인 면), `paper`, `brand`(#5F298C), `ink-acc`, `on-photo`(사진 위 글자), `on-acc`(보라 위 글자), `plate`(로고·스캔 뒤 흰 판). 투명도는 `text-on-photo/70`, `bg-ink/55` 처럼 붙입니다.
- **사진 스크림·외곽선**: `bg-(image:--scrim-frame)`, `--scrim-card`, `--scrim-card-deep`, `--scrim-band`; 외곽선 글자 `[-webkit-text-stroke:1px_var(--stroke-on-photo)]`. 그림자 `text-shadow-photo`, `drop-shadow-medal`.
- **글자**: 크기 `text-tag` .66 · `micro` .7 · `label` .74 · `mono-sm` .78 · `mono` .8 · `caption` .84 · `small` .9 · `body-sm` .95 · `body` 1 · `body-lg` 1.05 · `title-xs/sm/title/lg` 1.15–1.35 · `index` 1.4 · `figure-xs/sm/figure` 1.5–2rem, 그리고 유동 크기 `text-hero` `text-h2` `text-statement` `text-manifesto` `text-kpi` 등. 어떤 크기도 행간을 함께 바꾸지 않습니다. 자간 `tracking-display/heading/heading-sm/button/name/spec/mono-sm/tag/label`(+ Tailwind `tracking-widest` .1em, `tracking-tight`), 행간 `leading-display` .9 · `hero` · `statement` · `copy` 1.6 등.
- **간격**: 고정 px 는 Tailwind 4px 스케일(`gap-4.5` = 18px, `size-18` = 72px)을 쓰고, 화면에 따라 변하는 값은 이름 있는 토큰입니다: `gutter`(좌우 여백, `px-gutter`), `wrap`(본문 열 폭), `section`(섹션 위아래), `sec-head`, `stack` / `stack-md` / `stack-sm`(블록 사이), `col-gap`, `nav-clear` 등. 측정폭 `max-w-measure`(26em) · `lead` · `hero-copy` · `hero-title`, 본문 열 최대 `--container-page`(1480px). 모서리 `rounded-tag` 3px · `thumb` 5px · `card` 8px · `pill` 40px.
- **이름 규칙**: Tailwind 는 같은 이름을 여러 유틸리티에 씁니다. `--spacing-block` 은 `inline-block` 을 `inline-size` 로 바꿔 버리고, `--spacing-x` 와 `--container-x` 가 같으면 `max-w-x` 가 간격 쪽을 씁니다. 새 토큰 이름은 기존 클래스(`block`, `flex`, `grid` …)·다른 네임스페이스와 겹치지 않게 짓고, `cn()` 의 목록(`src/components/ui.tsx`)에도 추가합니다. 빠뜨리면 tailwind-merge 가 새 `text-*` 를 색으로 읽어 옆의 색 클래스를 지웁니다.
- **스크립트**: 캔버스와 WebGL 은 `src/lib/tokens.ts` 로 `--fg`, `--scene-*`, `--font-mono` 등을 읽습니다. 셰이더에 바로 쓰는 색은 `raw()` 로 변환 없이 넘깁니다(`src/three/hero.ts`).
- **v4 문법**: 비율 `aspect-800/216`, 시간 `duration-450`, 크기 `scale-106`, 투명도 `opacity-34`, 필터 `brightness-230`, 자식 `*:col-span-full`, 그라디언트 `bg-linear-to-r/srgb from-fg to-acc`(원래처럼 sRGB 보간), CSS 변수 `px-(--x)` / `bg-(image:--x)`. GSAP 이 transform 을 쓰는 요소의 초기값만 `[transform:...]` 로 둡니다(아래 "애니메이션 규칙").
- 서체: Big Shoulders Display (`font-display`), IBM Plex Sans KR (`font-sans`, 본문), IBM Plex Mono (`font-mono`, 수치).
- 공용 유틸리티: `wrap`(본문 폭), `pad-wrap`(전폭 블록의 내용을 `wrap` 열에 맞추는 좌우 패딩 — 헤더 바, Frame 01), `mono`, `disp`, `num`(tabular 숫자), `text-stroke`.
- 브레이크포인트는 기기 구간으로 나눕니다(데스크톱 우선, `max-*`). `max-2xs` 361 미만(폴드 커버 화면) · `max-sm` 600 미만(세로 폰, Surface Duo 한 화면) · `sm`–`md` 600~859(세로 태블릿, 펼친 Z Fold, 가로 폰) · `md`–`lg` 860~1199(가로 태블릿, 세로 iPad Pro 12.9", 펼친 iPhone Duo 890×626) · `lg` 1200 이상(노트북·데스크톱, `max-xl` 1280 미만은 그 좁은 쪽). JS 는 `src/lib/env.ts` 의 `SM` / `LG` / `NARROW` / `SPANNED` 로 같은 값을 씁니다.
- 폭만으로 정할 수 없는 것은 모양·자세 변형으로 씁니다. `narrow:` 한 단(폰, 또는 세워 든 태블릿: 600px 미만이거나 1200px 미만 세로 화면)과 그 정확한 반대인 `wide:`(프로파일 랩이 이 둘로 쌓기 / 유리 패널을 가릅니다), `low:` 가로로 눕힌 폰(높이 540px 이하), `tall:` 높이 700px 이상(행사 상세가 sticky 되는 조건), `short:` 높이 780px 이하. Tailwind 기본 `portrait:` / `landscape:`, `pointer-coarse:` 도 씁니다.
- 듀얼 스크린(Surface Duo, 폴더블)은 Viewport Segments 로 대응합니다. `spanned:` 는 두 화면을 좌우로 펼친 상태로, 가운데 힌지를 글자가 가로지르지 않도록 두 단 블록을 화면 하나에 한 단씩 놓습니다(`hinge-cols` 유틸리티, 간격 토큰 `gap-x-hinge` / `gap-x-hinge-gap`). `spanned-y:` 는 위아래로 펼친 상태입니다. 지원하지 않는 브라우저에서는 힌지 폭이 0 이 되어 아무 것도 바뀌지 않습니다. 확인은 Chrome DevTools 의 Surface Duo 기기(힌지 표시)로 합니다.
- 히어로와 프로파일 랩의 3D 장면은 폭이 아니라 캔버스 비율(세로 / 가로)과 펼침 상태로 위치·크기를 정합니다(`src/three/hero.ts` 의 `place`, `extrusion.ts` 는 `NARROW`). 한국어는 `:lang(ko)` 에서 `word-break: keep-all` 이 걸려 단어 중간에서 줄바꿈되지 않습니다.
- `light:` 변형은 `html[data-mode="light"]` 일 때 적용됩니다. `booting:` 변형은 히어로 인트로가 시작되기 전(`html` 에 `data-ready` 가 붙기 전)에만 적용되며, 인트로로 등장할 카피·HUD·내비를 그때까지 숨깁니다.

## 다크 / 라이트 모드

헤더의 해·달 버튼으로 바꿉니다(기본 다크). 선택은 `localStorage` 의 `dv-theme` 에 저장되고, `index.html` 의 인라인 스크립트가 첫 페인트 전에 `html[data-mode]` / `html[data-bg]` 를 맞춰 라이트 방문자도 다크 화면이 번쩍이지 않습니다(단일 파일에도 같은 스크립트가 들어갑니다).

전환은 컴포지터만 씁니다. `data-bg` 가 먼저 바뀌어 고정된 두 배경 레이어가 크로스페이드되고(`animation.css`), 색 토큰(`data-mode`)은 그 중간 지점에서 한 번 바뀝니다(`src/lib/theme.ts`). 히어로도 모드를 따릅니다. 배너 사진은 원본부터 어둡게 처리돼 있어, 라이트에서는 CSS 필터로 밝히고(`brightness(2.3) contrast(.82) saturate(.75)`) 위의 베일을 페이지 색(`--bg`)으로 바꿉니다. 3D 부품과 칩은 밝은 배경에 묻히지 않도록 어두운 금속 톤으로 0.6초에 걸쳐 바뀝니다(`createHero` 의 `setLight`). 슬로건과 Frame 01 은 사진 위에 글자를 얹은 면이라 라이트에서도 그래파이트로 남습니다.

## 이미지

사진과 로고는 `<img>` 대신 `<Img>` (`src/components/Img.tsx`) 로 그립니다. next/image 와 같은 일을 빌드 시점에 해 둡니다.

- `pnpm dev` / `pnpm build` 가 먼저 `scripts/images.mjs` 를 돌려 `public/assets/img/` 의 JPG/PNG 마다 AVIF·WebP 를 480 / 828 / 1200 / 1600 / 2048px(원본보다 넓은 폭은 만들지 않음)로 만들고, 목록을 `src/generated/images.json` 에 씁니다. 파일 이름에 원본 해시가 들어가 영구 캐시해도 되고, 사진을 바꾸면 주소도 바뀝니다. 4KB 미만(아이콘, 작은 로고)은 원본 그대로 씁니다.
- 변환 결과는 `node_modules/.cache/dv-img` 에 남아, 새로 넣거나 바꾼 사진만 다시 변환합니다(처음 약 40초, 이후 2초 안팎). 지운 원본의 사본은 다음 실행 때 지워집니다.
- `<Img src="assets/img/..." sizes="(max-width: 859px) 50vw, 25vw" />` — `sizes` 에 화면에서 그려지는 폭을 적으면 브라우저가 맞는 파일을 고릅니다(기본 `100vw`). 첫 화면 이미지는 `priority`(즉시, 높은 우선순위). 너비·높이는 목록에서 자동으로 붙고, 불투명한 사진은 로딩 중 평균색(800px 이상은 16px 흐림 미리보기)이 깔립니다.
- `<picture>` 는 `display: contents` 라 클래스, ref, 그리드 배치는 지금처럼 `<img>` 에 겁니다.
- 새 사진은 `public/assets/img/` 에 넣고 `<Img>` 로 쓰면 됩니다. 목록에 없는 경로는 일반 `<img>` 로 그려집니다.
- 단일 파일(`dvision-single.html`)에는 원본만 data URI 로 들어가고, `<Img>` 가 이를 알아채 일반 `<img>` 를 그립니다.

## 헤더

히어로 위에서는 가장자리까지 닿는 바(모서리 없음, 내용은 `wrap` 열에 맞춤)이고, 히어로 아래 끝이 헤더에 닿으면 `wrap` 폭의 떠 있는 알약으로 줄어듭니다(`header[data-pill]`, 전환은 `animation.css` 의 `.nav-morph`). 스크롤 방향에 따라 숨지 않습니다. 1200px 미만에서는 메뉴가 메뉴 버튼 뒤의 전체 화면 시트(모달 `<dialog>`)로 옮겨 가고, 폰에서는 문의 버튼이 화살표만 남으며 폴드 커버 화면(361px 미만)에서는 빠집니다(시트 아래에 문의 버튼이 있습니다).

## 스크롤 동작

- 네이티브 스크롤입니다. 휠·트랙패드·키보드가 브라우저 그대로 1:1 로 반응하고, 스크롤 자체는 메인 스레드가 바빠도 끊기지 않습니다.
- 스크롤 위치에 묶인(스크럽) 애니메이션은 없습니다. 연출은 블록이 화면에 들어올 때 한 번 재생되거나(여섯 해 레일, 매니페스토, 슬로건, 등장 페이드), 스스로 돕니다(히어로 박자는 5.5초마다 자동 전환, 히어로가 화면 밖이면 멈춤, HUD 눈금으로 직접 선택). 새 연출도 이 원칙을 따릅니다.
- 제조 공정 카드는 데스크톱에서 가로 스트립입니다. 카드 위에 포인터를 둔 채 휠을 돌리면 옆으로 넘어가고, 끝에 닿으면 페이지가 이어서 스크롤됩니다 (`src/components/Process.tsx`).
- 페이지 안 `#앵커` 링크는 1.2초 이징으로 미끄러져 이동합니다.
- `prefers-reduced-motion` 에서는 앵커 이동이 즉시 이뤄지고, 등장 연출과 히어로 인트로, 마키, 헤더 전환, 테마 크로스페이드를 끕니다.

## 애니메이션 규칙

- CSS 로 움직이는 것(keyframes, 무한 반복, 상태 전환 트랜지션)은 `src/animation.css` 에 모읍니다. 한 번 재생되는 스크립트 연출(히어로 인트로·박자 전환, 리빌, 여섯 해 레일, 조직도)은 GSAP 으로 각 컴포넌트와 `src/lib/reveals.ts` 에 있고, 호버 트랜지션은 요소의 유틸리티로 둡니다.
- 마키는 내용을 두 번 이어 쓴 트랙에 `.marquee` 를 주고, 감싸는 요소에 `.marquee-host` 를 줍니다. 속도는 `[--marquee-duration:48s]` 처럼 트랙마다 정합니다(기본 42s). 포인터를 올리거나 안에 포커스가 있으면 멈춥니다(히어로 아래 라벨, 고객사 로고, 인증서).
- GSAP 은 컴포넌트마다 `useGSAP(fn, { scope })` 안에서 만듭니다. 정리될 때 트윈, ScrollTrigger, SplitText, matchMedia 가 함께 되돌려집니다. Three.js / Canvas 장면은 같은 effect 에서 만들고 반환한 정리 함수에서 `destroy()` 합니다.
- three.js 와 두 WebGL 장면(`src/three/hero.ts`, `extrusion.ts`)은 `import()` 로 따로 받는 청크입니다. 페이지가 쓰는 부품 이름·프로파일 계산은 three.js 없는 `src/three/meta.ts` 에 있으니, 컴포넌트에서 `src/three/*` 의 장면 모듈을 정적으로 import 하지 마세요(타입은 `import type`). 단일 파일은 `scripts/single.mjs` 가 동적 import 를 한 스크립트로 합친 별도 빌드로 만듭니다.
- 무거운 초기화는 첫 화면 뒤로 미룹니다. 히어로 장면은 첫 페인트 직후에 만들고 부품 샘플링은 첫 부품만 즉시, 나머지는 유휴 시간에 합니다. 프로파일 랩 장면은 로드 후 유휴 시간이나 섹션 한 화면 앞에서 만듭니다. 두 장면 모두 셰이더를 `compileAsync` 로 미리 컴파일한 뒤 그리기 시작합니다.
- 스크롤 트리거를 만들기 전에 숨김 상태(스타일 쓰기)를 한꺼번에 먼저 적용합니다. 트리거는 만들어지는 순간 페이지를 측정하므로, 쓰기와 생성을 번갈아 하면 트리거 수만큼 레이아웃이 다시 계산됩니다.
- 페이지 전역 리빌은 마커로 붙입니다 (`src/components/ui.tsx` 상단 주석): `.rv`, `[data-batch]`, `[data-wipe]`, `[data-count]`. 모두 처음 한 번만 재생되고 위로 되돌아갈 때 되감기지 않으며, 재생한 트리거는 스스로 사라집니다.
- 스크롤에 따라 프레임마다 바뀌는 상태(박자 전환 중인 카피, 시네마틱 프레임, 연혁 칸)는 React state 가 아니라 `data-*` 속성을 직접 토글하고 `data-on:` / `group-data-*:` 변형으로 스타일을 겁니다. 탭, 필터, 카테고리, 설정기 값처럼 사용자가 바꾸는 상태만 React state 입니다.
- 다른 컴포넌트의 `contextSafe` 함수를 GSAP 콜백 안에서 부르지 마세요. GSAP 은 콜백을 그 애니메이션의 컨텍스트 안에서 실행하므로, 호출된 쪽 컨텍스트 전체가 호출한 쪽 아래로 들어가 함께 정리됩니다.
- GSAP 이 transform 을 애니메이션하는 요소의 초기값은 Tailwind 의 `scale-*` / `translate-*` 대신 `[transform:...]` 로 줍니다. Tailwind v4 의 이 유틸리티들은 개별 CSS 속성(`scale`, `translate`)을 쓰기 때문입니다.

## KOR / ENG 전환

네비게이션의 KOR / ENG 버튼으로 전환합니다(모바일에서도 보입니다). 새로고침 없이 그 자리에서 바뀌고 주소도 그대로이며, 스크롤 위치와 열어 둔 탭·필터, 3D 장면이 유지됩니다. 선택은 `localStorage` 에 저장되고, `?lang=en` / `?lang=ko` 로 들어오면 그 값이 우선합니다(공유용, 다음 전환 때 주소에서 지워집니다).

전환하면 `<App>` 이 언어 저장소(`useLang()`)를 구독하고 있어 트리 전체가 다시 렌더링되고, 이어서 ScrollTrigger 위치를 한 번 다시 잽니다. SplitText 로 쪼갠 문단은 React 가 텍스트를 바꿀 수 없어 언어마다 새 요소로 갈아 끼웁니다(`Manifesto` 의 `key={lang}`).

**문구가 있는 곳** — `.tsx` 에는 문구를 쓰지 않습니다.

- 화면 문구(제목, 설명, 라벨, 버튼, 대체 텍스트, aria-label 등): `src/i18n/locales/ko.ts` 가 원본이고 `en.ts` 가 같은 모양을 가집니다. `en.ts` 는 `Messages`(= `typeof ko`) 타입이라 키가 빠지거나 남으면 빌드가 실패합니다. 컴포넌트에서는 `const m = useT().section` 으로 읽습니다.
- 숫자가 들어가는 문구는 함수로 둡니다(예: `events.count(n)`, `product.photoCount(n)`). 영문 복수형도 여기서 처리합니다.
- 마크업이 섞인 문구는 `<tag>…</tag>` 로 적고 `rich(문구, { tag: chunk => <… /> })` 로 그립니다(매니페스토 강조어 `<k>`, 주소의 "오시는 길" 링크 `<map>`).
- 콘텐츠 레코드(제품, 공정, 인증서, 연혁, 거점, 조직도, 행사)는 `src/data.ts` 에 한국어/영어 필드를 나란히 두고 `pick(ko, en)` 으로 고릅니다 — `desc`/`descEn`, `d`/`dEn`, `t`/`tEn`, `l`/`lEn`, `ko`/`en`.
- 연락처·외부 링크·카탈로그 경로처럼 번역과 무관한 값은 `src/data.ts` 의 `COMPANY`.
- `<title>` 과 meta description: 사전의 `meta`.

## 행사 목록 (#events)

`src/data.ts` 의 `EVENTS` 배열이 원본이고, 회사의 "사외 행사 참석" 엑셀에서 옮겨 왔습니다. 한 행사는 이렇게 생겼습니다 (`DvEvent` 타입).

```ts
{
  id: '2026-posco-tech-share',   // 사진 파일 이름의 접두사
  date: '2026-03-18',
  kind: 'out',                   // 'out' 사외 / 'in' 사내
  photos: 5,                     // public/assets/img/events/<id>-01..05.jpg 가 있다는 뜻
  ko: '...', en: '...',          // 행사명
  org: '...', orgEn: '...',      // 주최
  note: '...', noteEn: '...',    // 한 줄 설명
  press: [{ n: '동아일보', nEn: 'Dong-A Ilbo', u: 'https://...' }],
  video: [{ n: '...', nEn: '...', u: 'https://...' }]
}
```

행사를 추가하려면 사진을 `public/assets/img/events/` 에 `<id>-01.jpg` (본판, 가로 1280px) 와 `<id>-01-t.jpg` (썸네일, 가로 460px) 한 쌍으로 넣고 `EVENTS` 맨 앞에 항목을 추가하면 됩니다. 목록은 수상한 행사(`award` 가 있는 것)가 먼저, 그중 `featured` 가 맨 위, 나머지는 최신순으로 정렬됩니다. 연도 필터는 `date` 에서 자동으로 만들어지고 같은 규칙으로 정렬됩니다. `featured` 행사는 섹션을 열었을 때 기본으로 선택됩니다.

원본은 "사외 행사 참석" 엑셀과 "행사사진" 사진 아카이브입니다. 엑셀에 있던 사진 속 인물 메모(누가 몇 번째 줄에 있는지, 영상 타임코드 등)는 사내용이라 옮기지 않았습니다.

## 아직 없는 것

- 문의 폼 백엔드 (현재는 메일 앱으로 열림)
- 실제 부품 3D 모델 (현재는 절차적 형상, GLTF 교체 지점은 `src/three/parts.ts`)
