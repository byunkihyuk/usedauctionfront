import { useEffect, useRef, useState } from "react";
import Layouts from "../../components/Layout";
import ProductCard from "../../components/ProductCard";
import Loading from "../../components/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";

function AllGeneralTransaction() {
    const [param, setParam] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const movePage = useNavigate();
    const [data, setData] = useState();
    const [pageSize, setPageSize] = useState(param.get("size") == null ? "20" : param.get("size"));
    const [pageNumber, setPageNumber] = useState(
        param.get("page") == null ? "1" : param.get("page")
    );
    const [pageSort, setPageSort] = useState(
        param.get("sort") == null ? "desc" : param.get("sort")
    );
    const keyword = param.get("keyword") ? param.get("keyword") : "";
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState();
    const pagination = 10;
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);

    const [pages, setPages] = useState([]);

    const [transactionState, setTransactionState] = useState(
        param.get("state") == null ? "판매중" : param.get("state")
    );
    const [transactioNStateDropDown, setTransactioNStateDropDown] = useState(false);
    const [sortDropDown, setSortDropDown] = useState(false);

    const transactionStateDropDownRef = useRef(null);
    const transactionStateDropDownBtnRef = useRef(null);
    const sortDropDownRef = useRef(null);
    const sortDropDownRefBtnRef = useRef(null);

    const transactionStateList = ["전체", "판매중", "거래중", "판매완료"];
    const sortList = ["최신순", "오래된순"];

    useEffect(() => {
        let totalPages2 = Math.ceil(totalCount / Number(pageSize));
        let ps = Math.floor((pageNumber - 1) / pageSize) * pageSize + 1;
        let pe =
            Math.floor((pageNumber - 1) / pageSize) * pageSize + pageSize > totalPages2
                ? totalPages2
                : Math.floor((pageNumber - 1) / pageSize) + pageSize;

        setTotalPages(totalPages2);
        setStart(ps);
        setEnd(pe);

        if (totalPages2 > 1) {
            const arr = [];
            for (var i = ps; i <= pe; i++) {
                arr[i - 1] = i;
            }
            setPages(arr);
        } else {
            setPages([1]);
        }
    }, [totalCount]);

    useEffect(() => {
        function dropDownOut(event) {
            if (
                transactionStateDropDownRef &&
                transactionStateDropDownRef.current.contains(event.target) &&
                transactionStateDropDownBtnRef &&
                transactionStateDropDownBtnRef.current.contains(event.target)
            ) {
                setTransactioNStateDropDown(false);
            }
        }
        if (transactioNStateDropDown) {
            document.addEventListener("mousedown", dropDownOut);
        }
        return () => {
            document.removeEventListener("mousedown", dropDownOut);
        };
    }, [transactioNStateDropDown, sortDropDown]);

    useEffect(() => {
        setLoading(true);
        fetch(
            `${process.env.REACT_APP_CLIENT_IP}/api/general?size=${pageSize}&page=${
                Number(pageNumber) > 0 ? Number(pageNumber) - 1 : 0
            }&sort=${pageSort}&state=${transactionState}&keyword=${keyword}`
        )
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    setData(res.data);
                    setTotalCount(res.data.totalCount);
                    setLoading(false);
                } else {
                    alert(res.message);
                }
            })
            .catch((error) => alert(error));
    }, [pageNumber, pageSort, transactionState, pageSize, keyword]);

    return (
        <Layouts>
            {loading && <Loading></Loading>}
            <div className="max-w-[1000px] w-full flex flex-col items-center justify-center space-y-5">
                <div className="w-full h-10 flex items-center justify-between border-b-2">
                    <div className=" flex items-center justify-center">중고 거래 전체 글</div>
                    <div className="flex space-x-5">
                        <div className="relative">
                            <button
                                ref={transactionStateDropDownBtnRef}
                                type="button"
                                className="inline-flex justify-between items-center w-28  px-3 py-1  text-sm rounded-md bg-white text-gray-900 shadow-sm ring-1 ring-inset  ring-gray-300 hover:bg-gray-50"
                                onClick={() => {
                                    setTransactioNStateDropDown(!transactioNStateDropDown);
                                }}
                            >
                                <div className="w-24 flex items-center justify-center">
                                    {transactionState}
                                </div>

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
                            {transactioNStateDropDown && (
                                <div
                                    ref={transactionStateDropDownRef}
                                    className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="menu-button"
                                    tabIndex="-1"
                                >
                                    <div className="py-1" role="none">
                                        {transactionStateList.map((item, index) => (
                                            <a
                                                key={index}
                                                className="text-gray-700 block px-4 py-1 text-sm cursor-pointer hover:bg-gray-300"
                                                role="menuitem"
                                                tabIndex="-1"
                                                id="menu-item-1"
                                                href={`/general?size=${pageSize}&page=${1}&sort=${pageSort}&state=${item}&keyword=${keyword}`}
                                            >
                                                {item}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
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
                            {sortDropDown && (
                                <div
                                    ref={sortDropDownRef}
                                    className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="menu-button"
                                    tabIndex="-1"
                                >
                                    <div className="py-1" role="none">
                                        {sortList.map((item, index) => (
                                            <a
                                                key={index}
                                                href={`/general?size=${pageSize}&page=${pageNumber}&sort=${
                                                    item === sortList[0] ? "desc" : "asc"
                                                }&state=${transactionState}&keyword=${keyword}
                                                `}
                                                className="text-gray-700 block px-4 py-1 text-sm cursor-pointer hover:bg-gray-300"
                                                role="menuitem"
                                                tabIndex="-1"
                                                id="menu-item-1"
                                            >
                                                {item}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className={`${
                        data && data.totalCount > 0
                            ? "grid grid-cols-4 gap-4"
                            : "h-80 flex items-center justify-center"
                    }`}
                >
                    {data && data.totalCount > 0
                        ? data.transactionList.map((info, index) => (
                              <ProductCard
                                  key={index}
                                  info={info}
                                  url={"/general/" + info.generalTransactionId}
                                  type={"general"}
                              ></ProductCard>
                          ))
                        : "등록된 중고 거래가 없습니다."}
                </div>
                <div className="grid grid-flow-col">
                    {pageNumber > 1 ? (
                        <a
                            className=" w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-200 "
                            href={`/general?size=${pageSize}&page=${1}&sort=${pageSort}&state=${transactionState}`}
                        >
                            {"<<"}
                        </a>
                    ) : (
                        <div className="w-8 h-8 flex items-center justify-center text-gray-400">
                            {"<<"}
                        </div>
                    )}
                    {start - 10 >= 0 ? (
                        <a
                            href={`/general?size=${pageSize}&page=${
                                end % pagination === 1 ? end - pagination : end - (end % pagination)
                            }&sort=${pageSort}&state=${transactionState}`}
                            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-200 "
                        >
                            {"<"}
                        </a>
                    ) : (
                        <div className="w-8 h-8 flex items-center justify-center text-gray-400">
                            {"<"}
                        </div>
                    )}
                    {pages.map((data, index) => (
                        <a
                            key={index}
                            href={`/general?size=${pageSize}&page=${data}&sort=${pageSort}&state=${transactionState}`}
                            className={`w-8 h-8 flex items-center justify-center cursor-pointer ${
                                data == pageNumber ? "bg-purple-400" : "hover:bg-purple-200"
                            }`}
                        >
                            {data}
                        </a>
                    ))}{" "}
                    {end > totalPages ? (
                        <a
                            href={`/general?size=${pageSize}&page=${
                                start + pagination
                            }&sort=${pageSort}&state=${transactionState}`}
                            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-200"
                        >
                            {">"}
                        </a>
                    ) : (
                        <div className="w-8 h-8 flex items-center justify-center text-gray-400">
                            {">"}
                        </div>
                    )}
                    {pageNumber < totalPages ? (
                        <a
                            href={`/general?size=${pageSize}&page=${totalPages}&sort=${pageSort}&state=${transactionState}`}
                            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-200"
                        >
                            {">>"}
                        </a>
                    ) : (
                        <div className="w-8 h-8 flex items-center justify-center text-gray-400">
                            {">>"}
                        </div>
                    )}
                </div>
            </div>
        </Layouts>
    );
}

export default AllGeneralTransaction;
