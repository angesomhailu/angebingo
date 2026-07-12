import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { getDbConnection } from "@/src/lib/mysql";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { sendSignInAlertEmail } from "@/src/lib/email";
import { sendSignInAlertSMS } from "@/src/lib/sms";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
);

export async function POST() {
    try {
        const nextSession = await getServerSession(authOptions);
        if (!nextSession?.user?.email) {
            return Response.json({ success: false, message: "No NextAuth session active" }, { status: 200 });
        }

        const cookieStore = await cookies();
        const customSessionToken = cookieStore.get('session')?.value;

        // Check if custom session is already present and matches the NextAuth session email
        if (customSessionToken) {
            try {
                const { payload } = await jwtVerify(customSessionToken, secretKey);
                if (payload?.email === nextSession.user.email) {
                    return Response.json({ success: true, synced: false, message: "Already synced" }, { status: 200 });
                }
            } catch (err) {
                // Invalid custom token, proceed with sync
            }
        }

        // Fetch user from DB to generate custom JWT session
        const pool = await getDbConnection();
        let [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [nextSession.user.email]);

        if (rows.length === 0) {
            return Response.json({ success: false, error: "User not found in database" }, { status: 404 });
        }

        const dbUser = rows[0];
        if (dbUser.status === 'suspended') {
            return Response.json({ success: false, error: "Account suspended" }, { status: 403 });
        }

        // Generate our custom session token
        const token = await new SignJWT({ id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secretKey);

        // Set the custom HTTP-only session cookie
        cookieStore.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        // Send login alert notifications for Google SSO
        try {
            await sendSignInAlertEmail(dbUser.email, dbUser.name);
            if (dbUser.phone) {
                await sendSignInAlertSMS(dbUser.phone, dbUser.name);
            }
        } catch (err) {
            console.error("Failed to send login alert notifications for Google SSO:", err);
        }

        return Response.json({
            success: true,
            synced: true,
            user: { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role }
        }, { status: 200 });

    } catch (error) {
        console.error("SSO sync error in API handler:", error);
        return Response.json({ success: false, error: "Internal server error during session sync" }, { status: 500 });
    }
}
