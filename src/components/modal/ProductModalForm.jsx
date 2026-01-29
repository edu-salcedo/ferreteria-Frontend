import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import CategoryDropdown from '../iu/CategoryDropdown';

const API_URL = 'http://localhost:8080/products';

const ProductModalForm = ({ product, show, onHide, onSave, }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [img, setImg] = useState('');
    const [category, setCategory] = useState(null);
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState(1);
    const { create, update } = useApi(API_URL);
    const [errors, setErrors] = useState({ name: false, category: false, stock: false, price: false });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setDescription(product.description || '');
            setImg(product.img ? `http://localhost:8080${product.img}` : '');
            setCategory(product.categoryId ? {
                id: product.categoryId,
                name: product.categoryName,
            } : null);
            setStock(product.stock || 1);
            setPrice(product.price || 0);
            setImageFile(null);
        } else {
            setName('');
            setDescription('');
            setImg('');
            setCategory(null); // Valor por defecto
            setStock(1);
            setPrice('');
            setImageFile(null);
        }
    }, [product, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!name.trim()) return setErrors(prev => ({ ...prev, name: true }));
        if (!category) return setErrors(prev => ({ ...prev, category: true }));
        if (Number(stock) <= 0) return setErrors(prev => ({ ...prev, stock: true }));
        if (Number(price) <= 0) return setErrors(prev => ({ ...prev, price: true }));

        try {
            // Construimos el objeto del producto sin la propiedad 'img'
            const productData = {
                id: product?.id || null,
                name,
                description,
                categoryId: category?.id,
                stock: Number(stock),
                price: Number(price),
            };

            // Creamos FormData
            const formData = new FormData();
            formData.append(
                "product",
                new Blob([JSON.stringify(productData)], { type: "application/json" })
            );

            // Manejo de imagen
            if (imageFile) {
                // Si hay archivo nuevo, se envía
                formData.append("image", imageFile);
            } else if (img) {
                // Si no hay archivo nuevo pero existe una imagen previa, la convertimos en File
                const res = await fetch(img);
                const blob = await res.blob();
                const filename = img.split('/').pop();
                formData.append("image", new File([blob], filename, { type: blob.type }));
            }

            // Llamada a la API
            let response;
            if (product) {
                response = await update(product.id, formData); // update
                onSave("update", response);
            } else {
                response = await create(formData); // create
                onSave("create", response);
            }

            console.log("FormData entries:", [...formData.entries()]); // debug
            onHide();
        } catch (err) {
            console.error("Error al guardar producto:", err);
        }
    };


    const handleSelectCategory = (category) => { setCategory(category) };

    if (!show) return null; // No renderizar si no debe mostrarse

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{product ? "Editando producto" : "Nuevo producto"}</h2>
                    <button onClick={onHide} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre</label>
                        <input
                            type="text"
                            placeholder="Nombre del producto"
                            value={name}
                            onChange={e => {
                                setName(e.target.value);
                                if (errors.name && e.target.value.trim() !== '') {
                                    setErrors(prev => ({ ...prev, name: false }));
                                }
                            }}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">El nombre es obligatorio.</p>}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Descripción</label>
                        <input
                            type="text"
                            placeholder="Descripción del producto"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Imagen */}
                    <div className='flex gap-4'>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">Imagen</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImageFile(e.target.files[0]);
                                        setImg(URL.createObjectURL(e.target.files[0])); // Para mostrar preview
                                    }
                                }}
                                className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {img && (
                                <img
                                    src={img}
                                    alt="Preview"
                                    className="mt-2 w-32 h-32 object-cover rounded border"
                                />
                            )}
                        </div>
                        {/* dropdon category */}
                        <div className='w-1/2'>
                            <label className="block text-sm font-medium mb-1">Categoría</label>
                            <CategoryDropdown selected={category} onSelect={handleSelectCategory} />
                            {errors.category && <p className="text-red-500 text-sm mt-1">La categoría es obligatoria.</p>}
                        </div>

                    </div>

                    {/* Cantidad */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Cantidad</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={e => {
                                setStock(e.target.value);
                                if (errors.stock && Number(e.target.value) > 0) {
                                    setErrors(prev => ({ ...prev, stock: false }));
                                }
                            }}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.stock && <p className="text-red-500 text-sm mt-1">La cantidad debe ser mayor que 0.</p>}
                    </div>

                    {/* Precio */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Precio</label>
                        <input
                            type="number"
                            value={price}
                            onChange={e => {
                                setPrice(e.target.value);
                                if (errors.price && Number(e.target.value) > 0) {
                                    setErrors(prev => ({ ...prev, price: false }));
                                }
                            }}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">El precio debe ser mayor que 0.</p>}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            {product ? "Editar" : "Agregar"}
                        </button>
                        <button type="button" onClick={onHide} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}


export default ProductModalForm;