"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton({ className, children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className || "px-4 py-2 rounded-full border border-white/10 text-slate-300 font-semibold text-sm hover:bg-slate-800 hover:text-white transition-all transform active:scale-95"}
    >
      {children || "Logout"}
    </button>
  );
}
