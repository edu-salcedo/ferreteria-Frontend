import { useState, useEffect } from "react";

const slides = [
    { id: 1, imageUrl: "/src/assets/smerilBanner.webp", alt: "Slide 1" },
    { id: 2, imageUrl: "https://picsum.photos/id/1016/800/400", alt: "Slide 2" },
    { id: 3, imageUrl: "https://picsum.photos/id/1018/800/400", alt: "Slide 3" },
    { id: 4, imageUrl: "https://picsum.photos/id/1020/800/400", alt: "Slide 4" },
];
const Slider = () => {
    const [current, setCurrent] = useState(0)
    const totalSlides = slides.length

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % totalSlides)
    }

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides)
    }

    return (
        <div className="relative w-screen overflow-hidden bg-red-700 mt-5">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${current * 100}%)` }}
            >    {/*1150  550*/}
                {slides.map((slide) => (
                    <div key={slide.id} className="w-screen h-[300px] sm:h-[300px] md:h-[400px] lg:h-[400px] shrink-0">
                        <img src={slide.imageUrl} alt={slide.alt} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            {/* Botones */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2  text-white px-2 py-1 rounded shadow text-lg"
            >
                ❮
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white px-2 py-1 rounded shadow"
            >
                ❯
            </button>
        </div>
    )
}

export default Slider