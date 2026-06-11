import { getDbConnection } from "@/src/lib/mysql";

export async function GET() {
    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query('SELECT * FROM users');

        return Response.json(rows);
    } catch (error) {
        console.error("Fetch Users Error:", error);
        return Response.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const { name, email, password, phone } = await request.json();
        // Basic validation
        if (!name || !email || !password || !phone) {
            return Response.json(
                { error: "Name, email, password, and phone number are required" },
                { status: 400 }
            );
        }

        // Validate telebirr phone number format
        const phoneRegex = /^(09|07)\d{8}$|^251(9|7)\d{8}$/;
        if (!phoneRegex.test(phone)) {
            return Response.json(
                { error: "Invalid Telebirr phone number. Must start with 09 or 07 and be 10 digits (e.g., 0912345678)." },
                { status: 400 }
            );
        }

        const pool = await getDbConnection();

        // Hash the password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Make admin if email contains admin or name is anu
        let role = 'user';
        if (email.toLowerCase().includes('admin') || name.toLowerCase() === 'anu') {
            role = 'admin';
        }

        // Save the new user to the "users" table
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)', 
            [name, email, hashedPassword, phone, role]
        );

        // Return a successful response with the created user data
        return Response.json(
            { message: "User registered successfully!", user: { id: result.insertId, name, email, phone, role } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup Error:", error);
        // Handle unique constraint error
        if (error.code === 'ER_DUP_ENTRY') {
            return Response.json(
                { error: "Email already exists" },
                { status: 409 }
            );
        }
        return Response.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const { cookies } = await import("next/headers");
        const { jwtVerify, SignJWT } = await import("jose");
        
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session')?.value;
        if (!sessionToken) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secretKey = new TextEncoder().encode(
            process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
        );
        const { payload } = await jwtVerify(sessionToken, secretKey);
        if (!payload || !payload.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, phone } = await request.json();

        if (!name || !phone) {
            return Response.json({ error: "Name and phone number are required" }, { status: 400 });
        }

        const phoneRegex = /^(09|07)\d{8}$|^251(9|7)\d{8}$/;
        if (!phoneRegex.test(phone)) {
            return Response.json(
                { error: "Invalid Telebirr phone number. Must start with 09 or 07 and be 10 digits (e.g., 0912345678)." },
                { status: 400 }
            );
        }

        const pool = await getDbConnection();
        await pool.query(
            "UPDATE users SET name = ?, phone = ? WHERE id = ?",
            [name, phone, payload.id]
        );

        // Re-issue JWT with new info
        const newToken = await new SignJWT({
            id: payload.id,
            name: name,
            email: payload.email,
            role: payload.role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secretKey);

        cookieStore.set('session', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return Response.json({
            message: "Profile updated successfully!",
            user: { id: payload.id, name, email: payload.email, phone, role: payload.role }
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        return Response.json({ error: "Failed to update profile" }, { status: 500 });
    }
}