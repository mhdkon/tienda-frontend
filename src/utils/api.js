const API = import.meta.env.VITE_API_URL; // Conexion con el backend usando la URL 

// LOGIN - Iniciar sesion de usuario
export const loginUser = async (email, password) => { 
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// REGISTRO - Crear nuevo usuario
export const registerUser = async (nombre, email, telefono, direccion, password) => { 
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      nombre, 
      email,        
      telefono,    
      direccion,    
      password 
    }),
  });
  return res.json();
};

// Obtener todos los productos
export const getProductos = async (token) => {
  const res = await fetch(`${API}/productos`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
};

// Obtener carrito del usuario
export const getCarrito = async (token) => {
  const res = await fetch(`${API}/carrito`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
};

// Agregar producto al carrito
export const addCarrito = async (token, id) => {
  await fetch(`${API}/carrito/${id}`, {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
  });
};

// Eliminar producto del carrito
export const deleteCarrito = async (token, id) => {
  await fetch(`${API}/carrito/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
};

// Pagar todo el carrito
export const pagarCarrito = async (token) => {
  const res = await fetch(`${API}/carrito/pagar-todo`, { 
    method: "PUT",
    headers: { Authorization: "Bearer " + token },
  });
  return res.json(); 
};

// Editar cantidad de producto en el carrito
export const editarCarrito = async (token, id, cantidad) => { 
  const res = await fetch(`${API}/carrito/cantidad/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ cantidad }),
  });
  return res.json();
};

// Obtener perfil del usuario 
export const getPerfil = async (token) => {
  const res = await fetch(`${API}/auth/perfil`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
};

// Actualizar perfil del usuario
export const actualizarPerfil = async (token, datos) => {
  const res = await fetch(`${API}/auth/perfil`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(datos),
  });
  return res.json();
};