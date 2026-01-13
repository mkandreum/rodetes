import React, { useState } from 'react';
import { useAdminEvents, useEventMutations } from '../../hooks/useEvents';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FileUpload from '../../components/common/FileUpload';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Event } from '../../types';
import api from '../../api/client';

const AdminEvents = () => {
    const { data: events, isLoading } = useAdminEvents();
    const { createEvent, updateEvent, deleteEvent } = useEventMutations();
    const { success, error } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);

    if (isLoading) return <Loader />;

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingEvent({});
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Seguro que quieres eliminar este evento?')) {
            await deleteEvent.mutateAsync(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        try {
            if (editingEvent.id) {
                await updateEvent.mutateAsync({ id: editingEvent.id, ...editingEvent });
            } else {
                await createEvent.mutateAsync(editingEvent);
            }
            setIsModalOpen(false);
            setEditingEvent(null);
            success('Evento guardado correctamente');
        } catch (err) {
            console.error('Error saving event:', err);
            error('Error al guardar el evento');
        }
    };

    const handleChange = (field: keyof Event, value: any) => {
        setEditingEvent(prev => prev ? ({ ...prev, [field]: value }) : null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Gestión de Eventos</h2>
                <Button onClick={handleCreate} className="bg-rodetes-pink text-white hover:bg-pink-600 border-none flex items-center gap-2">
                    <Plus size={20} /> Nuevo Evento
                </Button>
            </div>

            <div className="grid gap-4">
                {events?.map((event) => (
                    <div key={event.id} className="bg-gray-900 border border-gray-700 p-4 flex justify-between items-center group hover:border-rodetes-pink transition-colors relative">
                        <div>
                            <h3 className="text-xl font-bold text-white font-pixel">{event.title}</h3>
                            <p className="text-gray-400 text-sm">
                                {new Date(event.date).toLocaleDateString()} - {event.time}
                            </p>
                        </div>
                        <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(event)}
                                className="p-2 bg-blue-600 text-white hover:bg-blue-500"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(event.id)}
                                className="p-2 bg-red-600 text-white hover:bg-red-500"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {events?.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No hay eventos creados.</p>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingEvent?.id ? 'Editar Evento' : 'Nuevo Evento'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Título</label>
                        <input
                            type="text"
                            value={editingEvent?.title || ''}
                            onChange={e => handleChange('title', e.target.value)}
                            className="w-full bg-black border border-gray-700 text-white p-2"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Fecha</label>
                            <input
                                type="date"
                                value={editingEvent?.date ? new Date(editingEvent.date).toISOString().split('T')[0] : ''}
                                onChange={e => handleChange('date', e.target.value)}
                                className="w-full bg-black border border-gray-700 text-white p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Hora</label>
                            <input
                                type="time"
                                value={editingEvent?.time || ''}
                                onChange={e => handleChange('time', e.target.value)}
                                className="w-full bg-black border border-gray-700 text-white p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Ubicación</label>
                        <input
                            type="text"
                            value={editingEvent?.location || ''}
                            onChange={e => handleChange('location', e.target.value)}
                            className="w-full bg-black border border-gray-700 text-white p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Descripción</label>
                        <textarea
                            value={editingEvent?.description || ''}
                            onChange={e => handleChange('description', e.target.value)}
                            className="w-full bg-black border border-gray-700 text-white p-2 h-24"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Precio (€)</label>
                            <input
                                type="number"
                                value={editingEvent?.price || 0}
                                onChange={e => handleChange('price', parseFloat(e.target.value))}
                                className="w-full bg-black border border-gray-700 text-white p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Entradas Disponibles</label>
                            <input
                                type="number"
                                value={editingEvent?.ticket_availability ?? ''}
                                onChange={e => handleChange('ticket_availability', e.target.value === '' ? null : parseInt(e.target.value))}
                                className="w-full bg-black border border-gray-700 text-white p-2"
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 py-2">
                        <input
                            type="checkbox"
                            id="is_visible"
                            checked={editingEvent?.is_visible !== false}
                            onChange={e => handleChange('is_visible', e.target.checked)}
                            className="h-5 w-5 bg-black border-gray-700 text-rodetes-pink"
                        />
                        <label htmlFor="is_visible" className="text-gray-300">Evento Visible al Público</label>
                    </div>

                    <FileUpload
                        label="Póster del Evento"
                        currentUrl={editingEvent?.poster_url}
                        onUpload={async (file) => {
                            const data = new FormData();
                            data.append('uploadType', 'events');
                            data.append('poster', file);
                            const res = await api.post('/events/upload-poster', data, {
                                headers: { 'x-upload-type': 'events' }
                            });
                            handleChange('poster_url', res.data.url);
                        }}
                    />

                    <Button type="submit" className="w-full bg-rodetes-pink border-none text-white hover:bg-pink-600 mt-6">
                        GUARDAR
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminEvents;
