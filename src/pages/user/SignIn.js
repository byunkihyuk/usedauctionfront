import { useRef, useState } from "react";
import Layouts from "../../components/Layout";
import CustomButton from "../../components/CustomButton";
import { useNavigate } from "react-router-dom";
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
        // axios
        //     .post("/api/sign-in", {
        //         username: username,
        //         password: password,
        //     })
        //     .then((res) => res.data)
        //     .then((res) => {
        //         console.log(res);
        //         if (res.status === "success") {
        //             axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        //             movePage("/");
        //         } else {
        //             setDescriptionMessage(res.data.message);
        //         }
        //     })
        //     .catch((res) => {
        //         console.log(res);
        //         if (res.response.data.status !== "success") {
        //             setDescriptionMessage(res.response.data.message);
        //         }
        //     });

        fetch("/api/sign-in", {
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
                    movePage("/");
                    localStorage.setItem("loginToken", res.data.token);
                } else if (res.status === "error") {
                    setDescriptionMessage(res.message);
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
            <div className="w-80 h-auto p-10 flex flex-col items-center justify-center  space-y-10 border-purple-600 border-[1px] rounded-xl">
                <div className="bg-gray-400 w-full h-24">아이콘</div>
                <div className="flex w-full flex-col items-start justify-center">
                    <label htmlFor="username">아이디</label>
                    <CustomInput
                        ref={usernameRef}
                        id={"username"}
                        placeholder="아이디 입력"
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
                        <p>
                            <a href="/">아이디 / 비밀번호 찾기</a>
                        </p>
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
