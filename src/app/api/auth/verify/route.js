import { getDbConnection } from "@/src/lib/mysql";
import { sendWelcomeEmail } from "@/src/lib/email";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
);

export async function POST(request) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return Response.json(
                { error: "Email and verification code are required" },
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

        if (user.verification_code !== code) {
            return Response.json(
                { error: "Invalid verification code" },
                { status: 400 }
            );
        }

        const expiry = new Date(user.verification_expires);
        if (expiry < new Date()) {
            return Response.json(
                { error: "Verification code has expired. Please request a new one." },
                { status: 400 }
            );
        }

        // Update database: set email_verified = 1 and clear verification columns
        await pool.query(
            'UPDATE users SET email_verified = 1, verification_code = NULL, verification_expires = NULL WHERE id = ?',
            [user.id]
        );

        // Send a real notification/welcome email to the Gmail address
        try {
            await sendWelcomeEmail(email, user.name);
        } catch (emailErr) {
            console.error("Failed to send welcome email:", emailErr);
        }

        // Auto login: Create JWT
        const token = await new SignJWT({ id: user.id, name: user.name, email: user.email, role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secretKey);

        // Set HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return Response.json(
            { 
                message: "Email verified successfully and logged in!", 
                user: { id: user.id, name: user.name, email: user.email, role: user.role } 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Verification Error:", error);
        return Response.json(
            { error: "Failed to verify email" },
            { status: 500 }
        );
    }
}
