import { useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { Download, CheckCircle } from 'lucide-react';
import { Ticket, Event } from '@rodetes/types';

interface TicketSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    tickets: Ticket[];
    event: Event | null;
}

const TicketSuccessModal: React.FC<TicketSuccessModalProps> = ({ isOpen, onClose, tickets, event }) => {
    const ticketsRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!ticketsRef.current) return;

        try {
            const canvas = await html2canvas(ticketsRef.current, {
                backgroundColor: '#000000',
                scale: 2 // Higher resolution
            });

            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `Entradas-${event?.title || 'Rodetes'}.png`;
            link.click();
        } catch (error) {
            console.error('Download failed', error);
            alert('Error al descargar las entradas.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="¡Compra Exitosa!"
            className="max-w-3xl" // Wider modal for multiple tickets
        >
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <CheckCircle className="text-green-500 w-16 h-16" />
                </div>

                <p className="text-xl text-white">
                    Has comprado {tickets.length} entrada{tickets.length > 1 ? 's' : ''} para <span className="text-rodetes-pink font-bold">{event?.title}</span>.
                </p>

                <p className="text-gray-400 text-sm">
                    Guarda esta imagen. El código QR es único para cada entrada y será validado en la puerta.
                </p>

                {/* Ticket Container for Screenshot */}
                <div
                    ref={ticketsRef}
                    className="bg-black border-2 border-rodetes-pink p-8 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {tickets.map((ticket, idx) => (
                        <div key={ticket.ticket_id} className="bg-white text-black p-4 rounded flex flex-col items-center space-y-4">
                            <div className="text-center border-b border-gray-300 pb-2 w-full">
                                <h3 className="font-bold text-lg uppercase tracking-wider">{event?.title}</h3>
                                <p className="text-sm text-gray-600">{new Date(event?.date || '').toLocaleDateString()}</p>
                            </div>

                            <QRCodeSVG
                                value={`TICKET_ID:${ticket.ticket_id}`}
                                size={180}
                                level={'H'}
                                includeMargin={true}
                            />

                            <div className="text-center text-xs space-y-1 w-full">
                                <p className="font-mono text-gray-500">{ticket.ticket_id.split('-')[0]}...</p>
                                <p className="font-bold">{ticket.name} {ticket.surname}</p>
                                <p className="text-gray-500 truncate max-w-[200px] mx-auto">{ticket.email}</p>
                                <div className="pt-2">
                                    <span className="bg-black text-white px-2 py-1 rounded text-[10px] uppercase">Entrada {idx + 1} de {tickets.length}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add branding to the bottom of the image */}
                    <div className="col-span-full text-center pt-4 border-t border-gray-800">
                        <p className="text-white font-pixel text-xl tracking-widest">RODETES</p>
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                    <Button onClick={onClose} variant="outline" className="border-gray-600">
                        CERRAR
                    </Button>
                    <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 border-none flex items-center gap-2">
                        <Download size={20} /> DESCARGAR ENTRADAS
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default TicketSuccessModal;
