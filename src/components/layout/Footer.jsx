
export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* Logo o Nombre */}
                    <div>
                        <h2 className="text-xl font-bold">Ferretero</h2>
                        <p className="text-sm text-gray-400 mt-2">
                            Herramientas y materiales de construcción.
                        </p>
                    </div>

                    {/* Horarios */}
                    <div>
                        <h3 className="text-lg font-semibold">Horarios</h3>
                        <ul className="text-sm text-gray-300 mt-2 space-y-1">
                            <li>Lunes a Viernes: 12:00 - 23:00</li>
                            <li>Sábados y Domingos: 13:00 - 00:00</li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="text-lg font-semibold">Contacto</h3>
                        <ul className="text-sm text-gray-300 mt-2 space-y-1">
                            <li>📞 (123) 456-7890</li>
                            <li>📍 Calle Sabores 123, Ciudad</li>
                            <li>✉️ contacto@restodelicioso.com</li>
                        </ul>
                    </div>
                </div>

                <hr className="my-6 border-gray-700" />

                <p className="text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} ferreteria raedu. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    )
}
