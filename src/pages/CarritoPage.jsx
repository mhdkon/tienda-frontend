import { useState, useEffect } from "react";
import "../assets/css/index.css";

function CarritoPage({ token, carrito, productos, setCarrito, setView, onCompraRealizada }) {
  const [editando, setEditando] = useState(null);
  const [tallaNueva, setTallaNueva] = useState("");
  const [mensajeCompra, setMensajeCompra] = useState("");
  const [cargando, setCargando] = useState(false);
  const [eliminandoItem, setEliminandoItem] = useState(null);
  const [actualizandoCantidad, setActualizandoCantidad] = useState(null);
  const [editandoTallaItem, setEditandoTallaItem] = useState(null);
  const url = import.meta.env.VITE_API_URL;

  // Tallas disponibles para zapatos
  const tallasDisponibles = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

  useEffect(() => {
    if (token) obtenerCarrito();
  }, [token]);

  const obtenerCarrito = async () => {
    try {
      const respuesta = await fetch(`${url}/carrito`, {
        headers: { Authorization: "Bearer " + token },
      });
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setCarrito(Array.isArray(datos) ? datos : []);
      } else if (respuesta.status === 401) {
        setCarrito([]);
      }
    } catch (error) {
      setCarrito([]);
    }
  };

  const cambiarCantidad = async (idProducto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setActualizandoCantidad(idProducto);
    try {
      const respuesta = await fetch(`${url}/carrito/cantidad/${idProducto}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: "Bearer " + token 
        },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });
      
      if (!respuesta.ok) return;

      const carritoActualizado = await respuesta.json();
      setCarrito(carritoActualizado);
    } catch (error) {
      // Error silencioso
    } finally {
      setActualizandoCantidad(null);
    }
  };

  const aumentarCantidad = (id, cantidadAhora) => cambiarCantidad(id, cantidadAhora + 1);
  
  const disminuirCantidad = (id, cantidadAhora) => { 
    if (cantidadAhora > 1) cambiarCantidad(id, cantidadAhora - 1); 
  };

  const quitarProducto = async (id) => {
    setEliminandoItem(id);
    
    // Eliminación inmediata del estado local
    const productoEliminado = carrito.find(p => p.id === id);
    setCarrito(prev => prev.filter(p => p.id !== id));
    
    try {
      const respuesta = await fetch(`${url}/carrito/${id}`, { 
        method: "DELETE", 
        headers: { Authorization: "Bearer " + token } 
      });
      
      if (!respuesta.ok) {
        // Si falla en el servidor, revertir el cambio local
        setCarrito(prev => [...prev, productoEliminado]);
        alert("Error al eliminar producto");
      }
    } catch (error) {
      // Si hay error de red, revertir el cambio local
      setCarrito(prev => [...prev, productoEliminado]);
    } finally {
      setEliminandoItem(null);
    }
  };

  const pagarTodo = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch(`${url}/carrito/pagar-todo`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
      });

      if (!respuesta.ok) return;

      const data = await respuesta.json();
      setCarrito([]);
      setMensajeCompra(data.mensaje || "Muchas gracias por tu compra");
      
      if (typeof onCompraRealizada === "function") {
        onCompraRealizada();
      }
      
      setTimeout(() => {
        setMensajeCompra("");
        setView("tienda");
      }, 2000);
    } catch (error) {
      alert("Error al procesar el pago");
    } finally {
      setCargando(false);
    }
  };

  const cambiarTalla = async (id) => {
    if (!tallaNueva) return;

    setEditandoTallaItem(id);
    try {
      const respuesta = await fetch(`${url}/carrito/talla/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: "Bearer " + token 
        },
        body: JSON.stringify({ talla: tallaNueva }),
      });

      if (!respuesta.ok) return;

      const carritoActualizado = await respuesta.json();
      setCarrito(carritoActualizado);
      setEditando(null);
      setTallaNueva("");
      
    } catch (error) {
      alert("Error al cambiar talla");
    } finally {
      setEditandoTallaItem(null);
    }
  };

  const iniciarEdicionTalla = (producto) => {
    setEditando(producto.id);
    setTallaNueva(producto.talla || "38");
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setTallaNueva("");
  };

  const obtenerRutaImagen = (imagen) => {
    if (!imagen) return `${url}/fallback.jpg`;
    if (imagen.startsWith("http")) return imagen;
    return `${url}${imagen}`;
  };

  const totalPagar = () => {
    if (!carrito || !Array.isArray(carrito)) return 0;
    return carrito.reduce((total, producto) => {
      return total + (parseFloat(producto.precio) || 0) * (producto.cantidad || 1);
    }, 0);
  };

  const estaEliminando = (id) => eliminandoItem === id;
  const estaActualizandoCantidad = (id) => actualizandoCantidad === id;
  const estaEditandoTalla = (id) => editandoTallaItem === id;
  const carritoVacio = !carrito || carrito.length === 0;

  return (
    <div className="carrito-container">
      <div className="carrito-menu-superior">
        <h3>Mi Carrito</h3>
        <button 
          className="carrito-menu-btn" 
          onClick={() => setView("tienda")}
          disabled={cargando}
        >
          ← Volver a tienda
        </button>
      </div>

      {mensajeCompra && (
        <div className="mensaje-compra">
          {mensajeCompra}
        </div>
      )}

      {carritoVacio ? (
        <div className="carrito-vacio">
          <p>No hay productos en el carrito</p>
        </div>
      ) : (
        <>
          <ul className="carrito-lista">
            {carrito.map((producto) => {
              const cantidad = producto.cantidad || 1;
              const tallaActual = producto.talla || "No especificada";
              const eliminando = estaEliminando(producto.id);
              const actualizandoCant = estaActualizandoCantidad(producto.id);
              const editandoTalla = estaEditandoTalla(producto.id);
              
              return (
                <li key={producto.id} className="carrito-item">
                  <img 
                    className="carrito-img" 
                    src={obtenerRutaImagen(producto.imagen)} 
                    alt={producto.nombre}
                    onError={(e) => {
                      e.target.src = `${url}/fallback.jpg`;
                    }}
                  />
                  <div className="carrito-info">
                    <h4 className="carrito-nombre">{producto.nombre}</h4>
                    <p className="carrito-precio">
                      {parseFloat(producto.precio || 0).toLocaleString("es-ES", { 
                        style: "currency", 
                        currency: "EUR" 
                      })}
                    </p>
                    <div className="carrito-detalles">
                      <div className="carrito-cantidad-info">
                        Cantidad: {cantidad}
                        {actualizandoCant && <span className="cargando-texto"> (Actualizando...)</span>}
                      </div>
                      <div className="carrito-talla-info">
                        Talla: <strong>{tallaActual}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="carrito-acciones">
                    <div className="controles-cantidad">
                      <button 
                        className="btn-restar" 
                        onClick={() => disminuirCantidad(producto.id, cantidad)} 
                        disabled={actualizandoCant || eliminando || editandoTalla || cantidad <= 1}
                      >
                        -
                      </button>
                      <span className="cantidad-numero">{cantidad}</span>
                      <button 
                        className="btn-sumar" 
                        onClick={() => aumentarCantidad(producto.id, cantidad)} 
                        disabled={actualizandoCant || eliminando || editandoTalla}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      className="carrito-btn-borrar" 
                      onClick={() => quitarProducto(producto.id)}
                      disabled={actualizandoCant || eliminando || editandoTalla || cargando}
                    >
                      {eliminando ? "Eliminando..." : "Eliminar"}
                    </button>
                    
                    <button 
                      className="carrito-btn-editar" 
                      onClick={() => iniciarEdicionTalla(producto)}
                      disabled={actualizandoCant || eliminando || editandoTalla || cargando}
                    >
                      {editandoTalla ? "Editando..." : "Cambiar Talla"}
                    </button>
                  </div>

                  {editando === producto.id && (
                    <div className="carrito-editar">
                      <h4>Cambiar talla para: {producto.nombre}</h4>
                      <div className="talla-seleccion">
                        <select 
                          className="carrito-select" 
                          value={tallaNueva} 
                          onChange={(e) => setTallaNueva(e.target.value)}
                          disabled={editandoTalla}
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
                          onClick={() => cambiarTalla(producto.id)}
                          disabled={editandoTalla || !tallaNueva}
                        >
                          {editandoTalla ? "Guardando..." : "Guardar"}
                        </button>
                        <button 
                          className="carrito-btn-cancelar" 
                          onClick={cancelarEdicion}
                          disabled={editandoTalla}
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
              Total a pagar: {totalPagar().toLocaleString("es-ES", { 
                style: "currency", 
                currency: "EUR" 
              })}
            </p>
            <button 
              className="carrito-btn-pagar-todo" 
              onClick={pagarTodo} 
              disabled={cargando || totalPagar() === 0}
            >
              {cargando ? "Procesando..." : "Pagar Todo"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CarritoPage;