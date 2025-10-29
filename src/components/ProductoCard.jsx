import { useState, useCallback } from "react";

export default function ProductoCard({ producto, onAñadir, onClickImagen }) {
  // Estado para mostrar imagen grande
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  // Función para obtener la ruta de la imagen
  const obtenerRutaImagen = useCallback((imagen) => {
    if (!imagen) return `${API}/fallback.jpg`;
    if (imagen.startsWith("http")) return imagen;
    return `${API}${imagen}`;
  }, [API]);

  // Ruta de la imagen del producto
  const imagenSrc = obtenerRutaImagen(producto.imagen);

  // Función cuando se hace clic en Añadir al carrito
  const handleAñadirClick = useCallback(() => {
    // Verificar qué tipo de parámetros espera la función
    if (onAñadir.length > 1) {
      onAñadir(producto.id, "38"); // Para funciones que necesitan ID y talla
    } else {
      onAñadir(producto.id); // Para funciones que solo necesitan ID
    }
  }, [onAñadir, producto.id]);

  // Función cuando se hace clic en la imagen
  const handleClickImagen = useCallback(() => {
    setMostrarImagen(true);
    onClickImagen && onClickImagen(producto.imagen);
  }, [onClickImagen, producto.imagen]);

  // Función para cerrar imagen grande
  const cerrarImagen = useCallback(() => setMostrarImagen(false), []);

  // Formatear el precio a euros
  const precioFormateado = typeof producto.precio === 'string' 
    ? parseFloat(producto.precio).toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
      })
    : producto.precio.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
      });

  return (
    <>
      {/* Tarjeta del producto */}
      <li className="producto-card">
        {/* Imagen del producto */}
        <img
          src={imagenSrc}
          alt={producto.nombre}
          onClick={handleClickImagen}
          onError={(e) => (e.target.src = `${API}/fallback.jpg`)}
          style={{ cursor: "pointer" }}
        />
        {/* Nombre del producto */}
        <h4>{producto.nombre}</h4>
        {/* Precio del producto */}
        <p>{precioFormateado}</p>
        {/* Botón para añadir al carrito */}
        <button className="add" onClick={handleAñadirClick}>
          Añadir al carrito
        </button>
      </li>

      {/* Modal para imagen grande */}
      {mostrarImagen && (
        <div className="imagen-modal" onClick={cerrarImagen}>
          <div
            className="imagen-modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen grande */}
            <img src={imagenSrc} alt={producto.nombre} />
            {/* Botón para cerrar imagen */}
            <button
              className="cerrar-imagen"
              onClick={cerrarImagen}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}