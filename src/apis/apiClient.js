import axios from 'axios';
import { useAuthStore } from "../common/zustand/LoginState";

// 배포용 / 로컬 개발용 분기
const baseURL = process.env.NODE_ENV === 'production'
    ? "https://be-fc-scouter-app-djgdgqcgeedhe4fs.southeastasia-01.azurewebsites.net"
    : "http://localhost:8080";

export const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 처리
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('인증 에러 (401): 세션 만료');
            useAuthStore.getState().logout();
            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
    }
);
