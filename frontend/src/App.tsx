import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Drags from './pages/Drags';
import Merch from './pages/Merch';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) return <div>Cargando...</div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <>{children}</>;
};

function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="events" element={<Events />} />
                    <Route path="drags" element={<Drags />} />
                    <Route path="merch" element={<Merch />} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="login" element={<Login />} />

                    <Route
                        path="admin/*"
                        element={
                            <ProtectedRoute>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
