import { Request, Response } from 'express';
import pool from '../models/db';
import { generateQRCode } from '../utils/qrGenerator';

// ... existing controller imports ...

// --- GIVEAWAY LOGIC ---

export const getGiveawayWinner = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const { count } = req.query;

    // Default to 1 winner if not specified
    const limit = parseInt(count as string) || 1;

    try {
        // Query to select random ticket(s) from a specific event
        // Only valid tickets (not scanned? or maybe yes scanned? usually "purchased" is enough)
        // Let's assume any sold ticket is eligible.
        const result = await pool.query(
            `SELECT t.id, t.ticket_id, t.name, t.surname, t.email 
             FROM tickets t
             WHERE t.event_id = $1
             ORDER BY RANDOM()
             LIMIT $2`,
            [eventId, limit]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No tickets found for this event to draw a winner.' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Error drawing giveaway winner:', error);
        res.status(500).json({ message: 'Error drawing winner' });
    }
};
