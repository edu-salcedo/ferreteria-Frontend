import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Checkout = () => {
    const { cart, clearCart, displayPrice } = useCart();
    const [orderResponse, setOrderResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [discount, setDiscount] = useState(0);

    const totalAmount = cart.reduce((sum, item) => sum + displayPrice(item.finalPrice) * item.quantity, 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return toast.error("El carrito está vacío");
        setLoading(true);
        try {

            const orderDTO = {
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: displayPrice(item.finalPrice),
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
    const emptyRows = Math.max(0, 15 - (orderResponse?.items?.length || 0));
    const totalWithDiscount = totalAmount - (totalAmount * discount) / 100;
    const handlePrint = () => {
        if (!orderResponse) return;

        const printWindow = window.open("", "_blank");
        const date = new Date().toLocaleDateString('es-AR');

        printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Presupuesto</title>
        <style>
            @page {
                size: A4;
                margin: 10mm;
            }

            body {
                font-family: Arial, sans-serif;
                font-size: 11px;
                margin: 0;
                color: #000;
            }

            .page {
                width: 190mm;
                margin: auto;
                min-height: 277mm; /* Alto A4 menos márgenes */
                display: flex;
                flex-direction: column;
            }
             .content{
                  flex: 1;
            }
                

            .header {
                display: flex;
                justify-content: space-around;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
                margin-bottom: 10px;
                margin-top: 20px;
                background-color: blue;
                padding-left: 20px;
                padding-right: 20px;  
            }

            .logo-section {
                width: 33.3%;
                font-size: 12px;
                font-weight: bold;
            }

            .type-section {
                border: 2px solid #000;
                font-size: 24px;
                font-weight: bold;
                height: 40px;
                line-height: 40px;
                text-align: center;
                width: 50px;
            }
             
            .number-section {

                text-align: right;
                width: 33.3%;
            }

            .client-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                margin-bottom: 10px;
                line-height: 1.6;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }

            thead {
                display: table-header-group;
                border: 1px solid #787575;
                background-color: #787575;
            }

            th {
                padding: 5px;
                text-align: left;
            }

            td {
                padding: 6px;
            }

            tr {
                page-break-inside: avoid;
            }

            .footer-section {

                border-top: 2px solid #000;
                padding-top: 10px;
            }

            .total-final {
                font-size: 16px;
                text-align: right;
                font-weight: bold;
            }

            @media print {
                .page {
                    page-break-after: always;
                }
            }
        </style>
    </head>
    <body>

        <div class="page">
           <div class="content">
            <div class="header">
                <div class="logo-section">
                    <h2 style="margin:0; font-size: 20px;">SANITARIO VERS</h2>
                    <p style="margin:0; font-size: 9px;">MATERIALES Y ACCESORIOS SANITARIOS</p>
                    <p style="margin:0; font-size: 9px;">Lunes a viernes 8:00 a 19:00</p>
                    <p style="margin:0; font-size: 9px;">9 DE JULIO 1615 - SAN FERNANDO</p>
                </div>

                <div style="display:flex; flex-direction:column; align-items:center; background-color:red; width:33.3%; padding:10px;">
                    <div class="type-section">X</div>
                    <p style="font-size:9px; text-align:center;">
                        Documento no válido como factura
                    </p>
                </div>

                <div class="number-section">
                    <p style="font-size: 14px; font-weight: bold; margin:0;">
                        PRESUPUESTO
                    </p>
                    <p style="margin:5px 0;">Fecha: ${date}</p>
                    <p style="font-size:9px;">Inicio actividades 06/01/2026</p>
                </div>
            </div>

            <div class="client-info">
                <div style="margin-left: 15px;">
                    <strong>Cliente:</strong> ___________________<br>
                    <strong>Domicilio:</strong> ___________________<br>
                    <strong>Localidad:</strong> ___________________
                </div>
                <div style="text-align:center;">
                    <strong>DNI/CUIT:</strong> ___________________<br>
                    <strong>Condición  de  Venta:</strong> Contado<br>
                    <strong>Vendedor:</strong> ___________________
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width:5%">CANT</th>
                        <th style="width:45%">DESCRIPCIÓN</th>
                        <th style="width:15%">PRECIO UNIT.</th>
                        <th style="width:${discount} %">DTO%</th>
                        <th style="width:15%">PRECIO C/DESC</th>
                        <th style="width:10%">IMPORTE</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderResponse.items.map(item => `
                        <tr>
                            <td>${item.quantity}</td>
                            <td>${item.name ?? item.productName ?? "Producto " + item.productId}</td>
                            <td>$ ${Math.floor(item.unitPrice).toLocaleString()}</td>
                            ${discount > 0 ? `<td>${discount}%</td>` : `<td></td>`} 
                            ${discount > 0 ? `<td>$ ${Math.floor(item.unitPrice * (1 - discount / 100)).toLocaleString()}</td>` : `<td></td>`}
                            <td>$ ${Math.floor(item.subtotal).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            </div>

            <div class="footer-section">
                <div class="total-final">
                    <p style="font-size:18px;">
                        TOTAL: $ ${Math.floor(displayPrice(orderResponse.totalAmount)).toLocaleString()}
                    </p>
                    <p style="font-size:18px;">
                    ${discount > 0 ? `TOTAL DESCUENTO: ${discount}% ${Math.floor(displayPrice(orderResponse.totalAmount * (1 - discount / 100))).toLocaleString()}` : ``}
                   </p>
                </div>
            </div>
        </div>

    </body>
    </html>
    `);

        printWindow.document.close();

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
                                    <span className="font-mono">${Math.floor(displayPrice(item.quantity * item.finalPrice))}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-around gap-4">
                            <div className="flex  items-center gap-2">
                                <p>Descuento</p>
                                <button onClick={() => setDiscount((prev) => Math.max(0, prev - 1))} className=" bg-gray-400 px-2 rounded">-</button>
                                <span>{discount} %</span>
                                <button onClick={() => setDiscount((prev) => Math.min(100, prev + 1))} className="bg-green-400 px-2 rounded">+</button>

                            </div>
                            <h2 className=" text-gray-800 mb-4 ml-4">Total lista: ${Math.floor(totalAmount)}</h2>
                            <h2 className="text-2xl font-bold text-right mb-4 ml-4">Total: ${Math.floor(totalWithDiscount)}</h2>
                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className=" bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                {loading ? "Procesando..." : "Confirmar compra"}
                            </button>
                        </div>
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