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
  return (
    <ul className="carrito-lista-tickets">
      {carrito.map((p) => (
        <li key={p._id} className="ticket">
          <img src={`http://localhost:3000${p.imagen}`} alt={p.nombre} />
          <div className="ticket-info">
            <h4>{p.nombre}</h4>
            <p>
              {p.precio.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
            <span className={p.pagado ? "estado pagado" : "estado no-pagado"}>
              {p.pagado ? "✅ Pagado" : "❌ No pagado"}
            </span>
          </div>
          <div className="ticket-acciones">
            {!p.pagado && <button onClick={() => handlePagar(p._id)}>💳 Pagar</button>}
            <button onClick={() => handleBorrar(p._id)}>🗑️ Borrar</button>
            <button onClick={() => setEditarId(p._id)}>✏️ Editar</button>
          </div>
          {editarId === p._id && (
            <div className="ticket-editar">
              <select value={nuevoProducto} onChange={(e) => setNuevoProducto(e.target.value)}>
                <option value="">Selecciona un producto</option>
                {productos.map((prod) => (
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
      ))}
    </ul>
  );
}
