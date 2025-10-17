
const API = import.meta.env.VITE_API_URL; // conexion con el bakend usando la url 

export const loginUser = async (nombre, password) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, password }),
  });
  return res.json();
};

export const registerUser = async (nombre, password) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, password }),
  });
  return res.json();
};

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

export const pagarCarrito = async (token, id) => {
  await fetch(`${API}/carrito/pagar/${id}`, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token },
  });
};

export const editarCarrito = async (token, id, nuevoProducto) => {
  await fetch(`${API}/carrito/editar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ nuevoProductoId: nuevoProducto }),
  });
};
