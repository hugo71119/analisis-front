import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'


export default function Reservaciones() {
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const { setReservaActual } = useAuth()
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (!token) {
      setCargando(false)
      return
    }

    const obtenerReservas = async () => {
      try {
        const res = await axios.get(`${API_URL}/reservaciones/mias`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setReservas(res.data)
      } catch (error) {
        console.error('Error al obtener las reservaciones:', error)
      } finally {
        setCargando(false)
      }
    }

    obtenerReservas()
  }, [token])

  const eliminarReserva = async (id) => {
    Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/reservaciones/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        Swal.fire('¡Eliminada!', 'La reservación ha sido cancelada.', 'success')
        setReservas(prev => prev.filter(r => r.id !== id))
      } catch (error) {
        console.error('Error al eliminar:', error)
        Swal.fire('Error', 'No se pudo eliminar la reservación.', 'error')
      }
    }
  })
  }

  if (cargando) return <p className="text-white">Cargando...</p>

  if (!token) {
    return (
      <div className="text-white p-4 mt-20">
        <p>No has iniciado sesión. Por favor inicia sesión para ver tus reservaciones.</p>
        <button
          onClick={() => navigate('/iniciar-sesion')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Ir a iniciar sesión
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 min-h-screen text-white mt-18">
      <h2 className="text-2xl font-bold mb-6">Mis Reservaciones</h2>

      {reservas.length === 0 ? (
        <p>No tienes reservaciones todavía.</p>
      ) : (
        <>
          {/* Tabla en escritorio */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-[#1f1f1f] rounded-lg shadow-md">
              <thead className="bg-[#2a2a2a]">
                <tr>
                  <th className="text-left py-3 px-4">Número</th>
                  <th className="text-left py-3 px-4">Tipo</th>
                  <th className="text-left py-3 px-4">Capacidad</th>
                  <th className="text-left py-3 px-4">Precio</th>
                  <th className="text-left py-3 px-4">Fecha inicio</th>
                  <th className="text-left py-3 px-4">Fecha fin</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Editar</th>
                  <th className="text-left py-3 px-4">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr
                    key={reserva.id}
                    className="border-t border-[#333] hover:bg-[#2c2c2c]"
                  >
                    <td className="py-3 px-4">{reserva.cuarto.numero}</td>
                    <td className="py-3 px-4 capitalize">{reserva.cuarto.tipo}</td>
                    <td className="py-3 px-4">{reserva.cuarto.capacidad}</td>
                    <td className="py-3 px-4">${reserva.cuarto.precio}</td>
                    <td className="py-3 px-4">{reserva.fechaInicio}</td>
                    <td className="py-3 px-4">{reserva.fechaFin}</td>
                    <td className="py-3 px-4">
                      ${reserva.cuarto.precio * (
                        (new Date(reserva.fechaFin) - new Date(reserva.fechaInicio)) /
                        (1000 * 60 * 60 * 24)
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setReservaActual(reserva);
                          navigate(`/editar-reservacion/${reserva.id}`);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Editar
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => eliminarReserva(reserva.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards en móvil */}
          <div className="md:hidden space-y-4">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="bg-[#1f1f1f] p-4 rounded-lg shadow-md">
                <p><strong>Número:</strong> {reserva.cuarto.numero}</p>
                <p><strong>Tipo:</strong> {reserva.cuarto.tipo}</p>
                <p><strong>Capacidad:</strong> {reserva.cuarto.capacidad}</p>
                <p><strong>Precio:</strong> ${reserva.cuarto.precio}</p>
                <p><strong>Desde:</strong> {reserva.fechaInicio}</p>
                <p><strong>Hasta:</strong> {reserva.fechaFin}</p>
                <p>
                  <strong>Total:</strong> ${reserva.cuarto.precio * (
                    (new Date(reserva.fechaFin) - new Date(reserva.fechaInicio)) /
                    (1000 * 60 * 60 * 24)
                  )}
                </p>

                <div className="mt-4 flex justify-between gap-2">
                  <button
                    onClick={() => {
                      setReservaActual(reserva);
                      navigate(`/editar-reservacion/${reserva.id}`);
                    }}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarReserva(reserva.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
