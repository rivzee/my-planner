"use client";

import { SessionProvider, useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { setStorageUser } from "../lib/storage";

function AuthLoader({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsTimeout(true), 3500); // Fail-safe fallback max 3.5s
    return () => clearTimeout(t);
  }, []);

  if (status === "loading" && !isTimeout) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0C0C0E" }}>
        <div style={{ textAlign: "center", animation: "wa-fade-in 0.3s ease-out" }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 16, overflow: "hidden",
            margin: "0 auto 16px", boxShadow: "0 0 24px rgba(52,211,153,0.3)",
          }}><img src="/logos.png" alt="Rivanzee" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#F2F2F4" }}>Rivanzee</div>
          <div style={{ fontSize: 12, color: "#5C5C6B", marginTop: 8, letterSpacing: "0.1em" }}>MEMUAT...</div>
        </div>
        <style>{`
          @keyframes wa-fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // Set the user prefix AFTER loading, BEFORE rendering children
  const userId = (session?.user as any)?.id;
  setStorageUser(userId ?? "guest");

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthLoader>{children}</AuthLoader>
    </SessionProvider>
  );
}
