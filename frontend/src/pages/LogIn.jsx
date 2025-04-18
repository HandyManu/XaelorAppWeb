import React from 'react';
import '../pages/LogIn.css';
import Imagen from '/Circular Logo.svg?url'

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <img src = {Imagen} alt="Logo de Xelor"/>
        <h3>Registarse</h3>
        <h2>Iniciar Sesión</h2>
        <input type="text" placeholder="Usuario" />
        <input type="password" placeholder="Contraseña" />
        <button>Ingresar</button>
      </div>
    </div>
  );
};

export default Login;
