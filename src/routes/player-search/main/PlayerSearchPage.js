import commonStyles from "../../../common/css/common.module.css"
import {colors} from "../../../common/style/colors";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import styles from "./PlayerSearchPage.module.css";
import {useEffect, useRef, useState} from "react";
import {useNavigate, useSearchParams} from "react-router";
import {getPlayerPrice, getPlayerSearch} from "../../../apis/playerSearchApis";
import {CircularProgress} from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import {OverallComponent} from "../../../common/components/commonComponents";

export const PlayerSearchPage = () => {
    const [loading, setLoading] = useState(false);
    const [playersData, setPlayersData] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({searchName: "", nation: "", team1: "", team2: ""});
    const navigation = useNavigate();
    const [searchParams] = useSearchParams('query');
    const query = searchParams.get('query');
    
    let columns = [
        {field: 'playerName', title: '선수', width: '30%', minWidth: 300},
        {field: 'nation', title: '국적', width: '20%', minWidth: 200},
        {field: 'overallrating', title: 'OVR', width: '10%', minWidth: 100},
        {field: 'salary', title: '급여', width: '10%', minWidth: 100},
        {field: 'price', title: '가격', width: '30%', minWidth: 300},
    ];
    
    const fetchData = async (options) => {
        setLoading(true);
        try {
            const data = await getPlayerSearch(options);
            const dataWithPrice = [];
            for (const item of data.content) {
                // const priceData = await getPlayerPrice(item.id);
                dataWithPrice.push({...item, price: 0});
            }
            setPlayersData(dataWithPrice);
        } catch (error) {
            console.error("Error fetching player data:", error);
            alert("존재하지 않는 선수입니다..");
        } finally {
            setLoading(false);
        }
    };
    
    const loadMoreData = async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        
        try {
            // API 호출
            const data = await getPlayerSearch({...filters, page: page + 1});
            
            if (data.content.length === 0) {
                setHasMore(false);
            } else {
                // 기존 데이터에 새 데이터 추가
                const dataWithPrice = [];
                for (const item of data.content) {
                    // const priceData = await getPlayerPrice(item.id);
                    dataWithPrice.push({...item, price: 0});
                }
                setPlayersData(prev => [...prev, ...dataWithPrice]);
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handlePageScroll = async (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        
        // 스크롤이 하단에 거의 도달했을 때 (100px 여유)
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            await loadMoreData();
        }
    };
    
    
    const handleClickPrice = async (playerId) => {
        try {
            
            const data = await getPlayerPrice(playerId);
            // 스크롤 위치 보존을 위해 함수형 업데이트 사용
            setPlayersData(prevData =>
                prevData.map(item =>
                    item.id === playerId ? {...item, price: data.price} : item
                )
            );
            
            return data.price;
        } catch (error) {
            console.error("Error fetching player price:", error);
            return 0;
        }
    };
    
    const handleSearchChange = (e, field) => {
        setFilters({...filters, [field]: e.target.value});
        
    };
    
    const headerRef = useRef(null);
    const bodyRef = useRef(null);
    
    const handleHeaderScroll = () => {
        if (headerRef.current && bodyRef.current) {
            bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
        }
    };
    
    const handleBodyScroll = (e) => {
        if (headerRef.current && bodyRef.current) {
            headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
        }
        
        handlePageScroll(e);
        
    };
    
    
    const Row = ({row, index}) => {
        return (
            <button className={styles.rowContainer}
                    onClick={() => handleClickRow(row)}
                    style={{
                        minWidth: "max-content",
                        background: index % 2 === 0 ? colors.dark : colors.halfBrightDark,
                    }}>
                <RowCell row={row} column={columns[0]}/>
                <RowCell row={row} column={columns[1]}/>
                <RowCell row={row} column={columns[2]}/>
                <RowCell row={row} column={columns[3]}/>
                <RowCell row={row} column={columns[4]} handleClickPrice={handleClickPrice}/>
            </button>
        )
    };
    
    const handleClickRow = (row) => {
        navigation(`/player-search/${row.id}`);
    };
    
    useEffect(() => {
        if (query) {
            setFilters({...filters, searchName: query});
            fetchData({...filters, searchName: query});
        } else {
            fetchData(filters);
        }
    }, []);
    
    console.log(filters, "playersData");
    
    return (
        <div className={styles.mainContainer}>
            <div className={styles.titleContainer}>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <span style={{fontSize: 36, fontWeight: 700}}>선수 검색</span>
                    <span style={{color: colors.greyFont, fontSize: 18, fontWeight: 400}}>FC Online의 선수들을 검색해보세요!</span>
                </div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <span style={{fontSize: 24, fontWeight: 700, color: colors.orangeFont, marginLeft: "auto"}}>{playersData.length}</span>
                    <span style={{fontSize: 14, fontWeight: 400, color: colors.greyFont}}>Players Found</span>
                </div>
            </div>
            <div style={{display: "flex", gap: 32, height: "100%", marginTop: 48}}>
                {/*검색필터*/}
                <div className={commonStyles.subContainerNoCenter}
                     style={{
                         width: "100%",
                         maxWidth: 320,
                         height: "60%",
                         minHeight: 600,
                         padding: "30px 20px",
                         flexDirection: "column",
                         gap: 24
                     }}
                     onKeyDown={e => e.key === 'Enter' && fetchData(filters)}
                >
                    <div style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 24}}>
                        <FilterAltOutlinedIcon htmlColor={colors.orangeFont} style={{width: 32, height: 32}}/>
                        <span style={{fontSize: 28, fontWeight: 600}}>Search Filters</span>
                    </div>
                    {/*선수이름*/}
                    <div className={styles.filterColumnContainer}>
                        <span>Player Name</span>
                        <input style={{width: "100%", height: 40}}
                               placeholder={"선수이름"}
                               value={filters.searchName}
                               onChange={(e) => handleSearchChange(e, "searchName")}
                        />
                    </div>
                    
                    <div className={styles.filterColumnContainer}>
                        <span>Nation</span>
                        <input style={{width: "100%", height: 40}}
                               placeholder={"국적"}
                               value={filters.nation}
                               onChange={(e) => handleSearchChange(e, "nation")}
                        />
                    </div>
                    
                    <div className={styles.filterColumnContainer}>
                        <span>Team 1</span>
                        <input style={{width: "100%", height: 40}}
                               placeholder={"소속팀 1"}
                               value={filters.team1}
                               onChange={(e) => handleSearchChange(e, "team1")}
                        />
                    </div>
                    
                    <div className={styles.filterColumnContainer}>
                        <span>Team 2</span>
                        <input style={{width: "100%", height: 40}}
                               placeholder={"소속팀 2"}
                               value={filters.team2}
                               onChange={(e) => handleSearchChange(e, "team2")}
                        />
                    </div>
                    
                    <button style={{background: colors.orangeFont, padding: "12px 85px", marginTop: "auto"}}
                            onClick={() => fetchData(filters)}
                    >Apply
                        Filters
                    </button>
                </div>
                
                {/*검색결과*/}
                <div className={commonStyles.subContainerNoCenter}
                     style={{
                         width: "100%",
                         maxHeight: "70%",
                         flexDirection: "column",
                         minHeight: 650,
                         minWidth: 200
                     }}>
                    {/*    헤더*/}
                    <div className={styles.headerContainer}
                         ref={headerRef}
                         onScroll={handleHeaderScroll}
                         style={{
                             background: colors.brightDark,
                             borderBottom: colors.greyBorder,
                             overflowX: "auto",
                             overflowY: "hidden",
                             scrollbarWidth: "none",
                             msOverflowStyle: "none",
                             
                         }}>
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
                            playersData.map((row, index) => (
                                <Row key={row.id} row={row} index={index}/>
                            ))
                        }
                    </div>
                    
                    {
                        loading &&
                        <AutoSizer style={{position: "absolute", marginTop: 85}}>
                            {({height, width}) => (
                                <div className={commonStyles.loadingContainer}
                                     style={{width, height: height - 85}}>
                                    <CircularProgress style={{color: colors.orangeFont}} size={50}/>
                                </div>
                            )}
                        </AutoSizer>
                    }
                
                </div>
            </div>
        
        </div>
    )
}

