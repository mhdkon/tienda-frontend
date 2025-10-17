import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Variable de entorno

export const buscarProductos = async (nombre, token) => {
  try {
    const response = await axios.get(`${API_URL}/productos/buscar`, {
      params: { nombre },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error buscando productos:", error);
    throw error;
  }
};
