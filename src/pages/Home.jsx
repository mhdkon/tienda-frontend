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
  const [mostrarToast, setMostrarToast] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);

  const [imagenGrande, setImagenGrande] = useState("");

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
    const data = await res.json();
    setProductos(data);
    setProductosFiltrados(data);
  };

  const cargarCarrito = async (token) => {
    const res = await fetch(`${API}/carrito`, {
      headers: { Authorization: "Bearer " + token },
    });
    setCarrito(await res.json());
  };

  const handleBuscar = async () => {
    if (!terminoBusqueda.trim()) {
      alert('Por favor ingresa un término de búsqueda');
      return;
    }

    setBuscando(true);
    
    try {
      // ✅ CORRECCIÓN: Cambia /buscar por /productos/buscar
      const res = await fetch(`${API}/productos/buscar?nombre=${encodeURIComponent(terminoBusqueda)}`, {
        headers: { Authorization: "Bearer " + token },
      });
      
      if (!res.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const resultados = await res.json();
      setProductosFiltrados(resultados);
      setMostrandoResultados(true);
      
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      alert('Error al buscar productos');
    } finally {
      setBuscando(false);
    }
  };

  const limpiarBusqueda = () => {
    setTerminoBusqueda("");
    setProductosFiltrados(productos);
    setMostrandoResultados(false);
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
    setProductosFiltrados([]);
    setContadorAñadidos(0);
    setTerminoBusqueda("");
    setMostrandoResultados(false);
    setView("menu");
    setMostrarModal(false);
  };

  const handleClickImagen = (src) => {
    setImagenGrande(src);
  };

  const cerrarImagen = () => {
    setImagenGrande("");
  };

  // Efecto para cargar productos cuando cambia el token
  useEffect(() => {
    if (token) {
      cargarProductos(token);
    }
  }, [token]);

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
          
          {/* Buscador integrado */}
          <div className="buscador-menu">
            <input
              type="text"
              placeholder="Buscar zapatos..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
              className="input-busqueda-menu"
              disabled={buscando}
            />
            <button 
              onClick={handleBuscar}
              className="btn-buscar-menu"
              disabled={buscando || !terminoBusqueda.trim()}
            >
              {buscando ? '⏳' : '🔍'}
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

          <button onClick={() => setMostrarModal(true)}>🚪 Cerrar sesión</button>
          <button onClick={() => setView("carritoAñadidos")}>
            🛒 {contadorAñadidos} productos añadidos
          </button>
        </div>

        {/* Información de búsqueda */}
        {mostrandoResultados && (
          <div className="info-busqueda">
            <button onClick={limpiarBusqueda} className="btn-limpiar">
              Ver todos los productos
            </button>
          </div>
        )}

        <h3>🛒 {mostrandoResultados ? "Resultados de búsqueda:" : "Productos de la tienda:"}</h3>
        
        {productosFiltrados.length > 0 ? (
          <ul className="productos">
            {productosFiltrados.map((p) => (
              <ProductoCard 
                key={p._id} 
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
                : "No hay productos disponibles."
              }
            </p>
            {mostrandoResultados && (
              <button onClick={limpiarBusqueda} className="btn-limpiar">
                Ver todos los productos
              </button>
            )}
          </div>
        )}

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

        {/* Modal de imagen grande */}
        {imagenGrande && (
          <div className="imagen-modal" onClick={cerrarImagen}>
            <div className="imagen-modal-contenido" onClick={e => e.stopPropagation()}>
              <button className="cerrar-imagen" onClick={cerrarImagen}>×</button>
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
        mensaje={mensaje}
        carrito={carrito}
        productos={productos}
        setCarrito={setCarrito}
        setView={setView}
      />
    );
}