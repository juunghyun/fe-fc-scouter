// apis/apiClient.js
import axios from 'axios';
import { useAuthStore } from "../common/zustand/LoginState";

// 1. 환경 변수에서 API 기본 URL을 읽어옵니다.
const baseURL = process.env.REACT_APP_API_BASE_URL;

// 2. 하나의 API 클라이언트를 생성합니다.
export const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 3. 요청 인터셉터(interceptor)를 추가합니다.
//    모든 API 요청이 보내지기 전에, 이 코드가 먼저 실행됩니다.
apiClient.interceptors.request.use(
    (config) => {
        // Zustand 스토어에서 accessToken을 가져옵니다.
        const { accessToken } = useAuthStore.getState();

        // accessToken이 있다면, Authorization 헤더를 추가합니다.
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 4. 응답 인터셉터(interceptor)를 추가합니다.
//    (기존의 401 에러 처리 로직은 그대로 유지해도 좋습니다.)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // ... (기존의 401 에러 시 자동 로그아웃 처리 로직)
        return Promise.reject(error);
    }
);