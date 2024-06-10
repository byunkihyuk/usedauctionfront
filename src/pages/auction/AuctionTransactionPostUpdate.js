import Layouts from "../../components/Layout";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useEffect, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { ReactComponent as CloseIcon } from "../../images/x.svg";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";

function AuctionTransactionPostUpdate() {
    const movePage = useNavigate();
    const { auctionTransactionId } = useParams();
    const uploadImgRef = useRef(null);
    const titleRef = useRef(null);
    const priceRef = useRef(null);
    const startedAtRef = useRef(null);
    const finishedAtRef = useRef(null);
    const paymentRef = useRef(null);
    const transactionModeRef = useRef(null);
    const addressRef = useRef(null);
    const detailAddressRef = useRef(null);

    const paymentList = ["결제 방법 선택", "온라인", "직거래"];
    const transactionModeList = ["거래 방법 선택", "온라인", "직거래"];

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [payment, setPayment] = useState("");
    const [transactionMode, setTransactionMode] = useState("");
    const [address, setAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [content, setContent] = useState("");
    const [startedAt, setStartedAt] = useState("");
    const [startedAtTime, setStartedAtTime] = useState("");
    const [finishedAt, setFinishedAt] = useState("");
    const [finishedAtTime, setFinishedAtTime] = useState("");
    const [minFinishedAtTime, setMinFinishedAtTime] = useState("");
    const [message, setMessage] = useState("");
    const [visibleModal, setVisibleModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const today = new Date(new Date() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, -8);

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/auction/${auctionTransactionId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    if (res.data.author === false) {
                        alert("작성자가 아닙니다.");
                        movePage(-1);
                    }
                    setTitle(res.data.transaction.title ? res.data.transaction.title : "");
                    setPrice(res.data.transaction.price ? res.data.transaction.price : "");
                    setPayment(res.data.transaction.payment ? res.data.transaction.payment : "");
                    setTransactionMode(
                        res.data.transaction.transactionMode
                            ? res.data.transaction.transactionMode
                            : ""
                    );
                    setAddress(res.data.transaction.address ? res.data.transaction.address : "");
                    setDetailAddress(
                        res.data.transaction.detailAddress ? res.data.transaction.detailAddress : ""
                    );
                    setContent(res.data.transaction.content ? res.data.transaction.content : "");
                    setStartedAt(
                        new Date(
                            new Date(res.data.transaction.startedAt) -
                                new Date().getTimezoneOffset() * 60000
                        )
                            .toISOString()
                            .slice(0, -8)
                    );
                    setFinishedAt(
                        new Date(
                            new Date(res.data.transaction.finishedAt) -
                                new Date(res.data.transaction.finishedAt).getTimezoneOffset() *
                                    60000
                        )
                            .toISOString()
                            .slice(0, -8)
                    );
                    loadingFile(res.data.transaction.images);
                }
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }, [auctionTransactionId]);

    function loadingFile(images) {
        setImgList([]);
        images.map(async (img) => {
            const response = await fetch(img.uploadUrl);
            const imgData = await response.blob();
            const ext = img.originName.split(".").pop();
            const filename = img.originName;
            const metadata = { type: `image/${ext}` };
            let loadImg = new File([imgData], filename, metadata);
            var reader = new FileReader();
            reader.onload = function (e) {
                const fileData = {
                    file: loadImg,
                    thumbnail: e.target.result,
                };
                setImgList((imgList) => [...imgList, fileData]);
            };
            reader.readAsDataURL(loadImg);
        });
    }

    function onClickAddImg(e) {
        if (uploadImgRef.current) {
            uploadImgRef.current.click();
        }
    }

    function onClickAuctionTransactionPosting() {
        if (titleRef && titleRef.current.value === "") {
            setMessage("제목을 입력해주세요.");
            titleRef.current.focus();
            return;
        }
        if (priceRef && priceRef.current.value === "") {
            setMessage("가격 입력해주세요.");
            priceRef.current.focus();
            return;
        }
        if (startedAtRef && startedAtRef.current.value === "") {
            setMessage("경매 시작일을 선택해 주세요.");
            startedAtRef.current.focus();
            return;
        }
        if (finishedAtRef && finishedAtRef.current.value === "") {
            setMessage("경매 종료일을 선택해 주세요.");
            finishedAtRef.current.focus();
            return;
        }
        if (paymentRef && paymentRef.current.value === paymentList[0]) {
            setMessage("결제 방법을 선택해주세요.");
            paymentRef.current.focus();
            return;
        }
        if (transactionModeRef && transactionModeRef.current.value === transactionModeList[0]) {
            setMessage("거래 방식을 선택해주세요.");
            transactionModeRef.current.focus();
            return;
        }
        if (addressRef && addressRef.current.value === "") {
            setMessage("거래 위치를 입력해 주세요");
            addressRef.current.focus();
            return;
        }
        if (detailAddressRef && detailAddressRef.current.value === "") {
            setMessage("상세 거래 위치를 입력해 주세요");
            detailAddressRef.current.focus();
            return;
        }

        var formData = new FormData();
        const sendData = {
            title: title,
            price: price,
            transactionMode: transactionMode,
            transactionState: "판매중",
            address: address,
            detailAddress: detailAddress,
            payment: payment,
            content: content,
            startedAt: new Date(startedAt),
            finishedAt: new Date(finishedAt),
        };
        formData.append(
            "auctionTransactionFormDto",
            new Blob([JSON.stringify(sendData)], {
                type: "application/json",
            })
        );
        for (var file of imgList) {
            formData.append("multipartFileList", file.file);
        }

        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/auction/${auctionTransactionId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    let auctionTransactionId = res.data.auctionTransactionId;
                    movePage("/auction/" + auctionTransactionId);
                } else {
                    alert(res.message);
                    setMessage(res.message);
                }
            })
            .catch((error) => console.log(error));
    }

    const maxImgCnt = 10;
    const maxImgSize = 5 * 1024 * 1024;
    const [imgList, setImgList] = useState([]);

    function onChangeImg(e) {
        const currImgCnt = e.target.files.length;
        if (currImgCnt + imgList.length > maxImgCnt) {
            alert("최대 " + maxImgCnt + "개까지 이미지 첨부 가능합니다.");
        } else {
            for (let file of e.target.files) {
                if (ImageValidate(file)) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        const fileData = {
                            file: file,
                            thumbnail: e.target.result,
                        };
                        setImgList((imgList) => [...imgList, fileData]);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    }

    function ImageValidate(file) {
        const imgTypes = ["image/jpeg", "image/png"];
        if (file.name.length > 100) {
            alert("파일명이 100자 이상인 파일이 제외되었습니다.");
            return false;
        } else if (file.size > maxImgSize) {
            alert("5MB 이상인 파일이 제외되었습니다.");
            return false;
        } else if (!imgTypes.includes(file.type)) {
            alert("jpg, jpeg, png가 아닌 파일이 제외되었습니다.");
            return false;
        }
        return true;
    }

    function deleteImg(index) {
        setImgList(
            imgList.filter((_, listIndex) => {
                return listIndex !== index;
            })
        );
    }

    function complete(data) {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        setAddress(fullAddress);
        setVisibleModal(false);
    }

    return (
        <Layouts>
            {loading && <Loading></Loading>}
            <div className="min-w-[1000px] flex flex-col items-center justify-center space-y-10">
                <div className="w-full h-full flex items-center justify-center">
                    <div className="min-w-32">사진 등록</div>

                    <div className="w-[700px] flex items-center justify-start p-2 space-x-2 overflow-auto">
                        {imgList &&
                            imgList.map((data, index) => (
                                <div
                                    key={index}
                                    className="relative min-w-32 min-h-32 flex items-center justify-center border-2 rounded-lg bg-white"
                                >
                                    <img
                                        alt="업로드 이미지"
                                        src={`${data.thumbnail}`}
                                        className={`w-32 h-32 object-cover rounded-lg`}
                                        width={32}
                                        height={32}
                                    ></img>
                                    <div
                                        className="absolute -right-2 -top-2 flex items-center justify-center w-7 h-7 bg-white border-2 border-gray-500 rounded-full cursor-pointer"
                                        onClick={() => deleteImg(index)}
                                    >
                                        <span className="absolute rotate-45 h-1 w-5 bg-gray-400"></span>
                                        <span className="absolute -rotate-45 h-1 w-5 bg-gray-400"></span>
                                    </div>
                                </div>
                            ))}
                        {imgList.length < 10 ? (
                            <div
                                className="relative min-w-32 min-h-32 flex items-center justify-center border-2 rounded-lg bg-gray-100 cursor-pointer"
                                onClick={onClickAddImg}
                            >
                                <span className="absolute rotate-90 h-1 w-10 bg-gray-400"></span>
                                <span className="absolute h-1 w-10 bg-gray-400"></span>
                            </div>
                        ) : (
                            ""
                        )}
                        <input
                            ref={uploadImgRef}
                            id="inputImg"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onChangeImg}
                            multiple
                            disabled={imgList.length >= 10 ? true : false}
                        ></input>
                    </div>
                </div>
                <div className="w-full h-full flex items-center justify-center">
                    <div className="min-w-32">
                        제목<span className="text-red-600">*</span>
                    </div>
                    <div className="w-[700px]">
                        <CustomInput
                            ref={titleRef}
                            placeholder={"제목을 입력해주세요."}
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        ></CustomInput>
                    </div>
                </div>
                <div className=" w-full h-full flex items-center  justify-center">
                    <div className="min-w-32">
                        경매 시작 가격<span className="text-red-600">*</span>
                    </div>
                    <div className="w-[700px]">
                        <CustomInput
                            ref={priceRef}
                            placeholder={"가격을 입력해주세요."}
                            type={"number"}
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        ></CustomInput>
                    </div>
                </div>
                <div className=" w-full h-full flex items-center  justify-center">
                    <div className="min-w-32">
                        경매 기간<span className="text-red-600">*</span>
                    </div>
                    <div className="w-[700px] flex  items-center justify-center space-x-2">
                        <div className="w-full space-y-1">
                            <input
                                ref={startedAtRef}
                                className="rounded-md p-1 border-2 w-full outline-purple-500 border-purple-300"
                                type={"datetime-local"}
                                onChange={(e) => {
                                    setStartedAt(e.target.value);
                                    let a = new Date(e.target.value);
                                    a.setDate(a.getDate() + 1);
                                    let minValue = new Date(
                                        new Date(a) - new Date(a).getTimezoneOffset() * 60000
                                    )
                                        .toISOString()
                                        .slice(0, -8);
                                    setMinFinishedAtTime(minValue);
                                    setFinishedAt(minValue);
                                }}
                                value={startedAt}
                                min={today}
                            ></input>
                        </div>
                        <div>~</div>
                        <div className="w-full space-y-1">
                            <input
                                ref={finishedAtRef}
                                className="rounded-md p-1 border-2 w-full outline-purple-500 border-purple-300"
                                type={"datetime-local"}
                                onChange={(e) => setFinishedAt(e.target.value)}
                                value={finishedAt}
                                min={minFinishedAtTime}
                            ></input>
                        </div>
                    </div>
                </div>
                <div className="w-full h-full flex items-center  justify-center">
                    <div className="min-w-32">
                        결제 방법<span className="text-red-600">*</span>
                    </div>
                    <select
                        className="w-[700px] border-2 border-purple-300 p-1 rounded-md"
                        onChange={(e) => setPayment(e.target.value)}
                        ref={paymentRef}
                        value={payment}
                    >
                        {paymentList.map((data, index) => (
                            <option value={data} key={index}>
                                {data}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full h-full flex items-center  justify-center">
                    <div className="min-w-32">
                        거래 방식<span className="text-red-600">*</span>
                    </div>
                    <div className="w-[700px]">
                        <select
                            ref={transactionModeRef}
                            className="w-full border-2 border-purple-300 p-1 rounded-md"
                            onChange={(e) => setTransactionMode(e.target.value)}
                            value={transactionMode}
                        >
                            {transactionModeList.map((data, index) => (
                                <option value={data} key={index}>
                                    {data}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="w-full h-full flex items-center  justify-center ">
                    <div className="min-w-32">
                        거래 위치<span className="text-red-600">*</span>
                    </div>
                    <div className=" flex flex-col w-[700px] space-y-2">
                        <div onClick={() => setVisibleModal(true)}>
                            <CustomInput
                                ref={addressRef}
                                placeholder={"클릭하여 주소를 선택하세요"}
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                            ></CustomInput>
                        </div>
                        <CustomInput
                            ref={detailAddressRef}
                            placeholder={"상세 주소를 입력해주세요."}
                            onChange={(e) => setDetailAddress(e.target.value)}
                            value={detailAddress}
                        ></CustomInput>
                    </div>
                </div>
                <div className="w-full h-full flex items-center justify-center">
                    <div className="min-w-32">제품 설명</div>
                    <textarea
                        className="p-2 border-2 border-purple-300 rounded-md w-[700px] resize-none"
                        placeholder="설명을 입력해주세요."
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                        value={content}
                    ></textarea>
                </div>
                <span className="text-sm text-red-600">{message}</span>
                <div className="w-96">
                    <CustomButton
                        text={"경매 거래 수정"}
                        size={"full"}
                        onClick={onClickAuctionTransactionPosting}
                    ></CustomButton>
                </div>
            </div>
            {visibleModal && (
                <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-50">
                    <div className="w-full h-full bg-black opacity-50"></div>
                    <div className="fixed m-auto px-10 py-12  bg-white rounded-lg">
                        <CloseIcon
                            className="absolute top-5 right-10 cursor-pointer"
                            width={25}
                            height={25}
                            onClick={() => setVisibleModal(false)}
                        />
                        <DaumPostcode
                            autoClose
                            onComplete={complete}
                            style={{ width: "500px", height: "600px" }}
                        />
                    </div>
                </div>
            )}
        </Layouts>
    );
}

export default AuctionTransactionPostUpdate;
