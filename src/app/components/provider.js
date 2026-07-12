"use client";
import { SessionProvider, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const SessionSync = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetch("/api/auth/sso-sync", { method: "POST" })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          if (data?.synced) {
            // Refresh layout state
            router.refresh();
          }
        })
        .catch((err) => console.error("SSO sync error:", err));
    }
  }, [session, status, router]);

  return null;
};

const Providers = ({ children }) => {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
};

export default Providers;