import { forwardRef, useRef, useState } from "react";
import { ReactComponent as SearchIcon } from "../images/search-gray.svg";
import { ReactComponent as XIcon } from "../images/x.svg";
import { useNavigate } from "react-router-dom";

const CustomInput = forwardRef(
    (
        { placeholder, onChange, onKeyDown, value, id, size, type, disabled, onClickTextDelete },
        ref
    ) => {
        const [typing, setTyping] = useState(false);
        const deleteRef = useRef(null);
        const movePage = useNavigate();
        if (size == null) {
            size = "w-full";
        } else if (size === "search") {
            size = "w-60";
        }

        var searchType = false;
        var passwordType = false;
        if (type === "search") {
            searchType = true;
            type = null;
        } else if (type === "password") {
            passwordType = true;
        }

        return (
            <div className={`relative ${size} `}>
                <input
                    ref={ref}
                    id={id}
                    className={`rounded-md p-1 border-2   w-full ${
                        disabled
                            ? " bg-gray-100 border-purple-200"
                            : "outline-purple-500 border-purple-300"
                    }`}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    type={type}
                    disabled={disabled}
                    onFocus={() => setTyping(true)}
                    onBlur={(e) => {
                        if (
                            (ref && ref.current != e.target) ||
                            (deleteRef && deleteRef.current != e.target)
                        ) {
                            setTyping(false);
                        } else {
                        }
                    }}
                ></input>
                {passwordType && <i className="absolute top-2 right-2 cursor-pointer w-2 h-2"></i>}
                {
                    searchType && (
                        // (!typing ? (
                        <SearchIcon
                            className="absolute top-[6px] bottom-0 right-2 cursor-pointer outline-red-500"
                            height={24}
                            width={24}
                            onClick={() => movePage(`/search?keyword=${value}`)}
                        ></SearchIcon>
                    )
                    // ) : (
                    //     <XIcon
                    //         className="absolute top-[8px] bottom-0 right-2 cursor-pointer outline-red-500"
                    //         height={20}
                    //         width={20}
                    //         onClick={onClickTextDelete}
                    //         ref={deleteRef}
                    //     ></XIcon>
                    // ))
                }
            </div>
        );
    }
);
export default CustomInput;
