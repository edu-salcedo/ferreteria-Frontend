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

    const addToCart = (variant, quantity) => {

        setCart(prev => {

            const exists = prev.find(i => i.variantId === variant.id);

            if (exists) {
                return prev.map(i =>
                    i.variantId === variant.id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }

            return [
                ...prev,
                {
                    variantId: variant.id,
                    productName: variant.product.name,
                    measure: variant.measure,
                    salePrice: variant.salePrice,
                    quantity,
                    img: variant.product.img
                }
            ];
        });
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
