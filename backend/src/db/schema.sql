-- Initial Schema for Rodetes Party App

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(50),
  location VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  ticket_availability INT DEFAULT 0,
  poster_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event Gallery table
CREATE TABLE IF NOT EXISTS event_galleries (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drags table
CREATE TABLE IF NOT EXISTS drags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  instagram VARCHAR(255),
  cover_image_url TEXT,
  card_color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Merch Items (Web & Drag)
CREATE TABLE IF NOT EXISTS merch_items (
  id SERIAL PRIMARY KEY,
  drag_id INT REFERENCES drags(id) ON DELETE CASCADE NULL, -- NULL indicates Web Merch
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  ticket_id VARCHAR(255) UNIQUE NOT NULL, -- QR Code content
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  surname VARCHAR(255),
  quantity INT NOT NULL,
  is_scanned BOOLEAN DEFAULT false,
  scanned_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Merch Sales
CREATE TABLE IF NOT EXISTS merch_sales (
  id SERIAL PRIMARY KEY,
  sale_id VARCHAR(255) UNIQUE NOT NULL,
  merch_item_id INT REFERENCES merch_items(id) ON DELETE SET NULL,
  drag_id INT REFERENCES drags(id) ON DELETE SET NULL,
  drag_name VARCHAR(255),
  buyer_name VARCHAR(255),
  buyer_surname VARCHAR(255),
  is_delivered BOOLEAN DEFAULT false,
  delivered_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- App Config (Banner, Global settings)
CREATE TABLE IF NOT EXISTS app_config (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
