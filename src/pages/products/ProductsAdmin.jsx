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

    /* 🔹 1. DERIVAR ESTADO DESDE LA URL */
    const params = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    );
    const search = params.get("search") || "";
    const category = params.get("category") || "";
    const currentPage = Number(params.get("page")) || 1;

    /* 🚀 2. CONSULTA DINÁMICA AL BACKEND (PAGINADA Y FILTRADA) */
    // Pasamos los query params directo a Spring Boot. Restamos 1 a la página ya que el backend indexa en 0.
    const { data: pageData, loading, error, create, update, refetch } = useApi(
        `products?search=${encodeURIComponent(search)}&categoryId=${category}&page=${currentPage - 1}&size=${PAGE_SIZE}`
    );

    // Extraemos de manera segura los datos estructurales del objeto Page de Spring
    const paginated = pageData?.content || [];
    const totalPages = pageData?.totalPages || 1;

    /* 🔹 3. HELPERS PARA ACTUALIZAR URL */
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
            const productId = selectedProduct?.id || dto?.id;
            const isEditing = !!productId;

            let dataToSend;
            if (dto instanceof FormData) {
                dataToSend = dto;
            } else {
                dataToSend = new FormData();
                Object.entries(dto).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        dataToSend.append(key, value);
                    }
                });
            }

            if (isEditing) {
                await update(productId, dataToSend);
            } else {
                await create(dataToSend);
            }

            refetch();
            setShowModal(false);
        } catch (e) {
            console.error("Error crítico al procesar handleSave:", e);
        }
    };

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
                            onSelect={(cat) => updateParams({ category: cat?.id ?? null, page: 1 })}
                        />
                        <Sidebar />
                    </div>
                </div>
                <div className="col-span-9">
                    <div className="bg-white rounded-xl shadow p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold"> Productos </h1>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowExcel(true)}
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Importar Excel
                                </button>
                                {/* Nota: ExportProductExcel consumirá los 20 elementos de la página actual */}
                                <button
                                    onClick={() => ExportProductExcel(paginated)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <Download size={18} /> Excel
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
                            onInputChange={(v) => updateParams({ search: v, page: 1 })}
                        />
                        <div className="mt-5">
                            {loading && <p>Cargando...</p>}
                            {error && (
                                <div className="text-red-600">
                                    {error.response?.data?.message || error.message || String(error)}
                                </div>
                            )}
                            <ProductList products={paginated} handleUpdate={handleEdit} />
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
