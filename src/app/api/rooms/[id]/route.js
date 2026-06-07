import { getDbConnection } from "@/src/lib/mysql";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const pool = await getDbConnection();
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [Number(id)]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    const r = rows[0];
    return NextResponse.json({
      id: r.id,
      name: r.name,
      entryFee: r.entry_fee,
      prize: r.prize,
      maxPlayers: r.max_players,
      color: r.color,
      glow: r.glow,
      hot: !!r.hot,
      pattern: r.pattern || '1 Line'
    });
  } catch (error) {
    console.error("Failed to fetch room details:", error);
    return NextResponse.json({ error: "Failed to fetch room details" }, { status: 500 });
  }
}
