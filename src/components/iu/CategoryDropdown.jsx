import { useState, useEffect, useRef } from "react";
import { useApi } from "../../hooks/useApi";

const CategoryDropdown = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: categories = [], loading, error, refetch } =
    useApi("category", {}, false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelect = (category) => {
    onSelect(category); // objeto o null
    setOpen(false);
  };

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
        {selected?.name || "Todas las categorías"}
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
              {/* TODAS */}
              <li
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(null);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${!selected ? "bg-blue-100 font-semibold" : ""
                  }`}
              >
                Todas las categorías
              </li>

              {categories.map((cat) => (
                <li
                  key={cat.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(cat);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selected?.id === cat.id ? "bg-blue-100 font-semibold" : ""
                    }`}
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
