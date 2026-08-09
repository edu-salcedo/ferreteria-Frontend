import { Link } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL;

const ProductCard = ({ product, showModal }) => {

    const {
        id,
        img,
        name,
        description,
        variants = []
    } = product;

    const minPrice = variants.length
        ? Math.min(...variants.map(v => v.salePrice))
        : 0;

    const totalStock = variants.reduce(
        (acc, v) => acc + (v.stock || 0),
        0
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">

            {totalStock === 0 && (
                <div className="absolute bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    !
                </div>
            )}

            {/* CLICK EN IMAGEN ABRE MODAL */}
            <div
                className="cursor-pointer flex justify-center mb-3"
                onClick={showModal}
            >
                <img
                    src={`http://localhost:8080${img}`}
                    alt={name}
                    className="h-28 object-contain"
                />
            </div>

            <h3 className="font-semibold">{name}</h3>

            <p className="text-sm text-gray-500 line-clamp-2">
                {description}
            </p>

            <div className="mt-2">
                <p className="text-green-600 font-bold">
                    Desde ${minPrice.toLocaleString()}
                </p>

                <p className="text-xs text-gray-400">
                    {variants.length} variantes
                </p>
            </div>

        </div>
    );
};

export default ProductCard;