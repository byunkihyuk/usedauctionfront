import { useEffect, useRef, useState } from "react";
import Layouts from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../components/CustomButton";
import noimage from "./../../images/noimage.png";
import Loading from "../../components/Loading";
import ImageSlider from "../../components/Slider";

function GeneralTransaction() {
  const movePage = useNavigate();
  const { generalTransactionId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState(false);
  const [generalModal, setGeneralModal] = useState(false);
  const [receiveRequest, setReceiveRequest] = useState(false);
  const [receiveBuyRequestData, setReceiveBuyRequestData] = useState(null);
  const [buyRequestData, setBuyRequestData] = useState(null);
  const [optionDropDown, setOptionDropDown] = useState(false);
  const optionRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_CLIENT_IP}/api/general/${generalTransactionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          setData(res.data);
          setLoading(false);
          setAuthor(res.data.author);
        } else {
          alert(res.message);
          movePage(-1);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const [sliderIndex, setSliderIndex] = useState(0);
  const [sliderLocation, setSliderLocation] = useState(0);
  const moveSize = 500;
  const [startMouseX, setStartMouseX] = useState(0);
  const [moveX, setMoveX] = useState(0);

  function onLeft() {
    setSliderIndex(
      sliderIndex - 1 >= 0 ? sliderIndex - 1 : data.images.length - 1
    );
    setSliderLocation(
      (sliderIndex - 1 >= 0 ? sliderIndex - 1 : data.images.length - 1) *
        moveSize
    );
  }

  function onRight() {
    setSliderIndex((sliderIndex + 1) % data.images.length);
    setSliderLocation(((sliderIndex + 1) % data.images.length) * moveSize);
  }

  function onMouseDown(e) {
    setStartMouseX(e.clientX);
  }

  function onDragHandle(e) {
    if (startMouseX > e.clientX) {
      setMoveX(e.clientX - startMouseX);
      setSliderLocation(sliderLocation + moveX);
    } else {
      let moveX = e.clientX - startMouseX;
      setSliderLocation(sliderLocation + moveX);
    }
  }

  function onMouseUp(e) {
    setSliderLocation(sliderIndex);
  }

  function onClickDeleteTransaction() {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      fetch(
        `${process.env.REACT_APP_CLIENT_IP}/api/general/${generalTransactionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.status === "success") {
            alert("삭제되었습니다.");
            movePage("/general");
          } else {
            alert(res.message);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  function onClickProductBuy() {
    if (author) {
      return;
    }
    fetch(`${process.env.REACT_APP_CLIENT_IP}/api/pay/general/payment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seller: data.seller,
        generalTransactionId: data.generalTransactionId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          alert("구매 요청 성공");
          setBuyRequestData(res.data);
          setGeneralModal(true);
          setReceiveRequest(false);
          setReceiveBuyRequestData(null);
        } else if (res.status === "fail") {
          setBuyRequestData(res.data);
          setGeneralModal(true);
          setReceiveRequest(false);
          setReceiveBuyRequestData(null);
        } else {
          alert("구매 요청 실패\n" + res.message);
        }
      })
      .catch((error) => console.log(error));
  }

  function onClickBuyRequestUpdate(item) {
    if (author) {
      return;
    }
    fetch(`${process.env.REACT_APP_CLIENT_IP}/api/pay/general/payment`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payInfoId: item.payInfoId,
        generalTransactionId: item.generalTransactionId,
        seller: item.seller,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          alert("요청 수정 성공");
          setGeneralModal(false);
          setBuyRequestData(null);
          setReceiveBuyRequestData(null);
        } else {
          alert("요청 수정 실패\n" + res.message);
        }
      })
      .catch((error) => console.log(error));
  }

  function onClickChatting() {
    if (author) {
      return;
    }
    fetch(`${process.env.REACT_APP_CLIENT_IP}/api/chat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seller: data.seller,
        generalTransactionId: generalTransactionId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          movePage("/chat", {
            state: {
              generalTransactionId: generalTransactionId,
              roomId: res.data.roomId,
            },
          });
        }
      })
      .catch((error) => console.log(error));
  }

  function onClickBuyerChatting(item) {
    if (author) {
      return;
    }
    fetch(`${process.env.REACT_APP_CLIENT_IP}/api/chat/buyer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
      },
      body: JSON.parse({
        buyer: item.buyer,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          movePage("/chat", {
            state: {
              generalTransactionId: generalTransactionId,
              roomId: res.data.roomId,
            },
          });
        }
      })
      .catch((error) => console.log(error));
  }

  function onClickReceiveBuyRequest() {
    if (author) {
      fetch(
        `${process.env.REACT_APP_CLIENT_IP}/api/general/${generalTransactionId}/buy-request-list`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.status === "success") {
            setReceiveBuyRequestData(res.data);
            setBuyRequestData(null);
          } else {
            setReceiveBuyRequestData(null);
          }
        })
        .catch((error) => console.log(error));
    }
    setGeneralModal(true);
    setReceiveRequest(true);
  }

  function onClickTrade(item) {
    if (window.confirm("거래를 진행하시겠습니까?")) {
      fetch(`${process.env.REACT_APP_CLIENT_IP}/api/pay/general/progress`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payInfoId: item.payInfoId,
          generalTransactionId: item.generalTransactionId,
          seller: item.seller,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === "success") {
            alert("거래 진행중 변경");
            setGeneralModal(false);
            setBuyRequestData(null);
            setReceiveBuyRequestData(null);
          } else {
            alert("거래 진행 실패\n" + res.message);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  function onClickApprove(item) {
    if (window.confirm("구매확정을 진행하시겠습니까?")) {
      fetch(`${process.env.REACT_APP_CLIENT_IP}/api/pay/general/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payInfoId: item.payInfoId,
          generalTransactionId: item.generalTransactionId,
          seller: item.seller,
          buyer: item.buyer,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === "success") {
            alert("구매 확정 완료");
            setGeneralModal(false);
            setBuyRequestData(null);
            setReceiveBuyRequestData(null);
          } else {
            alert("구매 확정 실패\n" + res.message);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  function onClickTradeCancel(item) {
    if (window.confirm("거래를 취소하시겠습니까?")) {
      fetch(`${process.env.REACT_APP_CLIENT_IP}/api/pay/general/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payInfoId: item.payInfoId,
          generalTransactionId: item.generalTransactionId,
          seller: item.seller,
          buyer: item.buyer,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === "success") {
            alert("거래 취소 완료");
            setGeneralModal(false);
            setBuyRequestData(null);
            setReceiveBuyRequestData(null);
          } else {
            alert("거래 취소 실패\n" + res.message);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  function dateFormat(time) {
    let now = new Date(time);
    let nowYear = now.getYear() >= 100 ? now.getYear() - 100 : now.getYear();
    let nowMonth = now.getMonth() + 1;
    let nowDay = now.getDate();
    let nowHours = now.getHours();
    let nowMinutes = now.getMinutes();
    if (nowHours - 12 < 0) {
      return (
        nowYear +
        "-" +
        nowMonth +
        "-" +
        nowDay +
        " " +
        nowHours +
        ":" +
        nowMinutes +
        "AM"
      );
    } else {
      return (
        nowYear +
        "-" +
        nowMonth +
        "-" +
        nowDay +
        " " +
        (nowHours - 12) +
        ":" +
        nowMinutes +
        "PM"
      );
    }
  }

  return (
    <Layouts>
      {loading && <Loading></Loading>}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="relative w-[500px] h-[500px]">
            {data && data.images.length > 0 ? (
              <ImageSlider images={data.images}></ImageSlider>
            ) : (
              <img
                alt="noimage"
                src={noimage}
                className="w-[500px] h-[500px]"
              ></img>
            )}

            {data && data.transactionState !== "판매중" ? (
              <div className="absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center text-2xl font-bold text-purple-600">
                <div className="absolute w-full h-full bg-black opacity-50"></div>
                <div className="absolute">{data.transactionState}</div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="relative w-[500px] h-[500px] flex flex-col items-start justify-between  p-5">
            {author && (
              <button
                className="absolute right-2 top-2 w-6 bg-white outline outline-[1px] outline-gray-300 h-6 rounded-full flex flex-col items-center justify-center space-y-[2px]"
                onClick={() => setOptionDropDown(!optionDropDown)}
                tabIndex={-1}
                onBlur={(e) => {
                  if (
                    optionDropDown &&
                    optionRef &&
                    optionRef.current !== e.target
                  ) {
                    setOptionDropDown(false);
                  }
                }}
              >
                <span className="w-[3px] h-[3px] rounded-full bg-black"></span>
                <span className="w-[3px] h-[3px] rounded-full bg-black"></span>
                <span className="w-[3px] h-[3px] rounded-full bg-black"></span>
                {optionDropDown && (
                  <div
                    className="absolute right-0 top-8 bg-white w-20 h-auto flex flex-col items-center justify-center text-sm space-y-1 rounded-md py-1 origin-top-right shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    ref={optionRef}
                  >
                    <div
                      className=" w-full hover:bg-purple-200 cursor-pointer h-8 flex items-center justify-center"
                      onClick={() =>
                        movePage(`/general/${generalTransactionId}/updatepage`)
                      }
                    >
                      수정
                    </div>
                    <div
                      className="w-full hover:bg-purple-200 cursor-pointer h-8 flex items-center justify-center"
                      onClick={onClickDeleteTransaction}
                    >
                      삭제
                    </div>
                  </div>
                )}
              </button>
            )}
            <div className="text-xl font-bold">{data && data.title}</div>
            <div className="text-xl font-bold">
              {Number(data && data.price).toLocaleString()} 원
            </div>
            <div>거래 방식 : {data && data.transactionMode}</div>
            <div>
              주소 :{" "}
              {(data && data.address !== null ? data.address : "") +
                " " +
                (data && data.detailAddress !== null ? data.detailAddress : "")}
            </div>
            <div>결제 방법 : {data && data.payment}</div>
            {author ? (
              <div className="w-full flex items-center justify-between space-x-2 p-2">
                <CustomButton
                  text={"구매 요청 목록 보기"}
                  size={"full"}
                  onClick={onClickReceiveBuyRequest}
                ></CustomButton>
              </div>
            ) : data && data.transactionState === "판매중" ? (
              <div className="w-full flex items-center justify-between space-x-2 p-2">
                <CustomButton
                  text={"구매 요청 및 요청 취소"}
                  size={"full"}
                  onClick={onClickProductBuy}
                ></CustomButton>
                <CustomButton
                  text={"채팅하기"}
                  size={"full"}
                  onClick={onClickChatting}
                ></CustomButton>
              </div>
            ) : (
              <CustomButton
                text={
                  data && data.transactionState === "거래중"
                    ? "거래중"
                    : "판매완료"
                }
                size={"full"}
                disabled={true}
                color={"bg-gray-500"}
              ></CustomButton>
            )}
          </div>
        </div>
        <hr className="w-full"></hr>
        <div className="w-[1000px] p-2 whitespace-pre">
          <div className="text-wrap text-left">{data && data.content}</div>
        </div>
      </div>
      {generalModal && (
        <div className="fixed left-0 top-0 w-screen h-screen  z-50 flex items-center justify-center">
          <div
            className="w-full h-full absolute left-0 top-0 bg-gray-600 opacity-50"
            onClick={() => setGeneralModal(false)}
          ></div>
          <div className="absolute w-96 min-h-96 h-auto bg-white rounded-lg flex flex-col">
            <div className="h-8 w-full">
              <div className=" h-full text-lg font-bold flex items-center justify-center border-b-2">
                {receiveRequest ? "구매 요청 목록" : "구매 요청"}
              </div>
            </div>
            <div
              className={`-full h-80 ${
                receiveRequest ? "overflow-y-auto" : ""
              }`}
            >
              <div className="flex items-center justify-center">
                <div className="w-20">{"닉네임"}</div>
                <div className="w-12">{"상태"}</div>
                <div className="w-32">{"요청일"}</div>
                <div className="w-32">{"수정일"}</div>
              </div>
              {buyRequestData && (
                <div className="h-20  flex flex-col text-sm  justify-center">
                  <div className="h-8  flex flex-col text-sm  justify-center">
                    <div className="flex items-center justify-center">
                      <div
                        title={buyRequestData.buyerNickname}
                        className="w-20"
                      >
                        {buyRequestData.buyerNickname}
                      </div>
                      <div
                        title={buyRequestData.transactionRequestState}
                        className="w-12"
                      >
                        {buyRequestData.transactionRequestState}
                      </div>
                      <div
                        title={dateFormat(buyRequestData.transactionTime)}
                        className="w-32"
                      >
                        {dateFormat(buyRequestData.transactionTime)}
                      </div>
                      <div
                        title={dateFormat(buyRequestData.transactionUpdateTime)}
                        className="w-32"
                      >
                        {dateFormat(buyRequestData.transactionUpdateTime)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    {buyRequestData.transactionRequestState === "대기" ||
                    buyRequestData.transactionRequestState === "거래중" ? (
                      <CustomButton
                        text={"요청취소"}
                        onClick={() => onClickTradeCancel(buyRequestData)}
                      ></CustomButton>
                    ) : buyRequestData.transactionRequestState === "취소" ? (
                      <CustomButton
                        text={"재구매요청"}
                        onClick={() => onClickBuyRequestUpdate(buyRequestData)}
                      ></CustomButton>
                    ) : (
                      <></>
                    )}
                    {buyRequestData.transactionRequestState === "거래중" ? (
                      <CustomButton
                        text={"구매확정"}
                        onClick={() => onClickApprove(buyRequestData)}
                      ></CustomButton>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )}
              {receiveBuyRequestData && receiveBuyRequestData.length > 0
                ? receiveBuyRequestData.map((item, index) => (
                    <div
                      key={index}
                      className="h-20  flex flex-col text-sm  justify-center"
                    >
                      <div className="h-8  flex flex-col text-sm  justify-center">
                        <div className="flex items-center justify-center">
                          <div title={item.buyerNickname} className="w-20">
                            {item.buyerNickname}
                          </div>
                          <div
                            title={item.transactionRequestState}
                            className="w-12"
                          >
                            {item.transactionRequestState}
                          </div>
                          <div
                            title={dateFormat(item.transactionTime)}
                            className="w-32"
                          >
                            {dateFormat(item.transactionTime)}
                          </div>
                          <div
                            title={dateFormat(item.transactionUpdateTime)}
                            className="w-32"
                          >
                            {dateFormat(item.transactionUpdateTime)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <CustomButton
                          text={"채팅하기"}
                          onClick={() => onClickBuyerChatting(item)}
                          s
                        ></CustomButton>
                        {item.transactionRequestState === "대기" ? (
                          <div className="space-x-1">
                            <CustomButton
                              text={"거래하기"}
                              onClick={() => onClickTrade(item)}
                            ></CustomButton>
                            <CustomButton
                              text={"요청취소"}
                              onClick={() => onClickTradeCancel(item)}
                            ></CustomButton>
                          </div>
                        ) : item.transactionRequestState === "거래중" ? (
                          <CustomButton
                            text={"거래취소"}
                            onClick={() => onClickTradeCancel(item)}
                          ></CustomButton>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  ))
                : !buyRequestData && (
                    <div className="h-full flex items-center justify-center">
                      구매 요청 내역이 없습니다.
                    </div>
                  )}
            </div>
            <div className="m-2">
              <CustomButton
                text={"닫기"}
                onClick={() => setGeneralModal(false)}
              ></CustomButton>
            </div>
          </div>
        </div>
      )}
    </Layouts>
  );
}

export default GeneralTransaction;