export const HeaderCell = ({column}) => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            width: column.width,
            minWidth: column.minWidth,
            height: "100%",
            padding: column.field === "playerName" ? "10px 25px" : "10px 20px",
        }}>
            <span style={{fontSize: 14, fontWeight: 600}}>{column.title}</span>
        </div>
    )
};

export const RowCell = ({row, column, handleClickPrice, grade = 0}) => {
    const getFontWeight = (field) => {
        switch (field) {
            case "player": {
                return 600
            }
            case "nation": {
                return 500
            }
            case "overall": {
                return 700
            }
            case "salary": {
                return 600
            }
            case "price": {
                return 400
            }
            default: {
                return 500
            }
        }
    }
    
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            width: column.width,
            minWidth: column.minWidth,
            height: "100%",
            padding: column.field === "playerName" ? "10px 60px" : "10px 25px",
            overflow: "hidden",
            borderBottom: colors.greyBorder,
        }}
             onClick={(e) => {
                 if(column.field === "price") {
                     e.stopPropagation();
                     handleClickPrice(row.id);
                 }
             }}
        
        >
            <span style={{
                fontSize: 16,
                color: column.field === "price" ? colors.greyFont : "white",
                fontWeight: getFontWeight(column.field)
            }}>
                {
                    column.field === "price" ?
                        (row.price === 0 ? "클릭하여 시세보기" : `${row[column.field].toLocaleString('kp-KR')} BP`)
                        :
                        column.field === "overallrating" ?
                            <OverallComponent overall={row[column.field]} isDetail={false}/>
                            :
                            column.field === "playerName" ?
                                (grade ? `${row[column.field]} +${grade}` : row[column.field])
                                :
                                row[column.field]
                }
            </span>
        </div>
    )
}
