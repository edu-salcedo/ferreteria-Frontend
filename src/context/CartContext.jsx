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

    const addToCart = (variant, quantity, product) => {

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
                    productId: product.id,
                    productName: product.name,
                    measure: variant.measure,
                    salePrice: variant.salePrice,
                    purchasePrice: variant.purchasePrice,
                    quantity,
                    img: product.img,
                    stock: variant.stock
                }
            ];
        });
    };

    const removeFromCart = (variantId) => {
        const item = cart.find(p => p.variantId === variantId);
        setCart(prev => prev.filter(p => p.variantId !== variantId));
        if (item) toast.success(`${item.productName} eliminado del carrito`);
    };

    const increaseQuantity = (variantId) => {
        setCart(cart =>
            cart.map(item =>
                item.variantId === variantId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (variantId) => {
        setCart(cart =>
            cart
                .map(item =>
                    item.variantId === variantId
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
