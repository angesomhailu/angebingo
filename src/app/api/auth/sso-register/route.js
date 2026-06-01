import { getDbConnection } from "@/src/lib/mysql";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
);

export async function POST(request) {
    try {
        const { provider, email: clientEmail, name: clientName } = await request.json();
        
        if (!provider || (provider !== 'google' && provider !== 'facebook' && provider !== 'github' && provider !== 'apple' && provider !== 'microsoft')) {
            return Response.json({ error: "Invalid provider" }, { status: 400 });
        }

        const name = clientName || (
            provider === 'google' ? "Google Player" : 
            provider === 'github' ? "GitHub Player" : 
            provider === 'apple' ? "Apple Player" :
            provider === 'microsoft' ? "Microsoft Player" :
            "Facebook Player"
        );
        const email = clientEmail || (
            provider === 'google' ? "googleplayer@gmail.com" : 
            provider === 'github' ? "githubplayer@github.com" : 
            provider === 'apple' ? "appleplayer@apple.com" :
            provider === 'microsoft' ? "microsoftplayer@outlook.com" :
            "facebookplayer@gmail.com"
        );
        const placeholderPassword = "sso_placeholder_password_12345";

        const pool = await getDbConnection();
        
        // Check if user exists
        let [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        let user;

        if (rows.length === 0) {
            // Create user
            const hashedPassword = await bcrypt.hash(placeholderPassword, 10);
            const [insertResult] = await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, 'user']
            );
            
            const [newUserRows] = await pool.query('SELECT * FROM users WHERE id = ?', [insertResult.insertId]);
            user = newUserRows[0];
        } else {
            user = rows[0];
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
            { success: true, message: `Logged in via ${provider} successfully`, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
            { status: 200 }
        );
    } catch (error) {
        console.error("SSO Registration Error:", error);
        return Response.json({ error: "SSO authentication failed" }, { status: 500 });
    }
}
