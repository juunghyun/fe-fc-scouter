import axios from 'axios';
import {useAuthStore} from "../common/zustand/LoginState";

export const authInstance = axios.create({
    baseURL: ''
})



authInstance.interceptors.request.use(
    (config) => {
        const {accessToken} = useAuthStore.getState();
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

authInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 401 에러 시 로그아웃 처리
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
            // 로그인 페이지로 리다이렉트 (옵션)
            window.location.href = '/main';
        }
        return Promise.reject(error);
    }
);

export const defaultInstance = axios.create({
    baseURL: process.env.REACT_APP_BE_URL
});