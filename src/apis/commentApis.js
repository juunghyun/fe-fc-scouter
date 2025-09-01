import {authInstance, defaultInstance} from "./authorization";

export const getCommentListApi = async (id) => {
    const {data} = await defaultInstance.get(`/api/v1/players/${id}/comments`);
    return data;
}

export const postCommentApi = async (id, reqBody) => {
    const {data} = await authInstance.post(`/api/v1/players/${id}/comments`, reqBody);
    return data;
}