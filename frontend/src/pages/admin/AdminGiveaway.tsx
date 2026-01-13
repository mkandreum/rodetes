import React, { useState } from 'react';
import { useAdminEvents } from '../../hooks/useEvents';
import client from '../../api/client';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { Trophy, Shuffle } from 'lucide-react';
import { Ticket } from '../../types';

interface Winner extends Ticket {
    // reusing Ticket interface
}

const AdminGiveaway = () => {
    const { data: events, isLoading: loadingEvents } = useAdminEvents();
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [numWinners, setNumWinners] = useState(1);
    const [winners, setWinners] = useState<Winner[]>([]);
    const [loadingDraw, setLoadingDraw] = useState(false);
    const [error, setError] = useState('');

    const handleDraw = async () => {
        if (!selectedEventId) return;
        setLoadingDraw(true);
        setError('');
        setWinners([]);

        try {
            const { data } = await client.get(`/tickets/giveaway/${selectedEventId}?count=${numWinners}`);
            setWinners(data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Error al realizar el sorteo');
        } finally {
            setLoadingDraw(false);
        }
    };

    if (loadingEvents) return <Loader />;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-pixel text-white text-glow-white mb-6">SORTEO</h2>

            <div className="bg-gray-900 p-6 border border-white space-y-6">

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-pixel text-lg text-gray-300 mb-1">EVENTO</label>
                        <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="w-full bg-black border border-gray-600 text-white p-2 font-pixel"
                        >
                            <option value="">-- SELECCIONA EVENTO --</option>
                            {events?.map(ev => (
                                <option key={ev.id} value={ev.id}>{ev.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-pixel text-lg text-gray-300 mb-1">Nº GANADORES</label>
                        <input
                            type="number"
                            min="1"
                            value={numWinners}
                            onChange={(e) => setNumWinners(parseInt(e.target.value))}
                            className="w-full bg-black border border-gray-600 text-white p-2 font-pixel text-center"
                        />
                    </div>

                    <div className="flex items-end">
                        <Button
                            onClick={handleDraw}
                            disabled={loadingDraw || !selectedEventId}
                            className="w-full bg-pink-600 hover:bg-pink-700"
                        >
                            <Shuffle size={20} className="mr-2" />
                            {loadingDraw ? 'SORTEANDO...' : 'REALIZAR SORTEO'}
                        </Button>
                    </div>
                </div>

                {/* Results */}
                <div className="mt-8 border-t border-gray-700 pt-6">
                    {error && (
                        <div className="p-4 bg-red-900/50 border border-red-500 text-center text-red-200 font-pixel">
                            {error}
                        </div>
                    )}

                    {winners.length > 0 && (
                        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                            <h3 className="text-2xl font-pixel text-center text-green-400 text-glow-green mb-6">¡GANADORES!</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {winners.map((winner, idx) => (
                                    <div key={idx} className="bg-black border-2 border-green-500 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2 opacity-50"><Trophy size={48} className="text-yellow-500" /></div>
                                        <p className="text-gray-400 font-pixel text-sm uppercase mb-1">Ticket ID: {winner.ticket_id.substring(0, 8)}...</p>
                                        <h4 className="text-3xl font-bold text-white font-pixel mb-1">{winner.name} {winner.surname}</h4>
                                        <p className="text-xl text-green-400 font-pixel">{winner.email}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!loadingDraw && winners.length === 0 && !error && (
                        <div className="text-center py-10 text-gray-500 font-pixel">
                            <Trophy size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Selecciona un evento y pulsa "Realizar Sorteo"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminGiveaway;
