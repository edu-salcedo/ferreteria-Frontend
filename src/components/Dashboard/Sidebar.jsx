const Sidebar = () => {

    return (

        <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">

            <h2 className="text-2xl font-bold mb-10">
                Ferretería Admin
            </h2>

            <nav className="space-y-3">

                <a
                    href="/sales"
                    className="block px-3 py-2 rounded hover:bg-gray-700"
                >
                    Dashboard
                </a>

                <a
                    href="/orders"
                    className="block px-3 py-2 rounded hover:bg-gray-700"
                >
                    Ventas
                </a>

                <a
                    href="/products"
                    className="block px-3 py-2 rounded hover:bg-gray-700"
                >
                    Productos
                </a>

            </nav>

        </aside>

    );

}

export default Sidebar