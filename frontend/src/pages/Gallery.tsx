import React, { useMemo } from 'react';
import { useGallery } from '../hooks/useGallery';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';

const Gallery = () => {
    const { data: photos, isLoading, error } = useGallery();

    const groupedPhotos = useMemo(() => {
        if (!photos) return {};
        return photos.reduce((acc, photo) => {
            const key = `${photo.event_title} - ${new Date(photo.event_date).toLocaleDateString()}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(photo);
            return acc;
        }, {} as Record<string, typeof photos>);
    }, [photos]);

    if (isLoading) return <Loader />;
    if (error) return <div className="text-center text-red-500 py-10">Error al cargar la galería.</div>;

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 text-glow-white">GALERÍA</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Revive los momentos más icónicos.
                </p>
            </div>

            {Object.entries(groupedPhotos).map(([eventTitle, eventPhotos]) => (
                <div key={eventTitle}>
                    <h3 className="text-2xl font-pixel text-rodetes-pink mb-6 border-l-4 border-rodetes-pink pl-4">
                        {eventTitle}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {eventPhotos.map((photo) => (
                            <div key={photo.id} className="group relative overflow-hidden aspect-square border border-gray-800 bg-gray-900">
                                <img
                                    src={photo.image_url}
                                    alt={eventTitle}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {photos?.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    No hay fotos disponibles en la galería por el momento.
                </div>
            )}
        </div>
    );
};

export default Gallery;
