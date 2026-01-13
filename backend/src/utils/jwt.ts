import jwt from 'jsonwebtoken';
import { Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_rodetes_2026';

export interface UserPayload {
    id: number;
    email: string;
}

export const generateToken = (payload: UserPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): UserPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch (error) {
        return null;
    }
};
