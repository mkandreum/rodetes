import React, { useState } from 'react';
import { useGallery, useGalleryMutations } from '../../hooks/useGallery';
import { useAdminEvents } from '../../hooks/useEvents';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { Trash2, Upload, Plus } from 'lucide-react';

const AdminGallery = () => {
    const { data: photos, isLoading: galleryLoading } = useGallery();
    const { data: events, isLoading: eventsLoading } = useAdminEvents();
    const { addPhoto, deletePhoto } = useGalleryMutations();

    const [eventId, setEventId] = useState<string>('');
    const [imageUrl, setImageUrl] = useState('');

    if (galleryLoading || eventsLoading) return <Loader />;

    const handleAddPhoto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventId || !imageUrl) return;

        try {
            await addPhoto.mutateAsync({ event_id: parseInt(eventId), image_url: imageUrl });
            setImageUrl('');
            alert('Foto añadida correctamente');
        } catch (error) {
            console.error(error);
            alert('Error al añadir foto');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Eliminar esta foto?')) {
            await deletePhoto.mutateAsync(id);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-8">Gestión de Galería</h2>

            {/* ADD PHOTO FORM */}
            <div className="bg-gray-900 border border-gray-700 p-6 mb-8">
                <h3 className="text-xl text-white mb-4 flex items-center gap-2">
                    <Upload size={20} /> Subir Nueva Foto
                </h3>
                <form onSubmit={handleAddPhoto} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-gray-400 mb-1">Seleccionar Evento</label>
                        <select
                            value={eventId}
                            onChange={(e) => setEventId(e.target.value)}
                            className="w-full bg-black border border-gray-700 text-white p-2"
                            required
                        >
                            <option value="">Selecciona un evento...</option>
                            {events?.map(event => (
                                <option key={event.id} value={event.id}>
                                    {event.title} ({new Date(event.date).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 w-full">
                        <label className="block text-gray-400 mb-1">URL de la Imagen</label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-black border border-gray-700 text-white p-2"
                            required
                        />
                    </div>

                    <Button type="submit" className="bg-rodetes-pink border-none text-white hover:bg-pink-600">
                        <Plus size={20} /> AÑADIR
                    </Button>
                </form>
            </div>

            {/* PHOTOS LIST */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {photos?.map(photo => (
                    <div key={photo.id} className="relative group aspect-square bg-gray-900 border border-gray-800">
                        <img src={photo.image_url} alt="Gallery" className="w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-2 text-center">
                            <p className="text-xs text-white mb-2">{photo.event_title}</p>
                            <button
                                onClick={() => handleDelete(photo.id)}
                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminGallery;
