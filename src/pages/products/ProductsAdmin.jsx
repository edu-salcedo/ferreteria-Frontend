import { useMemo, useEffect, useState } from "react";
import { useNavigate, useLocation, useMatch } from 'react-router-dom';
import SearchBar from "../../components/iu/SearchBar";
import CategoryDropdown from "../../components/iu/CategoryDropdown";
import ProductList from "./ProductList";
import ProductModalForm from "../../components/modal/ProductModalForm";
import Pagination from "../../components/iu/Pagination";
import { useApi } from "../../hooks/useApi";

const ProductsAdmin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [updateProduct, setUpdateProduct] = useState(null);
    const [showModalForm, setShowModalForm] = useState(false);

    const pageSize = 20;

    const { data: productList, loading, error, refetch, create, update } = useApi('products');

    const handleCreate = () => {
        setUpdateProduct(null);

        setShowModalForm(true);
    };

    const handleUpdate = (product) => {
        setUpdateProduct(product);
        setShowModalForm(true);
    };

    const handleSave = async (action, savedProduct) => {
        try {

            if (action === "update") {
                await update(savedProduct.id, savedProduct);
            }
            if (action === "create") {
                await create(savedProduct);
            }
        } catch (err) {
            console.error("Error al guardar producto:", err);
        }
        finally {
            setShowModalForm(false);
            refetch(); // recargar lista luego de guardar
        }

    };



    const params = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    );
    const searchTerm = params.get("search") || "";
    const categoryId = params.get("category");
    const currentPage = Number(params.get("page")) || 1;
    const selectedCategory = categoryId
        ? { id: Number(categoryId) }
        : null;


    const updateParams = (updates) => {
        const newParams = new URLSearchParams(location.search);

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "" || value === undefined) {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });

        navigate({ search: newParams.toString() });
    };


    // Filtrar productos según búsqueda y categoría seleccionada
    const filteredProducts = (productList ?? []).filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? Number(product.categoryId) === selectedCategory.id : true;
        return matchesSearch && matchesCategory;
    });


    // --- Calcular paginación ---
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);


    return (
        <>

            <ProductModalForm show={showModalForm} onHide={() => setShowModalForm(false)} product={updateProduct} onSave={handleSave} />
            <div className="grid grid-cols-12 gap-4 mt-2">
                <div className="col-span-2 min-h-screen ">
                    <div className="sticky top-4">

                        <CategoryDropdown
                            mode="list"
                            selected={selectedCategory}
                            onSelect={(cat) =>
                                updateParams({
                                    category: cat?.id ?? null,
                                    page: 1,
                                })
                            }

                        />
                    </div>
                </div>
                <div className="col-span-10">

                    <div className="flex flex-col md:flex-row items-center mt-5 px-4">
                        <div className="w-full md:w-1/3 mb-4 md:mb-0">

                            <SearchBar value={searchTerm} onInputChange={(value) => updateParams({ search: value, page: 1 })} />
                        </div>

                        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded ml-6">
                            Agregar Producto
                        </button>

                    </div>
                    {loading && <p>Cargando productos...</p>}
                    {error && <p>Error al cargar productos: {error.message}</p>}
                    <ProductList products={paginatedProducts} handleUpdate={handleUpdate} />
                </div>

            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => updateParams({ page })} />
        </>
    );
};

export default ProductsAdmin;
