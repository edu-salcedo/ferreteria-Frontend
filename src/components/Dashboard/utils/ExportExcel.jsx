import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportExcel = (orders) => {

    const data = [];

    orders.forEach((order) => {

        (order.items || []).forEach(
            (item) => {

                const quantity = Number(item.quantity || 0);
                const basePrice = Number(item.basePrice || 0);
                const finalPrice = Number(item.finalPrice || 0);
                const total = quantity * finalPrice;
                const profit = (finalPrice - basePrice) * quantity;

                data.push({

                    "Fecha": new Date(order.createdAt).toLocaleString(),
                    "Orden": order.id,
                    "Producto": item.productName,
                    "Cantidad": quantity,
                    "Precio Compra": basePrice,
                    "Compra*cant": basePrice * quantity,
                    "Precio Venta": finalPrice,
                    "Venta total": total,
                    "Ganancia": order.paymentMethod,
                });
            }
        );
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    worksheet["!cols"] = [
        { wch: 25 },
        { wch: 10 },
        { wch: 30 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");

    const excelBuffer =
        XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

    const fileData =
        new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

    saveAs(fileData, `ventas_${Date.now()}.xlsx`);

};

export default ExportExcel; 