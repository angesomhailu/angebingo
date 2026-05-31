import { getDbConnection } from "@/src/lib/mysql";

export async function GET() {
  try {
    const pool = await getDbConnection();
    // Fetch newest 20 transactions from the database
    const [rows] = await pool.query('SELECT * FROM transactions ORDER BY id DESC LIMIT 20');
    return Response.json(rows);
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    return Response.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { username, type, amount } = await request.json();

    if (!username || !type || amount === undefined) {
      return Response.json(
        { error: "Username, type, and amount are required" },
        { status: 400 }
      );
    }

    const pool = await getDbConnection();

    // Save transaction to MySQL database
    const [result] = await pool.query(
      'INSERT INTO transactions (username, type, amount) VALUES (?, ?, ?)',
      [username, type, amount]
    );

    return Response.json(
      { 
        message: "Transaction recorded successfully!", 
        transaction: { id: result.insertId, username, type, amount } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Transaction Error:", error);
    return Response.json(
      { error: "Failed to record transaction" },
      { status: 500 }
    );
  }
}
