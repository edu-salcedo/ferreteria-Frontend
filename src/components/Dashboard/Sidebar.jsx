import { Link } from "react-router-dom";

const Sidebar = () => {

    return (

        <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">

            <div className="sticky top-4">
                <h2 className="text-2xl font-bold mb-10">
                    Ferretería Admin
                </h2>

                <div className="space-y-3 flex flex-col">

                    <Link to="/dashboard" className="text-white hover:text-orange-600">Dashboard</Link>
                    <Link to="/productosAdmin" className="text-white hover:text-orange-600">Productos</Link>
                    <Link to="/ventas" className="text-white hover:text-orange-600"> Ventas</Link>
                </div>
            </div>
        </aside>

    );

}

export default Sidebar