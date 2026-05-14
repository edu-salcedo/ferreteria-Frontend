import { useMemo, useState } from "react";
import { useApi } from "../../hooks/useApi";

import Sidebar from "../../components/Dashboard/Sidebar";
import StatsCard from "../../components/Dashboard/StatsCard";
import SalesChart from "../../components/Dashboard/SalesChart";
import SalesTable from "../../components/Dashboard/SalesTable";

const SalesDashboard = () => {
    const { data: orders, loading, error } = useApi("/order");
    const [selectedOrder, setSelectedOrder] = useState(null); // Orden seleccionada desde la tabla

    const totalSales = useMemo(() => {
        if (!orders) return 0;
        return orders.reduce((acc, order) => {
            const total = Number(order.totalAmount || 0);
            return acc + (isNaN(total) ? 0 : total);
        }, 0);
    }, [orders]);

    const totalOrders = orders?.length || 0;

    const totalProducts = useMemo(() => {
        if (!orders) return 0;
        return orders.reduce((acc, order) => {
            const items = order.items || [];
            return acc + items.reduce((s, i) => s + i.quantity, 0);
        }, 0);
    }, [orders]);

    if (loading) return <p className="p-6">Cargando ventas...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    // Función para seleccionar orden desde la tabla
    const handleRowClick = (order) => {
        setSelectedOrder(order);
    };

    return (
        <div className="flex">
            <Sidebar />

            <main className="flex-1 bg-gray-100 p-8 space-y-8">
                <h1 className="text-3xl font-bold">Dashboard de Ventas</h1>

                {/* STATS */}
                <div className="grid md:grid-cols-3 gap-6">
                    <StatsCard title="Total vendido" value={`$${totalSales}`} />
                    <StatsCard title="Ventas" value={totalOrders} />
                    <StatsCard title="Productos vendidos" value={totalProducts} />
                </div>

                {/* GRAFICO */}
                <SalesChart orders={orders} />

                {/* TABLA DE VENTAS */}
                <SalesTable orders={orders} onRowClick={handleRowClick} />

                {/* DETALLE DE PRODUCTOS */}
                {selectedOrder && (
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h2 className="text-xl font-semibold mb-4">
                            Detalle de la Orden #{selectedOrder.id}
                        </h2>
                        <p className="mb-2">
                            Total: ${Number(selectedOrder.totalAmount).toLocaleString()}
                        </p>

                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-b px-3 py-2">Producto</th>
                                    <th className="border-b px-3 py-2">Cantidad</th>
                                    <th className="border-b px-3 py-2">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items.map((p, idx) => (
                                    <tr key={idx}>
                                        <td className="border-b px-3 py-2">{p.productName}</td>
                                        <td className="border-b px-3 py-2">{p.quantity}</td>
                                        <td className="border-b px-3 py-2">${Math.round((Number(p.finalPrice) || 0) * (Number(p.quantity) || 0))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SalesDashboard;