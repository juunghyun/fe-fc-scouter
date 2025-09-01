import {authInstance, defaultInstance} from "./authorization";

export const signUpApi = async (reqBody) => {
    const {data} = await defaultInstance.post('/api/v1/auth/signup', reqBody);
    return data;
}

export const loginApi = async (reqBody) => {
    const {data} = await defaultInstance.post('/api/v1/auth/login', reqBody);
    return data;
}

export const logoutApi = async () => {
    const {data} = await authInstance.post('/api/v1/auth/logout');
    return data;
}