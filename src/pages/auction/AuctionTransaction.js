import { useNavigate, useParams } from "react-router-dom";
import Layouts from "../../components/Layout";
import { useEffect, useRef, useState } from "react";
import Loading from "../../components/Loading";
import noimage from "../../images/noimage.png";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import ImageSlider from "../../components/Slider";
import { EventSourcePolyfill } from "event-source-polyfill";

function AuctionTransaction() {
  const movePage = useNavigate();
  const { auctionTransactionId } = useParams();
  const [data, setData] = useState(null);
  const [receiveBuyRequestData, setReceiveBuyRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState(false); // 수정
  const [bidListModal, setBidListModal] = useState(false);
  const [bidderModal, setBidderModal] = useState(false);
  const [optionDropDown, setOptionDropDown] = useState(false);
  const optionRef = useRef(null);
  const [bidPrice, setBidPrice] = useState(0);
  const [highestBid, sethighestBid] = useState(0);
  const bidPriceRef = useRef(null);
  const [mybid, setMyBid] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const deadLine =
    new Date() > new Date(data && data.finishedAt) ? true : false;

  useEffect(() => {
    const eventSource = new EventSourcePolyfill(
      `${process.env.REACT_APP_CLIENT_IP}/api/auction/${auctionTransactionId}/highest-bid`,
      { heartbeatTimeout: 1800000 }
    );

    eventSource.onopen = () => {
      console.log("sse 연결");
    };

    eventSource.onmessage = (res) => {
      console.log(res);
    };

    eventSource.addEventListener("auctionBid", (res) => {
      if (res.message !== "Subscribed successfully.") {
        sethighestBid(res.data);
      }
    });

    eventSource.onerror = () => {
      console.log("sse 에러 종료");
      //에러 발생시 할 동작
      eventSource.close(); //연결 끊기
    };

    return () => {
      console.log("see 종료");
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_CLIENT_IP}/api/auction/${auctionTransactionId}`,
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
          setData(res.data.transaction);
          setLoading(false);
          setAuthor(res.data.transaction.author);
          sethighestBid(res.data.transaction.highestBid);
          if (res.data.mybid) {
            setMyBid(res.data.mybid);
            setBidPrice(res.data.mybid.price);
          }
        } else {
          movePage(-1);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  function onClickDeleteTransaction() {
    if (
      window.confirm(
        "정말 삭제하시겠습니까?\n등록한 시작가격의 5%가 수수료로 차감됩니다."
      )
    ) {
      fetch(
        `${process.env.REACT_APP_CLIENT_IP}/api/auction/${auctionTransactionId}`,
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
            movePage("/auction");
          } else {
            alert(res.message);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  function onClickBidding() {
    if (author) {
      return;
    }
    if (highestBid >= bidPrice) {
      alert("최고가보다 낮거나 같은 가격으로 입찰할 수 없습니다.");
      if (bidPriceRef && bidPriceRef.current) {
        bidPriceRef.current.focus();
      }
      return;
    }
    if (!mybid) {
      fetch(`${process.env.REACT_APP_CLIENT_IP}/api/auction/bid`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: bidPrice,
          auctionTransactionId: auctionTransactionId,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === "success") {
            alert("입찰 성공");
            setMyBid(res.data);
          } else {
            alert("입찰 실패\n" + res.message);
          }
          setBidderModal(false);
        })
        .catch((error) => console.log(error));
    } else {
      fetch(`${process.env.REACT_APP_CLIENT_IP}/api/auction/bid`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auctionBidId: mybid.auctionBidId,
          price: bidPrice,
          auctionTransactionId: auctionTransactionId,
          bidder: mybid.bidder,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.status === "success") {
            alert("입찰 수정 성공");
            setMyBid(res.data);
          } else {
            alert("입찰 수정 실패\n" + res.message);
          }
          setBidderModal(false);
        })
        .catch((error) => console.log(error));
    }
  }

  function onClickBidList() {
    setBidListModal(true);
    if (!author) {
      return;
    }
    fetch(
      `${process.env.REACT_APP_CLIENT_IP}/api/auction/${auctionTransactionId}/bid/all`,
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
        if (res.status === "success") {
          setReceiveBuyRequestData(res.data);
        } else {
          alert(res.message);
        }
      })
      .catch((error) => console.log(error));

    setBidListModal(true);
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

  function onClickTrade(item) {
    if (window.confirm("거래를 진행하시겠습니까?")) {
      fetch(
        `${process.env.REACT_APP_CLIENT_IP}/api/pay/auction/bid/${item.auctionBidId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auctionTransactionId: auctionTransactionId,
            seller: data.seller,
            buyer: item.bidder,
            transactionMoney: item.price,
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.status === "success") {
            alert("거래를 진행합니다.");
          } else {
            alert("거래 진행 실패\n" + res.message);
          }
          setBidListModal(false);
        })
        .catch((error) => console.log(error));
    }
  }

  function onClickTradeCancel(item) {
    if (window.confirm("거래를 취소하시겠습니까?")) {
      fetch(
        `${process.env.REACT_APP_CLIENT_IP}/api/pay/auction/bid/${item.auctionBidId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auctionTransactionId: auctionTransactionId,
            seller: data.seller,
            buyer: data.buyer,
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.status === "success") {
            alert("거래를 취소합니다.");
          } else {
            alert("거래를 취소실패" + res.message);
          }
          setBidListModal(false);
          setBidderModal(false);
        })
        .catch((error) => console.log(error));
    }
  }

  function onClickTradeApprove(item) {
    if (window.confirm("구매확정 하시겠습니까?")) {
      fetch(
        `${process.env.REACT_APP_CLIENT_IP}/api/pay/auction/bid/${item.auctionBidId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auctionTransactionId: auctionTransactionId,
            seller: data.seller,
            buyer: data.buyer,
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.status === "success") {
            alert("구매확정이 완료되었습니다.");
          } else {
            alert("구매확정 실패\n" + res.message);
          }
          setBidderModal(false);
        })
        .catch((error) => console.log(error));
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
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-2xl font-bold text-purple-600">
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
                        movePage(`/auction/${auctionTransactionId}/updatepage`)
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
              시작가격 : {data && Number(data.price).toLocaleString()} 원
            </div>
            <div className="text-xl font-bold">
              최고가 : {Number(highestBid).toLocaleString()} 원
            </div>
            <div className="text-xl font-bold">
              내 입찰가격 :{" "}
              {Number(mybid && mybid.price ? mybid.price : 0).toLocaleString()}{" "}
              원
            </div>
            <div>
              경매 기간 : {data && dateFormat(data.startedAt)}&nbsp;~&nbsp;
              {data && dateFormat(data.finishedAt)}
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
                  text={"입찰 내역 보기"}
                  size={"full"}
                  onClick={onClickBidList}
                ></CustomButton>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between space-x-2 p-2">
                {new Date() >= new Date(data && data.finishedAt) ? (
                  mybid &&
                  data &&
                  data.transactionState !== "판매완료" &&
                  mybid.bidder === data.buyer ? (
                    <CustomButton
                      text={"구매 확정 하기"}
                      size={"full"}
                      onClick={() => {
                        setBidderModal(true);
                        setConfirmation(true);
                      }}
                    ></CustomButton>
                  ) : data && data.transactionState === "판매완료" ? (
                    <CustomButton
                      text={"판매완료"}
                      size={"full"}
                      disabled={true}
                      color={"bg-gray-500"}
                    ></CustomButton>
                  ) : (
                    <CustomButton
                      text={"입찰종료"}
                      size={"full"}
                      disabled={true}
                      color={"bg-gray-500"}
                    ></CustomButton>
                  )
                ) : new Date() >= new Date(data && data.startedAt) ? (
                  <CustomButton
                    text={"입찰하기"}
                    size={"full"}
                    onClick={() => {
                      if (localStorage.getItem("loginToken")) {
                        setBidPrice(highestBid ? highestBid : 0);
                        setBidderModal(true);
                      } else {
                        if (
                          window.confirm(
                            "로그인 후 이용가능합니다.\n로그인 하시겠습니까?"
                          )
                        ) {
                          movePage("/sign-in");
                        }
                      }
                    }}
                  ></CustomButton>
                ) : (
                  <CustomButton
                    text={"입찰 시작 대기"}
                    size={"full"}
                    disabled={true}
                    color={"bg-gray-500"}
                  ></CustomButton>
                )}
              </div>
            )}
          </div>
        </div>
        <hr className="w-full"></hr>
        <div className="w-[1000px] p-2 whitespace-pre text-left">
          <div className="text-wrap">{data && data.content}</div>
        </div>
      </div>
      {bidListModal && (
        <div className="fixed left-0 top-0 w-screen h-screen  z-50 flex items-center justify-center">
          <div
            className="w-full h-full absolute left-0 top-0 bg-gray-600 opacity-50"
            onClick={() => setBidListModal(false)}
          ></div>
          <div className="absolute w-auto min-h-96 h-auto bg-white rounded-lg flex flex-col">
            <div className="h-8 w-full">
              <div className=" h-full text-lg font-bold flex items-center justify-center border-b-2">
                입찰 목록
              </div>
            </div>
            <div className="w-full h-80 overflow-y-auto">
              <div className="flex items-center justify-center">
                <div className="w-20">{"닉네임"}</div>
                <div className="w-20">{"입찰가"}</div>
                <div className="w-12">{"상태"}</div>
                <div className="w-32">{"요청일"}</div>
                <div className="w-32">{"수정일"}</div>
              </div>

              {receiveBuyRequestData && receiveBuyRequestData.length > 0 ? (
                receiveBuyRequestData.map((item, index) => (
                  <div
                    key={index}
                    className="h-auto  flex flex-col text-sm  justify-center"
                  >
                    <div className="flex flex-col">
                      <div>
                        <div className="flex items-center justify-center">
                          <div title={item.bidderNickname} className="w-20">
                            {item.bidderNickname}
                          </div>
                          <div title={item.auctionBidState} className="w-20">
                            {item.price}
                          </div>
                          <div title={item.auctionBidState} className="w-12">
                            {item.auctionBidState}
                          </div>
                          <div
                            title={dateFormat(item.createdAt)}
                            className="w-32"
                          >
                            {dateFormat(item.createdAt)}
                          </div>
                          <div
                            title={dateFormat(item.updatedAt)}
                            className="w-32"
                          >
                            {dateFormat(item.updatedAt)}
                          </div>
                        </div>
                        {data &&
                        data.transactionState === "판매중" &&
                        item.auctionBidState === "입찰" ? (
                          <CustomButton
                            text={deadLine ? "거래" : "입찰진행중"}
                            onClick={() =>
                              deadLine
                                ? onClickTrade(item)
                                : alert("입찰 진행중입니다.")
                            }
                          ></CustomButton>
                        ) : data.transactionState === "거래중" &&
                          item.auctionBidState === "대기" &&
                          data.buyer === item.bidder ? (
                          <CustomButton
                            text={"취소"}
                            onClick={() => onClickTradeCancel(item)}
                          ></CustomButton>
                        ) : (
                          <div className="h-7"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-20 flex items-center justify-center">
                  입찰 내역이 없습니다.
                </div>
              )}
            </div>
            <div className="m-2">
              <CustomButton
                text={"닫기"}
                onClick={() => setBidListModal(false)}
              ></CustomButton>
            </div>
          </div>
        </div>
      )}
      {bidderModal && (
        <div className="fixed left-0 top-0 w-screen h-screen  z-50 flex items-center justify-center">
          <div
            className="w-full h-full absolute left-0 top-0 bg-gray-600 opacity-50"
            onClick={() => setBidderModal(false)}
          ></div>
          <div className="absolute w-96 h-60 bg-white rounded-lg flex flex-col">
            <div className="h-8 w-full">
              <div className=" h-full text-lg font-bold flex items-center justify-center border-b-2">
                {confirmation ? "구매 확정" : "입찰"}
              </div>
            </div>
            <div className="w-full h-40">
              <div className="h-full flex flex-col justify-center p-2 space-y-2">
                {confirmation ? (
                  <div className="flex text-lg font-bold">
                    <div className="">나의 입찰 가격&nbsp;:&nbsp;</div>
                    <div>
                      {Number(
                        mybid && mybid.price ? mybid.price : 0
                      ).toLocaleString()}
                      원
                    </div>
                  </div>
                ) : (
                  <div className="flex text-lg font-bold">
                    <div className="">현재 최고가&nbsp;:&nbsp;</div>
                    <div>{Number(highestBid).toLocaleString()}원</div>
                  </div>
                )}
                {confirmation ? (
                  <></>
                ) : (
                  <div>
                    <div className="flex">입찰하실 금액을 입력하세요</div>
                    <CustomInput
                      ref={bidPriceRef}
                      type={"number"}
                      value={bidPrice}
                      onChange={(e) => {
                        setBidPrice(e.target.value);
                      }}
                    ></CustomInput>
                  </div>
                )}
              </div>
            </div>
            <div className="flex m-2 items-center justify-center space-x-2">
              {confirmation ? (
                <div className="space-x-2">
                  <CustomButton
                    text={"구매확정"}
                    onClick={() => onClickTradeApprove(mybid)}
                  ></CustomButton>
                  <CustomButton
                    text={"거래취소"}
                    onClick={() => onClickTradeCancel(mybid)}
                  ></CustomButton>
                </div>
              ) : (
                <CustomButton
                  text={"입찰"}
                  onClick={onClickBidding}
                ></CustomButton>
              )}
              <CustomButton
                text={"닫기"}
                onClick={() => setBidderModal(false)}
              ></CustomButton>
            </div>
          </div>
        </div>
      )}
    </Layouts>
  );
}

export default AuctionTransaction;
