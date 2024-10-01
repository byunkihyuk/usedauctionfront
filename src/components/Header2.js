import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { ReactComponent as NotificationIcon } from "../images/notification.svg";
import { EventSourcePolyfill } from "event-source-polyfill";
import Notification from "./Notification";

function Header2(props) {
    const movePage = useNavigate();
    const [login, setLogin] = useState(localStorage.getItem("loginToken"));
    const [position, setPosition] = useState(window.pageYOffset);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [dot, setDot] = useState(false);
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const searchBarRef = useRef(null);
    const [menu, setMenu] = useState(false);
    const [notificationDropDown, setNotificationDropDown] = useState(false);
    const [notification, setNotification] = useState(null);
    const [notificationStart, setNotificationStart] = useState(0);
    const [newNotification, setNewNotification] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("loginToken")) {
            const eventSource = new EventSourcePolyfill(
                `${
                    process.env.REACT_APP_CLIENT_IP
                }/api/notification?nickname=${localStorage.getItem("nickname")}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                    },
                    heartbeatTimeout: 3600000,
                }
            );

            eventSource.onopen = () => {
                console.log("notification see 연결");
            };

            eventSource.addEventListener("notification", (res) => {
                if (res.data !== "Notification Subscribed successfully.") {
                    const getSseData = JSON.parse(res.data);
                    setNotification([getSseData, ...notification]);
                }
            });

            eventSource.onerror = (res) => {
                console.log(res);
            };

            return () => {
                eventSource.close();
            };
        }
    }, [login]);

    useEffect(() => {
        const loginInfo = localStorage.getItem("loginInfo");
        const now = new Date();
        if (loginInfo) {
            if (loginInfo < now.getTime()) {
                logout();
                if (window.confirm("로그인이 만료되었습니다.\n재로그인 하시겠습니까?.")) {
                    movePage("/sign-in");
                }
            }
        }
    }, []);

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

    useEffect(() => {
        if (localStorage.getItem("loginToken")) {
            fetch(
                `${process.env.REACT_APP_CLIENT_IP}/api/notification?start=${notificationStart}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                    },
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    if (res.status == "success") {
                        setNotification(res.data.notification);
                        setNotificationStart(res.data.notification.length);
                        setNewNotification(res.data.newNotification);
                    } else {
                        console.log("알림을 불러오지 못했습니다.");
                    }
                })
                .catch((error) => console.log(error));
        }
    }, []);

    function signInPage() {
        movePage("/sign-in");
    }

    function signUpPage() {
        movePage("/sign-up");
    }

    function logout() {
        localStorage.removeItem("loginToken");
        localStorage.removeItem("nickname");
        localStorage.removeItem("loginInfo");
        setLogin(null);
        movePage("/");
    }

    function generalTransactionPage() {
        movePage("/general");
    }

    function auctionTransactionPage() {
        movePage("/auction");
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

    function onClickNotification(item) {
        if (item.readornot == false) {
            fetch(`${process.env.REACT_APP_CLIENT_IP}/api/notification-read`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    notificationId: item.notificationId,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == "success") {
                        setNewNotification(newNotification - 1);
                        movePage(item.url);
                    }
                })
                .catch((error) => console.log(error));
        } else {
            movePage(item.url);
        }
    }

    function onClickReadNotification(item, index) {
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/notification-read`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                notificationId: item.notificationId,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status == "success") {
                    setNewNotification(newNotification - 1);
                    rerender(res.data, index);
                }
            })
            .catch((error) => console.log(error));
    }

    function rerender(updateData, index) {
        let copyNotification = [...notification];
        copyNotification[index] = updateData;
        setNotification(copyNotification);
    }

    function onClickReadAllNotification() {
        if (newNotification > 0) {
            fetch(
                `${process.env.REACT_APP_CLIENT_IP}/api/notification-read-all?start=${notificationStart}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                    },
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == "success") {
                        setNotification(res.data.notification);
                        setNotificationStart(res.data.notification.length);
                        setNewNotification(res.data.newNotification);
                    } else {
                        alert(res.message);
                    }
                })
                .catch((error) => console.log(error));
        }
    }

    // function notificationDateFormat(createdAt) {
    //     let now = new Date();
    //     let date = new Date(createdAt);
    //     let year = date.getFullYear();
    //     let month = date.getMonth();
    //     let day = date.getDate();
    //     let hour = date.getHours();
    //     let minutes = date.getMinutes();
    //     if (now.getDate() > day) {
    //         if (now.getFullYear() > year) {
    //             return now.getFullYear() - year + "년 전";
    //         } else if (now.getMonth() > month) {
    //             return now.getMonth() - month + "개월 전";
    //         } else {
    //             return now.getDate() - day + "일 전";
    //         }
    //     } else {
    //         if (now.getHours() == hour) {
    //             return minutes + "분 전";
    //         } else {
    //             return now.getHours() - hour + "시간 전";
    //         }
    //     }
    // }

    return (
        <header
            className={`fixed w-full min-w-96 h-12  flex flex-col items-center justify-center border-b-2 border-purple-400 bg-white z-50 transition-all ${
                headerVisible ? "top-0" : "-top-12"
            }`}
        >
            <div className="w-full h-full flex items-center justify-between max-w-[500px]">
                <Link
                    to={"/"}
                    className="p-2 cursor-pointer"
                    //onClick={mainPage}
                >
                    <p className="font-bold text-purple-500 text-sm">usedauction</p>
                </Link>

                <CustomInput
                    ref={searchBarRef}
                    size="search"
                    placeholder="검색어를 입력하세요"
                    type="search"
                    onChange={(e) => setSearchKeyWord(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            movePage(`/search?keyword=${searchKeyWord}`);
                        }
                    }}
                    value={searchKeyWord}
                    onClickTextDelete={() => {
                        setSearchKeyWord("");
                        if (searchBarRef) {
                            searchBarRef.current.focus();
                        }
                    }}
                ></CustomInput>

                <div className="relative">
                    <div
                        onClick={() => {
                            if (!login) {
                                if (
                                    window.confirm(
                                        "로그인 후 이용 가능합니다.\n로그인 하시겠습니까?"
                                    )
                                ) {
                                    movePage("/sign-in");
                                }
                            } else {
                                setNotificationDropDown(!notificationDropDown);
                            }
                        }}
                    >
                        <NotificationIcon className="cursor-pointer w-8 h-8" />
                        {newNotification > 0 && (
                            <div className="absolute top-0 right-0 rounded-full bg-red-500 text-white w-5 h-5 flex items-center justify-center text-sm">
                                {newNotification}
                            </div>
                        )}
                    </div>
                    <div
                        className={`fixed z-50 top-12 right-0 bg-white border-2 rounded-lg w-full transition-all
                                    ${
                                        notificationDropDown
                                            ? "visible h-[calc(100%-48px)]"
                                            : "invisible h-0"
                                    } flex flex-col`}
                    >
                        <div className="w-full min-h-10 flex items-center justify-center">
                            알림
                            <div
                                className="absolute top-2 right-5 w-6 h-6 flex flex-col items-center justify-center cursor-pointer"
                                onClick={() => setNotificationDropDown(false)}
                            >
                                <span className="absolute w-6 h-[2px] bg-black rounded-full rotate-45"></span>
                                <span className="absolute w-6 h-[2px] bg-black rounded-full -rotate-45"></span>
                            </div>
                        </div>
                        <div className="w-full flex-auto overflow-y-auto space-y-2 p-1 bg-gray-200">
                            {notification && notification.length > 0 ? (
                                notification.map((item, index) => (
                                    <Notification
                                        item={item}
                                        index={index}
                                        key={index}
                                        onClickReadNotification={onClickReadNotification}
                                        onClickNotification={onClickNotification}
                                    ></Notification>
                                    // <div
                                    //     key={index}
                                    //     className="relative  rounded-lg w-full
                                    //      h-auto flex flex-col items-start justify-start p-1 pc:text-sm mobile:text-xs
                                    //      cursor-pointer bg-white hover:bg-gray-100 "
                                    //     onClick={() => onClickNotification(item)}
                                    // >
                                    //     {item.readornot == true && (
                                    //         <div className="absolute w-full h-full top-0 left-0 rounded-lg opacity-50 bg-gray-100"></div>
                                    //     )}
                                    //     <div className="h-8 w-full flex items-center justify-between">
                                    //         <div className="flex items-center space-x-2">
                                    //             <div>{notificationDateFormat(item.createdAt)}</div>
                                    //             {item.read == false && (
                                    //                 <div className="text-green-600">new</div>
                                    //             )}
                                    //         </div>
                                    //         {item.readornot === false && (
                                    //             <div className="w-12">
                                    //                 <CustomButton
                                    //                     text={"읽기"}
                                    //                     size={"full"}
                                    //                     onClick={() =>
                                    //                         onClickReadNotification(item, index)
                                    //                     }
                                    //                 ></CustomButton>
                                    //             </div>
                                    //         )}
                                    //     </div>
                                    //     <div className="w-full min-h-6 h-auto flex items-start mobile:text-sm">
                                    //         {item.message}
                                    //     </div>
                                    // </div>
                                ))
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    알림이 없습니다.
                                </div>
                            )}
                        </div>
                        <CustomButton
                            text={"전체 읽기"}
                            size={"full"}
                            onClick={onClickReadAllNotification}
                        ></CustomButton>
                    </div>
                </div>

                <div
                    className="w-10 h-10 relative cursor-pointer flex flex-col items-center justify-center space-y-1"
                    onClick={() => setMenu(true)}
                >
                    <span className=" bg-gray-600 w-7 h-1 rounded-full"></span>
                    <span className=" bg-gray-600 w-7 h-1 rounded-full"></span>
                    <span className=" bg-gray-600 w-7 h-1 rounded-full"></span>
                </div>
                {menu && (
                    <div
                        onClick={() => setMenu(false)}
                        id="backbord"
                        className="bg-gray-600 opacity-50 w-full h-full fixed top-0 left-0 z-40"
                    ></div>
                )}
                <div
                    className={`z-50 absolute top-0 ${
                        menu ? "right-0" : "-right-full"
                    } transition-all w-80 h-screen flex flex-col bg-white outline outline-1 outline-gray-400`}
                >
                    <div className="w-full flex items-center justify-between border-b-2 border-gray-400">
                        <div className="px-2 text-lg font-bold">메뉴</div>
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
                                    className="p-2 w-20 cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white"
                                    onClick={signInPage}
                                >
                                    로그인
                                </div>
                                <div
                                    className="p-2 w-20 cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white"
                                    onClick={signUpPage}
                                >
                                    회원가입
                                </div>
                            </div>
                        )}
                        <div
                            className="w-10 h-10 relative cursor-pointer flex items-center justify-center flex-col"
                            onClick={() => setMenu(false)}
                        >
                            <span className="absolute rotate-45 bg-black w-8 h-1 rounded-full"></span>
                            <span className="absolute -rotate-45 bg-black w-8 h-1 rounded-full"></span>
                        </div>
                    </div>
                    <div
                        className="p-2 h-12 flex items-center justify-center cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white border-b-2"
                        onClick={generalTransactionPage}
                    >
                        중고
                    </div>

                    <div
                        className="p-2 h-12 flex items-center justify-center cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white border-b-2"
                        onClick={auctionTransactionPage}
                    >
                        경매
                    </div>

                    <div
                        className="p-2 h-12 flex items-center justify-center cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white border-b-2"
                        onClick={chattingRoomPage}
                    >
                        채팅목록
                    </div>
                    <div
                        className="p-2 h-12 flex items-center justify-center cursor-pointer transition hover:bg-gradient-to-l hover:from-white hover:via-purple-200 hover:via-50% hover:to-white border-b-2"
                        onClick={() => {
                            if (login == null) {
                                if (
                                    window.confirm(
                                        "로그인 후 이용 가능합니다.\n로그인 하시겠습니까?"
                                    )
                                ) {
                                    movePage("/sign-in");
                                }
                            } else {
                                movePage("/user");
                            }
                        }}
                    >
                        내정보
                    </div>
                </div>
            </div>
            <div
                className={`fixed z-40 transition-all   ${
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

export default Header2;
