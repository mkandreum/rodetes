import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../context/ToastContext';
import { Calendar, Users, ShoppingBag, Camera, QrCode, Settings, Shuffle, LogOut } from 'lucide-react';
import Button from '../components/common/Button';
import AdminDashboard from './admin/AdminDashboard';
import AdminEvents from './admin/AdminEvents';
import AdminDrags from './admin/AdminDrags';
import AdminMerch from './admin/AdminMerch';
import AdminGallery from './admin/AdminGallery';
import AdminScanner from './admin/AdminScanner';
import AdminSettings from './admin/AdminSettings';
import AdminGiveaway from './admin/AdminGiveaway';

const Admin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { success } = useToast();

    const handleLogout = () => {
        logout();
        success('Sesión cerrada correctamente');
        navigate('/login');
    };

    const menuItems = [
        { name: 'DASHBOARD', path: '', icon: <Settings size={20} /> }, // Using Settings as placeholder or import LayoutDashboard
        { name: 'EVENTOS', path: 'events', icon: <Calendar size={20} /> },
        { name: 'DRAGS', path: 'drags', icon: <Users size={20} /> },
        { name: 'MERCH', path: 'merch', icon: <ShoppingBag size={20} /> },
        { name: 'SORTEO', path: 'giveaway', icon: <Shuffle size={20} /> },
        { name: 'GALERÍA', path: 'gallery', icon: <Camera size={20} /> },
        { name: 'SCANNER', path: 'scanner', icon: <QrCode size={20} /> },
        { name: 'AJUSTES', path: 'settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-pixel">
            {/* Admin Header (Legacy Style) */}
            <div className="bg-black border-b border-white p-4">
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-300 text-lg">
                        CONECTADO COMO: <span className="text-white font-bold">{user?.email || 'ADMIN'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/admin/scanner">
                            <Button variant="primary" size="sm" className="font-bold">
                                <QrCode size={18} className="mr-2" />
                                ESCANEAR QR
                            </Button>
                        </Link>
                        <Button variant="secondary" size="sm" onClick={handleLogout}>
                            <LogOut size={18} className="mr-2" />
                            CERRAR SESIÓN
                        </Button>
                    </div>
                </div>
            </div>

            {/* Admin Navigation Tabs (Legacy Style) */}
            <div className="bg-black border-b border-white mb-8 sticky top-0 z-30">
                <div className="container mx-auto max-w-6xl overflow-x-auto">
                    <nav className="flex min-w-max">
                        {menuItems.map((item) => {
                            const fullPath = item.path ? `/admin/${item.path}` : '/admin';
                            const isActive = location.pathname === fullPath;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`px-6 py-4 text-xl font-pixel uppercase transition-colors border-r border-gray-800 last:border-r-0 ${isActive
                                        ? 'bg-white text-black'
                                        : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {item.icon}
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto max-w-6xl p-4 md:p-0 mb-20">
                <div className="bg-gray-900 border border-white p-6 shadow-lg shadow-white/5">
                    <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="events" element={<AdminEvents />} />
                        <Route path="drags" element={<AdminDrags />} />
                        <Route path="merch" element={<AdminMerch />} />
                        <Route path="giveaway" element={<AdminGiveaway />} />
                        <Route path="gallery" element={<AdminGallery />} />
                        <Route path="scanner" element={<AdminScanner />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Admin;
