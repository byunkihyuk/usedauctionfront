import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/main";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import MyChatRooms from "./pages/chat/MyChatRooms";
import AllGeneralTransaction from "./pages/general/AllGeneralTransaction";
import AllAuctionTransaction from "./pages/auction/AllAuctionTransaction";
import GeneralTransaction from "./pages/general/GeneralTransaction";
import AuctionTransaction from "./pages/auction/AuctionTransaction";
import UserPage from "./pages/user/UserPage";
import GeneralTransactionPost from "./pages/general/GeneralTransactionPost";
import GeneralTransactionBuyHistory from "./pages/user/general/GeneralTransactionBuyHistory";
import GeneralTransactionSellHistory from "./pages/user/general/GeneralTransactionSellHistory";
import GeneralTransactionUpdate from "./pages/general/GeneralTransactionUpdate";
import AuctionTransactionPost from "./pages/auction/AuctionTransactionPost";
import AuctionTransactionPostUpdate from "./pages/auction/AuctionTransactionPostUpdate";
import FindPassword from "./pages/user/FindPassword";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/general" element={<AllGeneralTransaction />} />
                    <Route path="/general/:generalTransactionId" element={<GeneralTransaction />} />
                    <Route path="/general/post" element={<GeneralTransactionPost />} />
                    <Route
                        path="/general/:generalTransactionId/updatepage"
                        element={<GeneralTransactionUpdate />}
                    />
                    <Route path="/auction" element={<AllAuctionTransaction />} />
                    <Route path="/auction/:auctionTransactionId" element={<AuctionTransaction />} />
                    <Route
                        path="/auction/:auctionTransactionId/updatepage"
                        element={<AuctionTransactionPostUpdate />}
                    />
                    <Route path="/auction/post" element={<AuctionTransactionPost />} />
                    <Route path="/user/" element={<UserPage />} />
                    <Route path="/findPw" element={<FindPassword />} />
                    <Route
                        path="/user/:userId/general-sell-history"
                        element={<GeneralTransactionSellHistory />}
                    />
                    <Route
                        path="/user/:userId/general-buy-history"
                        element={<GeneralTransactionBuyHistory />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
