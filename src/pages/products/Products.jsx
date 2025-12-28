import { useEffect, useState } from "react";
import SearchBar from "../../components/iu/SearchBar";
import CategoryDropdown from "../../components/iu/CategoryDropdown";
import ProductCard from "../../components/iu/ProductCard";
import Pagination from "../../components/iu/Pagination";
import { useApi } from "../../hooks/useApi";

const Products = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    const { data: productList, loading, error, refetch } = useApi('products');

    const handleInputChange = (e) => {
        setSearchTerm(e);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    // Filtrar productos según búsqueda y categoría seleccionada
    const filteredProducts = (productList ?? []).filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.categoryId === selectedCategory.id : true;
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
            <div className="flex flex-col md:flex-row items-center mt-10 mb-6 px-4">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <SearchBar onInputChange={handleInputChange} />
                </div>
                <div className="w-full flex md:w-1/2 mx-4">
                    <CategoryDropdown
                        selected={selectedCategory}
                        onSelect={handleCategorySelect}
                    />
                </div>
            </div>

            <div className="mb-6 px-4">
                {paginatedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                img={product.img}
                                name={product.name}
                                price={product.price}
                                description={product.description}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No se encontraron productos.
                    </p>
                )}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
    );
};

export default Products;
