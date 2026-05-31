import { getDbConnection } from "@/src/lib/mysql";
import RoomsTableClient from "./RoomsTableClient";

export const dynamic = 'force-dynamic';

export default async function AdminRoomsPage() {
  let rooms = [];
  try {
    const pool = await getDbConnection();
    const [rows] = await pool.query('SELECT * FROM rooms ORDER BY id ASC');
    rooms = rows.map(r => ({
      id: r.id,
      name: r.name,
      entryFee: r.entry_fee,
      prize: r.prize,
      maxPlayers: r.max_players,
      color: r.color,
      glow: r.glow,
      hot: !!r.hot
    }));
  } catch (error) {
    console.error("Failed to load rooms inside admin:", error?.message || error);
  }

  return (
    <RoomsTableClient initialRooms={rooms} />
  );
}
