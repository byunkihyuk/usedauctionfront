import noimage from "./../images/noimage.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";

function ImageSlider(props) {
    const [images, setImages] = useState(null);
    useEffect(() => {
        setImages(props.images);
    }, [props.images]);
    const NextArrow = ({ onClick }) => {
        return (
            <div
                className="absolute top-[50%] -translate-y-1/2 right-0  w-8 h-20 flex items-center justify-center cursor-pointer text-2xl z-10 hover:bg-white rounded-full"
                onClick={onClick}
            >
                {">"}
            </div>
        );
    };

    const PrevArrow = ({ onClick }) => {
        return (
            <div
                className="absolute top-[50%] -translate-y-1/2 left-0 w-8 h-20 flex flex-col items-center justify-center  cursor-pointer text-2xl z-10 hover:bg-white rounded-full leading-loose"
                onClick={onClick}
            >
                {"<"}
            </div>
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div>
            {images && images.length > 1 ? (
                <Slider {...settings} className="flex">
                    {images &&
                        images.map((item, index) => (
                            <img
                                key={index}
                                src={`${item != null ? item.uploadUrl : noimage}`}
                                alt={item.originName}
                                className="pc:h-[472px] pc:w-[500px] mobile:w-96 mobile:h-80 object-cover"
                            ></img>
                        ))}
                </Slider>
            ) : (
                images && (
                    <img
                        src={images[0].uploadUrl}
                        alt={images[0].originName}
                        className="pc:h-[472px] pc:w-[500px] mobile:w-96 mobile:h-80 object-cover"
                    ></img>
                )
            )}
        </div>
    );
}
export default ImageSlider;
