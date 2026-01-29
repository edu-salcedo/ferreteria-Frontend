import { useParams } from "react-router-dom";
import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
    const { id } = useParams();
    const { data: product, loading, error } = useApi(`products/${id}`);
    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);

    if (loading) {
        return <div className="text-center mt-10 text-gray-500">Cargando producto...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">Error al cargar el producto</div>;
    }

    if (!product) return null;

    const outOfStock = product.stock === 0;

    const handleAddToCart = () => {
        addToCart(
            {
                id: product.id,
                name: product.name,
                price: product.price,
                finalPrice: product.finalPrice,
                img: product.img,
            },
            quantity
        );

    };

    return (
        <div className="max-w-7xl mx-auto mt-10 px-4 md:px-8 text-gray-800">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Imagen */}
                <div className="md:w-1/2">
                    <img
                        src={`http://localhost:8080${product.img}`}
                        alt={product.name}
                        className="w-full h-[400px] object-contain border rounded-lg"
                    />
                </div>

                {/* Info */}
                <div className="md:w-1/2">
                    <p className="text-sm text-gray-500 mb-2">
                        {outOfStock ? "Sin stock" : `${product.stock} disponibles`}
                    </p>

                    <h1 className="text-3xl font-semibold mb-3">
                        {product.name}
                    </h1>

                    <p className="text-4xl text-green-600 font-bold mb-6">
                        ${product.finalPrice.toLocaleString()}
                    </p>

                    {!outOfStock && (
                        <div className="mb-6">
                            <label className="block text-sm mb-2">Cantidad</label>
                            <select
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                className="border rounded-lg px-3 py-2 w-28"
                            >
                                {Array.from({ length: product.stock }, (_, i) => i + 1).map(q => (
                                    <option key={q} value={q}>{q}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            disabled={outOfStock}
                            onClick={handleAddToCart}
                            className={`py-3 rounded-lg text-lg font-semibold 
                                ${outOfStock
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600 text-white"
                                }`}
                        >
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>

            {/* Descripción */}
            <div className="mt-12 border-t pt-6">
                <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
                <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                </p>
            </div>
        </div>
    );
}
