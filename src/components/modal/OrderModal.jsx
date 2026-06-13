import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

const OrderModal = ({ order, products, show, onHide, onSave, }) => {

    const [editedOrder, setEditedOrder] = useState(null);

    useEffect(() => {

        if (order) {

            setEditedOrder({ ...order, items: order.items || [], });
        }

    }, [order]);

    if (!show || !editedOrder) return null;

    // =========================
    // ACTUALIZAR ITEM
    // =========================

    const updateItem = (index, field, value) => {

        const updatedItems = [...editedOrder.items];

        updatedItems[index][field] = value;

        // CAMBIO DE PRODUCTO
        if (field === "productId") {

            const product = products.find(p => p.id === Number(value));
            console.log("Producto seleccionado:", product);

            if (product) {

                updatedItems[index].productId = product.id;
                updatedItems[index].productName = product.name;
                updatedItems[index].basePrice = product.purchasePrice;
                updatedItems[index].finalPrice = product.salePrice;
            }
        }

        setEditedOrder({ ...editedOrder, items: updatedItems, });
    };

    // =========================
    // AGREGAR ITEM
    // =========================

    const addItem = () => {

        setEditedOrder({
            ...editedOrder,
            items: [
                ...editedOrder.items,
                {
                    id: Date.now(),
                    productId: "",
                    productName: "",
                    quantity: 1,
                    basePrice: 0,
                    finalPrice: 0,
                },
            ],
        });
    };

    // =========================
    // ELIMINAR ITEM
    // =========================

    const removeItem = (index) => {

        const updatedItems = editedOrder.items.filter((_, i) => i !== index);

        setEditedOrder({ ...editedOrder, items: updatedItems, });
    };

    // =========================
    // TOTAL
    // =========================

    const totalAmount = editedOrder.items.reduce(
        (acc, item) =>
            acc +
            Number(item.finalPrice || 0) *
            Number(item.quantity || 0),
        0
    );

    // =========================
    // VALIDAR STOCK
    // =========================

    const validateStock = () => {

        for (const item of editedOrder.items) {

            const product = products.find(
                p => p.id === Number(item.productId)
            );

            if (!product) continue;

            if (item.quantity > product.stock) {

                alert(`Stock insuficiente para ${product.name}`);

                return false;
            }
        }

        return true;
    };

    // =========================
    // GUARDAR
    // =========================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!validateStock()) return;

        onSave({ ...editedOrder, totalAmount, });
    };

    // =========================
    // MONEDA
    // =========================

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "es-AR",
            {
                style: "currency",
                currency: "ARS",
                maximumFractionDigits: 0,
            }
        ).format(value || 0);
    };

    return (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* HEADER */}

                <div className="flex justify-between items-center p-6 border-b">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Editar Orden #{editedOrder.id}
                        </h2>

                        <p className="text-gray-500">
                            {new Date(editedOrder.createdAt).toLocaleString()}
                        </p>

                    </div>

                    <button
                        onClick={onHide}
                        className="text-3xl text-gray-500 hover:text-red-500"
                    >
                        &times;
                    </button>

                </div>

                {/* BODY */}

                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-6 space-y-6"
                >

                    {/* ITEMS */}

                    <div className="space-y-4">

                        {editedOrder.items.map((item, idx) => {

                            const subtotal = Number(item.finalPrice || 0) * Number(item.quantity || 0);

                            return (

                                <div
                                    key={item.id || idx}
                                    className="grid grid-cols-12 gap-4 border rounded-2xl p-4"
                                >

                                    {/* PRODUCTO */}

                                    <div className="col-span-4">

                                        <label className="text-sm text-gray-500">
                                            Producto
                                        </label>

                                        <select
                                            value={item.productId}
                                            onChange={(e) =>
                                                updateItem(idx, "productId", e.target.value)
                                            }
                                            className="w-full border rounded-lg px-3 py-2"
                                        >

                                            <option value=""> Seleccionar</option>

                                            {products.map(product => (

                                                <option key={product.id} value={product.id}>
                                                    {product.id} - {product.name}
                                                </option>

                                            ))}

                                        </select>

                                    </div>

                                    {/* CANTIDAD */}

                                    <div className="col-span-2">

                                        <label className="text-sm text-gray-500">
                                            Cantidad
                                        </label>

                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(idx, "quantity", Number(e.target.value))
                                            }
                                            className="w-full border rounded-lg px-3 py-2"
                                        />

                                    </div>

                                    {/* PRECIO */}

                                    <div className="col-span-2">

                                        <label className="text-sm text-gray-500">
                                            Precio
                                        </label>

                                        <input
                                            type="number"
                                            value={item.finalPrice}
                                            onChange={(e) =>
                                                updateItem(idx, "finalPrice", Number(e.target.value))
                                            }
                                            className="w-full border rounded-lg px-3 py-2"
                                        />

                                    </div>

                                    {/* SUBTOTAL */}

                                    <div className="col-span-3">

                                        <label className="text-sm text-gray-500">
                                            Subtotal
                                        </label>

                                        <div className="h-[42px] flex items-center font-bold text-green-600">

                                            {formatCurrency(subtotal)}

                                        </div>

                                    </div>

                                    {/* ELIMINAR */}

                                    <div className="col-span-1 flex items-end">

                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                                        >
                                            <Trash2 size={18} />

                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    {/* AGREGAR */}

                    <button
                        type="button"
                        onClick={addItem}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                    >

                        <Plus size={18} />

                        Agregar Producto

                    </button>

                    {/* TOTAL */}

                    <div className="flex justify-end">

                        <div className="bg-gray-100 rounded-2xl p-5 w-[300px]">

                            <div className="flex justify-between text-lg">

                                <span className="font-semibold">
                                    Total
                                </span>

                                <span className="font-bold text-green-600">

                                    {formatCurrency(totalAmount)}

                                </span>

                            </div>

                        </div>

                    </div>

                    {/* FOOTER */}

                    <div className="flex justify-end gap-3 border-t pt-4">

                        <button
                            type="button"
                            onClick={onHide}
                            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white"
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