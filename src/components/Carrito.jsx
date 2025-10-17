import React from "react";

export default function Carrito({
  carrito,
  productos,
  token,
  handlePagar,
  handleBorrar,
  handleEditar,
  editarId,
  setEditarId,
  nuevoProducto,
  setNuevoProducto,
}) {
  const API = import.meta.env.VITE_API_URL;

  // Garantizar que carrito y productos siempre sean arrays
  const carritoArray = Array.isArray(carrito) ? carrito : [];
  const productosArray = Array.isArray(productos) ? productos : [];

  const obtenerRutaImagen = (imagen) => {
    if (!imagen) return "/fallback.jpg";
    if (imagen.startsWith("http")) return imagen;
    return `${API}${imagen}`;
  };

  return (
    <ul className="carrito-lista-tickets">
      {carritoArray.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        carritoArray.map((p) => (
          <li key={p._id} className="ticket">
            <img src={obtenerRutaImagen(p.imagen)} alt={p.nombre} />
            <div className="ticket-info">
              <h4>{p.nombre}</h4>
              <p>
                {(p.precio || 0).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
              <span className={p.pagado ? "estado pagado" : "estado no-pagado"}>
                {p.pagado ? "✅ Pagado" : "❌ No pagado"}
              </span>
            </div>
            <div className="ticket-acciones">
              {!p.pagado && <button onClick={() => handlePagar(p._id)}>Pagar</button>}
              <button onClick={() => handleBorrar(p._id)}>Borrar</button>
              <button onClick={() => setEditarId(p._id)}>Editar</button>
            </div>

            {editarId === p._id && (
              <div className="ticket-editar">
                <select
                  value={nuevoProducto || ""}
                  onChange={(e) => setNuevoProducto(e.target.value)}
                >
                  <option value="">Selecciona un producto</option>
                  {productosArray.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.nombre}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleEditar(p._id)}>Guardar</button>
                <button onClick={() => setEditarId(null)}>Cancelar</button>
              </div>
            )}
          </li>
        ))
      )}
    </ul>
  );
}
