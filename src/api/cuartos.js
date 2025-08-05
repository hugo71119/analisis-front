import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const obtenerCuartosDisponibles = async (params, token) => {
  try {
    const res = await axios.get(`${API_URL}/cuartos/disponibles`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error obteniendo cuartos disponibles:", error);
    throw error;
  }
};
