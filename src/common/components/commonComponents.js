import {colors} from "../style/colors";

export function hexToRgba(hexColor, opacity) {
    const hex = hexColor.replace('#', '');
    const fullHex = hex.length === 3
        ? hex.split('').map(char => char + char).join('')
        : hex;
    
    const r = parseInt(fullHex.slice(0, 2), 16);
    const g = parseInt(fullHex.slice(2, 4), 16);
    const b = parseInt(fullHex.slice(4, 6), 16);
    
    const alpha = opacity > 1 ? opacity / 100 : opacity;
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getScoreColor(score) {
    const numScore = Number(score);
    
    if (isNaN(numScore) || numScore < 80) return '#808080';  // 회색
    if (numScore < 100) return '#87CEEB';  // 하늘색
    if (numScore < 110) return '#1E90FF';  // 남색
    if (numScore < 120) return '#8A2BE2';  // 보라색
    if (numScore < 130) return '#FF69B4';  // 분홍색
    if (numScore < 140) return '#FF4500';  // 빨간색
    if (numScore < 150) return '#FFD700';  // 노란색
    return '#00CED1';  // 민트색 (150+)
    
}

// 경 단위까지 지원하는 버전
export function numberToKoreanSimple(num) {
    if (num === 0) return '0';
    
    const isNegative = num < 0;
    num = Math.abs(num);
    
    const gyeong = Math.floor(num / 10000000000000000); // 경 (10^16)
    const jo = Math.floor((num % 10000000000000000) / 1000000000000); // 조 (10^12)
    const eok = Math.floor((num % 1000000000000) / 100000000); // 억 (10^8)
    const man = Math.floor((num % 100000000) / 10000); // 만 (10^4)
    const rest = num % 10000; // 나머지
    
    let result = '';
    
    if (gyeong > 0) {
        result += gyeong + '경';
    }
    
    if (jo > 0) {
        result += jo + '조';
    }
    
    if (eok > 0) {
        result += eok + '억';
    }
    
    if (man > 0) {
        result += man + '만';
    }
    
    if (rest > 0) {
        result += rest;
    }
    
    return isNegative ? '-' + result : result;
}

// 더 정확한 계산을 위한 향상된 버전
export function getTimeAgoAdvanced(dateString) {
    const now = new Date();
    const targetDate = new Date(dateString);
    const diffInMs = now - targetDate;
    
    if (diffInMs < 0) {
        return '방금 전';
    }
    
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    // 년/월 계산을 더 정확하게
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    
    const yearDiff = nowYear - targetYear;
    const monthDiff = nowMonth - targetMonth + (yearDiff * 12);
    
    if (diffInSeconds < 60) {
        return '방금 전';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
        return `${diffInDays}일 전`;
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks}주 전`;
    } else if (monthDiff < 12) {
        return `${monthDiff}개월 전`;
    } else {
        return `${yearDiff}년 전`;
    }
}

export const OverallComponent = ({overall, isDetail = true}) => {
    const overallColor = getScoreColor(overall);
    
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5.5px 8px",
            borderRadius: isDetail ? 5 : 10,
            fontSize: isDetail ? 14 : 16,
            fontWeight: 700,
            color: overallColor,
            border: isDetail ? "none" : `1px solid ${hexToRgba(overallColor, 20)}`,
            background: isDetail ? colors.halfBrightDark : hexToRgba(overallColor, 10),
        }}>
            {overall}
        </div>
    )
}