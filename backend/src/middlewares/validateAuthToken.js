import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";
import jwt from 'jsonwebtoken';

// Middleware para validar el token desde los headers
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Adjuntar el ID del usuario al objeto de la solicitud
        next();
    } catch (error) {
        console.error("Invalid token:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

export const validateAuthToken = (allowedUserTypes = []) => {
    return (req, res, next) => {
        try {
            //1- extraer el token de las cookies 
            const { authToken } = req.cookies;

            //2- validar si existen las cookies
            if (!authToken) {
                return res.status(401).json({
                    message: "Cookies not found, please login",
                });
            }
            //3- extraemos la información del token
            const decoded = jsonwebtoken.verify(authToken, config.JWT.secret);
            req.user = decoded;

            //4- Validar si el usuario tiene permisos para acceder a la ruta
            if (!allowedUserTypes.includes(decoded.userType)) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
            next();
        }
        catch (error) {
            return res.status(401).json({
                message: "error" + error
            });
        };
    }
};

export default authMiddleware;