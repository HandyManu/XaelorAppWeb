import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogIn } from '../../hooks/LoginHooks/useLogin';
import './LogIn.css';

const Login = () => {
  const navigate = useNavigate();
  
  // Hook para manejar el login
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useLogIn();

  const handleSignUpClick = () => {
    navigate('/signUp');
  };

  const handleForgotPasswordClick = () => {
    navigate('/recuperar');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        
        {/* Mostrar mensaje de error si existe */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(255, 87, 87, 0.2)',
            border: '1px solid #ff5757',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            color: '#ff5757',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Usuario (Email)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Contraseña</label>
            <span className="forgot-password" onClick={handleForgotPasswordClick}>
              Olvidaste tu contraseña?
            </span>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
        
        <div className="register-link" onClick={handleSignUpClick}>
          Registrarse
        </div>
      </div>
    </div>
  );
};

export default Login;