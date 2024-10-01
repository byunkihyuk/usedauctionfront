import React from "react";
import noimage from "../images/noimage.png";
import searchGray from "../images/search-gray.svg";
import search from "../images/search.png";
import x from "../images/x.png";
import notification from "../images/notification.svg";

function Footer() {
    return (
        <footer className="relative bottom-0 w-full h-20 min-h-20 bg-gray-100 p-4 flex justify-center z-0">
            <div className="p-2 flex flex-col ">
                <div className="text-sm text-gray-600">
                    <ul className="flex gap-1 items-center justify-center">
                        사용 이미지 출처
                        <li>
                            <a target="_blank" rel="noopener noreferrer" href="https://icons8.com">
                                <img alt={noimage} src={noimage} height={16} width={16} />
                            </a>
                        </li>
                        <li>
                            <a target="_blank" rel="noopener noreferrer" href="https://icons8.com">
                                <img alt={searchGray} src={searchGray} height={16} width={16} />
                            </a>
                        </li>
                        <li>
                            <a target="_blank" rel="noopener noreferrer" href="https://icons8.com">
                                <img alt={search} src={search} height={16} width={16} />
                            </a>
                        </li>
                        <li>
                            <a target="_blank" rel="noopener noreferrer" href="https://icons8.com">
                                <img alt={x} src={x} height={16} width={16} />
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://icons8.com/icon/16008/notification"
                            >
                                <img alt={notification} src={notification} height={16} width={16} />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="text-sm text-gray-600">Email : rlgur1099@gmail.com</div>
            </div>
            {/* <table className="text-gray-600 text-sm">
        <tbody>
          <tr>
            <th>사용된 링크</th>
            <td>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://icons8.com/icon/8112/close"
              >
                X 이미지
              </a>
            </td>
            <td>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="/swagger-ui-bandee.html"
              >
                문서 api
              </a>
            </td>
          </tr>
          <tr>
            <th>출처</th>
            <td>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://icons8.com"
              >
                Icons8
              </a>
            </td>
            <td>
              <a target="_blank" rel="noopener noreferrer" href="/demo-ui.html">
                문서 api
              </a>
            </td>
          </tr>
        </tbody>
      </table> */}
        </footer>
    );
}

export default Footer;
