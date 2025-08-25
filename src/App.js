import './App.css';
import {BrowserRouter, Route, Routes} from "react-router";
import {Navigation} from "./routes/navigation/main/Navigation";
import {MainPage} from "./routes/main/main/MainPage";
import {PlayerSearchPage} from "./routes/player-search/main/PlayerSearchPage";
import {MyFavoritesPage} from "./routes/my-favorites/main/MyFavoritesPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Navigation />}>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/player-search" element={<PlayerSearchPage />} />
                    <Route path="/my-favorites" element={<MyFavoritesPage/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
