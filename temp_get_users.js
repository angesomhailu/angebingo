const mysql = require('mysql2/promise');

async function main() {
  const uri = 'mysql://anu:changeme@127.0.0.1:3306/angebingo';
  try {
    const pool = mysql.createPool(uri);
    const [rows] = await pool.query('SELECT id, name, email, role FROM users');
    console.log("Users:", rows);
    await pool.end();
  } catch (err) {
    console.error("DB Query failed:", err);
  }
}

main();
