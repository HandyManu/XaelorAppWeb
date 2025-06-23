import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { config } from '../../config.jsx';
import "../Login/Login.css"
const API_URL = config.api.API_BASE + '/passwordRecovery';

export default function PasswordRecovery() {
    const [searchParams] = useSearchParams();
    const urlEmail = searchParams.get('email');
    const urlCode = searchParams.get('code');

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Si hay email y code en la URL, verifica automáticamente
    useEffect(() => {
        if (urlEmail && urlCode) {
            setEmail(urlEmail);
            setCode(urlCode);
            handleVerifyCodeAuto(urlEmail, urlCode);
        }
        // eslint-disable-next-line
    }, [urlEmail, urlCode]);

    // Paso 1: Solicitar código
    const handleRequestCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/requestCode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Código enviado al correo', {
                    style: {
                        background: '#232323',
                        color: '#ffe08a',
                        border: '1.5px solid #e6c068',
                        fontWeight: 'bold'
                    },
                    iconTheme: {
                        primary: '#ffe08a',
                        secondary: '#232323'
                    }
                });
                // En este flujo, NO avanzamos a step 2, el usuario debe abrir el link del correo
            } else {
                toast.error(data.message || 'Error al solicitar código', {
                    style: {
                        background: '#232323',
                        color: '#ffe08a',
                        border: '1.5px solid #e6c068',
                        fontWeight: 'bold'
                    },
                    iconTheme: {
                        primary: '#ff4b4b',
                        secondary: '#232323'
                    }
                });
            }
        } catch (err) {
            toast.error('Error de red', {
                style: {
                    background: '#232323',
                    color: '#ffe08a',
                    border: '1.5px solid #e6c068',
                    fontWeight: 'bold'
                },
                iconTheme: {
                    primary: '#ff4b4b',
                    secondary: '#232323'
                }
            });
        }
        setLoading(false);
    };

    // Paso 2: Verificación automática desde el enlace
    const handleVerifyCodeAuto = async (emailParam, codeParam) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/verifyCode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: emailParam, code: codeParam }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Código verificado', {
                    style: {
                        background: '#232323',
                        color: '#ffe08a',
                        border: '1.5px solid #e6c068',
                        fontWeight: 'bold'
                    },
                    iconTheme: {
                        primary: '#ffe08a',
                        secondary: '#232323'
                    }
                });
                setStep(3); // Ir directamente al formulario de nueva contraseña
            } else {
                toast.error(data.message || 'Código inválido o expirado', {
                    style: {
                        background: '#232323',
                        color: '#ffe08a',
                        border: '1.5px solid #e6c068',
                        fontWeight: 'bold'
                    },
                    iconTheme: {
                        primary: '#ff4b4b',
                        secondary: '#232323'
                    }
                });
                setStep(1); // Volver al inicio si el código no es válido
            }
        } catch (err) {
            toast.error('Error de red', {
                style: {
                    background: '#232323',
                    color: '#ffe08a',
                    border: '1.5px solid #e6c068',
                    fontWeight: 'bold'
                },
                iconTheme: {
                    primary: '#ff4b4b',
                    secondary: '#232323'
                }
            });
            setStep(1);
        }
        setLoading(false);
    };

    // Paso 3: Nueva contraseña
    const handleNewPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/newPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Contraseña actualizada', {
                    style: {
                        background: '#232323',
                        color: '#ffe08a',
                        border: '1.5px solid #e6c068',
                        fontWeight: 'bold'
                    },
                    iconTheme: {
                        primary: '#ffe08a',
                        secondary: '#232323'
                    }
                });
                setStep(4);
            } else {
                toast.error(data.message || 'Error al actualizar contraseña', {
                    style: {
                        background: '#232323',
                        color: '#ffe08a',
                        border: '1.5px solid #e6c068',
                        fontWeight: 'bold'
                    },
                    iconTheme: {
                        primary: '#ff4b4b',
                        secondary: '#232323'
                    }
                });
            }
        } catch (err) {
            toast.error('Error de red', {
                style: {
                    background: '#232323',
                    color: '#ffe08a',
                    border: '1.5px solid #e6c068',
                    fontWeight: 'bold'
                },
                iconTheme: {
                    primary: '#ff4b4b',
                    secondary: '#232323'
                }
            });
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <Toaster position="top-right" />
            <div className="login-box">
                <h2>Recuperar Contraseña</h2>
                {step === 1 && (
                    <form onSubmit={handleRequestCode}>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar código'}
                        </button>
                        <div style={{ marginTop: 18, color: '#ffe08a', fontSize: '0.95rem', textAlign: 'center' }}>
                            Recibirás un correo con un enlace para restablecer tu contraseña.
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleNewPassword}>
                        <div className="input-group">
                            <label>Nueva contraseña</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Tu nueva contraseña"
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                        </button>
                    </form>
                )}

                {step === 4 && (
                    <div style={{ textAlign: 'center', color: '#232323', marginTop: 24 }}>
                        <b>¡Contraseña actualizada!</b><br />
                        Ya puedes <a href="/login" style={{ color: '#e6c068', textDecoration: 'underline' }}>iniciar sesión</a> con tu nueva contraseña.
                    </div>
                )}
            </div>
        </div>
    );
}
