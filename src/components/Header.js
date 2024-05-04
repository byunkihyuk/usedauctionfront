import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import CustomInput from "./CustomInput";

function Header(props) {
    const movePage = useNavigate();
    const [login, setLogin] = useState(localStorage.getItem("loginToken"));
    const [position, setPosition] = useState(window.pageYOffset);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [dot, setDot] = useState(false);
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const searchBarRef = useRef(null);

    useEffect(() => {
        function handleScroll() {
            const scrollmove = window.pageYOffset;
            setHeaderVisible(position > scrollmove);
            setPosition(scrollmove);
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [position]);

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
        movePage("/");
    }

    function generalTransactionPage() {
        movePage("/general");
    }

    function auctionTransactionPage() {
        movePage("/auction");
    }

    function myPage() {
        if (login == null) {
            if (window.confirm("로그인 후 이용 가능합니다.\n로그인 하시겠습니까?")) {
                movePage("/sign-in");
            }
        } else {
            movePage("/users");
        }
    }

    function chattingRoomPage() {
        if (login == null) {
            if (window.confirm("로그인 후 이용 가능합니다.\n로그인 하시겠습니까?")) {
                movePage("/sign-in");
            }
        } else {
            movePage("/chat");
        }
    }

    function onChangeSearch(e) {
        setSearchKeyWord(e.target.value);
    }
    return (
        <header
            className={`fixed top-0  min-w-[1000px] w-full h-12  flex flex-col items-center justify-center border-b-2 border-purple-400 bg-white z-50 transition-all ${
                headerVisible ? "top-0" : "-top-12"
            }`}
        >
            <div className="min-w-[1000px] h-full flex items-center justify-center space-x-2">
                <div
                    className="p-2 cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white"
                    onClick={mainPage}
                >
                    메인 아이콘
                </div>

                <div
                    className="p-2 cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white"
                    onClick={generalTransactionPage}
                >
                    중고거래
                </div>

                <div
                    className="p-2 cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white"
                    onClick={auctionTransactionPage}
                >
                    경매거래
                </div>

                <div
                    className="p-2 cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white"
                    onClick={chattingRoomPage}
                >
                    채팅방
                </div>
                <div
                    className="p-2 cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white"
                    onClick={myPage}
                >
                    마이페이지
                </div>

                <CustomInput
                    ref={searchBarRef}
                    size="search"
                    placeholder="검색어를 입력하세요"
                    type="search"
                    onChange={onChangeSearch}
                    onKeyDown={null}
                    value={searchKeyWord}
                    onClickTextDelete={() => {
                        setSearchKeyWord("");
                        if (searchBarRef) {
                            searchBarRef.current.focus();
                        }
                    }}
                ></CustomInput>

                {login ? (
                    <div
                        className="p-2 cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white"
                        onClick={logout}
                    >
                        로그아웃
                    </div>
                ) : (
                    <div className="flex items-center justify-center space-x-2">
                        <div
                            className="p-2 cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white"
                            onClick={signInPage}
                        >
                            로그인
                        </div>
                        <div
                            className="p-2 cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white"
                            onClick={signUpPage}
                        >
                            회원가입
                        </div>
                    </div>
                )}
            </div>
            <div
                className={`fixed z-50 transition-all   ${
                    dot
                        ? "w-auto h-auto bottom-10 right-5 bg-white outline outline-1 outline-purple-500 rounded-md "
                        : "w-10 h-10 bottom-10 right-5 bg-purple-500 rounded-full cursor-pointer  flex items-center justify-center"
                }`}
                onClick={() => {
                    if (dot === false) {
                        setDot(true);
                    }
                }}
            >
                {!dot && (
                    <div className="relative w-full h-full flex items-center justify-center rounded-full">
                        <span className="absolute  w-6 h-[3px] bg-white"></span>
                        <span className="absolute w-6 h-[3px] bg-white rotate-90"></span>
                    </div>
                )}
                {dot && (
                    <div className=" py-4 grid gap-y-2">
                        <div className="flex items-center justify-between">
                            <div className="px-2">글작성</div>
                            <div
                                className="relative right-1 w-5 h-5 flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                    setDot(false);
                                }}
                            >
                                <span className="absolute w-5 h-[2px] bg-black rotate-45"></span>
                                <span className="absolute w-5 h-[2px] bg-black -rotate-45"></span>
                            </div>
                        </div>
                        <div
                            className="cursor-pointer  border-white hover:bg-purple-400 px-2 h-10 flex items-center justify-center hover:text-white"
                            onClick={() => movePage("/general/post")}
                        >
                            중고 거래 작성
                        </div>
                        <div
                            className=" border-white cursor-pointer hover:bg-purple-400 px-2 h-10 flex items-center justify-center hover:text-white"
                            onClick={() => movePage("/auction/post")}
                        >
                            경매 거래 작성
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
