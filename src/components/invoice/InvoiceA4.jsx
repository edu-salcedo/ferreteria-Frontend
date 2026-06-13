import { forwardRef } from "react";
import logo from "../../assets/img/logo.png";

const InvoiceA4 = forwardRef(
    (
        {
            orderResponse,
            mode = "budget",         // "budget" o "sale"
            paymentMethod = "efectivo",
            isBudget
        },
        ref
    ) => {

        const safeNumber = (value) => {
            const num = Number(value);
            return isNaN(num) ? 0 : num;
        };
        const isLargeInvoice = orderResponse?.items?.length > 10;

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
                ref={ref}                                                                      //text-blue-800
                className={` mx-auto flex flex-col font-sans text-black pt-4
                         ${isLargeInvoice
                        ? "w-[180mm] min-h-[290mm] text-[11px] p-4"
                        : "w-[200mm] min-h-[148mm] text-[9px] p-6"}
                           `}
            >
                {/* HEADER */}
                <div className="flex justify-between border-b-1">
                    <div className="w-[40%] text-center">
                        <img src={logo} className="w-40 m-auto" alt="Logo" />
                        <p className="text-[15px]">9 de Julio 1615 - San Fernando</p>
                        <p className="text-[15px]">Tel: 1171124180</p>
                    </div>

                    <div className="text-center w-[30%] pt-4">
                        <div className="text-[36px] font-bold w-[60px] h-[50px] flex items-center justify-center border m-auto">
                            X
                        </div>
                        <p className="text-[12px]">
                            {/* {mode === "budget" ? "documento no válido como factura" : "FACTURA"} */}
                            documento no válido como factura
                        </p>
                    </div>

                    <div className="text-center w-[30%] pt-4">
                        <p className="font-bold text-[18px]">PRESUPUESTO </p>
                        {/* <p className="font-bold text-[18px]">{mode === "budget" ? "PRESUPUESTO" : "VENTA"}</p> */}
                        <div className="text-[14px]">
                            <p>N°: {orderNumber}</p>
                            <p>Fecha: {date}</p>
                            <p>Hora: {time}</p>
                        </div>
                    </div>
                </div>

                {/* CLIENTE */}
                <div className="grid grid-cols-2 mb-3 p-2">
                    <div>
                        <p><strong>Cliente:</strong> {orderResponse?.customerName || "-"}</p>
                        <p><strong>Domicilio:</strong> {orderResponse?.customerAddress || "-"}</p>
                    </div>
                    <div>
                        <p><strong>DNI/CUIT:</strong> {orderResponse?.customerDni || "-"}</p>
                        <p><strong>Pago: CONTADO</strong></p>
                    </div>
                </div>

                {/* TABLA */}
                <table className="w-full border-collapse text-[11px]">
                    <thead className="border">
                        <tr>
                            <th className="p-1 text-start">CANT</th>
                            <th className="p-1 text-start">DESCRIPCIÓN</th>
                            <th className="p-1 text-start">PRECIO UNI</th>
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
                                    <td className="p-1">$ {formatPrice(item.unitePrice)}</td>
                                    <td className="p-1">{item.discountApplied > 0 ? `${item.discountApplied}%` : "-"}</td>
                                    <td className="p-1">{isBudget ? "$" + formatPrice(item.finalPrice) : ""}</td>
                                    <td className="p-1">$ {formatPrice(item.subtotal)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* FOOTER */}
                <div className="relative mt-auto pt-3 border-t text-right pr-2 text-[16px]">
                    <div className="flex  justify-between items-center">
                        <div>

                        </div>
                        <div >
                            <p>
                                Subtotal: $
                                {orderResponse?.subTotal ? formatPrice(orderResponse.subTotal) : "0.00"}
                            </p>

                            <p className="text-[18px] font-bold">
                                TOTAL: $ {orderResponse ? formatPrice(totalFinal) : "0.00"}
                            </p>
                            <p>
                                .
                                {/* {orderResponse?.totalDiscount ? formatPrice(orderResponse.totalDiscount) : "0.00"} */}

                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

export default InvoiceA4;