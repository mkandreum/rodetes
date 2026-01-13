import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Layout = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const location = useLocation();

    const navLinkClass = (path: string) =>
        `text-lg font-pixel px-4 py-2 hover:text-rodetes-pink transition-colors ${location.pathname === path ? 'text-rodetes-pink' : 'text-white'}`;

    return (
        <div className="min-h-screen flex flex-col bg-black text-white font-pixel">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black/90 sticky top-0 z-50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rodetes-pink to-rodetes-blue hover:opacity-80 transition-opacity">
                        RODETES
                    </Link>

                    <nav className="hidden md:flex gap-2">
                        <Link to="/" className={navLinkClass('/')}>INICIO</Link>
                        <Link to="/events" className={navLinkClass('/events')}>EVENTOS</Link>
                        <Link to="/drags" className={navLinkClass('/drags')}>DRAGS</Link>
                        <Link to="/merch" className={navLinkClass('/merch')}>MERCH</Link>
                        <Link to="/gallery" className={navLinkClass('/gallery')}>GALERÍA</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/admin" className="text-rodetes-blue hover:text-white transition-colors">ADMIN</Link>
                                <button
                                    onClick={logout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-none text-sm"
                                >
                                    LOGOUT
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-gray-400 hover:text-white text-sm">LOGIN</Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 bg-black mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500">
                    <p>© 2026 RODETES PARTY. Todos los derechos reservados.</p>
                    <div className="flex justify-center gap-4 mt-4">
                        <a href="#" className="hover:text-rodetes-pink">Instagram</a>
                        <a href="#" className="hover:text-rodetes-pink">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
