import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Load .env manually
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  // Ignored
}

async function setup() {
  try {
    // Connect to MySQL server without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: 'root',
      password: '', // Connect as root to create the database/user
      port: parseInt(process.env.DB_PORT || '3307', 10)
    });

    console.log('Connected to MySQL server.');

    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS angebingo;');
    console.log('Database "angebingo" ensured.');

    // Switch to the newly created database
    await connection.query('USE angebingo;');

    // Drop existing table to apply new schema
    await connection.query('DROP TABLE IF EXISTS users;');
    
    // Create the users table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT '',
        role VARCHAR(50) DEFAULT 'user',
        status VARCHAR(50) DEFAULT 'active',
        current_room_id INT DEFAULT NULL,
        email_verified TINYINT DEFAULT 0,
        verification_code VARCHAR(6) DEFAULT NULL,
        verification_expires TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createTableQuery);
    console.log('Table "users" ensured.');

    await connection.end();
    console.log('Setup complete! You can now run the app.');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up the database:', error);
    process.exit(1);
  }
}

setup();
