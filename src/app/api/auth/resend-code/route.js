import { getDbConnection } from "@/src/lib/mysql";
import { sendVerificationEmail } from "@/src/lib/email";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return Response.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const pool = await getDbConnection();
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return Response.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const user = rows[0];

        if (user.email_verified) {
            return Response.json(
                { error: "Email is already verified" },
                { status: 400 }
            );
        }

        // Generate a new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const verificationExpires = expires.toISOString().slice(0, 19).replace('T', ' ');

        await pool.query(
            'UPDATE users SET verification_code = ?, verification_expires = ? WHERE id = ?',
            [verificationCode, verificationExpires, user.id]
        );

        // Send verification email
        let emailResult = { fallback: true };
        try {
            emailResult = await sendVerificationEmail(email, user.name, verificationCode);
        } catch (err) {
            console.error("Failed to send verification email:", err);
        }

        return Response.json(
            { 
                message: "Verification code resent successfully!", 
                devVerificationCode: emailResult.fallback ? verificationCode : null
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Resend Verification Code Error:", error);
        return Response.json(
            { error: "Failed to resend verification code" },
            { status: 500 }
        );
    }
}
