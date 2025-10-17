import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export',  // ← 비활성화
  output: 'standalone',
};
export default nextConfig;
