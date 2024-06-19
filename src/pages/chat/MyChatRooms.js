import { useEffect, useRef, useState } from "react";
import ChatRoom from "../../components/ChatRoom";
import CustomButton from "../../components/CustomButton";
import Layouts from "../../components/Layout";
import noimage from "./../../images/noimage.png";
import { ReactComponent as Xsvg } from "./../../images/x.svg";
import Loading from "../../components/Loading";
import * as StompJs from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import { EventSourcePolyfill } from "event-source-polyfill";

function MyChatRooms() {
    const [userId, setUserId] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const movePage = useNavigate();
    const [messageLoading, setMessageLoading] = useState(false);
    const [data, setData] = useState(null);
    const [messageList, setMessageList] = useState(null);
    const [selectRoom, setSelectRoom] = useState(null);
    const [selectReceiver, setSelectReceiver] = useState(0);
    const [sendMessage, setSendMessage] = useState("");
    const [messageCount, setMessageCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isMoreMessage, setIsMoreMessage] = useState(false);
    const client = useRef({});
    const messageView = useRef(null);
    const sendMessageRef = useRef(null);

    useEffect(() => {
        if (localStorage.getItem("loginToken") && userId != null) {
            const eventSource = new EventSourcePolyfill(
                `${process.env.REACT_APP_CLIENT_IP}/api/chat?user-id=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                    },
                    heartbeatTimeout: 1800000,
                }
            );

            eventSource.onopen = () => {
                console.log("see 연결");
            };

            eventSource.addEventListener("chat", (res) => {
                if (res.data !== "Subscribed successfully.") {
                    const getSeeData = JSON.parse(res.data);
                    const filterData = data.filter((room) => room.roomId !== getSeeData.roomId);
                    setData([getSeeData, ...filterData]);
                }
            });

            eventSource.onerror = (res) => {
                console.log(res);
            };

            return () => {
                eventSource.close();
            };
        }
    }, [userId]);

    useEffect(() => {
        if (!localStorage.getItem("loginToken")) {
            alert("로그인 후 이용 가능합니다");
            movePage("/sign-in");
            return;
        }
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/chat`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("loginToken"),
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    setData(res.data.chattingList);
                    setUserId(res.data.loginUser);
                } else {
                    alert("채팅방 불러오기 실패\n" + res.message);
                }
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        if (!isMoreMessage) {
            if (messageView.current && messageView != null) {
                messageView.current.scrollTop = messageView.current.scrollHeight;
            }
        }
        setIsMoreMessage(false);
    }, [messageList]);

    function onClickChatRoomOpen(item) {
        setMessageLoading(true);
        setSelectRoom(item.roomId);
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/chat/${item.roomId}?start=${0}`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("loginToken"),
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    setMessageList(res.data);
                    setMessageCount(50);
                    setSelectReceiver(item.receiver);
                    //connect(data);
                } else {
                    alert("채팅 불러오기 실패\n" + res.message);
                    setSelectRoom(null);
                }
                setMessageLoading(false);
            })
            .catch((error) => console.log(error));

        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/chat-receiver/${item.roomId}`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("loginToken"),
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    setReceiver(res.data);
                } else {
                    alert("사용자 불러오기 실패\n" + res.message);
                }
                setMessageLoading(false);
            })
            .catch((error) => console.log(error));
    }
    useEffect(() => {
        if (selectRoom != null) {
            try {
                // 소켓 연결
                // const sockt = new SockJS("http://localhost:8080/chatting", null, {
                //     transports: ["websocket", "xhr-streaming", "xhr-polling"],
                // });
                client.current = new StompJs.Client({
                    brokerURL: `${process.env.REACT_APP_CLIENT_SOCKET}/chatting`,
                    connectHeaders: {
                        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                    },
                    debug: function (error) {
                        // console.log("디버그 : " + error);
                    },
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                });
                // 구독
                client.current.onConnect = function (frame) {
                    client.current.subscribe("/queue/" + selectRoom, (message) => {
                        // console.log("메시지: " + message.body);
                        setMessageList((messageList) => [...messageList, JSON.parse(message.body)]);
                    });
                };

                client.current.onStompError = function (frame) {
                    console.log("stomp 에러 종료 : " + frame);
                };

                client.current.activate();
            } catch (e) {
                console.log(e);
            }

            return () => {
                if (client.current) {
                    client.current.deactivate();
                }
            };
        }
    }, [selectRoom]);

    function onClickChatRoomClose() {
        setMessageList(null);
        setMessageLoading(false);
        // 연결 끊기
        if (client.current != null) {
            client.current.deactivate();
        }
    }

    function onClickSendMessage() {
        if (sendMessage === "") {
            return;
        }
        if (!client.current) {
            alert("채팅방 연결 실패");
            return;
        }
        client.current.publish({
            destination: "/app/users",
            body: JSON.stringify({
                roomId: selectRoom,
                content: sendMessage,
                sender: userId,
                receiver: selectReceiver,
                createdAt: new Date(),
            }),
        });
        setSendMessage("");
        if (sendMessageRef.current) {
            sendMessageRef.current.focus();
        }
    }

    function onKeyDownMessage(e) {
        if (e.keyCode === 13) {
            if (!e.shiftKey) {
                onClickSendMessage();
            }
            setTimeout(setSendMessage(""), 100);
        }
    }

    function sendTime(createdAt) {
        let now = new Date(createdAt);
        let nowHour = now.getHours();
        let nowMinit = now.getMinutes();
        if (nowMinit < 10) {
            nowMinit = "0" + nowMinit.toString();
        }
        if (nowHour - 12 < 0) {
            return "오전 " + nowHour + ":" + nowMinit;
        } else {
            return "오후 " + (nowHour - 12) + ":" + nowMinit;
        }
    }

    var day = null;

    function dayLine(createdAt) {
        let now = new Date(createdAt);
        let nowDay = now.getDate();
        if (day !== nowDay) {
            day = nowDay;
            return true;
        }
        day = nowDay;
        return false;
    }

    function dayLine2(createdAt) {
        let now = new Date(createdAt);
        let nowYear = now.getFullYear();
        let nowMonth = now.getMonth() + 1;
        let nowDay = now.getDate();
        return nowYear + "-" + nowMonth + "-" + nowDay;
    }

    function onClickMoreMessage() {
        setIsMoreMessage(true);
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/chat/${selectRoom}?start=${messageCount}`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("loginToken"),
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    if (res.data.length > 0) {
                        setMessageList([...res.data, ...messageList]);
                        setMessageCount(messageCount + 50);
                    }
                } else {
                    alert("채팅 불러오기 실패\n" + res.message);
                }
                setMessageLoading(false);
            })
            .catch((error) => console.log(error));
    }

    return (
        <Layouts>
            {loading && <Loading></Loading>}
            <div className="min-w-[1000px] border-b-2">
                <div className="flex items-center justify-center h-20 border-y-2 text-2xl">
                    채팅방
                </div>
                <div className="flex  ">
                    <div className=" w-[400px] min-w-[300px] h-[600px] overflow-y-auto flex flex-col">
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <ChatRoom
                                    key={index}
                                    message={item.lastMessage}
                                    messageTime={item.messageCreatedAt}
                                    nickname={
                                        userId === item.sender
                                            ? item.receiverNickname
                                            : item.senderNickname
                                    }
                                    onClickChatRoomHandle={() => {
                                        onClickChatRoomOpen(item);
                                    }}
                                    productImg={
                                        item.productThumbnail ? item.productThumbnail : noimage
                                    }
                                    bgColor={item.roomId == selectRoom ? "bg-purple-200" : ""}
                                ></ChatRoom>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div>
                                    채팅내역이 없습니다.
                                    <br></br>
                                    <a href="/general" className="text-purple-600">
                                        중고거래하러가기
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {messageList ? (
                        <div className="w-[600px]  flex flex-col justify-between border-l-2">
                            <div className="max-h-[440px]  w-full">
                                <div className="flex items-center justify-between h-10 p-2 border-b-2">
                                    {/* <a href={`/user?user-id=${receiver}`}>
                                        <img
                                            src={`${data ? noimage : noimage}`}
                                            alt="프로필 이미지"
                                            className="w-6 h-6 rounded-full cursor-pointer"
                                        ></img>
                                    </a> */}
                                    <div
                                        className="cursor-pointer"
                                        onClick={() =>
                                            movePage(`/user?user-id=${receiver.receiverId}`)
                                        }
                                    >
                                        {receiver && receiver.nickname}
                                    </div>
                                    <Xsvg
                                        className="h-8 w-8 cursor-pointer"
                                        onClick={onClickChatRoomClose}
                                    ></Xsvg>
                                </div>
                                <div
                                    className=" h-[400px] w-auto overflow-y-auto"
                                    ref={messageView}
                                >
                                    <div className="w-full ">
                                        {messageList.length >= messageCount && (
                                            <div
                                                className=" w-full cursor-pointer text-sm h-6 flex items-center justify-center text-gray-400 hover:text-purple-400"
                                                onClick={onClickMoreMessage}
                                            >
                                                채팅 더보기
                                            </div>
                                        )}
                                        {messageList.map((item, index) => (
                                            <div className={`${"relative w-auto"}`} key={index}>
                                                {dayLine(item.createdAt) ? (
                                                    <div className="w-full text-sm text-gray-400 flex items-center justify-center">
                                                        <div className="h-[1px] w-full bg-gray-300"></div>
                                                        <div className="w-40 mx-2">
                                                            {dayLine2(item.createdAt)}
                                                        </div>
                                                        <div className="h-[1px] w-full bg-gray-300"></div>
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                                {item.sender === userId ? (
                                                    <div className="flex justify-end">
                                                        <div className="flex items-end justify-center my-1 text-sm text-gray-500">
                                                            {sendTime(item.createdAt)}
                                                        </div>
                                                        <div
                                                            className={` relative 
                                                            border-2 border-purple-500 rounded-xl m-1 p-1 text-sm max-w-[400px] break-all whitespace-pre`}
                                                        >
                                                            <div className="text-wrap">
                                                                {item.content}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex">
                                                        <div
                                                            className={` relative 
                                                        border-2 border-purple-500 rounded-xl m-1 p-1 text-sm max-w-[400px] break-all whitespace-pre`}
                                                        >
                                                            <div className="text-wrap">
                                                                {String(item.content).includes(
                                                                    "https"
                                                                ) ? (
                                                                    <a
                                                                        className=""
                                                                        href={item.content}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        {item.content}
                                                                    </a>
                                                                ) : (
                                                                    item.content
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-end justify-center my-1 text-sm text-gray-500 ">
                                                            {sendTime(item.createdAt)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-40 flex items-center justify-center p-2 ">
                                <div className="w-full h-28 border-[1px] border-black rounded-lg">
                                    <div className="h-16">
                                        <textarea
                                            ref={sendMessageRef}
                                            className="h-16 w-full p-2 rounded-tr-lg rounded-tl-lg text-sm resize-none"
                                            placeholder="메시지를 입력하세요"
                                            onChange={(e) => setSendMessage(e.target.value)}
                                            value={sendMessage}
                                            onKeyDown={onKeyDownMessage}
                                        ></textarea>
                                    </div>
                                    <div className="w-full h-12 flex items-center justify-end p-2">
                                        <div>
                                            <CustomButton
                                                text={"전송"}
                                                size={"sm"}
                                                onClick={onClickSendMessage}
                                            ></CustomButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : messageLoading ? (
                        <div className="w-3/5">
                            <Loading
                                positon={"relative"}
                                height={" h-full "}
                                width={"w-full"}
                            ></Loading>
                        </div>
                    ) : (
                        <div className="min-w-[300px] w-3/5 flex  items-center justify-center border-l-2">
                            채팅방을 선택해 주세요.
                        </div>
                    )}
                </div>
            </div>
        </Layouts>
    );
}

export default MyChatRooms;
