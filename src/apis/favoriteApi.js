import {authInstance} from "./authorization";

export const getFavoriteApi = async () => {
    const {data} = await authInstance.get('/api/v1/favorites');
    return data;
}

export const addFavoriteApi = async (playerId, grade) => {
    const {data} = await authInstance.post('/api/v1/favorites', {playerId, grade: grade ? grade : 1});
    return data;
}

export const deleteFavoriteApi = async (playerId) => {
    const {data} = await authInstance.delete(`/api/v1/favorites/${playerId}`);
    return data;
}