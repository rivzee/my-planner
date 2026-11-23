"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getDailyQuote } from "@/lib/quotes";
import { useState, useEffect, useRef } from "react";
import type { Quote } from "@/types";
import { QUOTES } from "@/lib/quotes";
import { getXP, setStorageUser } from "@/lib/storage";
import { useSession, signIn, signOut } from "next-auth/react";
import Logo from "./Logo";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡", desc: "Overview & progres" },
  { href: "/harian", label: "Harian", icon: "☀", desc: "Tugas & prioritas hari ini" },
  { href: "/mingguan", label: "Mingguan", icon: "◈", desc: "Rencana minggu ini" },
  { href: "/bulanan", label: "Bulanan", icon: "◷", desc: "Target bulan ini" },
  { href: "/tahunan", label: "Tahunan", icon: "◎", desc: "Goals besar tahun ini" },
  { href: "/habit", label: "Habit Tracker", icon: "◉", desc: "Lacak kebiasaanmu" },
  { href: "/fokus", label: "Focus Timer", icon: "⏱", desc: "Pomodoro & Deep Work" },
  { href: "/analitik", label: "Analitik", icon: "📊", desc: "Statistik produktivitas" },
];

// Reusable SVG icons with proper styling
const icons: Record<string, React.ReactNode> = {
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  harian: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
  mingguan: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  bulanan: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  tahunan: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  habit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  fokus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  analitik: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
};

const navIconMap: Record<string, React.ReactNode> = {
  "/dashboard": icons.dashboard,
  "/harian": icons.harian,
  "/mingguan": icons.mingguan,
  "/bulanan": icons.bulanan,
  "/tahunan": icons.tahunan,
  "/habit": icons.habit,
  "/fokus": icons.fokus,
  "/analitik": icons.analitik,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [quote, setQuote] = useState<Quote>(getDailyQuote());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileMenuOpen]);

  const refreshQuote = () => {
    const newIdx = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[newIdx]);
  };

  useEffect(() => {
    setMounted(true);
    const userId = (session?.user as any)?.id;
    setStorageUser(userId ?? "guest");
    setQuote(getDailyQuote());
  }, [session]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isLoaded = status !== "loading";
  const user = session?.user;

  const sidebarContent = (
    <>
      {/* ── Logo ── */}
      <div style={{ padding: "8px 16px 16px", borderBottom: `1px solid var(--theme-sidebar-border)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Logo size={34} />
          <div>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 17, color: "var(--theme-ink)", lineHeight: 1.2 }}>MyPlanner</div>
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
            <div ref={profileMenuRef} style={{ position: "relative" }}>
              {/* Clickable Profile Card */}
              <div
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  background: profileMenuOpen ? "var(--theme-surface)" : "var(--theme-surface-2)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  border: `1px solid ${profileMenuOpen ? "var(--theme-accent)" : "var(--theme-border)"}`,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  userSelect: "none" as const,
                }}
                onMouseEnter={(e) => { if (!profileMenuOpen) { e.currentTarget.style.borderColor = "rgba(22,163,74,0.3)"; e.currentTarget.style.background = "var(--theme-surface)"; } }}
                onMouseLeave={(e) => { if (!profileMenuOpen) { e.currentTarget.style.borderColor = "var(--theme-border)"; e.currentTarget.style.background = "var(--theme-surface-2)"; } }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
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
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="var(--theme-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ flexShrink: 0, transition: "transform 0.2s", transform: profileMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0, right: 0,
                  background: "var(--theme-surface)",
                  border: "1px solid var(--theme-border)",
                  borderRadius: 10,
                  padding: 4,
                  zIndex: 50,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.03)",
                  animation: "profileDropIn 0.15s ease-out",
                }}>
                  <button
                    onPointerDown={async (e) => { e.stopPropagation(); setProfileMenuOpen(false); signIn("google"); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "transparent", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 500, color: "var(--theme-ink-2)", transition: "all 0.12s", fontFamily: "inherit", textAlign: "left" as const }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--theme-surface-2)"; e.currentTarget.style.color = "var(--theme-ink)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--theme-ink-2)"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                    Tukar Akun
                  </button>
                  <div style={{ height: 1, background: "var(--theme-border)", margin: "2px 8px" }} />
                  <button
                    onPointerDown={(e) => { e.stopPropagation(); setProfileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "transparent", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 500, color: "var(--theme-muted)", transition: "all 0.12s", fontFamily: "inherit", textAlign: "left" as const }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(220,76,52,0.06)"; e.currentTarget.style.color = "var(--theme-coral)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--theme-muted)"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Keluar
                  </button>
                </div>
              )}
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

        {/* Command Menu Trigger (Cmd+K) */}
        <button
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
          }}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "8px 10px",
            background: "var(--theme-surface-2)",
            borderRadius: 8,
            border: "1px solid var(--theme-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            color: "var(--theme-ink-2)",
            transition: "all 0.15s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--theme-border-2)";
            e.currentTarget.style.background = "var(--theme-surface-3)";
            e.currentTarget.style.color = "var(--theme-ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--theme-border)";
            e.currentTarget.style.background = "var(--theme-surface-2)";
            e.currentTarget.style.color = "var(--theme-ink-2)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Cari atau Lompat...</span>
          </div>
          <kbd style={{
            padding: "2px 5px",
            fontSize: 10,
            borderRadius: 4,
            background: "var(--theme-surface)",
            border: "1px solid var(--theme-border)",
            color: "var(--theme-muted)",
            fontWeight: 600,
            lineHeight: 1,
          }}>⌘K</kbd>
        </button>
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
                background: isActive ? "rgba(16,185,129,0.08)" : "transparent",
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
                background: "transparent",
                border: isActive ? "1px solid var(--theme-border)" : "1px solid transparent",
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

      {/* ── Quiet Focus Status / Daily Thought ── */}
      <div style={{ margin: "0 10px", padding: "10px 12px", background: "var(--theme-surface-2)", border: `1px solid var(--theme-border)`, borderRadius: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "var(--theme-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Refleksi Hari Ini</span>
          <button
            onClick={refreshQuote}
            title="Ganti refleksi"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--theme-muted)", padding: "2px" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--theme-ink)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--theme-muted)"}
          >
            ↻
          </button>
        </div>
        <p style={{ fontSize: 11, color: "var(--theme-ink-2)", lineHeight: 1.5, margin: 0 }}>
          &ldquo;{quote.text}&rdquo;
        </p>
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--theme-ink-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
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
          <div style={{ width: 28, height: 28, background: "transparent", border: "1px solid var(--theme-border)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--theme-ink)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: 16, color: "var(--theme-ink)" }}>MyPlanner</span>
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
