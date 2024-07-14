import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Header2 from "./Header2";

function Layouts(props) {
    // const pc_platform = "win16|win32|win64|mac|macintel";
    // const platForm = platformChk();

    // function platformChk() {
    //     if (0 > pc_platform.indexOf(navigator.platform.toLowerCase())) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    const [platForm, setPlatForm] = useState(null);

    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        return { width, height };
    };

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions());
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (windowDimensions.width >= 1024) {
            setPlatForm(true);
        } else {
            setPlatForm(false);
        }
    }, [windowDimensions]);

    return (
        <section className="relative  w-full h-full scroll-auto flex flex-col items-center justify-center">
            {platForm ? <Header /> : <Header2 />}
            <section className="top-0 py-16 h-full min-h-[600px] flex justify-center w-auto pc:min-w-[1000px] mobile:min-w-96">
                {props.children}
            </section>
            <Footer />
        </section>
    );
}

export default Layouts;
