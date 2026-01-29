import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ id, img, name, priceBase, description, margin, finalPrice, showModal }) => {

    return (
        <div
        // to={`/producto/${id}`}
        // className="bg-white rounded-lg shadow-md p-4 
        //            hover:shadow-xl hover:-translate-y-1 
        //            transition-all duration-300 
        //            flex flex-col text-center"
        >
            {/* Imagen */}
            <Link
                to={`/producto/${id}`} className="w-full h-40 flex items-center justify-center mb-4">
                <img
                    src={`http://localhost:8080${img}`}
                    alt={name}
                    className="max-h-full object-contain"
                />
            </Link>

            {/* Nombre */}
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {name}
            </h3>

            {/* Descripción */}
            {description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {margin}
                </p>
            )}

            {/* Precio */}
            {priceBase && (
                <div className="text-xl font-bold mt-auto flex justify-around">
                    <p className="text-gray-500">${priceBase}</p>
                    <p className="text-green-500 font-bold">${finalPrice}</p>
                </div>
            )}
            <button
                onClick={showModal}
                className="mt-2 bg-blue-500 cursor hover:bg-blue-600 text-white py-1 px-4 rounded-md transition-colors duration-200"
            >
                Agregar al carrito
            </button>
        </div>
    );
};

export default ProductCard;
