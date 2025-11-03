import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { nombre, logout, rol } = useAuth();




  const handleLinkClick = () => {
    if (window.innerWidth < 768) setIsOpen(false);
    setShowDropdown(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2d2e40] shadow-md text-white h-[72px] px-5 flex items-center justify-between overflow-visible">
      <Link to="/" className="text-2xl font-bold opacity-90 hover:opacity-100 transition-opacity" onClick={handleLinkClick}>
        TUHOTELAPP
      </Link>

      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        &#9776;
      </button>

      <div
        className={`${isOpen ? "max-h-[300px] opacity-100 py-4 overflow-visible pb-16" : "max-h-0 opacity-0"
          } 
        md:max-h-full md:opacity-100 md:py-0 transition-all duration-300
        absolute md:static top-[72px] left-0 w-full md:w-auto bg-[#2d2e40] flex flex-col md:flex-row md:items-center gap-4 md:gap-6 overflow-hidden md:overflow-visible px-5 md:px-0`}
      >
        <Link
          to="/"
          onClick={handleLinkClick}
          className="min-w-[120px] text-sm opacity-70 hover:opacity-100 transition-opacity py-2 text-center"
        >
          Inicio
        </Link>

        {
          rol === 'ADMIN' ? (
            <Link
              to="admin/cuartos"
              onClick={handleLinkClick}
              className="min-w-[120px] text-sm opacity-70 hover:opacity-100 transition-opacity py-2 text-center"
            >
              Cuartos
            </Link>
          ) : rol === 'ANALYST' ? (
            <Link
              to="/analyst/dashboard"
              onClick={handleLinkClick}
              className="min-w-[120px] text-sm opacity-70 hover:opacity-100 transition-opacity py-2 text-center"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/reservaciones"
              onClick={handleLinkClick}
              className="min-w-[120px] text-sm opacity-70 hover:opacity-100 transition-opacity py-2 text-center"
            >
              Reservaciones
            </Link>
          )
        }




        {rol === 'ADMIN' ? (
          <Link
            to="/crear-cuartos-admin"
            onClick={handleLinkClick}
            className="min-w-[120px] text-sm opacity-70 hover:opacity-100 transition-opacity py-2 text-center"
          >
            Admin
          </Link>
        ) : (
          <Link
            to="/nosotros"
            onClick={handleLinkClick}
            className="min-w-[120px] text-sm opacity-70 hover:opacity-100 transition-opacity py-2 text-center"
          >
            Nosotros
          </Link>
        )}

        {!nombre ? (
          <Link
            to="/iniciar-sesion"
            onClick={handleLinkClick}
            className="min-w-[120px] text-sm opacity-70 hover:opacity-100 transition-opacity py-2 text-center"
          >
            Iniciar Sesión
          </Link>
        ) : (
          <div
            className="relative flex justify-center md:justify-start items-center"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <button
              className="min-w-[120px] text-sm opacity-90 hover:opacity-100 transition-opacity py-2 px-3 bg-[#403f55] rounded-md"
            >
              Hola, {nombre}
              <i className="fa-solid fa-chevron-down ml-2 text-sm opacity-70"></i>
            </button>

            {showDropdown && (
              <div className="absolute md:right-0 top-full mt-3 w-44 bg-[#3b3b5a] border border-gray-600 rounded-md shadow-lg z-50">
                <button
                  onClick={
                    () => {
                      logout();
                      navigate('/iniciar-sesion');
                    }
                  }
                  className="w-full text-center px-4 py-2 text-sm text-white hover:bg-[#4a4a6a]"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}


      </div>
    </nav>
  );
}
