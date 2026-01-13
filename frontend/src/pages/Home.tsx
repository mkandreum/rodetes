import { Link } from 'react-router-dom';
import { usePublicEvents as useEvents } from '../hooks/useEvents';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const Home = () => {
    const { data: events, isLoading } = useEvents();

    if (isLoading) return <Loader />;

    // Logic: Find Next Event and Last Past Event
    const now = new Date();
    // Reset time to start of day for accurate comparison
    now.setHours(0, 0, 0, 0);

    const futureEvents = events?.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= now; // Includes today
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

    const pastEvents = events?.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate < now;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

    const nextEvent = futureEvents[0];
    const lastEvent = pastEvents[0];

    return (
        <div className="space-y-20 pb-20">

            {/* HERO SECTION: NEXT EVENT */}
            <section className="text-center py-6 min-h-[60vh] flex flex-col justify-start items-center relative gap-6">

                {nextEvent ? (
                    <div className="relative z-10 w-full max-w-lg mx-auto px-4 flex flex-col items-center">
                        <div className="w-full mb-6 relative group">
                            {/* Poster */}
                            {nextEvent.poster_url ? (
                                <img
                                    src={nextEvent.poster_url}
                                    alt={nextEvent.title}
                                    className="w-full h-auto object-cover border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                />
                            ) : (
                                <div className="w-full aspect-[3/4] bg-gray-900 border-4 border-gray-700 flex items-center justify-center">
                                    <span className="text-gray-500 font-pixel">NO POSTER</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center w-full gap-4">
                            <h2 className="text-3xl md:text-5xl font-bold text-white font-pixel uppercase tracking-widest text-center leading-tight">
                                {nextEvent.title}
                            </h2>
                            <p className="text-xl text-rodetes-pink font-pixel text-center">
                                {new Date(nextEvent.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
                            </p>

                            <Link to={`/events`} className="w-full">
                                <Button className="w-full bg-rodetes-pink hover:bg-pink-600 text-white font-bold py-4 text-xl border-none shadow-[0_0_15px_#F02D7D] touch-feedback">
                                    COMPRAR ENTRADAS
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 mt-20 text-center px-4">
                        <h1 className="text-6xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rodetes-pink to-rodetes-blue mb-8 leading-none">
                            RODETES
                        </h1>
                        <p className="text-2xl text-gray-400 font-pixel">PRONTO MÁS NOVEDADES...</p>
                    </div>
                )}
            </section>

            {/* LAST EVENT RECAP */}
            {lastEvent && (
                <section className="text-center py-10 border-t border-gray-800">
                    <h3 className="text-2xl sm:text-3xl md:text-5xl text-gray-500 mb-8 font-pixel uppercase">LO QUE TE PERDISTE...</h3>
                    <div className="max-w-4xl mx-auto opacity-70 hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-gray-900 border border-gray-700 p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-center touch-feedback">
                            {lastEvent.poster_url && (
                                <img src={lastEvent.poster_url} alt={lastEvent.title} loading="lazy" className="w-full md:w-1/3 aspect-square object-cover grayscale hover:grayscale-0 transition-all" />
                            )}
                            <div className="text-left flex-1">
                                <h4 className="text-3xl text-white mb-2">{lastEvent.title}</h4>
                                <p className="text-xl text-gray-400 mb-4">
                                    {new Date(lastEvent.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                                <p className="text-lg text-gray-500 truncate-3-lines">{lastEvent.description}</p>
                                <Link to="/gallery" className="inline-block mt-4 text-rodetes-blue hover:text-white underline font-pixel text-lg sm:text-xl touch-feedback">
                                    VER GALERÍA DE FOTOS
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* WHAT IS RODETES TEXT */}
            <section className="max-w-4xl mx-auto text-center py-10 px-4">
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed font-pixel">
                    <span className="text-rodetes-pink font-bold">RODETES</span> ES UN ESPACIO SEGURO Y DISIDENTE DONDE CELEBRAMOS EL DRAG, LA MÚSICA Y LA CULTURA QUEER.
                    NACIDAS EN EL UNDERGROUND, LLEVAMOS LA FIESTA A OTRO NIVEL.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-10">
                    <Link to="/drags">
                        <Button variant="outline" className="text-base sm:text-lg touch-feedback w-full sm:w-auto">CONOCE A LAS REINAS</Button>
                    </Link>
                    <Link to="/merch">
                        <Button variant="outline" className="text-base sm:text-lg touch-feedback w-full sm:w-auto">TIENDA OFICIAL</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
