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
| `css/style.css` | 디자인 토큰과 전체 스타일. 다크/라이트는 `html[data-mode]` 토큰 세트, 배경 전환은 고정 레이어 2장의 opacity 크로스페이드 |
| `src/main.js` | GSAP ScrollTrigger, 리스트 렌더링, 섹션 테마 전환, About 연출, 인터랙션 전체 |
| `src/scroll.js` | Lenis 스무스 스크롤, 휠 입력 정규화(마우스 노치 / 트랙패드 구분), 방향성 섹션 스냅 |
| `src/hero.js` | 히어로 파티클(자동차 부품으로 모이는 알루미늄 칩) Three.js 장면 |
| `src/parts.js` | 부품 형상(Brake Hat, Yoke, Inner Pipe, Manifold Block 등) 절차적 지오메트리 |
| `src/extrusion.js` | 프로파일 랩: 프레스 컨테이너, 금형, 프로파일 Three.js 장면과 중량 계산 |
| `src/map.js`, `src/telemetry.js` | 글로벌 거점 지도, R&D 데모 파형 (Canvas 2D) |
| `src/data.js` | 제품, 공정, 인증서, 연혁, 거점, 조직도 데이터. 사이트 내용 수정은 여기서 |
| `assets/img/` | dvi-ind.com 에서 가져온 이미지(정리, 최적화본). `assets/img/site/` 는 원본 보관 |
| `assets/docs/` | 카탈로그 PDF |

## 디자인 토큰

- 브랜드 보라 `#5F298C` (원본 사이트 `--brand-color`). 다크 배경에서는 `#8A5BC2 / #B79BE3` 로 밝혀 사용
- 그래파이트 `#0C1016`, 알루미늄 라이트 `#D8DBDF`
- 서체: Big Shoulders Display (영문 디스플레이), IBM Plex Sans KR (본문), IBM Plex Mono (수치)

## 스크롤 동작

- 휠 한 노치는 뷰포트의 32% 이상 움직이지 않도록 제한하고, 마우스 노치는 0.6배, 트랙패드는 0.9배로 정규화합니다 (`src/scroll.js`).
- 스크롤이 멈추면 진행 방향의 다음 스냅 포인트(뷰포트 90% 이내)로 자동으로 이어서 이동합니다. 스냅 포인트는 섹션 시작, 히어로 4박자, `data-snap` / `data-snap-range` 요소입니다. 터치 기기와 `prefers-reduced-motion` 에서는 꺼집니다.

## 아직 없는 것

- KOR / ENG 전환 (영문 카피는 원본 사이트 `/en/` 참고)
- 문의 폼 백엔드 (현재는 메일 앱으로 열림)
- 실제 부품 3D 모델 (현재는 절차적 형상, GLTF 교체 지점은 `src/parts.js`)
