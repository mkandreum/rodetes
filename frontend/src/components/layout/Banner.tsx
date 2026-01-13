import React, { useMemo } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { usePublicEvents } from '../../hooks/useEvents';
import { Event } from '../../types';

export const Banner: React.FC = () => {
    const { settings } = useSettings();
    const { data: events = [] } = usePublicEvents();

    const nextEvent = useMemo(() => {
        if (!events || events.length === 0) return null;

        // Simplify date comparison: Compare YYYY-MM-DD strings to avoid timezone issues
        const todayStr = new Date().toISOString().split('T')[0];

        const filtered = events
            .filter(e => {
                if (!e || !e.is_visible || !e.date) return false;
                // Ensure event date is >= today (string comparison works for YYYY-MM-DD)
                const eventDateStr = new Date(e.date).toISOString().split('T')[0];
                return eventDateStr >= todayStr;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return filtered[0] || null;
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
            className="w-full fixed top-0 left-0 overflow-hidden z-[60] shadow-md border-b"
            style={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                height: '40px',
                borderColor: neonColor
            }}
        >
            <span
                className="font-pixel text-sm md:text-lg px-4 gpu-accelerate"
                style={{
                    color: neonColor,
                    textShadow: `
                            0 0 5px #fff,
                            0 0 10px #fff,
                            0 0 15px ${neonColor},
                            0 0 20px ${neonColor},
                            0 0 25px ${neonColor},
                            0 0 30px ${neonColor},
                            0 0 35px ${neonColor}
                        `
                }}
            >
                {displayText}
            </span>
            {/* Duplicate for seamless loop */}
            <span
                className="font-pixel text-sm md:text-lg px-4 gpu-accelerate"
                style={{
                    color: neonColor,
                    textShadow: `
                            0 0 5px #fff,
                            0 0 10px #fff,
                            0 0 15px ${neonColor},
                            0 0 20px ${neonColor},
                            0 0 25px ${neonColor},
                            0 0 30px ${neonColor},
                            0 0 35px ${neonColor}
                        `
                }}
            >
                {displayText}
            </span>
            <span
                className="font-pixel text-sm md:text-lg px-4 gpu-accelerate"
                style={{
                    color: neonColor,
                    textShadow: `
                            0 0 5px #fff,
                            0 0 10px #fff,
                            0 0 15px ${neonColor},
                            0 0 20px ${neonColor},
                            0 0 25px ${neonColor},
                           0 0 30px ${neonColor},
                            0 0 35px ${neonColor}
                        `
                }}
            >
                {displayText}
            </span>
        </div>
    );
};
