##############################
# 1) deps stage: 의존성 설치
##############################
FROM node:24.11.1 AS deps
WORKDIR /app

# package.json만 먼저 복사 → node_modules 캐시 활용
COPY package.json package-lock.json ./

# 🔥 Next.js 빌드는 devDependencies(= next, eslint, typescript 등) 필요
#    Node 22에서는 npm 동작이 더 엄격해 omit=dev 사용 시 빌드 100% 실패함
RUN npm ci --include=dev
# 또는 그냥 RUN npm ci 로 동일함


##############################
# 2) builder stage: Next.js build
##############################
FROM node:24.11.1 AS builder
WORKDIR /app

# deps 단계에서 설치한 node_modules 복사
COPY --from=deps /app/node_modules ./node_modules

# 소스 코드 전체 복사
COPY . .

# Next.js telemetry OFF
ENV NEXT_TELEMETRY_DISABLED=1

# ----- 환경변수 주입 -----
# 클라이언트 번들에서 사용할 공개 변수(NEXT_PUBLIC_*)는 "빌드 시점"에 고정됩니다.
# CI나 docker build 시 아래 ARG로 값을 전달하세요.
#   docker build --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.euntaek.cc -t eun-blog:latest .
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# 🔥 Next.js standalone 빌드를 수행
RUN npm run build


##############################
# 3) runtime stage: 실제 배포
##############################
FROM node:24.11.1 AS runner
WORKDIR /app

# 런타임 모드 설정
ENV NODE_ENV=production
ENV PORT=8082
ENV HOSTNAME=0.0.0.0

# 런타임에도 동일 변수 주입(서버 전용 코드에서 사용할 가능성 대비)
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Standalone 빌드 결과만 복사
# - standalone 디렉토리 안에 server.js, node_modules 포함됨
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 외부 노출 포트
EXPOSE 8082

# JSON CMD 포맷 (signal handling 안정)
CMD ["node", "server.js"]
