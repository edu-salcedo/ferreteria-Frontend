import { useState, useEffect, useRef } from "react";
import { useApi } from "../../hooks/useApi";

export default function SearchBar({ onInputChange }) {
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const containerRef = useRef(null);

    const itemRefs = useRef({});  // 👈 refs por ID, no por índice

    const { data: products = [], loading, error } = useApi("/products", {}, true);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const suggestions = (products || []).filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    // para que el elemento resaltado esté siempre visible
    useEffect(() => {
        if (highlightIndex >= 0 && suggestions[highlightIndex]) {
            const id = suggestions[highlightIndex].id;
            const el = itemRefs.current[id];
            if (el) {
                el.scrollIntoView({
                    block: "nearest",
                });
            }
        }
    }, [highlightIndex, suggestions]);

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setShowSuggestions(true);
            setHighlightIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : 0
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setShowSuggestions(true);
            setHighlightIndex((prev) =>
                prev > 0 ? prev - 1 : suggestions.length - 1
            );
        }

        if (e.key === "Enter") {
            e.preventDefault();

            if (highlightIndex >= 0 && suggestions[highlightIndex]) {
                const selected = suggestions[highlightIndex].name;
                setQuery(selected);
                onInputChange(selected);
            } else {
                onInputChange(query);
            }

            setShowSuggestions(false);
            setHighlightIndex(-1);
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center w-full max-w-md relative bg-white"
        >
            <input
                type="text"
                placeholder="Buscar..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                    setHighlightIndex(-1);
                    onInputChange(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => query && setShowSuggestions(true)}
                className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            />

            {showSuggestions && query && suggestions.length > 0 && (
                <ul className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md z-10 max-h-60 overflow-y-auto">
                    {suggestions.map((item, index) => (
                        <li
                            key={item.id}
                            ref={(el) => (itemRefs.current[item.id] = el)} // 👈 ref estable por ID
                            className={`px-4 py-2 cursor-pointer 
                                ${index === highlightIndex ? "bg-blue-100" : "hover:bg-blue-50"} 
                                text-gray-700`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                setQuery(item.name);
                                setShowSuggestions(false);
                                onInputChange(item.name);
                                setHighlightIndex(-1);
                            }}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
