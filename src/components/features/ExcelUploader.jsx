import { useState, useRef } from "react";
import { useApi } from "../../hooks/useApi";

const ExcelUploader = () => {

    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");

    const [processing, setProcessing] = useState(false);

    const [result, setResult] = useState(null);


    const inputRef = useRef(null);


    const { create, loading } = useApi(
        "excel/import",
        {},
        false
    );


    // ==========================
    // DRAG
    // ==========================

    const handleDrag = (e) => {

        e.preventDefault();
        e.stopPropagation();

        if (
            e.type === "dragenter" ||
            e.type === "dragover"
        ) {
            setDragActive(true);
        } else {
            setDragActive(false);
        }
    };


    const handleDrop = (e) => {

        e.preventDefault();
        e.stopPropagation();

        setDragActive(false);

        const selected = e.dataTransfer.files?.[0];

        if (selected) {
            selectFile(selected);
        }
    };


    const handleChange = (e) => {

        const selected = e.target.files?.[0];

        if (selected) {
            selectFile(selected);
        }
    };


    const selectFile = (file) => {

        setFile(file);
        setMessage("");
        setResult(null);
        setProgress(0);

    };



    // ==========================
    // SUBIR EXCEL
    // ==========================


    const handleUpload = async () => {


        if (!file) {
            setMessage("Seleccione un archivo Excel");
            return;
        }


        setProgress(0);
        setProcessing(true);
        setMessage("Procesando archivo...");
        setResult(null);


        const formData = new FormData();

        formData.append(
            "file",
            file
        );


        try {


            const response = await create(
                formData,
                {

                    onUploadProgress: (event) => {

                        if (event.total) {

                            const percent =
                                Math.round(
                                    event.loaded * 100 / event.total
                                );

                            setProgress(percent);

                        }

                    }

                }
            );


            /*
                Ejemplo respuesta backend:

                {
                    newCategories:2,
                    newProducts:10,
                    updatedProducts:5,
                    newVariants:15,
                    updatedVariants:3
                }

            */


            setResult(response);


            setMessage(
                "Archivo importado correctamente"
            );


        } catch (error) {

            console.log(error);

            setMessage(
                "Error procesando archivo"
            );

        }
        finally {

            setProcessing(false);

        }

    };



    // ==========================
    // LIMPIAR
    // ==========================


    const clearFile = () => {

        setFile(null);
        setProgress(0);
        setMessage("");
        setResult(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }

    };



    return (

        <div className="
            max-w-lg 
            mx-auto
            mt-10
            bg-white
            shadow-lg
            rounded-lg
            p-6
        ">


            <h2 className="
                text-2xl
                font-bold
                mb-5
                text-gray-800
            ">
                Importar productos Excel
            </h2>



            {/* DROP AREA */}

            <div

                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}

                onClick={() =>
                    inputRef.current.click()
                }

                className={`
                    h-44
                    border-2
                    border-dashed
                    rounded-lg
                    flex
                    flex-col
                    justify-center
                    items-center
                    cursor-pointer
                    transition

                    ${dragActive
                        ?
                        "border-blue-500 bg-blue-50"
                        :
                        "border-gray-400 bg-gray-50"
                    }

                `}
            >


                <input

                    ref={inputRef}

                    type="file"

                    accept="
                    .xlsx,
                    .xls
                    "

                    onChange={handleChange}

                    className="hidden"

                />



                {
                    !file ?

                        <>

                            <span className="text-5xl">
                                📤
                            </span>

                            <p className="text-gray-600">
                                Arrastre el Excel aquí
                            </p>

                            <p className="text-xs text-gray-400">
                                o haga click
                            </p>


                        </>


                        :

                        <>

                            <span className="text-5xl">
                                📊
                            </span>


                            <p className="
                        font-medium
                        text-gray-800
                    ">
                                {file.name}
                            </p>


                            <p className="text-xs text-gray-500">

                                {(file.size / 1024)
                                    .toFixed(2)} KB

                            </p>



                            <button

                                onClick={(e) => {

                                    e.stopPropagation();

                                    clearFile();

                                }}

                                className="
                            mt-3
                            text-blue-600
                            text-sm
                        "
                            >

                                Cambiar archivo

                            </button>


                        </>


                }


            </div>




            {/* BOTON */}

            <button

                onClick={handleUpload}

                disabled={
                    loading ||
                    processing
                }

                className="
                    mt-5
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    py-2
                    rounded
                    disabled:opacity-50
                "

            >

                {
                    processing
                        ?
                        "Procesando..."
                        :
                        "Importar Excel"
                }


            </button>




            {/* PROGRESO */}

            <div className="
                mt-5
                h-4
                bg-gray-200
                rounded
                overflow-hidden
            ">


                <div

                    className="
                        h-full
                        bg-green-500
                        transition-all
                    "

                    style={{
                        width: `${progress}%`
                    }}

                />


            </div>



            {
                processing &&

                <p className="
                    text-center
                    text-blue-600
                    mt-2
                    animate-pulse
                ">

                    Guardando productos y variantes...

                </p>

            }




            {/* MENSAJE */}

            {
                message &&

                <p className="
                    text-center
                    mt-4
                    font-medium
                ">

                    {message}

                </p>

            }




            {/* RESULTADO IMPORTACION */}


            {
                result &&

                <div className="
                mt-6
                bg-gray-100
                rounded
                p-4
                text-sm
            ">


                    <h3 className="
                    font-bold
                    mb-3
                ">

                        Resultado:

                    </h3>



                    <p>
                        📂 Categorías nuevas:
                        {" "}
                        {result.newCategories}
                    </p>


                    <p>
                        🆕 Productos creados:
                        {" "}
                        {result.newProducts}
                    </p>


                    <p>
                        🔄 Productos actualizados:
                        {" "}
                        {result.updatedProducts}
                    </p>


                    <p>
                        📦 Variantes nuevas:
                        {" "}
                        {result.newVariants}
                    </p>


                    <p>
                        ♻️ Variantes actualizadas:
                        {" "}
                        {result.updatedVariants}
                    </p>



                </div>


            }


        </div>

    );
};


export default ExcelUploader;