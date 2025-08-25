import styles from './MainPage.module.css';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

export const MainPage = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            height: "calc(100% - 64px)",
            minHeight: 300,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            padding: "0 50px",
        }}
        >
            <span className={styles.description}>실시간 가격과 선수들의 스탯들을 제공합니다!</span>
            <span className={styles.description}>궁금한 선수들을 즐겨찾기해보세요.</span>
            
            <div className={styles.subContainer}
                 style={{
                     maxWidth: 672,
                     width: "100%",
                     height: 154,
                     marginTop: 53,
                     marginBottom: 80
                 }}>
                <input style={{width: 485, height: 56}}
                       placeholder={"선수 이름을 검색해보세요!"}
                />
                <button style={{
                    background: "#D97706",
                    width: 120,
                    height: 56,
                    marginLeft: 15
                }}>
                    Search
                </button>
            </div>
            {/*전부다 미디어쿼리 적용예정 +  반응형 */}
            <div style={{display: "flex", width: "100%", gap: 32, justifyContent: "center"}}>
                <div className={`${styles.subContainer} ${styles.subContainerDetail}`}>
                    <div className={styles.iconContainer}>
                        <PeopleAltOutlinedIcon style={{width: 34, height: 34}}
                                               htmlColor={"#D97706"}
                        />
                    </div>
                    <span className={styles.subTitle}>선수 검색</span>
                </div>
                <div className={`${styles.subContainer} ${styles.subContainerDetail}`}>
                    <div className={styles.iconContainer}>
                        <TrendingUpOutlinedIcon style={{width: 34, height: 34}}
                                               htmlColor={"#D97706"}
                        />
                    </div>
                    <span className={styles.subTitle}>즐겨찾기</span>
                </div>
                <div className={`${styles.subContainer} ${styles.subContainerDetail}`}
                >
                    <div className={styles.iconContainer}>
                        <StarBorderOutlinedIcon style={{width: 34, height: 34}}
                                                htmlColor={"#D97706"}
                        />
                    </div>
                    <span className={styles.subTitle}>내 정보</span>
                </div>
            </div>
        
        </div>
    );
}