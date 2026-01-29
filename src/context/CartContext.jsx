import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

const CartProvider = ({ children }) => {
    // Cargar carrito desde localStorage al iniciar
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Guardar carrito en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity) => {
        const existing = cart.find(p => p.id === product.id);

        if (existing) {
            setCart(prev =>
                prev.map(p =>
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + quantity }
                        : p
                )
            );
            toast.info(`Se actualizó la cantidad de ${product.name} en el carrito`);
        } else {
            setCart(prev => [...prev, { ...product, quantity }]);
            toast.success(`${product.name} agregado al carrito`);
        }
    };

    const removeFromCart = (id) => {
        const item = cart.find(p => p.id === id);
        setCart(prev => prev.filter(p => p.id !== id));
        if (item) toast.success(`${item.name} eliminado del carrito`);
    };

    const increaseQuantity = (id) => {
        setCart(cart =>
            cart.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCart(cart =>
            cart
                .map(item =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
        toast.info("Carrito vaciado");
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

const useCart = () => useContext(CartContext);

export { CartProvider, useCart };
