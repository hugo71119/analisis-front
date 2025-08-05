import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="text-white px-6 md:px-16 py-12 mt-36 min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight">404</h1>
        <p className="text-lg text-white/80">
          La página que buscas no existe o fue movida.
        </p>
      </div>

      {/* Mensaje principal */}
      <p className="text-white/90 max-w-xl">
        Puede que el enlace esté roto o que la dirección tenga un error tipográfico.
      </p>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
        >
          Volver al inicio
        </Link>
        <Link
          to="/reservaciones"
          className="inline-block bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg backdrop-blur transition"
        >
          Ir a reservaciones
        </Link>
      </div>

      {/* Mensaje secundario */}
      <p className="text-sm text-white/60">
        Si crees que esto es un error, contáctanos.
      </p>
    </section>
  );
}
