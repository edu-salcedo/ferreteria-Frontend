const ExcelUploaderModal = ({ show, onHide, onImported }) => {
    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${show ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Importar Excel</h2>
                <p className="mb-4">Seleccione un archivo Excel para importar:</p>
                <input type="file" accept=".xlsx,.xls" />
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onHide}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onImported}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Importar
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ExcelUploaderModal;