import axios from 'axios';
import {useAuthStore} from "../common/zustand/LoginState";

export const authInstance = axios.create({
    baseURL: "http://localhost:8080"
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
        const isAuthRequest = error.config?.headers?.Authorization;
        
        // CORS 에러 + 인증 요청 = 401로 추정
        const isCorsError = !error.response && error.message.includes('Network Error');
        
        if ((error.response?.status === 401) || (isCorsError && isAuthRequest)) {
            console.log('인증 에러 감지 (401 또는 CORS)');
            useAuthStore.getState().logout();
            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
            window.location.href = '/main';
        }
        
        return Promise.reject(error);
    }
);

export const defaultInstance = axios.create({
    baseURL: process.env.REACT_APP_BE_URL
});