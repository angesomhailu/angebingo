import { getDbConnection } from "@/src/lib/mysql";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
);

export async function PUT(req) {
  try {
    // 1. Authorize Admin role
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    
    const { payload } = await jwtVerify(sessionToken, secretKey);
    if (payload?.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden access" }, { status: 403 });
    }

    // 2. Parse request payload
    const body = await req.json();
    const { id, name, email, role, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const pool = await getDbConnection();

    // Build query dynamically based on provided fields
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (email !== undefined) {
      updates.push("email = ?");
      values.push(email);
    }
    if (role !== undefined) {
      updates.push("role = ?");
      values.push(role);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(Number(id));

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true, message: "User updated successfully!" });
  } catch (error) {
    console.error("Failed to update user:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}
