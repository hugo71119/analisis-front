import CuartosDestacados from "./components/CuartosDestacados";
import SearchForm from "./components/SearchForm";
import "./styles/style.css";

function App() {

  return (
    <>
      <div className="banner">
        <img src="../public/img/cuartos.jpg" alt="Banner" className="banner-img" />
        <h1>Cuartos de Hotel</h1>
      </div>
      <SearchForm />
      <div className="text-white px-6 md:px-12 mt-16 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">Bienvenido a nuestro hotel</h2>
        <p className="text-lg text-white/90 mb-3">
          Disfruta de una estancia inolvidable con nosotros. Ofrecemos habitaciones cómodas y un servicio excepcional.
        </p>
        <p className="text-lg text-white/80 mb-2">
          Reserva ahora y aprovecha nuestras <span className="text-purple-400 font-semibold">ofertas especiales</span>.
        </p>
      </div>

      <CuartosDestacados />
    </>
  )
}

export default App
