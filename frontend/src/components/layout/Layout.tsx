import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSettings } from '../../hooks/useSettings';
import { useToast } from '../../context/ToastContext';
import { Menu, X, Download } from 'lucide-react';
import { Banner } from './Banner';
import { InstallPrompt } from '../common/InstallPrompt';
import { OnlineStatusIndicator } from '../common/OnlineStatusIndicator';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

const Layout = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const { success } = useToast();
    const location = useLocation();
    const { settings } = useSettings();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { isInstallable, promptInstall } = useInstallPrompt();

    const navLinkClass = (path: string) =>
        `text-lg font-pixel px-4 py-2 touch-target hover:text-rodetes-pink transition-colors touch-feedback ${location.pathname === path ? 'text-rodetes-pink' : 'text-white'}`;

    const mobileNavLinkClass = (path: string) =>
        `text-lg font-pixel py-3 touch-target hover:text-rodetes-pink transition-colors touch-feedback ${location.pathname === path ? 'text-rodetes-pink' : 'text-white'}`;

    const bannerVisible = settings?.promoEnabled && settings?.promoCustomText;
    const bannerHeight = bannerVisible ? 40 : 0;
    const headerHeight = 120; // Increased to accommodate mobile nav row

    return (
        <div className="min-h-screen bg-black text-white font-pixel selection:bg-rodetes-pink selection:text-white flex flex-col">
            <OnlineStatusIndicator />
            <InstallPrompt />
            <Banner />
            {/* Header */}
            <header
                className="fixed w-full z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800 flex flex-col justify-center"
                style={{
                    height: `${headerHeight}px`,
                    top: `${bannerHeight}px`,
                    transition: 'top 0.3s ease'
                }}
            >
                <div className="container mx-auto px-4 flex justify-between items-center h-[70px] relative">
                    <Link to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rodetes-pink to-rodetes-blue hover:opacity-80 transition-opacity">
                        {settings?.appLogoUrl ? (
                            <img src={settings.appLogoUrl} alt="RODETES" className="h-[50px] object-contain" />
                        ) : (
                            "RODETES"
                        )}
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-2">
                        <Link to="/" className={navLinkClass('/')}>INICIO</Link>
                        <Link to="/events" className={navLinkClass('/events')}>EVENTOS</Link>
                        <Link to="/drags" className={navLinkClass('/drags')}>DRAGS</Link>
                        <Link to="/merch" className={navLinkClass('/merch')}>MERCH</Link>
                        <Link to="/gallery" className={navLinkClass('/gallery')}>GALERÍA</Link>
                    </nav>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        {isInstallable && (
                            <button
                                onClick={promptInstall}
                                className="text-rodetes-pink hover:text-white transition-colors p-2 touch-target-lg touch-feedback"
                                title="Instalar App"
                            >
                                <Download size={24} />
                            </button>
                        )}
                        <button
                            className="text-white hover:text-rodetes-pink transition-colors p-2 touch-target-lg touch-feedback"
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
                        >
                            {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {isInstallable && (
                            <button
                                onClick={promptInstall}
                                className="text-rodetes-pink hover:text-white transition-colors font-pixel flex items-center gap-2 touch-feedback"
                                title="Instalar App"
                            >
                                <Download size={18} />
                                <span className="text-sm">INSTALAR</span>
                            </button>
                        )}
                        {isAuthenticated ? (
                            <>
                                <Link to="/admin" className="text-rodetes-blue hover:text-white transition-colors touch-feedback">ADMIN</Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        success('Sesión cerrada correctamente');
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-none text-sm touch-feedback"
                                >
                                    LOGOUT
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-gray-400 hover:text-white text-sm touch-feedback">LOGIN</Link>
                        )}
                    </div>

                    {/* Legacy Dropdown Box Mobile Menu (Classic Style) - Enhanced with animations */}
                    {isMobileOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black/60 z-40 md:hidden"
                                onClick={() => setIsMobileOpen(false)}
                            />
                            {/* Menu */}
                            <div className="absolute top-full right-4 w-72 bg-black border-2 border-white z-50 shadow-[0_0_15px_rgba(255,255,255,0.2)] md:hidden animate-slide-up">
                                <div className="flex flex-col py-2">
                                    <Link to="/" className="text-white hover:bg-gray-800 px-4 py-3 text-lg font-pixel transition-colors touch-target" onClick={() => setIsMobileOpen(false)}>INICIO</Link>
                                    <Link to="/events" className="text-white hover:bg-gray-800 px-4 py-3 text-lg font-pixel transition-colors touch-target" onClick={() => setIsMobileOpen(false)}>EVENTOS</Link>
                                    <Link to="/drags" className="text-white hover:bg-gray-800 px-4 py-3 text-lg font-pixel transition-colors touch-target" onClick={() => setIsMobileOpen(false)}>DRAGS</Link>
                                    <Link to="/merch" className="text-white hover:bg-gray-800 px-4 py-3 text-lg font-pixel transition-colors touch-target" onClick={() => setIsMobileOpen(false)}>MERCH</Link>
                                    <Link to="/gallery" className="text-white hover:bg-gray-800 px-4 py-3 text-lg font-pixel transition-colors touch-target" onClick={() => setIsMobileOpen(false)}>GALERÍA</Link>

                                    <div className="h-px bg-gray-700 my-2 mx-4"></div>

                                    {isAuthenticated ? (
                                        <>
                                            <Link to="/admin" className="text-rodetes-pink hover:bg-gray-800 px-4 py-3 text-lg font-pixel transition-colors touch-target" onClick={() => setIsMobileOpen(false)}>ADMIN PANEL</Link>
                                            <button onClick={() => { logout(); setIsMobileOpen(false); success('Sesión cerrada'); }} className="text-red-500 hover:bg-gray-800 px-4 py-3 text-lg font-pixel text-left transition-colors touch-target">CERRAR SESIÓN</button>
                                        </>
                                    ) : (
                                        <Link to="/login" className="text-gray-400 hover:bg-gray-800 px-4 py-3 text-lg font-pixel transition-colors touch-target" onClick={() => setIsMobileOpen(false)}>LOGIN</Link>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Mobile Scroller Nav (Secondary) - Enhanced with gradient fade */}
                <div className="md:hidden w-full overflow-x-auto flex items-center gap-6 px-4 h-[50px] no-scrollbar border-t border-gray-800/50 bg-black/50 relative">
                    <Link to="/" className={`whitespace-nowrap font-pixel uppercase touch-target touch-feedback ${location.pathname === '/' ? 'text-rodetes-pink' : 'text-gray-300'}`}>INICIO</Link>
                    <Link to="/events" className={`whitespace-nowrap font-pixel uppercase touch-target touch-feedback ${location.pathname === '/events' ? 'text-rodetes-pink' : 'text-gray-300'}`}>EVENTOS</Link>
                    <Link to="/gallery" className={`whitespace-nowrap font-pixel uppercase touch-target touch-feedback ${location.pathname === '/gallery' ? 'text-rodetes-pink' : 'text-gray-300'}`}>GALERÍA</Link>
                    <Link to="/merch" className={`whitespace-nowrap font-pixel uppercase touch-target touch-feedback ${location.pathname === '/merch' ? 'text-rodetes-pink' : 'text-gray-300'}`}>MERCH</Link>
                    <Link to="/drags" className={`whitespace-nowrap font-pixel uppercase touch-target touch-feedback ${location.pathname === '/drags' ? 'text-rodetes-pink' : 'text-gray-300'}`}>DRAGS</Link>
                    {/* Gradient fade indicator */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/50 to-transparent pointer-events-none"></div>
                </div>
            </header>

            {/* Main Content */}
            <main
                className="flex-1 container mx-auto px-4 py-8"
                style={{ marginTop: `${bannerHeight + headerHeight}px` }}
            >
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 bg-black mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500 font-pixel">
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
