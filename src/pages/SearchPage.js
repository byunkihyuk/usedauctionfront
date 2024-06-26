import { Link, useSearchParams } from "react-router-dom";
import Layouts from "../components/Layout";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";

function SearchPage() {
    const [param, setParam] = useSearchParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const keyword = param.get("keyword");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/search?keyword=${keyword}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((res) => {
                setLoading(true);
                if (res.status === "success") {
                    setData(res.data);
                }
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }, [keyword]);

    return (
        <Layouts>
            {loading && <Loading></Loading>}
            <div className="pc:w-[1000px] pc:max-w-[1000px] mobile:w-96 mobile:px-1">
                <div className="w-full h-12 flex items-center justify-start">
                    검색어 : {keyword}
                </div>
                <div className="w-full flex flex-col">
                    <div className="w-full h-12 flex items-center justify-between border-y-2">
                        <p>경매 거래 글</p>
                        <Link to={`/general?keyword=${keyword}`}>
                            <div className=" flex items-center justify-center cursor-pointer">
                                검색 결과 전체 보기 &gt;
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center justify-start space-x-2 p-2 overflow-auto">
                        {data && data.generalTransactionList.length > 0 ? (
                            data.generalTransactionList.map((general, index) => (
                                <ProductCard
                                    key={index}
                                    info={general}
                                    url={`/general/${general.generalTransactionId}`}
                                    type={"general"}
                                ></ProductCard>
                            ))
                        ) : (
                            <div className="w-full h-20 flex items-center justify-center">
                                검색 내역이 없습니다.
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full flex flex-col">
                    <div className="w-full h-12 flex items-center justify-between border-y-2">
                        <p>경매 거래 글</p>
                        <Link to={`/auction?keyword=${keyword}`}>
                            <div className=" flex items-center justify-center cursor-pointer">
                                검색 결과 전체 보기 &gt;
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center justify-start space-x-2 p-2 overflow-auto">
                        {data && data.auctionTransactionList.length > 0 ? (
                            data.auctionTransactionList.map((auction, index) => (
                                <ProductCard
                                    key={index}
                                    info={auction}
                                    url={`/auction/${auction.auctionTransactionId}`}
                                ></ProductCard>
                            ))
                        ) : (
                            <div className="w-full h-20 flex items-center justify-center">
                                검색 내역이 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layouts>
    );
}

export default SearchPage;
