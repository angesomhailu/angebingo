import mysql from 'mysql2/promise';

let pool;

export async function getDbConnection() {
  if (!pool) {
    const defaultUri = 'mysql://anu@127.0.0.1:3306/angebingo';
    const uri = process.env.DATABASE_URL || process.env.MYSQL_URI || defaultUri;
    try {
      pool = mysql.createPool(uri);
      // test a simple query to fail fast if the DB is unreachable
      await pool.query('SELECT 1');
      
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
          hot TINYINT DEFAULT 0
        );
      `);

      // Seed default rooms if table is empty
      const [roomCountRows] = await pool.query('SELECT COUNT(*) as count FROM rooms');
      if (roomCountRows[0].count === 0) {
        await pool.query(`
          INSERT INTO rooms (id, name, entry_fee, prize, max_players, color, glow, hot) VALUES
          (1, "Beginner's Luck", 10, 500, 50, "from-emerald-500 to-teal-600", "shadow-[0_0_20px_rgba(16,185,129,0.3)]", 0),
          (2, "Midnight Madness", 50, 3000, 50, "from-fuchsia-500 to-purple-600", "shadow-[0_0_20px_rgba(192,38,211,0.3)]", 1),
          (3, "High Roller VIP", 500, 50000, 25, "from-yellow-400 to-amber-600", "shadow-[0_0_20px_rgba(250,204,21,0.3)]", 0),
          (4, "Speed Daub", 25, 1000, 100, "from-cyan-400 to-blue-600", "shadow-[0_0_20px_rgba(34,211,238,0.3)]", 0)
        `);
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
