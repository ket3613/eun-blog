# --- build stage: React/Vite/Next(SSG) ---
FROM node:18-alpine AS build
WORKDIR /app
# 의존성 캐시
COPY package.json package-lock.json yarn.lock pnpm-lock.yaml* . 2>/dev/null || true
RUN corepack enable && \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi
# 소스 복사 후 빌드
COPY . .
RUN if npm run | grep -q " build"; then npm run build; \
    elif command -v yarn >/dev/null 2>&1; then yarn build; \
    else echo "no build script"; exit 1; fi
# 산출물 정규화 → /app/_out
RUN set -e; \
    if [ -d build ]; then mv build _out; \
    elif [ -d dist ]; then mv dist _out; \
    elif [ -d out ]; then mv out _out; \
    elif [ -d .next ]; then npx --yes next@latest export -o _out; \
    else echo "no static output"; ls -la; exit 1; fi

# --- runtime: nginx ---
FROM nginx:alpine
ENV TZ=Asia/Seoul
COPY --from=build /app/_out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
