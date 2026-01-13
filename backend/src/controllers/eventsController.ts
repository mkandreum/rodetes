import { Request, Response } from 'express';
import { query } from '../models/db';
import { getFileUrl } from '../middleware/uploadMiddleware';

// List all visible events (Public)
export const getPublicEvents = async (req: Request, res: Response) => {
    try {
        const result = await query(
            'SELECT * FROM events WHERE is_visible = true ORDER BY date ASC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching public events:', error);
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
};

// List all events (Admin)
export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM events ORDER BY date DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching admin events:', error);
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
};

// Get single event
export const getEventById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM events WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

// Create Event (Admin)
export const createEvent = async (req: Request, res: Response) => {
    const { title, date, time, location, description, price, ticket_availability, poster_url, is_visible } = req.body;

    if (!title || !date) {
        return res.status(400).json({ message: 'Título y fecha son requeridos' });
    }

    try {
        const result = await query(
            `INSERT INTO events (title, date, time, location, description, price, ticket_availability, poster_url, is_visible)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
            [title, date, time, location, description, price, ticket_availability, poster_url, is_visible || true]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error al crear evento' });
    }
};

// Update Event (Admin)
export const updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, date, time, location, description, price, ticket_availability, poster_url, is_visible } = req.body;

    try {
        const result = await query(
            `UPDATE events
       SET title = COALESCE($1, title),
           date = COALESCE($2, date),
           time = COALESCE($3, time),
           location = COALESCE($4, location),
           description = COALESCE($5, description),
           price = COALESCE($6, price),
           ticket_availability = COALESCE($7, ticket_availability),
           poster_url = COALESCE($8, poster_url),
           is_visible = COALESCE($9, is_visible),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
            [title, date, time, location, description, price, ticket_availability, poster_url, is_visible, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error al actualizar evento' });
    }
};

// Delete Event (Admin)
export const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error al eliminar evento' });
    }
};

// Upload event poster
export const uploadPoster = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = getFileUrl(req.file.filename, 'events');
        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Error uploading poster:', error);
        res.status(500).json({ message: 'Error uploading poster' });
    }
};
