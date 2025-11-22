import {ApiResponse, Profile} from "@/lib/dataType";

export async function getProfile(userName: string) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = new URL('/api/users/getUser', BASE_URL);
    url.searchParams.set('userName', userName); // 여기서 자동 인코딩됨
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
