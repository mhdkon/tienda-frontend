export default function ProductoCard({ producto, onAñadir }) {
  return (
    <li className="producto-card">
      <img
        src={`http://localhost:3000${producto.imagen}`}
        alt={producto.nombre}
        onError={(e) => (e.target.src = "/fallback.jpg")}
      />
      <h4>{producto.nombre}</h4>
      <p>{producto.precio.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p>
      <button className="add" onClick={() => onAñadir(producto)}>
        Añadir al carrito
      </button>
    </li>
  );
}
