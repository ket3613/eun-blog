import type { NextConfig } from 'next';

// .env(.local) 파일과 프로세스 환경변수에서 값을 주입하여
// 클라이언트 번들에 빌드 타임에 고정합니다.
// NEXT_PUBLIC_ 접두사는 원래 자동 노출되지만, 명시적으로 설정해 두면
// 빌드 환경에서 값이 없을 때 디폴트나 에러 검사를 쉽게 할 수 있습니다.
const nextConfig: NextConfig = {
  output: process.env.NEXT_OUTPUT === 'export' ? 'export' : 'standalone',
  env: {
    // 빌드 시점에 주입. 값이 없으면 undefined가 들어가므로 Docker/CI에서 꼭 전달하세요.
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};
export default nextConfig;
