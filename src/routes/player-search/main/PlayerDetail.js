import styles from "./PlayerSearchPage.module.css"
import commonStyles from "../../../common/css/common.module.css"
import {colors} from "../../../common/style/colors";
import {useEffect, useState} from "react";
import {getPlayerDetail, getPlayerPrice} from "../../../apis/playerSearchApis";
import {useLocation, useNavigate} from "react-router";
import ProgressBar from "@ramonak/react-progress-bar";
import {
    getTimeAgoAdvanced,
    hexToRgba,
    numberToKoreanSimple,
    OverallComponent
} from "../../../common/components/commonComponents";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import {addFavoriteApi, deleteFavoriteApi, getFavoriteApi} from "../../../apis/favoriteApi";
import {useAuthStore} from "../../../common/zustand/LoginState";
import {deleteCommentApi, editCommentApi, getCommentListApi, postCommentApi} from "../../../apis/commentApis";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import PersonIcon from '@mui/icons-material/Person';
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';


export const PlayerDetail = () => {
    const {isLoggedIn, userId} = useAuthStore();
    const [playerData, setPlayerData] = useState(null);
    const [options, setOptions] = useState({grade: 0, adaptation: 0, teamColor: 0});
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigation = useNavigate();
    const [mode, setMode] = useState("STAT"); // STAT or CLUB_HISTORY
    const [isFavorite, setIsFavorite] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [myComment, setMyComment] = useState({content: "", parentId: null});
    const [myReply, setMyReply] = useState({content: "", parentId: null});
    const [myEdit, setMyEdit] = useState({content: "", commentId: null});
    
    
    const fetchPlayerData = async (optionParams) => {
        // API 호출하여 선수 데이터 가져오기
        try {
            setLoading(true);
            const id = location.pathname.split('/').pop();
            const data = await getPlayerDetail(id, optionParams);
            // const priceObj = await getPlayerPrice(id, optionParams.grade); // 선수 가격 정보 가져오기
            setPlayerData({...data, price: 0}); // 선수 데이터와 가격
            await getFavoriteStatus(data);
            await fetchCommentData(id);
            
        } catch (error) {
            console.error("Error fetching player data:", error);
            alert("선수 정보를 가지고오는데 오류가 발생했습니다.");
            navigation(-1);
        } finally {
            setLoading(false);
        }
    };
    
    const handleClickPrice = async (playerId) => {
        try {
            const data = await getPlayerPrice(playerId, options.grade);
            setPlayerData({...playerData, price: data.price});
            return data.price;
        } catch (error) {
            console.error("Error fetching player price:", error);
            return 0;
        }
    }
    
    const getFavoriteStatus = async (data) => {
        if (!isLoggedIn) return;
        const favoriteData = await getFavoriteApi();
        favoriteData.some(item => item?.player.id === data.id) && setIsFavorite(true);
    }
    
    const onChangeOption = (field, value) => {
        const newOptions = {...options, [field]: value};
        setOptions(newOptions);
        // 옵션 변경 시 선수 데이터 다시 불러오기
        fetchPlayerData(newOptions);
    };
    
    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                // 즐겨찾기 해제
                await deleteFavoriteApi(playerData.id)
            } else {
                // 즐겨찾기 추가
                await addFavoriteApi(playerData.id, options.grade);
                alert("즐겨찾기에 추가되었습니다.");
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error updating favorite status:", error);
            alert("즐겨찾기 상태를 변경하는데 오류가 발생했습니다.");
        }
    }
    
    const fetchCommentData = async (id) => {
        try {
            const data = await getCommentListApi(id);
            setCommentList(data);
        } catch (error) {
            console.error("Error fetching comments:", error);
            alert("선수 댓글 정보를 가지고오는데 오류가 발생했습니다.");
        }
    }
    
    const sendComment = async (isComment, isEdit) => {
        // 댓글 작성 API 호출
        try {
            if (!isLoggedIn) {
                alert("로그인이 필요한 서비스입니다.");
                return;
            }
            if (isComment) {
                if(isEdit) {
                    if(!myEdit.content || myEdit.content.trim() === "") {
                        alert("댓글 내용을 입력해주세요.");
                        return;
                    }
                }
                else{
                    if (!myComment.content || myComment.content.trim() === "") {
                        alert("댓글 내용을 입력해주세요.");
                        return;
                    }
                }
                
            } else {
                if (!myReply.content || myReply.content.trim() === "") {
                    alert("댓글 내용을 입력해주세요.");
                    return;
                }
            }
            
            // 여기 댓글 수정 반영해야함
            if(isEdit) {
                await editCommentApi(myEdit.commentId, myEdit.content);
                setMyEdit({content: "", commentId: null});
                alert("댓글이 수정되었습니다.");
            }
            else{
                await postCommentApi(playerData.id, isComment ? myComment : myReply);
                isComment ? setMyComment({content: "", parentId: null}) : setMyReply({...myReply, content: ""});
                alert("댓글이 작성되었습니다.");
            }
            
        } catch (error) {
            alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
            console.error("Error posting comment:", error);
        } finally {
            await fetchCommentData(playerData.id);
        }
    }
    
    const toggleComment = async (id) => {
        if (myReply.parentId) {
            setMyReply({content: "", parentId: null});
        } else {
            setMyReply({...myReply, parentId: id});
        }
    }
    
    const toggleEdit = async (id, content) => {
        if (myEdit.commentId) {
            setMyEdit({content: "", commentId: null});
        } else {
            setMyEdit({content: content, commentId: id});
        }
    }
    
    const deleteReply = async (commentId) => {
        try{
            if (!window.confirm("정말로 댓글을 삭제하시겠습니까?")) return;
            await deleteCommentApi(commentId);
            alert("댓글이 삭제되었습니다.");
        } catch (error) {
            alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
            console.error("Error deleting comment:", error);
        } finally {
            await fetchCommentData(playerData.id);
        }
    }
    
    
    useEffect(() => {
        // API로 선수 데이터 불러오기
        fetchPlayerData(options);
    }, []);
    
    console.log(myComment, "myComment");
    console.log(myReply, "myReply");
    console.log(myEdit, "myEdit");
    
    
    return (
        <div className={styles.mainContainer}>
            {/*선수 스탯 미리보기*/}
            <div className={commonStyles.subContainerNoCenter}
                 style={{width: "100%", minHeight: 300, flexDirection: "column", padding: "4vh 10vw 3vh", gap: 24}}
            >
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    {/*이름 및 강화단계*/}
                    <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                        <div style={{display: "flex", alignItems: "center", gap: 15}}>
                            <span style={{fontSize: 36, fontWeight: 700}}>{playerData?.playerName}</span>
                            {
                                playerData && isLoggedIn &&
                                <button className={styles.favoriteBtn} onClick={toggleFavorite}>
                                    {
                                        isFavorite ?
                                            <StarIcon htmlColor={colors.orangeFont}/>
                                            :
                                            <StarBorderIcon htmlColor={hexToRgba(colors.orangeFont, 60)}/>
                                    }
                                </button>
                            }
                        </div>
                        <div style={{display: "flex", alignItems: "center", gap: 20}}>
                            <div className={styles.smallBrightContainer}
                                 style={{padding: "8px 16px", fontWeight: 600}}>{playerData?.season}</div>
                            <SelectGrade field={"grade"} value={options.grade} onChange={onChangeOption}/>
                            <SelectGrade field={"adaptation"} value={options.adaptation} onChange={onChangeOption}/>
                            <SelectGrade field={"teamColor"} value={options.teamColor} onChange={onChangeOption}/>
                        </div>
                    </div>
                    
                    {/*선수 가격*/}
                    <div style={{display: "flex", gap: 16, alignItems: "center"}}>
                        {/*<button className={styles.smallBrightContainer}>0</button>*/}
                        <button className={styles.brightContainer}
                                style={{
                                    background: "none",
                                    // border: colors.greyBorder,
                                    borderWidth: 2,
                                    flexDirection: "column",
                                    height: 80,
                                    fontSize: 18,
                                    minWidth: 200
                                }}
                                onClick={() => handleClickPrice(playerData.id)}
                        >
                            
                            <span
                                style={{fontWeight: 700}}>{playerData?.price !== 0 ? `${playerData?.price.toLocaleString('kp-KR')} BP` : '시세 불러오기'}</span>
                            {
                                playerData?.price !== 0 &&
                                <span style={{
                                    fontWeight: 600,
                                    marginLeft: "auto"
                                }}>{numberToKoreanSimple(playerData?.price)}</span>
                            }
                        
                        </button>
                    </div>
                </div>
                
                {/*선수스탯 미리보기*/}
                <div style={{display: "flex", gap: 16}}>
                    <Thumbnail title={"OVR"} value={playerData?.stats.overallRating ? playerData?.stats.overallRating : ''}/>
                    <Thumbnail title={"급여"} value={playerData?.salary ? playerData?.salary : ''}/>
                    <Thumbnail title={"키"} value={`${playerData?.height ? playerData?.height : ''}cm`}/>
                    <Thumbnail title={"몸무게"} value={`${playerData?.weight ? playerData?.weight : ''}kg`}/>
                </div>
            </div>
            
            {/*스탯 or 클럽경력*/}
            <div className={commonStyles.subContainerNoCenter}
                 style={{minHeight: 40, marginTop: 36, marginBottom: 40, padding: "5.5px 5px"}}>
                <button className={mode === "STAT" ? styles.detailTabButtonActive : styles.detailTabButtonInActive}
                        onClick={() => setMode("STAT")}>스탯
                </button>
                <button
                    className={mode === "CLUB_HISTORY" ? styles.detailTabButtonActive : styles.detailTabButtonInActive}
                    onClick={() => setMode("CLUB_HISTORY")}>클럽경력
                </button>
            </div>
            
            {/*스탯 상세정보*/}
            {
                mode === "STAT" ?
                    <div style={{display: "flex", flexDirection: "column", gap: 32}}>
                        <StatContainer title={"Physical"}>
                            <StatRow field={"속력"} value={playerData?.stats.sprintSpeed}/>
                            <StatRow field={"가속"} value={playerData?.stats.acceleration}/>
                            <StatRow field={"몸싸움"} value={playerData?.stats.strength}/>
                            <StatRow field={"점프"} value={playerData?.stats.jumping}/>
                            <StatRow field={"스태미너"} value={playerData?.stats.stamina}/>
                        </StatContainer>
                        <StatContainer title={"Attacking"}>
                            <StatRow field={"슛 파워"} value={playerData?.stats.shotPower}/>
                            <StatRow field={"골 결정력"} value={playerData?.stats.finishing}/>
                            <StatRow field={"중거리 슛"} value={playerData?.stats.longShots}/>
                            <StatRow field={"발리 슛"} value={playerData?.stats.volleys}/>
                            <StatRow field={"헤더"} value={playerData?.stats.headingAccuracy}/>
                            <StatRow field={"위치선정"} value={playerData?.stats.positioning}/>
                            <StatRow field={"적극성"} value={playerData?.stats.aggression}/>
                            <StatRow field={"패널티 킥"} value={playerData?.stats.penalties}/>
                        </StatContainer>
                        <StatContainer title={"Playmaking"}>
                            <StatRow field={"짧은 패스"} value={playerData?.stats.shortPassing}/>
                            <StatRow field={"긴패스"} value={playerData?.stats.longPassing}/>
                            <StatRow field={"시야"} value={playerData?.stats.vision}/>
                            <StatRow field={"크로스"} value={playerData?.stats.crossing}/>
                            <StatRow field={"커브"} value={playerData?.stats.curve}/>
                            <StatRow field={"프리킥"} value={playerData?.stats.freekickAccuracy}/>
                        </StatContainer>
                        <StatContainer title={"Technical"}>
                            <StatRow field={"드리블"} value={playerData?.stats.dribbling}/>
                            <StatRow field={"볼 컨트롤"} value={playerData?.stats.ballControl}/>
                            <StatRow field={"민첩성"} value={playerData?.stats.agility}/>
                            <StatRow field={"밸런스"} value={playerData?.stats.balance}/>
                            <StatRow field={"반응속도"} value={playerData?.stats.reactions}/>
                            <StatRow field={"침착성"} value={playerData?.stats.composure}/>
                        </StatContainer>
                        <StatContainer title={"Defensive"}>
                            <StatRow field={"대인 수비"} value={playerData?.stats.marking}/>
                            <StatRow field={"태클"} value={playerData?.stats.standingTackle}/>
                            <StatRow field={"슬라이딩 태클"} value={playerData?.stats.slidingTackle}/>
                            <StatRow field={"가로채기"} value={playerData?.stats.interceptions}/>
                        </StatContainer>
                        <StatContainer title={"Goalkeeping"}>
                            <StatRow field={"GK 다이빙"} value={playerData?.stats.gkDiving}/>
                            <StatRow field={"GK 핸들링"} value={playerData?.stats.gkHandling}/>
                            <StatRow field={"GK 킥"} value={playerData?.stats.gkKicking}/>
                            <StatRow field={"GK 반응속도"} value={playerData?.stats.gkPositioning}/>
                            <StatRow field={"GK 위치선정"} value={playerData?.stats.gkReflexes}/>
                        </StatContainer>
                    </div>
                    :
                    <div className={commonStyles.subContainerNoCenter}
                         style={{flexDirection: "column", gap: 10, padding: 25}}>
                        {
                            playerData?.careers.map((item, index) => (
                                <span key={item + index}> {item}</span>
                            ))
                        }
                    </div>
            }
            <div className={commonStyles.subContainerNoCenter}
                 style={{flexDirection: "column", padding: "25px 30px", margin: "40px 0"}}>
                <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 32}}>
                    <ChatBubbleOutlineOutlinedIcon htmlColor={colors.orangeFont} style={{width: 28, height: 28}}/>
                    <span style={{fontSize: 28, fontWeight: 700}}>{`Comments (${commentList.length})`}</span>
                </div>
                
                <CommentComponent myComment={myComment} setMyComment={setMyComment} isLoggedIn={isLoggedIn}
                                  myEdit={myEdit} setMyEdit={setMyEdit}
                                  sendComment={sendComment} isComment={true}/>
                
                <div style={{display: "flex", gap: 16, flexDirection: "column", marginTop: 32}}>
                    {
                        commentList.map((item, index) => (
                            <div key={item.commentId} className={styles.commentContainer}>
                                {myEdit.commentId === item.commentId ?
                                    <CommentComponent myComment={myEdit} setMyComment={setMyEdit}
                                                      myReply={myReply} setMyReply={setMyReply}
                                                      myEdit={myEdit} setMyEdit={setMyEdit}
                                                      isLoggedIn={isLoggedIn} sendComment={sendComment}
                                                      isEdit={true}
                                                      isComment={true}
                                    />
                                    :
                                    <div style={{display: "flex", gap: 12}}>
                                        <div className={styles.commentProfile}>
                                            <PersonIcon htmlColor={colors.greyFont}/>
                                        </div>
                                        <div>
                                            <span style={{fontWeight: 600, fontSize: 16}}>{item.authorNickname}</span>
                                            <span style={{
                                                marginLeft: 12,
                                                color: colors.greyFont,
                                                fontSize: 14,
                                                fontWeight: 400
                                            }}>{getTimeAgoAdvanced(item.createdAt)}</span>
                                            <p style={{
                                                fontWeight: 400,
                                                marginTop: 8,
                                                whiteSpace: "pre-wrap"
                                            }}>{item.content}</p>
                                            
                                            <button style={{display: "flex", alignItems: "center", marginTop: 10}}
                                                    onClick={() => toggleComment(item.commentId)}
                                            >
                                                <SubdirectoryArrowRightOutlinedIcon htmlColor={colors.orangeFont}
                                                                                    style={{width: 16, height: 16}}/>
                                                <span style={{
                                                    color: colors.orangeFont,
                                                    marginLeft: 10,
                                                    fontSize: 14
                                                }}>{item.children.length} Reply</span>
                                            </button>
                                        
                                        </div>
                                        {
                                            item.authorId === userId &&
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 8,
                                                    marginLeft: "auto",
                                                    marginBottom: "auto",
                                                }}>
                                                <button onClick={() => toggleEdit(item.commentId, item.content)}>
                                                    <EditOutlinedIcon style={{width: 16, height: 16}}
                                                                      htmlColor={colors.orangeFont}/>
                                                </button>
                                                <button onClick={() => deleteReply(item.commentId)}>
                                                    <DeleteOutlineOutlinedIcon style={{width: 16, height: 16}}
                                                                               htmlColor={colors.greyFont}/>
                                                </button>
                                            </div>
                                            
                                        }
                                    </div>}
                                {
                                    item.commentId === myReply.parentId &&
                                    <div>
                                        {
                                            item.children.length > 0 &&
                                            item.children.map(child => (
                                                <div key={child.commentId} className={styles.commentContainer}>
                                                    {
                                                        child.commentId === myEdit.commentId ?
                                                            <CommentComponent myComment={myEdit} setMyComment={setMyEdit}
                                                                              myReply={myReply} setMyReply={setMyReply}
                                                                              myEdit={myEdit} setMyEdit={setMyEdit}
                                                                              isLoggedIn={isLoggedIn} sendComment={sendComment}
                                                                              isEdit={true}
                                                                              isComment={true}
                                                            />
                                                            :
                                                            <div style={{display: "flex", gap: 12}}>
                                                                <div className={styles.commentProfile}>
                                                                    <PersonIcon htmlColor={colors.greyFont}/>
                                                                </div>
                                                                <div>
                                                            <span style={{
                                                                fontWeight: 600,
                                                                fontSize: 16
                                                            }}>{child.authorNickname}</span>
                                                                    <span style={{
                                                                        marginLeft: 12,
                                                                        color: colors.greyFont,
                                                                        fontSize: 14,
                                                                        fontWeight: 400
                                                                    }}>{getTimeAgoAdvanced(child.createdAt)}</span>
                                                                    <p style={{
                                                                        fontWeight: 400,
                                                                        marginTop: 8,
                                                                        whiteSpace: "pre-wrap"
                                                                    }}>{child.content}</p>
                                                                
                                                                </div>
                                                                {
                                                                    item.authorId === userId &&
                                                                    <div
                                                                        style={{
                                                                            display: "flex",
                                                                            gap: 8,
                                                                            marginLeft: "auto",
                                                                            marginBottom: "auto",
                                                                        }}>
                                                                        <button onClick={() => toggleEdit(child.commentId, child.content)}>
                                                                            <EditOutlinedIcon style={{width: 16, height: 16}}
                                                                                              htmlColor={colors.orangeFont}/>
                                                                        </button>
                                                                        <button onClick={() => deleteReply(child.commentId)}>
                                                                            <DeleteOutlineOutlinedIcon style={{width: 16, height: 16}}
                                                                                                       htmlColor={colors.greyFont}/>
                                                                        </button>
                                                                    </div>
                                                                    
                                                                }
                                                            </div>
                                                    }
                                                    
                                                
                                                </div>
                                            ))
                                        }
                                        <CommentComponent myComment={myComment} setMyComment={setMyComment}
                                                          myReply={myReply} setMyReply={setMyReply}
                                                          myEdit={myEdit} setMyEdit={setMyEdit}
                                                          isLoggedIn={isLoggedIn} sendComment={sendComment}
                                        />
                                    </div>
                                    
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
            
        </div>
    )
}

