import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

let pool;

export async function getDbConnection() {
  if (!pool) {
    const defaultUri = 'mysql://anu@127.0.0.1:3306/angebingo';
    const uri = process.env.DATABASE_URL || process.env.MYSQL_URI || defaultUri;
    try {
      pool = mysql.createPool(uri);
      // test a simple query to fail fast if the DB is unreachable
      await pool.query('SELECT 1');

      // Auto-recovery for corrupted/orphaned tables in InnoDB
      try {
        await pool.query('SELECT 1 FROM transactions LIMIT 1');
      } catch (err) {
        console.warn("Transactions table is corrupted or orphaned in engine. Dropping to recreate:", err.message);
        try {
          await pool.query('DROP TABLE IF EXISTS transactions');
        } catch (dropErr) {
          console.error("Failed to drop corrupted transactions table:", dropErr.message);
        }
      }

      try {
        await pool.query('SELECT 1 FROM rooms LIMIT 1');
      } catch (err) {
        console.warn("Rooms table is corrupted or orphaned in engine. Dropping to recreate:", err.message);
        try {
          await pool.query('DROP TABLE IF EXISTS rooms');
        } catch (dropErr) {
          console.error("Failed to drop corrupted rooms table:", dropErr.message);
        }
      }

      try {
        await pool.query('SELECT 1 FROM users LIMIT 1');
      } catch (err) {
        console.warn("Users table is corrupted or orphaned in engine. Dropping to recreate:", err.message);
        try {
          await pool.query('DROP TABLE IF EXISTS users');
        } catch (dropErr) {
          console.error("Failed to drop corrupted users table:", dropErr.message);
        }
      }
      
      // Auto-create transactions table if it does not exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          amount INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Auto-create rooms table if it does not exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS rooms (
          id INT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          entry_fee INT NOT NULL,
          prize INT NOT NULL,
          max_players INT NOT NULL,
          color VARCHAR(255) NOT NULL,
          glow VARCHAR(255) NOT NULL,
          hot TINYINT DEFAULT 0,
          pattern VARCHAR(255) NOT NULL DEFAULT '1 Line'
        );
      `);

      // Auto-create users table if it does not exist
      await pool.query(`
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
      `);

      // Migration: Add phone column to users if it doesn't exist
      try {
        await pool.query("ALTER TABLE users ADD COLUMN phone VARCHAR(50) DEFAULT ''");
      } catch (err) {
        // Ignored if column already exists
      }

      // Migration: Add current_room_id column to users if it doesn't exist
      try {
        await pool.query("ALTER TABLE users ADD COLUMN current_room_id INT DEFAULT NULL");
      } catch (err) {
        // Ignored if column already exists
      }

      // Migration: Add email_verified column to users if it doesn't exist
      try {
        await pool.query("ALTER TABLE users ADD COLUMN email_verified TINYINT DEFAULT 0");
      } catch (err) {
        // Ignored if column already exists
      }

      // Migration: Add verification_code column to users if it doesn't exist
      try {
        await pool.query("ALTER TABLE users ADD COLUMN verification_code VARCHAR(6) DEFAULT NULL");
      } catch (err) {
        // Ignored if column already exists
      }

      // Migration: Add verification_expires column to users if it doesn't exist
      try {
        await pool.query("ALTER TABLE users ADD COLUMN verification_expires TIMESTAMP NULL DEFAULT NULL");
      } catch (err) {
        // Ignored if column already exists
      }

      // Migration: Add pattern column if it doesn't exist (MySQL/MariaDB fallback check)
      try {
        await pool.query("ALTER TABLE rooms ADD COLUMN pattern VARCHAR(255) NOT NULL DEFAULT '1 Line'");
        // Update default values for seeded rows
        await pool.query("UPDATE rooms SET pattern = '1 Line' WHERE id = 1");
        await pool.query("UPDATE rooms SET pattern = '2 Lines' WHERE id = 2");
        await pool.query("UPDATE rooms SET pattern = 'Full House' WHERE id = 3");
        await pool.query("UPDATE rooms SET pattern = '3 Lines' WHERE id = 4");
      } catch (err) {
        // Ignored if column already exists
      }

      // Seed default rooms if table is empty
      const [roomCountRows] = await pool.query('SELECT COUNT(*) as count FROM rooms');
      if (roomCountRows[0].count === 0) {
        await pool.query(`
          INSERT INTO rooms (id, name, entry_fee, prize, max_players, color, glow, hot, pattern) VALUES
          (1, "Beginner's Luck", 10, 500, 50, "from-emerald-500 to-teal-600", "shadow-[0_0_20px_rgba(16,185,129,0.3)]", 0, "1 Line"),
          (2, "Midnight Madness", 50, 3000, 50, "from-fuchsia-500 to-purple-600", "shadow-[0_0_20px_rgba(192,38,211,0.3)]", 1, "2 Lines"),
          (3, "High Roller VIP", 500, 50000, 25, "from-yellow-400 to-amber-600", "shadow-[0_0_20px_rgba(250,204,21,0.3)]", 0, "Full House"),
          (4, "Speed Daub", 25, 1000, 100, "from-cyan-400 to-blue-600", "shadow-[0_0_20px_rgba(34,211,238,0.3)]", 0, "3 Lines")
        `);
      }

      // Seed default admin user if users table is empty
      const [userCountRows] = await pool.query('SELECT COUNT(*) as count FROM users');
      if (userCountRows[0].count === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await pool.query(`
          INSERT INTO users (name, email, password, role, status, email_verified) VALUES
          ('Admin', 'admin@gmail.com', ?, 'admin', 'active', 1)
        `, [hashedPassword]);
      }
    } catch (err) {
      console.error('MySQL pool creation failed:', err?.message || err);
      // clear pool so subsequent attempts can retry
      pool = undefined;
      throw err;
    }
  }
  return pool;
}
