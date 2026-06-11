import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import { getDbConnection } from "@/src/lib/mysql";
import LobbyClient from './LobbyClient';

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
);

export default async function LobbyPage() {
  // Get logged-in user from session cookie (fallback to mock)
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  const user = {
    username: "PlayerOne",
    coins: 0,
    level: 12,
    xpProgress: 65 // percentage
  };

  let shouldRedirectToAdmin = false;
  if (sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, secretKey);
      if (payload?.role === 'admin') {
        shouldRedirectToAdmin = true;
      }
      if (payload?.name) {
        user.username = payload.name;

        // Fetch balance and phone number from DB
        const pool = await getDbConnection();
        const [balanceRows] = await pool.query(
          'SELECT SUM(amount) as balance FROM transactions WHERE username = ?',
          [payload.name]
        );
        user.coins = Number(balanceRows[0]?.balance || 0);

        const [userRows] = await pool.query(
          'SELECT phone FROM users WHERE name = ?',
          [payload.name]
        );
        if (userRows.length > 0) {
          user.phone = userRows[0].phone || '';
        }
      }
    } catch (error) {
      console.error('Invalid session token:', error);
    }
  }

  if (shouldRedirectToAdmin) {
    redirect('/admin');
  }

  // Fetch exact players from the database for the Top Today section
  let topPlayers = [];
  let activeRooms = [];
  try {
    const pool = await getDbConnection();
    const [rows] = await pool.query("SELECT id, name FROM users WHERE role != 'admin' ORDER BY id ASC LIMIT 5");
    topPlayers = rows;

    // Fetch counts of players currently in each room
    const [playerCountRows] = await pool.query(`
      SELECT current_room_id, COUNT(*) as count 
      FROM users 
      WHERE role != 'admin' AND current_room_id IS NOT NULL 
      GROUP BY current_room_id
    `);
    
    const roomPlayersMap = {};
    playerCountRows.forEach(row => {
      roomPlayersMap[row.current_room_id] = row.count;
    });

    const [roomRows] = await pool.query('SELECT * FROM rooms ORDER BY id ASC');
    activeRooms = roomRows.map(r => {
      const actualPlayers = roomPlayersMap[r.id] || 0;
      return {
        id: r.id,
        name: r.name,
        entryFee: r.entry_fee,
        prize: r.prize,
        maxPlayers: r.max_players,
        players: actualPlayers,
        color: r.color,
        glow: r.glow,
        hot: !!r.hot,
        pattern: r.pattern || '1 Line'
      };
    });
  } catch (error) {
    console.error("Failed to load DB details for lobby:", error);
    activeRooms = [
      { id: 1, name: "Beginner's Luck", entryFee: 10, prize: 500, players: 34, maxPlayers: 50, color: "from-emerald-500 to-teal-600", glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]", hot: false },
      { id: 2, name: "Midnight Madness", entryFee: 50, prize: 3000, players: 48, maxPlayers: 50, color: "from-fuchsia-500 to-purple-600", glow: "shadow-[0_0_20px_rgba(192,38,211,0.3)]", hot: true },
      { id: 3, name: "High Roller VIP", entryFee: 500, prize: 50000, players: 12, maxPlayers: 25, color: "from-yellow-400 to-amber-600", glow: "shadow-[0_0_20px_rgba(250,204,21,0.3)]", hot: false },
      { id: 4, name: "Speed Daub", entryFee: 25, prize: 1000, players: 22, maxPlayers: 100, color: "from-cyan-400 to-blue-600", glow: "shadow-[0_0_20px_rgba(34,211,238,0.3)]", hot: false }
    ];
  }

  return (
    <LobbyClient initialUser={user} initialTopPlayers={topPlayers} initialRooms={activeRooms} />
  );
}
