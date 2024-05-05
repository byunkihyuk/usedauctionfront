import Footer from "./Footer";
import Header from "./Header";

function Layouts(props) {
    return (
        <section className="relative  w-full h-full scroll-auto flex flex-col items-center justify-center">
            <Header />
            <section className="top-0 py-16 h-full min-h-[600px] lg:max-w-[1000px] sm:w-auto  ">
                {props.children}
            </section>
            <Footer />
        </section>
    );
}

export default Layouts;
