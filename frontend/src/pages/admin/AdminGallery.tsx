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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    if (galleryLoading || eventsLoading) return <Loader />;

    const handleAddPhoto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventId || !selectedFile) return;

        try {
            const formData = new FormData();
            formData.append('event_id', eventId);
            formData.append('image', selectedFile);

            await addPhoto.mutateAsync(formData);
            setSelectedFile(null);
            // Reset file input value
            (document.getElementById('fileInput') as HTMLInputElement).value = '';
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
                        <label className="block text-gray-400 mb-1">Imagen (JPG/PNG)</label>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                            className="w-full bg-black border border-gray-700 text-white p-2"
                            required
                        />
                    </div>

                    <Button type="submit" className="bg-rodetes-pink border-none text-white hover:bg-pink-600" disabled={!selectedFile || !eventId}>
                        <Plus size={20} /> AÑADIR
                    </Button>
                </form>
            </div>

            {/* PHOTOS LIST (STRICT GRID) */}
            <div className="admin-gallery-grid">
                {photos?.map(photo => (
                    <div key={photo.id} className="admin-gallery-item group">
                        <img src={photo.image_url} alt="Gallery" className="w-full h-full object-cover" />

                        {/* Overlay with Legacy Simple Delete Button */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center">
                            <button
                                onClick={() => handleDelete(photo.id)}
                                className="bg-red-600 text-white p-2 hover:bg-red-500 rounded-none border border-white"
                            >
                                <Trash2 size={24} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminGallery;
