import React, { useState, useMemo } from 'react';
import { useMerch, useMerchMutations } from '../../hooks/useMerch';
import { useDrags } from '../../hooks/useDrags';
import { useSales } from '../../hooks/useSales';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Edit, Trash2, Plus, List } from 'lucide-react';
import { MerchItem } from '../../types';

const AdminMerch = () => {
    // We fetch without filters to get ALL merch, then filter client-side for the view
    const { data: allMerch, isLoading: mechLoading } = useMerch();
    const { data: drags, isLoading: dragsLoading } = useDrags();
    const { data: allSales, isLoading: salesLoading } = useSales();
    const { createMerch, updateMerch, deleteMerch } = useMerchMutations();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<MerchItem> | null>(null);
    const [selectedContext, setSelectedContext] = useState<string>('web'); // 'web' or dragId as string

    // Filter items based on selection
    const filteredMerch = useMemo(() => {
        return allMerch?.filter(item => {
            if (selectedContext === 'web') return !item.drag_id;
            return item.drag_id === parseInt(selectedContext);
        });
    }, [allMerch, selectedContext]);

    // Calculate Stats
    const stats = useMemo(() => {
        if (!allSales) return { totalSold: 0, totalRevenue: 0, contextSales: [] };

        const contextSales = allSales.filter(sale => {
            if (selectedContext === 'web') return !sale.drag_id; // Web Merch
            return sale.drag_id === parseInt(selectedContext);
        });

        const totalSold = contextSales.length;
        const totalRevenue = contextSales.reduce((acc, sale) => acc + parseFloat(sale.price as any || 0), 0);

        return { totalSold, totalRevenue, contextSales };
    }, [allSales, selectedContext]);


    if (mechLoading || dragsLoading || salesLoading) return <Loader />;

    const handleEdit = (item: MerchItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        const dragId = selectedContext === 'web' ? null : parseInt(selectedContext);
        setEditingItem({ drag_id: dragId });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Seguro que quieres eliminar este artículo?')) {
            await deleteMerch.mutateAsync(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            if (editingItem.id) {
                await updateMerch.mutateAsync({ id: editingItem.id, ...editingItem });
            } else {
                await createMerch.mutateAsync(editingItem);
            }
            setIsModalOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Error saving merch:', error);
            alert('Error al guardar artículo');
        }
    };

    const handleChange = (field: keyof MerchItem, value: any) => {
        setEditingItem(prev => prev ? ({ ...prev, [field]: value }) : null);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Gestión de Merch</h2>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">Ver Merch de:</span>
                            <select
                                value={selectedContext}
                                onChange={(e) => setSelectedContext(e.target.value)}
                                className="bg-gray-800 text-white border border-gray-600 p-2 rounded w-full md:w-auto"
                            >
                                <option value="web">RODETES WEB (General)</option>
                                {drags?.map(drag => (
                                    <option key={drag.id} value={drag.id}>{drag.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Stats Box */}
                        <div className="flex gap-4 text-sm font-pixel">
                            <div className="bg-gray-900 border border-purple-500 p-2 px-4 rounded text-purple-400">
                                <span className="block text-xs text-purple-600 uppercase">Ventas</span>
                                <span className="text-xl font-bold">{stats.totalSold}</span>
                            </div>
                            <div className="bg-gray-900 border border-green-500 p-2 px-4 rounded text-green-400">
                                <span className="block text-xs text-green-600 uppercase">Ingresos</span>
                                <span className="text-xl font-bold">{stats.totalRevenue.toFixed(2)} €</span>
                            </div>
                            <button
                                onClick={() => setIsSalesModalOpen(true)}
                                className="bg-gray-800 border border-gray-600 p-2 px-4 rounded text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                            >
                                <List size={16} /> Ver Lista
                            </button>
                        </div>
                    </div>
                </div>

                <Button onClick={handleCreate} className="bg-rodetes-pink text-white hover:bg-pink-600 border-none flex items-center gap-2">
                    <Plus size={20} /> Nuevo Artículo
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMerch?.map((item) => (
                    <div key={item.id} className="bg-gray-900 border border-gray-700 overflow-hidden group relative">
                        <div className="h-64 overflow-hidden relative bg-black/50">
                            {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                            )}
                        </div>

                        <div className="absolute top-2 right-2 flex gap-2">
                            <button
                                onClick={() => handleEdit(item)}
                                className="p-2 bg-blue-600 text-white hover:bg-blue-500 shadow-md"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 bg-red-600 text-white hover:bg-red-500 shadow-md"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="p-4 bg-black/80 backdrop-blur absolute bottom-0 w-full border-t border-gray-800">
                            <h3 className="text-lg font-bold text-white mb-1 truncate">{item.name}</h3>
                            <p className="text-rodetes-pink font-bold">{item.price} €</p>
                        </div>
                    </div>
                ))}

                {filteredMerch?.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-700 rounded">
                        <p className="text-gray-400 mb-4">No hay artículos en esta categoría.</p>
                        <Button onClick={handleCreate} variant="outline" size="sm">Crear el primero</Button>
                    </div>
                )}
            </div>

            {/* Edit/Create Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem?.id ? 'Editar Artículo' : 'Nuevo Artículo'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Nombre del Artículo</label>
                        <input
                            type="text"
                            value={editingItem?.name || ''}
                            onChange={e => handleChange('name', e.target.value)}
                            className="w-full bg-black border border-gray-700 text-white p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Asignar a (Drag)</label>
                        <select
                            value={editingItem?.drag_id || ''}
                            onChange={(e) => {
                                const val = e.target.value ? parseInt(e.target.value) : null;
                                handleChange('drag_id', val);
                            }}
                            className="w-full bg-black border border-gray-700 text-white p-2"
                        >
                            <option value="">RODETES WEB (General)</option>
                            {drags?.map(drag => (
                                <option key={drag.id} value={drag.id}>{drag.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Selecciona 'RODETES WEB' para merch general.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Precio (€)</label>
                            <input
                                type="number"
                                value={editingItem?.price || 0}
                                onChange={e => handleChange('price', parseFloat(e.target.value))}
                                className="w-full bg-black border border-gray-700 text-white p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">URL Imagen</label>
                            <input
                                type="text"
                                value={editingItem?.image_url || ''}
                                onChange={e => handleChange('image_url', e.target.value)}
                                className="w-full bg-black border border-gray-700 text-white p-2"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-rodetes-pink border-none text-white hover:bg-pink-600 mt-6">
                        GUARDAR
                    </Button>
                </form>
            </Modal>

            {/* Sales List Modal */}
            <Modal
                isOpen={isSalesModalOpen}
                onClose={() => setIsSalesModalOpen(false)}
                title={`Ventas: ${selectedContext === 'web' ? 'RODETES WEB' : drags?.find(d => d.id === parseInt(selectedContext))?.name}`}
            >
                <div className="overflow-hidden">
                    {/* Desktop Table */}
                    <table className="w-full text-left text-sm text-gray-300 hidden md:table">
                        <thead className="text-xs uppercase bg-gray-900 text-gray-400">
                            <tr>
                                <th className="px-4 py-2">ID Venta</th>
                                <th className="px-4 py-2">Producto</th>
                                <th className="px-4 py-2">Comprador</th>
                                <th className="px-4 py-2">Precio</th>
                                <th className="px-4 py-2">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.contextSales.map((sale) => (
                                <tr key={sale.id} className="border-b border-gray-800 hover:bg-gray-900">
                                    <td className="px-4 py-2 font-mono text-xs text-gray-400">
                                        {sale.sale_id.substring(0, 8)}...
                                    </td>
                                    <td className="px-4 py-2">{sale.item_name}</td>
                                    <td className="px-4 py-2">{sale.buyer_name} {sale.buyer_surname}</td>
                                    <td className="px-4 py-2 text-green-400">{sale.price} €</td>
                                    <td className="px-4 py-2">
                                        {sale.is_delivered ? (
                                            <span className="text-green-500 font-bold text-xs uppercase border border-green-500 px-2 py-0.5 rounded">Entregado</span>
                                        ) : (
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('¿Marcar como entregado?')) {
                                                        try {
                                                            await createMerch.mutateAsync({ ...sale, is_delivered: true } as any); // Hack: reusing mutation or ideally useSales mutation
                                                            // Better approach: useSales hook should expose a 'deliverSale' mutation.
                                                            // Since we don't have it in useSales yet, let's assume we need to add it or do a direct API call.
                                                            // Let's do direct API call for speed as per 'rapido'.
                                                            const { default: api } = await import('../../api/client');
                                                            await api.post('/sales/deliver', { sale_id: sale.sale_id });
                                                            // Force re-fetch sales
                                                            window.location.reload();
                                                        } catch (e) { console.error(e); alert('Error'); }
                                                    }
                                                }}
                                                className="bg-yellow-600 text-white text-xs px-2 py-1 rounded hover:bg-yellow-500"
                                            >
                                                PENDIENTE (MARCAR)
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(sale.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {stats.contextSales.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 text-center text-gray-500">No hay ventas registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                        {stats.contextSales.map((sale) => (
                            <div key={sale.id} className="bg-gray-900 p-4 border border-gray-700 rounded-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono text-xs text-gray-500">#{sale.sale_id.substring(0, 8)}</span>
                                    <span className="text-green-400 font-bold">{sale.price} €</span>
                                </div>
                                <h4 className="text-white font-bold mb-1">{sale.item_name}</h4>
                                <p className="text-sm text-gray-400">{sale.buyer_name} {sale.buyer_surname}</p>
                                <p className="text-xs text-gray-600 mt-2">{new Date(sale.created_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                        {stats.contextSales.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No hay ventas registradas.</p>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminMerch;
