import { useRef, useState } from "react";
import Layouts from "../../components/Layout";
import CustomButton from "../../components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "../../components/CustomInput";

function SignIn() {
    const movePage = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassowrd] = useState("");
    const [descriptionMessage, setDescriptionMessage] = useState("");
    const usernameRef = useRef();
    const passwordRef = useRef();

    function onChangeUsername(e) {
        setUsername(e.target.value);
    }

    function onChangePassword(e) {
        setPassowrd(e.target.value);
    }

    function signIn() {
        if (username == null || username === "") {
            setDescriptionMessage("아이디를 입력해주세요.");
            usernameRef.current.focus();
            return;
        }
        if (password == null || password === "") {
            setDescriptionMessage("비밀번호를 입력해주세요.");
            passwordRef.current.focus();
            return;
        }

        fetch(`${process.env.REACT_APP_CLIENT_IP}/api/sign-in`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    localStorage.setItem("nickname", res.data.nickname);
                    localStorage.setItem("loginToken", res.data.token);
                    let loginTime = new Date();
                    // 로그인 만료시간 1시간
                    localStorage.setItem("loginInfo", loginTime.getTime() + 3600000);
                    movePage("/");
                    alert("Token console 확인");
                    console.log(res.data.token);
                } else {
                    setDescriptionMessage(res.message);
                }
            })
            .catch((err) => console.log(err));
    }

    function signUp() {
        movePage("/sign-up");
    }

    return (
        <Layouts>
            <div className="w-80 h-auto p-10 flex flex-col items-center justify-center  space-y-10 rounded-xl">
                <Link
                    to={"/"}
                    className="p-2 cursor-pointer"
                    //onClick={mainPage}
                >
                    <p className="font-bold text-purple-500 text-lg">usedauction</p>
                </Link>
                <div className="flex w-full flex-col items-start justify-center">
                    <label htmlFor="username">아이디</label>
                    <CustomInput
                        ref={usernameRef}
                        id={"username"}
                        placeholder="아이디 입력(E-mail)"
                        onChange={onChangeUsername}
                    />
                </div>
                <div className="flex w-full flex-col items-start justify-center">
                    <label htmlFor="password">비밀번호</label>
                    <CustomInput
                        ref={passwordRef}
                        id={"password"}
                        placeholder="비밀번호 입력"
                        onChange={onChangePassword}
                        type={"password"}
                    />
                </div>
                <div>
                    <span className="text-red-600 text-xs">{descriptionMessage}</span>
                </div>
                <div className="flex flex-col w-full space-y-2">
                    <div className="w-full text-sm text-purple-600">
                        <div className="cursor-pointer" onClick={() => movePage("/findPw")}>
                            비밀번호 찾기
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4 w-full">
                        <CustomButton text="로그인" onClick={signIn} size={"full"}></CustomButton>
                        <CustomButton text="회원가입" onClick={signUp} size={"full"}></CustomButton>
                    </div>
                </div>
            </div>
        </Layouts>
    );
}

export default SignIn;
