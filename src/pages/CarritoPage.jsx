import { useState } from "react";
import "./../assets/css/Index.css";

export default function CarritoPage({ token, mensaje, carrito, productos, setCarrito, setView }) {
  const [editarId, setEditarId] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState("");

  const API = "http://localhost:3000";

  const cargarCarrito = async () => {
    const res = await fetch(`${API}/carrito`, {
      headers: { Authorization: "Bearer " + token },
    });
    setCarrito(await res.json());
  };

  const handleBorrarCarrito = async (id) => {
    await fetch(`${API}/carrito/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    cargarCarrito();
  };

  const handlePagar = async (id) => {
    await fetch(`${API}/carrito/pagar/${id}`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });
    cargarCarrito();
  };

  const handlePagarTodo = async () => {
    // Pagar todos los productos no pagados
    for (const p of carrito) {
      if (!p.pagado) {
        await fetch(`${API}/carrito/pagar/${p._id}`, {
          method: "PUT",
          headers: { Authorization: "Bearer " + token },
        });
      }
    }
    cargarCarrito();
  };

  const handleEditarCarrito = async (id) => {
    if (!nuevoProducto) return;
    await fetch(`${API}/carrito/editar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ nuevoProductoId: nuevoProducto }),
    });
    setEditarId(null);
    setNuevoProducto("");
    cargarCarrito();
  };

  // Calcular el total (solo de productos no pagados)
  const total = carrito
    .filter((p) => !p.pagado)
    .reduce((sum, p) => sum + p.precio, 0);

  return (
    <div className="carrito-container">
      <div className="carrito-menu-superior">
        <button className="carrito-menu-btn" onClick={() => setView("tienda")}>⬅ Volver a tienda</button>
      </div>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">No has añadido productos 🛒</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {carrito.map((p) => (
              <li key={p._id} className="carrito-item">
                <img
                  className="carrito-img"
                  src={`http://localhost:3000${p.imagen}`}
                  alt={p.nombre}
                />
                <div className="carrito-info">
                  <h4 className="carrito-nombre">{p.nombre}</h4>
                  <p className="carrito-precio">
                    {p.precio.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                  <span
                    className={
                      p.pagado ? "carrito-estado pagado" : "carrito-estado no-pagado"
                    }
                  >
                    {p.pagado ? "✅ Pagado" : "❌ No pagado"}
                  </span>
                </div>
                <div className="carrito-acciones">
                  {!p.pagado && (
                    <button
                      className="carrito-btn-pagar"
                      onClick={() => handlePagar(p._id)}
                    >
                      💳 Pagar
                    </button>
                  )}
                  <button
                    className="carrito-btn-borrar"
                    onClick={() => handleBorrarCarrito(p._id)}
                  >
                    🗑️ Borrar
                  </button>
                  <button
                    className="carrito-btn-editar"
                    onClick={() => setEditarId(p._id)}
                  >
                    ✏️ Editar
                  </button>
                </div>

                {editarId === p._id && (
                  <div className="carrito-editar">
                    <select
                      className="carrito-select"
                      value={nuevoProducto}
                      onChange={(e) => setNuevoProducto(e.target.value)}
                    >
                      <option value="">Selecciona un producto</option>
                      {productos.map((prod) => (
                        <option key={prod._id} value={prod._id}>
                          {prod.nombre}
                        </option>
                      ))}
                    </select>
                    <button className="carrito-btn-guardar" onClick={() => handleEditarCarrito(p._id)}>
                      Guardar
                    </button>
                    <button className="carrito-btn-cancelar" onClick={() => setEditarId(null)}>
                      Cancelar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* === Resumen del total === */}
          <div className="carrito-total">
            <p className="carrito-total-texto">
              Total a pagar:{" "}
              {total.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
            <button
              className="carrito-btn-pagar-todo"
              onClick={handlePagarTodo}
              disabled={total === 0}
            >
              💳 Pagar todo
            </button>
          </div>
        </>
      )}
    </div>
  );
}