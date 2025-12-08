import React, { useState, useEffect } from 'react';
import { getReservaciones } from '../api/analystService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalystDashboardCharts = () => {
  const [reservaciones, setReservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { rol } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (rol !== 'ANALYST') {
      navigate('/iniciar-sesion');
      return;
    }

    loadReservaciones();
  }, [rol, navigate]);

  const loadReservaciones = async () => {
    try {
      const data = await getReservaciones();
      setReservaciones(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las reservaciones');
      setLoading(false);
    }
  };

  // Calcular estadísticas de los datos
  const getChartData = () => {
    const reservacionesValidas = reservaciones.filter(r =>
      r && Object.values(r).some(v => v !== '' && v !== null && v !== undefined)
    );

    // Datos por tipo de cuarto
    const cuartosCounts = {};
    const cuartosIngresos = {};
    
    // Datos por rango de fechas (ingresos por mes aproximado)
    const ingresosPorMes = {};
    
    reservacionesValidas.forEach(r => {
      const tipo = r['Tipo de Cuarto'] || 'Sin especificar';
      const precio = parseFloat(r.Precio) || 0;
      const fecha = r['Fecha Inicio'] || '';

      // Contar cuartos
      cuartosCounts[tipo] = (cuartosCounts[tipo] || 0) + 1;
      cuartosIngresos[tipo] = (cuartosIngresos[tipo] || 0) + precio;

      // Agrupar ingresos por mes (tomando los primeros 7 caracteres de la fecha YYYY-MM)
      if (fecha) {
        const mes = fecha.substring(0, 7); // YYYY-MM
        ingresosPorMes[mes] = (ingresosPorMes[mes] || 0) + precio;
      }
    });

    return {
      cuartosCounts,
      cuartosIngresos,
      ingresosPorMes,
      totalReservaciones: reservacionesValidas.length,
      ingresoTotal: reservacionesValidas.reduce((sum, r) => sum + (parseFloat(r.Precio) || 0), 0)
    };
  };

  const datos = getChartData();

  // Gráfico 1: Cantidad de reservaciones por tipo de cuarto (Pie)
  const cuartosPieData = {
    labels: Object.keys(datos.cuartosCounts),
    datasets: [
      {
        label: 'Cantidad de Reservaciones',
        data: Object.values(datos.cuartosCounts),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Gráfico 2: Ingresos por tipo de cuarto (Bar)
  const cuartosIngresoData = {
    labels: Object.keys(datos.cuartosIngresos),
    datasets: [
      {
        label: 'Ingresos ($)',
        data: Object.values(datos.cuartosIngresos),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  // Gráfico 3: Tendencia de ingresos por mes (Line)
  const mesesOrdenados = Object.keys(datos.ingresosPorMes).sort();
  const ingresosLineData = {
    labels: mesesOrdenados,
    datasets: [
      {
        label: 'Ingresos por Mes ($)',
        data: mesesOrdenados.map(mes => datos.ingresosPorMes[mes]),
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(168, 85, 247, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  // Gráfico 4: Distribución de ingresos por tipo (Doughnut)
  const ingresosDistribucion = {
    labels: Object.keys(datos.cuartosIngresos),
    datasets: [
      {
        label: 'Distribución de Ingresos',
        data: Object.values(datos.cuartosIngresos),
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(236, 72, 153, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#d1d5db',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#6366f1',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
    },
  };

  if (loading) return <div className="text-center p-4 text-white mt-20">Cargando datos...</div>;
  if (error) return <div className="text-center p-4 text-red-600 mt-20">{error}</div>;

  return (
    <div className="container mx-auto p-4 mt-20 mb-10">
      {/* Encabezado */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Panel de Análisis</h1>
        <p className="text-gray-400 text-lg">Visualización de estadísticas y tendencias de reservaciones</p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#1F2937] rounded-xl p-6 border border-indigo-500/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide">Total de Reservaciones</p>
              <p className="text-4xl font-bold text-white mt-2">{datos.totalReservaciones}</p>
            </div>
            <div className="text-5xl opacity-30">📊</div>
          </div>
        </div>

        <div className="bg-[#1F2937] rounded-xl p-6 border border-purple-500/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide">Ingresos Totales</p>
              <p className="text-4xl font-bold text-green-400 mt-2">
                ${datos.ingresoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-5xl opacity-30">💰</div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Gráfico 1: Pie de cantidad de cuartos */}
        <div className="bg-[#1F2937] rounded-xl p-6 shadow-xl border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Reservaciones por Tipo de Cuarto</h3>
          <div className="relative h-80">
            <Pie
              data={cuartosPieData}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Gráfico 2: Bar de ingresos por tipo */}
        <div className="bg-[#1F2937] rounded-xl p-6 shadow-xl border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Ingresos por Tipo de Cuarto</h3>
          <div className="relative h-80">
            <Bar
              data={cuartosIngresoData}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Gráfico 3: Line de tendencia */}
        <div className="bg-[#1F2937] rounded-xl p-6 shadow-xl border border-gray-700 lg:col-span-2">
          <h3 className="text-xl font-semibold text-white mb-6">Tendencia de Ingresos por Mes</h3>
          <div className="relative h-80">
            <Line
              data={ingresosLineData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  filler: true,
                },
              }}
            />
          </div>
        </div>

        {/* Gráfico 4: Doughnut de distribución */}
        <div className="bg-[#1F2937] rounded-xl p-6 shadow-xl border border-gray-700 lg:col-span-2">
          <h3 className="text-xl font-semibold text-white mb-6">Distribución de Ingresos por Tipo de Cuarto</h3>
          <div className="relative h-96">
            <Doughnut
              data={ingresosDistribucion}
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      {/* Tabla de detalle */}
      <div className="bg-[#1F2937] rounded-xl p-6 shadow-xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Resumen por Tipo de Cuarto</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">Tipo de Cuarto</th>
                <th className="text-center py-4 px-4 text-gray-300 font-semibold">Cantidad</th>
                <th className="text-right py-4 px-4 text-gray-300 font-semibold">Ingresos Totales</th>
                <th className="text-right py-4 px-4 text-gray-300 font-semibold">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(datos.cuartosCounts).map((tipo) => {
                const cantidad = datos.cuartosCounts[tipo];
                const ingresos = datos.cuartosIngresos[tipo];
                const promedio = ingresos / cantidad;
                return (
                  <tr key={tipo} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition">
                    <td className="py-4 px-4 text-white">{tipo}</td>
                    <td className="py-4 px-4 text-center text-gray-300">{cantidad}</td>
                    <td className="py-4 px-4 text-right text-green-400 font-medium">
                      ${ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4 text-right text-blue-400">
                      ${promedio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboardCharts;
