import { useEffect, useRef, useState } from "react";
import CustomButton from "../../components/CustomButton";
import Layouts from "../../components/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomInput from "../../components/CustomInput";
import DaumPostcode from "react-daum-postcode";
import { ReactComponent as CloseIcon } from "../../images/x.svg";

function UserInfoUpdate() {
  const movePage = useNavigate();
  const location = useLocation();
  const userId = location.state.userId;
  const [data, setData] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameMessageColor, setNicknameMessageColor] = useState("red");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [nicknameCheck, setNicknameCheck] = useState(true);
  const [changePassword, setChangePassword] = useState("");
  const [changePasswordCheck, setChangePasswordCheck] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneAuthentication, setPhoneAuthentication] = useState(true);
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [descriptionMessage, setDescriptionMessage] = useState("");

  const nicknameRef = useRef(null);
  const passwordRef = useRef(null);
  const changePasswordRef = useRef(null);
  const changePasswordCheckRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_CLIENT_IP}/api/user?user-id=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          setData(res.data);
          setUsername(res.data.username);
          setNickname(res.data.nickname);
          setPhone(res.data.phone);
          setAddress(res.data.address);
          setDetailAddress(res.data.detailAddress);
        } else {
          alert(res.message);
        }
      })
      .catch((error) => console.log(error));
  }, [userId]);

  function onChangeNickname(e) {
    setNickname(e.target.value);
    setNicknameCheck(false);
    setNicknameMessage("");
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
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setAddress(fullAddress);
    setVisibleModal(false);
  }

  function openDaumModal() {
    setVisibleModal(true);
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

  function onClickphoneAuthentication() {
    fetch(`${process.env.REACT_APP_CLIENT_IP}/api/sign-up/phone-check`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
      },
      body: JSON.stringify({
        phone: phone,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          setPhoneAuthentication(true);
        } else {
        }
      })
      .catch((error) => console.log(error));
  }

  function onSubmit(e) {
    e.preventDefault();
    setDescriptionMessage();

    // 닉네임 입력
    if (nickname == null || nickname === "") {
      setDescriptionMessage("닉네임을 입력하세요.");
      nicknameRef.current.focus();
      return;
    }
    // 닉네임 중복확인
    if ((data.nickname != nickname) & (nicknameCheck === false)) {
      setDescriptionMessage("닉네임 중복 확인이 필요합니다.");
      nicknameRef.current.focus();
      return;
    }
    if (changePassword !== "") {
      //비밀번호 일치한지
      if (changePasswordCheck !== changePassword) {
        changePasswordCheckRef.current.focus();
        setDescriptionMessage("비밀번호가 일치하지 않습니다.");
        return;
      }
    }
    // 현재 비밀번호 확인
    if (password == null || password === "") {
      setDescriptionMessage("비밀번호를 입력하세요.");
      passwordRef.current.focus();
      return;
    }
    // 전화번호 입력
    if (phone == null || phone === "") {
      phoneRef.current.focus();
      setDescriptionMessage("전화번호를 입력하세요.");
      return;
    }
    // 전화번호 인증
    if ((data.phone != phone) & (phoneAuthentication === false)) {
      phoneRef.current.focus();
      setDescriptionMessage("번호 인증을 해주세요.");
      return;
    }
    fetch(`${process.env.REACT_APP_CLIENT_IP}/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
      },
      body: JSON.stringify({
        username: username,
        nickname: nickname,
        password: password,
        changePassword: changePassword,
        phone: phone,
        address: address,
        detailAddress: detailAddress,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          alert("정보 수정 성공");
          movePage(`/user?user-id=${userId}`);
        } else {
          setDescriptionMessage(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <Layouts>
      <div className="relative w-80 h-auto min-h-[500px] flex flex-col space-y-5">
        <form className="flex flex-col space-y-5" onSubmit={onSubmit}>
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
                </div>
                <CustomInput
                  id="id"
                  className=" p-1"
                  placeholder="아이디 입력"
                  value={username}
                  disabled={true}
                />
              </div>
              <div className="w-auto flex items-end">
                <div className="w-20"></div>
              </div>
            </div>
            <div className="flex justify-start space-x-1">
              <div className=" w-full flex flex-col items-start justify-center">
                <div className="w-full flex items-center justify-between">
                  <label>
                    닉네임&nbsp;<span className="text-red-500">*</span>
                  </label>
                  <span
                    className="text-sm"
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
                  value={nickname}
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
                  변경 비밀번호&nbsp;<span className="text-red-500">*</span>
                </label>
                <CustomInput
                  className="bg-gray-200 p-1"
                  placeholder="비밀번호 입력"
                  type={"password"}
                  onChange={(e) => setChangePassword(e.target.value)}
                  ref={changePasswordRef}
                  value={changePassword}
                />
              </div>
              <div className="">
                <div className="w-20"></div>
              </div>
            </div>
            <div className="flex justify-start space-x-1">
              <div className="w-full flex flex-col items-start justify-center">
                <label>
                  변경 비밀번호 확인&nbsp;
                  <span className="text-red-500">*</span>
                </label>
                <CustomInput
                  className="bg-gray-200 p-1"
                  placeholder="비밀번호 재입력"
                  onChange={(e) => setChangePasswordCheck(e.target.value)}
                  type={"password"}
                  ref={changePasswordCheckRef}
                  value={changePasswordCheck}
                />
              </div>
              <div className="">
                <div className="w-20"></div>
              </div>
            </div>
            <div className="flex justify-start space-x-1">
              <div className="w-full flex flex-col items-start justify-center">
                <label>
                  현재 비밀번호&nbsp;<span className="text-red-500">*</span>
                </label>

                <CustomInput
                  className="bg-gray-200 p-1"
                  placeholder="현재 비밀번호 입력"
                  onChange={(e) => setPassword(e.target.value)}
                  type={"password"}
                  ref={passwordRef}
                  value={password}
                />
              </div>
              <div className="">
                <div className="w-20"></div>
              </div>
            </div>
            <div className="flex justify-start space-x-1">
              <div className="w-full flex flex-col items-start justify-center">
                <label>
                  전화번호&nbsp;<span className="text-red-500">*</span>
                </label>
                <CustomInput
                  className="bg-gray-200 p-1"
                  placeholder="번호 입력"
                  onChange={onChangePhone}
                  ref={phoneRef}
                  value={phone}
                />
              </div>
              <div className="flex items-end">
                <CustomButton
                  text="중복 확인"
                  onClick={onClickphoneAuthentication}
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
                  value={detailAddress}
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
            <div className="w-full flex space-x-2">
              <CustomButton
                text="정보 수정"
                type="submit"
                size="full"
              ></CustomButton>
              <CustomButton
                text="취소"
                type="button"
                onClick={() => movePage(-1)}
                size="full"
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

export default UserInfoUpdate;
