import { useState } from "react";
import { registerUser } from "../utils/api";
import "./../assets/css/Register.css";

export default function Register({ setView }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!nombre.trim() || !password.trim()) return alert("Completa todos los campos");
    const data = await registerUser(nombre, password);
    if (data.mensaje) {
      alert(data.mensaje);
      setView("login");
    } else {
      alert(data.error || "Error en registro");
    }
  };

  return (
    <div className="login-register container">
      <h2>Registro de usuario</h2>
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Registrarse</button>
      <button onClick={() => setView("menu")}>Volver al menú</button>
    </div>
  );
}
