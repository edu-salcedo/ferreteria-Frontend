import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import axios from "axios";

// Instancia de Axios configurada con la URL base de tus variables de entorno
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
});

const OrderModal = ({ order, products, show, onHide, onSave }) => {
    const [editedOrder, setEditedOrder] = useState(null);
    const [allVariants, setAllVariants] = useState([]);
    const [activeDropdownIdx, setActiveDropdownIdx] = useState(null);
    const [searchTerms, setSearchTerms] = useState({});
    // Efecto 1: Procesa los productos que llegan en la primera página por props
    useEffect(() => {
        if (!show) return;
        const rawProducts = products?.content || (Array.isArray(products) ? products : []);
        const processedVariants = [];

        rawProducts.forEach(product => {
            const variantsArray = product.variants || product.variantes || [];
            const productName = product.name || product.nombre || "Producto sin nombre";
            const productId = product.id;

            if (Array.isArray(variantsArray)) {
                variantsArray.forEach(variant => {
                    processedVariants.push({
                        ...variant,
                        id: String(variant.id),
                        parentName: productName,
                        productId: productId,
                        measure: variant.measure || variant.medida || "",
                        salePrice: variant.salePrice || variant.precioVenta || variant.price || 0,
                        purchasePrice: variant.purchasePrice || variant.precioCompra || 0,
                        stock: variant.stock || variant.cantidad || 0
                    });
                });
            }
        });

        setAllVariants(processedVariants);
    }, [products, show]);

    // Efecto 2: Estabiliza la orden y normaliza los artículos existentes
    useEffect(() => {
        if (order) {
            const normalizedItems = (order.items || order.detalles || order.lineas || []).map(item => ({
                ...item,
                variantId: item.variantId ? String(item.variantId) : (item.variant?.id ? String(item.variant?.id) : ""),
                productId: item.productId || "",
                productName: item.productName || item.product?.name || "",
                measure: item.measure || item.variant?.measure || "",
                quantity: item.quantity || 1,
                finalPrice: item.finalPrice || item.price || 0,
                purchasePrice: item.purchasePrice || item.basePrice || 0
            }));

            setEditedOrder({
                ...order,
                items: normalizedItems,
                isInvoice: order.isInvoice ?? false
            });
        }
    }, [order]);

    if (!show || !editedOrder) return null;
    // Petición dinámica en tiempo real al backend usando Axios
    const handleServerSearch = async (index, text) => {
        setSearchTerms(prev => ({ ...prev, [index]: text }));

        if (text.trim().length < 2) return;

        try {
            const response = await api.get(`/products?search=${encodeURIComponent(text)}`);
            const serverProducts = response.data?.content || (Array.isArray(response.data) ? response.data : []);

            const newVariants = [];
            serverProducts.forEach(product => {
                const variantsArray = product.variants || product.variantes || [];
                const productName = product.name || product.nombre || "Producto";

                if (Array.isArray(variantsArray)) {
                    variantsArray.forEach(variant => {
                        newVariants.push({
                            ...variant,
                            id: String(variant.id),
                            parentName: productName,
                            productId: product.id,
                            measure: variant.measure || variant.medida || "",
                            salePrice: variant.salePrice || variant.precioVenta || 0,
                            purchasePrice: variant.purchasePrice || variant.precioCompra || 0,
                            stock: variant.stock || variant.cantidad || 0
                        });
                    });
                }
            });

            setAllVariants(prev => {
                const filteredPrev = prev.filter(v => !newVariants.some(n => n.id === v.id));
                return [...filteredPrev, ...newVariants];
            });

        } catch (error) {
            console.error("Error buscando productos con Axios:", error);
        }
    };

    const updateItem = (index, field, value) => {
        const updatedItems = [...editedOrder.items];
        updatedItems[index][field] = value;

        if (field === "variantId") {
            const variant = allVariants.find(v => String(v.id) === String(value));
            if (variant) {
                updatedItems[index].variantId = variant.id;
                updatedItems[index].productId = variant.productId;
                updatedItems[index].productName = variant.parentName;
                updatedItems[index].measure = variant.measure;
                updatedItems[index].basePrice = variant.purchasePrice;
                updatedItems[index].finalPrice = variant.salePrice;
            } else {
                updatedItems[index].variantId = "";
            }
        }
        setEditedOrder({ ...editedOrder, items: updatedItems });
    };

    const addItem = () => {
        setEditedOrder({
            ...editedOrder,
            items: [
                ...editedOrder.items,
                { id: `new-${Date.now()}`, variantId: "", productId: "", productName: "", measure: "", quantity: 1, basePrice: 0, finalPrice: 0 },
            ],
        });
    };

    const removeItem = (index) => {
        const updatedItems = editedOrder.items.filter((_, i) => i !== index);
        setEditedOrder({ ...editedOrder, items: updatedItems });
    };

    const totalAmount = editedOrder.items.reduce((acc, item) => acc + Number(item.finalPrice || 0) * Number(item.quantity || 0), 0);

    const validateStock = () => {
        for (const item of editedOrder.items) {
            const variant = allVariants.find(v => String(v.id) === String(item.variantId));
            if (!variant) continue;
            if (Number(item.quantity) > Number(variant.stock)) {
                alert(`Stock insuficiente para ${variant.parentName}. Disponible: ${variant.stock}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateStock()) return;
        onSave({ ...editedOrder, totalAmount });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value || 0);
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl max-h-[85vh] flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold">Editar Orden #{editedOrder.id || "Nueva"}</h2>
                        <p className="text-gray-500">
                            {editedOrder.createdAt ? new Date(editedOrder.createdAt).toLocaleString() : "-"}
                        </p>
                    </div>
                    <button type="button" onClick={onHide} className="text-3xl text-gray-500 hover:text-red-500">&times;</button>
                </div>

                {/* FORM PANEL */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6" autoComplete="off">

                    {/* CONFIGURACIÓN FACTURA & PAGO */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border">
                        <div className="flex items-center gap-2">
                            <label className="font-semibold text-gray-700">Método Pago:</label>
                            <select
                                value={editedOrder.paymentMethod || ""}
                                onChange={(e) => setEditedOrder({ ...editedOrder, paymentMethod: e.target.value })}
                                className="border rounded-lg px-3 py-1.5 bg-white"
                            >
                                <option value="EFECTIVO">Efectivo</option>
                                <option value="TARJETA">Tarjeta (+10%)</option>
                                <option value="TRANSFERENCIA">Transferencia</option>
                                <option value="DEBITO">Débito</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 select-none">
                            <input
                                type="checkbox"
                                id="modalInvoiceCheckbox"
                                checked={editedOrder.isInvoice || false}
                                onChange={(e) => setEditedOrder({ ...editedOrder, isInvoice: e.target.checked })}
                                className="w-5 h-5 accent-green-600 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                            />
                            <label htmlFor="modalInvoiceCheckbox" className="text-sm font-medium text-gray-700 cursor-pointer">
                                Emitir Factura Oficial
                            </label>
                        </div>
                    </div>
                    {/* LISTADO ITEMS CON ENLACE ASÍNCRONO */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Productos en la Orden</h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                            >
                                <Plus size={16} /> Agregar Fila
                            </button>
                        </div>

                        {editedOrder.items.map((item, idx) => {
                            const subtotal = Number(item.finalPrice || 0) * Number(item.quantity || 0);
                            const currentSearchText = searchTerms[idx] !== undefined
                                ? searchTerms[idx]
                                : (item.productName ? `${item.productName} - ${item.measure}` : "");

                            const filteredVariants = allVariants.filter(v => {
                                const term = (searchTerms[idx] || "").toLowerCase();
                                if (!term) return true;
                                return v.parentName.toLowerCase().includes(term) || v.measure.toLowerCase().includes(term);
                            }).slice(0, 10);

                            return (
                                <div key={item.id || idx} className="grid grid-cols-12 gap-4 border rounded-xl p-4 items-end bg-white shadow-sm">

                                    <div className="col-span-5 relative">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Producto y Variante</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={currentSearchText}
                                                placeholder="🔍 Escribe para buscar artículo..."
                                                onFocus={() => setActiveDropdownIdx(idx)}
                                                onChange={(e) => handleServerSearch(idx, e.target.value)}
                                                className="w-full border rounded-lg pl-3 pr-8 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                            {currentSearchText && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        updateItem(idx, "variantId", "");
                                                        setSearchTerms({ ...searchTerms, [idx]: "" });
                                                    }}
                                                    className="absolute right-2 top-2.5 text-xs text-gray-400 hover:text-red-500"
                                                >
                                                    &times;
                                                </button>
                                            )}
                                        </div>

                                        {activeDropdownIdx === idx && (
                                            <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border rounded-xl shadow-xl z-50 divide-y">
                                                {filteredVariants.length === 0 ? (
                                                    <div className="p-3 text-sm text-gray-500 text-center">Escribe más letras para buscar...</div>
                                                ) : (
                                                    filteredVariants.map((v) => (
                                                        <button
                                                            key={v.id}
                                                            type="button"
                                                            onClick={() => {
                                                                updateItem(idx, "variantId", v.id);
                                                                setSearchTerms({ ...searchTerms, [idx]: `${v.parentName} - ${v.measure}` });
                                                                setActiveDropdownIdx(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm transition flex justify-between items-center"
                                                        >
                                                            <div>
                                                                <span className="font-medium text-gray-900">{v.parentName}</span>
                                                                <span className="text-gray-500 text-xs ml-2">({v.measure})</span>
                                                            </div>
                                                            <span className="text-blue-600 font-semibold text-xs">{formatCurrency(v.salePrice)}</span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Cant.</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity || 1}
                                            onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                                            className="w-full border rounded-lg px-3 py-1.5 text-sm text-center"
                                        />
                                    </div>

                                    <div className="col-span-2 text-right pb-2">
                                        <span className="block text-xs font-semibold text-gray-500 mb-1">Precio</span>
                                        <span className="text-sm font-medium text-gray-700">{formatCurrency(item.finalPrice)}</span>
                                    </div>

                                    <div className="col-span-2 text-right pb-2">
                                        <span className="block text-xs font-semibold text-gray-500 mb-1">Subtotal</span>
                                        <span className="text-sm font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                                    </div>

                                    <div className="col-span-1 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                    {/* PIE DE TOTALES */}
                    <div className="flex justify-end items-center gap-4 pt-4 border-t text-xl font-bold">
                        <span className="text-gray-600">Total General:</span>
                        <span className="text-green-600 text-2xl">{formatCurrency(totalAmount)}</span>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onHide} className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 font-medium text-gray-700 transition">Cancelar</button>
                        <button type="submit" className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium shadow-md transition">Guardar Cambios</button>
                    </div>

                </form>
            </div>

            {/* CIERRE FLOTANTE */}
            {activeDropdownIdx !== null && (
                <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownIdx(null)} />
            )}
        </div>
    );
};

export default OrderModal;
