import mysql from 'mysql2/promise';

async function setup() {
  try {
    // Connect to MySQL server without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Default XAMPP password is empty
      port: 3306
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
        role VARCHAR(50) DEFAULT 'user',
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
