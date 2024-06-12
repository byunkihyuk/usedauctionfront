import { useParams, useSearchParams } from "react-router-dom";
import Layouts from "../components/Layout";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

function SearchAuction() {
    const [param, setParam] = useSearchParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`/api/search?keyword=${param.get("keyword")}`, {
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
    }, []);
    return (
        <Layouts>
            {loading && <Loading></Loading>}
            <div>검색 페이지</div>
        </Layouts>
    );
}

export default SearchAuction;
