import React, { useState } from "react";

import { formatDate } from "../../utils/date.js";

import { Pencil, Trash2, Eye, } from "lucide-react";

const SalesTable = ({ orders, EditingOrder, deleteOrder, }) => {

    const [selectedOrder, setSelectedOrder] = useState(null);
    // FORMATO MONEDA
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

        <div className="bg-white p-6 rounded-xl shadow">

            {/* TITULO */}
            <div className="flex items-center justify-between mb-6">

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Ventas Recientes
                    </h2>

                    <p className="text-gray-500">
                        Historial completo de ventas
                    </p>

                </div>

            </div>

            {/* TABLA */}
            <div className="overflow-x-auto">

                <table className="w-full text-left border-collapse">

                    {/* HEADER */}
                    <thead className="bg-gray-100 text-gray-700">

                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Productos</th>
                            <th className="p-4">Método Pago</th>
                            <th className="p-4">Acciones</th>

                        </tr>

                    </thead>

                    {/* BODY */}
                    <tbody>

                        {orders?.map((order) => (

                            <React.Fragment key={order.id}>

                                {/* FILA PRINCIPAL */}
                                <tr className=" border-b hover:bg-gray-50transitioncursor-pointer "
                                    onClick={() =>
                                        setSelectedOrder(
                                            selectedOrder?.id === order.id ? null : order
                                        )
                                    }
                                >

                                    {/* ID */}
                                    <td className="p-4 font-semibold">
                                        #{order.id}
                                    </td>

                                    {/* FECHA */}
                                    <td className="p-4">

                                        {order.createdAt ? formatDate(order.createdAt) : "-"}

                                    </td>

                                    {/* TOTAL */}
                                    <td className="p-4 font-bold text-green-600">

                                        {formatCurrency(order.totalAmount)}

                                    </td>

                                    {/* ITEMS */}
                                    <td className="p-4">

                                        {order.items?.length || 0}

                                    </td>

                                    {/* METODO */}
                                    <td className="p-4">

                                        {order.paymentMethod || "-"}

                                    </td>

                                    {/* ACCIONES */}
                                    <td className="p-4">

                                        <div className="flex gap-2">

                                            {/* VER */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrder(selectedOrder?.id === order.id ? null : order);
                                                }}
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition "
                                            >
                                                <Eye size={18} />
                                            </button>

                                            {/* EDITAR */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    EditingOrder(order);
                                                }}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            {/* ELIMINAR */}
                                            <button
                                                onClick={(e) => {

                                                    e.stopPropagation();
                                                    deleteOrder(order.id);
                                                }}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                                {/* DETALLE EXPANDIBLE */}
                                {selectedOrder?.id === order.id && (

                                    <tr className="bg-gray-50">

                                        <td colSpan="6" className="p-5" >

                                            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">

                                                {/* HEADER DETALLE */}
                                                <div className="bg-gray-100 p-2 border-b">

                                                    <div className="flex items-center justify-between">

                                                        <h3 className="text-xl font-bold">
                                                            Detalle de Venta
                                                        </h3>

                                                    </div>

                                                </div>

                                                {/* TABLA DETALLE */}
                                                <div className="overflow-x-auto">

                                                    <table className="w-full">

                                                        <thead className="bg-gray-50">

                                                            <tr>

                                                                <th className="p-4 text-left">
                                                                    Producto
                                                                </th>

                                                                <th className="p-4 text-left">
                                                                    Cantidad
                                                                </th>

                                                                <th className="p-4 text-left">
                                                                    Precio Compra
                                                                </th>

                                                                <th className="p-4 text-left">
                                                                    Precio Venta
                                                                </th>

                                                                <th className="p-4 text-left">
                                                                    Subtotal
                                                                </th>

                                                                <th className="p-4 text-left">
                                                                    Ganancia
                                                                </th>

                                                            </tr>

                                                        </thead>

                                                        <tbody>

                                                            {order.items?.map((item, idx) => {

                                                                const subtotal = Number(item.finalPrice) * Number(item.quantity);

                                                                const profit =
                                                                    (Number(item.finalPrice) - Number(item.basePrice))
                                                                    *
                                                                    Number(item.quantity);

                                                                return (

                                                                    <tr
                                                                        key={idx}
                                                                        className="border-t hover:bg-gray-50"
                                                                    >

                                                                        {/* PRODUCTO */}
                                                                        <td className="p-4 font-medium">{item.productName} </td>

                                                                        {/* CANTIDAD */}
                                                                        <td className="p-4"> {item.quantity} </td>

                                                                        {/* PRECIO COMPRA */}
                                                                        <td className="p-4"> {formatCurrency(item.basePrice)} </td>

                                                                        {/* PRECIO VENTA */}
                                                                        <td className="p-4"> {formatCurrency(item.finalPrice)}</td>

                                                                        {/* SUBTOTAL */}
                                                                        <td className="p-4 font-semibold text-blue-600">

                                                                            {formatCurrency(subtotal)}

                                                                        </td>

                                                                        {/* GANANCIA */}
                                                                        <td className="p-4 font-bold text-green-600">

                                                                            {formatCurrency(profit)}

                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}

                                                        </tbody>

                                                    </table>

                                                </div>
                                            </div>

                                        </td>

                                    </tr>
                                )}

                            </React.Fragment>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default SalesTable;