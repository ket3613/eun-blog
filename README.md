# eun-blog

백엔드 엔지니어 **강은택**의 개인 포트폴리오 웹사이트입니다.
프로필·기술 스택·경력, 프로젝트 목록, 홈 서버(Raspberry Pi) 실시간 상태를 보여주고,
관리자 로그인 후 프로젝트를 등록·수정·삭제하고 PDF를 첨부할 수 있습니다.

- 서비스 주소: <https://blog.taeklab.cc>
- 백엔드 API: <https://api.taeklab.cc> (별도 Spring Boot 서버)

---

## 주요 기능

| 메뉴 | 경로 | 설명 |
| --- | --- | --- |
| 프로필 | `/profile` | 한 줄 소개, 운영 중에 올린 버전 기록(이전 → 이후), 누적 수치, 핵심 역량, 주요 프로젝트, 경력(근무 기간 자동 계산), 기술 스택, 자격·수상·학력 |
| 프로젝트 | `/projects` | 회사별·개인 프로젝트를 한 줄씩 나열. 항목을 누르면 상세로 이동 |
| 프로젝트 상세 | `/projects/{id}` | 개요, 수치, 기술, 한 일(배경 → 해결 → 판단 → 결과), 관련 트러블슈팅, 첨부 PDF |
| 트러블슈팅 | `/troubleshooting` | 증상 → 원인 → 조치 → 배운 점 순서의 문제 해결 기록 |
| 서버 현황 | `/server-stats` | 홈 서버의 상태(온라인 여부, 가동 시간, CPU 사용률·온도, 메모리, 디스크). 30초마다 자동 새로고침. Grafana·Jenkins 링크 |
| 프로젝트 관리 | `/manage` | 로그인 필요. 프로젝트 기본 정보·기술 스택 생성·수정·삭제, PDF 업로드 |

- `/` 는 `/profile` 로, `/images` 는 `/manage` 로 리다이렉트됩니다.
- 상단 메뉴의 "관리자 로그인"을 누르면 로그인 모달이 뜹니다.
- 한 일, 수치, 트러블슈팅, 프로필 항목은 백엔드 DB(`eun-api-server/db/seed.sql`)에서 관리합니다.

---

## 기술 스택

- **프레임워크**: Next.js 15 (App Router), React 19, TypeScript
- **스타일**: CSS Modules (`src/styles/*.module.css`), 색상·글꼴 토큰은 `src/app/globals.css`
- **글꼴**: IBM Plex Sans KR, IBM Plex Mono (`next/font` 로 빌드 시 내려받아 자체 호스팅)
- **인증**: `jose` 로 만든 JWT(HS256)를 httpOnly 쿠키에 저장
- **배포**: Docker(standalone 빌드) + Docker Compose, Jenkins 파이프라인

---

## 전체 구조

```
브라우저
  │
  ├─ 공개 데이터 조회 (프로필, 프로젝트, 서버 현황, PDF 다운로드)
  │      └──────────────▶  Spring Boot API (api.taeklab.cc)
  │
  └─ 로그인 / 관리 기능
         └─▶ Next.js API Route (/api/*)
                ├─ 세션 쿠키(JWT) 검증
                └─ X-Admin-Token 헤더를 붙여 Spring API로 프록시
```

- 조회 API는 브라우저(또는 서버 컴포넌트)가 백엔드에 바로 요청합니다.
- 데이터를 바꾸는 요청(생성·수정·삭제·업로드)은 항상 Next.js API Route를 거칩니다.
  API Route가 세션을 확인한 뒤 관리자 토큰을 붙여 백엔드로 넘기므로, 관리자 토큰은 브라우저에 노출되지 않습니다.

### 인증 흐름

