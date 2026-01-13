import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                login(response.data.token, response.data.user);
                navigate('/admin');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-gray-900/80 p-8 border border-gray-700 backdrop-blur">
            <h2 className="text-3xl font-bold text-center text-white mb-6 text-glow-white">ACCESO ADMIN</h2>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 mb-4 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-400 mb-2">EMAIL</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black border border-gray-600 text-white p-3 focus:border-rodetes-pink focus:outline-none transition-colors"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2">CONTRASEÑA</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black border border-gray-600 text-white p-3 focus:border-rodetes-pink focus:outline-none transition-colors"
                        required
                    />
                </div>
                <button type="submit" className="w-full btn-primary bg-rodetes-pink border-rodetes-pink hover:bg-pink-600 text-white">
                    ENTRAR
                </button>
            </form>
        </div>
    );
};

export default Login;
