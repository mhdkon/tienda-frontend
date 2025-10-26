const API = import.meta.env.VITE_API_URL; // conexion con el bakend usando la url 

// ✅ LOGIN - Cambiado: nombre → email
export const loginUser = async (email, password) => { // ✅ Cambiado parámetro
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }), // ✅ Cambiado: nombre → email
  });
  return res.json();
};

// ✅ REGISTER - Agregados nuevos campos
export const registerUser = async (nombre, email, telefono, direccion, password) => { // ✅ Nuevos parámetros
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      nombre, 
      email,        // ✅ Nuevo campo
      telefono,     // ✅ Nuevo campo
      direccion,    // ✅ Nuevo campo
      password 
    }),
  });
  return res.json();
};

// ✅ Estas funciones se mantienen igual (no cambiaron)
export const getProductos = async (token) => {
  const res = await fetch(`${API}/productos`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
};

export const getCarrito = async (token) => {
  const res = await fetch(`${API}/carrito`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
};

export const addCarrito = async (token, id) => {
  await fetch(`${API}/carrito/${id}`, {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
  });
};

export const deleteCarrito = async (token, id) => {
  await fetch(`${API}/carrito/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
};

// ✅ ACTUALIZADO: La ruta de pagar cambió
export const pagarCarrito = async (token) => { // ✅ Eliminado parámetro id
  const res = await fetch(`${API}/carrito/pagar-todo`, { // ✅ Cambiada ruta
    method: "PUT",
    headers: { Authorization: "Bearer " + token },
  });
  return res.json(); // ✅ Agregado return para obtener respuesta
};

// ✅ ACTUALIZADO: La función de editar carrito cambió
export const editarCarrito = async (token, id, cantidad) => { // ✅ Cambiado parámetro
  const res = await fetch(`${API}/carrito/cantidad/${id}`, { // ✅ Cambiada ruta
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ cantidad }), // ✅ Cambiado body
  });
  return res.json(); // ✅ Agregado return
};

// ✅ NUEVAS FUNCIONES (opcionales - si las necesitas)
export const getPerfil = async (token) => {
  const res = await fetch(`${API}/auth/perfil`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
};

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