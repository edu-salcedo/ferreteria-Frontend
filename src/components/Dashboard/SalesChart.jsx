import { useEffect, useRef, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

const SalesChart = ({ orders }) => {
    const containerRef = useRef(null);
    const [size, setSize] = useState({ width: 300, height: 288 }); // fallback inicial

    useEffect(() => {
        if (!containerRef.current) return;

        const ro = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setSize({
                    width: entry.contentRect.width || 300,  // fallback si width=0
                    height: entry.contentRect.height || 288, // fallback si height=0
                });
            }
        });

        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Ventas por Orden</h2>
                <p className="text-gray-500">No hay datos para mostrar</p>
            </div>
        );
    }

    const chartData = orders.map(o => ({
        name: `#${o.id}`,
        total: Number(o.totalAmount) || 0
    }));

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                minWidth: 300,
                height: 288,
                minHeight: 288
            }}
        >
            <ResponsiveContainer width={size.width} height={size.height}>
                <BarChart data={chartData}>
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.4} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar
                        dataKey="total"
                        fill="url(#colorTotal)"
                        radius={[6, 6, 0, 0]}
                        isAnimationActive
                        animationDuration={800}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;