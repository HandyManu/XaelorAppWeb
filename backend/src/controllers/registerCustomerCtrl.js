import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

import clientsModel from "../models/customersMdl.js";
import { config } from "../config.js";

const registerClientsController = {};

// Registro de cliente
registerClientsController.register = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        // Verificar si el cliente ya existe
        const existingClient = await clientsModel.findOne({ email });
        if (existingClient) {
            return res.json({ message: "Client already exists" });
        }

        // Encriptar la contraseña
        const passwordHash = await bcryptjs.hash(password, 10);

        // Crear el cliente con isVerified en false
        const newClient = new clientsModel({
            name,
            email,
            password: passwordHash,
            phone,
            membership: {
                membershipId: null,
                startDate: null,
                status: "Sin membresía"
            },
            isVerified: false // <-- Campo agregado
        });

        await newClient.save();

        // Generar código de verificación
        const verificationcode = crypto.randomBytes(3).toString("hex");

        // Generar token con el código de verificación
        const tokenCode = jsonwebtoken.sign(
            { email, verificationcode },
            config.JWT.secret,
            { expiresIn: "2h" }
        );

        res.cookie("verificationToken", tokenCode, { maxAge: 2 * 60 * 60 * 1000 });

        // Configurar el transporter de nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.email_user,
                pass: config.email.email_pass,
            },
        });

        // Opciones del correo
        const mailoptions = {
            from: config.email.email_user,
            to: email,
            subject: "Confirmación de cuenta",
            html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <title>Confirmación de Cuenta - Xælör</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  background: #13100f;
                  margin: 0;
                  padding: 0;
                  font-family: 'Segoe UI', 'Arial', sans-serif;
                  color: #ffe08a;
                }
                .container {
                  max-width: 480px;
                  margin: 32px auto;
                  background: linear-gradient(135deg, #181512 80%, #232323 100%);
                  border-radius: 18px;
                  box-shadow: 0 4px 32px 0 rgba(230,192,104,0.10);
                  padding: 32px 24px 24px 24px;
                  border: 1.5px solid #2c261a;
                }
                .logo {
                  font-size: 2.2rem;
                  font-weight: bold;
                  letter-spacing: 2px;
                  color: #ffe08a;
                  text-align: center;
                  margin-bottom: 8px;
                  text-shadow: 0 0 12px #e6c068, 0 0 2px #232323;
                }
                h1 {
                  text-align: center;
                  color: #ffe08a;
                  font-size: 1.5rem;
                  margin: 0 0 18px 0;
                  font-weight: 600;
                }
                p {
                  color: #ffe08a;
                  font-size: 1rem;
                  margin-bottom: 18px;
                  text-align: center;
                }
                .code-container {
                  background: #232323;
                  border-radius: 12px;
                  border: 1.5px solid #e6c068;
                  margin: 24px 0;
                  padding: 18px 0;
                  text-align: center;
                  box-shadow: 0 2px 12px 0 rgba(230,192,104,0.08);
                }
                .code {
                  font-size: 2rem;
                  font-weight: bold;
                  color: #ffe08a;
                  letter-spacing: 8px;
                  font-family: 'Segoe UI Mono', 'Consolas', monospace;
                  text-shadow: 0 0 8px #e6c068;
                }
                .footer {
                  margin-top: 32px;
                  text-align: center;
                  color: #bfa14a;
                  font-size: 0.85rem;
                  border-top: 1px solid #232323;
                  padding-top: 16px;
                }
                .warning {
                  color: #ff4b4b;
                  font-size: 0.95rem;
                  margin-top: 18px;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo">Xælör</div>
                <h1>Confirmación de Cuenta</h1>
                <p>Hola,<br>
                Ingresa este código para confirmar tu cuenta:</p>
                <div class="code-container">
                  <span class="code">${verificationcode}</span>
                </div>
                <p>Este código expirará en 2 horas.<br>
                Si no solicitaste este registro, puedes ignorar este mensaje.</p>
                <div class="warning">
                  * No compartas este código con nadie. El equipo de Xælör nunca te lo pedirá.
                </div>
                <div class="footer">
                  © ${new Date().getFullYear()} Xælör. Todos los derechos reservados.<br>
                  Este es un mensaje automático, por favor no responder.
                </div>
              </div>
            </body>
            </html>
            `
        };

        // Enviar el correo y responder solo una vez
        transporter.sendMail(mailoptions, (error, info) => {
            if (error) {
                return res.json({ message: "Error sending mail: " + error });
            }
            console.log("Email sent: " + info.response);
            // Solo respondemos aquí, después de enviar el correo
            res.json({
                message: "Client registered. Please verify your email with the code sent.",
            });
        });

    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: "Server error" });
    }
};

// Verificación de código de email
registerClientsController.verifyCodeEmail = async (req, res) => {
    const { requireCode } = req.body;
    const token = req.cookies.verificationToken;

    try {
        // Verificar y decodificar el token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
        const { email, verificationcode: storedCode } = decoded;

        // Comparar el código recibido con el almacenado
        if (requireCode !== storedCode) {
            return res.json({ message: "Invalid code" });
        }

        // Marcar al cliente como verificado
        const client = await clientsModel.findOne({ email });
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        client.isVerified = true; // <-- Actualiza el campo
        await client.save();

        res.clearCookie("verificationToken");
        res.json({ message: "Email verified Successfully" });

    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: "Server error" });
    }
};

export default registerClientsController;