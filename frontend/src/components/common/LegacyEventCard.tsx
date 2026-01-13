import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '@rodetes/types';

interface LegacyEventCardProps {
    event: Event;
    isNextEvent?: boolean;
    onBuyClick?: (event: Event) => void;
}

const LegacyEventCard: React.FC<LegacyEventCardProps> = ({ event, isNextEvent, onBuyClick }) => {
    const isPastEvent = new Date(event.date) < new Date();
    const eventDate = new Date(event.date).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const price = typeof event.price === 'number' ? event.price.toFixed(2) : '0.00';

    // Status / Label logic
    let label = null;
    if (isNextEvent) {
        label = (
            <div className="absolute top-0 left-0 text-white font-pixel text-sm px-2 py-1 rounded-none border-b border-r border-black z-10 shadow-md" style={{ backgroundColor: '#F02D7D' }}>
                PRÓXIMO EVENTO
            </div>
        );
    } else if (isPastEvent) {
        label = (
            <div className="absolute top-0 left-0 bg-red-700 text-white font-pixel text-sm px-2 py-1 rounded-none border-b border-r border-black z-10 shadow-md">
                FINALIZADO
            </div>
        );
    }

    // Button Logic
    let button = null;
    if (isPastEvent) {
        if (event.galleryImages && event.galleryImages.length > 0) {
            button = (
                <Link to={`/gallery`} className="w-full neon-btn text-white font-pixel text-2xl py-3 px-4 rounded-none block text-center">
                    VER GALERÍA
                </Link>
            );
        } else {
            button = (
                <button disabled className="w-full bg-gray-800 text-gray-500 font-pixel text-2xl py-3 px-4 rounded-none border border-gray-700 cursor-not-allowed">
                    EVENTO FINALIZADO
                </button>
            );
        }
    } else {
        // Using ticket_availability from types
        if (event.ticket_availability === 0) {
            button = (
                <button disabled className="w-full bg-red-800 text-red-300 font-pixel text-2xl py-3 px-4 rounded-none border border-red-700 cursor-not-allowed">
                    AGOTADO
                </button>
            );
        } else {
            // Open ticket modal logic would go here, for now link or simple button
            button = (
                <button
                    onClick={() => onBuyClick && onBuyClick(event)}
                    className="w-full neon-btn font-pixel text-2xl py-3 px-4 rounded-none"
                    disabled={!onBuyClick} // Optional: disable if no handler provided, though visually we might want it enabled if it links somewhere else? For now, this is safer.
                >
                    CONSEGUIR ENTRADA
                </button>
            );
        }
    }

    const imageUrl = event.poster_url || `https://placehold.co/400x200/000000/ffffff?text=${encodeURIComponent(event.title || 'Evento')}&font=vt323`;

    return (
        <div className="relative bg-gray-900 rounded-none border border-white overflow-hidden flex flex-col transform transition-all hover:border-gray-300 hover:shadow-white/30 duration-300 reveal-on-scroll">
            {label}
            <div className="w-full bg-black border-b border-white overflow-hidden">
                <img
                    src={imageUrl}
                    alt={event.title}
                    className={`w-full ${isPastEvent ? 'opacity-60' : ''}`}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/000/fff?text=Error&font=vt323'; }}
                />
            </div>
            <div className="p-6 flex flex-col flex-grow text-left">
                <h3 className={`text-3xl font-pixel ${isPastEvent ? 'text-gray-500' : 'text-white text-glow-white'} mb-2 glitch-hover`}>
                    {event.title}
                </h3>
                <p className="text-gray-400 font-semibold font-pixel text-lg mb-3">{eventDate}</p>
                <p className={`text-4xl font-extrabold ${isPastEvent ? 'text-gray-600' : 'text-white'} mb-4`}>{price} €</p>
                <p className="text-gray-400 mb-6 flex-grow whitespace-pre-wrap">{event.description || 'Sin descripción.'}</p>
                {button}
            </div>
        </div>
    );
};

export default LegacyEventCard;
