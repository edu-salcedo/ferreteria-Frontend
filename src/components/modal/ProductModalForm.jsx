import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import CategoryDropdown from '../iu/CategoryDropdown';

const API_URL = import.meta.env.VITE_API_URL;
const ProductModalForm = ({ product, show, onHide, onSave, }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [img, setImg] = useState("");
    const [category, setCategory] = useState(null);
    const [variants, setVariants] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({ name: false, category: false });

    useEffect(() => {

        if (product) {

            setName(product.name ?? "");
            setDescription(product.description ?? "");
            setImg(product.img ? API_URL + product.img : "");
            setCategory({ id: product.categoryId, name: product.categoryName });
            setVariants(
                product.variants?.length
                    ? product.variants
                    : []
            );

            setImageFile(null);

        } else {
            setName("");
            setDescription("");
            setImg("");
            setCategory(null);
            setVariants([
                {
                    measure: "",
                    purchasePrice: 0,
                    profitMargin: 40,
                    salePrice: 0,
                    stock: 0
                }
            ]);

            setImageFile(null);
        }
    }, [product, show]);

    const addVariant = () => {

        setVariants(prev => [
            ...prev, {
                measure: "",
                purchasePrice: 0,
                profitMargin: 40,
                salePrice: 0,
                stock: 0
            }
        ]);

    };
    const removeVariant = (index) => {

        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const updateVariant = (index, field, value) => {

        const list = [...variants];

        list[index][field] = value;

        if (field === "purchasePrice" || field === "profitMargin") {

            const purchase = Number(list[index].purchasePrice);
            const margin = Number(list[index].profitMargin);
            list[index].salePrice = purchase + purchase * margin / 100;
        }
        setVariants(list);
    };


    const validate = () => {

        const e = {};

        if (!name.trim()) { e.name = true; }

        if (!category) { e.category = true; }

        if (variants.length === 0) {

            alert("Debe agregar una variante.");
            return false;
        }

        for (const v of variants) {

            if (!v.measure) {

                alert("Todas las variantes deben tener medida.");
                return false;
            }

            if (Number(v.purchasePrice) <= 0) {

                alert("Precio inválido.");
                return false;
            }
        }
        setErrors(e);

        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Usamos tu función de validación que sí revisa correctamente el arreglo de variantes
        if (!validate()) return;

        try {
            // 2. Construimos el objeto del producto adaptado a tu lógica de variantes
            const productData = {
                id: product?.id || null,
                name: name.trim(),
                description: description.trim(),
                categoryId: category?.id || null,
                state: product?.state ?? true,
                // Agregamos las variantes reales del estado al objeto final
                variants: variants.map(v => ({
                    ...v,
                    purchasePrice: Number(v.purchasePrice),
                    profitMargin: Number(v.profitMargin),
                    salePrice: Number(v.salePrice),
                    stock: Number(v.stock)
                }))
            };

            // 3. Creamos el FormData para el envío Multipart
            const formData = new FormData();
            // Enviamos el objeto completo serializado como string (común en controladores @RequestPart de Java/Spring)
            formData.append("product", JSON.stringify(productData));

            // Manejo del archivo binario de la imagen
            if (imageFile) {
                formData.append("image", imageFile);
            }

            // 4. CORRECCIÓN CRÍTICA: No llames a create/update aquí dentro. 
            // Delegamos todo el proceso al componente padre mediante onSave.
            const action = product ? "update" : "create";
            await onSave(action, formData);

            // Cerramos el modal limpiamente
            onHide();
        } catch (err) {
            console.error("Error al procesar el envío del formulario:", err);
        }
    };



    const handleSelectCategory = (category) => { setCategory(category) };

    if (!show) return null; // No renderizar si no debe mostrarse

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center p-3 justify-center">
            <div className="bg-white w-full max-w-150 rounded-2xl shadow-xl  max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center mb-4 ">
                    <h2 className="text-xl font-semibold m-auto">{product ? "Editando producto" : "Nuevo producto"}</h2>
                    <button onClick={onHide} className="text-gray-500 text-3xl hover:text-gray-700  pe-5">&times;</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">

                    <div className="grid grid-cols-2 gap-6">

                        <div>
                            <label className="font-semibold"> Nombre</label>
                            <input
                                className="w-full border rounded p-2"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-semibold"> Categoría  </label>

                            <CategoryDropdown
                                selected={category}
                                onSelect={setCategory}
                            />

                        </div>

                    </div>

                    <div className="mt-4">

                        <label className="font-semibold"> Descripción</label>

                        <textarea
                            rows={3}
                            className="w-full border rounded p-2"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="mt-4 flex gap-6">
                        {/* imagen */}
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {

                                    if (e.target.files[0]) {

                                        setImageFile(e.target.files[0]);
                                        setImg(URL.createObjectURL(e.target.files[0])
                                        );
                                    }

                                }}
                            />

                        </div>

                        {img &&
                            <img src={img} className="w-32 h-32 object-cover rounded border" alt="" />
                        }

                    </div><div className="mt-8">

                        <div className="flex justify-between items-center mb-3">

                            <h2 className="text-xl font-semibold"> Variantes </h2>

                            <button
                                type="button"
                                onClick={addVariant}
                                className="bg-green-600 text-white px-3 py-2 rounded"
                            >
                                + Agregar variante
                            </button>

                        </div>

                        <table className="w-full border">

                            <thead>

                                <tr className="bg-gray-100">

                                    <th className="border p-2">Medida</th>
                                    <th className="border p-2">Compra</th>
                                    <th className="border p-2"> % </th>
                                    <th className="border p-2">Venta</th>
                                    <th className="border p-2">Stock</th>
                                    <th className="border p-2">eliminar </th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    variants.map((variant, index) => (

                                        <tr key={index}>

                                            <td className="border w-[40%]">
                                                <input
                                                    className="w-full p-2"
                                                    value={variant.measure}
                                                    onChange={e =>
                                                        updateVariant(
                                                            index,
                                                            "measure",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td className="border w-[15%]">

                                                <input
                                                    type="number"
                                                    className="w-full p-2"
                                                    value={variant.purchasePrice}
                                                    onChange={e =>
                                                        updateVariant(
                                                            index,
                                                            "purchasePrice",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="border w-[10%]">
                                                <input
                                                    type="number"
                                                    className="w-full p-2"
                                                    value={variant.profitMargin}
                                                    onChange={e =>
                                                        updateVariant(
                                                            index,
                                                            "profitMargin",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="border w-[15%]">
                                                <input
                                                    disabled
                                                    className="w-full bg-gray-100 p-2"
                                                    value={variant.salePrice}
                                                />
                                            </td>
                                            <td className="border w-[10%]">
                                                <input
                                                    type="number"
                                                    className="w-full p-2"
                                                    value={variant.stock}
                                                    onChange={e =>
                                                        updateVariant(
                                                            index,
                                                            "stock",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td className="border text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(index)}
                                                    className="text-red-600"
                                                >
                                                    🗑
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded"
                        >
                            {product ? "Actualizar" : "Crear"}

                        </button>

                        <button

                            type="button"
                            onClick={onHide}
                            className="bg-gray-300 px-6 py-2 rounded"
                        >
                            Cancelar
                        </button>

                    </div>

                </form>

            </div >
        </div >
    );
}


export default ProductModalForm;