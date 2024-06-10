import { useRef, useState } from "react";
import Layouts from "../../components/Layout";
import CustomButton from "../../components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "../../components/CustomInput";

function FindPassword() {
  const movePage = useNavigate();
  const [username, setUsername] = useState("");
  const [descriptionMessage, setDescriptionMessage] = useState("");
  const usernameRef = useRef();

  function onChangeUsername(e) {
    setUsername(e.target.value);
  }

  function sendTemporaryPassword() {
    if (username == null || username === "") {
      setDescriptionMessage("아이디를 입력해주세요.");
      usernameRef.current.focus();
      return;
    }

    fetch(`${process.env.REACT_APP_CLIENT_IP}/api/find-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          alert(res.message);
          movePage("/sign-in");
        } else {
          alert(res.message);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <Layouts>
      <div className="w-80 h-auto p-10 flex flex-col items-center justify-center  space-y-10  rounded-xl">
        <Link
          to={"/"}
          className="p-2 cursor-pointer"
          //onClick={mainPage}
        >
          <p className="font-bold text-purple-500 text-lg">usedauction</p>
        </Link>
        <div className="w-full  h-10 flex text-lg font-bold items-center justify-center">
          비밀번호 찾기
        </div>
        <div className="flex w-full flex-col items-start justify-center">
          <div className="w-full flex items-center justify-between">
            <label htmlFor="username">{"아이디(Email)"}</label>
            <span className="text-red-500 text-xs text-right">
              {descriptionMessage}
            </span>
          </div>
          <CustomInput
            ref={usernameRef}
            id={"username"}
            placeholder="아이디 입력(Email)"
            onChange={onChangeUsername}
          />
        </div>
        <div className="flex flex-col w-full space-y-2">
          <div className="flex items-center justify-center space-x-4 w-full">
            <CustomButton
              text="임시비밀번호 전송"
              onClick={sendTemporaryPassword}
              size={"full"}
            ></CustomButton>
          </div>
        </div>
      </div>
    </Layouts>
  );
}

export default FindPassword;
