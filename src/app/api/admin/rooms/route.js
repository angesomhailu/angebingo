import { getDbConnection } from "@/src/lib/mysql";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
);

export async function PUT(req) {
  try {
    // 1. Authorize Admin role
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    
    const { payload } = await jwtVerify(sessionToken, secretKey);
    if (payload?.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden access" }, { status: 403 });
    }

    // 2. Parse request payload
    const body = await req.json();
    const { id, name, entry_fee, prize, max_players, hot, pattern, bulk } = body;

    const pool = await getDbConnection();

    // 2.1 Check for bulk updates
    if (bulk) {
      if (!pattern) {
        return NextResponse.json({ error: "Missing pattern parameter for bulk update" }, { status: 400 });
      }
      await pool.query('UPDATE rooms SET pattern = ?', [pattern]);
      return NextResponse.json({ success: true, message: `All rooms updated to pattern: ${pattern}` });
    }

    if (!id || !name || entry_fee === undefined || prize === undefined) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // 3. Update configuration inside MySQL
    await pool.query(
      'UPDATE rooms SET name = ?, entry_fee = ?, prize = ?, max_players = ?, hot = ?, pattern = ? WHERE id = ?',
      [name, Number(entry_fee), Number(prize), Number(max_players || 50), hot ? 1 : 0, pattern || '1 Line', Number(id)]
    );

    return NextResponse.json({ success: true, message: "Room configuration updated successfully!" });
  } catch (error) {
    console.error("Failed to update room config:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}
