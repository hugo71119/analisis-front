import API from "./api";

export const crearReserva = async (cuartoId, fechaInicio, fechaFin) => {
  const response = await API.post('/reservas', {
    cuartoId,
    fechaInicio,
    fechaFin,
  });
  return response.data;
};

// Obtener las reservaciones del usuario actual
export const getReservas = async () => {
  const response = await API.get('/reservas');
  return response.data;
};

// Eliminar (cancelar) una reservación por ID
export const cancelarReserva = async (id) => {
  const response = await API.delete(`/reservas/${id}`);
  return response.data;
};