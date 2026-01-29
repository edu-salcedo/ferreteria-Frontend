import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const [orderResponse, setOrderResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const totalAmount = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return toast.error("El carrito está vacío");
        setLoading(true);
        try {

            const orderDTO = {
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.finalPrice,
                    name: item.name // Asegúrate de enviar el nombre si lo necesitas en el response
                }))
            };
            const res = await axios.post("http://localhost:8080/order", orderDTO);
            setOrderResponse(res.data);
            clearCart();
            toast.success("Compra realizada con éxito");
        } catch (err) {
            console.error(err);
            toast.error("Error al procesar la compra");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        if (!orderResponse) return;

        const printWindow = window.open("", "_blank");

        // Fecha actual formateada
        const date = new Date().toLocaleDateString('es-AR');

        printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Factura de Venta</title>
            <style>
                body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; color: #333; }
                .container { width: 650px; margin: auto; border: 1px solid #000; padding: 10px; margin-top: 30px; }
                .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; margin-top: 30px; }
                .logo-section { width: 45%; }
                .type-section { width: 50%; text-align: center; border: 2px solid #000; font-size: 24px; font-weight: bold; height: 40px; line-height: 40px; }
                .number-section { width: 40%; text-align: right; }
                .client-info { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 10px; line-height: 1.6; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th { background-color: #e0e0e0; border: 1px solid #999; padding: 5px; text-align: left; }
                td { border-left: 1px solid #ccc; border-right: 1px solid #ccc; padding: 8px; vertical-align: top; }
                /* El row-empty simula el espacio en blanco de la factura */
                .items-container { min-height: 600px; } 
                .footer-section { margin-top: 20px; border-top: 2px solid #000; padding-top: 10px; }
                .total-final { font-size: 16px; text-align: right; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo-section">
                        <h2 style="margin:0;">SANITARIO VERS</h2>
                        <p style="margin:0; font-size: 9px;">MATERIALES Y ACCESORIOS SANITARIOS.</p>
                        <p style="margin:0; font-size: 9px;">lunes a viernes de 8:00 a 19:00.</p>
                         <p style="margin:0; font-size: 9px;">9 DE JULIO 1615</p>
                         <p style="margin:0; font-size: 9px;">SAN FERNANDO</p>
                    </div>

                    <div class="" style="width: 15%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                       <div class="type-section">X</div>
                        <p  style="text-align: center;">documento no valido como factura</p>
                    </div>
                    <div class="number-section">
                        <p style="font-size: 14px; font-weight: bold; margin:0; text-transform: uppercase;">Presupuesto</p>
                        <p style="margin:5px 0;">Fecha: ${date}</p>
                        <p style="font-size: 9px;"></p>
                    </div>
                </div>

                <div class="client-info">
                    <div>
                        <strong>Cliente:</strong> ___________________________________<br>
                        <strong>Domicilio:</strong> _________________________________<br>
                        <strong>Localidad:</strong> _________________________________
                    </div>
                    <div style="text-align: right;">
                        <strong>DNI/CUIT:</strong> __________________<br>
                        <strong>Cond. Venta:</strong> <br>
                        <strong>Vendedor:</strong> ___________________
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 10%;">CANT</th>
                            <th style="width: 50%;">DESCRIPCIÓN</th>
                            <th style="width: 20%;">PRECIO UNIT.</th>
                            <th style="width: 20%;">IMPORTE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderResponse.items.map(item => `
                            <tr>
                                <td>${item.quantity}</td>
                                <td>${item.name ?? item.productName ?? "Producto " + item.productId}</td>
                                <td>$ ${Math.floor(item.unitPrice).toLocaleString()}</td>
                                <td>$ ${Math.floor(item.subtotal).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                        <tr style="height: auto;">
                            <td style="height: 400px;"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer-section">
                    <div class="total-final">
                        <p style="font-size: 20px;">TOTAL $: ${Math.floor(orderResponse.totalAmount).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `);

        printWindow.document.close();
        // Esperamos un poco a que cargue antes de llamar al diálogo de impresión
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {cart.length === 0 && !orderResponse && <p>Tu carrito está vacío</p>}

            {cart.length > 0 && (
                <>
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <ul className="mb-4 divide-y">
                            {cart.map(item => (
                                <li key={item.id} className="py-2 flex justify-between">
                                    <span>{item.quantity} x {item.name}</span>
                                    <span className="font-mono">${Math.floor(item.quantity * item.finalPrice)}</span>
                                </li>
                            ))}
                        </ul>
                        <h2 className="text-2xl font-bold text-right mb-4">Total: ${Math.floor(totalAmount)}</h2>
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            {loading ? "Procesando..." : "Confirmar compra"}
                        </button>
                    </div>
                </>
            )}

            {orderResponse && (
                <div className="mt-6 border-2 border-blue-200 bg-blue-50 p-6 rounded-lg text-center">
                    <h2 className="text-2xl font-bold mb-2 text-blue-800">¡Compra confirmada!</h2>
                    <p className="mb-4">Se ha generado el presupuesto con éxito.</p>
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-transform active:scale-95"
                    >
                        🖨️ Imprimir Factura / Presupuesto
                    </button>
                </div>
            )}
        </div>
    );
};

export default Checkout;