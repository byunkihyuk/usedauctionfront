import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/main";
import SignIn from "./pages/user/SignIn";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/sign-in" element={<SignIn />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
