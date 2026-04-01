import { forwardRef } from "react";

const InvoiceA4 = forwardRef(
    (
        {
            orderResponse,
            mode = "budget",         // "budget" o "sale"
            paymentMethod = "efectivo"
        },
        ref
    ) => {

        const safeNumber = (value) => {
            const num = Number(value);
            return isNaN(num) ? 0 : num;
        };

        const now = new Date();
        const date = now.toLocaleDateString("es-AR");
        const time = now.toLocaleTimeString("es-AR");

        const orderNumber = orderResponse?.id || Math.floor(Math.random() * 10000);
        const totalFinal = safeNumber(orderResponse?.totalAmount);

        const formatPrice = (value) => {
            return value?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0,00";
        };

        return (
            <div
                ref={ref}
                className="w-[190mm] min-h-[290mm] mx-auto flex flex-col text-[11px] font-sans text-black p-4"
            >
                {/* HEADER */}
                <div className="flex justify-between border-b-2 mt-4 p-3">
                    <div>
                        <h2 className="text-[22px] font-bold">SANITARIO VERS</h2>
                        <p className="text-[13px]">Materiales y accesorios sanitarios</p>
                        <p className="text-[13px]">9 de Julio 1615 - San Fernando</p>
                        <p className="text-[14px]">Tel: 1171124180</p>
                    </div>

                    <div className="text-center">
                        <div className="text-[36px] font-bold w-[60px] h-[50px] flex items-center justify-center border m-auto">
                            X
                        </div>
                        <p className="text-[12px]">
                            {mode === "budget" ? "documento no válido como factura" : "FACTURA"}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="font-bold text-[14px]">{mode === "budget" ? "PRESUPUESTO" : "VENTA"}</p>
                        <p>N°: {orderNumber}</p>
                        <p>Fecha: {date}</p>
                        <p>Hora: {time}</p>
                    </div>
                </div>

                {/* CLIENTE */}
                <div className="grid grid-cols-2 mb-3 p-2">
                    <div>
                        <p><strong>Cliente:</strong> {orderResponse?.customerName || "-"}</p>
                        <p><strong>Domicilio:</strong> {orderResponse?.customerAddress || "-"}</p>
                        <p><strong>Localidad:</strong> {orderResponse?.customerCity || "-"}</p>
                    </div>
                    <div>
                        <p><strong>DNI/CUIT:</strong> {orderResponse?.customerDni || "-"}</p>
                        <p><strong>Pago:</strong> {paymentMethod === "tarjeta" ? "Tarjeta" : "Efectivo"}</p>
                        <p><strong>Vendedor:</strong> {orderResponse?.seller || "-"}</p>
                    </div>
                </div>

                {/* TABLA */}
                <table className="w-full border-collapse text-[11px]">
                    <thead className="border">
                        <tr>
                            <th className="p-1 text-start">CANT</th>
                            <th className="p-1 text-start">DESCRIPCIÓN</th>
                            <th className="p-1 text-start">PRECIO</th>
                            <th className="p-1 text-start">DTO%</th>
                            <th className="p-1 text-start">PRECIO C/D</th>
                            <th className="p-1 text-start">TOTAL</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orderResponse?.items?.map((item, i) => {
                            return (
                                <tr key={i}>

                                    <td className="pl-3">{item.quantity}</td>
                                    <td className="p-1">{item.productName || "Producto"}</td>
                                    <td className="p-1">$ {formatPrice(item.salePrice)}</td>
                                    <td className="p-1">{item.discountApplied > 0 ? `${item.discountApplied}%` : "-"}</td>
                                    <td className="p-1">$ {formatPrice(item.salePriceFinal)}</td>
                                    <td className="p-1">$ {formatPrice(item.subtotal)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* FOOTER */}
                <div className="relative mt-auto pt-3 border-t text-right pr-2 text-[16px]">
                    <div>
                        <p>
                            Subtotal: $
                            {orderResponse?.subTotal ? formatPrice(orderResponse.subTotal) : "0.00"}
                        </p>
                        <p>
                            Descuento: $
                            {orderResponse?.totalDiscount ? formatPrice(orderResponse.totalDiscount) : "0.00"}
                            {console.log(orderResponse?.totalDiscount)}
                        </p>

                        <p className="text-[18px] font-bold">
                            TOTAL: $ {orderResponse ? formatPrice(totalFinal) : "0.00"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
);

export default InvoiceA4;