import { useState, useRef } from "react";

import { useApi } from "../../hooks/useApi";

const ExcelUploader = () => {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [processing, setProcessing] = useState(false);

    const inputRef = useRef(null);

    const { create, loading } = useApi("excel/import", {}, false);

    // Drag & Drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            setFile(e.dataTransfer.files[0]);
            setMessage("");
        }
    };

    const handleChange = (e) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setMessage("");
        }
    };

    // Upload con progreso
    const handleUpload = async () => {
        if (!file) return;

        setProgress(0);
        setProcessing(false);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            await create(formData, {
                onUploadProgress: (event) => {
                    if (event.total) {
                        const percent = Math.round(
                            (event.loaded * 100) / event.total
                        );
                        setProgress(percent);
                    }
                },
            });

            setProcessing(true); // 👈 backend trabajando
            setMessage("Procesando archivo...");
        } catch {
            setMessage("❌ Error al subir el archivo.");
            return;
        }

        setProcessing(false);
        setMessage("✔️ Archivo procesado correctamente.");
    };


    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Subir archivo Excel
            </h2>

            {/* Drag & Drop */}
            <div
                className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition
    ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-400 bg-gray-50"}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleChange}
                    className="hidden"
                />

                {/* CONTENIDO DINÁMICO */}
                {!file ? (
                    <>
                        <span className="text-4xl mb-2">📤</span>
                        <span className="text-gray-600 text-center">
                            Arrastrá un archivo aquí o hacé clic
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                            (.xls, .xlsx)
                        </span>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <span className="text-5xl mb-2">📊</span>

                        <p className="text-sm font-medium text-gray-800">
                            {file.name}
                        </p>

                        <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                        </p>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation(); // evita reabrir file dialog
                                setFile(null);
                                setProgress(0);
                                setMessage("");
                            }}
                            className="mt-2 text-xs text-blue-600 hover:underline"
                        >
                            Cambiar archivo
                        </button>
                    </div>
                )}
            </div>

            {/* Botón */}
            <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-5 w-full py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Subiendo..." : "Subir archivo"}
            </button>

            {/* Progreso */}
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4 overflow-hidden">
                <div
                    className="bg-green-600 h-4 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {progress === 100 && processing && (
                <p className="mt-2 text-sm text-blue-600 text-center animate-pulse">
                    Procesando archivo...
                </p>
            )}

            {/* Mensaje */}
            {message && (
                <p className="mt-4 text-center text-sm font-medium">
                    {message}
                </p>
            )}
        </div>
    );
};

export default ExcelUploader;
