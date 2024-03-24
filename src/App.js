import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/main";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import Mypage from "./pages/user/Mypage";
import { useState } from "react";
import { AppContext } from "./AppContext";
import ChattingRooms from "./pages/chatting/ChattingRooms";
import AllGeneralTransaction from "./pages/general/AllGeneralTransaction";
import AllAuctionTransaction from "./pages/auction/AllAuctionTransaction";
import GeneralTransaction from "./pages/general/GeneralTransaction";
import AuctionTransaction from "./pages/auction/AuctionTransaction";
import SearchPage from "./pages/SearchPage";
import Loading from "./components/Loading";

function App() {
    const [loginToken, setLoginToken] = useState("");
    return (
        <AppContext.Provider value={{ loginToken, setLoginToken }}>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/general" element={<AllGeneralTransaction />} />
                    <Route path="/general/:generalTransactionId" element={<GeneralTransaction />} />
                    <Route path="/auction" element={<AllAuctionTransaction />} />
                    <Route path="/auction/:auctionTransactionId" element={<AuctionTransaction />} />
                    <Route path="/mypage" element={<Mypage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/chat" element={<ChattingRooms />} />
                    <Route path="/load" element={<Loading />} />
                </Routes>
            </div>
        </AppContext.Provider>
    );
}

export default App;
