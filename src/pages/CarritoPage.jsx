import { useState, useEffect } from "react";
import "../assets/css/index.css";

function CarritoPage({ token, carrito, productos, setCarrito, setView, onCompraRealizada }) {
  const [editando, setEditando] = useState(null);
  const [tallaNueva, setTallaNueva] = useState("");
  const [mensajeCompra, setMensajeCompra] = useState("");
  const url = import.meta.env.VITE_API_URL;

  // Tallas disponibles para zapatos
  const tallasDisponibles = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

  useEffect(() => {
    if (token) obtenerCarrito();
    else setCarrito([]);
  }, []);

  const obtenerCarrito = async () => {
    try {
      const respuesta = await fetch(`${url}/carrito`, {
        headers: { Authorization: "Bearer " + token },
      });
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setCarrito(Array.isArray(datos) ? datos : []);
      }
    } catch (error) {
      console.log("Error al cargar carrito:", error);
    }
  };

  const cambiarCantidad = async (idProducto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    try {
      const respuesta = await fetch(`${url}/carrito/cantidad/${idProducto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });
      if (respuesta.ok) {
        const carritoActualizado = await respuesta.json();
        setCarrito(carritoActualizado);
      }
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  const aumentarCantidad = (id, cantidadAhora) => cambiarCantidad(id, cantidadAhora + 1);
  
  const disminuirCantidad = (id, cantidadAhora) => { 
    if (cantidadAhora > 1) cambiarCantidad(id, cantidadAhora - 1); 
  };

  const quitarProducto = async (id) => {
    try {
      const respuesta = await fetch(`${url}/carrito/${id}`, { 
        method: "DELETE", 
        headers: { Authorization: "Bearer " + token } 
      });
      if (respuesta.ok) setCarrito((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.log("Error al borrar producto:", error);
    }
  };

  const pagarProducto = async (id) => {
    try {
      const respuesta = await fetch(`${url}/carrito/pagar/${id}`, { 
        method: "PUT", 
        headers: { Authorization: "Bearer " + token } 
      });
      if (respuesta.ok) {
        setCarrito((prev) => prev.map((p) => (p._id === id ? { ...p, pagado: true } : p)));
      }
    } catch (error) {
      console.log("Error al pagar producto:", error);
    }
  };

  const pagarTodo = async () => {
    try {
      const respuesta = await fetch(`${url}/carrito/pagar-todo`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        setCarrito([]);
        // Mensaje sin emojis
        setMensajeCompra("Muchas gracias por tu compra");
        
        if (typeof onCompraRealizada === "function") {
          onCompraRealizada();
        }
        
        setTimeout(() => setMensajeCompra(""), 5000);
      }
    } catch (error) {
      console.log("Error al pagar todo:", error);
    }
  };

  const cambiarTalla = async (id) => {
    if (!tallaNueva) return;

    try {
      const respuesta = await fetch(`${url}/carrito/editar/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: "Bearer " + token 
        },
        body: JSON.stringify({ talla: tallaNueva }),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || "Error al cambiar talla");
      }

      // Actualizar el carrito localmente con la nueva talla
      setCarrito((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, talla: tallaNueva } : p
        )
      );
      setEditando(null);
      setTallaNueva("");
      
    } catch (error) {
      console.log("Error al cambiar talla:", error);
      alert("Error: " + error.message);
    }
  };

  const iniciarEdicionTalla = (producto) => {
    setEditando(producto._id);
    setTallaNueva(producto.talla || "");
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setTallaNueva("");
  };

  const totalPagar = (carrito || []).reduce((total, producto) => {
    if (!producto.pagado) return total + (producto.precio || 0) * (producto.cantidad || 1);
    return total;
  }, 0);

  return (
    <div className="carrito-container">
      <div className="carrito-menu-superior">
        <h3>Mi Carrito</h3>
        <button className="carrito-menu-btn" onClick={() => setView("tienda")}>
          ← Volver a tienda
        </button>
      </div>

      {mensajeCompra && <div className="mensaje-compra">{mensajeCompra}</div>}

      {(carrito || []).length === 0 ? (
        <p className="carrito-vacio">No hay productos en el carrito</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {(carrito || []).map((producto) => {
              const cantidad = producto.cantidad || 1;
              const tallaActual = producto.talla || "No especificada";
              
              return (
                <li key={producto._id} className="carrito-item">
                  <img 
                    className="carrito-img" 
                    src={producto.imagen?.startsWith("http") ? producto.imagen : `${url}${producto.imagen}`} 
                    alt={producto.nombre} 
                  />
                  <div className="carrito-info">
                    <h4 className="carrito-nombre">{producto.nombre}</h4>
                    <p className="carrito-precio">
                      {(producto.precio || 0).toLocaleString("es-ES", { 
                        style: "currency", 
                        currency: "EUR" 
                      })}
                    </p>
                    <div className="carrito-detalles">
                      <div className="carrito-cantidad-info">Cantidad: {cantidad}</div>
                      <div className="carrito-talla-info">
                        Talla: <strong>{tallaActual}</strong>
                      </div>
                    </div>
                    <span className={producto.pagado ? "carrito-estado pagado" : "carrito-estado no-pagado"}>
                      {producto.pagado ? "Pagado" : "No pagado"}
                    </span>
                  </div>

                  <div className="carrito-acciones">
                    <div className="controles-cantidad">
                      <button 
                        className="btn-restar" 
                        onClick={() => disminuirCantidad(producto._id, cantidad)} 
                        disabled={producto.pagado}
                      >
                        -
                      </button>
                      <span className="cantidad-numero">{cantidad}</span>
                      <button 
                        className="btn-sumar" 
                        onClick={() => aumentarCantidad(producto._id, cantidad)} 
                        disabled={producto.pagado}
                      >
                        +
                      </button>
                    </div>

                    {!producto.pagado && (
                      <button 
                        className="carrito-btn-pagar" 
                        onClick={() => pagarProducto(producto._id)}
                      >
                        Pagar
                      </button>
                    )}
                    <button 
                      className="carrito-btn-borrar" 
                      onClick={() => quitarProducto(producto._id)}
                    >
                      Borrar
                    </button>
                    <button 
                      className="carrito-btn-editar" 
                      onClick={() => iniciarEdicionTalla(producto)}
                      disabled={producto.pagado}
                    >
                      Cambiar Talla
                    </button>
                  </div>

                  {editando === producto._id && (
                    <div className="carrito-editar">
                      <h4>Cambiar talla para: {producto.nombre}</h4>
                      <div className="talla-seleccion">
                        <select 
                          className="carrito-select" 
                          value={tallaNueva} 
                          onChange={(e) => setTallaNueva(e.target.value)}
                        >
                          <option value="">Selecciona talla</option>
                          {tallasDisponibles.map((talla) => (
                            <option key={talla} value={talla}>
                              Talla {talla}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="talla-acciones">
                        <button 
                          className="carrito-btn-guardar" 
                          onClick={() => cambiarTalla(producto._id)}
                          disabled={!tallaNueva}
                        >
                          Guardar
                        </button>
                        <button 
                          className="carrito-btn-cancelar" 
                          onClick={cancelarEdicion}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="carrito-total">
            <p className="carrito-total-texto">
              Total a pagar: {totalPagar.toLocaleString("es-ES", { 
                style: "currency", 
                currency: "EUR" 
              })}
            </p>
            <button 
              className="carrito-btn-pagar-todo" 
              onClick={pagarTodo} 
              disabled={totalPagar === 0}
            >
              Pagar todo
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CarritoPage;