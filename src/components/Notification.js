import CustomButton from "./CustomButton";

function Notification({ item, index, onClickReadNotification, onClickNotification, ...props }) {
    function notificationDateFormat(createdAt) {
        let now = new Date();
        let date = new Date(createdAt);
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        if (now.getDate() > day) {
            if (now.getFullYear() > year) {
                return now.getFullYear() - year + "년 전";
            } else if (now.getMonth() > month) {
                return now.getMonth() - month + "개월 전";
            } else {
                return now.getDate() - day + "일 전";
            }
        } else {
            if (now.getHours() == hour) {
                return minutes + "분 전";
            } else {
                return now.getHours() - hour + "시간 전";
            }
        }
    }

    return (
        <div
            className="relative  rounded-lg w-full
                                         h-auto flex flex-col items-start justify-start p-1 pc:text-sm mobile:text-xs
                                         cursor-pointer bg-white hover:bg-gray-100 "
            onClick={() => onClickNotification(item)}
        >
            {item.readornot == true && (
                <div className="absolute w-full h-full top-0 left-0 rounded-lg opacity-50 bg-gray-100"></div>
            )}
            <div className="h-8 w-full flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div>{notificationDateFormat(item.createdAt)}</div>
                    {item.read == false && <div className="text-green-600">new</div>}
                </div>
                {item.readornot === false && (
                    <div className="w-12">
                        <CustomButton
                            text={"읽기"}
                            size={"full"}
                            onClick={() => onClickReadNotification(item, index)}
                        ></CustomButton>
                    </div>
                )}
            </div>
            <div className="w-full min-h-6 h-auto flex items-start mobile:text-sm">
                {item.message}
            </div>
        </div>
    );
}

export default Notification;
