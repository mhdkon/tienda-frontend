import { useState } from "react";
import { loginUser } from "../utils/api";
import "./../assets/css/Login.css";

export default function Login({ onLoginSuccess, setView }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!nombre || !password) return alert("Completa todos los campos");
    setLoading(true);
    const data = await loginUser(nombre, password);
    setLoading(false);

    if (data.token) {
      onLoginSuccess(data.token, data.mensaje);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="login-register container login-anim">
      <h2>Login Tienda</h2>
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="input-anim"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-anim"
      />
      <button onClick={handleLogin} className="btn-anim" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <button onClick={() => setView("menu")} className="btn-anim-outline">
        Volver al menú
      </button>
    </div>
  );
}
