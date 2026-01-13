import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSettings } from '../../hooks/useSettings';
import { useToast } from '../../context/ToastContext';
import { Menu, X } from 'lucide-react';
import { Banner } from './Banner';

const Layout = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const { success } = useToast();
    const location = useLocation();
    const { settings } = useSettings();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navLinkClass = (path: string) =>
        `text-lg font-pixel px-4 py-2 hover:text-rodetes-pink transition-colors ${location.pathname === path ? 'text-rodetes-pink' : 'text-white'}`;

    const mobileNavLinkClass = (path: string) =>
        `text-2xl font-pixel py-4 hover:text-rodetes-pink transition-colors ${location.pathname === path ? 'text-rodetes-pink' : 'text-white'}`;

    const bannerVisible = settings?.promoEnabled && settings?.promoCustomText;
    const bannerHeight = bannerVisible ? 40 : 0;
    const headerHeight = 120; // Increased to accommodate mobile nav row

    return (
        <div className="min-h-screen bg-black text-white font-pixel selection:bg-rodetes-pink selection:text-white flex flex-col">
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
                <div className="container mx-auto px-4 flex justify-between items-center h-[70px]">
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
                    <button
                        className="md:hidden text-white hover:text-rodetes-pink transition-colors"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>

                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/admin" className="text-rodetes-blue hover:text-white transition-colors">ADMIN</Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        success('Sesión cerrada correctamente');
                                    }}
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

                {/* Mobile Scroller Nav */}
                <div className="md:hidden w-full overflow-x-auto flex items-center gap-4 px-4 h-[50px] no-scrollbar border-t border-gray-800/50">
                    <Link to="/" className={`whitespace-nowrap ${location.pathname === '/' ? 'text-rodetes-pink' : 'text-gray-300'}`}>INICIO</Link>
                    <Link to="/events" className={`whitespace-nowrap ${location.pathname === '/events' ? 'text-rodetes-pink' : 'text-gray-300'}`}>EVENTOS</Link>
                    <Link to="/gallery" className={`whitespace-nowrap ${location.pathname === '/gallery' ? 'text-rodetes-pink' : 'text-gray-300'}`}>GALERÍA</Link>
                    <Link to="/merch" className={`whitespace-nowrap ${location.pathname === '/merch' ? 'text-rodetes-pink' : 'text-gray-300'}`}>MERCH</Link>
                    <Link to="/drags" className={`whitespace-nowrap ${location.pathname === '/drags' ? 'text-rodetes-pink' : 'text-gray-300'}`}>DRAGS</Link>
                </div>

                {/* Mobile Menu Overlay (Translucent Full Screen) */}
                {isMobileOpen && (
                    <div
                        className="md:hidden fixed inset-x-0 bottom-0 bg-black/90 backdrop-blur-md z-40 flex flex-col items-center justify-start pt-12 gap-6"
                        style={{
                            top: `${bannerHeight + headerHeight}px`
                        }}
                    >
                        <Link to="/" className={mobileNavLinkClass('/')} onClick={() => setIsMobileOpen(false)}>INICIO</Link>
                        <Link to="/events" className={mobileNavLinkClass('/events')} onClick={() => setIsMobileOpen(false)}>EVENTOS</Link>
                        <Link to="/drags" className={mobileNavLinkClass('/drags')} onClick={() => setIsMobileOpen(false)}>DRAGS</Link>
                        <Link to="/merch" className={mobileNavLinkClass('/merch')} onClick={() => setIsMobileOpen(false)}>MERCH</Link>
                        <Link to="/gallery" className={mobileNavLinkClass('/gallery')} onClick={() => setIsMobileOpen(false)}>GALERÍA</Link>

                        <div className="w-16 h-[1px] bg-gray-800 my-4"></div>

                        {isAuthenticated ? (
                            <>
                                <Link to="/admin" className="text-xl text-rodetes-blue" onClick={() => setIsMobileOpen(false)}>ADMIN PANEL</Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        success('Sesión cerrada correctamente');
                                        setIsMobileOpen(false);
                                    }}
                                    className="text-xl text-red-500 font-pixel mt-4"
                                >
                                    LOGOUT
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-xl text-gray-400" onClick={() => setIsMobileOpen(false)}>LOGIN</Link>
                        )}
                    </div>
                )}
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
