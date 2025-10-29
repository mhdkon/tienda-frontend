import { useState } from "react";
import { registerUser } from "../utils/api";
import "./../assets/css/Register.css";

export default function Register({ setView }) {
  // Estados para guardar los datos del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState(""); 
  const [telefono, setTelefono] = useState(""); 
  const [direccion, setDireccion] = useState(""); 
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Reglas para validar los datos
  const nombreRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

  // Función para mostrar mensajes
  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 5000);
  };

  // Función que se ejecuta al hacer clic en Registrarse
  const handleRegister = async () => {
    // Limpiar espacios en blanco
    const nombreTrim = nombre.trim();
    const emailTrim = email.trim(); 
    const telefonoTrim = telefono.trim();
    const direccionTrim = direccion.trim();
    const passwordTrim = password.trim();

    // Verificar que todos los campos estén llenos
    if (!nombreTrim || !emailTrim || !telefonoTrim || !direccionTrim || !passwordTrim) { 
      mostrarMensaje("Completa todos los campos obligatorios", "error");
      return;
    }

    // Verificar formato del nombre
    if (!nombreRegex.test(nombreTrim)) {
      mostrarMensaje(
        "El nombre debe tener formato 'Nombre Apellido' con mayúsculas iniciales",
        "error"
      );
      return;
    }

    // Verificar formato del email
    if (!emailRegex.test(emailTrim)) {
      mostrarMensaje("Formato de email inválido", "error");
      return;
    }

    // Verificar formato de la contraseña
    if (!passwordRegex.test(passwordTrim)) {
      mostrarMensaje(
        "La contraseña debe tener mínimo 6 caracteres, al menos una letra y un número",
        "error"
      );
      return;
    }

    // Llamar a la función que registra en la base de datos
    const data = await registerUser(
      nombreTrim, 
      emailTrim, 
      telefonoTrim,   
      direccionTrim,  
      passwordTrim
    );

    // Si el registro sale bien
    if (data.mensaje) {
      mostrarMensaje(data.mensaje, "success");
      setTimeout(() => setView("login"), 1000);
    } else {
      // Si hay error
      mostrarMensaje(data.error || "Error en registro", "error");
    }
  };

  // Mostrar u ocultar la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-page-container">
      <div className="register-form-box">
        <h2 className="register-title">Únete a Solex</h2>
        
        {/* Input para el nombre */}
        <input
          placeholder="Nombre Completo *"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="register-input-field"
          required
        />

        {/* Input para el email */}
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input-field"
          required
        />

        {/* Input para el teléfono */}
        <input
          placeholder="Teléfono *"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="register-input-field"
          required
        />

        {/* Input para la dirección */}
        <input
          placeholder="Dirección *"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="register-input-field"
          required
        />
        
        {/* Input para la contraseña con botón para verla */}
        <div className="register-password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input-field register-password-input"
            required
          />
          <button
            type="button"
            className="register-toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        
        {/* Botón para registrarse */}
        <button onClick={handleRegister} className="register-submit-btn">
          Registrarse
        </button>

        {/* Aquí aparecen los mensajes de éxito o error */}
        {mensaje && (
          <div className={`register-message ${tipoMensaje}`}>
            {mensaje}
          </div>
        )}

        {/* Botón para volver al menú principal */}
        <button onClick={() => setView("menu")} className="register-back-btn">
          Volver al menú
        </button>
      </div>
    </div>
  );
}