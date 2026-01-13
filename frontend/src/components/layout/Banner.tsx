import React, { useMemo } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { usePublicEvents } from '../../hooks/useEvents';
import { Event } from '../../types';

export const Banner: React.FC = () => {
    const { settings } = useSettings();
    const { data: events = [] } = usePublicEvents();

    const nextEvent = useMemo(() => {
        if (!events || events.length === 0) return null;
        const now = new Date();
        return events
            .filter(e => e && e.is_visible && e.date && new Date(e.date) > now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
    }, [events]);

    if (!settings?.promoEnabled || !settings?.promoCustomText || !nextEvent) {
        return null;
    }

    const { promoCustomText, promoNeonColor } = settings;
    const neonColor = promoNeonColor || '#F02D7D';

    const formatEventText = (text: string, event: Event) => {
        const eventDate = new Date(event.date);
        const shortDate = eventDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
        const fullDate = eventDate.toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const price = (Number(event.price) || 0).toFixed(2);

        return text
            .replace(/{eventName}/g, event.title || 'Evento')
            .replace(/{eventDate}/g, fullDate || 'Próximamente')
            .replace(/{eventShortDate}/g, shortDate || '??/??')
            .replace(/{eventPrice}/g, `${price}€`);
    };

    const displayText = formatEventText(promoCustomText, nextEvent);

    return (
        <div
            className="w-full relative overflow-hidden z-50 shadow-md border-b"
            style={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                height: '40px',
                borderColor: neonColor,
                zIndex: 60 // Ensure it's above the header (header is usuall 50)
            }}
        >
            <div className="absolute whitespace-nowrap animate-marquee flex items-center h-full">
                <span
                    className="font-pixel text-lg px-4"
                    style={{
                        color: neonColor,
                        textShadow: `0 0 5px ${neonColor}, 0 0 10px ${neonColor}`
                    }}
                >
                    {displayText}
                </span>
                {/* Duplicate for seamless loop if needed, though pure CSS marquee usually handles one long line or duplicates. 
                     Let's add a second span for better spacing if the text is short */}
                <span
                    className="font-pixel text-lg px-4"
                    style={{
                        color: neonColor,
                        textShadow: `0 0 5px ${neonColor}, 0 0 10px ${neonColor}`
                    }}
                >
                    {displayText}
                </span>
                <span
                    className="font-pixel text-lg px-4"
                    style={{
                        color: neonColor,
                        textShadow: `0 0 5px ${neonColor}, 0 0 10px ${neonColor}`
                    }}
                >
                    {displayText}
                </span>
            </div>
        </div>
    );
};
