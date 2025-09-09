// apiClient 하나만 import하여 모든 요청을 처리합니다.
import { apiClient } from "./apiClient";

// 내 즐겨찾기 목록 조회
export const getFavoriteApi = async () => {
    // authInstance -> apiClient로 변경
    const {data} = await apiClient.get('/api/v1/favorites');
    return data;
}

// 즐겨찾기 추가
export const addFavoriteApi = async (playerId, grade) => {
    // authInstance -> apiClient로 변경
    const {data} = await apiClient.post('/api/v1/favorites', {playerId, grade: grade ? grade : 1});
    return data;
}

// 즐겨찾기 삭제
export const deleteFavoriteApi = async (playerId) => {
    // authInstance -> apiClient로 변경
    const {data} = await apiClient.delete(`/api/v1/favorites/${playerId}`);
    return data;
}