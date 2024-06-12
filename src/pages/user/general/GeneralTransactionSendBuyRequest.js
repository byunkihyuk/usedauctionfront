import { useEffect, useRef, useState } from "react";
import CustomInput from "../../../components/CustomInput";
import Layouts from "../../../components/Layout";
import Loading from "../../../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";

function GeneralTransactionSendBuyRequest() {
    const { userId } = useParams();
    const [loading, setLoading] = useState(false);
    const movePage = useNavigate();
    const [data, setData] = useState(null);
    const [tdata, setTdata] = useState(null);
    const [vdata, setVdata] = useState(null);

    const viewCount = 10;
    const [keyWord, setKeyWord] = useState("");
    const keyWordRef = useRef(null);

    const viewPage = 10;
    const [totalPage, setTotalPage] = useState(1);
    const [pages, setPages] = useState([1]);
    const [page, setPage] = useState(1);
    const [pageStart, setPageStart] = useState(0);
    const [pageEnd, setPageEnd] = useState(0);

    const [sort, setSort] = useState(false);
    const [prevColumn, setPrevColumn] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("loginToken")) {
            alert("로그인 후 이용 가능합니다.");
            movePage("/sign-in");
        }
        setLoading(true);
        // fetch(`/api/user/${userId}/general-send-buy-request`
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/pay/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    setData(res.data);
                    //tableCreate(res.data);
                } else {
                    alert(res.message);
                }
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }, []);

    function setPagination(tableData) {
        let filterData = null;
        let totalCount = tableData.length;
        let totalPage2 = Math.floor(totalCount / viewCount) + (totalCount % viewCount > 0 ? 1 : 0);
        let start = (page - 1) * viewCount;
        let end = start + viewCount <= totalCount ? start + viewCount : totalCount;

        setTotalPage(totalPage2);

        if (tableData) {
            filterData = tableData.filter((item, index) => {
                if (index >= start && end > index) {
                    return true;
                } else {
                    return false;
                }
            });
        }

        let arr = [];
        let ps = Math.floor((page - 1) / viewPage) * viewPage + 1;
        let pe =
            Math.floor((page - 1) / viewPage) * viewPage + viewPage > totalPage2
                ? totalPage2
                : Math.floor((page - 1) / viewPage) + viewPage;
        setPageStart(ps);
        setPageEnd(pe);

        for (var i = ps; i <= pe; i++) {
            arr[i - 1] = i;
        }

        setPages(arr);
        setTdata(tableData);
        setVdata(filterData);
    }

    useEffect(() => {
        if (data) {
            if (keyWord === "") {
                setPage(1);
                setPagination(data);
            } else {
                let filterData = data.filter((item) => {
                    if (item.payInfoId != null && item.payInfoId.toString().includes(keyWord)) {
                        return true;
                    }
                    if (item.seller != null && item.seller.toString().includes(keyWord)) {
                        return true;
                    }
                    if (item.buyer != null && item.buyer.toString().includes(keyWord)) {
                        return true;
                    }
                    if (
                        item.transactionRequestType != null &&
                        item.transactionRequestType.toString().includes(keyWord)
                    ) {
                        return true;
                    }
                    if (
                        item.transactionRequestState != null &&
                        item.transactionRequestState.toString().includes(keyWord)
                    ) {
                        return true;
                    }
                    if (
                        item.transactionMoney != null &&
                        item.transactionMoney.toString().includes(keyWord)
                    ) {
                        return true;
                    }
                    if (
                        item.usedTransactionType != null &&
                        item.usedTransactionType.toString().includes(keyWord)
                    ) {
                        return true;
                    }
                    if (
                        item.generalTransactionId != null &&
                        item.generalTransactionId.toString().includes(keyWord)
                    ) {
                        return true;
                    }
                    if (
                        item.auctionTransactionId != null &&
                        item.auctionTransactionId.toString().includes(keyWord)
                    ) {
                        return true;
                    }
                    if (
                        item.transactionTime != null &&
                        item.transactionTime.toString().includes(keyWord)
                    ) {
                        return true;
                    }
                    if (
                        item.transactionUpdateTime != null &&
                        item.transactionUpdateTime.toString().includes(keyWord)
                    ) {
                        return true;
                    }
                    return false;
                });

                setPagination(filterData);
            }
        }
    }, [keyWord]);

    useEffect(() => {
        if (data) {
            setPagination(data);
        }
    }, [data, viewCount, page]);

    function dateFormat(createdAt) {
        let now = new Date(createdAt);
        let nowYear = now.getYear() >= 100 ? now.getYear() - 100 : now.getYear();
        let nowMonth = now.getMonth() + 1;
        let nowDay = now.getDate();
        let nowHours = now.getHours();
        let nowMinutes = now.getMinutes();
        if (nowHours - 12 < 0) {
            return (
                nowYear + "-" + nowMonth + "-" + nowDay + " " + nowHours + ":" + nowMinutes + "AM"
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

    function tableSort(column) {
        if (prevColumn !== column) {
            setPagination(
                tdata.sort(function (a, b) {
                    return a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
                })
            );
            setSort(true);
            setPrevColumn(column);
            return;
        }
        if (sort) {
            setPagination(
                tdata.sort(function (a, b) {
                    return a[column] > b[column] ? -1 : a[column] < b[column] ? 1 : 0;
                })
            );
            setSort(false);
        } else {
            setPagination(
                tdata.sort(function (a, b) {
                    return a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
                })
            );
            setSort(true);
        }
    }

    function onClickRequestStateCancle(item) {
        if (window.confirm("구매 요청을 취소하시겠습니까?")) {
            fetch(`${process.env.REACT_APP_CLIENT_IP}/api/pay/general/cancel`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    payInfoId: item.payInfoId,
                    seller: item.seller,
                    buyer: item.buyer,
                    transactionRequestType: item.transactionRequestType,
                    transactionMoney: item.transactionMoney,
                    transactionRequestState: "취소",
                    usedTransactionType: item.usedTransactionType,
                    generalTransactionId: item.generalTransactionId,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === "success") {
                        window.location.reload();
                    } else {
                        alert(res.message);
                    }
                })
                .catch((error) => console.log(error));
        }
    }

    function onClickRequestStateApprove(item) {
        if (window.confirm("구매를 확정하시겠습니까?")) {
            fetch(`${process.env.REACT_APP_CLIENT_IP}/api/pay/general/progress`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    payInfoId: item.payInfoId,
                    seller: item.seller,
                    buyer: item.buyer,
                    transactionRequestType: item.transactionRequestType,
                    transactionMoney: item.transactionMoney,
                    transactionRequestState: "승인",
                    usedTransactionType: item.usedTransactionType,
                    generalTransactionId: item.generalTransactionId,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === "success") {
                        window.location.reload();
                    } else {
                        alert(res.message);
                    }
                })
                .catch((error) => console.log(error));
        }
    }

    return (
        <Layouts>
            {loading && <Loading></Loading>}
            <div className="space-y-2 relative">
                <div className="text-lg font-bold text-left border-b-2">보낸 구매 요청</div>
                <div className="w-full flex items-center justify-end">
                    <div className="w-48">
                        <CustomInput
                            size={"sm"}
                            placeholder={"검색어를 입력하세요"}
                            ref={keyWordRef}
                            value={keyWord}
                            onChange={(e) => setKeyWord(e.target.value)}
                        ></CustomInput>
                    </div>
                </div>
                <table className="">
                    <thead>
                        <tr>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("payInfoId");
                                }}
                            >
                                번호{prevColumn === "payInfoId" ? (sort ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("seller");
                                }}
                            >
                                판매자{prevColumn === "seller" ? (sort ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("transactionRequestState");
                                }}
                            >
                                현재 상태
                                {prevColumn === "transactionRequestState" ? (sort ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("transactionMoney");
                                }}
                            >
                                거래 금액
                                {prevColumn === "transactionMoney" ? (sort ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("generalTransactionId");
                                }}
                            >
                                중고 글
                                {prevColumn === "generalTransactionId" ? (sort ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("transactionTime");
                                }}
                            >
                                거래일{prevColumn === "transactionTime" ? (sort ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("transactionUpdateTime");
                                }}
                            >
                                최종 수정일
                                {prevColumn === "transactionUpdateTime" ? (sort ? "▲" : "▼") : ""}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {vdata && vdata.length > 0 ? (
                            vdata.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-1">{item.payInfoId}</td>
                                    <td className="border p-1">{item.seller}</td>
                                    <td className="border p-1">
                                        {item.transactionRequestState}
                                        {item.transactionRequestType === "결제" &&
                                        item.usedTransactionType === "일반 거래 글" &&
                                        (item.transactionRequestState === "대기" ||
                                            item.transactionRequestState === "거래중") ? (
                                            <CustomButton
                                                size={"full"}
                                                onClick={() => onClickRequestStateCancle(item)}
                                                text={"취소"}
                                            ></CustomButton>
                                        ) : (
                                            <></>
                                        )}
                                        {item.transactionRequestType === "결제" &&
                                        item.usedTransactionType === "일반 거래 글" &&
                                        item.transactionRequestState === "거래중" ? (
                                            <CustomButton
                                                size={"full"}
                                                onClick={() => onClickRequestStateApprove(item)}
                                                text={"구매확정"}
                                            ></CustomButton>
                                        ) : (
                                            <></>
                                        )}
                                    </td>
                                    <td className="border p-1">{item.transactionMoney}</td>
                                    <td className="border p-1">{item.generalTransactionId}</td>
                                    <td className="border p-1">
                                        {dateFormat(item.transactionTime)}
                                    </td>
                                    <td className="border p-1">
                                        {dateFormat(item.transactionUpdateTime)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10}>값이 없습니다</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex items-center justify-center">
                    <div
                        className={`w-10 h-10 flex items-center justify-center  ${
                            page > 1 ? "cursor-pointer hover:bg-purple-100" : " text-gray-400"
                        }`}
                        onClick={() => {
                            if (page > 1) {
                                setPage(1);
                            }
                        }}
                    >
                        {"<<"}
                    </div>
                    <div
                        className={`w-10 h-10 flex items-center justify-center ${
                            pageStart - viewPage >= 0
                                ? "cursor-pointer hover:bg-purple-100"
                                : " text-gray-400"
                        }`}
                        onClick={() => {
                            if (pageStart - viewPage >= 0) {
                                setPage(pageStart - 1);
                            }
                        }}
                    >
                        {"<"}
                    </div>
                    {pages.map((item, index) => (
                        <div
                            key={index}
                            className={`w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-purple-100 ${
                                page === item ? "bg-purple-300" : ""
                            }`}
                            onClick={() => {
                                if (page !== item) {
                                    setPage(item);
                                }
                            }}
                        >
                            {item}
                        </div>
                    ))}
                    <div
                        className={`w-10 h-10 flex items-center justify-center ${
                            totalPage > pageEnd
                                ? "cursor-pointer hover:bg-purple-100"
                                : " text-gray-400"
                        }`}
                        onClick={() => {
                            if (totalPage > pageEnd) {
                                setPage(pageEnd + 1);
                            }
                        }}
                    >
                        {">"}
                    </div>
                    <div
                        className={`w-10 h-10 flex items-center justify-center ${
                            page !== totalPage
                                ? "cursor-pointer hover:bg-purple-100"
                                : " text-gray-400"
                        }`}
                        onClick={() => {
                            if (page !== totalPage) {
                                setPage(totalPage);
                            }
                        }}
                    >
                        {">>"}
                    </div>
                </div>
            </div>
        </Layouts>
    );
}

export default GeneralTransactionSendBuyRequest;
