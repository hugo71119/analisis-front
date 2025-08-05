import { createContext, useContext, useState } from 'react';
import { addDays } from "date-fns";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [nombre, setNombre] = useState(localStorage.getItem('nombre') || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [rol, setRol] = useState(localStorage.getItem('rol') || null);
  const [reservaActual, setReservaActual] = useState(null);

  

  const login = (nuevoNombre, nuevoToken, nuevoRol) => {
    localStorage.setItem('nombre', nuevoNombre);
    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('rol', nuevoRol);
    setNombre(nuevoNombre);
    setToken(nuevoToken);
    setRol(nuevoRol);
  };

  const logout = () => {
    localStorage.removeItem('nombre');
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setNombre(null);
    setToken(null);
    setRol(null);
  };

  const nombresHabitaciones = {
    simple: "Simple",
    doble: "Doble",
    triple: "Triple",
    suite: "Suite"
  };

  return (
    <AuthContext.Provider value={{ setNombre, setToken, nombre, token, login, logout, setRol, rol, nombresHabitaciones, reservaActual, setReservaActual }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usarlo
export const useAuth = () => useContext(AuthContext);
