import React from 'react';

const ProductList = ({ products, handleUpdate }) => {
    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Productos</h2>
            {products.length === 0 && <p>No hay productos agregados.</p>}

            {/* Tabla con títulos para cada columna */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Imagen</th>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2 text-left">Precio</th>
                            <th className="px-4 py-2 text-left">Stock</th>
                            <th className="px-4 py-2 text-left">Categoria</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-b">
                                <td className="px-4 py-2">
                                    <img src={`http://localhost:8080${p.img}`} className="w-16" alt={"img"} />

                                </td>

                                <td className="px-4 py-2">{p.id}</td>
                                <td className="px-4 py-2">{p.name}</td>
                                <td className="px-4 py-2">${p.price}</td>
                                <td className="px-4 py-2">{p.stock}</td>
                                <td className="px-4 py-2">{p.categoryName}</td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdate(p)}
                                            className="bg-yellow-500 text-white px-2 rounded"
                                        >
                                            Editar
                                        </button>
                                        <button className="bg-red-500 text-white px-2 rounded">
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
