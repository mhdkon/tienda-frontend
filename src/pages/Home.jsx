import { useState, useEffect } from "react";
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
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [contadorAñadidos, setContadorAñadidos] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);
  const [imagenGrande, setImagenGrande] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const obtenerRutaImagen = (imagen) => {
    if (!imagen) return `${API}/fallback.jpg`;
    if (imagen.startsWith("http")) return imagen;
    return `${API}${imagen}`;
  };

  const onLoginSuccess = (token, mensaje) => {
    setToken(token);
    setMensaje(mensaje);
    setView("tienda");
    cargarProductos(token);
    cargarCarrito(token);
  };

  const cargarProductos = async (token) => {
    try {
      const res = await fetch(`${API}/productos`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      setProductos(data);
      setProductosFiltrados(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const cargarCarrito = async (token) => {
    try {
      const res = await fetch(`${API}/carrito`, {
        headers: { Authorization: "Bearer " + token },
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          setCarrito([]);
          setContadorAñadidos(0);
          return;
        }
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setCarrito(data);
        setContadorAñadidos(data.length);
      } else {
        setCarrito([]);
        setContadorAñadidos(0);
      }
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      setCarrito([]);
      setContadorAñadidos(0);
    }
  };

  // ✅ FUNCIÓN CORREGIDA: Añadir producto al carrito
  const handleAñadirCarrito = async (idProducto) => {
    try {
      console.log("🛒 Añadiendo producto ID:", idProducto);
      
      const response = await fetch(`${API}/carrito/${idProducto}`, {
        method: "POST",
        headers: { 
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productoId: idProducto,
          cantidad: 1,
          talla: "38" // ✅ AÑADIDO: Talla por defecto requerida por el backend
        })
      });

      console.log("📡 Response status:", response.status);

      if (response.status === 401) {
        alert("No autorizado. Por favor, inicia sesión nuevamente.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const resultado = await response.json();
      console.log("✅ Producto añadido:", resultado);
      
      // Recargar el carrito después de añadir
      await cargarCarrito(token);
      
    } catch (error) {
      console.error("❌ Error al añadir al carrito:", error);
      alert(`Error al añadir producto: ${error.message}`);
    }
  };

  const handleCompraRealizada = () => {
    setContadorAñadidos(0);
    cargarCarrito(token);
  };

  const handleLogoutConfirmado = () => {
    setToken("");
    setMensaje("");
    setCarrito([]);
    setProductos([]);
    setProductosFiltrados([]);
    setContadorAñadidos(0);
    setTerminoBusqueda("");
    setMostrandoResultados(false);
    setView("menu");
    setMostrarModal(false);
  };

  const handleClickImagen = (imagen) => setImagenGrande(obtenerRutaImagen(imagen));
  const cerrarImagen = () => setImagenGrande("");

  const handleBuscar = async () => {
    if (!terminoBusqueda.trim()) return alert("Por favor ingresa un término de búsqueda");
    setBuscando(true);
    try {
      const res = await fetch(
        `${API}/productos/buscar?nombre=${encodeURIComponent(terminoBusqueda)}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (!res.ok) throw new Error("Error en la búsqueda");
      const resultados = await res.json();
      setProductosFiltrados(resultados);
      setMostrandoResultados(true);
    } catch (error) {
      console.error(error);
      alert("Error al buscar productos");
    } finally {
      setBuscando(false);
    }
  };

  const limpiarBusqueda = () => {
    setTerminoBusqueda("");
    setProductosFiltrados(productos);
    setMostrandoResultados(false);
    setBuscando(false);
  };

  useEffect(() => {
    if (token) {
      cargarProductos(token);
      cargarCarrito(token);
    }
  }, [token]);

  // --- Vistas ---
  if (view === "menu")
    return (
      <div className="menu-inicial container">
        <h1>¡Bienvenido a Solex! Donde cada paso tiene flow.</h1>
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
          <h2>Solex</h2>
          <h3>{mensaje}</h3>

          <div className="buscador-menu">
            <input
              type="text"
              placeholder="Buscar zapatos..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleBuscar()}
              className="input-busqueda-menu"
              disabled={buscando}
            />
            <button
              onClick={handleBuscar}
              className="btn-buscar-menu"
              disabled={buscando || !terminoBusqueda.trim()}
            >
              {buscando ? "Buscando..." : "Buscar"}
            </button>
            {terminoBusqueda && (
              <button
                onClick={limpiarBusqueda}
                className="btn-limpiar-menu"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          <button onClick={() => setMostrarModal(true)}>Cerrar sesión</button>
          <button onClick={() => setView("carritoAñadidos")}>
            {contadorAñadidos > 0 ? `Carrito (${contadorAñadidos})` : "Carrito"}
          </button>
        </div>

        {mostrandoResultados && (
          <div className="info-busqueda">
            <button onClick={limpiarBusqueda} className="btn-limpiar">
              Ver todos los productos
            </button>
          </div>
        )}

        <h3>{mostrandoResultados ? "Resultados de búsqueda:" : "Productos de la tienda:"}</h3>

        {productosFiltrados.length > 0 ? (
          <ul className="productos">
            {productosFiltrados.map((p) => (
              <ProductoCard
                key={p.id}
                producto={p}
                onAñadir={handleAñadirCarrito}
                onClickImagen={handleClickImagen}
              />
            ))}
          </ul>
        ) : (
          <div className="sin-resultados">
            <p>
              {mostrandoResultados
                ? "No se encontraron productos que coincidan con tu búsqueda."
                : "No hay productos disponibles."}
            </p>
            {mostrandoResultados && (
              <button onClick={limpiarBusqueda} className="btn-limpiar">
                Ver todos los productos
              </button>
            )}
          </div>
        )}

        {mostrarModal && (
          <div className="modal">
            <div className="modal-contenido">
              <h3>¿Seguro que quieres cerrar sesión?</h3>
              <button className="confirmar" onClick={handleLogoutConfirmado}>
                Sí, cerrar
              </button>
              <button className="cancelar" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {imagenGrande && (
          <div className="imagen-modal" onClick={cerrarImagen}>
            <div className="imagen-modal-contenido" onClick={(e) => e.stopPropagation()}>
              <button className="cerrar-imagen" onClick={cerrarImagen}>
                ×
              </button>
              <img src={imagenGrande} alt="Producto" />
            </div>
          </div>
        )}
      </div>
    );

  if (view === "carritoAñadidos")
    return (
      <CarritoPage
        token={token}
        carrito={carrito}
        productos={productos}
        setCarrito={setCarrito}
        setView={setView}
        onCompraRealizada={handleCompraRealizada}
      />
    );
}