const Thumbnail = ({title, value}) => {
    return (
        <div className={styles.brightContainer} style={{flex: 1, height: 80, flexDirection: "column"}}>
            <span style={{color: colors.greyFont, fontSize: 14, fontWeight: 400}}>{title}</span>
            <span style={{fontWeight: 700, fontSize: 18}}>{value}</span>
        </div>
    
    )
}

const StatContainer = ({title, children}) => {
    
    return (
        <div className={commonStyles.subContainerNoCenter}
             style={{width: "100%", minHeight: 320, padding: 25, flexDirection: "column", gap: 50}}
        >
            <span style={{fontSize: 20, fontWeight: 700}}>{title}</span>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24}}>
                {children}
            </div>
        </div>
    )
}

const StatRow = ({field, value}) => {
    return (
        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <span style={{color: colors.greyFont, fontSize: 14}}>{field}</span>
                <OverallComponent overall={value}/>
            </div>
            <ProgressBar completed={value}
                         maxCompleted={180}
                         width={"100%"}
                         height={"12px"}
                         bgColor={colors.orangeFont}
                         baseBgColor={hexToRgba(colors.orangeFont, 20)}
                         isLabelVisible={false}
            />
        </div>
    
    )
}

const SelectGrade = ({field, value, onChange}) => {
    const style = {
        padding: "8px 13px",
        cursor: "pointer",
    }
    
    const arrLength = field === "grade" ? 13 : field === "adaptation" ? 5 : 10;
    const title = field === "grade" ? "강화" : field === "adaptation" ? "적응도" : "팀컬러";
    
    return (
        <select className={styles.smallBrightContainer}
                style={style}
                value={value}
                onChange={(e) => onChange(field, Number(e.target.value))}
        >
            <option value={0}>{title}</option>
            {Array.from({length: arrLength}, (_, i) => (
                <option key={i + 1} value={i + 1}>+{i + 1}</option>
            ))}
        </select>
    )
}

