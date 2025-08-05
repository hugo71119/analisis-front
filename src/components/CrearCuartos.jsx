import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CrearCuarto() {
    const { token, rol, nombresHabitaciones } = useAuth();
    const { id } = useParams();
    const [modoEdicion, setModoEdicion] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();
    const navigate = useNavigate();

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (id) {
            setModoEdicion(true);
            axios.get(`${API}/cuartos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => {
                    reset(res.data);
                })
                .catch(err => {
                    console.error("Error al cargar cuarto:", err);
                    Swal.fire("Error", "No se pudo cargar el cuarto", "error");
                });
        }
    }, [id]);

    const onSubmit = async (data) => {
        try {
            if (modoEdicion) {
                await axios.put(`${API}/cuartos/admin/editar/${id}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                Swal.fire({
                    icon: 'success',
                    title: '¡Cuarto actualizado!',
                    confirmButtonColor: '#7b4fff',
                }).then(() => navigate('/admin/cuartos'));

            } else {
                await axios.post(`${API}/cuartos/admin/crear`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                Swal.fire({
                    icon: 'success',
                    title: '¡Cuarto creado exitosamente!',
                    text: 'El cuarto ha sido creado correctamente.',
                    showDenyButton: true,
                    confirmButtonText: 'Ir a listado',
                    denyButtonText: 'Continuar creando',
                    confirmButtonColor: '#7b4fff',
                    denyButtonColor: '#6b7280',
                }).then(({ isConfirmed, isDenied }) => {
                    if (isConfirmed) {
                        navigate('/admin/cuartos');
                    } else if (isDenied) {
                        reset();
                        document.getElementsByClassName('numero')?.[0]?.focus();
                    }
                });
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar el cuarto',
                text: 'Por favor, verifica los datos e intenta nuevamente.',
                confirmButtonColor: '#7b4fff',
            });
        }
    };

    if (rol !== "ADMIN") {
        return (
            <p className="text-center text-red-500 mt-28">
                No tienes permiso para ver esta página.
            </p>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-24 px-6">
            <div className="bg-[#2a2d36] text-white p-8 rounded-2xl shadow-lg border border-[#3d3f4c]">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">
                    {modoEdicion ? "Editar Cuarto" : "Crear nuevo cuarto"}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm mb-1">Número</label>
                        <input
                            type="number"
                            {...register("numero", {
                                required: "Este campo es obligatorio",
                                min: {
                                    value: 0,
                                    message: "No se permiten números negativos",
                                },
                            })}
                            className="w-full bg-[#1e2026] border border-[#3a3d45] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 numero"
                        />
                        {errors.numero && <p className="text-red-400 text-sm mt-1">{errors.numero.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Tipo</label>
                        <select
                            {...register("tipo", { required: true })}
                            className="w-full bg-[#1e2026] border border-[#3a3d45] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.entries(nombresHabitaciones).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            ))}
                        </select>
                        {errors.tipo && <p className="text-red-400 text-sm mt-1">Tipo requerido</p>}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Capacidad</label>
                        <input
                            type="number"
                            {...register("capacidad", {
                                required: "Este campo es obligatorio",
                                min: { value: 1, message: "La capacidad debe ser al menos 1" },
                                max: { value: 10, message: "La capacidad no puede ser mayor a 10" }
                            })}
                            className="w-full bg-[#1e2026] border border-[#3a3d45] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.capacidad && <p className="text-red-400 text-sm mt-1">{errors.capacidad.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Precio</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("precio", {
                                required: "Este campo es obligatorio",
                                min: { value: 0, message: "El precio no puede ser negativo" }
                            })}
                            className="w-full bg-[#1e2026] border border-[#3a3d45] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.precio && <p className="text-red-400 text-sm mt-1">Precio requerido</p>}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Descripción</label>
                        <textarea
                            {...register("descripcion", { required: true })}
                            className="w-full bg-[#1e2026] border border-[#3a3d45] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                        {errors.descripcion && <p className="text-red-400 text-sm mt-1">Descripción requerida</p>}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">URL de Imagen</label>
                        <input
                            type="url"
                            {...register("imagenUrl", { required: true })}
                            className="w-full bg-[#1e2026] border border-[#3a3d45] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.imagenUrl && <p className="text-red-400 text-sm mt-1">URL de imagen requerida</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 rounded-md shadow-md hover:cursor-pointer"
                    >
                        {modoEdicion ? "Guardar Cambios" : "Crear Cuarto"}
                    </button>
                </form>
            </div>
        </div>
    );
}
