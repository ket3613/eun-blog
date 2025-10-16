// eun-blog/next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',          // next export 사용
  images: { unoptimized: true }, // 외부 이미지 최적화 비활성화
  trailingSlash: true        // Nginx 정적 호스팅에 유리
  // rewrites/redirects/middleware/API routes 사용 금지
}
export default {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true
}

