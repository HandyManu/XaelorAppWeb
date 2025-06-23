import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import { config } from "../../config";

const API_BASE = config.api.API_BASE;

export function useSignUp() {
    // Verificar que useAuth no sea undefined
    const authContext = useAuth();
    
    if (!authContext) {
        throw new Error('useSignUp debe ser usado dentro de un AuthProvider');
    }
    
    const { Login } = authContext;
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showVerification, setShowVerification] = useState(false);

    // Función para actualizar campos del formulario
    const updateField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Limpiar error al escribir
        if (error) setError("");
    };

    // Función para registro
    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        // Debug: mostrar la URL que se está intentando acceder
        const fullURL = `${API_BASE}/registerClient`;
        console.log("Intentando acceder a:", fullURL);
        console.log("Datos a enviar:", formData);

        try {
            const response = await fetch(fullURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include"
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            // Verificar si la respuesta es JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                // Si no es JSON, obtener el texto para debug
                const textResponse = await response.text();
                console.log("Response no es JSON:", textResponse);
                throw new Error(`Servidor devolvió ${response.status}. Verifica que la ruta /registerClients exista en el backend.`);
            }

            const data = await response.json();
            console.log("Response data:", data);

            if (!response.ok) {
                throw new Error(data.message || "Error en el registro");
            }

            // Si el registro fue exitoso, mostrar pantalla de verificación
            if (data.message.includes("Please verify") || data.message.includes("verify")) {
                setShowVerification(true);
            } else if (data.message === "Client already exists") {
                setError("Ya existe una cuenta con este email");
            } else {
                setError(data.message);
            }

        } catch (error) {
            console.error("Error en registro:", error);
            
            // Mejorar el mensaje de error según el tipo
            if (error.message.includes("Failed to fetch")) {
                setError("Error de conexión. Verifica que el servidor esté funcionando.");
            } else if (error.message.includes("SyntaxError") || error.message.includes("Unexpected token")) {
                setError("Error del servidor (404). Verifica la configuración de rutas.");
            } else {
                setError(error.message || "Error al crear la cuenta");
            }
        } finally {
            setLoading(false);
        }
    };

    // Función para verificar código
    const handleVerification = async (code) => {
        setLoading(true);
        setError("");

        const fullURL = `${API_BASE}/registerClient/verifyCodeEmail`;
        console.log("Intentando verificar en:", fullURL);

        try {
            // Verificar el código
            const verifyResponse = await fetch(fullURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ requireCode: code }),
                credentials: "include"
            });

            console.log("Verify response status:", verifyResponse.status);

            // Verificar si la respuesta es JSON
            const contentType = verifyResponse.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const textResponse = await verifyResponse.text();
                console.log("Verify response no es JSON:", textResponse);
                throw new Error(`Error del servidor en verificación (${verifyResponse.status})`);
            }

            const verifyData = await verifyResponse.json();
            console.log("Verify data:", verifyData);

            if (!verifyResponse.ok) {
                throw new Error(verifyData.message || "Error en la verificación");
            }

            if (verifyData.message === "Email verified Successfully") {
                // Ahora hacer login automático
                const loginResult = await Login(formData.email, formData.password);
                
                if (loginResult.success) {
                    console.log("Registro y login exitoso, redirigiendo al dashboard");
                    setTimeout(() => {
                        navigate("/", { replace: true });
                    }, 100);
                } else {
                    // Si falla el login automático, redirigir al login manual
                    setError("Cuenta verificada. Por favor inicia sesión");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                }
            } else if (verifyData.message === "Invalid code") {
                setError("Código inválido. Verifica e intenta nuevamente");
            } else {
                setError(verifyData.message);
            }

        } catch (error) {
            console.error("Error en verificación:", error);
            setError(error.message || "Error al verificar el código");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        updateField,
        loading,
        error,
        showVerification,
        handleSubmit,
        handleVerification
    };
}