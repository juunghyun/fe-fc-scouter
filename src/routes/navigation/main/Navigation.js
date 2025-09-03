import {Link, Outlet, useLocation, useNavigate} from "react-router";
import {colors} from "../../../common/style/colors";
import styles from "./Navigation.module.css"
import LogoutIcon from '@mui/icons-material/Logout';
import {useAuthStore} from "../../../common/zustand/LoginState";
import {logoutApi} from "../../../apis/authApis";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import {useState} from "react";

const menuItems = [
    {title: "Home", link: "/main"},
    {title: "Player Search", link: "/player-search"},
    {title: "My Favorites", link: "/my-favorites"},
];

export const Navigation = () => {
    const navigation = useNavigate();
    const location = useLocation();
    const {isLoggedIn, logout, nickname} = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    console.log(isLoggedIn)
    
    const onClickLogout = async () => {
        try {
            await logoutApi();
            logout();
            navigation("/main");
        } catch (err) {
            console.log(err);
            alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
        }
    };
    
    const onClickLogin = () => {
        navigation("/login");
    }
    
    
    return (
        <div style={{width: "100vw", height: "100vh", overflow: "hidden", background: "#1F1F1F"}}>
            {/*navigation Top Bar*/}
            <div className={styles.topBarContainer}
                 style={{borderBottom: colors.greyBorder}}
            >
                <span style={{fontSize: 20, fontWeight: 700}}>FC SCOUTER</span>
                <div style={{display: "flex", flexWrap: "nowrap", gap: 23.65}}>
                    {
                        menuItems.map((item, index) => (
                            <Link key={item.link}
                                  to={item.link}
                                  className={location.pathname === item.link || location.pathname.startsWith(item.link + '/')
                                      ? styles.navLinkActive
                                      : styles.navLinkInactive}
                            >{item.title}</Link>
                        ))
                    }
                </div>
                
                <div style={{display: "flex", gap: 12}}>
                    {
                        isLoggedIn &&
                        <button style={{display: "flex", alignItems: "center", gap: 8, fontWeight: 500}}
                                onClick={() => navigation("/user")}
                        >
                            <div style={{display: "flex", alignItems: "center", justifyContent: "center", padding: 8, background: colors.orangeFont, borderRadius: "50%"}}>
                                <PersonOutlineOutlinedIcon style={{width: 18, height: 18}}/>
                            </div>
                            <span>{nickname}</span>
                        </button>
                    }
                    <button style={{border: colors.greyBorder, padding: "7px 17px", fontWeight: 500, fontSize: 14}}
                            onClick={isLoggedIn ? onClickLogout : onClickLogin}
                    >
                        {isLoggedIn ?
                            <div style={{display: "flex", alignItems: "center", gap: 12}}>
                                
                                <LogoutIcon style={{width: 16, height: 16}}/>
                                <span>
                                Logout
                            </span>
                            </div>
                            : "Login / Sign Up"
                        }
                    </button>
                </div>
            
            </div>
            <div className={`custom-scrollbar ${styles.contentContainer}`}>
                <Outlet/>
                {/*<div className={styles.footerContainer}>*/}
                {/*    <div>© 2025 FC SCOUTER. All rights reserved.</div>*/}
                {/*    <button>개인정보 처리방침</button>*/}
                {/*    <div>본 사이트는 NEXON Korea의 공식 서비스가 아니며, FC ONLINE 게임 데이터를 기반으로 한 팬 사이트입니다.</div>*/}
                {/*    <div>사이트 내 모든 선수 데이터의 저작권은 NEXON Korea에 있습니다. 모든 정보는 NEXON Open API와 FC ONLINE 공식 홈페이지를 기반으로 제공됩니다.</div>*/}
                {/*    <div>문의: forcomfe81@gmail.com</div>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}