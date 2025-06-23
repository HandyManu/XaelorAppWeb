import customerModel from "../models/customersMdl.js";
import employeeModel from "../models/employeesMdl.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

loginController.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let userFound;
        let userType;

        // Admin
        if (email === config.emailAdmin.email && password === config.emailAdmin.password) {
            userType = "admin";
            userFound = { 
                _id: "admin", 
                email: config.emailAdmin.email,
                name: "Administrator" 
            };
        } else {
            userFound = await employeeModel.findOne({ email });
            userType = "employee";

            if (!userFound) {
                userFound = await customerModel.findOne({ email });
                userType = "customer";
            }
        }

        if (!userFound) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (userType !== "admin") {
            const isMatch = await bcrypt.compare(password, userFound.password);
            if (!isMatch) {
                console.log("Contraseña incorrecta");
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }
        }

        // Token
        jwt.sign(
            { id: userFound._id, userType },
            config.JWT.secret,
            { expiresIn: config.JWT.expiresIn },
            (error, token) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Error generating token" });
                }
                
                // Enviar cookie
                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 24 * 60 * 60 * 1000 // 24 horas
                });
                
                res.cookie('userType', userType, {
                    httpOnly: false, // Para que el frontend pueda leerla
                    sameSite: 'lax', // O 'strict' según tu flujo
                    // secure: true, // Solo si usas HTTPS
                });
                
                // Datos del usuario para enviar (sin password)
                const userData = {
                    id: userFound._id,
                    email: userFound.email,
                    name: userFound.name || userFound.firstName || "Usuario",
                    userType: userType
                };
                
                // Respuesta JSON con token y usuario
                res.json({ 
                    message: "Logged in successfully",
                    token: token,
                    user: userData
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export default loginController;