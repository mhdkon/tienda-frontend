import { useState } from "react";

export default function CarritoPage({ token, mensaje, carrito, productos, setCarrito, setView }) {
  const [editarId, setEditarId] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState("");

  const API = "http://localhost:3000";

  const cargarCarrito = async () => {
    const res = await fetch(`${API}/carrito`, { headers: { Authorization: "Bearer " + token } });
    setCarrito(await res.json());
  };

  const handleBorrarCarrito = async (id) => {
    await fetch(`${API}/carrito/${id}`, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
    cargarCarrito();
  };

  const handlePagar = async (id) => {
    await fetch(`${API}/carrito/pagar/${id}`, { method: "PUT", headers: { Authorization: "Bearer " + token } });
    cargarCarrito();
  };

  const handleEditarCarrito = async (id) => {
    if (!nuevoProducto) return;
    await fetch(`${API}/carrito/editar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ nuevoProductoId: nuevoProducto }),
    });
    setEditarId(null); setNuevoProducto(""); cargarCarrito();
  };

  return (
    <div className="container">
      <div className="menu-superior">
        <h3>{mensaje}</h3>
        <button onClick={() => setView("tienda")}>⬅ Volver a tienda</button>
      </div>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">No has añadido productos 🛒</p>
      ) : (
        <ul className="carrito-lista-tickets">
          {carrito.map((p) => (
            <li key={p._id} className="ticket">
              <img src={`http://localhost:3000${p.imagen}`} alt={p.nombre} />
              <div className="ticket-info">
                <h4>{p.nombre}</h4>
                <p>{p.precio.toLocaleString("es-ES",{ style:"currency", currency:"EUR" })}</p>
                <span className={p.pagado?"estado pagado":"estado no-pagado"}>{p.pagado?"✅ Pagado":"❌ No pagado"}</span>
              </div>
              <div className="ticket-acciones">
                {!p.pagado && <button onClick={()=>handlePagar(p._id)}>💳 Pagar</button>}
                <button onClick={()=>handleBorrarCarrito(p._id)}>🗑️ Borrar</button>
                <button onClick={()=>setEditarId(p._id)}>✏️ Editar</button>
              </div>
              {editarId===p._id && (
                <div className="ticket-editar">
                  <select value={nuevoProducto} onChange={e=>setNuevoProducto(e.target.value)}>
                    <option value="">Selecciona un producto</option>
                    {productos.map(prod=>(<option key={prod._id} value={prod._id}>{prod.nombre}</option>))}
                  </select>
                  <button onClick={()=>handleEditarCarrito(p._id)}>Guardar</button>
                  <button onClick={()=>setEditarId(null)}>Cancelar</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
