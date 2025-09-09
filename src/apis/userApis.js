// apiClient 하나만 import하여 모든 요청을 처리합니다.
import { apiClient } from "./apiClient";

// 내 정보 조회
export const getUserInfoApi = async () => {
    // authInstance -> apiClient로 변경
    const {data} = await apiClient.get('/api/v1/users/me');
    return data;
}

// 회원 탈퇴
export const deleteUserApi = async () => {
    // authInstance -> apiClient로 변경
    const {data} = await apiClient.delete('/api/v1/users/me');
    return data;
}