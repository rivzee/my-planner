"use client";

import { SessionProvider, useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { setStorageUser } from "../lib/storage";
import Logo from "./Logo";

function AuthLoader({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [isTimeout, setIsTimeout] = useState(false);
  const [isSyncingData, setIsSyncingData] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsTimeout(true), 4000); // Fail-safe fallback max 4.0s
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    
    async function initUser() {
      const userId = (session?.user as any)?.id;
      if (userId) {
        await setStorageUser(userId);
      } else {
        await setStorageUser("guest");
      }
      setIsSyncingData(false);
    }
    initUser();
  }, [session, status]);

  if ((status === "loading" || isSyncingData) && !isTimeout) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0C0C0E" }}>
        <div style={{ textAlign: "center", animation: "wa-fade-in 0.3s ease-out" }}>
          <Logo size={56} style={{ margin: "0 auto 16px" }} />
          <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#F2F2F4" }}>MyPlanner</div>
          <div style={{ fontSize: 12, color: "#5C5C6B", marginTop: 8, letterSpacing: "0.1em" }}>
            {status === "loading" ? "MEMUAT AKUN..." : "SINKRONISASI DATA..."}
          </div>
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

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthLoader>{children}</AuthLoader>
    </SessionProvider>
  );
}
