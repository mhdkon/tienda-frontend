import { useState } from "react";
import { loginUser } from "../utils/api";
import "./../assets/css/Login.css";

export default function Login({ onLoginSuccess, setView }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const nombreRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const handleLogin = async () => {
    const nombreTrim = nombre.trim();
    const passwordTrim = password.trim();

    if (!nombreTrim || !passwordTrim) {
      mostrarMensaje("⚠️ Completa todos los campos", "error");
      return;
    }

    if (!nombreRegex.test(nombreTrim)) {
      mostrarMensaje(
        "❌ El nombre debe tener formato 'Nombre Apellido' con mayúsculas iniciales",
        "error"
      );
      return;
    }

    if (!passwordRegex.test(passwordTrim)) {
      mostrarMensaje(
        "❌ La contraseña debe tener mínimo 6 caracteres, al menos una letra y un número",
        "error"
      );
      return;
    }

    setLoading(true);
    const data = await loginUser(nombreTrim, passwordTrim);
    setLoading(false);

    if (data.token) {
      mostrarMensaje("✅ " + data.mensaje, "success");
      setTimeout(() => onLoginSuccess(data.token, data.mensaje), 500);
    } else {
      mostrarMensaje("❌ " + (data.error || "Error al iniciar sesión"), "error");
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 5000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page-container">
      <div className="login-form-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="login-input-field"
        />
        
        <div className="login-password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input-field login-password-input"
          />
          <button
            type="button"
            className="login-toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        
        <button onClick={handleLogin} className="login-submit-btn" disabled={loading}>
          {loading ? "🔄 Iniciando sesión..." : "🚀 Iniciar Sesión"}
        </button>


        <button onClick={() => setView("menu")} className="login-back-btn">
          ↩️ Volver al Menú Principal
        </button>
      </div>
    </div>
  );
}