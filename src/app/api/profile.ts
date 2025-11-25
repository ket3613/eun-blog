import {ApiResponse, Profile} from "@/lib/dataType";

export async function getProfile(userName: string) {

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
        if (typeof window !== 'undefined') {
            console.error('NEXT_PUBLIC_API_BASE_URL is not set');
        }
        // 디버깅용: 일단 빈 데이터 반환해서 화면만 깨지지 않게 할 수도 있음
        // throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
        return Promise.reject(new Error('NEXT_PUBLIC_API_BASE_URL is not set'));
    }

    const url = new URL('/api/users/getUser', baseUrl);
    url.searchParams.set('userName', userName);

    const res = await fetch(url.toString(), {
        method: 'GET',
    });

    if (!res.ok) {
        // 서버 에러 처리
        const msg = await res.text().catch(() => '');
        throw new Error(`프로필 조회 실패 (${res.status}) ${msg}`);
    }
    const body: ApiResponse = await res.json();
    return body.data;
}
