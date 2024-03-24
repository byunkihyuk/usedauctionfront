import Footer from "./Footer";
import Header from "./Header";

function Layouts(props) {
    return (
        <section className="relative  w-full h-full scroll-auto flex flex-col">
            <Header />
            <section className="relative top-0 py-5 h-auto min-h-[600px] min-w-[1000px] w-full flex flex-col items-center justify-center ">
                {props.children}
            </section>
            <Footer />
        </section>
    );
}

export default Layouts;
