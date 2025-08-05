import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function CuartosDestacados() {
    const [cuartos, setCuartos] = useState([]);
    const { nombresHabitaciones } = useAuth();
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCuartos = async () => {
            try {
                const res = await axios.get(`${API}/cuartos/listar`);
                setCuartos(res.data);
            } catch (error) {
                console.error("Error al obtener cuartos:", error);
            }
        };

        fetchCuartos();
    }, []);

    return (
        <div className="px-6 md:px-12 mt-16 text-white">
            <h2 className="text-3xl font-semibold mb-8 text-center">Habitaciones disponibles</h2>

            <div className="bg-gradient-to-r from-[#220047] to-[#39095c] text-white rounded-xl p-6 md:p-10 mb-12 shadow-lg text-center">
                <h3 className="text-2xl font-bold mb-3">🔥 Promociones especiales</h3>
                <p className="text-white/90 mb-1">
                    10% de descuento en estancias de más de 3 noches.
                </p>
                <p className="text-white/80 mb-2">
                    Hasta 6 meses sin intereses con tarjetas participantes.
                </p>
                <p className="text-sm text-white/60">
                    *Aplican términos y condiciones. Promociones válidas por tiempo limitado.
                </p>
            </div>


            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {cuartos.map((cuarto) => (
                    <div
                        key={cuarto.id}
                        className="bg-[#1f1f1f] rounded-2xl shadow-md border border-[#333] overflow-hidden flex flex-col"
                    >
                        <img
                            src={cuarto.imagenUrl}
                            alt={`Habitación ${cuarto.numero}`}
                            className="h-48 w-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />

                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-xl font-semibold mb-1">
                                {nombresHabitaciones[cuarto.tipo] || cuarto.tipo}
                            </h3>
                            <p className="text-sm text-white/70 mb-2">Cuarto #{cuarto.numero}</p>
                            <p className="text-sm text-white/70 mb-1">Capacidad: {cuarto.capacidad} huésped{cuarto.capacidad > 1 ? "es" : ""}</p>
                            <p className="text-sm text-white/70 mb-3">Precio: ${cuarto.precio} por noche</p>
                            <p className="text-sm text-white/60 mb-4 line-clamp-3">{cuarto.descripcion}</p>

                            <Link
                                to={`/detalle-cuarto/${cuarto.id}`}
                                className="mt-auto inline-block bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-md transition"
                            >
                                Ver detalles
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
