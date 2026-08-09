import { useState } from "react";

const baseUrl = import.meta.env.VITE_API_URL;

const AddToCartModal = ({ product, isOpen, onClose, onAddToCart }) => {
    // Manejamos las cantidades de cada variante de forma independiente indexadas por su ID
    const [quantities, setQuantities] = useState({});

    if (!isOpen || !product) return null;

    // Incrementa la cantidad de una variante específica respetando su stock máximo
    const handleIncrement = (variantId, stock) => {
        setQuantities((prev) => {
            const current = prev[variantId] || 0;
            if (current >= stock) return prev;
            return { ...prev, [variantId]: current + 1 };
        });
    };

    // Decrementa la cantidad sin bajar de cero
    const handleDecrement = (variantId) => {
        setQuantities((prev) => {
            const current = prev[variantId] || 0;
            if (current <= 0) return prev;
            return { ...prev, [variantId]: current - 1 };
        });
    };

    // Confirmación final: envía todas las variantes que tengan una cantidad mayor a 0
    const handleConfirm = () => {
        Object.entries(quantities).forEach(([variantId, qty]) => {
            if (qty > 0) {
                const variant = product.variants.find((v) => v.id === Number(variantId));
                if (variant) onAddToCart(variant, qty, product);
            }
        });
        setQuantities({});
        onClose();
    };

    // Verifica si el usuario seleccionó al menos una unidad de cualquier variante
    const hasItemsSelected = Object.values(quantities).some((qty) => qty > 0);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-xl p-5 rounded-lg shadow-xl relative text-gray-800 flex items-center gap-6">

                {/* 1. Columna Izquierda: Imagen y nombre del producto */}
                <div className="flex flex-col items-center justify-center p-2 rounded">
                    <div className="w-44 text-center">
                        <div className="flex justify-center mb-4">
                            <img src={`${baseUrl}${product.img}`} className="w-44 h-44 object-contain" alt={product.name} />
                        </div>
                        {/* Encabezado e Información de Marca centrada */}
                        <div className="mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-1">
                                {product.name}
                            </h2>
                            {product.brand && (
                                <p className="text-xs text-gray-500">
                                    Marca: <span className="font-semibold text-gray-700">{product.brand}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Columna Derecha: Cuerpo del modal (Se agrega flex-1 para expandirse y centrar) */}
                <div className="flex-1">
                    {/* Botón de Cierre Superior */}
                    <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg" onClick={onClose}>
                        ✕
                    </button>

                    {/* Lista de Variantes e Selectores */}
                    <div className="divide-y divide-gray-100 mb-5 p-2 rounded">
                        {product.variants.map((v) => {
                            const currentQty = quantities[v.id] || 0;
                            return (
                                <div key={v.id} className="py-3 flex items-center justify-between gap-4">
                                    {/* Código y Medida */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">
                                            {v.sku || ""} <span className="ml-2 font-normal text-gray-600">{v.measure}</span>
                                        </p>
                                        <p className="text-[11px] text-gray-400">Stock : {v.stock}</p>
                                    </div>
                                    {/* Precio */}
                                    <div className="text-sm font-bold text-black-600 whitespace-nowrap">
                                        ${Number(v.salePrice).toLocaleString("es-AR")}{" "}
                                        <span className="text-[10px] font-normal text-gray-400 uppercase">/un</span>
                                    </div>
                                    {/* Controles de Selección de Cantidad */}
                                    <div className="flex items-center bg-gray-100 rounded overflow-hidden h-8 w-28 border border-gray-200">
                                        <button type="button" onClick={() => handleDecrement(v.id)} className="w-8 h-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg flex items-center justify-center transition-colors select-none"> – </button>
                                        <div className="flex-1 text-center bg-white h-full flex items-center justify-center text-xs font-semibold">
                                            {currentQty > 0 ? `${currentQty} UN` : ""}
                                        </div>
                                        <button type="button" onClick={() => handleIncrement(v.id, v.stock)} className="w-8 h-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg flex items-center justify-center transition-colors select-none"> + </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Botón de Confirmación Inferior */}
                    <button disabled={!hasItemsSelected} className={`w-full py-2.5 rounded font-bold text-sm tracking-wide text-white uppercase shadow-sm transition-colors ${hasItemsSelected ? "bg-blue-500 hover:bg-blue-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`} onClick={handleConfirm}>
                        Agregar Producto
                    </button>
                </div>

            </div>
        </div>

    );
};

export default AddToCartModal;
