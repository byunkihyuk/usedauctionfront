function ChatRoom({ nickname, messageTime, message, productImg, onClickChatRoomHandle, bgColor }) {
    function dateFormat() {
        let now = new Date();
        let lastTime = new Date(messageTime);

        if (now.getFullYear() - lastTime.getFullYear() > 0) {
            return lastTime.getFullYear() + "." + lastTime.getMonth() + "." + lastTime.getDate();
        } else {
            if (now.getMonth() - lastTime.getMonth() > 0) {
                return lastTime.getMonth() + "월 " + lastTime.getDate() + "일";
            } else {
                if (lastTime.getHours() < 12) {
                    return (
                        "오전 " +
                        lastTime.getHours() +
                        ":" +
                        (lastTime.getMinutes() > 10
                            ? lastTime.getMinutes()
                            : "0" + lastTime.getMinutes())
                    );
                } else {
                    return (
                        "오후 " +
                        (lastTime.getHours() - 12) +
                        ":" +
                        (lastTime.getMinutes() > 10
                            ? lastTime.getMinutes()
                            : "0" + lastTime.getMinutes())
                    );
                }
            }
        }
    }

    return (
        <div
            className={`h-20 flex items-center justify-between cursor-pointer hover:bg-purple-100 ${bgColor}`}
            onClick={onClickChatRoomHandle}
        >
            <div className="h-full w-auto flex flex-col p-2">
                <div className="w-full h-10 flex items-center space-x-5">
                    <div>{nickname}</div>
                    <div className="text-sm text-gray-600">{dateFormat()}</div>
                </div>
                <div className="w-72 text-left overflow-hidden text-ellipsis text-nowrap">
                    {message}
                </div>
            </div>
            <img
                alt="제품 이미지"
                src={productImg}
                width={64}
                height={64}
                className="w-16 h-16 flex items-center justify-center m-2 rounded-lg border-[1pxs] border-gray-500 object-cover"
            ></img>
        </div>
    );
}

export default ChatRoom;
