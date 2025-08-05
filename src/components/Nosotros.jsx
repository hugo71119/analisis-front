import { Link } from "react-router-dom";

export default function Nosotros() {
  return (
    <section className="text-white px-6 md:px-16 py-10 mt-36">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Título centrado arriba de todo */}
        <div className="col-span-1 md:col-span-2 text-center">
          <h2 className="text-4xl font-bold mb-6">Nosotros</h2>
        </div>

        {/* Imagen: se muestra primero en mobile (order-1), después en desktop (md:order-2) */}
        <div className="order-1 md:order-2">
          <img
            src="/img/cuartos.jpg"
            alt="Nosotros"
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </div>

        {/* Texto descriptivo con botón: se muestra después en mobile (order-2), antes en desktop (md:order-1) */}
        <div className="space-y-6 order-2 md:order-1">
          <p>
            En <strong>TuHotelApp</strong>, creemos que viajar no debería ser complicado.
            Nos especializamos en ofrecer experiencias de hospedaje personalizadas,
            convenientes y accesibles para todos.
          </p>
          <p>
            Con tecnología de punta, atención al cliente 24/7 y alianzas con cientos 
            de hoteles alrededor del mundo, nuestra misión es ayudarte a encontrar 
            tu lugar ideal para cada aventura.
          </p>

          <Link
            to="/reservaciones"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded transition"
          >
            Ir a reservar
          </Link>
        </div>
      </div>
    </section>
  );
}
