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
import GeneralTransactionPost from "./pages/general/GeneralTransactionPost";
import GeneralTransactionUpdate from "./pages/general/GeneralTransactionUpdate";

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
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
