// apiClient 하나만 import하여 모든 요청을 처리합니다.
import { apiClient } from "./apiClient";

// 쿼리 파라미터를 만드는 헬퍼 함수 (이 부분은 수정할 필요 없습니다.)
function buildQueryString(obj) {
    const params = new URLSearchParams();

    Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value
                .filter(item => item !== null && item !== undefined && String(item).trim() !== '')
                .forEach(item => params.append(key, item));
        } else if (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ''
        ) {
            params.append(key, value);
        }
    });

    return params.toString();
}

// 선수 검색
export const getPlayerSearch = async (filters) => {
    const tmp = {name: filters.searchName, nation: filters.nation, teamNames: [filters.team1, filters.team2], page: filters.page};
    const queryString = buildQueryString(tmp);
    // defaultInstance -> apiClient로 변경
    const {data} = await apiClient.get(`/api/v1/players/search?${queryString}`);
    return data;
};

// 선수 실시간 가격 조회
export const getPlayerPrice = async (id, grade = 1) => {
    // defaultInstance -> apiClient로 변경
    const {data} = await apiClient.get(`/api/v1/players/${id}/price?grade=${grade ? grade : 1}`);
    return data;
};

// 선수 상세 정보 조회 (스탯 시뮬레이션 포함)
export const getPlayerDetail = async (id, options) => {
    // defaultInstance -> apiClient로 변경
    const {data} = await apiClient.get(`/api/v1/players/${id}?grade=${options.grade ? options.grade : 1}&adaptation=${options.adaptation ? options.adaptation : 1}&teamColor=${options.teamColor}`);
    return data;
}