import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('session');

        return Response.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Logout Error:", error);
        return Response.json(
            { error: "Failed to logout" },
            { status: 500 }
        );
    }
}
