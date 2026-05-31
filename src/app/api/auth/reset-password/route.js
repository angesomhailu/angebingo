import { getDbConnection } from "@/src/lib/mysql";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        
        if (!email || !password) {
            return Response.json({ error: "Email and password are required" }, { status: 400 });
        }

        const pool = await getDbConnection();
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Update password in the database
        const [result] = await pool.query(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email]
        );

        if (result.affectedRows === 0) {
            return Response.json({ error: "User not found or update failed" }, { status: 404 });
        }

        return Response.json(
            { success: true, message: "Password updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Reset Password API Error:", error);
        return Response.json({ error: "Failed to update password. Please try again." }, { status: 500 });
    }
}
