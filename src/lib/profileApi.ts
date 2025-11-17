import { api } from "./api";
import { Profile } from "./dataType";

/**
 * 이름(name)을 인자로 받아 서버에 요청 → Profile 타입 반환
 */
export function getProfile() {
    return api<Profile>(`/api/profile`);
}