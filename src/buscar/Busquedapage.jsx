import { useState, useEffect } from "react";
import ProductoCard from "../components/ProductoCard"; // Ajusta la ruta según tu estructura
import Buscador from "./Buscador";
import "./busqueda.css";

export default function BusquedaPage() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  // Obtener token (ajusta según tu implementación)
  const token = localStorage.getItem('token') || '';

  // Cargar todos los productos inicialmente
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      // Aquí tu función para cargar todos los productos
      const response = await fetch('http://localhost:3000/api/productos');
      const data = await response.json();
      setProductos(data);
      setProductosFiltrados(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setCargando(false);
    }
  };

  const manejarResultadosBusqueda = (resultados, termino) => {
    setProductosFiltrados(resultados);
    setMostrandoResultados(true);
    setTerminoBusqueda(termino);
  };

  const limpiarBusqueda = () => {
    setProductosFiltrados(productos);
    setMostrandoResultados(false);
    setTerminoBusqueda('');
  };

  const manejarAñadirAlCarrito = (producto) => {
    // Tu lógica existente para añadir al carrito
    console.log('Añadiendo al carrito:', producto);
    // ... tu código existente
  };

  if (cargando) {
    return <div className="cargando">Cargando productos...</div>;
  }

  return (
    <div className="busqueda-page">
      <div className="header-busqueda">
        <h1>Nuestra Colección de Zapatos</h1>
        
        <Buscador 
          onResultadosBusqueda={manejarResultadosBusqueda}
          token={token}
        />

        {mostrandoResultados && (
          <div className="info-busqueda">
            <p>
              Mostrando {productosFiltrados.length} resultado(s) para: 
              <strong> "{terminoBusqueda}"</strong>
            </p>
            <button onClick={limpiarBusqueda} className="btn-limpiar">
              Ver todos los productos
            </button>
          </div>
        )}
      </div>

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
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            {mostrandoResultados && (
              <button onClick={limpiarBusqueda} className="btn-limpiar">
                Ver todos los productos
              </button>
            )}
          </div>
        )}
      </ul>
    </div>
  );
}