import { useState, useEffect } from "react";
import "../assets/css/index.css";

function CarritoPage({ token, carrito, productos, setCarrito, setView, onCompraRealizada }) {
  const [editando, setEditando] = useState(null);
  const [tallaNueva, setTallaNueva] = useState("");
  const [mensajeCompra, setMensajeCompra] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoItem, setCargandoItem] = useState(null);
  const url = import.meta.env.VITE_API_URL;

  // Tallas disponibles para zapatos
  const tallasDisponibles = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

  useEffect(() => {
    if (token) obtenerCarrito();
    else setCarrito([]);
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
        console.log("No autorizado - carrito vacío");
        setCarrito([]);
      }
    } catch (error) {
      console.log("Error al cargar carrito:", error);
      setCarrito([]);
    }
  };

  const cambiarCantidad = async (idProducto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setCargandoItem(idProducto);
    try {
      const respuesta = await fetch(`${url}/carrito/cantidad/${idProducto}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: "Bearer " + token 
        },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });
      
      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || "Error al actualizar cantidad");
      }

      const carritoActualizado = await respuesta.json();
      setCarrito(carritoActualizado);
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      alert(error.message);
    } finally {
      setCargandoItem(null);
    }
  };

  const aumentarCantidad = (id, cantidadAhora) => cambiarCantidad(id, cantidadAhora + 1);
  
  const disminuirCantidad = (id, cantidadAhora) => { 
    if (cantidadAhora > 1) cambiarCantidad(id, cantidadAhora - 1); 
  };

  const quitarProducto = async (id) => {
    setCargandoItem(id);
    try {
      const respuesta = await fetch(`${url}/carrito/${id}`, { 
        method: "DELETE", 
        headers: { Authorization: "Bearer " + token } 
      });
      
      if (respuesta.ok) {
        // Actualizar carrito localmente filtrando el producto eliminado
        setCarrito((prev) => (prev || []).filter((p) => p.id !== id));
        
        if (typeof onCompraRealizada === "function") {
          onCompraRealizada();
        }
      } else {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || "Error al eliminar producto");
      }
    } catch (error) {
      console.log("Error al borrar producto:", error);
      alert(error.message);
    } finally {
      setCargandoItem(null);
    }
  };

  const pagarTodo = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch(`${url}/carrito/pagar-todo`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || "Error al procesar pago");
      }

      const data = await respuesta.json();
      setCarrito([]);
      setMensajeCompra(data.mensaje || "Muchas gracias por tu compra");
      
      if (typeof onCompraRealizada === "function") {
        onCompraRealizada();
      }
      
      setTimeout(() => {
        setMensajeCompra("");
        setView("tienda");
      }, 3000);
    } catch (error) {
      console.log("Error al pagar todo:", error);
      alert(error.message);
    } finally {
      setCargando(false);
    }
  };

  const cambiarTalla = async (id) => {
    if (!tallaNueva) return;

    setCargandoItem(id);
    try {
      const respuesta = await fetch(`${url}/carrito/talla/${id}`, {
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

      const carritoActualizado = await respuesta.json();
      setCarrito(carritoActualizado);
      setEditando(null);
      setTallaNueva("");
      
    } catch (error) {
      console.log("Error al cambiar talla:", error);
      alert("Error: " + error.message);
    } finally {
      setCargandoItem(null);
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

  // ✅ CORREGIDO: Manejo seguro del carrito
  const totalPagar = () => {
    if (!carrito || !Array.isArray(carrito)) return 0;
    return carrito.reduce((total, producto) => {
      return total + (parseFloat(producto.precio) || 0) * (producto.cantidad || 1);
    }, 0);
  };

  // Función para verificar si un item está cargando
  const estaCargando = (id) => cargandoItem === id;

  // ✅ CORREGIDO: Verificación segura del carrito
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
          <button 
            onClick={() => setView("tienda")}
            disabled={cargando}
          >
          </button>
        </div>
      ) : (
        <>
          <ul className="carrito-lista">
            {carrito.map((producto) => {
              const cantidad = producto.cantidad || 1;
              const tallaActual = producto.talla || "No especificada";
              const itemCargando = estaCargando(producto.id);
              
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
                        {itemCargando && <span className="cargando-texto"> (Actualizando...)</span>}
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
                        disabled={itemCargando || cantidad <= 1}
                      >
                        -
                      </button>
                      <span className="cantidad-numero">{cantidad}</span>
                      <button 
                        className="btn-sumar" 
                        onClick={() => aumentarCantidad(producto.id, cantidad)} 
                        disabled={itemCargando}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      className="carrito-btn-borrar" 
                      onClick={() => quitarProducto(producto.id)}
                      disabled={itemCargando || cargando}
                    >
                      {itemCargando ? "Eliminando..." : "Eliminar"}
                    </button>
                    
                    <button 
                      className="carrito-btn-editar" 
                      onClick={() => iniciarEdicionTalla(producto)}
                      disabled={itemCargando || cargando}
                    >
                      Cambiar Talla
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
                          disabled={cargandoItem === producto.id}
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
                          disabled={cargandoItem === producto.id || !tallaNueva}
                        >
                          {cargandoItem === producto.id ? "Guardando..." : "Guardar"}
                        </button>
                        <button 
                          className="carrito-btn-cancelar" 
                          onClick={cancelarEdicion}
                          disabled={cargandoItem === producto.id}
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