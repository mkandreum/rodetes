import { useDrags } from '../hooks/useDrags';
import Loader from '../components/common/Loader';
import { Instagram } from 'lucide-react';

const Drags = () => {
    const { data: drags, isLoading, error } = useDrags();

    if (isLoading) return <Loader />;
    if (error) return <div className="text-center text-red-500 py-10">Error al cargar drags.</div>;

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 text-glow-white uppercase">NUESTRAS DRAGS</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Conoce al elenco estelar de Rodetes Party.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {drags?.map((drag) => (
                    <div
                        key={drag.id}
                        className="bg-gray-900 border-2 overflow-hidden flex flex-col md:flex-row h-auto md:h-96"
                        style={{ borderColor: drag.card_color || '#eb2eff' }}
                    >
                        {/* LEFT: IMAGE */}
                        <div className="w-full md:w-5/12 h-64 md:h-full relative overflow-hidden group">
                            <img
                                src={drag.cover_image_url}
                                alt={drag.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>

                        {/* RIGHT: CONTENT */}
                        <div className="w-full md:w-7/12 p-6 flex flex-col justify-between relative">
                            {/* Top Glow Effect */}
                            <div
                                className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none"
                                style={{ backgroundColor: drag.card_color || '#eb2eff' }}
                            ></div>

                            <div>
                                <h3 className="text-3xl font-pixel text-white mb-1 uppercase text-glow-white leading-none">
                                    {drag.name}
                                </h3>

                                {drag.instagram && (
                                    <a
                                        href={`https://instagram.com/${drag.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 md:mb-6"
                                    >
                                        <Instagram size={18} />
                                        @{drag.instagram.replace('@', '')}
                                    </a>
                                )}

                                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                    {drag.description}
                                </p>
                            </div>

                            {/* MERCH SECTION */}
                            {drag.merch && drag.merch.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-white font-pixel text-sm uppercase mb-2 border-b border-gray-700 pb-1 w-full">MERCH</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-800 border border-gray-600 overflow-hidden shrink-0">
                                            {drag.merch[0].image_url && (
                                                <img
                                                    src={drag.merch[0].image_url}
                                                    alt={drag.merch[0].name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-pixel text-xs leading-tight mb-1">{drag.merch[0].name}</p>
                                            <p className="text-xl font-bold text-white">{drag.merch[0].price} €</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Drags;
