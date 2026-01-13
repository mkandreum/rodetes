
import fs from 'fs';
import path from 'path';
import { pool } from '../models/db';

const LEGACY_PATH = path.join(__dirname, '../../legacy_data');

const loadJSON = (filename: string) => {
    try {
        const filePath = path.join(LEGACY_PATH, filename);
        if (!fs.existsSync(filePath)) return null;
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return null;
    }
};

const migrate = async () => {
    console.log('Starting migration...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. App Config & Events & Drags (datos_app.json)
        const appData = loadJSON('datos_app.json');
        if (appData) {
            console.log('Migrating App Data...');

            // Settings
            const settings = [
                { key: 'allowedDomains', value: JSON.stringify(appData.allowedDomains || []) },
                { key: 'bannerVideoUrl', value: appData.bannerVideoUrl || '' },
                { key: 'logoTicketUrl', value: appData.logoTicketUrl || '' },
                { key: 'logoUrl', value: appData.logoUrl || '' },
                { key: 'promoBanner', value: JSON.stringify(appData.promoBanner || { enabled: false, text: '', color: '#ff00ff' }) }
            ];

            for (const s of settings) {
                await client.query(
                    `INSERT INTO app_config (key, value) VALUES ($1, $2) 
                     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
                    [s.key, s.value]
                );
            }

            // Events
            if (Array.isArray(appData.events)) {
                for (const evt of appData.events) {
                    await client.query(
                        `INSERT INTO events (id, title, date, time, location, description, price, ticket_availability, poster_url)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                         ON CONFLICT (id) DO NOTHING`, // Keep existing IDs
                        [evt.id, evt.title, evt.date, evt.time, evt.location, evt.description, evt.price || 0, evt.ticketAvailability || 0, evt.posterUrl]
                    );
                }
                // Update sequence
                await client.query(`SELECT setval('events_id_seq', (SELECT MAX(id) FROM events))`);
            }

            // Drags
            if (Array.isArray(appData.drags)) {
                for (const drag of appData.drags) {
                    await client.query(
                        `INSERT INTO drags (id, name, instagram, description, card_color, cover_image_url)
                         VALUES ($1, $2, $3, $4, $5, $6)
                         ON CONFLICT (id) DO NOTHING`,
                        [drag.id, drag.name, drag.instagram, drag.description, drag.cardColor || drag.color, drag.coverImageUrl || drag.img]
                    );

                    // Drag Merch
                    if (Array.isArray(drag.merch)) {
                        for (const item of drag.merch) {
                            await client.query(
                                `INSERT INTO merch_items (id, name, price, image_url, drag_id)
                                 VALUES ($1, $2, $3, $4, $5)
                                 ON CONFLICT (id) DO NOTHING`,
                                [item.id, item.name, item.price, item.imageUrl || item.img, drag.id]
                            );
                        }
                    }
                }
                await client.query(`SELECT setval('drags_id_seq', (SELECT MAX(id) FROM drags))`);
            }

            // Web Merch
            if (Array.isArray(appData.webMerch)) {
                for (const item of appData.webMerch) {
                    await client.query(
                        `INSERT INTO merch_items (id, name, price, image_url, drag_id)
                         VALUES ($1, $2, $3, $4, NULL) -- NULL drag_id for Web Merch
                         ON CONFLICT (id) DO NOTHING`,
                        [item.id, item.name, item.price, item.imageUrl || item.img]
                    );
                }
            }
            // Update Merch Sequence
            await client.query(`SELECT setval('merch_items_id_seq', (SELECT MAX(id) FROM merch_items))`);
        } else {
            console.warn('datos_app.json not found, skipping App Data migration.');
        }

        // 2. Tickets (entradas_db.json)
        const tickets = loadJSON('entradas_db.json');
        if (Array.isArray(tickets)) {
            console.log(`Migrating ${tickets.length} tickets...`);
            for (const t of tickets) {
                // Check if event exists
                const eventRes = await client.query('SELECT id FROM events WHERE id = $1', [t.eventId]);
                if (eventRes.rows.length > 0) {
                    await client.query(
                        `INSERT INTO tickets (ticket_id, event_id, email, name, surname, quantity, is_scanned, scanned_at, created_at)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                         ON CONFLICT (ticket_id) DO NOTHING`,
                        [t.ticketId, t.eventId, t.email, t.name, t.surname, t.quantity || 1, t.isScanned || false, t.scannedAt || null, t.createdAt || new Date()]
                    );
                } else {
                    console.warn(`Skipping ticket ${t.ticketId} for non-existent event ${t.eventId}`);
                }
            }
        }

        // 3. Merch Sales (merch_vendido.json)
        const sales = loadJSON('merch_vendido.json');
        if (Array.isArray(sales)) {
            console.log(`Migrating ${sales.length} merch sales...`);
            for (const s of sales) {
                // Create random ID if not present (legacy might not have UUID)
                const saleId = s.saleId || s.id || crypto.randomUUID();

                await client.query(
                    `INSERT INTO merch_sales (sale_id, merch_item_id, drag_id, drag_name, buyer_name, buyer_surname, is_delivered, delivered_at, created_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                     ON CONFLICT (sale_id) DO NOTHING`,
                    [
                        saleId,
                        s.merchItemId || null, // Allow null if item deleted, but better to map
                        s.dragId || null,
                        s.dragName || 'Unknown',
                        s.buyerName,
                        s.buyerSurname,
                        s.isDelivered || false,
                        s.deliveredAt || null,
                        s.createdAt || new Date()
                    ]
                );
            }
        }

        await client.query('COMMIT');
        console.log('Migration completed successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', error);
    } finally {
        client.release();
        process.exit(); // Exit script
    }
};

migrate();
