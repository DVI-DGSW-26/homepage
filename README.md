# DVISION homepage

솔루션 사이트(solution.dvi-ind.com): QAC FLOW 와 데이터 산업 페이지, 개인정보처리방침. **Next.js 16(App Router)** + React 19 + Tailwind CSS v4 + TypeScript 이고, 모든 페이지를 빌드 때 국문·영문 정적 HTML 로 미리 렌더링합니다(SSG). 서버 코드는 데모 신청 메일 함수(`src/app/api/inquiry/route.ts`)와 옛 주소를 옮겨 주는 proxy(`src/proxy.ts`) 둘뿐입니다. 패키지 매니저는 pnpm 입니다.

- 전에 있던 JS 로 만든 homepage 는 [main-old](https://github.com/DVI-DGSW-26/homepage/tree/main-old) 브런치로 옮겼습니다.
- [feature/Separation](https://github.com/DVI-DGSW-26/homepage/tree/main) 은 페이지 스크롤을 많이 해야 하는 문제를 줄인 브런치입니다. 다른 브런치와 push, merge, pull 로 관여하지 않습니다.

## 실행

```bash
pnpm install
pnpm dev        # http://localhost:5174
```

데모 신청 폼을 로컬에서 실제로 보내려면 `.env.example` 을 `.env.local` 로 복사해 Resend 키와 발신 주소를 채웁니다. `INQUIRY_MAIL_TO_DEV` 를 적으면 개발 중에는 그 주소로만 갑니다.

개발 서버는 StrictMode 로 돌기 때문에 모든 effect 가 마운트 직후 한 번 정리되고 다시 실행됩니다. 리빌과 구독은 이 정리를 견디도록 만들어져 있습니다(아래 "애니메이션 규칙").

## 빌드

```bash
pnpm build      # 이미지 변환 → 글꼴 서브셋 → 토큰 목록 → 타입 검사 → next build
pnpm start      # 빌드 결과를 http://localhost:4174 에서 확인
pnpm typecheck  # 타입 검사만
pnpm images     # 이미지 변환만 (dev / build 가 자동으로 먼저 실행)
pnpm fonts      # 본문 글꼴 서브셋만 (dev / build 가 자동으로 먼저 실행, 아래 "글꼴")
pnpm capture    # QAC FLOW 시연에서 앱 캡처를 2배로 다시 찍기 (아래 "영상과 자료")
```

- Vercel 은 `vercel.json`(framework: nextjs)대로 `pnpm build` 후 배포합니다. 타입 검사는 `tsc --noEmit` 가 하고 Next 자체 검사는 끕니다(TypeScript 7).
- Vercel 환경 변수: `RESEND_API_KEY`, `INQUIRY_MAIL_FROM`(Resend 에 인증된 dvi-ind.com 주소), `INQUIRY_MAIL_TO`(기본 sales@dvi-ind.com). 없으면 폼이 실패를 알리고 메일 주소를 보여 줍니다. 검색 등록 확인 코드 `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION` 을 넣으면 `<head>` 에 붙습니다.
- 단일 파일 빌드(`dvision-single.html`)는 Next.js 로 옮기며 없앴습니다. 시안은 Vercel 미리보기 주소로 공유합니다.

## 주소와 SEO

| 페이지 | 국문 | 영문 |
| --- | --- | --- |
| QAC FLOW | `/` | `/en` |
| 데이터 산업 | `/data` | `/en/data` |
| 개인정보처리방침 | `/privacy` | `/en/privacy` |

- 페이지마다 언어별 `<head>`(제목, 설명, canonical, hreflang ko/en/x-default, Open Graph, Twitter 카드)를 `src/site/seo.ts` 의 `pageMetadata()` 가 사전(`locales/*.ts` 의 `meta`)으로 만듭니다. 구조화 데이터(JSON-LD: Organization, WebSite, QAC FLOW SoftwareApplication, BreadcrumbList)도 같은 파일의 `structuredData()` 입니다.
- `/sitemap.xml`(두 언어, 서로의 hreflang 포함), `/robots.txt`, `/manifest.webmanifest` 는 `src/app/{sitemap,robots,manifest}.ts` 가 만듭니다.
- `src/proxy.ts`: `?lang=en`(CES QR 코드 `/?lang=en#qac-flow`) → `/en`(308, #앵커 유지), `/qac-flow` → `/`(308), `/ko/...` → 접두어 없는 주소, 없는 주소 → `/` 또는 `/en`(307). 옛 한 페이지 시절 앵커 `/#future` 는 `Shell` 이 `/data` 로 보냅니다.
- 공유 이미지는 `public/og/qac-flow-{ko,en}.png`(1200×630, 지금은 첫 화면 캡처).

## 구조

```
next.config.ts                 Next 설정 (이미지 최적화 끔: <Img> 가 빌드 전에 함, /assets 영구 캐시 헤더)
src/
  app/
    (ko)/layout.tsx            국문 루트 레이아웃 <html lang="ko">  ·  page.tsx, data/, privacy/
    (en)/en/layout.tsx         영문 루트 레이아웃 <html lang="en">  ·  page.tsx, data/, privacy/
    api/inquiry/route.ts       데모 신청 폼 → Resend 메일 (본체는 src/server/inquiry.ts)
    sitemap.ts, robots.ts, manifest.ts, global-not-found.tsx
  proxy.ts                     옛 주소·없는 주소 리다이렉트 (위 "주소와 SEO")
  site/
    RootLayout.tsx             <html>: 글꼴·스타일, 라이트 모드를 첫 페인트 전에 적용하는 인라인 스크립트, 공통 메타데이터
    routes.tsx                 SitePage: 페이지 하나 = Shell + 섹션 + JSON-LD
    seo.ts                     페이지별 메타데이터, 구조화 데이터
  server/inquiry.ts            메일 보내기 (서버 전용)
  components/layout/Shell.tsx  모든 페이지의 껍데기(클라이언트): 언어·페이지 컨텍스트, 헤더, 푸터, 대화상자, 리빌·앵커·부팅
  views/                       페이지 본문 (Next 의 pages/ 와 겹치지 않게 views/)
    qac-flow/                  QacFlowPage.tsx 가 섹션을 나열, sections/ 에 블록 하나씩, parts.tsx 는 공용 조각
    data/                      같은 구성 (Vision, WhyUs, Chain, Roadmap, Asset, Partner)
    privacy/                   개인정보처리방침 (문구는 i18n/locales/privacy.{ko,en}.ts)
  styles/
    index.css                  Tailwind 진입점: 변형(light: booting: spanned:), 기본 요소 스타일, 공용 유틸리티
    tokens.css                 모든 디자인 값 (아래 "디자인 토큰")
    animation.css              CSS 로 움직이는 것 전부와 각각의 reduced-motion 처리
    fonts.css                  Plex Sans KR 전체 선언 (src/lib/fonts.ts 가 입력칸 포커스 때 불러옴)
  features/
    qac-monitor/               실시간 모니터링의 현장 앱을 React 로 다시 만든 것 (현황판·검사 상세·품질 불량). 데스크톱은 모니터,
                               태블릿은 가로 iPad(같은 레이아웃을 4:3 으로), 폰은 아이폰에 폰 전용 레이아웃(QacPhone, phone/).
                               화면은 모두 parts.tsx 의 Card·Stats·Badge·Pager 로 짓고, 글자는 text-m-caption … text-m-figure
                               여섯 크기, 아이콘은 lucide-react
  components/
    layout/Nav.tsx             헤더: 떠 있는 알약, 페이지 메뉴, 첫 화면 · 제조 | 솔루션 전환, KOR / ENG 링크, 테마 버튼. 1200px 미만은 <dialog> 시트로
    layout/Contact.tsx         두 제품 페이지 끝의 데모 신청 폼 (#contact) — 페이지의 "데모 신청" 버튼이 모두 여기로
    layout/Footer.tsx          모든 페이지 끝: 회사, 문의 메일, DVISION 사이트 세 곳, 개인정보처리방침
    ui.tsx                     공용 조각: Band, Eyebrow, Kicker, H2, Lead, Pill, PlanTag, LineIcon (리빌 마커 설명도 여기)
    icons.ts                   LineIcon 이 그리는 SVG 경로 사전
    Device.tsx                 화면을 담는 CSS 목업: 아이폰 16 Pro Max(정면 / 3D 회전, 캡처 또는 HTML 화면), iPad Pro 13", Studio Display
    Img.tsx                    모든 사진·로고를 그리는 <Img> (AVIF/WebP srcset, 크기, 플레이스홀더, priority)
    Zoom.tsx, Modal.tsx        앱 캡처를 눌러 크게 보는 대화상자와, 그것과 데모 영상 대화상자가 함께 쓰는 <dialog>
    layout/VideoDialog.tsx     데모 영상(YouTube) 대화상자 — 열 때만 플레이어를 불러옴
  i18n/                        KOR / ENG: locales/ko.ts(원본)·en.ts 문구 사전, store.ts 언어·페이지 컨텍스트, rich.tsx
  lib/
    paths.ts                   페이지와 언어별 주소 (pathOf) — 서버와 브라우저가 함께 씀
    store.ts                   createStore / useStore — 테마·대화상자 상태 (서버 렌더용 값 포함)
    site.ts                    언어와 무관한 사실: 사이트 주소, 영업 메일, 부스 번호, 다른 DVISION 사이트 링크
    inquiry.ts                 데모 신청 폼 전송 (/api/inquiry 로)
    media.ts                   첫 화면 반복 영상, 데모 영상, 자료 PDF 설정 (아래 "영상과 자료")
    history.ts                 뒤로 가기로 대화상자 닫기
    theme.ts                   다크 / 라이트 상태와 크로스페이드
    cn.ts                      클래스 병합 (tailwind-merge + 토큰 이름)
    reveals.ts                 마커 기반 스크롤 리빌
    scroll.ts                  앵커 이동, 언어 전환 때 읽던 자리 유지
    fonts.ts                   본문 글꼴 전체 선언을 입력칸 포커스 때 불러옴
    boot.ts, env.ts, useInterval.ts, useMedia.ts
  generated/                   images.json, fonts/, tw-tokens.json (생성물, git 제외)
scripts/
  images.mjs                   빌드 전 이미지 변환 (아래 "이미지")
  fonts.mjs                    빌드 전 본문 글꼴을 사이트 글자만으로 자름 (아래 "글꼴")
  tw-tokens.mjs                빌드 전 tokens.css 의 토큰 이름을 src/generated/tw-tokens.json 으로 (cn() 이 읽음)
  capture-demo.mjs             QAC FLOW 시연(가짜 서버)에서 앱 캡처를 2배로 찍어 public/assets/img/qacflow/ 에 저장
public/og/                     링크 공유 이미지 (국문, 영문)
public/assets/img/             사진·로고·파비콘. 코드에서는 assets/img/... 로 참조(<Img> 가 / 를 붙여 /en 아래에서도 같은 파일)
```

페이지를 더하려면 `src/lib/paths.ts` 의 `PAGES`, `src/site/routes.tsx` 의 `VIEWS`, 사전의 `meta`·`nav.links` 에 함께 올리고, `src/app/(ko)/<이름>/page.tsx` 와 `src/app/(en)/en/<이름>/page.tsx` 를 만들고, `src/proxy.ts` 의 `PAGES` 에 더합니다.

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

언어(`useLang`)와 페이지(`usePage`)는 주소에서 오는 값이라 `Shell` 이 React 컨텍스트로 내려 줍니다. 테마(`useTheme`)와 대화상자 상태는 React 바깥의 작은 저장소(`src/lib/store.ts` 의 `createStore`)에 있고 `useSyncExternalStore` 로 구독합니다(서버 렌더와 hydration 에는 기본값, 예: 다크). 바꾸는 쪽은 `setTheme()` 등입니다. 탭, 필터처럼 한 컴포넌트 안의 상태만 `useState` 입니다.

## 다크 / 라이트 모드

헤더의 해·달 버튼으로 바꿉니다(기본 다크). 선택은 `localStorage` 의 `dv-theme` 에 저장되고, 루트 레이아웃(`src/site/RootLayout.tsx`)의 인라인 스크립트가 첫 페인트 전에 `html[data-mode]` / `html[data-bg]` 를 맞춰 라이트 방문자도 다크 화면이 번쩍이지 않습니다.

전환은 컴포지터만 씁니다. `data-bg` 가 먼저 바뀌고 옛 색 레이어가 페이드아웃되며(`animation.css`), 색 토큰(`data-mode`)은 이징상 절반이 지난 시점에 한 번 바뀝니다. 길이는 `--duration-theme` 을 `src/lib/theme.ts` 가 읽어 씁니다.

## KOR / ENG 전환

언어는 주소가 정합니다(`/` 국문, `/en` 영문). 서버가 페이지마다 그 언어로 본문까지 다 그려 두므로 검색엔진이 두 언어를 따로 읽습니다. 헤더의 KOR / ENG(와 모니터 데모의 EN 버튼)는 같은 페이지의 다른 언어 주소로 가는 링크이고, 넘어가기 전 읽던 위치(페이지 높이 대비 비율)를 sessionStorage 에 적어 두었다가 새 페이지에서 그 위치로 스크롤합니다.

- `.tsx` 에는 문구를 쓰지 않습니다. `src/i18n/locales/ko.ts` 가 원본이고 `en.ts` 는 `Messages`(= `typeof ko`) 타입이라 키가 빠지거나 남으면 빌드가 실패합니다. 컴포넌트에서는 `const m = useT().qf` 처럼 읽습니다.
- 숫자가 들어가는 문구는 함수로 둡니다(영문 복수형 포함). 마크업이 섞인 문구는 `<k>…</k>` 로 적고 `rich(문구, { k: chunk => … })` 로, 줄바꿈 위치는 `\n` 과 `lines()` 로 그립니다.
- 영어판 앱 캡처는 `public/assets/img/qacflow/en/` 에 같은 이름의 WebP 로 두고 `src/views/qac-flow/parts.tsx` 의 `EN` 목록에 올립니다(없으면 한국어 캡처).

## 이미지

사진과 로고는 `<img>` 대신 `<Img>` (`src/components/Img.tsx`) 로 그립니다. next/image 가 요청 때 하는 일을 빌드 전에 해 둡니다.

- `scripts/images.mjs` 가 `public/assets/img/` 의 JPG/PNG/WebP 마다 AVIF·WebP 를 여러 폭(원본보다 넓은 폭은 만들지 않음, `qacflow/` 앱 화면은 WebP 만)으로 `public/assets/opt/` 에 만들고 목록을 `src/generated/images.json` 에 씁니다(둘 다 git 제외). 파일 이름에 원본 해시가 들어가 영구 캐시해도 됩니다. 변환 결과는 `node_modules/.cache/dv-img` 에 남아 바뀐 사진만 다시 변환합니다.
- `<Img src="assets/img/..." sizes="(max-width: 859px) 50vw, 25vw" />` — `sizes` 에 그려지는 폭을 적으면 브라우저가 맞는 파일을 고릅니다. 첫 화면 이미지는 `priority`. 목록에 없는 경로는 일반 `<img>` 로 그려집니다.

## 글꼴

웹폰트는 Google Fonts 대신 이 사이트에서 직접 내보냅니다(방문자 IP 가 Google 로 가지 않음, 개인정보처리방침).

- 본문 글꼴 Plex Sans KR 은 `scripts/fonts.mjs` 가 `src/` 에 들어 있는 글자(사전, 모니터 예시 데이터, 개인정보처리방침)만 남겨 굵기마다 woff2 하나(약 40KB)로 자릅니다. 원본은 IBM 의 `@ibm/plex-sans-kr`, 결과는 `src/generated/fonts/`(git 제외)이고 글꼴 이름은 `Plex Sans KR Site` 입니다. 자른 결과는 `node_modules/.cache/dv-fonts` 에 글자 묶음별로 남습니다.
- 문구에 새 글자를 넣으면 `pnpm fonts`(또는 `pnpm dev` 재시작)로 다시 자릅니다. 빠진 글자는 시스템 글꼴로 보입니다.
- 서브셋에 없는 글자(데모 신청 폼에 입력한 이름 등)는 `--font-sans` 의 다음 글꼴인 전체 Plex Sans KR(@fontsource 의 unicode-range 조각, `src/styles/fonts.css`)로 그려집니다. 이 선언은 입력칸에 처음 포커스가 갈 때만 불러옵니다(`src/lib/fonts.ts`).
- `@ibm/plex-sans-kr` 의 postinstall 은 IBM 사용 통계 전송뿐이라 `pnpm-workspace.yaml` 에서 막아 둡니다.

## 영상과 자료

CES 콘텐츠 규격(이미지·영상)에 맞춘 자리는 `src/lib/media.ts` 의 값만 채우면 나타납니다. 비어 있으면 화면에 아무것도 그리지 않습니다.

- `HERO_LOOP`: 첫 화면 앞쪽 폰에서 캡처 위에 재생하는 반복 영상. 8~12초, 무음, 2MB 이하, 865 × 1672 세로 화면 녹화(상태·내비게이션 바 없이). `public/assets/video/` 에 두고 경로를 적습니다. 캡처는 그대로 포스터·대체 이미지로 남고, 동작 줄이기 설정에서는 재생하지 않습니다.
- `DEMO_VIDEO`: 60~90초 데모 영상의 YouTube id 와 길이. 첫 화면과 "측정은 어떻게 하나요?" 아래에 "N초 영상 보기" 버튼이 생기고, 누를 때만 youtube-nocookie.com 플레이어를 불러옵니다(자막 켬, 영문 자막은 YouTube 에 올림).
- `DOWNLOADS`: 문의 폼 옆 "자료 내려받기"(카탈로그, 영문 리플릿). `public/assets/docs/` 에 두고 `lang` 으로 한 언어에만 보일 수 있습니다.
- 앱 캡처(폰, 브라우저 창)는 모두 눌러서 크게 볼 수 있습니다(`Zoomable`). 캡처는 그려지는 폭의 2배가 기준(폰 740px, 결재 화면 1720px, 보고서 2000px)이고, 모자란 파일은 `pnpm images` 가 매번 목록으로 알려 줍니다(지금은 `en/mobile-compare` 하나, 사진 대조 화면과 짝이라 실제 사진이 있는 데이터로 둘을 함께 다시 찍을 예정).
- 앱 캡처는 `pnpm capture` 로 다시 찍습니다. QAC FLOW 저장소에서 `npx vite --mode demo-offline --port 5190` 으로 시연(예시 데이터, 가짜 서버)을 띄운 뒤 실행하면, 헤드리스 Chrome 이 시연 관리자로 국문·영문 각각 2배 배율로 찍어 WebP 로 저장합니다(지금은 검사보고서 `report`). 새 화면은 `scripts/capture-demo.mjs` 의 `SHOTS` 에 더합니다.
- 본문 글자는 14px(.875rem) 아래로 내려가지 않습니다(`tokens.css` 글자 크기). 회색 보조 글자(`text-mute`)와 라이트 모드 초록 글자는 배경 대비 4.5:1 이상입니다.

## 애니메이션 규칙

- 스크롤 위치에 묶인(스크럽) 애니메이션은 없습니다. 연출은 블록이 화면에 들어올 때 한 번 재생되거나 스스로 돕니다(모니터 화면 순환). 네이티브 스크롤이고, 페이지 안 `#앵커` 링크는 부드럽게 이동합니다.
- CSS 로 움직이는 것(keyframes, 테마 크로스페이드, 모니터 화면 전환)은 `src/styles/animation.css` 에, 호버 트랜지션은 요소의 유틸리티로 둡니다.
- 페이지 전역 리빌은 마커로 붙입니다(`src/components/ui.tsx` 상단 주석): `.rv` 한 번 떠오름, `[data-batch]` 자식 `.rv` 가 함께 차례로. `Shell` 이 페이지가 마운트된 뒤 `setupReveals()` 를 부르고 페이지를 바꿀 때 정리합니다. 숨김은 스크립트가 돈 뒤에 걸기 때문에, 스크립트를 실행하지 않는 크롤러도 본문을 그대로 봅니다.
- 애니메이션 라이브러리는 쓰지 않습니다. 리빌은 IntersectionObserver 가 블록이 화면 90% 선을 지나는 것을 알리면 Web Animations API(`el.animate`)로 재생하고, 재생한 블록은 관찰에서 빠집니다. 숨김 상태는 관찰을 시작하기 전에 한꺼번에 씁니다.
- 주기 작업은 `useInterval` 처럼 `useEffectEvent` 로 최신 콜백을 읽어 effect 를 다시 걸지 않습니다.
- `prefers-reduced-motion` 에서는 리빌, 테마 크로스페이드, 모니터 전환을 끄고 앵커 이동이 즉시 이뤄집니다.
