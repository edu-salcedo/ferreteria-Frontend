import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "../../components/iu/SearchBar";
import CategoryDropdown from "../../components/iu/CategoryDropdown";
import ProductList from "./ProductList";
import ProductModalForm from "../../components/modal/ProductModalForm";
import Pagination from "../../components/iu/Pagination";
import { useApi } from "../../hooks/useApi";

const Products = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updateProduct, setUpdateProduct] = useState(null);
    const [showModalForm, setShowModalForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
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
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };


    // Filtrar productos según búsqueda y categoría seleccionada
    const filteredProducts = (productList ?? []).filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.categoryName === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    // --- Calcular paginación ---
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);


    return (
        <>
            <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded mt-6 ml-6">
                Agregar Producto
            </button>

            <ProductModalForm show={showModalForm} onHide={() => setShowModalForm(false)} product={updateProduct} onSave={handleSave} />

            <div className="flex flex-col md:flex-row items-center mt-10 mb-6 px-4">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <SearchBar onInputChange={handleInputChange} />
                </div>
                <div className="w-full flex md:w-1/2 mx-4">
                    <CategoryDropdown
                        onSelect={handleCategorySelect}
                    />
                </div>
            </div>

            <ProductList key={productList ? productList.length + searchTerm + selectedCategory : 0} products={paginatedProducts} handleUpdate={handleUpdate} />

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
    );
};

export default Products;
