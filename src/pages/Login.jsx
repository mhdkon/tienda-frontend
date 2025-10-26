import { useState } from "react";
import { loginUser } from "../utils/api";
import "./../assets/css/Login.css";

export default function Login({ onLoginSuccess, setView }) {
  const [email, setEmail] = useState(""); // ✅ Cambiado: nombre → email
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Eliminada validación de nombre (ya no se necesita)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 5000);
  };

  const handleLogin = async () => {
    const emailTrim = email.trim(); // ✅ Cambiado: nombreTrim → emailTrim
    const passwordTrim = password.trim();

    // ✅ Validaciones actualizadas
    if (!emailTrim || !passwordTrim) {
      mostrarMensaje(" Completa todos los campos", "error");
      return;
    }

    // ✅ Validación de email (nueva)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrim)) {
      mostrarMensaje(" Formato de email inválido", "error");
      return;
    }

    if (!passwordRegex.test(passwordTrim)) {
      mostrarMensaje(
        " La contraseña debe tener mínimo 6 caracteres, al menos una letra y un número",
        "error"
      );
      return;
    }

    // ✅ Intento de login con email
    setLoading(true);
    const data = await loginUser(emailTrim, passwordTrim); // ✅ Envía email, no nombre
    setLoading(false);

    if (data.token) {
      mostrarMensaje(" " + data.mensaje, "success");
      setTimeout(() => onLoginSuccess(data.token, data.mensaje), 500);
    } else {
      mostrarMensaje(" " + (data.error || "Error al iniciar sesión"), "error");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page-container">
      <div className="login-form-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        {/* ✅ Cambiado: input de nombre → email */}
        <input
          type="email" // ✅ Agregado type="email"
          placeholder="Email" // ✅ Cambiado placeholder
          value={email} // ✅ Cambiado: nombre → email
          onChange={(e) => setEmail(e.target.value)} // ✅ Cambiado: setNombre → setEmail
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
          {loading ? " Iniciando sesión..." : " Iniciar Sesión"}
        </button>

        <button onClick={() => setView("menu")} className="login-back-btn">
           Volver al Menú Principal
        </button>
      </div>
    </div>
  );
}