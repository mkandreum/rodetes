import { Request, Response } from 'express';
import { query } from '../models/db';
import crypto from 'crypto';

// Get all tickets (Admin)
export const getAllTickets = async (req: Request, res: Response) => {
    try {
        const result = await query(`
      SELECT t.*, e.title as event_title 
      FROM tickets t
      LEFT JOIN events e ON t.event_id = e.id
      ORDER BY t.created_at DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Error al obtener entradas' });
    }
};

// Create Ticket (Purchase)
export const createTicket = async (req: Request, res: Response) => {
    const { event_id, email, name, surname, quantity } = req.body;

    if (!event_id || !email || !quantity) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        // Check availability (Optional: depends on strictness)
        const eventRes = await query('SELECT ticket_availability FROM events WHERE id = $1', [event_id]);
        if (eventRes.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        // In a real app, successful payment verification goes here

        const tickets = [];
        for (let i = 0; i < quantity; i++) {
            const ticketId = crypto.randomUUID(); // Unique QR ID
            const result = await query(
                `INSERT INTO tickets (ticket_id, event_id, email, name, surname, quantity)
             VALUES ($1, $2, $3, $4, $5, 1)
             RETURNING *`,
                [ticketId, event_id, email, name, surname]
            );
            tickets.push(result.rows[0]);
        }

        res.status(201).json({ success: true, tickets });

    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ message: 'Error al crear entrada' });
    }
};

// Validate/Scan Ticket
export const scanTicket = async (req: Request, res: Response) => {
    const { ticket_id } = req.body;

    if (!ticket_id) {
        return res.status(400).json({ message: 'Ticket ID es requerido' });
    }

    try {
        const result = await query(`
      SELECT t.*, e.title as event_title, e.date
      FROM tickets t
      LEFT JOIN events e ON t.event_id = e.id
      WHERE t.ticket_id = $1
    `, [ticket_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Entrada no encontrada' });
        }

        const ticket = result.rows[0];

        if (ticket.is_scanned) {
            return res.status(400).json({
                message: 'Esta entrada YA fue validada anteriormente',
                ticket
            });
        }

        // Mark as scanned
        await query(
            'UPDATE tickets SET is_scanned = true, scanned_at = CURRENT_TIMESTAMP WHERE id = $1',
            [ticket.id]
        );

        res.json({
            success: true,
            message: 'Entrada válida',
            ticket: { ...ticket, is_scanned: true }
        });

    } catch (error) {
        console.error('Error scanning ticket:', error);
        res.status(500).json({ message: 'Error interno al validar' });
    }
};

// Giveaway Winner
export const getGiveawayWinner = async (req: Request, res: Response) => {
    const { event_id } = req.params;
    const { count } = req.query;

    const limit = parseInt(count as string) || 1;

    try {
        const result = await query(
            `SELECT t.id, t.ticket_id, t.name, t.surname, t.email 
             FROM tickets t
             WHERE t.event_id = $1
             ORDER BY RANDOM()
             LIMIT $2`,
            [event_id, limit]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron entradas para este evento' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Error drawing giveaway winner:', error);
        res.status(500).json({ message: 'Error al realizar el sorteo' });
    }
};
