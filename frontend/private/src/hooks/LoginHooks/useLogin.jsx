import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
        
        const result = await Login(email, password);
        setLoading(false);

        console.log("Login result:", result); // Debug

        if (result.success) {
            console.log("Login successful, navigating to dashboard"); // Debug
            // Pequeño delay para asegurar que el estado se actualice
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