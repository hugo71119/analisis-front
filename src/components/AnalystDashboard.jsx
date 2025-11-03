import React, { useState, useEffect } from 'react';
import { getReservaciones, downloadReservacionesCSV } from '../api/analystService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AnalystDashboard = () => {
    const [reservaciones, setReservaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { rol } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el usuario es analista
        if (rol !== 'ANALYST') {
            navigate('/iniciar-sesion');
            return;
        }

        loadReservaciones();
    }, [rol, navigate]);

    const loadReservaciones = async () => {
        try {
            const data = await getReservaciones();
            console.log('Datos recibidos:', data); // Para debug
            setReservaciones(data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar las reservaciones');
            setLoading(false);
        }
    };

    const handleDownloadCSV = async () => {
        try {
            await downloadReservacionesCSV();
        } catch (err) {
            setError('Error al descargar el archivo CSV');
        }
    };

    // arriba del return (o dentro del componente)
    const reservacionesVisibles = reservaciones.filter(r =>
    r && Object.values(r).some(v => v !== '' && v !== null && v !== undefined)
    );


    if (loading) return <div className="text-center p-4">Cargando...</div>;
    if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Panel de Analista</h1>
                    <p className="text-gray-400">Gestión de Reservaciones</p>
                </div>
                <button
                    onClick={handleDownloadCSV}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 ease-in-out flex items-center gap-2 shadow-lg hover:shadow-indigo-500/30"
                >
                    <i className="fas fa-download"></i>
                    Exportar a CSV
                </button>
            </div>

            <div className="overflow-x-auto bg-[#1F2937] rounded-xl shadow-xl">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-[#2D3748]">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Fecha Inicio</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Fecha Fin</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Número</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                                {reservacionesVisibles.map((reservacion) => (
                                    <tr 
                                        key={reservacion.ID} 
                                        className="hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-700"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{reservacion.ID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{reservacion['Fecha Inicio']}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{reservacion['Fecha Fin']}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{reservacion.Usuario}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{reservacion['Email Usuario']}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{reservacion['Número de Cuarto']}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{reservacion['Tipo de Cuarto']}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-400">
                                            ${typeof reservacion.Precio === 'number' 
                                                ? reservacion.Precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })
                                                : reservacion.Precio}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-800/50">
                                    <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-300 text-right border-t border-gray-600">
                                        Total de Ingresos:
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-400 border-t border-gray-600">
                                        ${reservaciones.reduce((total, reservacion) => {
                                            const precio = typeof reservacion.Precio === 'number' ? reservacion.Precio : 0;
                                            return total + precio;
                                        }, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalystDashboard;