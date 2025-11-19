import { useState } from "react";
import { loginUser } from "../utils/api";
import "./../assets/css/Login.css";

export default function Login({ onLoginSuccess, setView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 5000);
  };

  const handleLogin = async () => {
    const emailTrim = email.trim();
    const passwordTrim = password.trim();

    // ✅ Validaciones
    if (!emailTrim || !passwordTrim) {
      mostrarMensaje("Completa todos los campos", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrim)) {
      mostrarMensaje("Formato de email inválido", "error");
      return;
    }

    if (!passwordRegex.test(passwordTrim)) {
      mostrarMensaje(
        "La contraseña debe tener mínimo 6 caracteres, al menos una letra y un número",
        "error"
      );
      return;
    }

    // ✅ Intento de login
    setLoading(true);
    const data = await loginUser(emailTrim, passwordTrim);
    setLoading(false);

    if (data.token) {
      mostrarMensaje(data.mensaje || "Inicio de sesión correcto", "success");
      setTimeout(() => onLoginSuccess(data.token, data.mensaje), 800);
    } else {
      mostrarMensaje(data.error || "Error al iniciar sesión", "error");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page-container">
      <div className="login-form-box">
        <h2 className="login-title">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <button
          onClick={handleLogin}
          className="login-submit-btn"
          disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>

  

        <button onClick={() => setView("menu")} className="login-back-btn">
          Volver al Menú Principal
        </button>
      </div>
    </div>
  );
}
