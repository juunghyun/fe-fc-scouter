import {create} from "zustand"

export const useAuthStore = create((set, get) => ({
    email: null,
    isLoggedIn: false,
    nickname: null,
    accessToken: null,
    refreshToken: null,
    
    login: (userData, token, email) => set({
        email: email,
        isLoggedIn: true,
        nickname: userData,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
    }),
    logout: () => set({
        email: null,
        isLoggedIn: false,
        nickname: null,
        accessToken: null,
        refreshToken: null,
    }),
    
}));

