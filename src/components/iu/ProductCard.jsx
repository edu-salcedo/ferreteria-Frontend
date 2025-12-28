import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ id, img, name, price, description }) => {
    return (
        <Link
            to={`/producto/${id}`}
            className="bg-white rounded-lg shadow-md p-4 
                       hover:shadow-xl hover:-translate-y-1 
                       transition-all duration-300 
                       flex flex-col text-center"
        >
            {/* Imagen */}
            <div className="w-full h-40 flex items-center justify-center mb-4">
                <img
                    src={`http://localhost:8080${img}`}
                    alt={name}
                    className="max-h-full object-contain"
                />
            </div>

            {/* Nombre */}
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {name}
            </h3>

            {/* Descripción */}
            {description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {description}
                </p>
            )}

            {/* Precio */}
            {price && (
                <p className="text-xl font-bold text-gray-900 mt-auto">
                    ${price}
                </p>
            )}
        </Link>
    );
};

export default ProductCard;
