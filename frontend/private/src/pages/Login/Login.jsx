// Login.jsx
import { useLogin } from '../../hooks/LoginHooks/useLogin';
import './Login.css';

function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        handleSubmit,
    } = useLogin();

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
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="ejemplo@xaelor.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </div>

                    
                </form>
            </div>
        </div>
    );
}

export default Login;