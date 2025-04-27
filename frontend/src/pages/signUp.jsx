import React from "react";
import "../pages/signUp.css"; 

export default function SignUp() {
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Crear Cuenta</h2>

        <form className="signup-form">
          <input type="text" placeholder="Tu nombre" className="signup-input" />
          <input type="email" placeholder="ejemplo@gmail.com" className="signup-input" />
          <input type="password" placeholder="Ingresa tu contraseña" className="signup-input" />

          <label className="signup-checkbox-container">
            <input type="checkbox" className="signup-checkbox" />
            <span>
              Acepto los <a href="#" className="highlight-link">Términos de Servicio</a> y 
              <a href="#" className="highlight-link"> Políticas de Privacidad</a> de la plataforma
            </span>
          </label>

          <button className="signup-button">Crear cuenta</button>

          <div className="signup-or">o regístrate con</div>

          <div className="signup-socials">
            <button className="signup-social-btn">G</button>
            <button className="signup-social-btn">F</button>
          </div>
        </form>
      </div>
    </div>
  );
}