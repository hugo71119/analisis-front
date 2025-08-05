import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function RealizarReservacion() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const API = import.meta.env.VITE_API_URL;

    const handleReservar = async (cuartoId) => {
        try {
            const res = await axios.post(
                `${API}/reservaciones`,
                {
                    cuartoId,
                    fechaInicio: state.fechaInicio,
                    fechaFin: state.fechaFin,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Reservación completada",
                text: "✅ Tu reservación se realizó con éxito.",
                confirmButtonText: "Ver mis reservaciones",
            });

            navigate("/reservaciones");
        } catch (error) {
            console.error("Error al reservar:", error);
            Swal.fire({
                icon: "error",
                title: "Error al reservar",
                text: "❌ No se pudo completar la reservación.",
            });
        }
    };

    const handlePagar = async (cuarto) => {
        const fechaInicio = new Date(state.fechaInicio);
        const fechaFin = new Date(state.fechaFin);

        const diferenciaMs = fechaFin - fechaInicio;
        const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

        if (dias <= 0) {
            alert("❌ La fecha de fin debe ser posterior a la de inicio.");
            return;
        }

        try {
            const res = await axios.post(`${API}/pagos/crear-preferencia`, {
                titulo: `Cuarto ${cuarto.tipo} con ${dias} días de estancia`,
                cantidad: dias,
                precio: cuarto.precio
            });
            const url = res.data;

            // Redirigir al checkout de Mercado Pago
            window.location.href = url;
        } catch (error) {
            console.error("Error al redirigir a Mercado Pago:", error);
            alert("❌ No se pudo redirigir al pago.");
        }
    };


    return (
        <div className="mt-32 min-h-screen text-white p-6">
            <h1 className="text-3xl font-semibold text-center mb-8">
                Habitaciones disponibles del {state.fechaInicio} al {state.fechaFin}
            </h1>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse bg-[#1e1e1e] rounded-lg shadow-md">
                    <thead className="bg-[#2a2a2a]">
                        <tr>
                            <th className="py-3 px-4 text-left">Número</th>
                            <th className="py-3 px-4 text-left">Tipo</th>
                            <th className="py-3 px-4 text-left">Capacidad</th>
                            <th className="py-3 px-4 text-left">Precio</th>
                            <th className="py-3 px-4 text-left">Fecha inicio</th>
                            <th className="py-3 px-4 text-left">Fecha fin</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.cuartos.map((cuarto) => (
                            <tr key={cuarto.id} className="border-t border-[#333] hover:bg-[#2c2c2c]">
                                <td className="py-3 px-4">{cuarto.numero}</td>
                                <td className="py-3 px-4 capitalize">{cuarto.tipo}</td>
                                <td className="py-3 px-4">{cuarto.capacidad}</td>
                                <td className="py-3 px-4">${cuarto.precio}</td>
                                <td className="py-3 px-4">{state.fechaInicio}</td>
                                <td className="py-3 px-4">{state.fechaFin}</td>
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => handleReservar(cuarto.id)}
                                        className="bg-[#c20064] hover:bg-[#a80056] text-white px-4 py-2 rounded-lg transition-colors hover:cursor-pointer"
                                    >
                                        Reservar
                                    </button>

                                    <button onClick={() => {
                                        navigate(`/detalle-cuarto/${cuarto.id}`);
                                    }} className="bg-[#c20064] hover:bg-[#a80056] text-white px-4 py-2 rounded-lg transition-colors hover:cursor-pointer">
                                        Ver Cuarto
                                    </button>

                                    <button onClick={() => {
                                        sessionStorage.setItem("checkoutData", JSON.stringify({
                                            cuarto,
                                            fechaInicio: state.fechaInicio,
                                            fechaFin: state.fechaFin
                                        }));
                                        navigate("/checkout");

                                    }} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors hover:cursor-pointer ml-2">
                                        Checkout
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-5">
                {state.cuartos.map((cuarto) => (
                    <div key={cuarto.id} className="bg-[#1f1f1f] rounded-xl p-4 shadow-md">
                        <p><span className="font-semibold text-pink-400">Número:</span> {cuarto.numero}</p>
                        <p><span className="font-semibold text-pink-400">Tipo:</span> {cuarto.tipo}</p>
                        <p><span className="font-semibold text-pink-400">Capacidad:</span> {cuarto.capacidad}</p>
                        <p><span className="font-semibold text-pink-400">Precio:</span> ${cuarto.precio}</p>
                        <p><span className="font-semibold text-pink-400">Inicio:</span> {state.fechaInicio}</p>
                        <p><span className="font-semibold text-pink-400">Fin:</span> {state.fechaFin}</p>
                        <button
                            onClick={() => handleReservar(cuarto.id)}
                            className="mt-4 w-full bg-[#c20064] hover:bg-[#a80056] text-white py-2 rounded-lg transition-colors"
                        >
                            Reservar
                        </button>
                        <button onClick={() => {
                            navigate(`/detalle-cuarto/${cuarto.id}`);
                        }} className="mt-4 w-full bg-[#c20064] hover:bg-[#a80056] text-white py-2 rounded-lg transition-colors">
                            Ver Cuarto
                        </button>
                        <button onClick={() => {
                            navigate(`/checkout`, { state: { cuarto, fechaInicio: state.fechaInicio, fechaFin: state.fechaFin } }
                            );
                        }} className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                            Checkout
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
