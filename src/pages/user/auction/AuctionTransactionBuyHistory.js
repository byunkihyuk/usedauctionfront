import { useEffect, useRef, useState } from "react";
import Layouts from "../../../components/Layout";
import ProductCardHistory from "../../../components/ProductCardHistory";
import Loading from "../../../components/Loading";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

function AuctionTransactionBuyHistory() {
    const movePage = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const [param, setParam] = useSearchParams();
    const [pageSize, setPageSize] = useState(param.get("size") == null ? "20" : param.get("size"));
    const [pageNumber, setPageNumber] = useState(
        param.get("page") == null ? "1" : param.get("page")
    );
    const [pageSort, setPageSort] = useState(
        param.get("sort") == null ? "desc" : param.get("sort")
    );
    const [totalCount, setTotalCount] = useState(0);
    const totalPages = Math.ceil(totalCount / Number(pageSize));
    const pagination = 10;
    const start = Math.floor((pageNumber - 1) / pagination) * pagination + 1;
    const end = start + pagination <= totalPages ? start + pagination : totalPages + 1;
    const [pages, setPages] = useState([]);
    const sortList = ["최신순", "오래된순"];
    const sortDropDownRefBtnRef = useRef(null);
    const sortDropDownRef = useRef(null);
    const [sortDropDown, setSortDropDown] = useState(false);

    useEffect(() => {
        if (totalPages > 1) {
            const arr = [];
            for (var i = start; i < end; i++) {
                arr[i - 1] = i;
            }
            setPages(arr);
        } else {
            setPages([1]);
        }
    }, [totalCount]);

    useEffect(() => {
        function dropDownOut(event) {
            if (sortDropDownRef && !sortDropDownRef.current.contains(event.target)) {
                if (sortDropDownRefBtnRef && sortDropDownRefBtnRef.current.contains(event.target)) {
                    return;
                }
                setSortDropDown(false);
            }
        }
        if (sortDropDown) {
            document.addEventListener("mousedown", dropDownOut);
        }
        return () => {
            document.removeEventListener("mousedown", dropDownOut);
        };
    }, [sortDropDown]);

    function onClickSort(sort) {
        setPageSort(sort === sortList[0] ? "desc" : "asc");
        setSortDropDown(false);
    }

    useEffect(() => {
        setLoading(true);
        fetch(
            `${
                process.env.REACT_APP_CLIENT_IP
            }/api/user/${userId}/auction-buy-history?size=${pageSize}&page=${
                Number(pageNumber) > 0 ? Number(pageNumber) - 1 : 0
            }&sort=${pageSort}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
                },
            }
        )
            .then((res) => res.json())
            .then((res) => {
                setData(res.data);
                setTotalCount(res.totalCount);
                setLoading(false);
            })
            .catch((error) => alert(error));
    }, [pageNumber, pageSort, pageSize]);

    return (
        <Layouts>
            {loading && <Loading></Loading>}
            <div className="w-full h-10 flex items-center justify-between border-b-2 lg:min-w-80">
                <div className="text-lg">경매 구매 내역 페이지</div>

                <div className="relative">
                    <button
                        ref={sortDropDownRefBtnRef}
                        type="button"
                        className=" inline-flex justify-center w-28  px-3 py-1 gap-x-1.5 text-sm rounded-md bg-white text-gray-900 shadow-sm ring-1 ring-inset  ring-gray-300 hover:bg-gray-50"
                        onClick={() => setSortDropDown(!sortDropDown)}
                    >
                        {pageSort === "desc" ? "최신순" : "오래된순"}
                        <svg
                            className="-mr-1 h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                    <div
                        ref={sortDropDownRef}
                        className={`absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                            sortDropDown ? "block" : "hidden"
                        }`}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex="-1"
                    >
                        <div className="py-1" role="none">
                            {sortList.map((data, index) => (
                                <div
                                    key={index}
                                    href=""
                                    className={`text-gray-700 block px-4 py-1 text-sm cursor-pointer hover:bg-purple-300 `}
                                    role="menuitem"
                                    tabIndex="-1"
                                    id="menu-item-1"
                                    onClick={() => onClickSort(data)}
                                >
                                    {data}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {data && data.length > 0 ? (
                <div className="grid lg:grid-cols-2 lg:gap-y-2 lg:gap-x-10 sm:grid-cols-1 md:grid-cols-2 place-items-center justify-center">
                    {data.map((data, index) => (
                        <ProductCardHistory
                            key={index}
                            info={data}
                            sell={false}
                            onClick={() => movePage(`/auction/${data.generalTransactionId}`)}
                            onClickDelete={null}
                            onClickUpdate={null}
                        ></ProductCardHistory>
                    ))}
                </div>
            ) : (
                <div className="h-[420px] flex items-center justify-center">
                    구매 내역이 없습니다.
                </div>
            )}
            <div className="mt-5 flex flex-wrap items-center justify-center">
                {start >= 11 ? (
                    <a
                        className=" w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-200 "
                        href={`/user/${userId}/auction-buy-history?size=${pageSize}&page=${1}&sort=${pageSort}`}
                    >
                        {"<<"}
                    </a>
                ) : (
                    <div className="w-8 h-8 flex items-center justify-center">{"<<"}</div>
                )}
                {start >= 11 ? (
                    <a
                        href={`/user/${userId}/auction-buy-history?size=${pageSize}&page=${
                            end % pagination === 1 ? end - pagination : end - (end % pagination)
                        }&sort=${pageSort}`}
                        className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-200 "
                    >
                        {"<"}
                    </a>
                ) : (
                    <div className="w-8 h-8 flex items-center justify-center">{"<"}</div>
                )}
                {pages.map((data, index) => (
                    <a
                        key={index}
                        href={`/user/${userId}/auction-buy-history?size=${pageSize}&page=${data}&sort=${pageSort}&`}
                        className={`w-8 h-8 flex items-center justify-center cursor-pointer ${
                            data == pageNumber ? "bg-purple-400" : "hover:bg-purple-200"
                        }`}
                    >
                        {data}
                    </a>
                ))}
                {end - 1 < totalPages ? (
                    <a
                        href={`/user/${userId}/auction-buy-history?size=${pageSize}&page=${
                            start + pagination
                        }&sort=${pageSort}`}
                        className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-200"
                    >
                        {">"}
                    </a>
                ) : (
                    <div className="w-8 h-8 flex items-center justify-center">{">"}</div>
                )}
                {end - 1 < totalPages ? (
                    <a
                        href={`/user/${userId}/auction-buy-history?size=${pageSize}&page=${totalPages}&sort=${pageSort}`}
                        className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-200"
                    >
                        {">>"}
                    </a>
                ) : (
                    <div className="w-8 h-8 flex items-center justify-center">{">>"}</div>
                )}
            </div>
        </Layouts>
    );
}
export default AuctionTransactionBuyHistory;
