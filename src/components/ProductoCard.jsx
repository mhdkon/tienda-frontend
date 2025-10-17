import { useState } from "react";

export default function ProductoCard({ producto, onAñadir, onClickImagen }) {
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  // Función para obtener ruta correcta de la imagen
  const obtenerRutaImagen = (imagen) => {
    if (!imagen) return `${API}/fallback.jpg`;
    if (imagen.startsWith("http")) return imagen;
    return `${API}${imagen}`;
  };

  const imagenSrc = obtenerRutaImagen(producto.imagen);

  return (
    <>
      <li className="producto-card">
        <img
          src={imagenSrc}
          alt={producto.nombre}
          onClick={() => {
            setMostrarImagen(true);
            onClickImagen && onClickImagen(imagenSrc);
          }}
          onError={(e) => (e.target.src = `${API}/fallback.jpg`)}
          style={{ cursor: "pointer" }}
        />
        <h4>{producto.nombre}</h4>
        <p>
          {(producto.precio || 0).toLocaleString("es-ES", {
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
