import React from 'react';
import '../pages/LogIn.css';
import Imagen from '/Circular Logo.svg?url'

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <div className="input-group">
          <h3>Usuario</h3>
          <input type="text"/>
        </div>
        <div className="input-group">
          <h3>Contraseña</h3>
          <input type="password"/>
          <span className="forgot-password">Olvidaste tu contraseña?</span>
        </div>
        <button>Ingresar</button>
        <h3>Registarse</h3>
      </div>
    </div>
  );
};

export default Login;

