import { Request, Response } from 'express';
import { query } from '../models/db';
import crypto from 'crypto';

// Get all sales (Admin)
export const getAllSales = async (req: Request, res: Response) => {
    try {
        const result = await query(`
      SELECT s.*, m.name as item_name, m.price, d.name as drag_owner
      FROM merch_sales s
      LEFT JOIN merch_items m ON s.merch_item_id = m.id
      LEFT JOIN drags d ON s.drag_id = d.id
      ORDER BY s.created_at DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: 'Error al obtener ventas' });
    }
};

// Create Sale (Purchase)
export const createSale = async (req: Request, res: Response) => {
    const { merch_item_id, drag_id, buyer_name, buyer_surname } = req.body;

    if (!merch_item_id) {
        return res.status(400).json({ message: 'ID del artículo es requerido' });
    }

    try {
        // Get item details
        const itemRes = await query('SELECT * FROM merch_items WHERE id = $1', [merch_item_id]);
        if (itemRes.rows.length === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        const item = itemRes.rows[0];

        // Get drag name if drag_id present
        let dragName = 'RODETES OFICIAL';
        if (drag_id) {
            const dragRes = await query('SELECT name FROM drags WHERE id = $1', [drag_id]);
            if (dragRes.rows.length > 0) {
                dragName = dragRes.rows[0].name;
            }
        } else if (item.drag_id) {
            // If item belongs to drag but drag_id wasn't sent explicitly
            const dragRes = await query('SELECT name FROM drags WHERE id = $1', [item.drag_id]);
            if (dragRes.rows.length > 0) {
                dragName = dragRes.rows[0].name;
            }
        }

        const saleId = crypto.randomUUID();

        const result = await query(
            `INSERT INTO merch_sales (sale_id, merch_item_id, drag_id, drag_name, buyer_name, buyer_surname)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [saleId, merch_item_id, drag_id || item.drag_id, dragName, buyer_name, buyer_surname]
        );

        res.status(201).json({ success: true, sale: result.rows[0] });

    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ message: 'Error al registrar venta' });
    }
};

// Deliver Item (Admin/Scanner)
export const deliverSale = async (req: Request, res: Response) => {
    const { sale_id } = req.body;

    if (!sale_id) {
        return res.status(400).json({ message: 'Sale ID es requerido' });
    }

    try {
        const result = await query(`
        UPDATE merch_sales 
        SET is_delivered = true, delivered_at = CURRENT_TIMESTAMP 
        WHERE sale_id = $1 
        RETURNING *
    `, [sale_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        res.json({ success: true, message: 'Producto entregado', sale: result.rows[0] });

    } catch (error) {
        console.error('Error delivering sale:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};
