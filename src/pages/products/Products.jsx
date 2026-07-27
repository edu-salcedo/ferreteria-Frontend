import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import SearchBar from "../../components/iu/SearchBar";
import CategoryDropdown from "../../components/iu/CategoryDropdown";
import ProductCard from "../../components/iu/ProductCard";
import Pagination from "../../components/iu/Pagination";
import AddToCartModal from "../../components/modal/AddToCartModal";
import { useCart } from "../../context/CartContext";

const Products = () => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const pageSize = 12;

    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    /* 🔹 1. DERIVAR ESTADO DESDE LA URL */
    const params = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    );

    const searchTerm = params.get("search") || "";
    const categoryId = params.get("category") || "";
    const currentPage = Number(params.get("page")) || 1;
    const selectedCategory = categoryId ? { id: Number(categoryId) } : null;

    /* 🚀 2. CONSULTA DINÁMICA AL BACKEND (PAGINADA Y FILTRADA) */
    // Le restamos 1 a currentPage porque Spring Boot procesa páginas desde el índice 0
    const { data: pageData, loading, error } = useApi(
        `products?search=${encodeURIComponent(searchTerm)}&categoryId=${categoryId}&page=${currentPage - 1}&size=${pageSize}`
    );

    if (error) {
        console.error("❌ Error detectado en la petición API:", error);
    }
    console.log("📦 Estado actual de pageData:", pageData);
    // Desestructuramos la respuesta del objeto Page de Spring Boot
    const paginatedProducts = pageData?.content || [];
    const totalPages = pageData?.totalPages || 1;

    /* 🔹 3. HELPERS PARA ACTUALIZAR URL */
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

    const handleAddToCart = (variant, quantity, product) => {
        addToCart(variant, quantity, product);
    };

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-4 mt-2">
                {/* Sidebar */}
                <div className="col-span-2 p-2 min-h-screen">
                    <CategoryDropdown
                        mode="list"
                        selected={selectedCategory}
                        onSelect={(cat) =>
                            updateParams({ category: cat?.id ?? null, page: 1 })
                        }
                    />
                </div>

                {/* Productos */}
                <div className="col-span-10 bg-gray-100">
                    <div className="flex mt-5 mb-6 px-4">
                        <SearchBar
                            value={searchTerm}
                            onInputChange={(value) =>
                                updateParams({ search: value, page: 1 })
                            }
                        />
                    </div>

                    <div className="mb-6 px-4">
                        {loading && <p>Cargando productos...</p>}

                        {!loading && paginatedProducts.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {paginatedProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        showModal={() => handleOpenModal(product)}
                                    />
                                ))}
                            </div>
                        )}

                        {!loading && paginatedProducts.length === 0 && (
                            <p className="text-center text-gray-500">
                                No se encontraron productos.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <AddToCartModal
                product={selectedProduct}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onAddToCart={handleAddToCart}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateParams({ page })}
            />
        </>
    );
};

export default Products;
