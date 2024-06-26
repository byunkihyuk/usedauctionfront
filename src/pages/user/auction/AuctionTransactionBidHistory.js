import { useEffect, useRef, useState } from "react";
import Layouts from "../../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";

function AuctionTransactionBidHistory() {
    const { userId } = useParams();
    const [loading, setLoading] = useState(false);
    const [updateBidModal, setUpdateBidModal] = useState(false);
    const [updateBid, setUpdateBid] = useState(null);
    const [updatePrice, setUpdatePrice] = useState(0);
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
        loadData();
    }, []);

    function loadData() {
        setLoading(true);
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/auction/bid/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    setData(res.data);
                    setPagination(res.data);
                } else {
                    alert(res.message);
                    movePage(-1);
                }
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }

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

        if (ps < pe) {
            for (var i = ps; i <= pe; i++) {
                arr[i - 1] = i;
            }
        } else {
            arr = [1];
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
            setTdata(
                tdata.sort(function (a, b) {
                    return a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
                })
            );
            setSort(true);
            setPrevColumn(column);
            return;
        }
        if (sort) {
            setTdata(
                tdata.sort(function (a, b) {
                    return a[column] > b[column] ? -1 : a[column] < b[column] ? 1 : 0;
                })
            );
            setSort(false);
        } else {
            setTdata(
                tdata.sort(function (a, b) {
                    return a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
                })
            );
            setSort(true);
        }
    }

    function onClickBidCancel(item) {
        if (window.confirm("입찰을 취소하시겠습니까?")) {
            fetch(`${process.env.REACT_APP_CLIENT_IP}/api/auction/bid/cancel`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    auctionBidId: item.auctionBidId,
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

    function onClickUpdateModal(item) {
        setUpdateBidModal(true);
        setUpdatePrice(item.price);
        setUpdateBid(item);
    }
    function onClickUpdateBid() {
        if (updatePrice > 0) {
            fetch(`${process.env.REACT_APP_CLIENT_IP}/api/auction/bid`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    auctionBidId: updateBid.auctionBidId,
                    price: updatePrice,
                    auctionTransactionId: updateBid.auctionTransactionId,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === "success") {
                        setUpdateBidModal(false);
                        loadData();
                    } else {
                        alert(res.message);
                    }
                })
                .catch((error) => console.log);
        }
    }

    return (
        <Layouts>
            {loading && <Loading></Loading>}
            <div className="space-y-2 relative mobile:p-2">
                <div className="text-lg font-bold text-left border-b-2">내 경매 입찰 내역</div>
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
                                    tableSort("auctionBidId");
                                }}
                            >
                                번호{prevColumn === "auctionBidId" ? (sort ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("price");
                                }}
                            >
                                가격{prevColumn === "price" ? (sort ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("auctionBidState");
                                }}
                            >
                                입찰상태{prevColumn === "auctionBidState" ? (sort ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("auctionTransactionId");
                                }}
                            >
                                경매 글
                                {prevColumn === "auctionTransactionId" ? (sort ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("createdAt");
                                }}
                            >
                                입찰시간
                                {prevColumn === "createdAt" ? (sort ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="border p-1 cursor-pointer"
                                onClick={() => {
                                    tableSort("updatedAt");
                                }}
                            >
                                수정시간
                                {prevColumn === "updatedAt" ? (sort ? "▲" : "▼") : ""}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {vdata && vdata.length > 0 ? (
                            vdata.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-1">{item.auctionBidId}</td>
                                    <td className="border p-1">{item.price}</td>
                                    <td className="border p-1">
                                        {item.auctionBidState}
                                        <div className="flex space-x-1">
                                            {item.auctionBidState === "입찰" ? (
                                                <CustomButton
                                                    size={"full"}
                                                    onClick={() => onClickUpdateModal(item)}
                                                    text={"수정"}
                                                ></CustomButton>
                                            ) : (
                                                <></>
                                            )}
                                            {item.auctionBidState === "입찰" ? (
                                                <CustomButton
                                                    size={"full"}
                                                    onClick={() => {
                                                        onClickBidCancel(item);
                                                    }}
                                                    text={"취소"}
                                                ></CustomButton>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </td>
                                    <td
                                        className="border p-1 cursor-pointer"
                                        onClick={() =>
                                            movePage(`/auction/${item.auctionTransactionId}`)
                                        }
                                    >
                                        {item.auctionTransactionId}
                                    </td>
                                    <td className="border p-1">{dateFormat(item.createdAt)}</td>
                                    <td className="border p-1">{dateFormat(item.updatedAt)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>내역이 없습니다</td>
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
            {updateBidModal && (
                <div className="fixed left-0 top-0 flex items-center justify-center z-50">
                    <div
                        className="w-screen h-screen bg-gray-600 opacity-50"
                        onClick={() => {
                            setUpdateBidModal(false);
                            setUpdateBid(null);
                            setUpdatePrice(0);
                        }}
                    ></div>
                    <div className="absolute w-80 h-40 bg-white rounded-lg p-2 space-y-5">
                        <div className="text-lg font-bold">입찰 금액 수정</div>
                        <CustomInput
                            placeholder={"입찰 금액 입력"}
                            type={"number"}
                            value={updatePrice}
                            onChange={(e) => setUpdatePrice(e.target.value)}
                        ></CustomInput>
                        <div className="flex items-center justify-center space-x-2">
                            <CustomButton
                                text={"수정"}
                                onClick={onClickUpdateBid}
                                size={"full"}
                            ></CustomButton>
                            <CustomButton
                                text={"닫기"}
                                size={"full"}
                                onClick={() => {
                                    setUpdateBidModal(false);
                                    setUpdateBid(null);
                                    setUpdatePrice(0);
                                }}
                            ></CustomButton>
                        </div>
                    </div>
                </div>
            )}
        </Layouts>
    );
}

export default AuctionTransactionBidHistory;
