import { useRouteError, Link, isRouteErrorResponse } from "react-router-dom";

export default function RouteError() {
  const error = useRouteError();

  // Normaliza el mensaje y status si viene de loaders/actions
  const status = isRouteErrorResponse(error) ? error.status : (error?.status || 500);
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText || ''}`.trim()
    : "Algo salió mal";
  const message = isRouteErrorResponse(error)
    ? (error.data?.message || "Hubo un problema procesando la solicitud.")
    : (error?.message || "Error desconocido.");

  return (
    <section className="text-white px-6 md:px-16 py-12 mt-36">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Título y estado */}
        <div className="md:col-span-2 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            {title}
          </h1>
          <p className="text-white/70">
            Código de estado: <span className="font-semibold">{status}</span>
          </p>
        </div>

        {/* Bloque de detalle del error */}
        <div className="order-2 md:order-1 space-y-6">
          <div className="rounded-lg border border-white/15 bg-white/5 p-5 shadow">
            <p className="text-white/90">{message}</p>

            {/* Detalles técnicos (colapsables) */}
            {!isRouteErrorResponse(error) && error?.stack && (
              <details className="mt-4 text-sm text-white/70 whitespace-pre-wrap">
                <summary className="cursor-pointer select-none">Detalles técnicos</summary>
                <pre className="mt-2 overflow-auto">{String(error.stack).slice(0, 4000)}</pre>
              </details>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => location.reload()}
              className="inline-block bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              Reintentar
            </button>
            <Link
              to="/"
              className="inline-block bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg backdrop-blur transition"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
