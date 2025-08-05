import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { obtenerCuartosDisponibles } from "../api/cuartos";
import Swal from 'sweetalert2';
import { useAuth } from "../context/AuthContext";

export default function SearchForm() {
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
  const huespedes = watch("huespedes");
  const navigate = useNavigate()
  const { nombresHabitaciones } = useAuth();

  const opcionesHabitacion = () => {
    const num = parseInt(huespedes);
    if (!num || num === 1) return ["simple", "doble", "suite"];
    if (num === 2) return ["doble", "triple", "suite"];
    return ["triple", "suite"];
  };

  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 5),
      key: "selection"
    }
  ]);



  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("🔒 Usuario no autenticado. Redirigiendo al login...");
      navigate("/iniciar-sesion");
      return;
    }

    if (!data.destino || !data.huespedes || !data.tipoHabitacion) {
      alert("Por favor completa todos los campos.");
      return;
    }
    console.log("🔐 Usuario autenticado, procediendo con búsqueda...");

    // Llamada a la API para obtener cuartos disponibles
    try {
      const params = {
        tipo: data.tipoHabitacion,
        capacidad: data.huespedes,
        inicio: range[0].startDate.toISOString().split('T')[0],
        fin: range[0].endDate.toISOString().split('T')[0]
      };

      const cuartosDisponibles = await obtenerCuartosDisponibles(params, token);

      if (cuartosDisponibles && cuartosDisponibles.length > 0) {
        Swal.fire({
          title: 'Cuartos disponibles',
          text: 'Hemos encontrado cuartos que coinciden con tu búsqueda.',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Ir a reservar',
          cancelButtonText: 'Cancelar',
          background: '#1f1f1f',
          color: '#fff',
          confirmButtonColor: '#c20064',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/realizar-reservacion", {
              state: {
                cuartos: cuartosDisponibles,
                fechaInicio: params.inicio,
                fechaFin: params.fin,
              },
            });
          }
        });
      } else {
        Swal.fire({
          title: 'Sin resultados',
          text: 'No hay cuartos disponibles para esos criterios. Intenta con otros.',
          icon: 'warning',
          confirmButtonText: 'Ok',
          background: '#1f1f1f',
          color: '#fff',
          confirmButtonColor: '#c20064',
        });
      }
    } catch (error) {
      console.error("Error consultando disponibilidad:", error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al consultar los cuartos. Intenta más tarde.',
        icon: 'error',
        background: '#1f1f1f',
        color: '#fff',
        confirmButtonColor: '#c20064',
      });
    }

    console.log("Datos enviados:", {
      ...data,
      fechaInicio: range[0].startDate,
      fechaFin: range[0].endDate
    });
  };

  useEffect(() => {
    const opciones = opcionesHabitacion();
    const seleccionActual = watch("tipoHabitacion");

    // Si la opción actual ya no es válida, actualiza a la primera válida
    if (!opciones.includes(seleccionActual)) {
      setValue("tipoHabitacion", opciones[0]);
    }
  }, [huespedes]);

  return (
    <div className="bg-gradient-to-r from-[#005b84] to-[#026394] p-10 text-white text-center">
      <h1 className="text-4xl font-light mb-10">
        Cuando te quieres ir, <strong className="font-semibold">te vas.</strong>
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-5 bg-[#1f1f1f] p-5 rounded-xl justify-center items-end max-w-6xl mx-auto">
        {/* Destino */}
        <div className="flex flex-col flex-1 min-w-[250px]">
          <label className="text-left mb-1 text-sm text-gray-300">Destino</label>
          <div className="flex items-center gap-2 border-b border-gray-600 px-3 py-3 bg-[#1f1f1f]">
            <i className="fa-solid fa-location-dot text-gray-400"></i>
            <input
              type="text"
              placeholder="Destino, hotel, punto de interés"
              {...register("destino", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: "Solo se permiten letras y espacios"
                }
              })}
              className="bg-transparent outline-none text-white w-full"
            />
          </div>
          {errors.destino && <span className="text-red-500 text-sm mt-1">{errors.destino.message}</span>}
        </div>

        {/* Fechas */}
        <div className="flex flex-col flex-1 min-w-[250px] relative">
          <label className="text-left mb-1 text-sm text-gray-300">Fechas</label>
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2 border-b border-gray-600 px-3 py-3 bg-[#1f1f1f] cursor-pointer"
          >
            <i className="fa-solid fa-calendar-days text-gray-400"></i>
            <input
              type="text"
              value={`${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`}
              readOnly
              className="bg-transparent outline-none text-white w-full cursor-pointer"
            />
          </div>
          {showCalendar && (
            <div className="absolute z-10 mt-2">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                  setRange([item.selection]);

                  const { startDate, endDate } = item.selection;

                  // Solo cierra el calendario si ambas fechas son diferentes
                  if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
                    setShowCalendar(false);
                  }
                }}
                moveRangeOnFirstSelection={false}
                ranges={range}
                className="shadow-lg"
              />
            </div>
          )}

        </div>

        {/* Huespedes */}
        <div className="flex flex-col flex-1 min-w-[250px]">
          <label className="text-left mb-1 text-sm text-gray-300">Huéspedes</label>
          <div className="flex items-center gap-2 border-b border-gray-600 px-3 py-3 bg-[#1f1f1f]">
            <i className="fa-solid fa-user-group text-gray-400"></i>
            <select
              {...register("huespedes", { required: true })}
              className="bg-transparent outline-none text-white w-full appearance-none"
            >
              <option value="" disabled>Selecciona huéspedes</option>
              {[...Array(10).keys()].map(i => (
                <option key={i + 1} value={i + 1} className="text-black">{i + 1} huésped{i + 1 > 1 ? 'es' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tipo de habitación */}
        <div className="flex flex-col flex-1 min-w-[250px]">
          <label className="text-left mb-1 text-sm text-gray-300">Tipo de habitación</label>
          <div className="flex items-center gap-2 border-b border-gray-600 px-3 py-3 bg-[#1f1f1f]">
            <i className="fa-solid fa-bed text-gray-400"></i>
            <select
              {...register("tipoHabitacion", { required: true })}
              className="bg-transparent outline-none text-white w-full appearance-none"
            >
              {opcionesHabitacion().map((tipo) => (
                <option key={tipo} value={tipo} className="text-black">
                  {nombresHabitaciones[tipo]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="bg-[#c20064] hover:bg-[#a80056] text-white font-medium px-7 py-3 rounded-xl hover:cursor-pointer"
        >
          Buscar
        </button>
      </form>

      <div className="mt-8 text-sm text-gray-200">
        Reserva ahora y paga después | Meses sin intereses | Cancelación GRATIS en miles de hoteles
      </div>
    </div>
  );
}
