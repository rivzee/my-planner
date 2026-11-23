"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import Logo from "@/components/Logo";

const GoogleIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  // Default to "Tahunan" exactly as requested in user showcase screenshot
  const [activePreview, setActivePreview] = useState<"Harian" | "Mingguan" | "Bulanan" | "Tahunan" | "Habit">("Tahunan");
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Fail-safe: if session loading takes more than 2s, show landing page anyway
  useEffect(() => {
    if (status === "loading") {
      const t = setTimeout(() => setLoadingTimeout(true), 2000);
      return () => clearTimeout(t);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  const isLoading = !mounted || (status === "loading" && !loadingTimeout) || status === "authenticated";

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090B" }}>
        <div style={{ textAlign: "center" }}>
          <Logo size={56} style={{ margin: "0 auto 16px" }} />
          <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#F4F4F5" }}>MyPlanner</div>
          <div style={{ fontSize: 11, color: "#71717A", marginTop: 8, letterSpacing: "0.12em", fontWeight: 600 }}>MEMUAT SISTEM...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090B",
      fontFamily: '"Inter", sans-serif',
      color: "#F4F4F5",
      overflowX: "hidden",
      position: "relative",
    }}>

      {/* ── Architectural Grid Background (Clean & Anti-Slop) ── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 50% at 50% 15%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 15%, #000 60%, transparent 100%)",
        }}
      />

      {/* ── SECTION 1: PRIMARY LIVE MOCKUP HERO (Directly matches user showcase) ── */}
      <section style={{
        padding: "24px 24px 64px",
        maxWidth: 1040,
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
        boxSizing: "border-box",
      }}>

        {/* Top In-Flow Brand & Access Bar (Clean, no fixed header clutter) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingBottom: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo size={34} interactive={true} />
            <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: 20, color: "#F4F4F5", letterSpacing: "-0.5px" }}>
              MyPlanner
            </span>
          </div>

          <button
            onClick={() => signIn("google")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              background: "#10B981",
              color: "#052e16",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "transform 150ms ease-out, background 150ms ease-out, box-shadow 150ms ease-out",
              boxShadow: "0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#34D399";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#10B981";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          >
            <GoogleIcon size={15} />
            Buka Ruang Kerja — Akses Google
          </button>
        </div>

        {/* Section Heading (Matches screenshot) */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            fontSize: 11,
            color: "#10B981",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}>
            LINGKUNGAN KERJA NYATA
          </div>
          <h1 style={{
            fontFamily: '"DM Serif Display", serif',
            fontSize: "clamp(32px, 4.2vw, 48px)",
            fontWeight: 400,
            color: "#F4F4F5",
            margin: "0 0 10px",
            letterSpacing: "-0.5px",
          }}>
            Antarmuka Tanpa Hambatan
          </h1>
          <p style={{
            fontSize: 14,
            color: "#A1A1AA",
            margin: "0 auto",
            maxWidth: 520,
            lineHeight: 1.6,
          }}>
            Satu lingkungan kerja terstruktur untuk tiga skala waktu: harian, mingguan, dan kuartal.
          </p>
        </div>

        {/* Specular Hairline Monolith Mockup Frame */}
        <div style={{
          background: "#111116",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          borderRadius: 20,
          overflow: "hidden",
        }}>

          {/* Window Title Bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 18px",
            background: "#0C0C0F",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27272A" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27272A" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27272A" }} />
              <span style={{ fontSize: 11, color: "#71717A", marginLeft: 8, fontFamily: 'monospace' }}>app.myplanner.internal</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              <span style={{ fontSize: 11, color: "#71717A", fontWeight: 500 }}>Live Environment</span>
            </div>
          </div>

          {/* Application Mock Body */}
          <div style={{
            padding: "24px",
            display: "flex",
            gap: 20,
            alignItems: "stretch",
            minHeight: 400,
          }}>

            {/* Sidebar Preview */}
            <div style={{
              width: 190,
              background: "#0C0C0F",
              borderRadius: 12,
              padding: "14px 10px",
              flexShrink: 0,
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, padding: "0 4px" }}>
                  <Logo size={24} />
                  <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: 15, color: "#F4F4F5" }}>MyPlanner</span>
                </div>

                {[
                  { id: "Harian",   SvgIcon: Icons.Sun,      label: "Harian" },
                  { id: "Mingguan", SvgIcon: Icons.Calendar,  label: "Mingguan" },
                  { id: "Bulanan",  SvgIcon: Icons.Calendar,  label: "Bulanan" },
                  { id: "Tahunan",  SvgIcon: Icons.Target,    label: "Tahunan" },
                  { id: "Habit",    SvgIcon: Icons.Repeat,    label: "Habit" },
                ].map((item) => {
                  const isActive = activePreview === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActivePreview(item.id as typeof activePreview)}
                      style={{
                        background: isActive ? "rgba(16, 185, 129, 0.12)" : "transparent",
                        border: `1px solid ${isActive ? "rgba(16, 185, 129, 0.3)" : "transparent"}`,
                        borderRadius: 8,
                        padding: "7px 10px",
                        marginBottom: 3,
                        cursor: "pointer",
                        transition: "all 150ms ease-out",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      <item.SvgIcon size={13} style={{ color: isActive ? "#10B981" : "#71717A" }} />
                      <span style={{ fontSize: 12, color: isActive ? "#10B981" : "#A1A1AA", fontWeight: isActive ? 600 : 400 }}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: 8,
                padding: "8px 10px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 10, color: "#71717A", fontWeight: 500 }}>Command Menu</span>
                <kbd style={{ fontSize: 9, padding: "2px 5px", borderRadius: 4, background: "rgba(255, 255, 255, 0.08)", color: "#D4D4D8", fontFamily: "monospace" }}>⌘K</kbd>
              </div>
            </div>

            {/* Main Content Preview Area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>TAMPILAN AKTIF</div>
                  <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#F4F4F5", marginTop: 2 }}>
                    {activePreview === "Harian"   && "Ruang Kerja Harian"}
                    {activePreview === "Mingguan" && "Peta Sprint Mingguan"}
                    {activePreview === "Bulanan"  && "Kalender & Evaluasi Bulanan"}
                    {activePreview === "Tahunan"  && "Sasaran Strategis Tahunan"}
                    {activePreview === "Habit"    && "Pelacak Konsistensi Habit"}
                  </div>
                </div>
                <span style={{
                  fontSize: 12,
                  color: "#10B981",
                  fontWeight: 500,
                  background: "rgba(16, 185, 129, 0.1)",
                  padding: "3px 8px",
                  borderRadius: 6,
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}>
                  {activePreview}
                </span>
              </div>

              {/* Dynamic Content Panel */}
              <div style={{ flex: 1 }}>
                
                {/* TAHUNAN VIEW (Exact match to user showcase) */}
                {activePreview === "Tahunan" && (
                  <div style={{ display: "flex", gap: 14 }}>
                    <div style={{ flex: 1, background: "#0C0C0F", borderRadius: 10, padding: "18px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: 11, color: "#A855F7", marginBottom: 6, fontWeight: 600 }}>Pilar Profesional</div>
                      <div style={{ fontSize: 13, color: "#F4F4F5", fontWeight: 600, marginBottom: 10 }}>Sertifikasi Cloud Architecture</div>
                      <div style={{ fontSize: 11, color: "#71717A", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                        <span>Progres Target</span>
                        <span style={{ fontFamily: "monospace", color: "#A855F7", fontWeight: 600 }}>80%</span>
                      </div>
                      <div style={{ width: "100%", height: 4, background: "rgba(255, 255, 255, 0.08)", borderRadius: 2 }}>
                        <div style={{ width: "80%", height: "100%", background: "#A855F7", borderRadius: 2 }} />
                      </div>
                    </div>
                    <div style={{ flex: 1, background: "#0C0C0F", borderRadius: 10, padding: "18px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: 11, color: "#10B981", marginBottom: 6, fontWeight: 600 }}>Pilar Fisik</div>
                      <div style={{ fontSize: 13, color: "#F4F4F5", fontWeight: 600, marginBottom: 10 }}>Konsistensi Lari 150km / Kuartal</div>
                      <div style={{ fontSize: 11, color: "#71717A", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                        <span>Tercapai 90km</span>
                        <span style={{ fontFamily: "monospace", color: "#10B981", fontWeight: 600 }}>60%</span>
                      </div>
                      <div style={{ width: "100%", height: 4, background: "rgba(255, 255, 255, 0.08)", borderRadius: 2 }}>
                        <div style={{ width: "60%", height: "100%", background: "#10B981", borderRadius: 2 }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* HARIAN VIEW */}
                {activePreview === "Harian" && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                      {[
                        { label: "Tugas Tersisa", val: "3", unit: "item", color: "#F59E0B" },
                        { label: "Habit Selesai", val: "4 / 5", unit: "target", color: "#10B981" },
                        { label: "Efisiensi Fokus", val: "92%", unit: "skor", color: "#60A5FA" },
                      ].map(stat => (
                        <div key={stat.label} style={{ background: "#0C0C0F", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.val}<span style={{ fontSize: 10, color: "#71717A", fontWeight: 400 }}> {stat.unit}</span></div>
                          <div style={{ fontSize: 11, color: "#71717A", marginTop: 2 }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "#0C0C0F", borderRadius: 10, padding: "14px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#F4F4F5", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>Prioritas Hari Ini</span>
                        <span style={{ fontSize: 11, color: "#71717A" }}>4 Tugas Terjadwal</span>
                      </div>
                      {[
                        { text: "Rilis arsitektur v2.5 ke production", priority: "P1", done: true },
                        { text: "Evaluasi task AI recommendations dari Gemini", priority: "P1", done: true },
                        { text: "Tinjau backlog sprint mingguan", priority: "P2", done: false },
                        { text: "Sesi deep work 45 menit fokus penulisan", priority: "P3", done: false },
                      ].map((t, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? "1px solid rgba(255, 255, 255, 0.04)" : "none" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 16, height: 16, borderRadius: 4,
                              border: `1.5px solid ${t.done ? "#10B981" : "rgba(255, 255, 255, 0.2)"}`,
                              background: t.done ? "#10B981" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 9, color: "#052e16", fontWeight: 700, flexShrink: 0,
                            }}>
                              {t.done && "✓"}
                            </div>
                            <span style={{ fontSize: 12, color: t.done ? "#71717A" : "#F4F4F5", textDecoration: t.done ? "line-through" : "none" }}>
                              {t.text}
                            </span>
                          </div>
                          <span style={{
                            fontSize: 10, fontFamily: "monospace", padding: "2px 6px", borderRadius: 4,
                            background: t.priority === "P1" ? "rgba(244, 63, 94, 0.15)" : "rgba(255, 255, 255, 0.06)",
                            color: t.priority === "P1" ? "#FB7185" : "#A1A1AA",
                          }}>
                            {t.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MINGGUAN VIEW */}
                {activePreview === "Mingguan" && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                      <div style={{ background: "#0C0C0F", borderRadius: 10, padding: "14px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600, marginBottom: 6 }}>Hari Ini — Selasa</div>
                        <div style={{ fontSize: 12, color: "#F4F4F5", marginBottom: 6 }}>• Deployment Engine v2.5</div>
                        <div style={{ fontSize: 12, color: "#F4F4F5" }}>• Audit Quality Gate Anti-Slop</div>
                      </div>
                      <div style={{ background: "#0C0C0F", borderRadius: 10, padding: "14px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <div style={{ fontSize: 11, color: "#71717A", fontWeight: 600, marginBottom: 6 }}>Besok — Rabu</div>
                        <div style={{ fontSize: 12, color: "#A1A1AA", marginBottom: 6 }}>• Evaluasi Metrik Kuartal 2</div>
                        <div style={{ fontSize: 12, color: "#A1A1AA" }}>• Sprint Retro Bersama Tim</div>
                      </div>
                    </div>
                    <div style={{ background: "rgba(255, 255, 255, 0.02)", borderRadius: 10, padding: "14px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600, color: "#10B981", marginBottom: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                        Sintesis Ritme Mingguan
                      </div>
                      <div style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.6 }}>
                        Rabu terisi pertemuan koordinasi. Alokasikan waktu fokus mendalam hari ini untuk menyelesaikan pekerjaan berbobot sebelum jadwal tim dimulai.
                      </div>
                    </div>
                  </div>
                )}

                {/* BULANAN VIEW */}
                {activePreview === "Bulanan" && (
                  <div style={{ background: "#0C0C0F", borderRadius: 10, padding: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#F4F4F5" }}>April 2026</span>
                      <span style={{ fontSize: 11, color: "#10B981", background: "rgba(16, 185, 129, 0.12)", fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>
                        4 Target Tercapai
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center", fontSize: 10, color: "#71717A", marginBottom: 8, fontWeight: 600 }}>
                      {['S','S','R','K','J','S','M'].map((d, i) => <div key={i}>{d}</div>)}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center", fontSize: 12 }}>
                      {Array.from({ length: 14 }).map((_, i) => {
                        const isToday = i === 12;
                        const hasEvent = i === 9 || i === 4;
                        return (
                          <div key={i} style={{ 
                            padding: "8px 0", position: "relative",
                            background: isToday ? "rgba(16, 185, 129, 0.15)" : (hasEvent ? "#18181D" : "transparent"),
                            border: isToday ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid transparent",
                            color: isToday ? "#10B981" : (i > 4 ? "#F4F4F5" : "#3F3F46"),
                            borderRadius: 6, fontWeight: isToday ? 700 : 400,
                            fontFamily: "monospace",
                          }}>
                            {i > 4 ? i - 4 : 26 + i}
                            {hasEvent && <div style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: 2, background: "#60A5FA" }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* HABIT VIEW */}
                {activePreview === "Habit" && (
                  <div style={{ background: "#0C0C0F", borderRadius: 10, padding: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    {[
                      { title: "Membaca Riset Teknis 20 Menit", streak: 14, arr: [1,1,1,1,1,1,1] },
                      { title: "Sesi Deep Work Pagi (90m)", streak: 6, arr: [1,1,1,1,1,1,0] },
                      { title: "Latihan Peregangan & Olahraga", streak: 4, arr: [0,1,1,1,1,0,0] },
                    ].map((h, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, marginBottom: 10, borderBottom: i < 2 ? "1px solid rgba(255, 255, 255, 0.04)" : "none" }}>
                        <div>
                          <div style={{ fontSize: 13, color: "#F4F4F5", fontWeight: 500 }}>{h.title}</div>
                          <div style={{ fontSize: 11, color: "#71717A", marginTop: 2, fontFamily: "monospace" }}>
                            {h.streak} hari berturut-turut
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {h.arr.map((done, k) => (
                            <div key={k} style={{
                              width: 14, height: 14, borderRadius: 3,
                              background: done ? "#10B981" : "rgba(255, 255, 255, 0.06)",
                              border: done ? "1px solid #10B981" : "1px solid rgba(255, 255, 255, 0.05)",
                            }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

        {/* System Specs (Pita spesifikasi hardware di bawah preview) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          padding: "16px 20px",
          background: "#111116",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          borderRadius: 14,
          marginTop: 20,
        }}>
          {[
            { metric: "< 50ms", label: "Latensi Lokal", sub: "IndexedDB instant cache" },
            { metric: "3 Skala", label: "Dimensi Waktu", sub: "Hari • Minggu • Kuartal" },
            { metric: "Gemini 2.5", label: "Sintesis AI", sub: "Penilaian beban kognitif" },
            { metric: "Offline", label: "Arsitektur PWA", sub: "Sinkronisasi otomatis" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "left", padding: "2px 6px" }}>
              <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: 16, fontWeight: 700, color: "#10B981" }}>
                {s.metric}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#F4F4F5", marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "#71717A", marginTop: 1 }}>{s.sub}</div>
            </div>
          ))}
        </div>

      </section>

      {/* ── SECTION 2: ARSITEKTUR BENTO GRID ── */}
      <section id="arsitektur" style={{ padding: "48px 24px 96px", maxWidth: 1040, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ fontSize: 11, color: "#10B981", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
            ARSITEKTUR KERJA
          </div>
          <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: "clamp(28px, 3.8vw, 42px)", fontWeight: 400, color: "#F4F4F5", margin: "0 0 12px", letterSpacing: "-0.5px" }}>
            Dirancang untuk Kecepatan & Kontrol Nyata
          </h2>
          <p style={{ fontSize: 14, color: "#71717A", margin: 0, maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Setiap modul dioptimalkan untuk memelihara fokus eksekutif Anda tanpa distraksi.
          </p>
        </div>

        {/* Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>

          {/* Bento Card 1: Daily Execution Deck (7 cols) */}
          <div style={{
            gridColumn: "span 7",
            background: "#111116",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            borderRadius: 18, padding: "26px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            transition: "transform 180ms ease-out, border-color 180ms ease-out",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"; }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: "#10B981", fontFamily: "monospace", fontWeight: 600 }}>01 / HARIAN</span>
                <span style={{ fontSize: 11, color: "#71717A", background: "rgba(255, 255, 255, 0.04)", padding: "2px 8px", borderRadius: 4 }}>Tactile Feedback</span>
              </div>
              <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#F4F4F5", margin: "0 0 8px" }}>
                Mesin Eksekusi Harian
              </h3>
              <p style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.6, margin: "0 0 18px" }}>
                Sistem time-blocking berdensitas tinggi dengan penanda prioritas tegas (P1/P2) dan pintasan keyboard instan.
              </p>
            </div>

            <div style={{ background: "#0C0C0F", borderRadius: 12, padding: "14px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 11 }}>
                <span style={{ color: "#D4D4D8", fontWeight: 500 }}>Fokus Utama Sesi Ini</span>
                <span style={{ fontFamily: "monospace", color: "#10B981" }}>75% Tuntas</span>
              </div>
              <div style={{ width: "100%", height: 4, background: "rgba(255, 255, 255, 0.08)", borderRadius: 2, marginBottom: 12 }}>
                <div style={{ width: "75%", height: "100%", background: "#10B981", borderRadius: 2 }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 10, background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>P1 Kritis</span>
                <span style={{ fontSize: 10, background: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>P2 Terjadwal</span>
                <span style={{ fontSize: 10, color: "#71717A", marginLeft: "auto", fontFamily: "monospace" }}>⌘K Quick Command</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: 7-Day Consistency Matrix (5 cols) */}
          <div style={{
            gridColumn: "span 5",
            background: "#111116",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            borderRadius: 18, padding: "26px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            transition: "transform 180ms ease-out, border-color 180ms ease-out",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"; }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: "#10B981", fontFamily: "monospace", fontWeight: 600 }}>02 / HABIT</span>
                <span style={{ fontSize: 11, color: "#71717A", background: "rgba(255, 255, 255, 0.04)", padding: "2px 8px", borderRadius: 4 }}>Streak 14 Hari</span>
              </div>
              <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#F4F4F5", margin: "0 0 8px" }}>
                Matriks Konsistensi
              </h3>
              <p style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.6, margin: "0 0 18px" }}>
                Pelacak ritme habit berbasis grid dot matrix untuk memvisualisasikan momentum tanpa jeda.
              </p>
            </div>

            <div style={{ background: "#0C0C0F", borderRadius: 12, padding: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#F4F4F5", fontWeight: 500 }}>Deep Work 90m</span>
                <span style={{ fontSize: 11, color: "#10B981", fontFamily: "monospace", fontWeight: 600 }}>100%</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                {[1, 1, 1, 1, 1, 1, 1].map((v, idx) => (
                  <div key={idx} style={{ height: 18, borderRadius: 4, background: "#10B981" }} />
                ))}
              </div>
            </div>
          </div>

          {/* Bento Card 3: Multi-Scale Synchronization (5 cols) */}
          <div style={{
            gridColumn: "span 5",
            background: "#111116",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            borderRadius: 18, padding: "26px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            transition: "transform 180ms ease-out, border-color 180ms ease-out",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"; }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: "#10B981", fontFamily: "monospace", fontWeight: 600 }}>03 / SKALA</span>
                <span style={{ fontSize: 11, color: "#71717A", background: "rgba(255, 255, 255, 0.04)", padding: "2px 8px", borderRadius: 4 }}>Makro ke Mikro</span>
              </div>
              <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#F4F4F5", margin: "0 0 8px" }}>
                Sinkronisasi 3 Skala
              </h3>
              <p style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.6, margin: "0 0 18px" }}>
                Dari target kuartal, dipecah menjadi sprint mingguan, hingga menjadi agenda harian yang jelas.
              </p>
            </div>

            <div style={{ background: "#0C0C0F", borderRadius: 12, padding: "14px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#D4D4D8", marginBottom: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A855F7" }} />
                <span>Kuartal: Rilis Produk Utama</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#A1A1AA", paddingLeft: 14, marginBottom: 6 }}>
                <span>↳ Minggu: Integrasi Database & API</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#10B981", paddingLeft: 28 }}>
                <span>↳ Hari Ini: Selesaikan Unit Test</span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Gemini Cognitive Synthesizer (7 cols) */}
          <div style={{
            gridColumn: "span 7",
            background: "#111116",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            borderRadius: 18, padding: "26px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            transition: "transform 180ms ease-out, border-color 180ms ease-out",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"; }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: "#10B981", fontFamily: "monospace", fontWeight: 600 }}>04 / KECERDASAN</span>
                <span style={{ fontSize: 11, color: "#10B981", background: "rgba(16, 185, 129, 0.12)", padding: "2px 8px", borderRadius: 4 }}>Gemini 2.5 Engine</span>
              </div>
              <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#F4F4F5", margin: "0 0 8px" }}>
                Sintesis Prioritas Otomatis
              </h3>
              <p style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.6, margin: "0 0 18px" }}>
                Model bahasa mengevaluasi beban kognitif daftar tugas Anda dan menyusun urutan eksekusi yang realistis.
              </p>
            </div>

            <div style={{ background: "#0C0C0F", borderRadius: 12, padding: "14px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#10B981", fontWeight: 600, marginBottom: 6 }}>
                <Icons.Cpu size={14} style={{ color: "#10B981" }} />
                <span>Rekomendasi Gemini Advisor</span>
              </div>
              <div style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.6 }}>
                "Jadwalkan pekerjaan 'Arsitektur Database' di slot pagi jam 09:00 sebelum rapat evaluasi tim, untuk menghindari keletihan keputusan di sore hari."
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 3: CLOSING ACTION (Contained Monolith Card) ── */}
      <section style={{ padding: "48px 24px 96px", position: "relative", zIndex: 1 }}>
        <div style={{
          maxWidth: 720, margin: "0 auto",
          background: "#111116",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          borderRadius: 24,
          padding: "54px 36px",
          textAlign: "center",
        }}>
          <Logo size={64} style={{ margin: "0 auto 24px" }} interactive={true} />
          <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: "#F4F4F5", margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            Kendalikan Hari Anda dengan Presisi
          </h2>
          <p style={{ fontSize: 15, color: "#71717A", lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 480 }}>
            Satu klik untuk mengaktifkan sinkronisasi otomatis di seluruh perangkat web dan mobile Anda.
          </p>

          <button
            onClick={() => signIn("google")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "15px 32px",
              background: "#10B981", color: "#052e16",
              border: "none", borderRadius: 12,
              cursor: "pointer", fontSize: 15, fontWeight: 600,
              transition: "transform 150ms ease-out, background 150ms ease-out",
              boxShadow: "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#34D399";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#10B981";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          >
            <GoogleIcon size={18} />
            Buka Ruang Kerja — Akses Google
          </button>

          <div style={{ marginTop: 20, fontSize: 11, color: "#52525B" }}>
            Local-First Storage • Zero Tracking • Enkripsi Berstandar Industri
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "36px 32px",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14,
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Logo size={24} />
          <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: 16, color: "#F4F4F5" }}>MyPlanner</span>
        </div>

        <div style={{ width: 32, height: 1, background: "rgba(255, 255, 255, 0.08)" }} />

        <div style={{ fontSize: 12, color: "#71717A" }}>
          Dirancang & Dikembangkan oleh <span style={{ fontWeight: 600, color: "#A1A1AA" }}>Rivanzi Hidayatullah</span>
        </div>
        <div style={{ fontSize: 11, color: "#52525B", fontFamily: "monospace" }}>
          © 2026 MyPlanner • Anti-Slop Architecture v2.5
        </div>
      </footer>

    </div>
  );
}
