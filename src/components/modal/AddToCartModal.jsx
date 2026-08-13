import { useState, useEffect } from "react";

const baseUrl = import.meta.env.VITE_API_URL;

const AddToCartModal = ({ product, isOpen, onClose, onAddToCart }) => {
    const [quantities, setQuantities] = useState({});

    // Bloquear el scroll de la página de fondo cuando el modal esté abierto
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const handleIncrement = (variantId, stock) => {
        setQuantities((prev) => {
            const current = prev[variantId] || 0;
            if (current >= stock) return prev;
            return { ...prev, [variantId]: current + 1 };
        });
    };

    const handleDecrement = (variantId) => {
        setQuantities((prev) => {
            const current = prev[variantId] || 0;
            if (current <= 0) return prev;
            return { ...prev, [variantId]: current - 1 };
        });
    };

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

    const hasItemsSelected = Object.values(quantities).some((qty) => qty > 0);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            {/* CONTENEDOR PRINCIPAL: Altura máxima estricta y orden vertical */}
            <div className="bg-white w-full max-w-xl rounded-lg shadow-xl relative text-gray-800 flex flex-col max-h-[85vh] overflow-hidden">

                {/* Botón de Cierre Superior Absoluto */}
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl z-10" onClick={onClose}>
                    ✕
                </button>

                {/* ENCABEZADO: Foto y nombre integrados en una fila superior (Fijo arriba, nunca se encoge) */}
                <div className="p-5 border-b border-gray-100 flex items-center gap-4 shrink-0 pr-12">
                    <img
                        src={`${baseUrl}${product.img}`}
                        className="w-16 h-16 object-contain bg-gray-50 p-1 rounded border"
                        alt={product.name}
                    />
                    <div>
                        <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">
                            {product.name}
                        </h2>
                        {product.brand && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                Marca: <span className="font-semibold text-gray-700">{product.brand}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* CUERPO CENTRAL CON SCROLL: Lista de variantes (Toma todo el espacio disponible) */}
                <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100 min-h-0">
                    {product.variants.map((v) => {
                        const currentQty = quantities[v.id] || 0;
                        return (
                            <div key={v.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                                {/* Información de la variante */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">
                                        {v.sku || ""} <span className="ml-2 font-normal text-gray-600">{v.measure}</span>
                                    </p>
                                    <p className="text-[11px] text-gray-400">Stock : {v.stock}</p>
                                </div>

                                {/* Precio */}
                                <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                    ${Number(v.salePrice).toLocaleString("es-AR")}{" "}
                                    <span className="text-[10px] font-normal text-gray-400 uppercase">/un</span>
                                </div>

                                {/* Controles numéricos */}
                                <div className="flex items-center bg-gray-100 rounded overflow-hidden h-8 w-28 border border-gray-200 shrink-0">
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

                {/* PIE DE PÁGINA: Botón de confirmación (Fijo abajo, nunca se mueve) */}
                <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0">
                    <button
                        disabled={!hasItemsSelected}
                        className={`w-full py-3 rounded font-bold text-sm tracking-wide text-white uppercase shadow-sm transition-colors ${hasItemsSelected ? "bg-blue-500 hover:bg-blue-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
                        onClick={handleConfirm}
                    >
                        Agregar Producto
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddToCartModal;
