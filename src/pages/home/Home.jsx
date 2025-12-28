import Slider from "../../components/iu/Slider";
import HomeCard from "../../components/iu/HomeCard";

import { FeaturedProducts, Category } from "../../data/data";

const Home = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center">
            <div className="relative w-full flex flex-col items-center">
                {/* SLIDER */}
                <div className="z-10 w-full">
                    <Slider />
                </div>

                {/* TARJETAS - debajo del slider */}
                <div className="z-20 -mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-5xl">
                    {Category.map((category) => (
                        <HomeCard
                            key={category.id}
                            img={category.imageUrl}
                            title={category.name}
                            description={category.description}
                        />
                    ))}

                </div>
            </div>
            <div className="con">
                <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-6">Productos Destacados</h2>
            </div>
        </div>
    );
}
export default Home;
