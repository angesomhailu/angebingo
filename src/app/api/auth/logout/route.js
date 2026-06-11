import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getDbConnection } from "@/src/lib/mysql";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session')?.value;
        if (sessionToken) {
            try {
                const secretKey = new TextEncoder().encode(
                    process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
                );
                const { payload } = await jwtVerify(sessionToken, secretKey);
                if (payload && payload.id) {
                    const pool = await getDbConnection();
                    await pool.query("UPDATE users SET current_room_id = NULL WHERE id = ?", [payload.id]);
                }
            } catch (err) {
                console.error("Failed to clear current_room_id on logout:", err);
            }
        }
        cookieStore.delete('session');

        return Response.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Logout Error:", error);
        return Response.json(
            { error: "Failed to logout" },
            { status: 500 }
        );
    }
}
