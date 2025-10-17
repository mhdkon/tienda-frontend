import { useState } from "react";

export default function ProductoCard({ producto, onAñadir }) {
  const [mostrarImagen, setMostrarImagen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Ruta correcta de imagen, fallback incluido
  const obtenerRutaImagen = (imagen) => {
    if (!imagen) return `${API_URL}/fallback.jpg`;
    if (imagen.startsWith("http")) return imagen;
    return `${API_URL}${imagen}`;
  };

  const imagenSrc = obtenerRutaImagen(producto.imagen);

  return (
    <>
      <li className="producto-card">
        <img
          src={imagenSrc}
          alt={producto.nombre}
          onClick={() => setMostrarImagen(true)}
          onError={(e) => (e.target.src = `${API_URL}/fallback.jpg`)}
          style={{ cursor: "pointer" }}
        />
        <h4>{producto.nombre}</h4>
        <p>
          {producto.precio.toLocaleString("es-ES", {
            style: "currency",
            currency: "EUR",
          })}
        </p>
        <button className="add" onClick={() => onAñadir(producto)}>
          Añadir al carrito
        </button>
      </li>

      {mostrarImagen && (
        <div className="imagen-modal" onClick={() => setMostrarImagen(false)}>
          <div
            className="imagen-modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={imagenSrc} alt={producto.nombre} />
            <button
              className="cerrar-imagen"
              onClick={() => setMostrarImagen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
