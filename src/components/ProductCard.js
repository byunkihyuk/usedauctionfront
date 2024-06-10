import { Link } from "react-router-dom";
import noimage from "../images/noimage.png";

function ProductCard(props) {
    const date = new Date(props.info.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const transactionState =
        props.info.transactionState == null || props.info.transactionState === ""
            ? "판매중"
            : props.info.transactionState;

    function dateFormat(date) {
        let now = new Date(date);
        let nowYear = now.getYear() >= 100 ? now.getYear() - 100 : now.getYear();
        let nowMonth = now.getMonth() + 1;
        let nowDay = now.getDate();
        let nowHours = now.getHours();
        let nowMinutes = now.getMinutes();

        return nowYear + "-" + nowMonth + "-" + nowDay + " " + nowHours + ":" + nowMinutes;
    }

    return (
        <div className="w-auto h-auto">
            <Link to={props.url}>
                <div className="flex flex-col w-48 h-80 border-[1px] hover:border-purple-500  rounded-lg   overflow-hidden cursor-pointer">
                    <div className="relative w-48 h-48 flex items-center justify-center overflow-hidden ">
                        {props.type !== "general" &&
                            transactionState === "판매중" &&
                            new Date(props.info.finishedAt) < new Date() && (
                                <div className="absolute text-2xl font-bold text-purple-500 w-48 h-48 flex items-center justify-center">
                                    <div className="absolute w-48 h-48 bg-black opacity-60"></div>
                                    <div className="absolute">{"입찰 종료"}</div>
                                </div>
                            )}
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
                    <div className="h-32 flex flex-col justify-between p-2">
                        <div className="flex items-center justify-start">
                            <b>{props.info.title ? props.info.title : "제목이 없습니다"}</b>
                        </div>
                        <div className="flex items-center justify-start text-sm">
                            {props.type === "general" ? (
                                <div>
                                    가격&nbsp;{Number(props.info.price).toLocaleString("ko-KR")}원
                                </div>
                            ) : (
                                <div className="w-full flex justify-between">
                                    <div
                                        title={Number(props.info.price).toLocaleString() + "원"}
                                        className="w-20 overflow-hidden text-ellipsis text-nowrap text-left"
                                    >
                                        시작 {Number(props.info.price).toLocaleString()}원
                                    </div>
                                    <div
                                        title={
                                            Number(props.info.highestBid).toLocaleString() + "원"
                                        }
                                        className="w-20 overflow-hidden text-ellipsis text-nowrap text-right"
                                    >
                                        최고 {Number(props.info.highestBid).toLocaleString()}원
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-start text-sm">
                            {props.type == "general" ? (
                                <div className="w-full flex justify-between">
                                    <div>거래 {props.info.transactionMode}</div>
                                    <div>결제 {props.info.payment}</div>
                                </div>
                            ) : (
                                <div className="w-full flex justify-between text-xs">
                                    <div>{dateFormat(props.info.startedAt)}</div>
                                    <div>~</div>
                                    <div>{dateFormat(props.info.finishedAt)}</div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div>조회수 {props.info.viewCount}</div>
                            <div>
                                {year}. {month}. {day}.
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProductCard;
