import React from 'react';
const baseUrl = import.meta.env.VITE_API_URL;
const ProductList = ({ products, handleUpdate }) => {

    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Productos</h2>
            {products.length === 0 && <p>No hay productos agregados.</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Imagen</th>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2 text-left">Variantes</th>
                            <th className="px-4 py-2 text-left">Categoria</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">
                                    <img
                                        src={baseUrl + p.img}
                                        className="w-16 h-16 object-contain"
                                        alt={p.name}
                                    />
                                </td>

                                <td className="px-4 py-2 text-sm text-gray-500">{p.id}</td>
                                <td className="px-4 py-2 font-medium">{p.name}</td>
                                <td className="px-4 py-2 font-medium">{p.variants?.length || 0}</td>
                                <td className="px-4 py-2">{p.categoryName}</td>

                                <td className="px-4 py-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdate(p)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;