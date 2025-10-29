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
  setCarrito,
}) {
  const API = import.meta.env.VITE_API_URL;

  // Convertir a arrays por si acaso
  const carritoArray = Array.isArray(carrito) ? carrito : [];
  const productosArray = Array.isArray(productos) ? productos : [];

  // Función para obtener la ruta de la imagen
  const obtenerRutaImagen = (imagen) => {
    if (!imagen) return "/fallback.jpg";
    if (imagen.startsWith("http")) return imagen;
    return `${API}${imagen}`;
  };

  // Función para actualizar cantidad en el servidor
  const actualizarCantidad = async (id, nuevaCantidad) => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/carrito/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });

      if (res.ok) {
        // Actualizar la lista local
        setCarrito((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, cantidad: nuevaCantidad } : p
          )
        );
      } else {
        const errorText = await res.text();
        console.error("Error del servidor:", errorText);
      }
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  // Aumentar cantidad
  const aumentarCantidad = (id, actual) => {
    const nuevaCantidad = actual + 1;
    actualizarCantidad(id, nuevaCantidad);
  };

  // Disminuir cantidad
  const disminuirCantidad = (id, actual) => {
    if (actual > 1) {
      const nuevaCantidad = actual - 1;
      actualizarCantidad(id, nuevaCantidad);
    }
  };

  return (
    <ul className="carrito-lista-tickets">
      {/* Mostrar mensaje si el carrito está vacío */}
      {carritoArray.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        // Mostrar lista de productos en el carrito
        carritoArray.map((p) => (
          <li key={p._id} className="ticket">
            {/* Imagen del producto */}
            <img src={obtenerRutaImagen(p.imagen)} alt={p.nombre} />
            <div className="ticket-info">
              {/* Nombre del producto */}
              <h4>{p.nombre}</h4>
              {/* Precio del producto */}
              <p>
                {(p.precio || 0).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>

              {/* Controles para cambiar cantidad */}
              <div className="cantidad-controles">
                <button onClick={() => disminuirCantidad(p._id, p.cantidad || 1)}>-</button>
                <span>{p.cantidad || 1}</span>
                <button onClick={() => aumentarCantidad(p._id, p.cantidad || 1)}>+</button>
              </div>

              {/* Estado de pago */}
              <span className={p.pagado ? "estado pagado" : "estado no-pagado"}>
                {p.pagado ? "Pagado" : "No pagado"}
              </span>
            </div>

            {/* Botones de acciones */}
            <div className="ticket-acciones">
              {/* Botón pagar solo si no está pagado */}
              {!p.pagado && (
                <button onClick={() => handlePagar(p._id)}>Pagar</button>
              )}
              <button onClick={() => handleBorrar(p._id)}>Borrar</button>
              <button onClick={() => setEditarId(p._id)}>Editar</button>
            </div>

            {/* Formulario de edición */}
            {editarId === p._id && (
              <div className="ticket-editar">
                <select
                  value={nuevoProducto || ""}
                  onChange={(e) => setNuevoProducto(e.target.value)}
                >
                  <option value="">Selecciona un producto</option>
                  {/* Lista de productos disponibles */}
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