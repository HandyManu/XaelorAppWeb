import jwt from 'jsonwebtoken';
import { config } from "../config.js";

// Middleware para validar token desde Authorization header
export const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // o decoded.userId según tu estructura
        req.user = decoded; // información completa del usuario
        next();
    } catch (error) {
        console.error("Invalid token:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Middleware para validar token desde cookies con control de roles
export const validateAuthToken = (allowedUserTypes = []) => {
    return (req, res, next) => {
        try {
            // Extraer el token de las cookies
            const { authToken } = req.cookies;

            if (!authToken) {
                return res.status(401).json({
                    message: "Authentication required, please login",
                });
            }

            // Verificar el token
            const decoded = jwt.verify(authToken, config.JWT.secret);
            req.user = decoded;
            req.userId = decoded.id; // por consistencia

            // Validar permisos de usuario si se especifican roles
            if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(decoded.userType)) {
                return res.status(403).json({
                    message: "Access denied: insufficient permissions"
                });
            }

            next();
        } catch (error) {
            console.error("Token validation error:", error);
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }
    };
};

// Middleware híbrido que acepta tanto headers como cookies
export const flexibleAuthMiddleware = (allowedUserTypes = []) => {
    return (req, res, next) => {
        // Intentar obtener token del header primero
        let token = req.header('Authorization')?.replace('Bearer ', '');
        
        // Si no hay token en header, intentar cookies
        if (!token) {
            token = req.cookies?.authToken;
        }

        if (!token) {
            return res.status(401).json({ 
                message: "No authentication token provided" 
            });
        }

        try {
            const secret = process.env.JWT_SECRET || config.JWT.secret;
            const decoded = jwt.verify(token, secret);
            
            req.user = decoded;
            req.userId = decoded.id;

            // Validar roles si se especifican
            if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(decoded.userType)) {
                return res.status(403).json({
                    message: "Access denied: insufficient permissions"
                });
            }

            next();
        } catch (error) {
            console.error("Authentication error:", error);
            return res.status(401).json({ 
                message: "Invalid or expired token" 
            });
        }
    };
};

export default authMiddleware;