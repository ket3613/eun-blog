import {ApiResponse, Profile} from "@/lib/dataType";

export async function getProfile(userName: string) {

    const baseUrl = "https://api.euntaek.cc";
    console.log('BASE_URL =', baseUrl);  // "https://api.euntaek.cc" 찍혀야 정상

    if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
    }

    const url = new URL('/api/users/getUser', baseUrl);
    url.searchParams.set('userName', userName);

    console.log(url);
    const res = await fetch(url.toString(), {
        method: 'GET',
    });
    console.log(res);

    if (!res.ok) {
        // 서버 에러 처리
        const msg = await res.text().catch(() => '');
        throw new Error(`프로필 조회 실패 (${res.status}) ${msg}`);
    }
    const body: ApiResponse = await res.json();
    return body.data;
}
