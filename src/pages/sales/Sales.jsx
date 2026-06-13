import { use, useMemo, useState } from "react";

import axios from "axios";

import { Search, } from "lucide-react";

import Sidebar from "../../components/Dashboard/Sidebar";
import { useSalesAnalytics } from "../../hooks/useSalesAnalytics";
import { useApi } from "../../hooks/useApi";
import SalesTable from "../../components/Dashboard/SalesTable";
import OrderModal from "../../components/modal/OrderModal";

const Sales = () => {

    const { data: orders, loading, error } = useApi("/order");
    const [search, setSearch] = useState("");
    const [editingOrder, setEditingOrder] = useState(null);
    const [filter, setFilter] = useState("all");
    const { filteredOrders } = useSalesAnalytics(orders, filter);
    const [showModal, setShowModal] = useState(false);
    const { data: products } = useApi("/products");

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Eliminar esta venta?");

        if (!confirmDelete) return;

        try {

            await axios.delete(
                `http://localhost:8080/order/${id}`
            );

            window.location.reload();

        } catch (error) {

            console.error(error);
        }
    };


    const handleUpdate = (order) => {

        setEditingOrder(order);
        setShowModal(true);
    }

    const handleSave = async (updatedOrder) => {

        const orderRequest = {
            paymentMethod: updatedOrder.paymentMethod,
            discount: 0,
            surcharge: 0,
            items: updatedOrder.items.map(item => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                basePrice: item.basePrice,
                finalPrice: item.finalPrice,
            }))
        };

        try {

            await axios.put(
                `http://localhost:8080/order/${editingOrder.id}`,
                orderRequest
            );

            alert("Venta actualizada");

            setEditingOrder(null);

            window.location.reload();

        } catch (error) {

            console.error(error);
        }
        setShowModal(false);
    };

    if (loading) {

        return (<div className="p-10 text-xl"> Cargando ventas... </div>);
    }

    if (error) {

        return (<div className="p-10 text-red-500">{error}</div>
        );
    }

    return (

        <div className="flex min-h-screen bg-gray-100">
            {editingOrder && (
                <OrderModal

                    order={editingOrder}
                    show={showModal}
                    products={products}
                    onHide={() => setShowModal(false)}
                    onSave={handleSave}
                />)}
            <Sidebar />
            <main className="flex-1 p-8 space-y-8">

                {/* HEADER */}
                <div className="flex items-center justify-around bg-white rounded-2xl px-3">

                    <div className="">

                        <h1 className="text-4xl font-bold text-gray-800">
                            Historial de Ventas
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Gestión completa de ventas
                        </p>

                    </div>
                    <div className="flex gap-4 shadow">

                        {/* BUSCADOR */}
                        <div className="relative w-full md:w-[350px]">

                            <Search
                                className="absolute left-3 top-3 text-gray-400"
                                size={18}
                            />

                            <input
                                type="text"
                                placeholder="Buscar por ID"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border rounded-xl pl-10 pr-4 py-3"
                            />

                        </div>
                        {/* FILTRO POR PERIODO */}
                        <div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="today">Hoy </option>
                                <option value="month">Este Mes</option>
                                <option value="year">Este Año</option>
                                <option value="all">Todo</option>
                            </select>

                        </div>
                    </div>


                </div>
                {/* TABLA */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">

                    <div className="overflow-x-auto">

                        <SalesTable
                            orders={filteredOrders}
                            EditingOrder={handleUpdate}
                            deleteOrder={handleDelete}
                        />

                    </div>

                </div>
            </main>

        </div>
    );
};

export default Sales;