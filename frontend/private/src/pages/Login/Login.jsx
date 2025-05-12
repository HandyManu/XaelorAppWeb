// Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // En una aplicación real, aquí harías una petición a un API
    // Por ahora, simulamos una autenticación simple
    if (credentials.email && credentials.password) {
      // Simular almacenamiento del token de autenticación
      localStorage.setItem('token', 'fake-jwt-token');
      // Redirigir al dashboard
      navigate('/dashboard');
    } else {
      setError('Por favor, ingresa tu email y contraseña');
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-logo">
          <span className="logo-icon">æ</span>
          <span className="logo-text">Xælör</span>
        </div>
        
        <h1>Iniciar Sesión</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={credentials.email}
              onChange={handleChange}
              placeholder="ejemplo@xaelor.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={credentials.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
            />
          </div>
          
          <div className="form-group">
            <button type="submit" className="login-button">
              Iniciar Sesión
            </button>
          </div>
          
          <div className="forgot-password">
            <a href="#reset-password">¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;