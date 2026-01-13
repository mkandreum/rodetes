import { Request, Response } from 'express';
import { query } from '../models/db';

// Get all galleries (Public) - Groups photos by event
export const getGalleries = async (req: Request, res: Response) => {
    try {
        // Join events to get titles
        const result = await query(`
      SELECT g.*, e.title as event_title, e.date as event_date
      FROM event_galleries g
      JOIN events e ON g.event_id = e.id
      ORDER BY e.date DESC
    `);

        // Grouping by event could be done here or in frontend. 
        // Sending flat list for now, simpler for frontend to filter/group if needed.
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching galleries:', error);
        res.status(500).json({ message: 'Error al obtener galería' });
    }
};

// Add Photo to Gallery (Admin)
export const addPhoto = async (req: Request, res: Response) => {
    const { event_id } = req.body;
    const file = req.file;

    if (!event_id || !file) {
        return res.status(400).json({ message: 'Evento y archivo de imagen requeridos' });
    }

    // Construct public URL
    // Assuming server runs on same domain/port proxy or we return relative path
    // For local dev/prod with static serving: /uploads/filename
    const image_url = `/uploads/${file.filename}`;

    try {
        const result = await query(
            `INSERT INTO event_galleries (event_id, image_url)
       VALUES ($1, $2)
       RETURNING *`,
            [event_id, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding photo:', error);
        res.status(500).json({ message: 'Error al agregar foto' });
    }
};

// Delete Photo (Admin)
export const deletePhoto = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM event_galleries WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Foto no encontrada' });
        }
        res.json({ message: 'Foto eliminada correctamente' });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ message: 'Error al eliminar foto' });
    }
};
