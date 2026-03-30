"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getDailyQuote } from "@/lib/quotes";
import { useState, useEffect } from "react";
import type { Quote } from "@/types";
import { QUOTES } from "@/lib/quotes";
import { getXP, setStorageUser } from "@/lib/storage";
import { useSession, signIn, signOut } from "next-auth/react";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡", desc: "Overview & progres" },
  { href: "/harian", label: "Harian", icon: "☀", desc: "Tugas & prioritas hari ini" },
  { href: "/mingguan", label: "Mingguan", icon: "◈", desc: "Rencana minggu ini" },
  { href: "/bulanan", label: "Bulanan", icon: "◷", desc: "Target bulan ini" },
  { href: "/tahunan", label: "Tahunan", icon: "◎", desc: "Goals besar tahun ini" },
  { href: "/habit", label: "Habit Tracker", icon: "◉", desc: "Lacak kebiasaanmu" },
];

// Reusable SVG icons with proper styling
const icons: Record<string, React.ReactNode> = {
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  harian: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
  mingguan: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  bulanan: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  tahunan: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  habit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
};

const navIconMap: Record<string, React.ReactNode> = {
  "/dashboard": icons.dashboard,
  "/harian": icons.harian,
  "/mingguan": icons.mingguan,
  "/bulanan": icons.bulanan,
  "/tahunan": icons.tahunan,
  "/habit": icons.habit,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [quote, setQuote] = useState<Quote>(getDailyQuote());
  const [xp, setXp] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const refreshQuote = () => {
    const newIdx = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[newIdx]);
  };

  useEffect(() => {
    setMounted(true);
    const userId = (session?.user as any)?.id;
    setStorageUser(userId ?? "guest");
    setQuote(getDailyQuote());
    setXp(getXP());

    const handleXPChange = () => setXp(getXP());
    window.addEventListener("xp-changed", handleXPChange);
    return () => window.removeEventListener("xp-changed", handleXPChange);
  }, [session]);

  useEffect(() => {
    setXp(getXP());
  }, [(session?.user as any)?.id]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const LEVEL_UP_XP = 100;
  const currentLevel = Math.floor(xp / LEVEL_UP_XP) + 1;
  const xpInCurrentLevel = xp % LEVEL_UP_XP;
  const progressPct = (xpInCurrentLevel / LEVEL_UP_XP) * 100;

  const isLoaded = status !== "loading";
  const user = session?.user;

  const exportData = () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) data[key] = localStorage.getItem(key) || "";
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rivanzee-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm("Peringatan: Impor data akan menimpa data yang ada saat ini. Lanjutkan?")) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        for (const key in data) {
          localStorage.setItem(key, data[key]);
        }
        alert("Data berhasil diimpor! Halaman akan dimuat ulang.");
        window.location.reload();
      } catch (err) {
        alert("Format file invalid atau bukan file backup.");
      }
    };
    reader.readAsText(file);
  };



  const sidebarContent = (
    <>
      {/* ── Logo ── */}
      <div style={{ padding: "8px 16px 16px", borderBottom: `1px solid var(--theme-sidebar-border)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, #059669, #0D9488)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, flexShrink: 0,
            boxShadow: "0 2px 10px rgba(52,211,153,0.25)",
          }}>
            📋
          </div>
          <div>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 17, color: "var(--theme-ink)", lineHeight: 1.2 }}>Rivanzee</div>
            <div style={{ fontSize: 10, color: "var(--theme-muted)", fontWeight: 500, letterSpacing: "0.02em" }}>Personal Planner</div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="sidebar-close-btn"
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--theme-muted)", lineHeight: 1, display: "none" }}
          >
            ✕
          </button>
        </div>

        {/* User Profile */}
        {isLoaded && (
          user ? (
            <div style={{
              background: "var(--theme-surface-2)",
              borderRadius: 12,
              padding: "10px 12px",
              border: `1px solid var(--theme-border)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Foto"}
                    width={32} height={32}
                    style={{ borderRadius: "50%", border: "2px solid rgba(22,163,74,0.25)", flexShrink: 0 }}
                  />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--theme-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {user.name?.[0] ?? "R"}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--theme-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                  <div style={{ fontSize: 10, color: "var(--theme-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 1 }}>{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                style={{ width: "100%", background: "transparent", border: `1px solid var(--theme-border)`, borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "var(--theme-muted)", transition: "all 0.15s", fontFamily: "inherit" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--theme-coral)"; e.currentTarget.style.color = "var(--theme-coral)"; e.currentTarget.style.background = "rgba(220,76,52,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--theme-border)"; e.currentTarget.style.color = "var(--theme-muted)"; e.currentTarget.style.background = "transparent"; }}
              >
                Keluar
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 14px", background: "var(--theme-surface)", border: `1px solid var(--theme-border)`, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--theme-ink)", transition: "all 0.15s", boxShadow: "var(--theme-card-shadow)", fontFamily: "inherit" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--theme-accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--theme-border)"; e.currentTarget.style.boxShadow = "var(--theme-card-shadow)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Masuk dengan Google
            </button>
          )
        )}

        {/* XP Bar */}
        <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--theme-surface-2)", borderRadius: 10, border: `1px solid var(--theme-border)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 13 }}>⭐</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--theme-accent)" }}>Lv.{currentLevel}</span>
              <span style={{ fontSize: 11, color: "var(--theme-muted)", fontWeight: 500 }}>Explorer</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--theme-muted)" }}>{xpInCurrentLevel}/{LEVEL_UP_XP} XP</span>
          </div>
          <div style={{ height: 5, background: "var(--theme-border)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, #22C55E, #16A34A)", borderRadius: 999, transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        <div className="section-label" style={{ padding: "0 6px 8px" }}>Menu</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 9,
                marginBottom: 1,
                textDecoration: "none",
                background: isActive ? "rgba(22,163,74,0.08)" : "transparent",
                color: isActive ? "var(--theme-accent)" : "var(--theme-ink-2)",
                transition: "all 0.15s ease",
                fontWeight: isActive ? 600 : 400,
                fontSize: 13.5,
                position: "relative" as const,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--theme-surface-2)";
                  e.currentTarget.style.color = "var(--theme-ink)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--theme-ink-2)";
                }
              }}
            >
              <span style={{
                width: 30, height: 30,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isActive ? "rgba(22,163,74,0.12)" : "var(--theme-surface-2)",
                borderRadius: 8,
                flexShrink: 0,
                color: isActive ? "var(--theme-accent)" : "var(--theme-muted)",
                transition: "all 0.15s",
              }}>
                {navIconMap[item.href]}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div>{item.label}</div>
                <div style={{ fontSize: 11, color: isActive ? "var(--theme-accent)" : "var(--theme-muted)", marginTop: 1, opacity: 0.7 }}>{item.desc}</div>
              </div>
              {isActive && (
                <div style={{ width: 3, height: 20, background: "var(--theme-accent)", borderRadius: 999, flexShrink: 0 }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Quote ── */}
      <div style={{ margin: "0 10px", padding: "12px 14px", background: "var(--theme-surface-2)", border: `1px solid var(--theme-border)`, borderRadius: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--theme-accent)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Quote</span>
          <button
            onClick={refreshQuote}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, padding: "2px 4px", color: "var(--theme-muted)", lineHeight: 1, borderRadius: 4 }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--theme-surface)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            ↺
          </button>
        </div>
        <p style={{ fontSize: 11.5, color: "var(--theme-ink)", fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>&ldquo;{quote.text}&rdquo;</p>
        <p style={{ fontSize: 10.5, color: "var(--theme-muted)", margin: "5px 0 0", fontWeight: 500 }}>— {quote.author}</p>
      </div>

      {/* ── Backup Data ── */}
      <div style={{ margin: "12px 10px 0", display: "flex", gap: 6 }}>
        <button onClick={exportData} style={{ flex: 1, padding: "7px 0", background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 600, color: "var(--theme-ink-2)", transition: "all 0.15s", fontFamily: "inherit" }} onMouseEnter={e => e.currentTarget.style.color = "var(--theme-accent)"} onMouseLeave={e => e.currentTarget.style.color = "var(--theme-ink-2)"} title="Unduh data Planner">
          ↓ Export Data
        </button>
        <label style={{ flex: 1, padding: "7px 0", background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 600, color: "var(--theme-ink-2)", transition: "all 0.15s", textAlign: "center", fontFamily: "inherit", display: "inline-block" }} onMouseEnter={e => e.currentTarget.style.color = "var(--theme-blue)"} onMouseLeave={e => e.currentTarget.style.color = "var(--theme-ink-2)"} title="Kembalikan data dari backup">
          ↑ Import Data
          <input type="file" accept=".json" style={{ display: "none" }} onChange={importData} />
        </label>
      </div>

      {/* ── Bottom: Date display ── */}
      <div style={{ padding: "12px 10px 18px", marginTop: 8 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 12px",
          background: "var(--theme-surface-2)",
          border: "1px solid var(--theme-border)",
          borderRadius: 10,
          justifyContent: "center",
        }}>
          <span style={{ fontSize: 13 }}>📅</span>
          <span style={{ fontSize: 11, color: "var(--theme-ink-2)", fontWeight: 500 }}>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" })}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Topbar */}
      <div className="mobile-topbar" style={{
        display: "none",
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: 56,
        background: "rgba(var(--theme-sidebar), 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid var(--theme-sidebar-border)`,
        zIndex: 200,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #16A34A, #15803D)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>📋</div>
          <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: 16, color: "var(--theme-ink)" }}>Rivanzee</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          style={{ background: "var(--theme-surface-2)", border: `1px solid var(--theme-border)`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16, color: "var(--theme-ink-2)" }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, backdropFilter: "blur(4px)" }}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{
        width: 252,
        minHeight: "100vh",
        background: "var(--theme-sidebar)",
        borderRight: `1px solid var(--theme-sidebar-border)`,
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        flexShrink: 0,
        height: "100vh",
        overflowY: "auto",
      }}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <aside style={{
        position: "fixed",
        top: 0,
        left: mobileOpen ? 0 : "-280px",
        width: 268,
        height: "100vh",
        background: "var(--theme-sidebar)",
        borderRight: `1px solid var(--theme-sidebar-border)`,
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        overflowY: "auto",
        zIndex: 400,
        transition: "left 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: mobileOpen ? "8px 0 32px rgba(0,0,0,0.15)" : "none",
      }}>
        {sidebarContent}
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .mobile-topbar { display: flex !important; }
          .desktop-sidebar { display: none !important; }
          .sidebar-close-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
