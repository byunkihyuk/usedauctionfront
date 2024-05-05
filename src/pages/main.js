import { useEffect, useState } from "react";
import Layouts from "../components/Layout";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

function Main() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/main")
            .then((res) => res.json())
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <Layouts>
            {loading && <Loading></Loading>}
            <div className="lg:w-[1000px] sm:w-[600px] flex flex-col items-center justify-center space-y-1">
                <div className="w-full flex flex-col">
                    <div className="w-full h-12 flex items-center justify-start border-y-2">
                        인기 거래 글
                    </div>
                    <div className="flex items-center justify-start space-x-2 p-2 overflow-auto">
                        {data.topList &&
                            data.topList.map((top, index) => (
                                <ProductCard
                                    key={index}
                                    info={top}
                                    url={
                                        top.generalTransactionId !== undefined
                                            ? `/general/${top.generalTransactionId}`
                                            : `/auction/${top.auctionTransactionId}`
                                    }
                                ></ProductCard>
                            ))}
                    </div>
                </div>
                <div className="w-full flex flex-col">
                    <div className="w-full h-12 flex items-center justify-between border-y-2">
                        <p>중고 거래 글</p>
                        <Link to={"/general"}>
                            <div className=" flex items-center justify-center cursor-pointer">
                                전체 글 &gt;
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center justify-start space-x-2 p-2  overflow-auto">
                        {data.generalTransactionList &&
                            data.generalTransactionList.map((general, index, key) => (
                                <ProductCard
                                    key={index}
                                    info={general}
                                    url={`/general/${general.generalTransactionId}`}
                                ></ProductCard>
                            ))}
                    </div>
                </div>
                <div className="w-full flex flex-col">
                    <div className="w-full h-12 flex items-center justify-between border-y-2">
                        <p>경매 거래 글</p>
                        <Link to={"/auction"}>
                            <div className=" flex items-center justify-center cursor-pointer">
                                전체 글 &gt;
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center justify-start space-x-2 p-2 overflow-auto">
                        {data.auctionTransactionList &&
                            data.auctionTransactionList.map((auction, index, key) => (
                                <ProductCard
                                    key={index}
                                    info={auction}
                                    url={`/auction/${auction.auctionTransactionId}`}
                                ></ProductCard>
                            ))}
                    </div>
                </div>
            </div>
        </Layouts>
    );
}

export default Main;
