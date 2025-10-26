import { useState } from "react";
import { registerUser } from "../utils/api";
import "./../assets/css/Register.css";

export default function Register({ setView }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState(""); // ✅ Nuevo campo
  const [telefono, setTelefono] = useState(""); // ✅ Nuevo campo
  const [direccion, setDireccion] = useState(""); // ✅ Nuevo campo
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const nombreRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ✅ Nueva validación

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 5000);
  };

  const handleRegister = async () => {
    const nombreTrim = nombre.trim();
    const emailTrim = email.trim(); // ✅ Nuevo
    const passwordTrim = password.trim();

    // ✅ Validaciones actualizadas
    if (!nombreTrim || !emailTrim || !passwordTrim) { // ✅ Agregado email
      mostrarMensaje(" Completa todos los campos obligatorios", "error");
      return;
    }

    if (!nombreRegex.test(nombreTrim)) {
      mostrarMensaje(
        " El nombre debe tener formato 'Nombre Apellido' con mayúsculas iniciales",
        "error"
      );
      return;
    }

    // ✅ Validación de email
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

    // ✅ Llamada actualizada con nuevos campos
    const data = await registerUser(
      nombreTrim, 
      emailTrim, // ✅ Nuevo
      telefono,   // ✅ Nuevo
      direccion,  // ✅ Nuevo
      passwordTrim
    );

    if (data.mensaje) {
      mostrarMensaje(" " + data.mensaje, "success");
      setTimeout(() => setView("login"), 1000);
    } else {
      mostrarMensaje(" " + (data.error || "Error en registro"), "error");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-page-container">
      <div className="register-form-box">
        <h2 className="register-title">Únete a Solex</h2>
        
        <input
          placeholder="Nombre Completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="register-input-field"
        />

        {/* ✅ Nuevos campos agregados */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input-field"
        />

        <input
          placeholder="Teléfono (opcional)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="register-input-field"
        />

        <input
          placeholder="Dirección (opcional)"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
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