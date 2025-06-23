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
        <div className="login-logo">Xælör</div>
        <h2 className="login-title">Iniciar Sesión</h2>
        
        {/* Mostrar mensaje de error si existe */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@xaelor.com"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Contraseña</label>
            <span className="forgot-password" onClick={handleForgotPasswordClick}>
              ¿Olvidaste tu contraseña?
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
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="register-link" onClick={handleSignUpClick}>
          ¿No tienes cuenta? Regístrate
        </div>
      </div>
    </div>
  );
};

export default Login;