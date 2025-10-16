# --- build ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# next.config.ts에 output: 'export' 있어야 함
RUN npx --no-install next build

# --- runtime ---
FROM nginx:alpine
ENV TZ=Asia/Seoul
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
