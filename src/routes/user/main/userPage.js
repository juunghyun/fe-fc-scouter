import commonStyles from "../../../common/css/common.module.css"
import {useAuthStore} from "../../../common/zustand/LoginState";
import {colors} from "../../../common/style/colors";
import {deleteUserApi} from "../../../apis/userApis";
import {useNavigate} from "react-router";

export const UserPage = () => {
    const {email, nickname, logout} = useAuthStore();
    const navigation = useNavigate();
    
    const signOut = async () => {
        try{
            if(!window.confirm("정말 탈퇴하시겠습니까? 탈퇴 시 모든 정보가 삭제되며, 복구할 수 없습니다.")){
                return;
            }
            // 탈퇴 api 호출
            await deleteUserApi();
            alert("탈퇴되었습니다. 그동안 이용해주셔서 감사합니다.");
            logout();
            navigation("/main");
        } catch (err) {
            alert("탈퇴에 실패했습니다. 다시 시도해주세요.");
        }
    }
    
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 520,
            minHeight: 300
        }}>
            <span style={{
                fontSize: 36,
                fontWeight: "bold",
                marginBottom: 20
            }}>내 정보</span>
            <div className={commonStyles.subContainerNoCenter}
                 style={{minHeight: 300, maxHeight: 400, padding: "5vh 10vw", flexDirection: "column", gap: 64}}>
                <div style={{display: "flex", alignItems: "center", gap: 70}}>
                    <span style={{fontSize: 24, fontWeight: 600}}>아이디</span>
                    <span style={{fontSize: 20, fontWeight: 400, color: colors.greyFont}}>{email}</span>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: 70}}>
                    <span style={{fontSize: 24, fontWeight: 600}}>닉네임</span>
                    <span style={{fontSize: 20, fontWeight: 400, color: colors.greyFont}}>{nickname}</span>
                
                </div>
                <button style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: colors.orangeFont,
                    width: "30%",
                    marginLeft: "auto",
                    padding: "4px 8px"
                }}
                        onClick={signOut}
                >
                    탈퇴하기
                </button>
            </div>
            
        </div>
    )
}