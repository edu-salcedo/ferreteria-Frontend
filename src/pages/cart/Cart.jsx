import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useCart();

    const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    if (cart.length === 0) {
        return (
            <div className="text-center mt-16">
                <h2 className="text-2xl font-semibold mb-4">
                    Tu carrito está vacío
                </h2>
                <Link to="/" className="text-orange-500 hover:underline">
                    Volver a productos
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4">
            <h1 className="text-3xl font-semibold mb-6">
                Carrito de compras
            </h1>

            <div className="space-y-4">
                {cart.map(item => (
                    <div key={item.id}
                        className="flex items-center gap-4 border rounded-lg p-4"
                    >
                        <img
                            src={`http://localhost:8080${item.img}`}
                            alt={item.name}
                            className="w-20 h-20 object-contain"
                        />

                        <div className="flex-1">
                            <h3 className="font-semibold">
                                {item.name}
                            </h3>
                        </div>
                        <div>
                            <p className="text-gray-500">
                                ${Math.round(item.price)} x {item.quantity}
                            </p>

                        </div>

                        <p className="font-semibold">
                            ${Math.round(item.price * item.quantity)}
                        </p>

                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:underline"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 mt-8 items-center justify-around">
                <button
                    onClick={clearCart}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                >
                    Vaciar carrito
                </button>

                <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
                    Finalizar compra
                </button>
                <p className="text-xl font-semibold">
                    Total: ${Math.round(total)}
                </p>
            </div>
        </div>

    );
};

export default Cart;
