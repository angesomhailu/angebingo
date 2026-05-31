import { getDbConnection } from "@/src/lib/mysql";

export async function POST(request) {
    try {
        const { email } = await request.json();
        
        if (!email) {
            return Response.json({ error: "Email is required" }, { status: 400 });
        }

        const pool = await getDbConnection();
        const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return Response.json({ error: "No account found with this email address" }, { status: 404 });
        }

        // Return success and the reset route (mock secure token transfer)
        return Response.json(
            { 
                success: true, 
                message: "Email verified", 
                resetUrl: `/reset-password?email=${encodeURIComponent(email)}` 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Forgot Password API Error:", error);
        return Response.json({ error: "An error occurred. Please try again." }, { status: 500 });
    }
}
