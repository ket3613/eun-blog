import { ApiResponse, Profile } from "@/lib/dataType";

export async function getProfile(userName: string): Promise<Profile> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
        if (typeof window !== 'undefined') {
            console.error('NEXT_PUBLIC_API_BASE_URL is not set');
        }
        return Promise.reject(new Error('NEXT_PUBLIC_API_BASE_URL is not set'));
    }

    const url = new URL('/api/users/getUser', baseUrl);
    url.searchParams.set('userName', userName);

    const res = await fetch(url.toString(), { method: 'GET' });

    if (!res.ok) {
        console.error(`프로필 조회 실패: ${res.status}`);
        throw new Error('프로필 조회에 실패했습니다.');
    }

    const body: ApiResponse<Profile> = await res.json();
    if (!body.success || !body.data) {
        throw new Error('프로필 조회에 실패했습니다.');
    }
    return body.data;
}
