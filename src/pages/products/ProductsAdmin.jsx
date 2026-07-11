import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useApi } from "../../hooks/useApi";

import Sidebar from "../../components/Dashboard/Sidebar";
import SearchBar from "../../components/iu/SearchBar";
import CategoryDropdown from "../../components/iu/CategoryDropdown";
import Pagination from "../../components/iu/Pagination";

import ProductList from "./ProductList";
import ProductModalForm from "../../components/modal/ProductModalForm";
import ExcelUploaderModal from "../../components/modal/ExcelUploaderModal";
import ExportProductExcel from "../../components/product/ExportProductExcel";

import { Download } from "lucide-react";
const PAGE_SIZE = 20;

const ProductsAdmin = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [showModal, setShowModal] = useState(false);
    const [showExcel, setShowExcel] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const {
        data: products = [],
        loading,
        error,
        create,
        update,
        refetch
    } = useApi("products");

    //-------------------------------------------------

    const params = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    );

    const search = params.get("search") || "";

    const category = params.get("category");

    const currentPage = Number(params.get("page")) || 1;

    //-------------------------------------------------

    const updateParams = (updates) => {

        const p = new URLSearchParams(location.search);

        Object.entries(updates).forEach(([k, v]) => {

            if (v === null || v === "" || v === undefined) {
                p.delete(k);
            } else {
                p.set(k, v);
            }

        });
        navigate({ search: p.toString() });
    };

    const filtered = products.filter(p => {
        // Solución 1: Evita que la app muera si p.name no existe
        const productName = p.name || "";

        const matchSearch =
            productName.toLowerCase().includes(
                search.toLowerCase()
            );

        const matchCategory =
            category ? Number(p.categoryId) === Number(category) : true;

        return matchSearch && matchCategory;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

    const safePage = currentPage > totalPages ? 1 : currentPage;

    const paginated =
        filtered.slice(
            (safePage - 1) * PAGE_SIZE,
            safePage * PAGE_SIZE
        );
    const handleCreate = () => {

        setSelectedProduct(null);
        setShowModal(true);
    };

    const handleEdit = (product) => {

        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleSave = async (action, dto) => {
        try {
            // 1. Detectamos de forma segura si es edición o creación
            const productId = selectedProduct?.id || dto?.id;
            const isEditing = !!productId;

            // 2. Preparamos los datos. Tu hook useApi usa 'multipart/form-data'.
            // Si el modal te envía un FormData, lo usamos directamente.
            // Si te envía un objeto común (JSON), lo convertimos automáticamente a FormData.
            let dataToSend;
            if (dto instanceof FormData) {
                dataToSend = dto;
            } else {
                dataToSend = new FormData();
                Object.entries(dto).forEach(([key, value]) => {
                    // Evitamos enviar valores nulos o undefined vacíos
                    if (value !== null && value !== undefined) {
                        dataToSend.append(key, value);
                    }
                });
            }

            // 3. Ejecutamos la acción correspondiente en la API
            if (isEditing) {
                // Al editar, tu hook hace: api.put(`${url}/${id}`, formData)
                await update(productId, dataToSend);
            } else {
                // Al crear, tu hook hace: api.post(url, formData)
                await create(dataToSend);
            }

            // 4. Refrescamos la lista de la tabla y cerramos el modal
            refetch();
            setShowModal(false);

        } catch (e) {
            console.error("Error crítico al procesar handleSave:", e);
            // Opcional: Aquí podrías setear un estado de error local para mostrar una alerta al usuario
        }
    };

    //-------------------------------------------------
    return (
        <>
            <ProductModalForm
                show={showModal}
                product={selectedProduct}
                onHide={() => setShowModal(false)}
                onSave={handleSave}
            />
            <ExcelUploaderModal
                show={showExcel}
                onHide={() => setShowExcel(false)}
                onImported={() => {
                    refetch();
                    setShowExcel(false);
                }}
            />
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-3">
                    <div className="sticky top-4">
                        <CategoryDropdown
                            mode="list"
                            selected={category ? { id: Number(category) } : null}
                            onSelect={(cat) =>
                                updateParams({
                                    category: cat?.id,
                                    page: 1
                                })
                            }
                        />
                        <Sidebar />
                    </div>
                </div>
                <div className="col-span-9">
                    <div className="bg-white rounded-xl shadow p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">
                                Productos
                            </h1>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowExcel(true)}
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Importar Excel
                                </button>

                                <button
                                    onClick={() => ExportProductExcel(filtered)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <Download size={18} />

                                    Excel
                                </button>

                                <button
                                    onClick={handleCreate}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Nuevo Producto
                                </button>
                            </div>
                        </div>
                        <SearchBar
                            value={search}
                            onInputChange={(v) =>
                                updateParams({ search: v, page: 1 })
                            }
                        />
                        <div className="mt-5">
                            {
                                loading ? <p>Cargando...</p>
                                    :
                                    error ? <p>Error</p>
                                        :
                                        <ProductList
                                            products={paginated}
                                            handleUpdate={handleEdit}
                                        />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateParams({ page })}
            />
        </>
    );
};

export default ProductsAdmin;