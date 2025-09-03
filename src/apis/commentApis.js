import {authInstance, defaultInstance} from "./authorization";

export const getCommentListApi = async (id) => {
    const {data} = await defaultInstance.get(`/api/v1/players/${id}/comments`);
    return data;
}

export const postCommentApi = async (id, reqBody) => {
    const {data} = await authInstance.post(`/api/v1/players/${id}/comments`, reqBody);
    return data;
}

export const editCommentApi = async (id, content) => {
    const {data} = await authInstance.put(`/api/v1/comments/${id}`, {content});
    return data;
}

export const deleteCommentApi = async (id) => {
    const {data} = await authInstance.delete(`/api/v1/comments/${id}`);
    return data;
}