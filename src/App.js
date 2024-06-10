import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/main";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import AllGeneralTransaction from "./pages/general/AllGeneralTransaction";
import GeneralTransaction from "./pages/general/GeneralTransaction";
import GeneralTransactionPost from "./pages/general/GeneralTransactionPost";

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
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
