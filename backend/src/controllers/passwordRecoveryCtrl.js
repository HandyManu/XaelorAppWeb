import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

import customersMdl from '../models/customersMdl.js';
import employeesMdl from '../models/employeesMdl.js';

import { config } from '../config.js';
import { sendEmail, HTMLRecoveryEmail, generateRecoveryLink } from '../utils/mailPasswordRecovery.js';

const passwordRecoveryCtrl = {};

// Constantes reutilizables
const TOKEN_EXPIRATION_SHORT = '20m';
const TOKEN_EXPIRATION_LONG = '20m';
const COOKIE_MAX_AGE = 20 * 60 * 1000;

passwordRecoveryCtrl.requestCode = async (req, res) => {
    const { email } = req.body;

    // Validar entrada
    if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        // Buscar usuario en ambas colecciones
        const userFound = await customersMdl.findOne({ email }) || await employeesMdl.findOne({ email });
        const userType = userFound ? (await customersMdl.findOne({ email }) ? 'customer' : 'employee') : null;

        if (!userFound) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generar código de verificación
        const verificationCode = crypto.randomBytes(3).toString('hex');

        // Crear token JWT
        const token = jsonwebtoken.sign(
            { email, verificationCode, userType, verified: false },
            config.JWT.secret,
            { expiresIn: TOKEN_EXPIRATION_SHORT }
        );

        // Configurar cookie y enviar respuesta
        res.cookie("tokenRecoveryCode", token, { maxAge: COOKIE_MAX_AGE, httpOnly: true });
        res.status(200).json({ message: 'Verification code sent' });

        // Enviar correo electrónico
        const recoveryLink = generateRecoveryLink(email, verificationCode);
        const html = HTMLRecoveryEmail(verificationCode, email, recoveryLink);
        await sendEmail(
            email,
            'Recuperación de contraseña',
            `Tu código de verificación es: ${verificationCode}`,
            html
        );

    } catch (error) {
        console.error('Error in requestCode:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

passwordRecoveryCtrl.verifyCode = async (req, res) => {
    const { code } = req.body;

    // Validar entrada
    if (!code || typeof code !== 'string') {
        return res.status(400).json({ message: 'Invalid code format' });
    }

    try {
        const token = req.cookies.tokenRecoveryCode;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Decodificar el token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        // Verificar si el código es correcto
        if (decoded.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Generar un nuevo token
        const newToken = jsonwebtoken.sign(
            { email: decoded.email, userType: decoded.userType, verified: true },
            config.JWT.secret,
            { expiresIn: TOKEN_EXPIRATION_LONG }
        );

        // Configurar nueva cookie y enviar respuesta
        res.cookie("tokenRecoveryCode", newToken, { maxAge: COOKIE_MAX_AGE, httpOnly: true });
        res.status(200).json({ message: 'Verification code verified' });

    } catch (error) {
        console.error('Error in verifyCode:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.status(500).json({ message: 'Server error' });
    }
};

passwordRecoveryCtrl.newPassword = async (req, res) => {
    const { password } = req.body;

    // Validar entrada
    if (!password || typeof password !== 'string') {
        return res.status(400).json({ message: 'Invalid password format' });
    }

    try {
        const token = req.cookies.tokenRecoveryCode;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Decodificar el token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        // Verificar si el código fue verificado
        if (!decoded.verified) {
            return res.status(400).json({ message: 'Verification code not verified' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Actualizar la contraseña en la base de datos según el tipo de usuario
        if (decoded.userType === 'customer') {
            await customersMdl.updateOne({ email: decoded.email }, { password: hashedPassword });
        } else if (decoded.userType === 'employee') {
            await employeesMdl.updateOne({ email: decoded.email }, { password: hashedPassword });
        }

        // Eliminar la cookie y enviar respuesta
        res.clearCookie("tokenRecoveryCode");
        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Error in newPassword:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.status(500).json({ message: 'Server error' });
    }
}
export default passwordRecoveryCtrl;