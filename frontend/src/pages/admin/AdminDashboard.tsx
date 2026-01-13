const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Panel de Control</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 border border-gray-700 p-6">
                    <h3 className="text-xl text-gray-400 mb-2">Eventos Activos</h3>
                    <p className="text-4xl text-rodetes-pink font-bold">3</p>
                </div>
                <div className="bg-gray-900 border border-gray-700 p-6">
                    <h3 className="text-xl text-gray-400 mb-2">Drags</h3>
                    <p className="text-4xl text-rodetes-blue font-bold">12</p>
                </div>
                <div className="bg-gray-900 border border-gray-700 p-6">
                    <h3 className="text-xl text-gray-400 mb-2">Ventas de hoy</h3>
                    <p className="text-4xl text-white font-bold">0 €</p>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 p-6 mt-8">
                <h3 className="text-xl text-white mb-4">Accesos Rápidos</h3>
                <p className="text-gray-400">Selecciona una opción del menú lateral para comenzar a gestionar el contenido.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
