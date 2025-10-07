import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import CarritoPage from "./CarritoPage";
import ProductoCard from "../components/ProductoCard";
import "./../assets/css/Tienda.css";

export default function Home() {
  const [view, setView] = useState("menu");
  const [token, setToken] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [contadorAñadidos, setContadorAñadidos] = useState(0);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const API = "http://localhost:3000";

  const onLoginSuccess = (token, mensaje) => {
    setToken(token);
    setMensaje(mensaje);
    setView("tienda");
    cargarProductos(token);
    cargarCarrito(token);
  };

  const cargarProductos = async (token) => {
    const res = await fetch(`${API}/productos`, {
      headers: { Authorization: "Bearer " + token },
    });
    setProductos(await res.json());
  };

  const cargarCarrito = async (token) => {
    const res = await fetch(`${API}/carrito`, {
      headers: { Authorization: "Bearer " + token },
    });
    setCarrito(await res.json());
  };

  const handleAñadirCarrito = async (p) => {
    await fetch(`${API}/carrito/${p._id}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    });
    cargarCarrito(token);
    setContadorAñadidos((prev) => prev + 1);
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  };

  const handleLogoutConfirmado = () => {
    setToken("");
    setMensaje("");
    setCarrito([]);
    setProductos([]);
    setContadorAñadidos(0);
    setView("menu");
    setMostrarModal(false);
  };

  // --- Vistas ---
  if (view === "menu")
    return (
      <div className="menu-inicial container">
        <h1>🛍️ Bienvenido a la Tienda de Zapatos</h1>
        <button onClick={() => setView("login")}>Iniciar sesión</button>
        <button onClick={() => setView("register")}>Registrarse</button>
      </div>
    );

  if (view === "login") return <Login onLoginSuccess={onLoginSuccess} setView={setView} />;
  if (view === "register") return <Register setView={setView} />;

  if (view === "tienda")
    return (
      <div className="container">
        <div className="menu-superior">
          <h3>{mensaje}</h3>
          <button onClick={() => setMostrarModal(true)}>🚪 Cerrar sesión</button>
          <button onClick={() => setView("carritoAñadidos")}>
            🛒 {contadorAñadidos} productos añadidos
          </button>
        </div>

        <h3>🛒 Productos de la tienda:</h3>
        <ul className="productos">
          {productos.map((p) => (
            <ProductoCard key={p._id} producto={p} onAñadir={handleAñadirCarrito} />
          ))}
        </ul>

        {mostrarToast && (
          <div className="toast-anadido" onClick={() => setView("carritoAñadidos")}>
            ✅ Producto añadido – Ver carrito
          </div>
        )}

        {mostrarModal && (
          <div className="modal">
            <div className="modal-contenido">
              <h3>¿Seguro que quieres cerrar sesión?</h3>
              <button className="confirmar" onClick={handleLogoutConfirmado}>
                Sí, cerrar
              </button>
              <button className="cancelar" onClick={() => setMostrarModal(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    );

  if (view === "carritoAñadidos")
    return (
      <CarritoPage
        token={token}
        mensaje={mensaje}
        carrito={carrito}
        productos={productos}
        setCarrito={setCarrito}
        setView={setView}
      />
    );
}
