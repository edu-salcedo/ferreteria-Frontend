import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, ShoppingCart, Package, DollarSign } from "lucide-react";

import Sidebar from "../../components/Dashboard/Sidebar";
import StatsCard from "../../components/Dashboard/StatsCard";
import ExportExcel from "../../components/Dashboard/utils/ExportExcel";
import { useSalesAnalytics } from "../../hooks/useSalesAnalytics";
import { useApi } from "../../hooks/useApi";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];

const SalesDashboard = () => {
    const { data: orders, loading, error } = useApi("/order");
    const [filter, setFilter] = useState("today");
    const {
        filteredOrders, totalSales, totalCosts, totalProfit, profitMargin,
        totalOrders, totalProducts, averageSale, salesByDay, topProducts,
        profitableProducts
    } = useSalesAnalytics(orders, filter);

    // FORMATO MONEDA (YA QUITA LOS DECIMALES CON maximumFractionDigits: 0)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
        }).format(value || 0);
    };

    if (loading) { return <div className="p-10 text-xl"> Cargando dashboard...</div>; }
    if (error) { return <div className="p-10 text-red-500">{error} </div>; }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-8 space-y-8">
                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800"> Dashboard Financiero</h1>
                        <p className="text-gray-500 mt-2">Control de ventas, ganancias y productos</p>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="today">Hoy </option>
                            <option value="week">Esta Semana</option>
                            <option value="month">Este Mes</option>
                            <option value="year">Este Año</option>
                            <option value="all">Todo</option>
                        </select>

                        <button
                            onClick={() => ExportExcel(filteredOrders)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Download size={18} />
                            Excel
                        </button>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatsCard title="Ventas" value={formatCurrency(totalSales)} icon={<TrendingUp />} />
                    <StatsCard title="Costos" value={formatCurrency(totalCosts)} icon={<DollarSign />} />
                    <StatsCard title="Ganancias" value={formatCurrency(totalProfit)} icon={<DollarSign />} />
                    <StatsCard title="Margen" value={`${profitMargin.toFixed(1)}%`} />
                    <StatsCard title="Órdenes" value={totalOrders} icon={<ShoppingCart />} />
                    <StatsCard title="Productos" value={totalProducts} icon={<Package />} />
                    <StatsCard title="Promedio" value={formatCurrency(averageSale)} />
                </div>

                {/* GRAFICO FINANCIERO VENTAS COSTOS Y GANANCIA*/}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-bold mb-5">Ventas vs Costos</h2>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesByDay}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                {/* tickFormatter quita los decimales del eje Y vertical */}
                                <YAxis tickFormatter={(val) => formatCurrency(val)} />
                                {/* formatter quita los decimales del cartel flotante al pasar el mouse */}
                                <Tooltip formatter={(value) => [formatCurrency(value)]} />
                                <Legend />
                                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} name="Ganancia" />
                                 <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} name="Ventas" />
                                <Line type="monotone" dataKey="costs" stroke="#EF4444" strokeWidth={3} name="Costos" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PRODUCTOS MAS VENDIDOS*/}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-bold mb-5">Productos Más Vendidos</h2>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                {/* Math.trunc evita decimales si las cantidades son enteras */}
                                <YAxis tickFormatter={(val) => Math.trunc(val)} />
                                <Tooltip formatter={(value) => [Math.trunc(value), "Cantidad"]} />
                                <Bar dataKey="quantity" fill="#10B981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PIE + RENTABLES */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-xl font-bold mb-5">Distribución</h2>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={topProducts}
                                        dataKey="quantity"
                                        nameKey="name"
                                        outerRadius={120}
                                        label={(entry) => `${entry.name}: ${Math.trunc(entry.value)}`}
                                    >
                                        {topProducts.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [Math.trunc(value), "Cantidad"]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SalesDashboard;
