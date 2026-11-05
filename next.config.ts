import type { NextConfig } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.euntaek.cc';
const isDev = process.env.NODE_ENV !== 'production';

// 'unsafe-eval' 은 개발 모드(React Fast Refresh)에서만 필요하므로 운영 빌드에서는 제외한다.
// 'unsafe-inline' 은 Next.js 가 넣는 인라인 부트스트랩 스크립트 때문에 유지 (nonce 방식 전환 시 제거 가능).
const csp = [
    "default-src 'self'",
    `connect-src 'self' ${API_BASE} https://cloudflareinsights.com`,
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://static.cloudflareinsights.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
].join('; ');

const nextConfig: NextConfig = {
    output: process.env.NEXT_OUTPUT === 'export' ? 'export' : 'standalone',
    poweredByHeader: false,
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'Content-Security-Policy', value: csp },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
                    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
                ],
            },
            {
                // 로그인/관리 화면은 검색엔진 색인 및 캐시 제외
                source: '/(login|manage)(.*)',
                headers: [
                    { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
                    { key: 'Cache-Control', value: 'no-store' },
                ],
            },
        ];
    },
};

export default nextConfig;
