import { useState } from "react";

function CustomButton({ text, color, textColor, size, onClick, type, disabled, option }) {
    if (size == null || size === "sm") {
        size = "w-20";
    } else if (size === "lg") {
        size = "w-40";
    } else if (size === "full") {
        size = "w-full";
    }

    if (color == null) {
        color = "bg-purple-600";
    }

    if (textColor == null) {
        textColor = "text-white";
    }

    return (
        <button
            type={type == null ? "button" : type}
            className={`rounded-md p-1 ${size} ${color} ${textColor} ${option}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text == null ? "텍스트 없음" : text}
        </button>
    );
}

export default CustomButton;
