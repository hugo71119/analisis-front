import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function EditarReservacion() {
  const { reservaActual } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!reservaActual) {
      Swal.fire("Error", "No hay reservación seleccionada para editar.", "error");
      navigate("/reservaciones");
      return;
    }

    // Prellenar campos con datos actuales
    reset({
      fechaInicio: reservaActual.fechaInicio,
      fechaFin: reservaActual.fechaFin,
    });
  }, [reservaActual, reset, navigate]);

  const API = import.meta.env.VITE_API_URL;

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`${API}/reservaciones/editar/${reservaActual.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: "success",
        title: "Reservación actualizada",
        text: res.data || "Se guardaron los cambios correctamente.",
        confirmButtonColor: "#7b4fff",
      }).then(() => {
        navigate("/reservaciones");
      });
    } catch (error) {
      console.error("Error al actualizar:", error);

      const msg = error.response?.data || "Ocurrió un error al actualizar.";
      Swal.fire("Error", msg, "error");
    }
  };

  if (!reservaActual) return null;

  return (
    <div className="max-w-xl mx-auto mt-24 px-6">
      <div className="bg-[#2a2d36] text-white p-8 rounded-2xl shadow-lg border border-[#3d3f4c]">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Editar Reservación</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Fecha de inicio */}
          <div>
            <label className="block text-sm mb-1">Fecha de inicio</label>
            <input
              type="date"
              {...register("fechaInicio", { required: "Este campo es obligatorio" })}
              className="w-full bg-[#1e2026] border border-[#3a3d45] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fechaInicio && (
              <p className="text-red-400 text-sm mt-1">{errors.fechaInicio.message}</p>
            )}
          </div>

          {/* Fecha de fin */}
          <div>
            <label className="block text-sm mb-1">Fecha de fin</label>
            <input
              type="date"
              {...register("fechaFin", { required: "Este campo es obligatorio" })}
              className="w-full bg-[#1e2026] border border-[#3a3d45] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fechaFin && (
              <p className="text-red-400 text-sm mt-1">{errors.fechaFin.message}</p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 rounded-md shadow-md"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
