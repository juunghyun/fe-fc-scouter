import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import {Navigation} from "./routes/navigation/main/Navigation";
import {MainPage} from "./routes/main/main/MainPage";
import {PlayerSearchPage} from "./routes/player-search/main/PlayerSearchPage";
import {MyFavoritesPage} from "./routes/my-favorites/main/MyFavoritesPage";
import {PlayerDetail} from "./routes/player-search/main/PlayerDetail";
import {LoginPage} from "./routes/login/main/LoginPage";
import {UserPage} from "./routes/user/main/userPage";
import {PrivacyPage} from "./routes/privacy/main/PrivacyPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Navigation/>}>
                    <Route path="/" element={<Navigate replace to="/main"/>}/>
                    <Route path="login" element={<LoginPage/>}/>
                    <Route path="/main" element={<MainPage/>}/>
                    <Route path="/player-search" element={<PlayerSearchPage/>}/>
                    <Route path="/player-search/:playerId" element={<PlayerDetail/>}/>
                    <Route path="/my-favorites" element={<MyFavoritesPage/>}/>
                    <Route path="/user" element={<UserPage/>}/>
                    <Route path="/privacy" element={<PrivacyPage/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
