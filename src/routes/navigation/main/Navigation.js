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
            </div>
        </div>
    )
}