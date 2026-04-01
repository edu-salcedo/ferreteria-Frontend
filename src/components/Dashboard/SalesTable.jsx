import { formatDate } from "../../utils/date.js";

const SalesTable = ({ orders, onRowClick }) => {

    return (

        <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-xl font-semibold mb-4">
                Ventas recientes
            </h2>

            <table className="w-full text-left">

                <thead className="border-b text-gray-600">

                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Items</th>
                    </tr>

                </thead>

                <tbody>

                    {orders?.map(order => (

                        <tr key={order.id}
                            className="border-b hover:bg-gray-50"
                            onClick={() => onRowClick(order)}
                        >

                            <td className="py-3">#{order.id}</td>

                            <td>{order.createdAt ? formatDate(order.createdAt) : "-"}</td>

                            <td className="font-semibold">${order.totalAmount || 0} </td>

                            <td>{order.items?.length || 0}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}
export default SalesTable;