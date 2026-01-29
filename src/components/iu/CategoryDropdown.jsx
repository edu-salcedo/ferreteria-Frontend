import { useState, useEffect, useRef } from "react";
import { useApi } from "../../hooks/useApi";

const CategoryDropdown = ({ selected, onSelect, mode = "dropdown" }) => {
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState(selected); // objeto completo
  const dropdownRef = useRef(null);

  const { data: categories = [], loading, error, refetch } = useApi("category", {}, false);
  const safeCategories = Array.isArray(categories) ? categories : [];

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Si cambió el selected desde el componente padre, actualiza el estado interno
  useEffect(() => {
    if (Array.isArray(categories) && categories.length > 0 && selected?.id) {
      const fullCategory = categories.find(c => c.id === selected.id);
      setInternalSelected(fullCategory || null);
    }
  }, [selected, categories]);

  useEffect(() => {
    if (mode === "dropdown") {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setOpen(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [mode]);

  const handleSelect = (category) => {
    setInternalSelected(category);
    onSelect(category); // pasa el objeto completo al padre
    if (mode === "dropdown") setOpen(false);
  };

  // 🔹 MODO LISTA
  if (mode === "list") {
    if (loading) return <p>Cargando categorías...</p>;
    if (error) return <p className="text-red-500">Error al cargar categorías</p>;

    return (
      <ul className="space-y-2">
        <li
          onClick={() => handleSelect(null)}
          className={`cursor-pointer px-3 py-2 rounded hover:bg-gray-200 ${!internalSelected ? "bg-blue-500 text-white font-semibold" : ""
            }`}
        >
          Todas las categorías
        </li>
        {safeCategories.map(cat => (
          <li
            key={cat.id}
            onClick={() => handleSelect(cat)}
            className={`cursor-pointer rounded hover:bg-gray-200 ${internalSelected?.id === cat.id ? "bg-blue-500 text-white font-semibold" : ""
              }`}
          >
            {cat.name}
          </li>
        ))}
      </ul>
    );
  }

  // 🔹 MODO DROPDOWN (tu dropdown original)
  return (
    <div ref={dropdownRef} className="relative w-full max-w-xs">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(prev => !prev);
        }}
        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 flex justify-between items-center shadow-sm"
      >
        {internalSelected?.name || "Todas las categorías"}
        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {loading && <p className="p-4 text-gray-500">Cargando...</p>}
          {error && <p className="p-4 text-red-500">Error</p>}
          {!loading && !error && (
            <ul>
              <li
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(null);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${!internalSelected ? "bg-blue-100 font-semibold" : ""}`}
              >
                Todas las categorías
              </li>

              {safeCategories.map((cat) => (
                <li
                  key={cat.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(cat);
                  }}
                  className={`cursor-pointer hover:bg-blue-50 ${internalSelected?.id === cat.id ? "bg-blue-100 font-semibold" : ""}`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
