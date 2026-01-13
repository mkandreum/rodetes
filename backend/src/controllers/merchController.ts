import { Request, Response } from 'express';
import { query } from '../models/db';

// Get all merch items (Public)
// Can filter by ?type=web or ?dragId=123
export const getMerchItems = async (req: Request, res: Response) => {
    const { type, dragId } = req.query;

    try {
        let sql = 'SELECT * FROM merch_items';
        const params: any[] = [];

        if (type === 'web') {
            sql += ' WHERE drag_id IS NULL';
        } else if (dragId) {
            sql += ' WHERE drag_id = $1';
            params.push(dragId);
        }

        sql += ' ORDER BY name ASC';

        const result = await query(sql, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching merch:', error);
        res.status(500).json({ message: 'Error al obtener merch' });
    }
};

// Get single merch item
export const getMerchItemById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM merch_items WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching merch item:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

// Create Merch Item (Admin)
export const createMerchItem = async (req: Request, res: Response) => {
    const { name, price, image_url, drag_id } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ message: 'Nombre y precio son requeridos' });
    }

    try {
        const result = await query(
            `INSERT INTO merch_items (name, price, image_url, drag_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [name, price, image_url, drag_id || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating merch item:', error);
        res.status(500).json({ message: 'Error al crear artículo' });
    }
};

// Update Merch Item (Admin)
export const updateMerchItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, price, image_url, drag_id } = req.body;

    try {
        const result = await query(
            `UPDATE merch_items
       SET name = COALESCE($1, name),
           price = COALESCE($2, price),
           image_url = COALESCE($3, image_url),
           drag_id = COALESCE($4, drag_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
            [name, price, image_url, drag_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating merch item:', error);
        res.status(500).json({ message: 'Error al actualizar artículo' });
    }
};

// Delete Merch Item (Admin)
export const deleteMerchItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM merch_items WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        res.json({ message: 'Artículo eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting merch item:', error);
        res.status(500).json({ message: 'Error al eliminar artículo' });
    }
};
