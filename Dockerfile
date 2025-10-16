FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# build → export 분리
RUN npx --no-install next build && npx --no-install next export

# 산출물은 기본적으로 ./out
FROM nginx:alpine
ENV TZ=Asia/Seoul
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
