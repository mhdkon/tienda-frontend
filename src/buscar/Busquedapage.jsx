import { useState, useEffect } from "react";
import ProductoCard from "../components/ProductoCard";
import Buscador from "./Buscador";
import "./busqueda.css";

export default function BusquedaPage() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const token = localStorage.getItem('token') || '';
  const API = import.meta.env.VITE_API_URL;

  // Función para obtener ruta de imagen
  const obtenerRutaImagen = (imagen) => {
    if (!imagen) return `${API}/fallback.jpg`;
    if (imagen.startsWith("http")) return imagen;
    return `${API}${imagen}`;
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const response = await fetch(`${API}/productos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const productosConRuta = data.map(p => ({ ...p, imagen: obtenerRutaImagen(p.imagen) }));
      setProductos(productosConRuta);
      setProductosFiltrados(productosConRuta);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setCargando(false);
    }
  };

  const manejarResultadosBusqueda = (resultados, termino) => {
    const resultadosConRuta = resultados.map(p => ({ ...p, imagen: obtenerRutaImagen(p.imagen) }));
    setProductosFiltrados(resultadosConRuta);
    setMostrandoResultados(true);
    setTerminoBusqueda(termino);
  };

  const limpiarBusqueda = () => {
    setProductosFiltrados(productos);
    setMostrandoResultados(false);
    setTerminoBusqueda('');
  };

  const manejarAñadirAlCarrito = (producto) => {
    console.log('Añadiendo al carrito:', producto);
  };

  if (cargando) return <div className="cargando">Cargando productos...</div>;

  return (
    <div className="busqueda-page">
      <Buscador onResultadosBusqueda={manejarResultadosBusqueda} token={token} />

      <ul className="lista-productos">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <ProductoCard
              key={producto._id}
              producto={producto}
              onAñadir={manejarAñadirAlCarrito}
            />
          ))
        ) : (
          <div className="sin-resultados">
            <p>No se encontraron productos.</p>
            {mostrandoResultados && <button onClick={limpiarBusqueda}>Ver todos los productos</button>}
          </div>
        )}
      </ul>
    </div>
  );
}
