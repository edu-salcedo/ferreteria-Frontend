import { useCart } from "../../context/CartContext";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import bodyLogo from "../../assets/img/bud.png";
import { toast } from "react-toastify";
import axios from "axios";

import InvoiceA4 from "../../components/invoice/InvoiceA4";

const Checkout = () => {
    const [isBudget, setIsBudget] = useState(false);
    const { cart, clearCart } = useCart();
    const [orderResponse, setOrderResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [mode, setMode] = useState("budget"); // EFECTIVO | TARJETA 
    const [paymentMethod, setPaymentMethod] = useState(""); // EFECTIVO | TARJETA
    const printRef = useRef(null);

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.salePrice * item.quantity,
        0
    );

    // Aplicar recargo por tarjeta solo para mostrar en factura
    const surCharge = paymentMethod === "TARJETA" ? 10 : 0; // 10% por ejemplo
    const surChargeAmount = totalAmount * (surCharge / 100);
    const totalWithAdd = totalAmount + surChargeAmount;
    const totalWithDiscount = totalWithAdd * (1 - discount / 100);

    const handleAction = async (type) => {
        if (cart.length === 0) {
            toast.error("El carrito está vacío");
            return;
        }
        if (!paymentMethod) {
            toast.error("Selecciona un método de pago");
            return;
        }

        // Mapear items válidos
        const filteredItems = cart
            .filter(item => item.id && item.quantity > 0)
            .map(item => ({
                productId: Number(item.id),
                quantity: Number(item.quantity)
            }));

        if (filteredItems.length === 0) {
            toast.error("No hay items válidos");
            return;
        }

        setMode(type); // Presupuesto o venta
        setLoading(true);
        console.log(type);
        try {
            // Preparar payload
            const payload = {
                items: filteredItems,
                paymentMethod: paymentMethod.toUpperCase(), // EFECTIVO o TARJETA
                discount: Number(discount) || 0
            };

            let res;

            if (type === "budget") {
                // 👉 Presupuesto: calcula pero no guarda
                res = await axios.post("http://localhost:8080/order/preview", payload);
                toast.success("Presupuesto generado");
            } else {
                console.log("Payload para venta:", payload);
                // 👉 Venta: guarda en DB
                res = await axios.post("http://localhost:8080/order", payload);
                toast.success("Compra realizada con éxito");
                clearCart();
            }

            // Guardamos la respuesta para mostrar factura/presupuesto
            setOrderResponse(res.data);

        } catch (err) {
            console.error(err);

            // Mostrar error más claro
            if (err.response) {
                // Error del backend
                toast.error(`Error del servidor: ${err.response.data?.message || err.response.statusText}`);
            } else if (err.request) {
                // No hubo respuesta del backend
                toast.error("No se pudo conectar con el servidor");
            } else {
                // Otro error
                toast.error("Error al procesar la acción");
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef
    });

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
            <div className="flex justify-center gap-6 mb-6">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            </div>
            {cart.length === 0 && !orderResponse && <p>Tu carrito está vacío</p>}

            {cart.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <ul className="mb-4 divide-y">
                        {cart.map(item => (
                            <li key={item.id} className="py-2 flex justify-between">
                                <span>{item.quantity} x {item.name}</span>
                                <span className="font-mono">
                                    ${Math.floor(item.quantity * item.salePrice)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Controles */}
                    <div className="flex flex-wrap gap-6 mb-4">
                        <div className="flex flex-col gap-2 bg-red-200 p-4 rounded">
                            {/* Descuento */}
                            <div className="flex items-center gap-2">
                                <p>Descuento</p>
                                <button
                                    onClick={() => setDiscount(prev => Math.max(0, prev - 1))}
                                    className="bg-gray-400 px-2 rounded"
                                >-</button>
                                <span>{discount} %</span>
                                <button
                                    onClick={() => setDiscount(prev => Math.min(100, prev + 1))}
                                    className="bg-green-400 px-2 rounded"
                                >+</button>
                            </div>

                            {/* Medio de pago */}
                            <div className="flex items-center gap-2">
                                <p>Medio de pago</p>
                                <select
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                    className={` border rounded px-3 py-2 ${!paymentMethod ? "text-gray-400" : "text-black"}`}
                                >
                                    <option value="">
                                        Seleccionar método de pago
                                    </option>
                                    <option value="EFECTIVO">Efectivo</option>
                                    <option value="TARJETA">Tarjeta (+10%)</option>
                                    <option value="TRANSFERENCIA">Transferencia</option>
                                    <option value="DEbITO">Debito</option>
                                </select>
                            </div>
                        </div>

                        {/* Totales */}
                        <div className="flex flex-col gap-1 ml-4 p-4 rounded">
                            <div className="">
                                <h2 className="text-gray-800">Total lista: ${Math.floor(totalAmount)}</h2>
                                {surCharge > 0 && (
                                    <h2 className="text-gray-800">Recargo ({surCharge}%): ${Math.floor(totalWithAdd)}</h2>
                                )}
                                {discount > 0 && (
                                    <h2 className="text-gray-800">Descuento ({discount}%): ${Math.floor(totalWithDiscount)}</h2>
                                )}
                                <h2 className="text-2xl font-bold">Total final: ${Math.floor(totalWithDiscount)}</h2>
                                <div>
                                    <button onClick={() => setIsBudget(prev => !prev)} className="bg-gray-400 rounded px-4 py-2 text-sm text-white">
                                        {isBudget ? "Cambiar a Venta" : "Cambiar a Presupuesto"}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => handleAction("budget")}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Generar presupuesto
                        </button>

                        <button
                            onClick={() => handleAction("sale")}
                            disabled={loading || !paymentMethod}
                            className={`px-6 py-3 rounded-lg font-semibold text-white transition
                                   ${loading || !paymentMethod
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600"
                                }
                                    `}
                        >
                            {loading ? "Procesando..." : "Confirmar compra"}
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmación y Print */}
            {orderResponse && (
                <div className="mt-6 border-2 border-blue-200 bg-blue-50 p-6 rounded-lg text-center">
                    <h2 className="text-2xl font-bold mb-2 text-blue-800">
                        {mode === "sale" ? "¡Compra confirmada!" : "Presupuesto generado"}
                    </h2>

                    <p className="mb-4">
                        {mode === "sale"
                            ? "La venta se registró correctamente."
                            : "Este documento no tiene validez fiscal."}
                    </p>                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold"
                    >
                        🖨️ Imprimir presupuesto
                    </button>
                </div>
            )}

            {orderResponse && (
                <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                    <InvoiceA4
                        ref={printRef}
                        orderResponse={orderResponse}
                        discount={discount}
                        paymentMethod={paymentMethod.toLocaleLowerCase()}
                        mode={mode}
                        isBudget={isBudget}
                    />
                </div>
            )}
        </div>
    );
};

export default Checkout;