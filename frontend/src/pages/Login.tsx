import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import api from '../api/client';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                login(response.data.token, response.data.user);
                navigate('/admin');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-black p-8 border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <h2 className="text-4xl font-bold text-center text-white mb-8 font-pixel style-text-shadow-white tracking-widest">
                ACCESO ADMIN
            </h2>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-white font-pixel p-3 mb-6 text-center text-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-white font-pixel text-xl mb-2 tracking-wider">EMAIL</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black border border-white text-white p-3 font-pixel text-xl focus:border-rodetes-pink focus:ring-1 focus:ring-rodetes-pink focus:outline-none transition-colors rounded-none placeholder-gray-600"
                        required
                    />
                </div>
                <div>
                    <label className="block text-white font-pixel text-xl mb-2 tracking-wider">CONTRASEÑA</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black border border-white text-white p-3 font-pixel text-xl focus:border-rodetes-pink focus:ring-1 focus:ring-rodetes-pink focus:outline-none transition-colors rounded-none"
                        required
                    />
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        variant="neon"
                        isLoading={isLoading}
                        className="w-full py-4 text-xl"
                    >
                        ENTRAR AL SISTEMA
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Login;
