import React from 'react';
import { useDrags } from '../hooks/useDrags';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { Instagram } from 'lucide-react';

const Drags = () => {
    const { data: drags, isLoading, error } = useDrags();

    if (isLoading) return <Loader />;
    if (error) return <div className="text-center text-red-500 py-10">Error al cargar drags.</div>;

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 text-glow-white">NUESTRAS REINAS</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Conoce al elenco estelar de Rodetes Party.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {drags?.map((drag) => (
                    <Card
                        key={drag.id}
                        title={drag.name}
                        image={drag.cover_image_url}
                        color={drag.card_color}
                        className="border-2"
                    >
                        <div className="space-y-4">
                            <p className="text-gray-300 italic">"{drag.description}"</p>

                            {drag.instagram && (
                                <a
                                    href={`https://instagram.com/${drag.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-rodetes-pink hover:text-white transition-colors"
                                >
                                    <Instagram size={20} />
                                    @{drag.instagram.replace('@', '')}
                                </a>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Drags;
