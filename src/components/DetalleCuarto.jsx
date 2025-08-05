// src/pages/DetalleCuarto.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DetalleCuarto() {
  const { id } = useParams();
  const [cuarto, setCuarto] = useState(null);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const obtenerCuarto = async () => {
      try {
        const res = await axios.get(`${API}/cuartos/get/${id}`);
        setCuarto(res.data);
      } catch (error) {
        console.error("Error al obtener cuarto:", error);
      }
    };

    obtenerCuarto();
  }, [id]);

  if (!cuarto) {
    return <p className="text-white text-center mt-10">Cargando detalles del cuarto...</p>;
  }

  return (
    <div className="min-h-screen text-white px-4 py-12 max-w-4xl mx-auto mt-10">
      <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-lg">
        <img
          src={cuarto.imagenUrl}
          alt={cuarto.tipo}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
        <h2 className="text-3xl font-bold mb-2 capitalize">{cuarto.tipo}</h2>
        <p className="text-sm text-gray-400 mb-2">Número de cuarto: <span className="font-semibold text-white">{cuarto.numero}</span></p>
        <p className="text-sm text-gray-400 mb-2">Capacidad: <span className="font-semibold text-white">{cuarto.capacidad} personas</span></p>
        <p className="text-sm text-gray-400 mb-2">Precio por noche: <span className="font-semibold text-green-400">${cuarto.precio}</span></p>
        <p className="mt-4 text-gray-300">{cuarto.descripcion}</p>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition"
        >
          ← Regresar al listado
        </button>
      </div>
    </div>
  );
}
