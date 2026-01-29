import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';


export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { cart } = useCart();
    // const totalQuantity = cart.reduce((acu, product) => acu + product.quantity, 0)
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-orange-600">
                            Ferreteria
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link to="/" className="text-gray-700 hover:text-orange-600">Inicio</Link>
                        <Link to="/productosAdmin" className="text-gray-700 hover:text-orange-600">ProductosAdmin</Link>
                        <Link to="/productos" className="text-gray-700 hover:text-orange-600">Productos</Link>
                        <Link to="/upload" className="text-gray-700 hover:text-orange-600">Subir archivo</Link>
                        <Link to="/checkout" className="text-gray-700 hover:text-orange-600">checkout</Link>

                    </div>

                    {/* Mobile menu button */}
                    <div className=" flex items-center">
                        <button className="mr-4 text-white bg-orange-500 p-1 rounded">
                            <Link to="/carrito" className="relative">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cart.length > 0 && (
                                    <span className="absolute -top-4 -right-2 bg-gray-500 text-white text-xs px-2 rounded-full">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none transition-transform duration-200">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`fixed inset-0 bg-white text-gray-700 z-40 flex flex-col items-center justify-center 
        space-y-8 text-2xl font-medium transform transition-all duration-300 
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
            >
                {/* Botón de cerrar */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-700 hover:text-orange-600"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Enlaces */}
                <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-orange-600 transition">Inicio</Link>
                <Link to="/productos" onClick={() => setIsOpen(false)} className="hover:text-orange-600 transition">Productos</Link>
                <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-orange-600 transition">Contacto</Link>
            </div>
        </nav>
    );
}
