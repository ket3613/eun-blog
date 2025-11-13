# --- deps stage: 의존성 설치 단계 ---
FROM node:20-alpine AS deps         # Node 20 + Alpine (가벼운 베이스 이미지)
WORKDIR /app                        # 앞으로 모든 작업은 /app 디렉터리에서 수행

# 패키지 정보만 먼저 복사해서, node_modules 캐시를 최대한 활용
COPY package.json package-lock.json ./

# 🔴 기존: npm ci --omit=dev  → devDependencies(= next 등) 빠짐 → 빌드 실패
# ✅ 수정: 빌드 단계라 devDependencies도 같이 설치해야 함
#   - 그냥 npm ci 만 쓰거나
#   - npm ci --include=dev 를 사용 (동일 효과)
RUN npm ci --include=dev
# 또는
# RUN npm ci


# --- builder stage: 실제 Next.js 빌드 단계 ---
FROM node:20-alpine AS builder      # 빌드도 Node 20 Alpine 사용
WORKDIR /app

# deps 단계에서 설치한 node_modules를 그대로 복사
#  - 소스 코드보다 먼저 복사해서 Docker 레이어 캐시 효율 증가
COPY --from=deps /app/node_modules ./node_modules

# 나머지 소스 코드 전체 복사 (pages/app, components, public, next.config.js 등)
COPY . .

# Next 익명 텔레메트리 비활성화 (선택 사항이지만 보통 켜 둠)
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js 빌드 수행
#  - package.json / next.config.js 에서 "output": "standalone" 이 설정되어 있어야
#    .next/standalone 이 생성됨
RUN npm run build  # .next/standalone 생성


# --- runtime stage: 실제 배포용 컨테이너 ---
FROM node:20-alpine AS runner       # 런타임도 Node 20 Alpine 사용
WORKDIR /app

# 런타임 환경변수
ENV NODE_ENV=production
ENV PORT=8082                       # 컨테이너 내부 Next 서버 포트
ENV HOSTNAME=0.0.0.0                # 모든 인터페이스에서 요청 수신

# builder 단계에서 생성된 standalone 번들/정적 파일/퍼블릭 파일만 복사
#  - .next/standalone 은 Next 서버 실행에 필요한 node_modules, server.js 등을 포함
COPY --from=builder /app/.next/standalone ./   # server.js, node_modules 포함
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 컨테이너가 외부로 노출할 포트 지정 (호스트에서는 docker run -p 로 매핑)
EXPOSE 8082

# JSONArgsRecommended 경고 해결을 위해 배열 형식 CMD 사용
#  - .next/standalone 안에 server.js 가 있다고 가정 (Next standalone 기본)
CMD ["node", "server.js"]
