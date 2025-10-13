import { useState } from "react";
import { registerUser } from "../utils/api";
import "./../assets/css/Register.css";

export default function Register({ setView }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const nombreRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 5000);
  };

  const handleRegister = async () => {
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

    const data = await registerUser(nombreTrim, passwordTrim);

    if (data.mensaje) {
      mostrarMensaje("✅ " + data.mensaje, "success");
      setTimeout(() => setView("login"), 1000);
    } else {
      mostrarMensaje("❌ " + (data.error || "Error en registro"), "error");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-page-container">
      <div className="register-form-box">
        <h2 className="register-title">Registro de usuario</h2>
        
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="register-input-field"
        />
        
        <div className="register-password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input-field register-password-input"
          />
          <button
            type="button"
            className="register-toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        
        <button onClick={handleRegister} className="register-submit-btn">
          Registrarse
        </button>

        {mensaje && (
          <div className={`register-message ${tipoMensaje}`}>
            {mensaje}
          </div>
        )}

        <button onClick={() => setView("menu")} className="register-back-btn">
          Volver al menú
        </button>
      </div>
    </div>
  );
}