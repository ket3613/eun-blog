# --- 빌드 스테이지: Node로 리액트 번들 빌드 ---
FROM node:18-alpine AS build
WORKDIR /app
# 종속성 캐시 최적화
COPY package*.json ./
RUN npm ci
# 소스 복사 후 빌드
COPY . .
RUN npm run build

# --- 런타임 스테이지: Nginx로 정적 서비스 ---
FROM nginx:alpine
# 리액트 빌드 산출물 복사
COPY --from=build /app/build /usr/share/nginx/html
# 기본 Nginx conf 그대로 사용(필요시 커스텀 conf 추가)
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
