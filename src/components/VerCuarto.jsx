import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function VerCuarto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, nombresHabitaciones } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  const [cuarto, setCuarto] = useState(null);

  useEffect(() => {
    const fetchCuarto = async () => {
      try {
        const res = await axios.get(`${API}/cuartos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCuarto(res.data);
      } catch (error) {
        console.error("Error al obtener el cuarto:", error);
        Swal.fire("Error", "No se pudo cargar el cuarto", "error");
        navigate("/admin/cuartos");
      }
    };

    fetchCuarto();
  }, [id]);

  if (!cuarto) return <p className="text-white text-center mt-28">Cargando cuarto...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-28 px-6 text-white">
      <div className="bg-[#2a2d36] rounded-2xl shadow-lg p-6 md:p-10 border border-[#3d3f4c]">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Detalles del Cuarto
        </h2>

        <div className="mb-6">
          <img
            src={cuarto.imagenUrl}
            alt="Imagen del cuarto"
            className="w-full h-64 object-cover rounded-lg shadow border border-[#3d3f4c]"
          />
        </div>

        <div className="space-y-4 text-sm md:text-base">
          <p>
            <span className="font-semibold text-purple-400">Número:</span> {cuarto.numero}
          </p>
          <p>
            <span className="font-semibold text-purple-400">Tipo:</span> {nombresHabitaciones[cuarto.tipo]}
          </p>
          <p>
            <span className="font-semibold text-purple-400">Capacidad:</span> {cuarto.capacidad} huésped{cuarto.capacidad > 1 ? "es" : ""}
          </p>
          <p>
            <span className="font-semibold text-purple-400">Precio por noche:</span> ${cuarto.precio}
          </p>
          <p>
            <span className="font-semibold text-purple-400">Descripción:</span> {cuarto.descripcion}
          </p>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/admin/cuartos")}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded shadow-md transition hover:cursor-pointer"
          >
            Regresar al listado
          </button>
        </div>
      </div>
    </div>
  );
}
