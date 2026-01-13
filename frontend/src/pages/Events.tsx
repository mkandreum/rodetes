import { useState } from 'react';
import { usePublicEvents } from '../hooks/useEvents';
import Loader from '../components/common/Loader';
import LegacyEventCard from '../components/common/LegacyEventCard';
import TicketPurchaseModal from '../components/modals/TicketPurchaseModal';
import TicketSuccessModal from '../components/modals/TicketSuccessModal';
import { Event, Ticket } from '@rodetes/types';

const Events = () => {
    const { data: eventsData, isLoading, error } = usePublicEvents();
    const events = eventsData || [];

    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [purchasedTickets, setPurchasedTickets] = useState<Ticket[]>([]);

    const handleBuyClick = (event: Event) => {
        setSelectedEvent(event);
        setIsPurchaseOpen(true);
    };

    const handlePurchaseSuccess = (tickets: Ticket[]) => {
        setPurchasedTickets(tickets);
        setIsSuccessOpen(true);
    };

    if (isLoading) return <Loader />;
    if (error) return <div className="text-center text-red-500 py-10">Error al cargar eventos.</div>;

    return (
        <div className="space-y-12">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-pixel text-white mb-4 text-glow-white glitch-hover" data-text="PRÓXIMOS EVENTOS">PRÓXIMOS EVENTOS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events?.length > 0 ? (
                    events.map((event) => (
                        // Using LegacyEventCard which encapsulates the design and logic (buttons, state)
                        // Note: LegacyEventCard handles "CONSEGUIR ENTRADA" but we might need to hook up the modal here if we want the modal to open.
                        // However, LegacyEventCard currently has a simple button. 
                        // To make it functional, I should probably pass an onBuyClick prop to LegacyEventCard or handle it inside?
                        // The prompt asked for "Visual Replication". Functional parity with the modal is key.
                        // I will modify LegacyEventCard later to accept onBuyClick? 
                        // Or for now, I will manually render the internal structure of LegacyEventCard here if I can't modify it easily without breaking Home?
                        // Actually, I should update LegacyEventCard to accept an `onBuyClick` prop.
                        <LegacyEventCard
                            key={event.id}
                            event={event}
                            onBuyClick={handleBuyClick}
                        />
                    ))
                ) : (
                    <div className="text-gray-400 text-center col-span-full font-pixel py-10">
                        NO HAY EVENTOS PROGRAMADOS POR AHORA.
                    </div>
                )}
            </div>

            {/* Modals */}
            <TicketPurchaseModal
                isOpen={isPurchaseOpen}
                onClose={() => setIsPurchaseOpen(false)}
                event={selectedEvent}
                onSuccess={handlePurchaseSuccess}
            />

            <TicketSuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                tickets={purchasedTickets}
                event={selectedEvent}
            />
        </div>
    );
};

export default Events;
