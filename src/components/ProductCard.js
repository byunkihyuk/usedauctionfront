import { Link } from "react-router-dom";
import noimage from "../images/search.png";

function ProductCard(props) {
    const date = new Date(props.info.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const transactionState =
        props.info.transactionState == null || props.info.transactionState === ""
            ? "판매중"
            : props.info.transactionState;

    return (
        <div className="w-auto h-auto">
            <div className="flex flex-col w-48 h-80 border-[1px] hover:border-purple-500  rounded-lg   overflow-hidden">
                <Link to={props.url}>
                    <div className=" w-48 h-48 flex items-center justify-center overflow-hidden cursor-pointer">
                        {transactionState !== "판매중" && (
                            <div className="absolute text-2xl font-bold text-purple-500 w-48 h-48 flex items-center justify-center">
                                <div className="absolute w-48 h-48 bg-black opacity-60"></div>
                                <div className="absolute">{transactionState}</div>
                            </div>
                        )}

                        <img
                            src={props.info.thumbnail ? props.info.thumbnail : noimage}
                            alt="이미지 없음"
                            className={`w-48 h-48 object-cover `}
                        ></img>
                    </div>
                </Link>
                <div className="h-32 flex flex-col justify-between p-2">
                    <div className="flex items-center justify-start">
                        <Link to={props.url}>
                            <b>{props.info.title ? props.info.title : "제목이 없습니다"}</b>
                        </Link>
                    </div>
                    <div className="flex items-center justify-start text-sm">
                        가격&nbsp;{Number(props.info.price).toLocaleString("ko-KR")}원
                    </div>
                    <div className="flex items-center justify-start text-sm">
                        {props.type ? props.type : "없음"}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="">최고가</div>
                        <div>
                            {year}. {month}. {day}.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
