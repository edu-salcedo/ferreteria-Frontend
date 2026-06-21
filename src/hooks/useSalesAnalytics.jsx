import { useMemo } from "react";

export const useSalesAnalytics = (orders, filter) => {

    // ================================s=====================
    // FECHAS
    // =====================================================

    const today = new Date();

    const currentDate =
        today.toISOString().split("T")[0];

    const currentMonth =
        today.getMonth();

    const currentYear =
        today.getFullYear();

    // =====================================================
    // FILTRAR ORDENES
    // =====================================================

    const filteredOrders = useMemo(() => {

        if (!orders) return [];

        return orders.filter((order) => {

            const date = new Date(order.createdAt);

            if (filter === "today") {

                return (
                    order.createdAt?.split("T")[0]
                    === currentDate
                );
            }

            if (filter === "week") {
                // 1. Obtener el inicio de la semana actual (Lunes)
                const startOfWeek = new Date();
                const day = startOfWeek.getDay();
                // Ajuste para que la semana empiece el Lunes (si es Domingo, restamos 6)
                const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
                startOfWeek.setDate(diff);
                startOfWeek.setHours(0, 0, 0, 0); // Ir al inicio del Lunes
                // 2. Obtener el fin de la semana actual (Domingo a última hora)
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999); // Ir al final del Domingo

                // 3. Verificar si la fecha de la orden está dentro del rango
                return date >= startOfWeek && date <= endOfWeek;
            }

            if (filter === "month") {

                return (
                    date.getMonth() === currentMonth &&
                    date.getFullYear() === currentYear
                );
            }

            if (filter === "year") {

                return (
                    date.getFullYear() === currentYear
                );
            }

            return true;
        });

    }, [
        orders,
        filter,
        currentDate,
        currentMonth,
        currentYear,
    ]);

    // =====================================================
    // TOTAL VENTAS
    // =====================================================

    const totalSales = useMemo(() => {

        return filteredOrders.reduce(
            (acc, order) =>
                acc + Number(order.totalAmount || 0),
            0
        );

    }, [filteredOrders]);

    // =====================================================
    // COSTOS
    // =====================================================

    const totalCosts = useMemo(() => {

        return filteredOrders.reduce(
            (acc, order) => {

                const orderCost =
                    (order.items || []).reduce(
                        (sum, item) => {

                            return (
                                sum +
                                (
                                    Number(item.basePrice || 0) *
                                    Number(item.quantity || 0)
                                )
                            );

                        },
                        0
                    );

                return acc + orderCost;

            },
            0
        );

    }, [filteredOrders]);

    // =====================================================
    // GANANCIAS
    // =====================================================

    const totalProfit =
        totalSales - totalCosts;

    // =====================================================
    // MARGEN
    // =====================================================

    const profitMargin =
        totalSales > 0
            ? (totalProfit / totalSales) * 100
            : 0;

    // =====================================================
    // TOTAL ORDENES
    // =====================================================

    const totalOrders =
        filteredOrders.length;

    // =====================================================
    // PRODUCTOS
    // =====================================================

    const totalProducts = useMemo(() => {

        return filteredOrders.reduce(
            (acc, order) => {

                return (
                    acc +
                    (order.items || []).reduce(
                        (sum, item) => {

                            return (
                                sum +
                                Number(item.quantity || 0)
                            );

                        },
                        0
                    )
                );

            },
            0
        );

    }, [filteredOrders]);

    // =====================================================
    // PROMEDIO
    // =====================================================

    const averageSale =
        totalOrders > 0
            ? totalSales / totalOrders
            : 0;

    // =====================================================
    // VENTAS POR DIA
    // =====================================================

    const salesByDay = useMemo(() => {

        const grouped = {};

        filteredOrders.forEach((order) => {

            const date =
                order.createdAt?.split("T")[0];

            if (!grouped[date]) {

                grouped[date] = {
                    sales: 0,
                    costs: 0,
                    profit: 0,
                };
            }

            grouped[date].sales +=
                Number(order.totalAmount || 0);

            (order.items || []).forEach((item) => {

                grouped[date].costs +=
                    (
                        Number(item.basePrice || 0) *
                        Number(item.quantity || 0)
                    );
            });

            grouped[date].profit =
                grouped[date].sales -
                grouped[date].costs;
        });

        return Object.entries(grouped).map(
            ([date, values]) => ({
                date,
                ...values,
            })
        );

    }, [filteredOrders]);

    // =====================================================
    // TOP PRODUCTOS
    // =====================================================

    const topProducts = useMemo(() => {

        const grouped = {};

        filteredOrders.forEach((order) => {

            (order.items || []).forEach((item) => {

                if (!grouped[item.productName]) {

                    grouped[item.productName] = 0;
                }

                grouped[item.productName] +=
                    Number(item.quantity || 0);
            });
        });

        return Object.entries(grouped)
            .map(([name, quantity]) => ({
                name,
                quantity,
            }))
            .sort((a, b) =>
                b.quantity - a.quantity
            )
            .slice(0, 5);

    }, [filteredOrders]);

    // =====================================================
    // RENTABILIDAD
    // =====================================================

    const profitableProducts = useMemo(() => {

        const grouped = {};

        filteredOrders.forEach((order) => {

            (order.items || []).forEach((item) => {

                const profit =
                    (
                        Number(item.finalPrice || 0) -
                        Number(item.basePrice || 0)
                    ) *
                    Number(item.quantity || 0);

                if (!grouped[item.productName]) {

                    grouped[item.productName] = 0;
                }

                grouped[item.productName] += profit;
            });
        });

        return Object.entries(grouped)
            .map(([name, profit]) => ({
                name,
                profit,
            }))
            .sort((a, b) =>
                b.profit - a.profit
            )
            .slice(0, 5);

    }, [filteredOrders]);

    return {
        filteredOrders,
        totalSales,
        totalCosts,
        totalProfit,
        profitMargin,
        totalOrders,
        totalProducts,
        averageSale,
        salesByDay,
        topProducts,
        profitableProducts,
    };
};