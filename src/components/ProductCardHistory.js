import { useEffect, useRef, useState } from "react";
import noimage from "../images/noimage.png";

function ProductCardHistory({
    imgSrc,
    onClick,
    productType,
    onClickUpdate,
    onClickDelete,
    sell,
    ...props
}) {
    const [optionDropDown, setOptionDropDown] = useState(false);
    const optionRef = useRef(null);
    if (productType == null) {
        productType = "중고";
    }
    function dayFormat() {
        if (props.info) {
            const date = new Date(props.info.createdAt);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDay();
            return year + "." + month + "." + day;
        }
    }
    function transactionState() {
        return props.info.transactionState == null || props.info.transactionState === ""
            ? "판매중"
            : props.info.transactionState;
    }

    useEffect(() => {
        function dropDownOut(event) {
            if (optionRef && !(optionRef.current == event.target)) {
                setTimeout(() => {
                    setOptionDropDown(false);
                }, 100);
            }
        }
        if (optionDropDown) {
            document.addEventListener("mousedown", dropDownOut);
        }
        return () => {
            document.removeEventListener("mousedown", dropDownOut);
        };
    }, [optionDropDown]);

    return (
        <div className="relative bg-white w-72  h-auto m-2 flex rounded-lg outline-1 outline-gray-300 outline hover:outline-purple-500 overflow-hidden">
            <div className="bg-white h-20 w-20 cursor-pointer relative " onClick={onClick}>
                {props.info.transactionState !== "판매중" ? (
                    <div>
                        <div className="absolute w-full h-full bg-black opacity-50"></div>
                        <div className="absolute w-full h-full flex items-center justify-center font-bold text-purple-400">
                            {props.info.transactionState ? props.info.transactionState : ""}
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                <img
                    src={`${props.info.thumbnail ? props.info.thumbnail : noimage}`}
                    className="bg-white h-20 w-20 object-cover"
                    width={80}
                    height={80}
                    alt="대표 이미지"
                ></img>
            </div>
            <div className="w-52 h-full p-2 flex flex-col">
                <div className="flex items-center justify-between">
                    <div
                        className="w-32 items-center justify-start text-ellipsis whitespace-nowrap overflow-hidden flex-grow text-left cursor-pointer"
                        title={props.info.title}
                        onClick={onClick}
                    >
                        {props.info.title}
                    </div>
                    {sell === true && (
                        <div
                            className="relative w-6 bg-white outline outline-[1px] outline-gray-300 h-6 rounded-full cursor-pointer flex flex-col items-center justify-center space-y-[2px]"
                            onClick={() => setOptionDropDown(!optionDropDown)}
                        >
                            <span className="w-[3px] h-[3px] rounded-full bg-black"></span>
                            <span className="w-[3px] h-[3px] rounded-full bg-black"></span>
                            <span className="w-[3px] h-[3px] rounded-full bg-black"></span>
                        </div>
                    )}
                    {sell === true && optionDropDown && (
                        <div
                            className="absolute right-0 top-0 bg-gray-100 w-10 h-20 flex flex-col items-center justify-center text-sm space-y-2"
                            ref={optionRef}
                            onBlur={() => alert("메뉴")}
                        >
                            <div
                                className=" w-full hover:bg-purple-200 cursor-pointer"
                                onClick={onClickUpdate}
                            >
                                수정
                            </div>
                            <div
                                className="w-full hover:bg-purple-200 cursor-pointer"
                                onClick={onClickDelete}
                            >
                                삭제
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div>{transactionState()}</div>
                    <div
                        className=" w-24 text-ellipsis whitespace-nowrap overflow-hidden flex-grow text-right"
                        title={`${Number(
                            props.info.price ? props.info.price : 0
                        ).toLocaleString()}원`}
                    >
                        {Number(props.info.price ? props.info.price : 0).toLocaleString()}원
                    </div>
                </div>
                {productType === "general" ? (
                    <div className="flex text-sm justify-between text-gray-500">
                        {/* <div>채팅 {props.info.chatCount ? props.info.chatCount : 0}개</div> */}
                        <div></div>
                        <div className="">{dayFormat()}</div>
                    </div>
                ) : (
                    <div className="flex text-sm justify-between text-gray-500">
                        <div>
                            최고가{" "}
                            {Number(
                                props.info.highestPrice ? props.info.highestPrice : 0
                            ).toLocaleString()}
                            원
                        </div>
                        <div className="">{dayFormat()}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductCardHistory;
