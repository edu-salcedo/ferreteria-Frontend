import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

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

    const clearCart = () => {
        setCart([]);
        toast.info("Carrito vaciado");
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

const useCart = () => useContext(CartContext);

export { CartProvider, useCart };
