import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import Layout from './layout/Layout.jsx'
import Reservaciones from './components/Reservaciones.jsx'
import Nosotros from './components/Nosotros.jsx'
import LogIn from './components/LogIn.jsx'
import RealizarReservacion from './components/RealizarReservacion.jsx'
import RouteError from './components/RouteError.jsx'
import NotFound from './components/NotFound.jsx'
import CrearCuartos from './components/CrearCuartos.jsx'
import "@fortawesome/fontawesome-free/css/all.min.css";
import AdminDashboardCuartos from './components/AdminDashboardCuartos.jsx'
import VerCuarto from './components/VerCuarto.jsx'
import EditarReservacion from './components/EditarReservacion.jsx'
import DetalleCuarto from './components/DetalleCuarto.jsx'
import Checkout from './components/Checkout.jsx'
import AnalystDashboard from './components/AnalystDashboard.jsx'
import AnalystDashboardCharts from './components/AnalystDashboardCharts.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: 'reservaciones',
        element: <Reservaciones/>
      },
      {
        path: 'nosotros',
        element: <Nosotros/>
      },
      {
        path: 'iniciar-sesion',
        element: <LogIn/>
      },
      {
        path: 'realizar-reservacion',
        element: <RealizarReservacion />
      },
      {
        path: 'crear-cuartos-admin',
        element: <CrearCuartos />
      },
      {
        path: 'admin/cuartos',
        element: <AdminDashboardCuartos />
      },
      {
        path: '/cuartos/editar/:id',
        element: <CrearCuartos />
      },
      {
        path: '/cuartos/:id',
        element: <VerCuarto />
      },
      {
        path: '/editar-reservacion/:id',
        element: <EditarReservacion />
      },
      {
        path: '/detalle-cuarto/:id',
        element: <DetalleCuarto />
      },
      {
        path: '/checkout',
        element: <Checkout />
      },
      {
        path: '/analyst/tabla',
        element: <AnalystDashboard />
      },
      {
        path: '/analyst/dashboard',
        element: <AnalystDashboardCharts />
      },
      {
        path: '*',
        element: <NotFound /> 
      }
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </AuthProvider>
)
