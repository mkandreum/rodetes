import { Link } from 'react-router-dom';
import { usePublicEvents as useEvents } from '../hooks/useEvents';
import Loader from '../components/common/Loader';
import LegacyEventCard from '../components/common/LegacyEventCard';

const Home = () => {
    const { data: events, isLoading } = useEvents();

    if (isLoading) return <Loader />;

    // Logic: Sort events by date
    const sortedEvents = events?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
    const now = new Date();

    const activeEvents = sortedEvents.filter(e => new Date(e.date) >= now);
    const pastEvents = sortedEvents.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // In index.php home page, it shows "EVENTOS" list first.
    // It seems to mix upcoming and past in the grid? app.js renderHomeEvents logic:
    // nextActiveEvent AND mostRecentPastEvent. It only shows TWO events?
    // Let's re-read app.js lines 946-953: "eventsToShow = [nextActiveEvent, mostRecentPastEvent]". 
    // YES! It only shows specific highlighted events on Home, not ALL.
    // And a "VER TODOS LOS EVENTOS" button.

    const nextActiveEvent = activeEvents[0];
    const mostRecentPastEvent = pastEvents[0];
    const eventsToShow = [nextActiveEvent, mostRecentPastEvent].filter(Boolean);

    return (
        <div id="page-home" className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            {/* EVENTOS Section */}
            <h2 className="text-4xl font-pixel text-white mb-6 text-center text-glow-white glitch-hover" data-text="EVENTOS">EVENTOS</h2>

            <div id="home-event-list-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {eventsToShow.length > 0 ? (
                    eventsToShow.map(event => (
                        <LegacyEventCard
                            key={event.id}
                            event={event}
                            isNextEvent={nextActiveEvent && event.id === nextActiveEvent.id}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 text-center col-span-full font-pixel">NO HAY EVENTOS PROGRAMADOS POR AHORA.</p>
                )}
            </div>

            {/* View All Button */}
            <div className="text-center mb-12">
                <Link to="/events" className="neon-btn font-pixel text-2xl py-3 px-8 rounded-none inline-block">
                    VER TODOS LOS EVENTOS
                </Link>
            </div>

            {/* Banner Section */}
            <div className="bg-black border border-white overflow-hidden mb-12 reveal-on-scroll">
                <div id="home-banner-container" className="relative w-full bg-black aspect-video flex items-center justify-center">
                    {/* Placeholder or Configured Banner. app.js fetches it. For now static placeholder or the next event poster as fallback? 
                         Original app had a specific banner URL setting. 
                         I'll use a placeholder or the next event poster if available as a hero image.
                     */}
                    {nextActiveEvent?.poster_url ? (
                        <img src={nextActiveEvent.poster_url} className="w-full h-full object-cover opacity-60" alt="Banner" />
                    ) : (
                        <div className="text-gray-500 font-pixel">Banner no configurado</div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-pixel text-white text-center text-glow-white mb-8 leading-tight glitch-hover mix-blend-overlay" data-text="LA MEJOR FIESTA QUEER DE ALBACETE">
                            LA MEJOR FIESTA QUEER<br className="sm:hidden" /> DE ALBACETE
                        </h1>
                    </div>
                </div>
                <div className="p-8 sm:p-12 text-center bg-black relative z-10">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-pixel text-white text-center text-glow-white leading-tight glitch-hover" data-text="LA MEJOR FIESTA QUEER DE ALBACETE">
                        LA MEJOR FIESTA QUEER<br className="sm:hidden" /> DE ALBACETE
                    </h1>
                </div>
            </div>

            {/* Past Galleries Section */}
            <div id="past-galleries-section" className="mt-12 reveal-on-scroll">
                <h2 className="text-4xl font-pixel text-white mb-6 text-center text-glow-white glitch-hover" data-text="GALERÍAS PASADAS">GALERÍAS DE EVENTOS PASADOS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Reuse LegacyEventCard logic but for galleries? app.js uses a different structure for gallery cards (lines 1354). 
                         It's similar but simpler (Image + Title + Date + PhotoCount).
                         For now, I'll validly map pastEvents to a simple gallery card structure here or reuse LegacyEventCard with different button?
                         LegacyEventCard handles "VER GALERÍA" button if isPastEvent is true.
                         So I can reuse it or make a simplified one. 
                         Let's use the layout from app.js line 1354 for exact match.
                     */}
                    {pastEvents.slice(0, 3).map(event => (
                        <div key={event.id} className="w-full bg-gray-900 rounded-none border border-white overflow-hidden flex flex-col transform transition-all hover:border-gray-300 hover:shadow-white/30 duration-300 group">
                            <div className="w-full bg-black border-b border-white overflow-hidden aspect-video">
                                <img src={event.poster_url || 'https://placehold.co/600x400'} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-3xl font-pixel text-white text-glow-white truncate glitch-hover">{event.title}</h3>
                                <p className="text-sm text-gray-500 font-pixel">{new Date(event.date).toLocaleDateString()}</p>
                                <Link to="/gallery" className="text-rodetes-pink font-pixel text-lg mt-2 inline-block hover:text-white">VER GALERÍA &gt;</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
