import { useState } from "react";
import { loginUser } from "../utils/api";
import "./../assets/css/Login.css";

export default function Login({ onLoginSuccess, setView }) {
  // Estados para guardar los datos del login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Regla para validar la contraseña
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  // Función para mostrar mensajes
  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 5000);
  };

  // Función que se ejecuta al hacer clic en Iniciar Sesión
  const handleLogin = async () => {
    // Limpiar espacios en blanco
    const emailTrim = email.trim();
    const passwordTrim = password.trim();

    // Verificar que los campos no estén vacíos
    if (!emailTrim || !passwordTrim) {
      mostrarMensaje("Completa todos los campos", "error");
      return;
    }

    // Verificar que el email tenga formato correcto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrim)) {
      mostrarMensaje("Formato de email inválido", "error");
      return;
    }

    // Verificar que la contraseña cumpla las reglas
    if (!passwordRegex.test(passwordTrim)) {
      mostrarMensaje(
        "La contraseña debe tener 6 caracteres, una letra y un número",
        "error"
      );
      return;
    }

    // Mostrar que está cargando
    setLoading(true);
    // Llamar a la función que verifica el login
    const data = await loginUser(emailTrim, passwordTrim);
    setLoading(false);

    // Si el login sale bien
    if (data.token) {
      // No mostrar mensaje de éxito, directamente redirigir
      setTimeout(() => onLoginSuccess(data.token, data.mensaje), 100);
    } else {
      // Si hay error
      mostrarMensaje(data.error || "Error al iniciar sesión", "error");
    }
  };

  // Mostrar u ocultar la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page-container">
      <div className="login-form-box">
        <h2 className="login-title">Iniciar Sesión</h2>

        {/* Input para el email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input-field"
        />

        {/* Input para la contraseña con botón para verla */}
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

        {/* Botón para iniciar sesión */}
        <button
          onClick={handleLogin}
          className="login-submit-btn"
          disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>

        {/* Aquí aparecen solo los mensajes de error */}
        {mensaje && (
          <div className={`login-message ${tipoMensaje}`}>
            {mensaje}
          </div>
        )}

        {/* Botón para volver al menú principal */}
        <button onClick={() => setView("menu")} className="login-back-btn">
          Volver al Menú Principal
        </button>
      </div>
    </div>
  );
}