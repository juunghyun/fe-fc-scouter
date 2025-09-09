import axios from 'axios';
import { useAuthStore } from "../common/zustand/LoginState";

// 1. baseURL 설정을 완전히 삭제합니다.
//    이제 모든 요청은 현재 웹페이지의 주소를 기준으로 한 상대 경로('/api/...')로 보내집니다.
export const apiClient = axios.create({
    // baseURL: baseURL, // <-- 이 줄을 삭제하거나 주석 처리!
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. 요청 인터셉터는 수정할 필요 없이 그대로 둡니다.
//    모든 API 요청(' /api/...')이 보내지기 전에 토큰을 자동으로 추가해 줍니다.
apiClient.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. 응답 인터셉터도 수정할 필요 없이 그대로 둡니다.
//    401 에러가 발생하면 자동으로 로그아웃을 처리합니다.
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error('인증 에러 (401): 세션이 만료되었습니다.');
            useAuthStore.getState().logout();
            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
            window.location.href = '/login';
        }
        return Promise.reject(error.response.data);
    }
);