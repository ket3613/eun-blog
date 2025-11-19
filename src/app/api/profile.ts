// src/api/profile.ts
export interface Profile {
    id: number;
    name: string;
    email: string;
    bio?: string;
}


export async function getProfile(userName: string) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${BASE_URL}/api/users/getUser?userName=${userName}`, {
        method: 'GET',
    });

    console.log("=========================================1");
    console.log(res);
    console.log("=========================================2");
    if (!res.ok) {
        // 서버 에러 처리
        const msg = await res.text().catch(() => '');
        throw new Error(`프로필 조회 실패 (${res.status}) ${msg}`);
    }

    return res.json();
}