const CommentComponent = ({
                              myComment,
                              setMyComment,
                              myReply,
                              setMyReply,
                              myEdit,
                              setMyEdit,
                              isEdit = false,
                              isLoggedIn,
                              sendComment,
                              isComment = false
                          }) => {
    
    return (
        <div style={{display: "flex", gap: 12, marginTop: 10}}>
            {!isComment &&
                <SubdirectoryArrowRightOutlinedIcon style={{width: 16, height: 16}} htmlColor={colors.orangeFont}/>}
            <div className={styles.commentProfile}
                 style={{
                     background: hexToRgba(colors.orangeFont, 20),
                     color: colors.orangeFont,
                 }}>
                U
            </div>
            <textarea style={{display: "flex", width: "100%", minHeight: 100}}
                      placeholder={isLoggedIn ? "댓글을 작성해보세요!" : "로그인이 필요한 서비스입니다."}
                      disabled={!isLoggedIn}
                      value={isComment ? isEdit ? myEdit.content : myComment.content : myReply.content}
                      onChange={e =>
                          isComment ?
                              isEdit ?
                                  setMyEdit({
                                      ...myEdit,
                                      content: e.target.value
                                  }) :
                                  setMyComment({
                                      ...myComment,
                                      content: e.target.value
                                  }) :
                              setMyReply({...myReply, content: e.target.value})}
            />
            <div style={{display: "flex", flexDirection: "column", }}>
                {isEdit && <button onClick={() => setMyEdit({commentId: null, content: ""})} style={{marginLeft: "auto", marginBottom: "auto"}}><CloseOutlinedIcon htmlColor={colors.greyFont} style={{width: 18, height: 18}}/> </button>}
                <button style={{
                    background: colors.orangeFont,
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "auto"
                }}
                        onClick={() => sendComment(isComment, isEdit)}
                ><SendOutlinedIcon/></button>
            </div>
            
        </div>
    )
}