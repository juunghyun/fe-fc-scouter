// apiClient 하나만 import하여 모든 요청을 처리합니다.
import { apiClient } from "./apiClient";

// 댓글 목록 조회 (인증 불필요)
export const getCommentListApi = async (id) => {
    // defaultInstance -> apiClient로 변경
    const {data} = await apiClient.get(`/api/v1/players/${id}/comments`);
    return data;
}

// 댓글 작성 (인증 필요)
export const postCommentApi = async (id, reqBody) => {
    // authInstance -> apiClient로 변경
    // 인터셉터가 알아서 Authorization 헤더를 추가해줍니다.
    const {data} = await apiClient.post(`/api/v1/players/${id}/comments`, reqBody);
    return data;
}

// 댓글 수정 (인증 필요)
export const editCommentApi = async (id, content) => {
    // authInstance -> apiClient로 변경
    const {data} = await apiClient.put(`/api/v1/comments/${id}`, {content});
    return data;
}

// 댓글 삭제 (인증 필요)
export const deleteCommentApi = async (id) => {
    // authInstance -> apiClient로 변경
    const {data} = await apiClient.delete(`/api/v1/comments/${id}`);
    return data;
}