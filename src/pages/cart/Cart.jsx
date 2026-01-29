import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
    const [discount, setDiscount] = useState(0);
    const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();

    // 2. Calculamos el total aplicando el 40% a cada item
    const total = cart.reduce(
        (acc, item) => acc + item.finalPrice * item.quantity,
        0
    );

    const totalWithDiscount = total - (total * discount) / 100;

    if (cart.length === 0) {
        return (
            <div className="text-center mt-16">
                <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
                <Link to="/" className="text-orange-500 hover:underline">Volver a productos</Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4">
            <h1 className="text-3xl font-semibold mb-6">Carrito de compras</h1>

            <div className="space-y-4">
                {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4">
                        <img
                            src={`http://localhost:8080${item.img}`}
                            alt={item.name}
                            className="w-20 h-20 object-contain"
                        />

                        <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            {/* Mostramos el precio unitario con el 40% ya sumado */}
                            <p className="text-sm text-gray-400">
                                Costo base: ${Math.round(item.price)}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <button onClick={() => decreaseQuantity(item.id)} className="border px-2 rounded">-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => increaseQuantity(item.id)} className="border px-2 rounded">+</button>
                            </div>
                        </div>

                        {/* Subtotal del item con ganancia */}
                        <p className="font-semibold w-24 text-right">
                            ${Math.round(item.finalPrice * item.quantity)}
                        </p>

                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:underline ml-4"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 mt-8 items-center justify-around border-t pt-6">
                <button onClick={clearCart} className="border border-gray-300 px-4 py-2 rounded-lg">
                    Vaciar carrito
                </button>

                <div className="flex items-center gap-2">
                    <p>Descuento</p>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="border rounded px-2 w-20"
                    />
                    <span>%</span>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-500">Subtotal con ganancia: ${Math.round(total)}</p>
                    <p className="text-2xl font-bold text-orange-600">
                        Total Final: ${Math.round(totalWithDiscount)}
                    </p>
                </div>

                <Link to="/checkout" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
                    Comprar
                </Link>
            </div>
        </div>
    );
};

export default Cart;