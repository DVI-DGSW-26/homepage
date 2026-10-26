# DVISION homepage

dvi-ind.com 리메이크 중 Q.A.C-Flow 와 데이터 산업 페이지. React 19 + Vite + Tailwind CSS v4 + TypeScript 정적 사이트이며 서버 없이 배포됩니다. 패키지 매니저는 pnpm 입니다.

- 전에 있던 JS 로 만든 homepage 는 [main-old](https://github.com/DVI-DGSW-26/homepage/tree/main-old) 브런치로 옮겼습니다.
- [feature/Separation](https://github.com/DVI-DGSW-26/homepage/tree/main) 은 페이지 스크롤을 많이 해야 하는 문제를 줄인 브런치입니다. 다른 브런치와 push, merge, pull 로 관여하지 않습니다.

## 실행

```bash
pnpm install
pnpm dev        # http://127.0.0.1:5173
```

개발 서버는 `<StrictMode>` 로 돌기 때문에 모든 effect 가 마운트 직후 한 번 정리되고 다시 실행됩니다. GSAP 연출과 구독은 이 정리를 견디도록 만들어져 있습니다(아래 "애니메이션 규칙").

## 빌드

```bash
pnpm build      # 이미지 변환 → 타입 검사 → vite build → 단일 파일
pnpm preview    # dist/ 를 http://127.0.0.1:4173 에서 확인
pnpm typecheck  # 타입 검사만
pnpm images     # 이미지 변환만 (dev / build 가 자동으로 먼저 실행)
```

- `dist/` 에 배포용 정적 파일이 생깁니다. Vercel 은 `vercel.json` 대로 `pnpm build` 후 `dist/` 를 배포하고, `/data` 같은 페이지 경로는 `index.html` 로 보냅니다(rewrites).
- `dist/dvision-single.html` 은 이미지, 스크립트, 스타일을 모두 인라인한 단일 파일(공유, 시안 검토용)입니다. `scripts/single.mjs` 가 코드 분할을 끈 별도 빌드로 만듭니다.

## 구조

```
index.html                     진입점: 폰트, meta, 저장된 라이트 모드를 첫 페인트 전에 적용하는 인라인 스크립트
scripts/
  images.mjs                   빌드 전 이미지 변환 (아래 "이미지")
  single.mjs                   단일 파일 빌드
  tw-tokens.ts                 Vite 플러그인: tokens.css 의 토큰 이름을 cn() 에 넘김 (virtual:tw-tokens)
src/
  main.tsx                     meta 동기화, 부팅 베일, <App> 렌더
  App.tsx                      페이지 전환(VIEWS), 앵커 스크롤, 페이지마다 리빌 설정
  styles/
    index.css                  Tailwind 진입점: 변형(light: booting: spanned:), 기본 요소 스타일, 공용 유틸리티
    tokens.css                 모든 디자인 값 (아래 "디자인 토큰")
    animation.css              CSS 로 움직이는 것 전부와 각각의 reduced-motion 처리
  pages/
    qac-flow/                  /qac-flow — QacFlowPage.tsx 가 섹션을 나열, sections/ 에 블록 하나씩, parts.tsx 는 공용 조각
    data/                      /data — 같은 구성 (Vision, WhyUs, Chain, Roadmap, Asset, Partner)
  features/
    qac-monitor/               실시간 모니터링의 현장 앱을 React 로 다시 만든 것 (현황판·검사 상세·품질 불량). 데스크톱은 모니터,
                               태블릿은 가로 iPad(같은 레이아웃을 4:3 으로), 폰은 아이폰에 폰 전용 레이아웃(QacPhone, phone/)
  components/
    layout/Nav.tsx             헤더: 떠 있는 알약, 페이지 메뉴, KOR / ENG, 테마 버튼. 1200px 미만은 메뉴가 <dialog> 시트로
    layout/Launch.tsx          모든 페이지 끝의 출시일 푸터
    ui.tsx                     공용 조각: Band, Eyebrow, Kicker, H2, Lead, LineIcon (리빌 마커 설명도 여기)
    icons.ts                   LineIcon 이 그리는 SVG 경로 사전
    Device.tsx                 화면을 담는 CSS 목업: 아이폰 16 Pro Max(정면 / 3D 회전, 캡처 또는 HTML 화면), iPad Pro 13", Studio Display
    Img.tsx                    모든 사진·로고를 그리는 <Img> (AVIF/WebP srcset, 크기, 플레이스홀더, priority)
  i18n/                        KOR / ENG: locales/ko.ts(원본)·en.ts 문구 사전, store.ts 언어 상태, rich.tsx, meta.ts
  lib/
    store.ts                   createStore / useStore — 페이지·테마·언어 상태가 모두 이걸로
    router.ts                  페이지 경로와 새로고침 없는 이동, 옛 /#섹션 링크 이전
    theme.ts                   다크 / 라이트 상태와 크로스페이드
    cn.ts                      클래스 병합 (tailwind-merge + 토큰 이름)
    reveals.ts                 마커 기반 스크롤 리빌
    scroll.ts                  스크롤 이동, 앵커, 언어 전환 때 읽던 자리 유지
    gsap.ts, boot.ts, env.ts, useInterval.ts
  generated/images.json        이미지 목록 (생성물, git 제외)
public/assets/img/             사진·로고·파비콘. 코드에서는 assets/img/... 로 참조
```

페이지를 더하려면 `src/lib/router.ts` 의 `PAGES`, `src/App.tsx` 의 `VIEWS`, 사전의 `nav.links` 에 함께 올리고 `src/pages/<이름>/` 에 만듭니다.

## 디자인 토큰과 Tailwind

디자인 값은 전부 `src/styles/tokens.css` 에 있고, 컴포넌트는 그 토큰이 만드는 Tailwind v4 유틸리티로만 씁니다. `.tsx` 에 hex·rgba 나 반복되는 임의값을 쓰지 않습니다.

- **블록**: `@theme`(브레이크포인트, 서체, 글자 크기·자간·행간, 유동 간격, 컨테이너, 모서리, 이징, 그림자), `@theme static`(두 모드에서 같은 색), `@theme inline`(모드를 따르는 색), `:root` / `html[data-mode="light"]` 의 모드 세트와 모션 시간, `.qac-monitor` 의 모니터 전용 세트(macOS 시스템 색).
- **색**: 모드를 따르는 `bg-bg` `bg-bg-2` `bg-card` `text-fg` `text-fg-2` `text-mute` `border-line` `text-acc` `text-acc-ink` `bg-nav` 등, Q.A.C-Flow 초록 `qf`·`qf-ink`·`qf-soft`·`qf-line`. 투명도는 `border-acc/50` 처럼 붙입니다.
- **간격**: 고정 px 는 Tailwind 4px 스케일(`gap-4.5` = 18px)을 쓰고, 화면에 따라 변하는 값과 이름이 필요한 값만 토큰입니다(`gutter`, `wrap`, `section`, `panel-pad`, `split-gap` …).
- **이름 규칙**: Tailwind 는 같은 이름을 여러 유틸리티에 씁니다(`--spacing-block` 은 `inline-block` 을 바꿔 버림). 새 토큰 이름은 기존 클래스·다른 네임스페이스와 겹치지 않게 짓습니다. `cn()` 은 빌드 때 토큰 이름을 읽어 오므로(`scripts/tw-tokens.ts`) 따로 등록할 필요가 없습니다.
- **공용 유틸리티** (`index.css`): `wrap`(본문 열), `pad-wrap`, `mono`, `num`(tabular 숫자), `deco-dots` / `deco-grid`(배경 무늬), `hollow-*`(외곽선 글자, `hollow-deco`).
- **브레이크포인트**는 기기 구간입니다(데스크톱 우선, `max-*`): `max-2xs` < 361 · `max-sm` < 600 · `md` 860 · `lg` 1200 · `xl` 1280. 구간별 기기는 `tokens.css` 상단 주석에 있고, JS 는 `src/lib/env.ts` 의 `LG` 로 같은 값을 씁니다. 듀얼 스크린을 좌우로 펼친 상태는 `spanned:` 변형(가운데 힌지만큼 `gap-x-hinge`).
- **변형**: `light:` 는 `html[data-mode="light"]` 일 때, `booting:` 은 웹폰트가 들어오기 전(`html[data-ready]` 전, 최대 1.5초)에만 적용됩니다.
- 서체: Big Shoulders Display (`font-display`), IBM Plex Sans KR (`font-sans`), IBM Plex Mono (`font-mono`). 한국어는 `:lang(ko)` 에서 `word-break: keep-all`.

## 전역 상태

페이지(`usePage`), 테마(`useTheme`), 언어(`useLang`)는 React 바깥의 작은 저장소(`src/lib/store.ts` 의 `createStore`)에 있고 `useSyncExternalStore` 로 구독합니다. 바꾸는 쪽은 `navigate()`, `setTheme()`, `setLang()` 입니다. 탭, 필터처럼 한 컴포넌트 안의 상태만 `useState` 입니다.

## 다크 / 라이트 모드

헤더의 해·달 버튼으로 바꿉니다(기본 다크). 선택은 `localStorage` 의 `dv-theme` 에 저장되고, `index.html` 의 인라인 스크립트가 첫 페인트 전에 `html[data-mode]` / `html[data-bg]` 를 맞춰 라이트 방문자도 다크 화면이 번쩍이지 않습니다.

전환은 컴포지터만 씁니다. `data-bg` 가 먼저 바뀌고 옛 색 레이어가 페이드아웃되며(`animation.css`), 색 토큰(`data-mode`)은 이징상 절반이 지난 시점에 한 번 바뀝니다. 길이는 `--duration-theme` 을 `src/lib/theme.ts` 가 읽어 씁니다.

## KOR / ENG 전환

헤더의 KOR / ENG 버튼으로 새로고침 없이 바뀌고 주소도 그대로입니다. 선택은 `localStorage` 에 저장되고 `?lang=en` 으로 들어오면 그 값이 우선합니다(CES QR 코드 `/?lang=en#qac-flow`, 다음 전환 때 주소에서 지워짐). 전환 뒤에는 화면 가운데 있던 요소가 같은 높이에 오도록 스크롤을 맞추고 ScrollTrigger 를 다시 잽니다.

- `.tsx` 에는 문구를 쓰지 않습니다. `src/i18n/locales/ko.ts` 가 원본이고 `en.ts` 는 `Messages`(= `typeof ko`) 타입이라 키가 빠지거나 남으면 빌드가 실패합니다. 컴포넌트에서는 `const m = useT().qf` 처럼 읽습니다.
- 숫자가 들어가는 문구는 함수로 둡니다(영문 복수형 포함). 마크업이 섞인 문구는 `<k>…</k>` 로 적고 `rich(문구, { k: chunk => … })` 로, 줄바꿈 위치는 `\n` 과 `lines()` 로 그립니다.
- 영어판 앱 캡처는 `public/assets/img/qacflow/en/` 에 같은 이름의 WebP 로 두고 `src/pages/qac-flow/parts.tsx` 의 `EN` 목록에 올립니다(없으면 한국어 캡처).

## 이미지

사진과 로고는 `<img>` 대신 `<Img>` (`src/components/Img.tsx`) 로 그립니다. next/image 가 요청 때 하는 일을 빌드 전에 해 둡니다.

- `scripts/images.mjs` 가 `public/assets/img/` 의 JPG/PNG/WebP 마다 AVIF·WebP 를 여러 폭(원본보다 넓은 폭은 만들지 않음, `qacflow/` 앱 화면은 WebP 만)으로 `public/assets/opt/` 에 만들고 목록을 `src/generated/images.json` 에 씁니다(둘 다 git 제외). 파일 이름에 원본 해시가 들어가 영구 캐시해도 됩니다. 변환 결과는 `node_modules/.cache/dv-img` 에 남아 바뀐 사진만 다시 변환합니다.
- `<Img src="assets/img/..." sizes="(max-width: 859px) 50vw, 25vw" />` — `sizes` 에 그려지는 폭을 적으면 브라우저가 맞는 파일을 고릅니다. 첫 화면 이미지는 `priority`. 목록에 없는 경로는 일반 `<img>` 로 그려집니다.
- 단일 파일에는 원본만 data URI 로 들어가고, `<Img>` 가 이를 알아채 일반 `<img>` 를 그립니다.

## 애니메이션 규칙

- 스크롤 위치에 묶인(스크럽) 애니메이션은 없습니다. 연출은 블록이 화면에 들어올 때 한 번 재생되거나 스스로 돕니다(모니터 화면 순환). 네이티브 스크롤이고, 페이지 안 `#앵커` 링크는 부드럽게 이동합니다.
- CSS 로 움직이는 것(keyframes, 테마 크로스페이드, 모니터 화면 전환)은 `src/styles/animation.css` 에, 호버 트랜지션은 요소의 유틸리티로 둡니다.
- 페이지 전역 리빌은 마커로 붙입니다(`src/components/ui.tsx` 상단 주석): `.rv` 한 번 떠오름, `[data-batch]` 자식 `.rv` 가 함께 차례로, `[data-count]` 0 부터 세는 숫자. `<App>` 이 페이지가 마운트된 뒤 `setupReveals()` 를 한 번 부르고, 재생한 트리거는 스스로 사라집니다.
- 트리거를 만들기 전에 숨김 상태(스타일 쓰기)를 한꺼번에 먼저 적용합니다. 트리거는 만들어지는 순간 페이지를 측정하므로, 쓰기와 생성을 번갈아 하면 트리거 수만큼 레이아웃이 다시 계산됩니다.
- GSAP 은 지금 `<App>` 의 `useGSAP` 하나(리빌)에서만 씁니다. 새로 쓸 때도 `useGSAP(fn, { scope })` 안에서 만들어 정리 때 함께 되돌려지게 합니다. 주기 작업은 `useInterval` 처럼 `useEffectEvent` 로 최신 콜백을 읽어 effect 를 다시 걸지 않습니다.
- GSAP 이 transform 을 애니메이션하는 요소의 초기값은 `scale-*` / `translate-*` 대신 `[transform:...]` 로 줍니다(Tailwind v4 의 이 유틸리티는 개별 `scale` / `translate` 속성을 씀).
- `prefers-reduced-motion` 에서는 리빌, 숫자 카운트, 테마 크로스페이드, 모니터 전환을 끄고 앵커 이동이 즉시 이뤄집니다.
