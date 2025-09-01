import {defaultInstance} from "./authorization";

function buildQueryString(obj) {
    const params = new URLSearchParams();
    
    Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            // 배열에서 빈 문자열 제거
            value
            .filter(item => item !== null && item !== undefined && String(item).trim() !== '')
            .forEach(item => params.append(key, item));
        } else if (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ''
        ) {
            // 빈 문자열, null, undefined 제외
            params.append(key, value);
        }
    });
    
    return params.toString();
}

export const getPlayerSearch = async (filters) => {
    const tmp = {name: filters.searchName, nation: filters.nation, teamNames: [filters.team1, filters.team2]};
    const queryString = buildQueryString(tmp);
    const {data} = await defaultInstance.get(`/api/v1/players/search?${queryString}`);
    return data;
};

export const getPlayerPrice = async (id, grade = 1) => {
    const {data} = await defaultInstance.get(`/api/v1/players/${id}/price?grade=${grade ? grade : 1}`);
    return data;
};

export const getPlayerDetail = async (id, options) => {
    const {data} = await defaultInstance.get(`/api/v1/players/${id}?grade=${options.grade ? options.grade : 1}&adaptation=${options.adaptation ? options.adaptation : 1}&teamColor=${options.teamColor}`);
    return data;
}