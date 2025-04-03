import React from 'react';
import '../pages/LogIn.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <input type="text" placeholder="Usuario" />
        <input type="password" placeholder="Contraseña" />
        <button>Ingresar</button>
      </div>
    </div>
  );
};

export default Login;
