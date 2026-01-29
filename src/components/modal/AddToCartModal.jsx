import { useState } from "react";

const AddToCartModal = ({ product, isOpen, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    ✖
                </button>

                <div className="flex">
                    <div className="w-1/3">
                        <img src={`http://localhost:8080${product.img}`} alt="" />
                    </div>
                    <div className="w-2/3">
                        {/* Contenido */}
                        <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
                        <p className="mb-2">Precio: ${product.finalPrice.toLocaleString()}</p>
                        <p className="mb-4">{product.description}</p>

                        {/* Selección de cantidad */}
                        <div className="flex items-center mb-4">
                            <span className="mr-2">Cantidad:</span>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                className="border rounded px-2 py-1 w-20"
                            />
                        </div>
                    </div>
                </div>

                {/* Botón agregar */}
                <button
                    onClick={() => {
                        onAddToCart(product, quantity);
                        onClose();
                        setQuantity(1); // reset cantidad   
                    }}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Agregar al carrito
                </button>

            </div>
        </div>
    );
};

export default AddToCartModal;
