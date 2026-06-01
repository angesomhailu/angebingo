import { getDbConnection } from "@/src/lib/mysql";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
);

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const pool = await getDbConnection();
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return Response.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        const user = rows[0];
        if (user.status === 'suspended') {
            return Response.json(
                { error: "Your account has been suspended. Please contact support." },
                { status: 403 }
            );
        }
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return Response.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Create JWT
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
            { message: "Logged in successfully", user: { id: user.id, name: user.name, email: user.email, role: user.role } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login Error:", error);
        return Response.json(
            { error: "Failed to login" },
            { status: 500 }
        );
    }
}
