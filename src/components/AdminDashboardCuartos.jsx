import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminDashboardCuartos() {
    const [cuartos, setCuartos] = useState([]);
    const [ocupados, setOcupados] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCuartos = async () => {
            try {
                const res = await axios.get(`${API}/cuartos/admin/todos`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCuartos(res.data);
            } catch (err) {
                console.error("Error al obtener cuartos:", err);
            }
        };

        fetchCuartos();
    }, []);

    useEffect(() => {
        const fetchEstados = async () => {
            const hoy = new Date().toISOString().split("T")[0];
            const nuevosEstados = {};

            for (let cuarto of cuartos) {
                try {
                    const res = await axios.get(`${API}/cuartos/admin/ocupado`, {
                        params: { cuartoId: cuarto.id, fecha: hoy },
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    nuevosEstados[cuarto.id] = res.data ? "Ocupado" : "Disponible";
                } catch (err) {
                    console.error("Error consultando estado del cuarto:", err);
                    nuevosEstados[cuarto.id] = "Error";
                }
            }

            setOcupados(nuevosEstados);
        };

        if (cuartos.length > 0) {
            fetchEstados();
        }
    }, [cuartos]);

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará el cuarto permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e02424", // rojo
            cancelButtonColor: "#6b7280",   // gris
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`${API}/cuartos/admin/eliminar/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCuartos(prev => prev.filter(c => c.id !== id));

            Swal.fire({
                icon: "success",
                title: "¡Cuarto eliminado!",
                text: "El cuarto ha sido eliminado correctamente.",
                confirmButtonColor: "#7b4fff",
            });

        } catch (err) {
            console.error("Error al eliminar:", err);
            Swal.fire({
                icon: "error",
                title: "Error al eliminar",
                text: "No se pudo eliminar el cuarto. Intenta nuevamente.",
                confirmButtonColor: "#7b4fff",
            });
        }
    };


    return (
        <div className="mt-32 px-4 text-white min-h-screen">
            <h1 className="text-3xl font-semibold mb-6 text-center">Gestión de Cuartos</h1>

            {/* Tabla para desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full table-auto bg-[#1f1f1f] rounded-lg shadow-lg">
                    <thead className="bg-[#2a2a2a] text-left">
                        <tr>
                            <th className="px-4 py-3">Número</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Capacidad</th>
                            <th className="px-4 py-3">Precio</th>
                            <th className="px-4 py-3">Acciones</th>
                            <th className="px-4 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuartos.map((cuarto) => (
                            <tr key={cuarto.id} className="border-t border-[#333] hover:bg-[#2c2c2c]">
                                <td className="px-4 py-3">{cuarto.numero}</td>
                                <td className="px-4 py-3 capitalize">{cuarto.tipo}</td>
                                <td className="px-4 py-3">{cuarto.capacidad}</td>
                                <td className="px-4 py-3">${cuarto.precio}</td>
                                <td className={`px-4 py-3 ${ocupados[cuarto.id] === 'Ocupado' ? 'text-red-500 font-semibold' : 'text-green-500 font-semibold'}`}>
                                    {ocupados[cuarto.id] || "Cargando..."}
                                </td>

                                <td className="px-4 py-3 space-x-2">
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded hover:cursor-pointer"
                                        onClick={() => navigate(`/cuartos/${cuarto.id}`)}
                                    >
                                        Ver
                                    </button>
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded hover:cursor-pointer"
                                        onClick={() => navigate(`/cuartos/editar/${cuarto.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded hover:cursor-pointer"
                                        onClick={() => handleEliminar(cuarto.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cards para mobile */}
            <div className="md:hidden flex flex-col gap-5">
                {cuartos.map((cuarto) => (
                    <div key={cuarto.id} className="bg-[#2a2c35] rounded-lg p-4 shadow-lg">
                        <p><span className="text-pink-500 font-semibold">Número:</span> {cuarto.numero}</p>
                        <p><span className="text-pink-500 font-semibold">Tipo:</span> {cuarto.tipo}</p>
                        <p><span className="text-pink-500 font-semibold">Capacidad:</span> {cuarto.capacidad}</p>
                        <p><span className="text-pink-500 font-semibold">Precio:</span> ${cuarto.precio}</p>
                        <p className={`text-${ocupados[cuarto.id] === 'Ocupado' ? 'red' : 'green'}-500 font-semibold`}>
                            <span className="text-pink-500 font-semibold">Estado:</span> {ocupados[cuarto.id] || "Cargando..."}
                        </p>
                        <div className="mt-4 flex flex-col gap-2">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                                onClick={() => navigate(`/cuartos/${cuarto.id}`)}
                            >
                                Ver
                            </button>
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                                onClick={() => navigate(`/cuartos/editar/${cuarto.id}`)}
                            >
                                Editar
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                                onClick={() => handleEliminar(cuarto.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center">
                <Link to="/crear-cuartos-admin" className="my-10 inline-block bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded">
                    Crear Nuevo Cuarto
                </Link>
            </div>
        </div>
    );
}
