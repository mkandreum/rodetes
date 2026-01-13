import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar, Users, ShoppingBag, Camera, QrCode, Settings, Shuffle } from 'lucide-react';
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

    const menuItems = [
        { name: 'Dashboard', path: '', icon: null },
        { name: 'Eventos', path: 'events', icon: <Calendar size={20} /> },
        { name: 'Drags', path: 'drags', icon: <Users size={20} /> },
        { name: 'Merch', path: 'merch', icon: <ShoppingBag size={20} /> },
        { name: 'Sorteo', path: 'giveaway', icon: <Shuffle size={20} /> },
        { name: 'Galería', path: 'gallery', icon: <Camera size={20} /> },
        { name: 'Scanner', path: 'scanner', icon: <QrCode size={20} /> },
        { name: 'Ajustes', path: 'settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 p-4">
                <div className="mb-8 hidden md:block">
                    <h2 className="text-xl font-bold text-white px-4">Administración</h2>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const fullPath = item.path ? `/admin/${item.path}` : '/admin';
                        const isActive = location.pathname === fullPath;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-rodetes-pink/20 text-rodetes-pink border-r-2 border-rodetes-pink'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-8 bg-black">
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
    );
};

export default Admin;
