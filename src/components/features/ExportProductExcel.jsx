import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportProductExcel = (products) => {

    const data = [];

    products.forEach((product) => {
        data.push({
            "img": product.img,
            "code": product.id,
            "nombre": product.name,
            "category": product.categoryName,
            "measure": product.name,
            "stock": product.stock,
            "Precio compra": product.purchasePrice,
        });
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
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "productos");

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

export default ExportProductExcel; 