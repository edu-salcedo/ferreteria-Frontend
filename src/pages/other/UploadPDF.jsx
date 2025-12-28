import { useState } from "react";
import axios from "axios";

const UploadPDF = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage("Por favor selecciona un archivo PDF");
            return;
        }

        const formData = new FormData();
        formData.append("file", file); // "file" debe coincidir con @RequestPart en Spring

        try {
            const response = await axios.post(
                "http://localhost:8080/products/upload-pdf", // tu endpoint
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setMessage(response.data);
        } catch (error) {
            console.error(error);
            setMessage("Error al subir el PDF");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Subir PDF de productos</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="block w-full border rounded px-3 py-2"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Subir PDF
                </button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
}

export default UploadPDF;
