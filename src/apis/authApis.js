// apis/authApis.js
import { apiClient } from "./apiClient"; // <-- 수정된 클라이언트를 import

export const signUpApi = async (reqBody) => {
    const { data } = await apiClient.post('/api/v1/auth/signup', reqBody);
    return data;
}

export const loginApi = async (reqBody) => {
    const { data } = await apiClient.post('/api/v1/auth/login', reqBody);
    return data;
}

export const logoutApi = async () => {
    // 이제 logoutApi도 똑같은 apiClient를 사용합니다.
    // 인터셉터가 알아서 토큰을 헤더에 넣어줄 겁니다.
    const { data } = await apiClient.post('/api/v1/auth/logout');
    return data;
}