import { useEffect, useRef, useState } from "react";
import CustomButton from "../../components/CustomButton";
import Layouts from "../../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "../../components/CustomInput";
import DaumPostcode from "react-daum-postcode";
import { ReactComponent as CloseIcon } from "../../images/x.svg";

function SignUp() {
    const movePage = useNavigate();
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [emailMessageColor, setEmailMessageColor] = useState("red");
    const [nicknameMessageColor, setNicknameMessageColor] = useState("red");
    const [emailMessage, setEmailMessage] = useState("");
    const [nicknameMessage, setNicknameMessage] = useState("");
    const [emailNumber, setEmailNumber] = useState("");
    const [phoneMessage, setPhoneMessage] = useState("");
    const [phoneMessageColor, setPhoneMessageColor] = useState("");

    const [emailCheck, setEmailCheck] = useState(false);
    const [emailNumberAuthForm, setEmailNumberAuthForm] = useState(false);
    const [nicknameCheck, setNicknameCheck] = useState(false);
    const [password, setPassowrd] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneAuthentication, setPhoneAuthentication] = useState(false);
    const [address, setAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [visibleModal, setVisibleModal] = useState(false);
    const [descriptionMessage, setDescriptionMessage] = useState("");
    const [sendLoading, setSendLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    const emailRef = useRef();
    const emailNumberRef = useRef(null);
    const nicknameRef = useRef();
    const passwordRef = useRef();
    const passwordCheckRef = useRef();
    const phoneRef = useRef();

    useEffect(() => {
        if (timer > 0) {
            const time = setInterval(() => {
                setTimer((t) => t - 1);
            }, 1000);
            return () => clearInterval(time);
        }
    }, [timer]);

    function timerFormat(time) {
        let m = Math.floor(timer / 60);
        let s = time % 60;
        return m + ":" + s;
    }
    function onChangeEmail(e) {
        setEmailNumberAuthForm(false);
        setEmail(e.target.value);
        setEmailCheck(false);
        setEmailMessage("");
    }

    function onChangeNickname(e) {
        setNickname(e.target.value);
        setNicknameCheck(false);
        setNicknameMessage("");
    }

    function onChangePassword(e) {
        setPassowrd(e.target.value);
    }

    function onChangePasswordCheck(e) {
        setPasswordCheck(e.target.value);
    }

    function onChangePhone(e) {
        setPhoneAuthentication(false);
        setPhone(e.target.value);
    }

    function onChangeAddress(e) {
        setAddress(e.target.value);
    }

    function onChangeDetailAddress(e) {
        setDetailAddress(e.target.value);
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

    function openDaumModal() {
        setVisibleModal(true);
    }

    function onClickEmailCheck() {
        let emailreg = /^[0-9]{11,11}$/;
        if (email === "" || email == null) {
            setEmailCheck(false);
            setEmailMessageColor("red");
            setEmailMessage("아이디를 입력해주세요.");
            emailRef.current.focus();
            return;
        }
        setSendLoading(true);
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/mail-auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mail: email,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    setEmailNumberAuthForm(true);
                    setEmailNumber("");
                    setEmailCheck(false);
                    setTimer(300);
                } else {
                    setEmailMessage(res.message);
                    setEmailCheck(false);
                    setEmailMessageColor("red");
                }
                setSendLoading(false);
            })
            .catch((err) => console.log(err));
    }

    function onClickEmailNumberAuth() {
        if (emailNumber === "" || emailNumber == null) {
            alert("인증번호를 입력하세요");
            emailNumberRef.current.focus();
            return;
        }
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/mail-auth-number`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mail: email,
                number: emailNumber,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    setEmailCheck(true);
                    setEmailMessageColor("green");
                    setEmailMessage("사용 가능합니다.");
                    setTimer(0)
                } else {
                    setEmailMessage(res.message);
                    setEmailCheck(false);
                    setEmailMessageColor("red");
                }
            })
            .catch((err) => console.log(err));
    }

    function onClickNicknameCheck() {
        if (nickname === "" || nickname == null) {
            setNicknameCheck(false);
            setNicknameMessageColor("red");
            setNicknameMessage("닉네임을 입력해주세요.");
            nicknameRef.current.focus();
            return;
        }
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/sign-up/nickname-check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nickname: nickname,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    setNicknameCheck(true);
                    setNicknameMessageColor("green");
                    setNicknameMessage("사용 가능합니다.");
                } else {
                    setNicknameMessage(res.message);
                    setNicknameCheck(false);
                    setNicknameMessageColor("red");
                }
            })
            .catch((err) => console.log(err));
    }

    function onClickPhoneAuthentication() {
        if (phone === "" || phone == null) {
            setPhoneAuthentication(false);
            setPhoneMessageColor("red");
            setPhoneMessage("번호를 입력하세요.");
            phoneRef.current.focus();
            return;
        }
        const regex = /^[0-9]{11,11}$/;
        if (!regex.test(phone)) {
            setPhoneAuthentication(false);
            setPhoneMessageColor("red");
            setPhoneMessage("11자리 번호만 입력하세요");
            phoneRef.current.focus();
            return;
        }
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/sign-up/phone-check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phone: phone,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    setPhoneAuthentication(true);
                    setPhoneMessageColor("green");
                    setPhoneMessage("사용 가능합니다.");
                } else {
                    setPhoneAuthentication(false);
                    setPhoneMessage(res.message);
                    setPhoneMessageColor("red");
                }
            })
            .catch((err) => console.log(err));
    }

    function onClickSingUp(e) {
        setDescriptionMessage();
        // 아이디 입력
        if (email == null || email === "") {
            setDescriptionMessage("아이디를 입력하세요.");
            emailRef.current.focus();
            return;
        }
        // 아이디 중복확인
        if (emailCheck === false) {
            setDescriptionMessage("아이디 인증이 필요합니다.");
            emailRef.current.focus();
            return;
        }
        // 닉네임 입력
        if (nickname == null || nickname === "") {
            setDescriptionMessage("닉네임을 입력하세요.");
            nicknameRef.current.focus();
            return;
        }
        // 닉네임 중복확인
        if (nicknameCheck === false) {
            setDescriptionMessage("닉네임 중복 확인이 필요합니다.");
            nicknameRef.current.focus();
            return;
        }
        // 비밀번호 입력
        if (password == null || password === "") {
            setDescriptionMessage("비밀번호를 입력하세요.");
            passwordRef.current.focus();
            return;
        }
        // 비밀번호 재확인
        if (passwordCheck == null || passwordCheck === "") {
            passwordCheckRef.current.focus();
            setDescriptionMessage("비밀번호 재확인을 입력하세요.");
            return;
        }
        //비밀번호 일치한지
        if (password !== passwordCheck) {
            passwordCheckRef.current.focus();
            setDescriptionMessage("비밀번호가 일치하지 않습니다.");
            return;
        }
        // 전화번호 입력
        if (phone == null || phone === "") {
            phoneRef.current.focus();
            setDescriptionMessage("전화번호를 입력하세요.");
            return;
        }
        // 전화번호 인증
        if (phoneAuthentication === false) {
            phoneRef.current.focus();
            setDescriptionMessage("번호 인증을 해주세요.");
            return;
        }
        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/sign-up`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: email,
                nickname: nickname,
                password: password,
                phone: phone,
                address: address,
                detailAddress: detailAddress,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    alert("회원가입에 성공했습니다.");
                    movePage("/sign-in");
                } else {
                    setDescriptionMessage(res.data.message);
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <Layouts>
            <div className="relative w-80 h-auto min-h-[500px] flex flex-col space-y-5">
                <form className="flex flex-col space-y-5">
                    <Link
                        to={"/"}
                        className="p-2 cursor-pointer"
                        //onClick={mainPage}
                    >
                        <p className="font-bold text-purple-500 text-lg">usedauction</p>
                    </Link>
                    <div className="space-y-3">
                        <div className="flex justify-start space-x-1">
                            <div className="w-full flex flex-col items-start justify-center">
                                <div className="w-full flex items-center justify-between">
                                    <label>
                                        아이디&nbsp;<span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs" style={{ color: emailMessageColor }}>
                                        {emailMessage}
                                    </span>
                                </div>
                                <CustomInput
                                    id=""
                                    className=" p-1"
                                    placeholder="아이디 입력(E-mail)"
                                    onChange={onChangeEmail}
                                    ref={emailRef}
                                    type="email"
                                />
                            </div>
                            <div className="w-auto flex items-end">
                                {sendLoading && <div></div>}
                                <CustomButton
                                    text={
                                        emailNumberAuthForm
                                            ? sendLoading
                                                ? "전송중"
                                                : "재전송"
                                            : sendLoading
                                            ? "전송중"
                                            : "인증하기"
                                    }
                                    onClick={onClickEmailCheck}
                                ></CustomButton>
                            </div>
                        </div>
                        {emailNumberAuthForm && (
                            <div className="flex justify-start space-x-1">
                                <div className="w-full flex flex-col items-start justify-center relative">
                                    <CustomInput
                                        ref={emailNumberRef}
                                        id=""
                                        className=" p-1"
                                        placeholder="인증번호 입력"
                                        onChange={(e) => setEmailNumber(e.target.value)}
                                        disabled={
                                            emailCheck ? emailCheck : timer <= 0 ? true : false
                                        }
                                        value={emailNumber}
                                    />
                                    {emailNumberAuthForm && (
                                        <div
                                            className={`absolute right-4 ${
                                                timer < 60 ? "text-red-500" : ""
                                            }`}
                                        >
                                            {timerFormat(timer)}
                                        </div>
                                    )}
                                </div>
                                <div className="w-auto flex items-end relative">
                                    <CustomButton
                                        text={
                                            emailCheck
                                                ? "인증완료"
                                                : timer <= 0
                                                ? "시간초과"
                                                : "인증하기"
                                        }
                                        onClick={onClickEmailNumberAuth}
                                        disabled={
                                            emailCheck ? emailCheck : timer <= 0 ? true : false
                                        }
                                    ></CustomButton>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-start space-x-1">
                            <div className=" w-full flex flex-col items-start justify-center">
                                <div className="w-full flex items-center justify-between">
                                    <label>
                                        닉네임&nbsp;<span className="text-red-500">*</span>
                                    </label>
                                    <span
                                        className="text-xs"
                                        style={{ color: nicknameMessageColor }}
                                    >
                                        {nicknameMessage}
                                    </span>
                                </div>
                                <CustomInput
                                    className="bg-gray-200 p-1"
                                    placeholder="닉네임 입력"
                                    onChange={onChangeNickname}
                                    ref={nicknameRef}
                                    onClick={onClickNicknameCheck}
                                />
                            </div>
                            <div className="flex items-end">
                                <CustomButton
                                    text="중복 확인"
                                    onClick={onClickNicknameCheck}
                                ></CustomButton>
                            </div>
                        </div>
                        <div className="flex justify-start space-x-1">
                            <div className="w-full flex flex-col items-start justify-center">
                                <label>
                                    비밀번호&nbsp;<span className="text-red-500">*</span>
                                </label>
                                <CustomInput
                                    className="bg-gray-200 p-1"
                                    placeholder="비밀번호 입력"
                                    onChange={onChangePassword}
                                    type={"password"}
                                    ref={passwordRef}
                                />
                            </div>
                            <div className="">
                                <div className="w-20"></div>
                            </div>
                        </div>
                        <div className="flex justify-start space-x-1">
                            <div className="w-full flex flex-col items-start justify-center">
                                <label>
                                    비밀번호 확인&nbsp;<span className="text-red-500">*</span>
                                </label>

                                <CustomInput
                                    className="bg-gray-200 p-1"
                                    placeholder="비밀번호 재입력"
                                    type={"password"}
                                    onChange={onChangePasswordCheck}
                                    ref={passwordCheckRef}
                                />
                            </div>
                            <div className="">
                                <div className="w-20"></div>
                            </div>
                        </div>
                        <div className="flex justify-start space-x-1">
                            <div className="w-full flex flex-col items-start justify-center">
                                <div className="w-full flex items-center justify-between">
                                    <label>
                                        전화번호&nbsp;<span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs" style={{ color: phoneMessageColor }}>
                                        {phoneMessage}
                                    </span>
                                </div>
                                <CustomInput
                                    className="bg-gray-200 p-1"
                                    placeholder="ex) 01012345678"
                                    onChange={onChangePhone}
                                    ref={phoneRef}
                                />
                            </div>
                            <div className="flex items-end">
                                <CustomButton
                                    text="중복확인"
                                    onClick={onClickPhoneAuthentication}
                                ></CustomButton>
                            </div>
                        </div>
                        <div className="flex justify-start space-x-1">
                            <div className="w-full flex flex-col items-start justify-center space-y-1">
                                <label>주소</label>
                                <CustomInput
                                    className="bg-gray-200 p-1"
                                    placeholder="주소"
                                    onChange={onChangeAddress}
                                    value={address}
                                />
                                <CustomInput
                                    className="bg-gray-200 p-1 mt-1"
                                    placeholder="상세 주소"
                                    onChange={onChangeDetailAddress}
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <CustomButton
                                    text="주소 찾기"
                                    onClick={openDaumModal}
                                ></CustomButton>
                                <div></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div>
                            <span className="text-red-600 text-sm">{descriptionMessage}</span>
                        </div>
                        <div className="w-full">
                            <CustomButton
                                text="회원 가입"
                                type="button"
                                size="full"
                                onClick={onClickSingUp}
                            ></CustomButton>
                        </div>
                    </div>
                </form>
            </div>
            {visibleModal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
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

export default SignUp;
