import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const LogIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { setNombre, setToken, setRol } = useAuth();

  const onSubmit = async (data) => {
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, data);
      console.log("Respuesta del servidor:", res.data);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('nombre', res.data.nombre);
        localStorage.setItem('rol', res.data.rol);
        setToken(res.data.token);
        setNombre(res.data.nombre);
        setRol(res.data.rol);
        console.log("token: " + res.data.token);
        console.log("nombre: " + res.data.nombre);
        console.log("rol: " + res.data.rol);

        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido, ${res.data.nombre || 'usuario'}!`,
          text: 'Has iniciado sesión correctamente.',
          confirmButtonColor: '#7b4fff',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/');
          window.location.reload()
        }
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Ahora puedes iniciar sesión con tu cuenta.',
        confirmButtonColor: '#7b4fff',
      });
      setIsLogin(true);
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error en el envío. Verifica tus datos.',
      confirmButtonColor: '#c20064',
    });
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden max-w-3xl w-full">
        
        {/* Imagen */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="../../public/img/cuarto-lujo.jpg" // Usa tu propia imagen
            alt="Login visual"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <div className="flex items-center gap-2 text-[#5f34df] font-bold text-2xl mb-2">
            <span>🛏️</span> TUHOTELAPP
          </div>
          <h2 className="text-gray-700 text-xl font-semibold mb-6">
            {isLogin ? 'Iniciar sesión' : 'Crear una cuenta'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Nombre"
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                  className="px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a78bfa]"
                />
                {errors.nombre && (
                  <span className="text-red-500 text-sm mt-1">{errors.nombre.message}</span>
                )}
              </div>
            )}
            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Email"
                {...register('email', { required: 'El email es obligatorio' })}
                className="px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a78bfa]"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col">
              <input
                type="password"
                placeholder="Contraseña"
                {...register('password', { required: 'La contraseña es obligatoria' })}
                className="px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a78bfa]"
              />
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#7b4fff] hover:bg-[#693df1] text-white py-3 rounded-lg transition-colors hover:cursor-pointer"
            >
              {isLogin ? 'Entrar' : 'Registrarse'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#6d28d9] hover:underline cursor-pointer"
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;

