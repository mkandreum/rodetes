import React, { useState } from 'react';
import { useDrags, useDragMutations } from '../../hooks/useDrags';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FileUpload from '../../components/common/FileUpload';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Drag } from '../../types';
import api from '../../api/client';

const AdminDrags = () => {
    const { data: drags, isLoading } = useDrags();
    const { createDrag, updateDrag, deleteDrag } = useDragMutations();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDrag, setEditingDrag] = useState<Partial<Drag> | null>(null);

    if (isLoading) return <Loader />;

    const handleEdit = (drag: Drag) => {
        setEditingDrag(drag);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingDrag({});
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Seguro que quieres eliminar esta Drag?')) {
            await deleteDrag.mutateAsync(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDrag) return;

        try {
            if (editingDrag.id) {
                await updateDrag.mutateAsync({ id: editingDrag.id, ...editingDrag });
            } else {
                await createDrag.mutateAsync(editingDrag);
            }
            setIsModalOpen(false);
            setEditingDrag(null);
        } catch (error) {
            console.error('Error saving drag:', error);
            alert('Error al guardar drag');
        }
    };

    const handleChange = (field: keyof Drag, value: any) => {
        setEditingDrag(prev => prev ? ({ ...prev, [field]: value }) : null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Gestión de Drags</h2>
                <Button onClick={handleCreate} className="bg-rodetes-pink text-white hover:bg-pink-600 border-none flex items-center gap-2">
                    <Plus size={20} /> Nueva Drag
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drags?.map((drag) => (
                    <div key={drag.id} className="bg-gray-900 border border-gray-700 overflow-hidden group">
                        <div className="h-48 overflow-hidden relative">
                            {drag.cover_image_url ? (
                                <img src={drag.cover_image_url} alt={drag.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">No Image</div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(drag)}
                                    className="p-2 bg-blue-600 text-white hover:bg-blue-500 rounded-full shadow-lg"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(drag.id)}
                                    className="p-2 bg-red-600 text-white hover:bg-red-500 rounded-full shadow-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-xl font-bold text-white mb-1" style={{ color: drag.card_color }}>{drag.name}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2">{drag.description}</p>
                        </div>
                    </div>
                ))}

                {drags?.length === 0 && (
                    <p className="text-gray-500 text-center py-8 col-span-3">No hay drags creadas.</p>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDrag?.id ? 'Editar Drag' : 'Nueva Drag'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Nombre</label>
                        <input
                            type="text"
                            value={editingDrag?.name || ''}
                            onChange={e => handleChange('name', e.target.value)}
                            className="w-full bg-black border border-gray-700 text-white p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Instagram (@usuario)</label>
                        <input
                            type="text"
                            value={editingDrag?.instagram || ''}
                            onChange={e => handleChange('instagram', e.target.value)}
                            className="w-full bg-black border border-gray-700 text-white p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Descripción</label>
                        <textarea
                            value={editingDrag?.description || ''}
                            onChange={e => handleChange('description', e.target.value)}
                            className="w-full bg-black border border-gray-700 text-white p-2 h-24"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Color (Hex)</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={editingDrag?.card_color || '#ffffff'}
                                    onChange={e => handleChange('card_color', e.target.value)}
                                    className="h-10 w-10 p-0 border-0"
                                />
                                <input
                                    type="text"
                                    value={editingDrag?.card_color || ''}
                                    onChange={e => handleChange('card_color', e.target.value)}
                                    className="bg-black border border-gray-700 text-white p-2 flex-1"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">URL Foto Portada</label>
                            <input
                                type="text"
                                value={editingDrag?.cover_image_url || ''}
                                onChange={e => handleChange('cover_image_url', e.target.value)}
                                className="w-full bg-black border border-gray-700 text-white p-2"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-rodetes-pink border-none text-white hover:bg-pink-600 mt-6">
                        GUARDAR
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminDrags;
