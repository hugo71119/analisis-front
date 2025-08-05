export default function Footer() {
  return (
    <footer className="bg-[#1f1f1f] text-white py-12 mt-20 border-t border-[#333]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Sección: Sobre nosotros */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-violet-400">TuHotelApp</h3>
          <p className="text-sm text-gray-400">
            Descansa, relájate y disfruta. Ofrecemos cuartos cómodos, promociones exclusivas y atención de calidad para que tu estancia sea inolvidable.
          </p>
        </div>

        {/* Sección: Links útiles */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-violet-400">Navegación</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-violet-400 transition">Inicio</a></li>
            <li><a href="/nosotros" className="hover:text-violet-400 transition">Nosotros</a></li>
            <li><a href="/cuartos" className="hover:text-violet-400 transition">Cuartos</a></li>
            <li><a href="/realizar-reservacion" className="hover:text-violet-400 transition">Reservaciones</a></li>
            <li><a href="/contacto" className="hover:text-violet-400 transition">Contacto</a></li>
          </ul>
        </div>

        {/* Sección: Contacto / redes */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-violet-400">Síguenos</h3>
          <div className="flex justify-center md:justify-start gap-4 text-2xl">
            <a href="#" className="hover:text-violet-400 transition"><i className="fab fa-facebook"></i></a>
            <a href="#" className="hover:text-violet-400 transition"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-violet-400 transition"><i className="fab fa-twitter"></i></a>
          </div>
          <p className="text-sm text-gray-400 mt-4">contacto@hoteloasis.com</p>
          <p className="text-sm text-gray-400">+52 123 456 7890</p>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-10 border-t border-[#333] pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TuHotelApp — Todos los derechos reservados.
      </div>
    </footer>
  );
}
