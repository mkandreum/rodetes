import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useTicketMutations } from '../../hooks/useTickets';
import { Event } from '../../types';

interface TicketPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
    onSuccess: (tickets: any[]) => void;
}

const TicketPurchaseModal: React.FC<TicketPurchaseModalProps> = ({ isOpen, onClose, event, onSuccess }) => {
    const { createTicket } = useTicketMutations();

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        quantity: 1
    });

    if (!event) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await createTicket.mutateAsync({
                event_id: event.id,
                ...formData
            });
            onSuccess(result.data.tickets);
            onClose();
        } catch (error) {
            console.error('Purchase failed', error);
            alert('Error al realizar la compra. Inténtalo de nuevo.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Comprar Entradas: ${event.title}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Nombre</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black border border-gray-700 text-white p-2"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Apellidos</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black border border-gray-700 text-white p-2"
                            value={formData.surname}
                            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full bg-black border border-gray-700 text-white p-2"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-1">Cantidad</label>
                    <select
                        className="w-full bg-black border border-gray-700 text-white p-2"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-gray-900 p-4 border border-gray-700 mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span>Precio por entrada:</span>
                        <span>{event.price} €</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold text-rodetes-pink border-t border-gray-700 pt-2">
                        <span>TOTAL:</span>
                        <span>{(event.price * formData.quantity).toFixed(2)} €</span>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-rodetes-pink text-white hover:bg-pink-600 border-none"
                    disabled={createTicket.isPending}
                >
                    {createTicket.isPending ? 'PROCESANDO...' : 'CONFIRMAR COMPRA'}
                </Button>
            </form>
        </Modal>
    );
};

export default TicketPurchaseModal;
