import { getDbConnection } from "@/src/lib/mysql";
import UsersTableClient from './UsersTableClient';

// Disabling caching for this page so the user list is always fresh
export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  let users = [];
  try {
    const pool = await getDbConnection();
    // Fetch all users from the database, ordered by newest first
    const [rows] = await pool.query('SELECT id, name, email FROM users ORDER BY id DESC');
    users = rows;
  } catch (error) {
    // Prevent Next.js error overlay from crashing on AggregateError without a message
    console.error("Failed to load users:", error?.message || error?.code || String(error));
  }

  return (
    <UsersTableClient initialUsers={users} />
  );
}
