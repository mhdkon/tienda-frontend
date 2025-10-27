import { useState, useCallback } from "react";

export default function ProductoCard({ producto, onAñadir, onClickImagen }) {
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const obtenerRutaImagen = useCallback((imagen) => {
    if (!imagen) return `${API}/fallback.jpg`;
    if (imagen.startsWith("http")) return imagen;
    return `${API}${imagen}`;
  }, [API]);

  const imagenSrc = obtenerRutaImagen(producto.imagen);

  // ✅ Función optimizada sin console.log
  const handleAñadirClick = useCallback(() => {
    // Si onAñadir espera un objeto, enviar objeto con talla
    // Si espera solo el ID, enviar solo el ID
    if (onAñadir.length > 1) {
      onAñadir(producto.id, "38"); // Para versiones antiguas
    } else {
      onAñadir(producto.id); // Para versiones nuevas
    }
  }, [onAñadir, producto.id]);

  const handleClickImagen = useCallback(() => {
    setMostrarImagen(true);
    onClickImagen && onClickImagen(producto.imagen);
  }, [onClickImagen, producto.imagen]);

  const cerrarImagen = useCallback(() => setMostrarImagen(false), []);

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
      <li className="producto-card">
        <img
          src={imagenSrc}
          alt={producto.nombre}
          onClick={handleClickImagen}
          onError={(e) => (e.target.src = `${API}/fallback.jpg`)}
          style={{ cursor: "pointer" }}
        />
        <h4>{producto.nombre}</h4>
        <p>{precioFormateado}</p>
        <button className="add" onClick={handleAñadirClick}>
          Añadir al carrito
        </button>
      </li>

      {mostrarImagen && (
        <div className="imagen-modal" onClick={cerrarImagen}>
          <div
            className="imagen-modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={imagenSrc} alt={producto.nombre} />
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