import React from "react";

function Footer() {
    return (
        <footer className="relative bottom-0 min-w-[1000px] w-full h-20 min-h-20 bg-gray-200 p-4 flex z-0">
            <table className="text-gray-600 text-sm">
                <tbody>
                    <tr>
                        <th>사용된 링크</th>
                        <td>
                            <a target="_blank" href="https://icons8.com/icon/8112/close">
                                지우다
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th>작가</th>
                        <td>
                            <a target="_blank" href="https://icons8.com">
                                Icons8
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </footer>
    );
}

export default Footer;
