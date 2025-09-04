import styles from './MainPage.module.css';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import {useNavigate} from "react-router";
import {useAuthStore} from "../../../common/zustand/LoginState";
import {useState} from "react";
import {Footer} from "../../../common/components/commonComponents";

export const MainPage = () => {
    const navigation = useNavigate();
    const {isLoggedIn} = useAuthStore();
    const [searchText, setSearchText] = useState("");
    
    const onClickSearch = () => {
        if (searchText.trim() === "") {
            alert("검색어를 입력해주세요.");
            return;
        }
        navigation(`/player-search?query=${encodeURIComponent(searchText)}`);
    }
    
    return (
        <div className={styles.mainContainer}>
            <div style={{
                display: "flex",
                width: "100%",
                // height: "90%",
                alignItems: "center",
                // background: "white",
                justifyContent: "center",
                flexDirection: "column"
            }}>
                <span className={styles.description}>실시간 가격과 선수들의 스탯들을 제공합니다!</span>
                <span className={styles.description}>궁금한 선수들을 즐겨찾기해보세요.</span>
                
                {/*검색박스*/}
                <div className={styles.subContainer}
                     style={{
                         maxWidth: 672,
                         width: "100%",
                         height: 154,
                         marginTop: 53,
                         marginBottom: 80,
                         padding: "0 20px",
                     }}
                >
                    <input style={{width: 485, height: 56}}
                           value={searchText}
                           onChange={(e) => setSearchText(e.target.value)}
                           placeholder={"선수 이름을 검색해보세요!"}
                           onKeyDown={(e) => {
                               if (e.key === 'Enter') {
                                   onClickSearch();
                               }
                           }}
                    />
                    <button style={{
                        background: "#D97706",
                        width: 120,
                        height: 56,
                        marginLeft: 15
                    }}
                            onClick={onClickSearch}
                    >
                        Search
                    </button>
                </div>
                {/*전부다 미디어쿼리 적용예정 +  반응형 */}
                <div style={{display: "flex", width: "100%", gap: 32, justifyContent: "center"}}>
                    <button className={`${styles.subContainer} ${styles.subContainerDetail}`}
                            onClick={() => {
                                navigation("/player-search")
                            }}
                    >
                        <div className={styles.iconContainer}>
                            <PersonSearchOutlinedIcon style={{width: 34, height: 34}}
                                                      htmlColor={"#D97706"}
                            />
                        </div>
                        <span className={styles.subTitle}>선수 검색</span>
                    </button>
                    <button className={`${styles.subContainer} ${styles.subContainerDetail}`}
                            onClick={() => {
                                navigation("/my-favorites")
                            }}
                    >
                        <div className={styles.iconContainer}>
                            <StarBorderOutlinedIcon style={{width: 34, height: 34}}
                                                    htmlColor={"#D97706"}
                            />
                        </div>
                        <span className={styles.subTitle}>즐겨찾기</span>
                    </button>
                    <button className={`${styles.subContainer} ${styles.subContainerDetail}`}
                            onClick={() => {
                                if (!isLoggedIn) {
                                    alert("로그인이 필요한 서비스입니다.");
                                    navigation("/login");
                                    return;
                                }
                                navigation("/user");
                            }}
                    >
                        <div className={styles.iconContainer}>
                            <AssignmentIndOutlinedIcon style={{width: 34, height: 34}}
                                                       htmlColor={"#D97706"}
                            />
                        </div>
                        <span className={styles.subTitle}>내 정보</span>
                    </button>
                </div>
            </div>
            
            
            <Footer/>
        </div>
    );
}