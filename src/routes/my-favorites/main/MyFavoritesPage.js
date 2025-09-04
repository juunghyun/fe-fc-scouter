import styles from './MyFavoritesPage.module.css'
import commonStyles from "../../../common/css/common.module.css";
import {useAuthStore} from "../../../common/zustand/LoginState";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {Footer, hexToRgba} from "../../../common/components/commonComponents";
import {colors} from "../../../common/style/colors"
import {useEffect, useRef, useState} from "react";
import {getFavoriteApi} from "../../../apis/favoriteApi";
import {HeaderCell, RowCell} from "../../player-search/main/PlayerSearchPage";
import {useNavigate} from "react-router";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

export const MyFavoritesPage = () => {
    const {isLoggedIn} = useAuthStore();
    const [playerList, setPlayerList] = useState([]);
    const navigation = useNavigate();
    
    const headerRef = useRef(null);
    const bodyRef = useRef(null);
    
    const handleHeaderScroll = () => {
        if (headerRef.current && bodyRef.current) {
            bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
        }
    };
    
    const handleBodyScroll = () => {
        if (headerRef.current && bodyRef.current) {
            headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
        }
    };
    
    
    let columns = [
        {field: 'playerName', title: '선수', width: '40%', minWidth: 300},
        {field: 'nation', title: '국적', width: '30%', minWidth: 200},
        {field: 'overallrating', title: 'OVR', width: '15%', minWidth: 100},
        {field: 'salary', title: '급여', width: '15%', minWidth: 100},
    ];
    
    const fetchFavoritePlayers = async () => {
        try {
            const data = await getFavoriteApi();
            setPlayerList(data);
        } catch (err) {
            alert("즐겨찾기 선수 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
        }
    }
    
    const Row = ({row, index}) => {
        return (
            <button className={styles.rowContainer}
                    onClick={() => handleClickRow(row)}
                    style={{
                        minWidth: "max-content",
                        background: index % 2 === 0 ? colors.dark : colors.halfBrightDark,
                        borderBottom: colors.greyBorder,
                    }}>
                <RowCell row={row.player} column={columns[0]} grade={row.grade}/>
                <RowCell row={row.player} column={columns[1]} />
                <RowCell row={row.player} column={columns[2]}/>
                <RowCell row={row.player} column={columns[3]} />
            </button>
        )
    };
    
    const handleClickRow = (row) => {
        navigation(`/player-search/${row.player.id}`);
    };
    
    useEffect(() => {
        isLoggedIn && fetchFavoritePlayers();
    }, [])
    
    return (
        <div className={styles.mainContainer}>
            <span style={{marginBottom: 100, fontSize: 36, fontWeight: 700}}>내 즐겨찾기</span>
            {
                !playerList.length ?
                    <div className={commonStyles.subContainer}
                         style={{width: '100%', minHeight: 300, flexDirection: "column", padding: 60}}>
                        <div style={{
                            background: hexToRgba(colors.orangeFont, 10),
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 80,
                            height: 80,
                            marginBottom: 24
                        }}>
                            <FavoriteBorderIcon htmlColor={hexToRgba(colors.orangeFont, 70)}
                                                style={{width: 46, height: 46}}/>
                        </div>
                        <span style={{fontWeight: 600, fontSize: 24}}>{
                            isLoggedIn ?
                                "즐겨찾기한 선수가 없습니다."
                                :
                                "로그인이 필요한 서비스입니다."
                        }</span>
                        <span style={{
                            fontWeight: 400,
                            fontSize: 18,
                            color: colors.greyFont,
                            textAlign: "center",
                            marginTop: 15
                        }}>선수들을 즐겨찾기에 추가해서 나만의 컬렉션을 만들고<br/>이적시장에서의 가치 변동을 확인해보세요</span>
                        
                        <button style={{display: "flex", alignItems: "center", gap: 8, marginTop: 27, padding: "8px 16px", background: colors.orangeFont}}
                                onClick={() => navigation("/player-search")}
                        >
                            <SearchOutlinedIcon />
                            <span>선수 검색 하러가기</span>
                        </button>
                    </div>
                    :
                    <div className={commonStyles.subContainerNoCenter}
                         style={{minHeight: 600, maxHeight: "70%", flexDirection: "column"}}>
                        {/*    헤더*/}
                        <div className={styles.headerContainer}
                             ref={headerRef}
                             onScroll={handleHeaderScroll}
                             style={{
                                 background: colors.brightDark,
                                 borderBottom: colors.greyBorder,
                                 overflowX: "hidden",
                                 overflowY: "hidden",
                                 scrollbarWidth: "none",
                                 msOverflowStyle: "none",
                             }}
                        >
                            {
                                columns.map((item, index) => (
                                    <HeaderCell column={item} key={item.id}/>
                                ))
                            }
                        </div>
                        
                        {/*rows*/}
                        <div className={'custom-scrollbar'}
                             ref={bodyRef}
                             onScroll={handleBodyScroll}
                             style={{
                                 display: "flex",
                                 overflowY: "auto",
                                 overflowX: "auto",
                                 flexDirection: "column",
                                 scrollbarGutter: "stable",
                                 height: "100%"
                             }}>
                            {
                                playerList.map((row, index) => (
                                    <Row key={row.id} row={row} index={index}/>
                                ))
                            }
                        </div>
                    </div>
            }
        
            <Footer />
        </div>
    );
}