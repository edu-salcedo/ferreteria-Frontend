
import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

const OrderModal = ({ order, products, show, onHide, onSave }) => {
    const [editedOrder, setEditedOrder] = useState(null);

    useEffect(() => {
        if (order) {
            setEditedOrder({
                ...order,
                items: order.items || [],
                isInvoice: order.isInvoice ?? false // Cargamos el estado inicial de la factura
            });
        }
    }, [order]);

    if (!show || !editedOrder) return null;
    const productList = Array.isArray(products) ? products : (products?.content || []);

    // ✨ Extraemos todas las variantes de todos los productos en una lista plana para facilitar la búsqueda
    const allVariants = productList.reduce((acc, product) => {
        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => {
                acc.push({ ...variant, parentName: product.name, productId: product.id });
            });
        }
        return acc;
    }, []) || [];

    const updateItem = (index, field, value) => {
        const updatedItems = [...editedOrder.items];
        updatedItems[index][field] = value;

        // ✨ ADAPTACIÓN: Si cambia la variante, actualizamos los datos basados en la medida seleccionada
        if (field === "variantId") {
            const variant = allVariants.find(v => v.id === Number(value));
            if (variant) {
                updatedItems[index].variantId = variant.id;
                updatedItems[index].productId = variant.productId;
                updatedItems[index].productName = variant.parentName;
                updatedItems[index].measure = variant.measure;
                updatedItems[index].basePrice = variant.purchasePrice || 0; // Costo base
                updatedItems[index].finalPrice = variant.salePrice || 0;    // Precio venta lista
            }
        }

        setEditedOrder({ ...editedOrder, items: updatedItems });
    };

    const addItem = () => {
        setEditedOrder({
            ...editedOrder,
            items: [
                ...editedOrder.items,
                {
                    id: null, // Será autoincremental en la base de datos
                    variantId: "",
                    productId: "",
                    productName: "",
                    measure: "",
                    quantity: 1,
                    basePrice: 0,
                    finalPrice: 0,
                },
            ],
        });
    };

    const removeItem = (index) => {
        const updatedItems = editedOrder.items.filter((_, i) => i !== index);
        setEditedOrder({ ...editedOrder, items: updatedItems });
    };

    const totalAmount = editedOrder.items.reduce(
        (acc, item) => acc + Number(item.finalPrice || 0) * Number(item.quantity || 0),
        0
    );

    // ✨ ADAPTACIÓN: Validación de stock apuntando a la variante real
    const validateStock = () => {
        for (const item of editedOrder.items) {
            const variant = allVariants.find(v => v.id === Number(item.variantId));
            if (!variant) continue;

            if (Number(item.quantity) > Number(variant.stock)) {
                alert(`Stock insuficiente para ${variant.parentName} (${variant.measure}). Disponible: ${variant.stock}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateStock()) return;

        // Enviamos el objeto de la orden con sus totales y el estado de la factura actualizado
        onSave({ ...editedOrder, totalAmount });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
        }).format(value || 0);
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold">Editar Orden #{editedOrder.id}</h2>
                        <p className="text-gray-500">
                            {editedOrder.createdAt ? new Date(editedOrder.createdAt).toLocaleString() : "-"}
                        </p>
                    </div>
                    <button type="button" onClick={onHide} className="text-3xl text-gray-500 hover:text-red-500">&times;</button>
                </div>

                {/* BODY FORM */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

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

                        {/* CHECKBOX FACTURADO SINCRO */}
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

                    {/* SECCIÓN LISTADO ITEMS */}
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

                            return (
                                <div key={item.id || idx} className="grid grid-cols-12 gap-4 border rounded-xl p-4 items-end bg-white shadow-sm">

                                    {/* SELECCIÓN DE VARIANTE (PRODUCTO + MEDIDA) */}
                                    <div className="col-span-5">
                                        <label className="text-xs font-semibold text-gray-500 block mb-1">Producto / Variante</label>
                                        <select
                                            value={item.variantId || ""}
                                            onChange={(e) => updateItem(idx, "variantId", e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                                            required
                                        >
                                            <option value="">Seleccionar variante...</option>
                                            {allVariants.map(v => (
                                                <option key={v.id} value={v.id}>
                                                    {v.parentName} - {v.measure} (Stock: {v.stock})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* CANTIDAD */}
                                    <div className="col-span-2">
                                        <label className="text-xs font-semibold text-gray-500 block mb-1">Cantidad</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity || ""}
                                            onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                                            className="w-full border rounded-lg px-3 py-2 text-sm text-center"
                                            required
                                        />
                                    </div>

                                    {/* PRECIO VENTA */}
                                    <div className="col-span-2">
                                        <label className="text-xs font-semibold text-gray-500 block mb-1">Precio Unit.</label>
                                        <input
                                            type="number"
                                            value={item.finalPrice || ""}
                                            onChange={(e) => updateItem(idx, "finalPrice", Number(e.target.value))}
                                            className="w-full border rounded-lg px-3 py-2 text-sm text-center font-mono font-medium"
                                            required
                                        />
                                    </div>

                                    {/* IMPRESION DEL SUB-TOTAL */}
                                    <div className="col-span-2 text-right self-center pr-2">
                                        <span className="text-xs font-semibold text-gray-400 block">Subtotal</span>
                                        <span className="font-mono font-bold text-gray-800 text-sm">{formatCurrency(subtotal)}</span>
                                    </div>

                                    {/* ELIMINAR FILA */}
                                    <div className="col-span-1 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* PANEL DE TOTALES */}
                    <div className="flex justify-end border-t pt-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-3 text-right">
                            <span className="text-sm font-semibold text-blue-800 block">Total Final de la Orden</span>
                            <span className="text-3xl font-black text-blue-900 font-mono">{formatCurrency(totalAmount)}</span>
                        </div>
                    </div>

                    {/* BOTONES ACCION MODAL */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onHide}
                            className="px-5 py-2.5 border rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow transition"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderModal;

