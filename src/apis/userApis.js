import {authInstance} from "./authorization";

export const getUserInfoApi = async () => {
    const {data} = await authInstance.get('/api/v1/users/me');
    return data;
}

export const deleteUserApi = async () => {
    const {data} = await authInstance.delete('/api/v1/users/me');
    return data;
}