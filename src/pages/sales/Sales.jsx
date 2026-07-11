import { useMemo, useState } from "react"; // 💡 Corrección: Eliminado 'use' que no se usaba y causaba warning
import axios from "axios";
import { Search, TrendingUp, DollarSign } from "lucide-react";

import Sidebar from "../../components/Dashboard/Sidebar";
import { useSalesAnalytics } from "../../hooks/useSalesAnalytics";
import { useApi } from "../../hooks/useApi";
import SalesTable from "../../components/Dashboard/SalesTable";
import OrderModal from "../../components/modal/OrderModal";
import StatsCard from "../../components/Dashboard/StatsCard";

const baseUrl = import.meta.env.VITE_API_URL;

const Sales = () => {
    const { data: orders = [], loading, error } = useApi("/order"); // 💡 Corrección: Garantiza un array por defecto
    const [search, setSearch] = useState("");
    const [editingOrder, setEditingOrder] = useState(null);

    // ✨ SOLUCIÓN 1: Cambiado a "all" por defecto para que muestre el historial completo al cargar
    const [filter, setFilter] = useState("all");

    const { filteredOrders, totalSales, totalCosts, totalProfit } = useSalesAnalytics(orders, filter);
    const [showModal, setShowModal] = useState(false);
    const { data: products } = useApi("/products");

    // ✨ SOLUCIÓN 2: Filtrado por ID en tiempo real usando el estado 'search'
    const ordersToShow = useMemo(() => {
        if (!search.trim()) return filteredOrders;

        return filteredOrders.filter(order =>
            String(order.id || '').toLowerCase().includes(search.toLowerCase().trim())
        );
    }, [filteredOrders, search]);

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

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Eliminar esta venta?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${baseUrl}/order/${id}`);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = (order) => {
        setEditingOrder(order);
        setShowModal(true);
    };

    const handleSave = async (updatedOrder) => {
        const orderRequest = {
            paymentMethod: updatedOrder.paymentMethod,
            discount: Number(updatedOrder.discount || 0),
            surcharge: Number(updatedOrder.surcharge || 0),
            items: updatedOrder.items.map(item => {
                // 🔍 Investigamos todas las combinaciones de nombres posibles que pueda enviar el Modal
                const quantity = Number(item.quantity || 0);

                // Si viene de 'salePrice' o 'finalPrice', lo usamos. Si no, tomamos el del subtotal o 0.
                const finalPrice = Number(item.finalPrice || item.salePrice || item.price || 0);

                // Si viene de 'purchasePrice' o 'basePrice', lo usamos.
                const basePrice = Number(item.basePrice || item.purchasePrice || 0);

                return {
                    id: item.id || null,
                    // Tu backend mapea el objeto OrderItem, asegúrate de enviar los nombres correctos
                    variantId: item.variantId || item.id,
                    quantity: quantity,
                    basePrice: basePrice,
                    finalPrice: finalPrice
                };
            })
        };

        // 🧪 Control de seguridad en la consola antes de golpear a Spring Boot
        console.log("Objeto exacto enviado a Spring Boot:", orderRequest);

        try {
            await axios.put(`${baseUrl}/order/${editingOrder.id}`, orderRequest);
            alert("Venta actualizada con éxito");
            setEditingOrder(null);
            window.location.reload();
        } catch (error) {
            console.error("El backend rechazó la solicitud:", error.response?.data || error.message);
            alert("Error del servidor al guardar. Revisa la consola del backend.");
        }
        setShowModal(false);
    };


    if (loading) { return (<div className="p-10 text-xl"> Cargando ventas... </div>); }
    if (error) { return (<div className="p-10 text-red-500">{error}</div>); }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {editingOrder && (
                <OrderModal
                    order={editingOrder}
                    show={showModal}
                    products={products}
                    onHide={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
            <Sidebar />
            <main className="flex-1 p-8 space-y-8">
                {/* HEADER */}
                <div className="flex items-center justify-around bg-white rounded-2xl px-3 py-4 shadow-sm">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">
                            Historial de Ventas
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Gestión completa de ventas
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {/* BUSCADOR */}
                        <div className="relative w-full md:w-[350px]">
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por ID"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border rounded-xl pl-10 pr-4 py-2"
                            />
                        </div>
                        {/* FILTRO POR PERIODO */}
                        <div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border rounded-lg px-4 py-2 bg-white"
                            >
                                <option value="today">Hoy</option>
                                <option value="week">Esta Semana</option>
                                <option value="month">Este Mes</option>
                                <option value="year">Este Año</option>
                                <option value="all">Todo</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* METRICS */}
                <div className="flex justify-around gap-4">
                    <StatsCard title="Ventas" value={formatCurrency(totalSales)} icon={<TrendingUp />} />
                    <StatsCard title="Costos" value={formatCurrency(totalCosts)} icon={<DollarSign />} />
                    <StatsCard title="Ganancias" value={formatCurrency(totalProfit)} icon={<DollarSign />} />
                </div>

                {/* TABLA */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* ✨ SOLUCIÓN 3: Pasamos 'ordersToShow' en lugar de filteredOrders */}
                        <SalesTable
                            orders={ordersToShow}
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
