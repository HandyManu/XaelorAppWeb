import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { config } from "../../config";

const API_BASE = config.api.API_BASE;

export function useLogin() {
    const { Login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        console.log("Attempting login with:", { email }); // Debug

        // Si tu AuthContext/Login usa API_BASE, no necesitas cambiar nada aquí.
        // Si quieres hacer el fetch aquí directamente, usa API_BASE:
        // const response = await fetch(`${API_BASE}/login`, { ... });

        const result = await Login(email, password);
        setLoading(false);

        console.log("Login result:", result); // Debug

        if (result.success) {
            console.log("Login successful, navigating to dashboard"); // Debug
            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 100);
        } else {
            setError(result.message || "Error al iniciar sesión");
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        handleSubmit,
    };
}