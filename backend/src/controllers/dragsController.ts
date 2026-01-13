import { Request, Response } from 'express';
import { query } from '../models/db';
import { getFileUrl } from '../middleware/uploadMiddleware';

// Get all drags (Public)
// Get all drags (Public)
export const getAllDrags = async (req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT d.*, 
                   COALESCE(
                       json_agg(
                           json_build_object(
                               'id', m.id,
                               'name', m.name,
                               'price', m.price,
                               'image_url', m.image_url
                           ) ORDER BY m.id
                       ) FILTER (WHERE m.id IS NOT NULL), 
                       '[]'
                   ) as merch
            FROM drags d
            LEFT JOIN merch_items m ON d.id = m.drag_id
            GROUP BY d.id
            ORDER BY d.name ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching drags:', error);
        res.status(500).json({ message: 'Error al obtener drags' });
    }
};

// Get single drag
export const getDragById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM drags WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Drag no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching drag:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

// Create Drag (Admin)
export const createDrag = async (req: Request, res: Response) => {
    const { name, description, instagram, cover_image_url, card_color } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'El nombre es requerido' });
    }

    try {
        const result = await query(
            `INSERT INTO drags (name, description, instagram, cover_image_url, card_color)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [name, description, instagram, cover_image_url, card_color]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating drag:', error);
        res.status(500).json({ message: 'Error al crear drag' });
    }
};

// Update Drag (Admin)
export const updateDrag = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, instagram, cover_image_url, card_color } = req.body;

    try {
        const result = await query(
            `UPDATE drags
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           instagram = COALESCE($3, instagram),
           cover_image_url = COALESCE($4, cover_image_url),
           card_color = COALESCE($5, card_color),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
            [name, description, instagram, cover_image_url, card_color, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Drag no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating drag:', error);
        res.status(500).json({ message: 'Error al actualizar drag' });
    }
};

// Delete Drag (Admin)
export const deleteDrag = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM drags WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Drag no encontrada' });
        }
        res.json({ message: 'Drag eliminada correctamente' });
    } catch (error) {
        console.error('Error deleting drag:', error);
        res.status(500).json({ message: 'Error al eliminar drag' });
    }
};

// Upload drag image
export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = getFileUrl(req.file.filename, 'drags');
        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image' });
    }
};
