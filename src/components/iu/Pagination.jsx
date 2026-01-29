const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const maxVisible = 11; // 5 atrás + 1 actual + 5 adelante
    const half = Math.floor(maxVisible / 2);

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const handlePageClick = (page) => {
        if (page !== currentPage) onPageChange(page);
    };

    // Calcular rango de páginas a mostrar
    let startPage = Math.max(currentPage - half, 1);
    let endPage = Math.min(startPage + maxVisible - 1, totalPages);

    // Ajuste si estamos al final
    startPage = Math.max(endPage - maxVisible + 1, 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center mt-6 gap-4 items-center">
            {/* Botón Anterior */}
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
                Anterior
            </button>

            {/* Botones de páginas */}
            <div className="flex gap-2">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`px-4 py-2 rounded ${page === currentPage
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Botón Siguiente */}
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
                Siguiente
            </button>
        </div>
    );
};

export default Pagination;
