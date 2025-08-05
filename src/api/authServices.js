import API from "./api";

export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  const { token, nombre } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('nombre', nombre);
  return { token, nombre };
};

export const register = async (email, password, nombre) => {
  const response = await API.post('/auth/register', {
    email,
    password,
    nombre,
  });
  return response.data;
};