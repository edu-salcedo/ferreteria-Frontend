


const Pagination = ({ currentPage, totalPages, onPageChange }) => {

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="flex justify-center mt-6 gap-4">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
                Anterior
            </button>

            <span className="px-4 py-2 bg-blue-500 text-white rounded">
                {currentPage} / {totalPages}
            </span>

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