1. 로그인 폼 → `POST /api/login` (`{ user, pass }`)
2. Next.js 서버가 `POST {API_BASE}/api/users/login` 으로 아이디·비밀번호 확인 (`X-Admin-Token` 포함)
3. 성공하면 JWT(유효기간 1시간)를 만들어 `session` 쿠키에 저장 (`httpOnly`, `sameSite=strict`, 운영 환경에서는 `secure`)
4. `src/middleware.ts` 가 `/manage/**` 요청마다 토큰을 검사하고, 없거나 잘못됐으면 `/login` 으로 보냅니다.
5. `GET /api/session` 으로 로그인 상태를 확인하고, `POST /api/logout` 으로 쿠키를 지웁니다.

---

## 디렉터리 구조

```
src/
├── app/
│   ├── layout.tsx                  # 공통 레이아웃 (상단 메뉴 + 본문 + 하단)
│   ├── globals.css                 # 색상·글꼴 토큰, 공통 기본 스타일
│   ├── page.tsx                    # / → /profile 리다이렉트
│   ├── profile/page.tsx            # 프로필
│   ├── projects/page.tsx           # 프로젝트 목록
│   ├── projects/[id]/page.tsx      # 프로젝트 상세
│   ├── troubleshooting/page.tsx    # 트러블슈팅
│   ├── server-stats/page.tsx       # 서버 현황 (30초 폴링 클라이언트 컴포넌트)
│   ├── manage/page.tsx             # 프로젝트 관리 (로그인 필요)
│   ├── login/page.tsx              # 로그인 페이지
│   └── api/
│       ├── login/route.ts          # 로그인 → JWT 쿠키 발급
│       ├── logout/route.ts         # 로그아웃
│       ├── session/route.ts        # 로그인 상태 확인
│       └── manage/projects/        # 관리자용 백엔드 프록시 (생성·수정·삭제·PDF)
├── components/
│   ├── SiteHeader.tsx              # 상단 메뉴, 로그인/로그아웃
│   ├── SiteFooter.tsx              # 하단 영역
│   ├── ProjectRows.tsx             # 프로젝트 한 줄 목록 (프로필·프로젝트 공용)
│   ├── TroubleList.tsx             # 트러블슈팅 목록 (트러블슈팅·프로젝트 상세 공용)
│   ├── LoginModal.tsx / LoginForm.tsx
│   ├── ManageProjects.tsx          # 프로젝트 관리 폼·목록
│   └── StatusMessage.tsx           # 로딩·오류·404 공용
├── lib/
│   ├── config.ts                   # API_BASE 설정
│   ├── backend.ts                  # 백엔드 공개 API 조회 함수
│   ├── format.ts                   # 기간 계산, 줄바꿈·쉼표 분리, 링크 검증
│   ├── dataType.ts                 # Profile, Project, Achievement, Troubleshooting 등 타입
│   ├── auth.ts / adminAuth.ts      # JWT 세션, 관리자 확인
│   └── server/                     # rate limit, 입력 검증, 백엔드 프록시
├── styles/                         # 페이지별 CSS Module (page.module.css 는 공용 뼈대)
└── middleware.ts                   # /manage 접근 보호
```

---

## 사용하는 백엔드 API

| 메서드 | 경로 | 호출 위치 | 용도 |
| --- | --- | --- | --- |
| GET | `/api/users/getUser?userName=...` | Next.js 서버 | 프로필(역량·수치·경력·기술·자격·버전 전환) 조회 |
| POST | `/api/users/login` | Next.js 서버 | 로그인 확인 |
| GET | `/api/projects/getProjects` | Next.js 서버 | 프로젝트 목록 (기술·수치·한 일 포함) |
| GET | `/api/projects/{id}` | Next.js 서버 | 프로젝트 상세 (관련 트러블슈팅 포함) |
| GET | `/api/troubleshooting` | Next.js 서버 | 트러블슈팅 전체 |
| GET | `/api/projects/{id}/pdf` | 브라우저 | 첨부 PDF 다운로드 |
| POST | `/api/projects` | Next.js 서버 (관리자) | 프로젝트 생성 |
| PUT | `/api/projects/{id}` | Next.js 서버 (관리자) | 프로젝트 수정 |
| DELETE | `/api/projects/{id}` | Next.js 서버 (관리자) | 프로젝트 삭제 |
| POST | `/api/projects/{id}/pdf` | Next.js 서버 (관리자) | PDF 업로드 |
| GET | `/api/server-stats` | 브라우저 | 서버 상태 |

