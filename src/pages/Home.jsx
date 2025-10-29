import { useState, useEffect, useCallback } from "react";
import Login from "./Login";
import Register from "./Register";
import CarritoPage from "./CarritoPage";
import ProductoCard from "../components/ProductoCard";
import "./../assets/css/Tienda.css";

export default function Home() {
  // Estados para guardar información
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
  const [mensajeProductoAñadido, setMensajeProductoAñadido] = useState("");

  // URL de la API
  const API = import.meta.env.VITE_API_URL;

  // Función para obtener la ruta de la imagen
  const obtenerRutaImagen = useCallback((imagen) => {
    if (!imagen) return `${API}/fallback.jpg`;
    if (imagen.startsWith("http")) return imagen;
    return `${API}${imagen}`;
  }, [API]);

  // Función que se ejecuta cuando el login sale bien
  const onLoginSuccess = useCallback((token, mensaje) => {
    setToken(token);
    setMensaje(mensaje);
    setView("tienda");
    // Cargar productos y carrito
    Promise.all([cargarProductos(token), cargarCarrito(token)]);
  }, []);

  // Cargar productos desde la API
  const cargarProductos = async (token) => {
    try {
      const res = await fetch(`${API}/productos`, {
        headers: { Authorization: "Bearer " + token }
      });
      
      if (!res.ok) return;
      
      const data = await res.json();
      setProductos(data);
      setProductosFiltrados(data);
    } catch (error) {
      // Error silencioso
    }
  };

  // Cargar carrito desde la API
  const cargarCarrito = async (token) => {
    try {
      const res = await fetch(`${API}/carrito`, {
        headers: { Authorization: "Bearer " + token }
      });
      
      if (!res.ok) {
        setCarrito([]);
        setContadorAñadidos(0);
        return;
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
      setCarrito([]);
      setContadorAñadidos(0);
    }
  };

  // Añadir producto al carrito
  const handleAñadirCarrito = useCallback(async (idProducto) => {
    try {
      const response = await fetch(`${API}/carrito/${idProducto}`, {
        method: "POST",
        headers: { 
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productoId: idProducto,
          cantidad: 1,
          talla: "38"
        })
      });

      if (response.status === 401) {
        alert("No autorizado. Por favor, inicia sesión nuevamente.");
        return;
      }

      if (!response.ok) return;

      // Aumentar contador
      setContadorAñadidos(prev => prev + 1);
      
      // Mostrar mensaje de producto añadido
      const productoAñadido = productos.find(p => p.id === idProducto);
      setMensajeProductoAñadido(`${productoAñadido?.nombre || 'Producto'} añadido al carrito`);
      
      // Ocultar mensaje después de 2 segundos
      setTimeout(() => {
        setMensajeProductoAñadido("");
      }, 2000);
      
      // Recargar carrito
      cargarCarrito(token);
      
    } catch (error) {
      alert("Error al añadir producto al carrito");
    }
  }, [token, API, productos]);

  // Función cuando se completa una compra
  const handleCompraRealizada = useCallback(() => {
    setContadorAñadidos(0);
    setCarrito([]);
  }, []);

  // Función para cerrar sesión
  const handleLogoutConfirmado = useCallback(() => {
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
    setMensajeProductoAñadido("");
  }, []);

  // Función para mostrar imagen grande
  const handleClickImagen = useCallback((imagen) => {
    setImagenGrande(obtenerRutaImagen(imagen));
  }, [obtenerRutaImagen]);

  // Función para cerrar imagen grande
  const cerrarImagen = useCallback(() => setImagenGrande(""), []);

  // Función para buscar productos
  const handleBuscar = useCallback(async () => {
    if (!terminoBusqueda.trim()) {
      alert("Por favor ingresa un término de búsqueda");
      return;
    }
    
    setBuscando(true);
    try {
      const res = await fetch(
        `${API}/productos/buscar?nombre=${encodeURIComponent(terminoBusqueda)}`,
        { 
          headers: { Authorization: "Bearer " + token }
        }
      );
      
      if (!res.ok) return;
      
      const resultados = await res.json();
      setProductosFiltrados(resultados);
      setMostrandoResultados(true);
    } catch (error) {
      alert("Error al buscar productos");
    } finally {
      setBuscando(false);
    }
  }, [terminoBusqueda, token, API]);

  // Función para limpiar búsqueda
  const limpiarBusqueda = useCallback(() => {
    setTerminoBusqueda("");
    setProductosFiltrados(productos);
    setMostrandoResultados(false);
    setBuscando(false);
  }, [productos]);

  // Cargar productos y carrito cuando hay token
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
              Buscar
            </button>
            {terminoBusqueda && (
              <button
                onClick={limpiarBusqueda}
                className="btn-limpiar-menu"
                title="Limpiar búsqueda"
              >
                X
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

        {/* Mensaje fijo abajo a la derecha */}
        {mensajeProductoAñadido && (
          <div className="mensaje-producto-añadido">
            {mensajeProductoAñadido}
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