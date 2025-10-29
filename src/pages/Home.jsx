import { useState, useEffect, useCallback } from "react";
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
  const [contadorCarrito, setContadorCarrito] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [imagenGrande, setImagenGrande] = useState("");
  const [mensajeProducto, setMensajeProducto] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const obtenerRutaImagen = useCallback((imagen) => {
    if (!imagen) return `${API}/fallback.jpg`;
    if (imagen.startsWith("http")) return imagen;
    return `${API}${imagen}`;
  }, [API]);

  const onLoginSuccess = (token, mensaje) => {
    setToken(token);
    setMensaje(mensaje);
    setView("tienda");
    Promise.all([cargarProductos(token), cargarCarrito(token)]);
  };

  const cargarProductos = async (token) => {
    try {
      const res = await fetch(`${API}/productos`, {
        headers: { Authorization: "Bearer " + token }
      });
      
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
        setProductosFiltrados(data);
      }
    } catch (error) {
      console.log("Error cargando productos");
    }
  };

  const cargarCarrito = async (token) => {
    try {
      const res = await fetch(`${API}/carrito`, {
        headers: { Authorization: "Bearer " + token }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCarrito(data);
          setContadorCarrito(data.length);
        }
      } else {
        setCarrito([]);
        setContadorCarrito(0);
      }
    } catch (error) {
      setCarrito([]);
      setContadorCarrito(0);
    }
  };

  const agregarAlCarrito = async (idProducto) => {
    try {
      const response = await fetch(`${API}/carrito/${idProducto}`, {
        method: "POST",
        headers: { 
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cantidad: 1,
          talla: "38"
        })
      });

      if (response.status === 401) {
        alert("Necesitas iniciar sesion de nuevo");
        return;
      }

      if (response.ok) {
        setContadorCarrito(prev => prev + 1);
        
        const producto = productos.find(p => p.id === idProducto);
        setMensajeProducto(`${producto?.nombre || 'Producto'} agregado al carrito`);
        
        setTimeout(() => {
          setMensajeProducto("");
        }, 2000);
        
        cargarCarrito(token);
      }
    } catch (error) {
      alert("Error al agregar producto");
    }
  };

  const compraRealizada = () => {
    setContadorCarrito(0);
    setCarrito([]);
  };

  const cerrarSesion = () => {
    setToken("");
    setMensaje("");
    setCarrito([]);
    setProductos([]);
    setProductosFiltrados([]);
    setContadorCarrito(0);
    setBusqueda("");
    setMostrarResultados(false);
    setView("menu");
    setMostrarModal(false);
    setMensajeProducto("");
  };

  const abrirImagen = (imagen) => {
    setImagenGrande(obtenerRutaImagen(imagen));
  };

  const cerrarImagen = () => setImagenGrande("");

  const buscarProductos = async () => {
    if (!busqueda.trim()) {
      alert("Escribe algo para buscar");
      return;
    }
    
    setBuscando(true);
    try {
      const res = await fetch(
        `${API}/productos/buscar?nombre=${encodeURIComponent(busqueda)}`,
        { 
          headers: { Authorization: "Bearer " + token }
        }
      );
      
      if (res.ok) {
        const resultados = await res.json();
        setProductosFiltrados(resultados);
        setMostrarResultados(true);
      }
    } catch (error) {
      alert("Error en la busqueda");
    } finally {
      setBuscando(false);
    }
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    setProductosFiltrados(productos);
    setMostrarResultados(false);
  };

  useEffect(() => {
    if (token) {
      cargarProductos(token);
      cargarCarrito(token);
    }
  }, [token]);

  if (view === "menu") {
    return (
      <div className="menu-inicial container">
        <h1>Bienvenido a Solex</h1>
        <button onClick={() => setView("login")}>Iniciar sesion</button>
        <button onClick={() => setView("register")}>Registrarse</button>
      </div>
    );
  }

  if (view === "login") {
    return <Login onLoginSuccess={onLoginSuccess} setView={setView} />;
  }

  if (view === "register") {
    return <Register setView={setView} />;
  }

  if (view === "tienda") {
    return (
      <div className="container">
        <div className="menu-superior">
          <h2>Solex</h2>
          <h3>{mensaje}</h3>

          <div className="buscador-menu">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && buscarProductos()}
              className="input-busqueda-menu"
              disabled={buscando}
            />
            <button
              onClick={buscarProductos}
              className="btn-buscar-menu"
              disabled={buscando || !busqueda.trim()}
            >
              Buscar
            </button>
            {busqueda && (
              <button
                onClick={limpiarBusqueda}
                className="btn-limpiar-menu"
              >
                X
              </button>
            )}
          </div>

          <button onClick={() => setMostrarModal(true)}>Cerrar sesion</button>
          <button onClick={() => setView("carritoAñadidos")}>
            {contadorCarrito > 0 ? `Carrito (${contadorCarrito})` : "Carrito"}
          </button>
        </div>

        {mostrarResultados && (
          <div className="info-busqueda">
            <button onClick={limpiarBusqueda} className="btn-limpiar">
              Ver todos
            </button>
          </div>
        )}

        <h3>{mostrarResultados ? "Resultados:" : "Productos:"}</h3>

        {productosFiltrados.length > 0 ? (
          <ul className="productos">
            {productosFiltrados.map((p) => (
              <ProductoCard
                key={p.id}
                producto={p}
                onAñadir={agregarAlCarrito}
                onClickImagen={abrirImagen}
              />
            ))}
          </ul>
        ) : (
          <div className="sin-resultados">
            <p>
              {mostrarResultados
                ? "No se encontraron productos."
                : "No hay productos."}
            </p>
            {mostrarResultados && (
              <button onClick={limpiarBusqueda} className="btn-limpiar">
                Ver todos
              </button>
            )}
          </div>
        )}

        {mensajeProducto && (
          <div className="mensaje-producto-añadido">
            {mensajeProducto}
          </div>
        )}

        {mostrarModal && (
          <div className="modal">
            <div className="modal-contenido">
              <h3>Cerrar sesion?</h3>
              <button className="confirmar" onClick={cerrarSesion}>
                Si, cerrar
              </button>
              <button className="cancelar" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {imagenGrande && (
          <div className="imagen-modal" onClick={cerrarImagen}>
            <div className="imagen-modal-contenido">
              <button className="cerrar-imagen" onClick={cerrarImagen}>
                ×
              </button>
              <img src={imagenGrande} alt="Producto" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === "carritoAñadidos") {
    return (
      <CarritoPage
        token={token}
        carrito={carrito}
        productos={productos}
        setCarrito={setCarrito}
        setView={setView}
        onCompraRealizada={compraRealizada}
      />
    );
  }
}