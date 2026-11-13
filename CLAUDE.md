# eun-blog

개인 포트폴리오 사이트. Next.js 15 (App Router) + React 19 + TypeScript, CSS Modules.
데이터는 별도 Spring 백엔드(`ket3613/eun-api-server`, `https://api.euntaek.cc`)에서 가져온다.

## 명령어
- `npm run dev` — 개발 서버
- `npm run build` — 운영 빌드 (standalone)
- `npm run lint` / `npx tsc --noEmit` — 커밋 전 필수 확인
- `npm audit --omit=dev --audit-level=high` — CI 에서도 실행됨

## 구조
- `src/app/` — 페이지(App Router). `profile`, `projects`, `projects/[id]`, `troubleshooting` 은 서버 컴포넌트, `server-stats` 는 30초 폴링 클라이언트 컴포넌트
- `src/components/` — `SiteHeader`(상단 메뉴), `ProjectRows`, `TroubleList` 등 공용 컴포넌트
- `src/app/api/` — Route Handler. 관리 API(`/api/manage/**`)는 세션 확인 후 백엔드로 프록시
- `src/lib/backend.ts` — 백엔드 공개 API 조회 함수 (fetch 는 여기로 모은다)
- `src/lib/server/` — 서버 전용: rate limit, 입력 검증, 백엔드 프록시 헬퍼
- `src/lib/auth.ts` — JWT(jose, HS256) 세션 토큰. `src/middleware.ts` 가 `/manage` 보호
- `src/lib/format.ts` — 기간 계산, 줄바꿈·쉼표 분리, 링크 검증
- `src/styles/*.module.css` — 페이지별 스타일(`page.module.css` 는 공용 뼈대), 색상·글꼴 토큰은 `src/app/globals.css` 의 `:root`

## 규칙
- 비밀값(`AUTH_SECRET`, `ADMIN_TOKEN`)은 절대 코드/compose 에 기본값으로 넣지 않는다. 운영은 서버의 `.env` (compose 와 같은 디렉터리)에서 주입
- 관리 API 를 추가하면 `requireAuth()` + `src/lib/server/validate.ts` 검증을 반드시 거친다
- 외부 도메인을 호출/로드하면 `next.config.ts` 의 CSP 도 함께 수정한다
- Tailwind 는 사용하지 않는다 (CSS Modules 사용)
- UI 문구는 한국어, 장식용 이모지는 쓰지 않는다
- 화면에 보이는 포트폴리오 내용(한 일, 수치, 트러블슈팅)은 코드에 쓰지 않고 백엔드 DB(`eun-api-server/db/seed.sql`)에서 가져온다
- 초록/빨강(`--add`, `--del`)은 전환 전후·결과·상태 표시에만 쓰고, 강조에는 `--brand` 를 쓴다

## 배포
`main` 머지 → Jenkins(`Jenkinsfile`)가 Docker 이미지 빌드 후 `/host/eun-blog` 에서 `docker compose up`
