import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import CustomInput from "./CustomInput";

function Header(props) {
    const { setLoginToken } = useContext(AppContext);
    const [login, setLogin] = useState(localStorage.getItem("loginToken"));
    useEffect(() => {}, []);
    const movePage = useNavigate();

    function mainPage() {
        movePage("/");
    }

    function signInPage() {
        movePage("/sign-in");
    }

    function signUpPage() {
        movePage("/sign-up");
    }

    function logout() {
        localStorage.removeItem("loginToken");
        setLogin(null);
        setLoginToken("");
        movePage("/");
    }

    function generalTransactionPage() {
        movePage("/general");
    }

    function auctionTransactionPage() {
        movePage("/auction");
    }

    function myPage() {
        movePage("/mypage");
    }

    function chattingRoomPage() {
        movePage("/chat");
    }

    function onChangeHandler() {}

    return (
        <header className="relative top-0  min-w-[1000px] w-full h-12  flex flex-col items-center justify-center border-b-2 border-purple-400">
            <div className="min-w-[1000px] h-full flex items-center justify-center space-x-2">
                <div className="p-2 cursor-pointer transition hover:scale-105" onClick={mainPage}>
                    메인 아이콘
                </div>
                <div
                    className="p-2 cursor-pointer transition hover:scale-110"
                    onClick={generalTransactionPage}
                >
                    중고거래
                </div>
                <div
                    className="p-2 cursor-pointer transition hover:scale-110"
                    onClick={auctionTransactionPage}
                >
                    경매거래
                </div>
                <div className="p-2 cursor-pointer transition hover:scale-110" onClick={myPage}>
                    마이페이지
                </div>
                <div
                    className="p-2 cursor-pointer transition hover:scale-110"
                    onClick={chattingRoomPage}
                >
                    채팅방
                </div>
                <CustomInput
                    size="search"
                    placeholder="검색어를 입력하세요"
                    type="search"
                    onChange={onChangeHandler}
                    onKeyDown={null}
                ></CustomInput>
                {login == null ? (
                    <div className="flex items-center justify-center space-x-2">
                        <div
                            className="p-2 cursor-pointer transition hover:scale-110"
                            onClick={signInPage}
                        >
                            로그인
                        </div>
                        <div
                            className="p-2 cursor-pointer transition hover:scale-110"
                            onClick={signUpPage}
                        >
                            회원가입
                        </div>
                    </div>
                ) : (
                    <div className="p-2 cursor-pointer transition hover:scale-110" onClick={logout}>
                        로그아웃
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
