import { useState } from 'react';
import { usePublicEvents } from '../hooks/useEvents';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import TicketPurchaseModal from '../components/modals/TicketPurchaseModal';
import TicketSuccessModal from '../components/modals/TicketSuccessModal';
import { Event, Ticket } from '../types';

const Events = () => {
    const { data: events, isLoading, error } = usePublicEvents();

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
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 text-glow-white">PRÓXIMOS EVENTOS</h2>
                <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4">
                    No te pierdas las mejores fiestas de Rodetes. Entradas limitadas.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {events?.map((event) => (
                    <Card
                        key={event.id}
                        title={event.title}
                        subtitle={`${new Date(event.date).toLocaleDateString()} - ${event.time}`}
                        image={event.poster_url}
                        imageProps={{ loading: 'lazy' }}
                    >
                        <div className="space-y-4">
                            <p className="text-sm sm:text-base text-gray-300">{event.description}</p>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-rodetes-blue">{event.location}</span>
                                <span className="text-rodetes-pink font-bold text-xl">{event.price} €</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-800">
                            {event.ticket_availability > 0 ? (
                                <Button
                                    className="w-full bg-rodetes-pink border-rodetes-pink text-white hover:bg-pink-600 touch-feedback"
                                    onClick={() => handleBuyClick(event)}
                                >
                                    COMPRAR ENTRADAS
                                </Button>
                            ) : (
                                <Button className="w-full bg-gray-600 cursor-not-allowed" disabled>
                                    AGOTADO
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {events?.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    No hay eventos programados próximamente.
                </div>
            )}

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
