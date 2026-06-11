import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getDbConnection } from "@/src/lib/mysql";
import { NextResponse } from "next/server";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
);

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(sessionToken, secretKey);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await request.json();
    const pool = await getDbConnection();
    await pool.query("UPDATE users SET current_room_id = ? WHERE id = ?", [
      roomId ? Number(roomId) : null,
      payload.id
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Active room update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
