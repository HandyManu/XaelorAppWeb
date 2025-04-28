import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login/LogIn.css';

const Login = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signUp');
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgotPassword');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        
        <div className="input-group">
          <label>Usuario</label>
          <input type="text" />
        </div>
        
        <div className="input-group">
          <label>Contraseña</label>
          <span className="forgot-password" onClick={handleForgotPasswordClick}>
            Olvidaste tu contraseña?
          </span>
          <input type="password" />
        </div>
        
        <button className="login-button">Ingresar</button>
        
        <div className="register-link" onClick={handleSignUpClick}>
          Registrarse
        </div>
      </div>
    </div>
  );
};

export default Login;
