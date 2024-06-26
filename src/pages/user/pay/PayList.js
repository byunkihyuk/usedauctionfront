import { useEffect, useRef, useState } from "react";
import Layouts from "../../../components/Layout";
import Loading from "../../../components/Loading";
import $ from "jquery";
import "datatables.net-responsive-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "../../../components/CustomInput";

function PayList() {
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
        // axios
        //     .get("/api/pay/1")
        //     .then((res) => {
        //         if (res.data.status === "success") {
        //             setData(res.data.data);
        //         }
        //         setLoading(false);
        //     })
        //     .catch((error) => console.log(error));
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/pay/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setLoading(true);
                if (res.status === "success") {
                    setData(res.data);
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
        let nowYear = now.getFullYear();
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

    return (
        <Layouts>
            {loading && <Loading></Loading>}
            <div className="space-y-2 mobile:p-2">
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
                <div className="mobile:w-96 overflow-auto">
                    <table className="w-[1000px]">
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
                                        tableSort("buyer");
                                    }}
                                >
                                    구매자{prevColumn === "buyer" ? (sort ? "▲" : "▼") : ""}
                                </th>
                                <th
                                    className="border p-1 cursor-pointer"
                                    onClick={() => {
                                        tableSort("transactionRequestType");
                                    }}
                                >
                                    거래 종류
                                    {prevColumn === "transactionRequestType"
                                        ? sort
                                            ? "▲"
                                            : "▼"
                                        : ""}
                                </th>
                                <th
                                    className="border p-1 cursor-pointer"
                                    onClick={() => {
                                        tableSort("transactionRequestState");
                                    }}
                                >
                                    현재 상태
                                    {prevColumn === "transactionRequestState"
                                        ? sort
                                            ? "▲"
                                            : "▼"
                                        : ""}
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
                                        tableSort("usedTransactionType");
                                    }}
                                >
                                    거래 타입
                                    {prevColumn === "usedTransactionType" ? (sort ? "▲" : "▼") : ""}
                                </th>
                                <th
                                    className="border p-1 cursor-pointer"
                                    onClick={() => {
                                        tableSort("generalTransactionId");
                                    }}
                                >
                                    중고 글
                                    {prevColumn === "generalTransactionId"
                                        ? sort
                                            ? "▲"
                                            : "▼"
                                        : ""}
                                </th>
                                <th
                                    className="border p-1 cursor-pointer"
                                    onClick={() => {
                                        tableSort("auctionTransactionId");
                                    }}
                                >
                                    경매 글
                                    {prevColumn === "auctionTransactionId"
                                        ? sort
                                            ? "▲"
                                            : "▼"
                                        : ""}
                                </th>
                                <th
                                    className="border p-1 cursor-pointer"
                                    onClick={() => {
                                        tableSort("transactionTime");
                                    }}
                                >
                                    거래일
                                    {prevColumn === "transactionTime" ? (sort ? "▲" : "▼") : ""}
                                </th>
                                <th
                                    className="border p-1 cursor-pointer"
                                    onClick={() => {
                                        tableSort("transactionUpdateTime");
                                    }}
                                >
                                    최종 수정일
                                    {prevColumn === "transactionUpdateTime"
                                        ? sort
                                            ? "▲"
                                            : "▼"
                                        : ""}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {vdata && vdata.length > 0 ? (
                                vdata.map((item, index) => (
                                    <tr key={index} className="text-sm">
                                        <td className="border p-1">{item.payInfoId}</td>
                                        <td
                                            className={`border p-1 ${
                                                item.seller ? "cursor-pointer" : ""
                                            }`}
                                            onClick={() => {
                                                if (item.seller)
                                                    movePage(`/user?user-id=${item.seller}`);
                                            }}
                                        >
                                            {item.sellerNickname}
                                        </td>
                                        <td
                                            className={`border p-1 ${
                                                item.buyer ? "cursor-pointer" : ""
                                            }`}
                                            onClick={() => {
                                                if (item.buyer)
                                                    movePage(`/user?user-id=${item.buyer}`);
                                            }}
                                        >
                                            {item.buyerNickname}
                                        </td>
                                        <td className="border p-1">
                                            {item.transactionRequestType}
                                        </td>
                                        <td className="border p-1">
                                            {item.transactionRequestState}
                                        </td>
                                        <td className="border p-1">{item.transactionMoney}</td>
                                        <td className="border p-1">{item.usedTransactionType}</td>
                                        <td
                                            className={`border p-1 ${
                                                item.generalTransactionId ? "cursor-pointer" : ""
                                            }`}
                                            onClick={() => {
                                                if (item.generalTransactionId)
                                                    movePage(
                                                        `/general/${item.generalTransactionId}`
                                                    );
                                            }}
                                        >
                                            {item.generalTransactionId}
                                        </td>
                                        <td
                                            className={`border p-1 ${
                                                item.auctionTransactionId ? "cursor-pointer" : ""
                                            }`}
                                            onClick={() => {
                                                if (item.auctionTransactionId)
                                                    movePage(
                                                        `/auction/${item.auctionTransactionId}`
                                                    );
                                            }}
                                        >
                                            {item.auctionTransactionId}
                                        </td>
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
                                    <td className="col-span-11">값이 없습니다</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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

export default PayList;

////
// const movePage = useNavigate();
// const [loading, setLoading] = useState(false);
// const [data, setData] = useState(null);
// const tableRef = useRef(null);
// const { userId } = useParams();

// const columns = [
//     { title: "번호" },
//     { title: "판매자" },
//     { title: "구매자" },
//     { title: "거래 요청 상태" },
//     { title: "현재 상태" },
//     { title: "거래 금액" },
//     { title: "거래 타입" },
//     { title: "중고 글" },
//     { title: "경매 글" },
//     { title: "거래일" },
//     { title: "최종 수정일" },
// ];

// useEffect(() => {
//     if (!localStorage.getItem("loginToken")) {
//         alert("로그인 후 이용 가능합니다.");
//         movePage("/sign-in");
//     }
//     setLoading(true);
//     // axios
//     //     .get("/api/pay/1")
//     //     .then((res) => {
//     //         if (res.data.status === "success") {
//     //             setData(res.data.data);
//     //         }
//     //         setLoading(false);
//     //     })
//     //     .catch((error) => console.log(error));
//     fetch(`/api/pay/${userId}`, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
//         },
//     })
//         .then((res) => res.json())
//         .then((res) => {
//             if (res.status === "success") {
//                 setData(res.data);
//                 //tableCreate(res.data);
//             } else {
//                 alert(res.message);
//             }
//             setLoading(false);
//         })
//         .catch((error) => console.log(error));
// }, []);

// useEffect(() => {
//     let tdata = [];
//     if (data) {
//         data.map(
//             (data, index) =>
//                 (tdata = [
//                     ...tdata,
//                     [
//                         data.payInfoId,
//                         data.seller,
//                         data.buyer,
//                         data.transactionRequestType,
//                         data.transactionRequestState,
//                         data.transactionMoney,
//                         data.usedTransactionType,
//                         data.generalTransactionId,
//                         data.auctionTransactionId,
//                         dateFormat(data.transactionTime),
//                         dateFormat(data.transactionUpdateTime),
//                     ],
//                 ])
//         );

//         const table = $(tableRef.current).DataTable({
//             data: tdata,
//             columns: columns,
//             responsive: true,
//             paging: true,
//             searching: true,
//         });
//         return () => {
//             table.destroy();
//         };
//     }
// }, [data]);

// // function tableCreate(tableData) {}

// function dateFormat(createdAt) {
//     let now = new Date(createdAt);
//     let nowYear = now.getFullYear();
//     let nowMonth = now.getMonth() + 1;
//     let nowDay = now.getDate();
//     let nowHours = now.getHours();
//     let nowMinutes = now.getMinutes();
//     if (nowHours - 12 < 0) {
//         return (
//             nowYear + "-" + nowMonth + "-" + nowDay + " " + nowHours + ":" + nowMinutes + "AM"
//         );
//     } else {
//         return (
//             nowYear +
//             "-" +
//             nowMonth +
//             "-" +
//             nowDay +
//             " " +
//             (nowHours - 12) +
//             ":" +
//             nowMinutes +
//             "PM"
//         );
//     }
// }

// return (
//     <Layouts>
//         {loading && <Loading></Loading>}
//         <div className="w-auto max-[768px]:overflow-x-auto max-[754px]:bg-red-100 m-2 p-2  h-full flex flex-col justify-center items-center border-2 rounded-lg">
//             <div className=" h-20 flex items-center justify-center text-xl">머니 거래 내역</div>
//             <table className="text-sm w-[1000px]" ref={tableRef}></table>
//             {/* <table className="">
//                 <thead>
//                     <tr>
//                         <th className="border p-1">번호</th>
//                         <th className="border p-1">판매자</th>
//                         <th className="border p-1">구매자</th>
//                         <th className="border p-1">거래 요청 상태</th>
//                         <th className="border p-1">현재 상태</th>
//                         <th className="border p-1">거래 금액</th>
//                         <th className="border p-1">거래 타입</th>
//                         <th className="border p-1">중고 글</th>
//                         <th className="border p-1">경매 글</th>
//                         <th className="border p-1">거래일</th>
//                         <th className="border p-1">최종 수정일</th>
//                     </tr>
//                 </thead>
//                 <tbody className="text-sm">
//                     {data &&
//                         data.map((data, index) => (
//                             <tr
//                                 key={index}
//                                 className={`${index % 2 == 0 ? "bg-gray-100" : ""}`}
//                             >
//                                 <td className="border p-1">
//                                     {data.payInfoId ? data.payInfoId : ""}
//                                 </td>
//                                 <td className="border p-1">
//                                     <a href={`/user/${data.seller}`}>
//                                         {data.seller ? data.seller : ""}
//                                     </a>
//                                 </td>
//                                 <td className="border p-1">
//                                     <a href={`/user/${data.buyer}`}>
//                                         {data.buyer ? data.buyer : ""}
//                                     </a>
//                                 </td>
//                                 <td className="border p-1">
//                                     {data.transactionRequestType
//                                         ? data.transactionRequestType
//                                         : ""}
//                                 </td>
//                                 <td className="border p-1">
//                                     {data.transactionRequestState
//                                         ? data.transactionRequestState
//                                         : ""}
//                                 </td>
//                                 <td className="border p-1">
//                                     {data.transactionMoney ? data.transactionMoney : ""}
//                                 </td>
//                                 <td className="border p-1">
//                                     {data.usedTransactionType ? data.usedTransactionType : ""}
//                                 </td>
//                                 <td className="border p-1">
//                                     <a href={`/general/${data.generalTransactionId}`}>
//                                         {data.generalTransactionId
//                                             ? data.generalTransactionId
//                                             : ""}
//                                     </a>
//                                 </td>
//                                 <td className="border p-1">
//                                     <a href={`/auction/${data.auctionTransactionId}`}>
//                                         {data.auctionTransactionId
//                                             ? data.auctionTransactionId
//                                             : ""}
//                                     </a>
//                                 </td>
//                                 <td className="border p-1">
//                                     {data.transactionTime
//                                         ? dateFormat(data.transactionTime)
//                                         : ""}
//                                 </td>
//                                 <td className="border p-1">
//                                     {data.transactionUpdateTime
//                                         ? dateFormat(data.transactionUpdateTime)
//                                         : ""}
//                                 </td>
//                             </tr>
//                         ))}
//                 </tbody>
//             </table> */}
//         </div>
//     </Layouts>
// );
