import styles from './LoginPage.module.css';
import commonStyles from "../../../common/css/common.module.css";
import {colors} from "../../../common/style/colors";
import {useEffect, useState} from "react";
import {loginApi, logoutApi, signUpApi} from "../../../apis/authApis";
import {useNavigate} from "react-router";
import {useAuthStore} from "../../../common/zustand/LoginState";

export const LoginPage = () => {
    const [mode, setMode] = useState("login"); // login, signUp
    const [loginInfo, setLoginInfo] = useState({email: "", password: ""});
    const [signUpInfo, setSignUpInfo] = useState({email: "", password: "", nickname: ""});
    const {login, logout, isLoggedIn, email} = useAuthStore();
    const navigation = useNavigate();
    
    const onClickSignUp = async () => {
        // 회원가입 로직
        try {
            const data = await signUpApi(signUpInfo);
            alert("회원가입이 완료되었습니다. 로그인 해주세요.");
            setMode("login");
            setSignUpInfo({email: "", password: "", nickname: ""});
        } catch (err) {
            if(err.status === 403) {
                alert("입력한 정보가 올바르지 않습니다. 다시 확인해주세요.");
            }
            else{
                alert("회원가입에 실패했습니다. 다시 시도해주세요.");
            }
        }
        
    };
    
    const onClickLogin = async () => {
        // 로그인 로직
        try {
            const data = await loginApi(loginInfo);
            const token = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            };
            
            login(data.nickname, token, loginInfo.email);
            navigation('/main');
        } catch (err) {
            if (err.status === 403) {
                alert("이메일 혹은 비밀번호가 올바르지 않습니다.");
            } else {
                alert("로그인에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };
    
    useEffect(() => {
        isLoggedIn && logoutApi();
        logout();
    }, []);
    
    
    return (
        <div className={styles.mainContainer} style={{alignItems: "center", justifyContent: "center"}}>
            <div className={commonStyles.subContainerNoCenter}
                 style={{padding: 30, minWidth: 500, minHeight: 425, flexDirection: "column", alignItems: "center"}}>
                <span style={{fontSize: 24, fontWeight: 700, marginBottom: 6}}>Welcome to FC Online Stats</span>
                <span style={{fontSize: 14, fontWeight: 400, color: colors.greyFont}}>Sign in to your account or create a new one</span>
                
                <div className={styles.brightContainer}
                     style={{minHeight: 36, marginTop: 24, marginBottom: 40, padding: "3.5px 3px", width: "100%"}}>
                    <button className={mode === "login" ? styles.detailTabButtonActive : styles.detailTabButtonInActive}
                            onClick={() => {
                                setMode("login");
                                setSignUpInfo({email: "", password: "", nickname: ""});
                            }}>로그인
                    </button>
                    <button
                        className={mode === "signUp" ? styles.detailTabButtonActive : styles.detailTabButtonInActive}
                        onClick={() => {
                            setMode("signUp");
                            setLoginInfo({email: "", password: ""});
                        }}>회원가입
                    </button>
                </div>
                
                {
                    mode === "login" ?
                        <div className={styles.inputRowContainer}
                             onKeyDown={e => e.key === "Enter" && onClickLogin()}
                        >
                            <div className={styles.inputRow}>
                                <span>Email</span>
                                <input placeholder={"Enter your Email"}
                                       value={loginInfo.email}
                                       onChange={e => setLoginInfo({...loginInfo, email: e.target.value})}
                                />
                            </div>
                            <div className={styles.inputRow}>
                                <span>Password</span>
                                <input placeholder={"Enter your password"}
                                       type={"password"}
                                       value={loginInfo.password}
                                       onChange={e => setLoginInfo({...loginInfo, password: e.target.value})}
                                />
                            </div>
                        
                        </div>
                        :
                        <div className={styles.inputRowContainer}
                             onKeyDown={e => e.key === "Enter" && onClickSignUp()}
                        >
                            <div className={styles.inputRow}>
                                <span>Email</span>
                                <input placeholder={"Enter your Email"}
                                       value={signUpInfo.email}
                                       onChange={e => setSignUpInfo({...signUpInfo, email: e.target.value})}
                                />
                            </div>
                            <div className={styles.inputRow}>
                                <span>Password</span>
                                <input placeholder={"8자리 이상 입력"}
                                       type={"password"}
                                       value={signUpInfo.password}
                                       onChange={e => setSignUpInfo({...signUpInfo, password: e.target.value})}
                                />
                            </div>
                            <div className={styles.inputRow}>
                                <span>Nickname</span>
                                <input placeholder={"2자리 이상 입력"}
                                       value={signUpInfo.nickname}
                                       onChange={e => setSignUpInfo({...signUpInfo, nickname: e.target.value})}
                                />
                            </div>
                        </div>
                }
                
                <button style={{background: colors.orangeFont, width: "100%", height: 40, marginTop: 20}}
                        onClick={() => mode === "login" ? onClickLogin() : onClickSignUp()}
                >{mode === "login" ? "Login" : "Sign Up"}
                </button>
            </div>
        </div>
    )
}