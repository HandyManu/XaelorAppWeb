import nodemailer from 'nodemailer';
import { config } from '../config.js';

// Usa la variable de entorno FRONTEND_URL o un valor por defecto
const FRONTEND_URL = config.page_url.FRONTEND_URL;
console.log('FRONTEND_URL usado para recovery:', FRONTEND_URL);
/**
 * Configuración del transporter para envío de emails
 */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: config.user.EMAIL,
        pass: config.user.PASSWORD
    }
});

/**
 * Envía un email usando nodemailer
 * @param {string} to - Dirección de email del destinatario
 * @param {string} subject - Asunto del email
 * @param {string} text - Contenido en texto plano
 * @param {string} html - Contenido en formato HTML
 * @returns {Promise} Información del email enviado
 * @throws {Error} Si hay un error en el envío
 */
const sendEmail = async (to, subject, text, html) => {
    // Validar parámetros
    if (!to || !subject || (!text && !html)) {
        throw new Error('Missing required email parameters');
    }

    try {
        const info = await transporter.sendMail({
            from: `"Soporte Zgas Alejandro Murcia" <${config.user.EMAIL}>`,
            to,
            subject,
            text,
            html: html || text // Si no hay HTML, usar el texto plano
        });

        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

/**
 * Genera el enlace de recuperación dinámicamente según la URL del frontend
 * @param {string} email
 * @param {string} code
 * @returns {string}
 */
const generateRecoveryLink = (email, code) => {
    return `${FRONTEND_URL}/recuperar?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`;
};

const HTMLRecoveryEmail = (code, email, recoveryLink) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Recuperación de Contraseña - Xælör</title>
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
        .button {
          display: inline-block;
          margin: 24px auto 0 auto;
          padding: 14px 32px;
          background: #ffe08a;
          color: #232323;
          font-weight: bold;
          font-size: 1rem;
          border-radius: 8px;
          text-decoration: none;
          box-shadow: 0 2px 8px 0 rgba(230,192,104,0.15);
          transition: background 0.2s, color 0.2s;
        }
        .button:hover {
          background: #e6c068;
          color: #13100f;
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
        <h1>Recuperación de Contraseña</h1>
        <p>Hola,<br>
        Recibimos una solicitud para restablecer la contraseña de tu cuenta.<br>
        Usa el siguiente código para continuar:</p>
        <div class="code-container">
          <span class="code">${code}</span>
        </div>
        <p>Este código expirará en 15 minutos.<br>
        Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
        <div style="text-align:center;">
          <a href="${recoveryLink}" class="button">Restablecer Contraseña</a>
        </div>
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
    `;
};

// Verificar la conexión al iniciar
transporter.verify()
    .then(() => console.log('SMTP connection successful'))
    .catch(error => console.error('SMTP connection error:', error));

export { sendEmail, HTMLRecoveryEmail, generateRecoveryLink };