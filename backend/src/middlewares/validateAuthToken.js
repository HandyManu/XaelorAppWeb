import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
    return (req, res, next) => {
        try {
            //1- extraer el token de las cookies 
            const { authToken } = req.cookies;

            //2- validar si existen las cookies
            if (!authToken) {
                return res.status(401).json({
                    message: "Cokies not found, please login",
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
                message: "error"+ error
            });
        };
    }
}