응답은 모두 `{ success: boolean, data: T, error: string }` 형식입니다.
관리자 요청에는 `X-Admin-Token` 헤더가 붙습니다.

프로젝트 관리 화면에서 기술 스택은 한 줄에 하나씩 `이름:카테고리번호` 형식으로 입력합니다 (예: `SpringBoot:1`).

---

## 환경 변수

| 이름 | 적용 시점 | 설명 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | **빌드 시** (클라이언트 번들에 포함) | 백엔드 API 주소. 기본값 `https://api.taeklab.cc` |
| `AUTH_SECRET` | 실행 시 | JWT 서명 키. 없으면 로그인·세션 확인이 실패합니다 |
| `ADMIN_TOKEN` | 실행 시 | Next.js → Spring 관리자 요청용 토큰. 백엔드 설정과 같아야 합니다 |
| `NEXT_OUTPUT` | 빌드 시 | `export` 로 주면 정적 export, 아니면 `standalone` 빌드 |

로컬 개발 시에는 프로젝트 루트에 `.env.local` 파일을 만들어 넣으면 됩니다 (`.env*` 파일은 git에서 제외됨).

```env
NEXT_PUBLIC_API_BASE_URL=https://api.taeklab.cc
AUTH_SECRET=임의의_긴_랜덤_문자열
ADMIN_TOKEN=백엔드와_같은_토큰
```

---

## 로컬 실행

Node.js 20 이상이 필요합니다 (Docker 이미지는 Node 24 사용).

```bash
npm install
```

```bash
npm run dev
```

<http://localhost:3000> 에서 확인할 수 있습니다.

그 외 스크립트:

```bash
npm run build   # 운영 빌드
npm run start   # 빌드 결과 실행
npm run lint    # ESLint 검사
```

---

## 배포

### Docker

`Dockerfile` 은 3단계 멀티 스테이지 빌드입니다.

1. **deps**: `npm ci --include=dev` 로 의존성 설치
2. **builder**: `NEXT_PUBLIC_API_BASE_URL` 을 받아 `npm run build` (standalone 출력)
3. **runner**: `.next/standalone`, `.next/static`, `public` 만 복사해 `node server.js` 실행 (포트 **8082**)

```bash
docker build --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.taeklab.cc -t eun-blog:latest .
```

### Docker Compose

`docker-compose.yml` 은 `eun-blog` 컨테이너를 `8082:8082` 로 띄우고, `TZ=Asia/Seoul`, `AUTH_SECRET`, `ADMIN_TOKEN` 을 주입합니다. `restart: always` 설정이 되어 있습니다.

```bash
docker compose up -d
```

### Jenkins

`Jenkinsfile` 의 파이프라인 순서:

1. **Checkout**: 저장소 체크아웃
2. **Build**: `docker build` 로 `eun-blog:latest` 이미지 생성 → `docker-compose.yml` 을 `/host/eun-blog` 로 복사 → `docker compose up -d --force-recreate app` 으로 재배포

운영 환경은 Raspberry Pi 홈 서버 위의 Docker이며, Cloudflare를 거쳐 서비스됩니다. 서버 모니터링은 Grafana로 합니다.

---

## 보안 설정

- `next.config.ts` 에서 모든 응답에 보안 헤더를 붙입니다:
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`
- CSP는 자기 도메인, 백엔드 API, Google Fonts, Cloudflare Insights만 허용합니다.
- 관리자 API는 세션 검증 후에만 백엔드로 전달하며, 프로젝트 `id` 는 숫자인지 확인해 경로 조작을 막습니다.
- 프로필의 외부 링크는 `http(s)` 만, 이메일은 형식을 검사한 뒤에만 링크로 만듭니다.
