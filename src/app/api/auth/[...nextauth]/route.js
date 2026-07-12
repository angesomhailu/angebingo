import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getDbConnection } from "@/src/lib/mysql";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === 'google') {
                try {
                    const pool = await getDbConnection();
                    // Check if user exists
                    let [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [user.email]);
                    
                    if (rows.length === 0) {
                        // Create user
                        const placeholderPassword = "sso_placeholder_password_12345";
                        const hashedPassword = await bcrypt.hash(placeholderPassword, 10);
                        await pool.query(
                            'INSERT INTO users (name, email, password, role, email_verified) VALUES (?, ?, ?, ?, 1)',
                            [user.name, user.email, hashedPassword, 'user']
                        );
                    } else {
                        const dbUser = rows[0];
                        if (dbUser.status === 'suspended') {
                            return false; // Reject sign in
                        }
                    }
                    return true;
                } catch (error) {
                    console.error("Error in NextAuth Google sign in callback:", error);
                    return false;
                }
            }
            return true;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || 'fallback_secret_for_development_only_12345',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };