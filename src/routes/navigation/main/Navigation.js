import {Link, Outlet, useLocation} from "react-router";
import {colors} from "../../../common/style/colors";
import styles from "./Navigation.module.css"

export const Navigation = () => {
    const menuItems = [
        {title: "Home", link: "/"},
        {title: "Player Search", link: "/player-search"},
        {title: "My Favorites", link: "/my-favorites"},
    ];
    
    const location = useLocation();
    console.log(location.pathname);
    
    return (
        <div style={{width: "100vw", height: "100vh", overflow: "hidden", background: "#1F1F1F"}}>
            {/*navigation Top Bar*/}
            <div style={{
                display: "flex",
                height: 64,
                borderBottom: colors.greyBorder,
                justifyContent: "space-between",
                alignItems: "center",
                padding: "18px 10%"
            }}>
                <span style={{fontSize: 20, fontWeight: 700}}>FC SCOUTER</span>
                <div style={{display: "flex", flexWrap: "nowrap", gap: 23.65}}>
                    {
                        menuItems.map((item, index) => (
                            <Link key={item.link}
                                  to={item.link}
                                  className={location.pathname === item.link ? styles.navLinkActive : styles.navLinkInactive}
                                  // style={{
                                  //     fontWeight: 500,
                                  //     color: "#9CA3AF",
                                  //     transition: "font-size 0.2s ease",
                                  //     fontSize: 14,
                                  //     transformOrigin: "center",
                                  //     display: "inline-block"
                                  // }}
                                  // onMouseEnter={(e) => e.target.style.fontSize = "15px"}
                                  // onMouseLeave={(e) => e.target.style.fontSize = "14px"}
                            >{item.title}</Link>
                        ))
                    }
                </div>
                <button style={{border: colors.greyBorder, padding: "10px 17px", fontWeight: 500, fontSize: 14}}>Login /
                    Sign Up
                </button>
            </div>
            <div style={{
                height: "calc(100% - 64px)",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
            }}>
                <Outlet/>
            </div>
        </div>
    )
}