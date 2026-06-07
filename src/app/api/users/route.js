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
        // Parse the incoming request data
        const { name, email, password, phone } = await request.json();

        // Basic validation
        if (!name || !email || !password || !phone) {
            return Response.json(
                { error: "Name, email, password, and phone number are required" },
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