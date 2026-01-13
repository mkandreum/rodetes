import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useSettings } from '../hooks/useSettings';

const Home = () => {
    const { data: events, isLoading } = useEvents();
    const { settings } = useSettings();

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
            <section className="text-center py-10 min-h-[50vh] flex flex-col justify-center items-center relative">

                <h1 className="text-6xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rodetes-pink to-rodetes-blue mb-4 glitch-hover leading-none relative z-10" data-text="RODETES">
                    RODETES
                </h1>

                {nextEvent ? (
                    <div className="relative z-10 mt-8">
                        <p className="text-2xl md:text-4xl text-white mb-6 font-pixel text-glow-white animate-pulse">
                            PRÓXIMO EVENTO:
                        </p>
                        <div className="border-4 border-rodetes-pink p-6 md:p-10 bg-black shadow-[0_0_30px_#F02D7D] max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-300">
                            <h2 className="text-4xl md:text-7xl font-bold text-white mb-2">{nextEvent.title}</h2>
                            <p className="text-xl md:text-3xl text-rodetes-pink mb-4">{new Date(nextEvent.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</p>
                            <Link to={`/events`}>
                                <Button variant="neon" size="lg" className="mt-4 text-2xl w-full md:w-auto">
                                    COMPRAR ENTRADAS
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 mt-8">
                        <p className="text-2xl text-gray-400 font-pixel">PRONTO MÁS NOVEDADES...</p>
                    </div>
                )}
            </section>

            {/* LAST EVENT RECAP */}
            {lastEvent && (
                <section className="text-center py-10 border-t border-gray-800">
                    <h3 className="text-3xl md:text-5xl text-gray-500 mb-8 font-pixel uppercase">LO QUE TE PERDISTE...</h3>
                    <div className="max-w-4xl mx-auto opacity-70 hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-gray-900 border border-gray-700 p-6 flex flex-col md:flex-row gap-6 items-center">
                            {lastEvent.image_url && (
                                <img src={lastEvent.image_url} alt={lastEvent.title} className="w-full md:w-1/3 aspect-square object-cover grayscale hover:grayscale-0 transition-all" />
                            )}
                            <div className="text-left flex-1">
                                <h4 className="text-3xl text-white mb-2">{lastEvent.title}</h4>
                                <p className="text-xl text-gray-400 mb-4">
                                    {new Date(lastEvent.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                                <p className="text-lg text-gray-500 line-clamp-3">{lastEvent.description}</p>
                                <Link to="/gallery" className="inline-block mt-4 text-rodetes-blue hover:text-white underline font-pixel text-xl">
                                    VER GALERÍA DE FOTOS
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* WHAT IS RODETES TEXT */}
            <section className="max-w-4xl mx-auto text-center py-10 px-4">
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-pixel">
                    <span className="text-rodetes-pink font-bold">RODETES</span> ES UN ESPACIO SEGURO Y DISIDENTE DONDE CELEBRAMOS EL DRAG, LA MÚSICA Y LA CULTURA QUEER.
                    NACIDAS EN EL UNDERGROUND, LLEVAMOS LA FIESTA A OTRO NIVEL.
                </p>
                <div className="flex justify-center gap-6 mt-10">
                    <Link to="/drags">
                        <Button variant="outline" className="text-lg">CONOCE A LAS REINAS</Button>
                    </Link>
                    <Link to="/merch">
                        <Button variant="outline" className="text-lg">TIENDA OFICIAL</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
