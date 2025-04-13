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
        if (email === config.emailAdmin.email && password === config.passwordAdmin.password) {
            userType = "admin";
            userFound = { _id: "admin" };
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
            config.JWT.SECRET,
            { expiresIn: config.JWT.EXPIRES_IN },
            (error, token) => {
                if (error ) console.log(error);
                res.cookie("authToken",token)
                res.json({ message: "Logged in successfully" });
                
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export default loginController;