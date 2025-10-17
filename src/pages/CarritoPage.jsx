import { useState, useEffect } from "react";
import "../assets/css/index.css"; 

function CarritoPage({ token, carrito, productos, setCarrito, setView }) {
  const [editando, setEditando] = useState(null);
  const [productoNuevo, setProductoNuevo] = useState("");
  const url = import.meta.env.VITE_API_URL;


  // Cargar el carrito al abrir la página
  useEffect(() => {
    if (token) {
      obtenerCarrito();
    } else {
      setCarrito([]);
    }
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

  // Cambiar cantidad localmente
  const cambiarCantidad = (idProducto, nuevaCantidad) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p._id === idProducto ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
  };

  const aumentarCantidad = (idProducto, cantidadAhora) => {
    cambiarCantidad(idProducto, cantidadAhora + 1);
  };

  const disminuirCantidad = (idProducto, cantidadAhora) => {
    if (cantidadAhora > 1) {
      cambiarCantidad(idProducto, cantidadAhora - 1);
    }
  };

  // Quitar producto
  const quitarProducto = async (id) => {
    try {
      const respuesta = await fetch(`${url}/carrito/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (respuesta.ok) {
        setCarrito((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.log("Error al borrar producto:", error);
    }
  };

  // Pagar un producto
  const pagarProducto = async (id) => {
    try {
      const respuesta = await fetch(`${url}/carrito/pagar/${id}`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
      });
      if (respuesta.ok) {
        setCarrito((prev) =>
          prev.map((p) => (p._id === id ? { ...p, pagado: true } : p))
        );
      }
    } catch (error) {
      console.log("Error al pagar producto:", error);
    }
  };

  // Pagar todo
  const pagarTodo = async () => {
    try {
      for (const producto of carrito || []) {
        if (!producto.pagado) {
          await fetch(`${url}/carrito/pagar/${producto._id}`, {
            method: "PUT",
            headers: { Authorization: "Bearer " + token },
          });
        }
      }
      setCarrito((prev) =>
        prev.map((p) => (!p.pagado ? { ...p, pagado: true } : p))
      );
    } catch (error) {
      console.log("Error al pagar todo:", error);
    }
  };

  // Cambiar producto
  const cambiarProducto = async (id) => {
    if (!productoNuevo) return;
    try {
      const respuesta = await fetch(`${url}/carrito/editar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ nuevoProductoId: productoNuevo }),
      });

      if (respuesta.ok) {
        const nuevoProd = productos.find((p) => p._id === productoNuevo);
        if (nuevoProd) {
          setCarrito((prev) =>
            prev.map((p) =>
              p._id === id
                ? { ...nuevoProd, cantidad: p.cantidad || 1, pagado: false }
                : p
            )
          );
        }
        setEditando(null);
        setProductoNuevo("");
      }
    } catch (error) {
      console.log("Error al cambiar producto:", error);
    }
  };

  const totalPagar = (carrito || []).reduce((total, producto) => {
    if (!producto.pagado) {
      const cantidad = producto.cantidad || 1;
      return total + (producto.precio || 0) * cantidad;
    }
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

      {(carrito || []).length === 0 ? (
        <p className="carrito-vacio">No hay productos en el carrito</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {(carrito || []).map((producto) => {
              const cantidad = producto.cantidad || 1;
              return (
                <li key={producto._id} className="carrito-item">
                  <img
                    className="carrito-img"
                    src={`import.meta.env.VITE_API_URL${producto.imagen}`}
                    alt={producto.nombre}
                  />
                  <div className="carrito-info">
                    <h4 className="carrito-nombre">{producto.nombre}</h4>
                    <p className="carrito-precio">
                      {(producto.precio || 0).toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </p>
                    <div className="carrito-cantidad-info">
                      Cantidad: {cantidad}
                    </div>
                    <span
                      className={
                        producto.pagado
                          ? "carrito-estado pagado"
                          : "carrito-estado no-pagado"
                      }
                    >
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
                      onClick={() => setEditando(producto._id)}
                    >
                      Editar
                    </button>
                  </div>

                  {editando === producto._id && (
                    <div className="carrito-editar">
                      <select
                        className="carrito-select"
                        value={productoNuevo}
                        onChange={(e) => setProductoNuevo(e.target.value)}
                      >
                        <option value="">Elegir producto</option>
                        {(productos || []).map((prod) => (
                          <option key={prod._id} value={prod._id}>
                            {prod.nombre}
                          </option>
                        ))}
                      </select>
                      <button
                        className="carrito-btn-guardar"
                        onClick={() => cambiarProducto(producto._id)}
                      >
                        Guardar
                      </button>
                      <button
                        className="carrito-btn-cancelar"
                        onClick={() => setEditando(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="carrito-total">
            <p className="carrito-total-texto">
              Total a pagar:{" "}
              {totalPagar.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
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
