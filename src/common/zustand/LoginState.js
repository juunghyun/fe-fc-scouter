import {create} from "zustand"
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            userId: null,
            email: null,
            isLoggedIn: false,
            nickname: null,
            accessToken: null,
            refreshToken: null,
            
            login: (userData, userId, token, email) => set({
                userId: userId,
                email: email,
                isLoggedIn: true,
                nickname: userData,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            }),
            
            logout: () => set({
                userId: null,
                email: null,
                isLoggedIn: false,
                nickname: null,
                accessToken: null,
                refreshToken: null,
            }),
        }),
    )
);

