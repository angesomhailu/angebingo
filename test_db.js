const mysql = require('mysql2/promise');
async function test() {
  try {
    const pool = mysql.createPool('mysql://root@127.0.0.1:3307/angebingo');
    await pool.query('SELECT 1');
    console.log("Empty password success");
    pool.end();
  } catch (e) {
    console.error("Empty password fail:", e.message);
  }
}
test();
