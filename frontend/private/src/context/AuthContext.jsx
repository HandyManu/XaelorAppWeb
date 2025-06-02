import React, { createContext, useContext, useState, useEffect } from "react";
import { config } from "../config";
const SERVER_URL = config.api.API_BASE;;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authCokie, setAuthCokie] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Agregamos estado de carga

    // Login real - cambiado a Login para consistencia
    const Login = async (email, password) => {
        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error en la autenticación");
            }

            const data = await response.json();

            // No permitir login si el usuario es customer
            if (data.user && data.user.userType === "customer") {
                return { success: false, message: "No tienes permisos para acceder a este sistema." };
            }

            // Guardar en localStorage
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            
            // Actualizar estado inmediatamente
            setAuthCokie(data.token);
            setUser(data.user);

            console.log("Login exitoso:", { token: data.token, user: data.user }); // Debug

            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error en login:", error); // Debug
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            // Llamar al endpoint de logout del servidor
            await fetch(`${SERVER_URL}/logout`, {
                method: "POST",
                credentials: "include",
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error("Error al hacer logout en el servidor:", error);
        } finally {
            // Limpiar datos locales siempre
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            setAuthCokie(null);
            setUser(null);
        }
    };

    // Función para obtener headers de autenticación
    const getAuthHeaders = () => {
        const token = authCokie || localStorage.getItem('authToken') ||
            document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    // Utilidad para fetch autenticado - MODIFICACIÓN MÍNIMA PARA FORMDATA
    const authenticatedFetch = async (url, options = {}) => {
        const token = authCokie || localStorage.getItem('authToken') ||
            document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

        // Detectar si se está enviando FormData
        const isFormData = options.body instanceof FormData;

        const config = {
            ...options,
            credentials: 'include',
            headers: {
                // Solo agregar Content-Type si NO es FormData
                ...(!isFormData && { 'Content-Type': 'application/json' }),
                // Siempre agregar Authorization si hay token
                ...(token && { 'Authorization': `Bearer ${token}` }),
                // Mantener headers adicionales
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            
            // Si el token expiró o es inválido, hacer logout automático
            if (response.status === 401) {
                console.log("Token expirado o inválido, haciendo logout automático...");
                logout();
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    // Convertimos isAuthenticated en un valor computado, no una función
    const isAuthenticated = !!(user && authCokie);

    // Verificar si el usuario tiene un rol específico
    const hasRole = (role) => {
        return user?.userType === role;
    };

    // Verificar si el usuario tiene alguno de los roles permitidos
    const hasAnyRole = (roles) => {
        return roles.includes(user?.userType);
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("user");
        
        console.log("useEffect - Checking stored auth:", { token, savedUser }); // Debug
        
        if (token && savedUser && savedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setAuthCokie(token);
                console.log("Auth restored from localStorage:", { token, user: parsedUser }); // Debug
            } catch (error) {
                console.error("Error parsing saved user:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("authToken");
            }
        }
        
        setIsLoading(false); // Terminamos la carga inicial
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                authCokie,
                Login,
                logout,
                authenticatedFetch,
                isAuthenticated, // Ahora es un valor, no una función
                isLoading,
                setUser,
                setAuthCokie,
                getAuthHeaders,
                hasRole,
                hasAnyRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);