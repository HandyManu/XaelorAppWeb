import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos el hook para la navegación
import '../pages/LogIn.css';

const Login = () => {
  const navigate = useNavigate(); // Inicializamos el hook

  const handleRegisterClick = () => {
    navigate('/signUp'); // Navega a la página de registro
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <div className="input-group">
          <h3>Usuario</h3>
          <input type="text" />
        </div>
        <div className="input-group">
          <h3>Contraseña</h3>
          <input type="password" />
          <span className="forgot-password">Olvidaste tu contraseña?</span>
        </div>
        <button>Ingresar</button>
        <h3 onClick={handleRegisterClick}>Registrarse</h3>
      </div>
    </div>
  );
};

export default Login;
