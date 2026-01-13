import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../models/db';
import { generateToken } from '../utils/jwt';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    try {
        // 1. Check if user exists in DB
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);

        // 2. Fallback for initial setup (if DB is empty or specific admin email)
        // This replicates the behavior of the PHP app for the default admin
        const defaultRes = process.env.ADMIN_EMAIL || 'admin@rodetes.com';
        const defaultPass = process.env.ADMIN_PASSWORD || 'rodetes'; // Note: PHP used 'admin' default but user said 'rodetes' worked.

        if (result.rows.length === 0) {
            // Check hardcoded/env admin if not in DB
            if (email === defaultRes && password === defaultPass) {
                // Create a synthetic user object
                const token = generateToken({ id: 0, email: email });
                return res.json({ success: true, token, user: { email } });
            }
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = result.rows[0];

        // 3. Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 4. Generate Token
        const token = generateToken({ id: user.id, email: user.email });

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getMe = (req: Request, res: Response) => {
    res.json({ user: req.user });
};
