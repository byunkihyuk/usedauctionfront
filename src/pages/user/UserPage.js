import { useEffect, useRef, useState } from "react";
import CustomButton from "../../components/CustomButton";
import Layouts from "../../components/Layout";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading";
import CustomInput from "../../components/CustomInput";

function UserPage() {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({});
  const [chargingModal, setChargingModal] = useState(false);
  const movePage = useNavigate();
  const inputMoneyChargingRef = useRef(null);
  const [moneyCharging, setMoneyCharging] = useState(0);
  const [author, setAuthor] = useState(false);
  const userId = searchParams.get("user-id");

  useEffect(() => {
    let url;
    if (userId == null) {
      if (!localStorage.getItem("loginToken")) {
        alert("로그인 후 이용 가능합니다");
        movePage("/sign-in");
        return;
      }
      url = `${process.env.REACT_APP_CLIENT_IP}/api/user`;
    } else {
      url = `${process.env.REACT_APP_CLIENT_IP}/api/user?user-id=${userId}`;
    }
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(true);
        if (res.status === "success") {
          setData(res.data);
          setAuthor(res.data.author); // 수정
        } else {
          setAuthor(false);
          alert(res.message);
          movePage(-1);
        }
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  function onChangeMoneyCharging(e) {
    setMoneyCharging(e.target.value);
  }

  function onClickMoneyHistory() {
    movePage(`/pay/${data.userId}`);
  }

  function onClickUpdateInfo() {
    movePage(`/mypageupdate`, {
      state: {
        userId: data.userId,
      },
    });
  }

  function onClickMoneyCharging() {
    if (!moneyCharging || moneyCharging < 1000) {
      alert("1000원 이상 충전 가능합니다.");
      return;
    }
    const { IMP } = window;
    if (IMP) {
      IMP.init("imp53423207");
      IMP.request_pay(
        {
          pg: "html5_inicis", // PG사
          pay_method: "card",
          amount: moneyCharging,
          buyer_name: "홍길동",
          name: "결제테스트",
        },
        function (response) {
          //결제 후 호출되는 callback함수
          setChargingModal(false);
          if (response.success) {
            //결제 성공
            console.log(response);
            fetch(`${process.env.REACT_APP_CLIENT_IP}/api/pay/charging`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                transactionRequestTyep: "충전",
                transactionMoney: response.paid_amount,
                transactionRequestState: "승인",
                usedTransactionType: "입출금",
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.status === "success") {
                  alert("충전 완료");
                } else {
                  alert(res.message);
                }
              })
              .error((error) => console.log(error));
          } else {
            alert("결제실패 : " + response.error_msg);
          }
        }
      );
    }
  }

  return (
    <Layouts>
      {loading && <Loading></Loading>}
      <div className=" w-[600px] min-h-[600px] h-auto rounded-lg p-5 border-2 border-gray-200 flex flex-col items-center justify-center space-y-5">
        <div className="w-80 min-h-40 flex flex-col items-center justify-center space-y-5">
          {author && (
            <div className="w-full flex space-x-5">
              <div className="w-20 flex items-center justify-end">이메일</div>
              <div className="w-60 flex items-center justify-start">
                {data.username}
              </div>
            </div>
          )}
          <div className="w-full flex space-x-5">
            <div className="w-20 flex items-center justify-end">닉네임</div>
            <div className="w-60 flex items-center justify-start">
              {data.nickname}
            </div>
          </div>
          {author && (
            <div className="w-full flex space-x-5">
              <div className="w-20 flex items-center justify-end">주소</div>
              <div className="w-60 flex items-center justify-start">
                {data.address}&nbsp;
                {data.detailAddress}
              </div>
            </div>
          )}
          {author && (
            <div className="w-full flex space-x-5">
              <div className="w-20 flex items-center justify-end">머니</div>
              <div className="w-60 flex items-center justify-start">
                {data.money ? data.money.toLocaleString() : 0}원
              </div>
            </div>
          )}
          {author && (
            <div className="flex space-x-1">
              <CustomButton
                text={"충전"}
                size={"lg"}
                onClick={() => setChargingModal(true)}
              ></CustomButton>
              <CustomButton
                text={"정보 수정"}
                size={"lg"}
                onClick={onClickUpdateInfo}
              ></CustomButton>
            </div>
          )}
        </div>
        <div className="w-[80%] flex flex-col items-center justify-center">
          {author && (
            <div className="w-full h-10 flex items-center justify-start border-b-2">
              웹머니
            </div>
          )}
          {author && (
            <div
              className="w-full h-10 flex items-center justify-start text-sm px-5 text-gray-600  border-b-2 cursor-pointer  hover:border-purple-200"
              onClick={onClickMoneyHistory}
            >
              머니 거래 내역
            </div>
          )}
          <div className="w-full h-10 flex items-center justify-start border-b-2">
            중고 거래
          </div>
          {/* {author && (
                        <div
                            className="w-full h-10 flex items-center justify-start text-sm px-5 text-gray-600  border-b-2 cursor-pointer  hover:border-purple-200"
                            onClick={() =>
                                movePage(`/user/${data.userId}/general/send-buy-request`)
                            }
                        >
                            중고 거래 보낸 구매 요청 관리
                        </div>
                    )}
                    {author && (
                        <div
                            className="w-full h-10 flex items-center justify-start text-sm px-5 text-gray-600  border-b-2 cursor-pointer  hover:border-purple-200"
                            onClick={() =>
                                movePage(`/user/${data.userId}/general/receive-buy-request`)
                            }
                        >
                            중고 거래 받은 구매 요청 관리
                        </div>
                    )} */}
          {author && (
            <div
              className="w-full h-10 flex items-center justify-start text-sm px-5 text-gray-600  border-b-2 cursor-pointer  hover:border-purple-200"
              onClick={() =>
                movePage(`/user/${data.userId}/general-buy-history`)
              }
            >
              중고 거래 구매 내역
            </div>
          )}
          <div
            className="w-full h-10 flex items-center justify-start text-sm px-5 text-gray-600  border-b-2 cursor-pointer hover:drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] hover:shadow-purple-200"
            onClick={() =>
              movePage(
                `/user/${userId ? userId : data.userId}/general-sell-history`
              )
            }
          >
            중고 거래 판매 내역
          </div>
        </div>
        <div className="w-[80%] flex flex-col items-center justify-center">
          <div className="w-full h-10 flex items-center justify-start border-b-2">
            경매 거래
          </div>
          {author && (
            <div
              className="w-full h-10 flex items-center justify-start text-sm px-5 text-gray-600  border-b-2 cursor-pointer  hover:border-purple-200"
              onClick={() => movePage(`/user/${data.userId}/bid-history`)}
            >
              경매 입찰 내역
            </div>
          )}
          <div
            className="w-full h-10 flex items-center justify-start text-sm px-5 text-gray-600  border-b-2 cursor-pointer  hover:border-purple-200"
            onClick={() => movePage(`/user/${data.userId}/auction-buy-history`)}
          >
            경매 거래 구매 내역
          </div>
          {author && (
            <div
              className="w-full h-10 flex items-center justify-start text-sm px-5 text-gray-600  border-b-2 cursor-pointer hover:drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] hover:shadow-purple-200"
              onClick={() =>
                movePage(
                  `/user/${userId ? userId : data.userId}/auction-sell-history`
                )
              }
            >
              경매 거래 판매 내역
            </div>
          )}
        </div>
      </div>
      {author && chargingModal && (
        <div className="fixed w-full h-full z-50 left-0 top-0 flex items-center justify-center">
          <div
            className="absolute w-full h-full opacity-50 bg-gray-600"
            onClick={() => setChargingModal(false)}
          ></div>
          <div className="absolute bg-white w-80 h-40 rounded-lg flex flex-col items-center justify-center space-y-5">
            <div className="flex flex-col">
              <div className="flex space-x-2 items-center justify-center">
                <div>충전 금액</div>
                <div>
                  <CustomInput
                    ref={inputMoneyChargingRef}
                    type={"number"}
                    onChange={onChangeMoneyCharging}
                    placeholder={"금액을 입력하세요"}
                    value={moneyCharging}
                  ></CustomInput>
                </div>
              </div>
            </div>
            <div className="space-x-1">
              <CustomButton
                text={"충전하기"}
                onClick={onClickMoneyCharging}
              ></CustomButton>
              <CustomButton
                text={"닫기"}
                onClick={() => setChargingModal(false)}
              ></CustomButton>
            </div>
          </div>
        </div>
      )}
    </Layouts>
  );
}

export default UserPage;
