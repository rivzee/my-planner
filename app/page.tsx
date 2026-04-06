"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";

const GoogleIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const features = [
  { icon: "sun",     title: "Harian",       desc: "Kelola tugas & prioritas setiap hari dengan cerdas",              color: "#A89A7A" },
  { icon: "cal",     title: "Mingguan",      desc: "Rencanakan satu minggu penuh, fleksibel & terstruktur",          color: "#7A8FA8" },
  { icon: "cal",     title: "Bulanan",       desc: "Target bulanan dengan catatan & evaluasi pencapaian",             color: "#7AA89A" },
  { icon: "target",  title: "Tahunan",       desc: "Goals tahunan dengan tracking distribusi fokus hidup",            color: "#8A7AA8" },
  { icon: "repeat",  title: "Habit Tracker", desc: "Lacak kebiasaan harian & bangun konsistensi streak 7 hari",      color: "#A87A8A" },
  { icon: "cpu",     title: "AI Advisor",    desc: "Rekomendasi prioritas dari Gemini AI yang personal",             color: "#7AA880" },
];



export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activePreview, setActivePreview] = useState("Harian");
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Fail-safe: if loading takes more than 2s, show landing page anyway
  useEffect(() => {
    if (status === "loading") {
      const t = setTimeout(() => setLoadingTimeout(true), 2000);
      return () => clearTimeout(t);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  // Only block rendering for authenticated (redirect in progress) or very brief initial mount
  // For "loading", use timeout fallback so page doesn't get stuck forever
  const isLoading = !mounted || (status === "loading" && !loadingTimeout) || status === "authenticated";

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0C0C0E" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 16, margin: "0 auto 16px",
            boxShadow: "0 0 24px rgba(52,211,153,0.3)",
            overflow: "hidden",
          }}>
            <img src="/logos.png" alt="Rivanzee" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#F2F2F4" }}>Rivanzee</div>
          <div style={{ fontSize: 12, color: "#5C5C6B", marginTop: 8, letterSpacing: "0.1em" }}>MEMUAT...</div>
        </div>
      </div>
    );
  }

  const S: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "#0C0C0E",
      fontFamily: '"Inter", sans-serif',
      color: "#F2F2F4",
      overflowX: "hidden",
    },
  };

  return (
    <div style={S.page}>

      {/* ── Animated background blobs ── */}
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "30%", width: 600, height: 600, background: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "40%", right: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(192,132,252,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "80px 32px 72px", textAlign: "center", position: "relative", zIndex: 1 }}>

        {/* App Name/Logo */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 42, height: 42,
            borderRadius: 14,
            boxShadow: "0 4px 20px rgba(52,211,153,0.3)",
            overflow: "hidden", flexShrink: 0,
          }}>
            <img src="/logos.png" alt="Rivanzee" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: 32, color: "#F2F2F4", letterSpacing: "-0.5px" }}>Personal Planner</span>
        </div>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)",
          borderRadius: 20, padding: "6px 14px",
          fontSize: 12, fontWeight: 600, color: "#34D399", marginBottom: 32,
          letterSpacing: "0.04em",
        }}>
          ✦ Didukung Google Gemini AI
        </div>

        <h1 style={{
          fontFamily: '"DM Serif Display", serif',
          fontSize: "clamp(42px, 6vw, 68px)",
          fontWeight: 400, lineHeight: 1.1,
          color: "#F2F2F4",
          margin: "0 0 12px",
          letterSpacing: "-1px",
        }}>
          Rencanakan Hidup<br />
          <span style={{
            background: "linear-gradient(90deg, #34D399, #60A5FA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>yang Lebih Produktif</span>
        </h1>

        <p style={{
          fontSize: "clamp(15px, 2vw, 17px)",
          color: "#9191A0",
          lineHeight: 1.75,
          maxWidth: 580, margin: "20px auto 44px",
        }}>
          Satu platform perencanaan lengkap — harian, mingguan, bulanan & tahunan —
          didukung kecerdasan AI untuk membantumu mencapai tujuan lebih cepat.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => signIn("google")}
            className="animate-pulse-glow"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "16px 32px",
              background: "#34D399", color: "#052e16",
              border: "none", borderRadius: 14,
              cursor: "pointer", fontSize: 16, fontWeight: 700,
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
          >
            <GoogleIcon size={18} />
            Mulai dengan Google — Gratis
          </button>
          <a
            href="#fitur"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "16px 28px",
              background: "rgba(255,255,255,0.03)", color: "#9191A0",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14, cursor: "pointer", fontSize: 15, fontWeight: 600,
              textDecoration: "none", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#F2F2F4"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#9191A0"; }}
          >
            Lihat Fitur ↓
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
          {[
            { num: "5+", label: "Mode Perencanaan", color: "#34D399" },
            { num: "AI", label: "Evaluasi Cerdas", color: "#60A5FA" },
            { num: "100%", label: "Gratis Selamanya", color: "#FBBF24" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 38, color: s.color, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 12, color: "#5C5C6B", marginTop: 6, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ padding: "0 32px 96px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Glow behind preview */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)", width: 700, height: 400,
            background: "radial-gradient(ellipse, rgba(52,211,153,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          {/* Preview card */}
          <div className="animate-float-mockup" style={{
            background: "linear-gradient(135deg, rgba(52,211,153,0.15) 0%, rgba(96,165,250,0.1) 100%)",
            borderRadius: 24, padding: "1.5px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(52,211,153,0.1)",
            position: "relative",
          }}>
            <div style={{
              background: "#111117",
              borderRadius: 23,
              padding: 28,
              display: "flex", gap: 20, alignItems: "flex-start",
            }}>
              {/* Sidebar preview */}
              <div style={{ width: 170, background: "#0C0C0E", borderRadius: 12, padding: "14px 10px", flexShrink: 0, border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14, padding: "0 4px" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, overflow: "hidden", flexShrink: 0 }}>
                    <img src="/logos.png" alt="Rivanzee" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: 14, color: "#F2F2F4" }}>Personal Planner</span>
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
                      onClick={() => setActivePreview(item.id)}
                      style={{
                        background: isActive ? "rgba(52,211,153,0.1)" : "transparent",
                        border: isActive ? "1px solid rgba(52,211,153,0.2)" : "1px solid transparent",
                        borderRadius: 8, padding: "7px 9px", marginBottom: 3,
                        cursor: "pointer", transition: "all 0.2s",
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                      onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                      onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      <item.SvgIcon size={12} style={{ color: isActive ? "#34D399" : "#5C5C6B" }} />
                      <span style={{ fontSize: 11, color: isActive ? "#34D399" : "#5C5C6B", fontWeight: isActive ? 600 : 400 }}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
                <div style={{ marginTop: 12, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#34D399", display: "flex", alignItems: "center", gap: 4 }}>
                      <Icons.Star size={10} style={{ color: "#34D399" }} /> Level 3
                    </span>
                    <span style={{ fontSize: 9, color: "#5C5C6B" }}>72/100 XP</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg,#34D399,#0D9488)", borderRadius: 2 }} />
                  </div>
                </div>
              </div>
              {/* Content preview */}
              <div style={{ flex: 1, minHeight: 280, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 11, color: "#5C5C6B", marginBottom: 4 }}>Pratinjau Halaman</div>
                <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 24, color: "#F2F2F4", marginBottom: 16 }}>
                  {activePreview === "Harian"   && "Selamat Siang!"}
                  {activePreview === "Mingguan" && "Fokus Minggu Ini"}
                  {activePreview === "Bulanan"  && "Overview April 2026"}
                  {activePreview === "Tahunan"  && "Resolusi 2026"}
                  {activePreview === "Habit"    && "Habit Tracker"}
                </div>
                
                {/* Dynamic Content Body */}
                <div style={{ flex: 1 }}>
                  
                  {activePreview === "Harian" && (
                    <div style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                        {[
                          { label: "Tugas Hari Ini", val: "4", unit: "pending", color: "#FBBF24" },
                          { label: "Habit Done", val: "3", unit: "/ 5 habit", color: "#34D399" },
                          { label: "Focus Level", val: "87", unit: "%", color: "#60A5FA" },
                        ].map(stat => (
                          <div key={stat.label} style={{ background: "#0C0C0E", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.val}<span style={{ fontSize: 10, color: "#5C5C6B", fontWeight: 400 }}> {stat.unit}</span></div>
                            <div style={{ fontSize: 10, color: "#5C5C6B", marginTop: 2 }}>{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: "#0C0C0E", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#F2F2F4", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                          <Icons.List size={12} style={{ color: "#9191A0" }} />
                          Tugas Hari Ini
                        </div>
                        {[
                          { text: "Belajar TypeScript 1 jam", done: true },
                          { text: "Meeting project jam 14.00", done: true },
                          { text: "Review pull request", done: false },
                          { text: "Olahraga 30 menit", done: false },
                        ].map((t, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                            <div style={{ width: 15, height: 15, borderRadius: 4, border: `1.5px solid ${t.done ? "#34D399" : "rgba(255,255,255,0.15)"}`, background: t.done ? "#34D399" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#052e16", flexShrink: 0 }}>
                              {t.done && "✓"}
                            </div>
                            <span style={{ fontSize: 11, color: t.done ? "#5C5C6B" : "#F2F2F4", textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activePreview === "Mingguan" && (
                    <div style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                        <div style={{ background: "#0C0C0E", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                           <div style={{ fontSize: 11, color: "#34D399", fontWeight: 600, marginBottom: 6 }}>Hari Ini</div>
                           <div style={{ fontSize: 12, color: "#F2F2F4", marginBottom: 4 }}>• Frontend Review</div>
                           <div style={{ fontSize: 12, color: "#F2F2F4" }}>• Deploy to Vercel</div>
                        </div>
                        <div style={{ background: "#0C0C0E", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                           <div style={{ fontSize: 11, color: "#5C5C6B", marginBottom: 6 }}>Rabu, 01 April</div>
                           <div style={{ fontSize: 12, color: "#9191A0", marginBottom: 4 }}>• Planning Sprint 2</div>
                           <div style={{ fontSize: 12, color: "#9191A0" }}>• Evaluasi Q1</div>
                        </div>
                      </div>
                      <div style={{ background: "rgba(16,36,44,0.3)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(96,165,250,0.1)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#60A5FA", marginBottom: 6 }}>✦ Rekomendasi AI</div>
                        <div style={{ fontSize: 11, color: "#9191A0", lineHeight: 1.6 }}>Hari rabu terlihat padat dengan meeting panjang. Saran AI: Selesaikan sisa task hari ini agar besok Anda lebih rileks saat masuk meeting evaluasi.</div>
                      </div>
                    </div>
                  )}

                  {activePreview === "Bulanan" && (
                    <div style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
                      <div style={{ background: "#0C0C0E", borderRadius: 10, padding: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#F2F2F4" }}>April 2026</span>
                          <span style={{ fontSize: 11, color: "#0C0C0E", background: "#FBBF24", fontWeight: 700, padding: "4px 10px", borderRadius: 10 }}>2 Events</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center", fontSize: 10, color: "#5C5C6B", marginBottom: 8, fontWeight: 600 }}>
                          {['S','S','R','K','J','S','M'].map((d, i) => <div key={i}>{d}</div>)}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center", fontSize: 12, color: "#9191A0" }}>
                          {Array.from({ length: 14 }).map((_, i) => {
                            const isToday = i === 12;
                            const hasEvent = i === 10 || i === 4;
                            return (
                              <div key={i} style={{ 
                                padding: "8px 0", position: "relative",
                                background: isToday ? "rgba(52,211,153,0.15)" : (hasEvent ? "#1A1A20" : "transparent"),
                                border: isToday ? "1px solid rgba(52,211,153,0.3)" : "1px solid transparent",
                                color: isToday ? "#34D399" : (i > 4 ? "#F2F2F4" : "#38383F"),
                                borderRadius: 8, fontWeight: isToday ? 700 : 400
                              }}>
                                {i > 4 ? i - 4 : 26 + i}
                                {hasEvent && <div style={{position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: 2, background: "#60A5FA"}}/>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activePreview === "Tahunan" && (
                     <div style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
                       <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                         <div style={{ flex: 1, background: "#0C0C0E", borderRadius: 10, padding: "14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                           <div style={{ fontSize: 11, color: "#C084FC", marginBottom: 4, fontWeight: 600 }}>Karir & Edukasi</div>
                           <div style={{ fontSize: 13, color: "#F2F2F4", fontWeight: 600, marginBottom: 8 }}>Sertifikasi Cloud (AWS)</div>
                           <div style={{ fontSize: 10, color: "#9191A0", marginBottom: 6 }}>Proses Belajar: 80%</div>
                           <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}><div style={{ width: "80%", height: "100%", background: "#C084FC", borderRadius: 2 }}/></div>
                         </div>
                         <div style={{ flex: 1, background: "#0C0C0E", borderRadius: 10, padding: "14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                           <div style={{ fontSize: 11, color: "#34D399", marginBottom: 4, fontWeight: 600 }}>Fisik & Kesehatan</div>
                           <div style={{ fontSize: 13, color: "#F2F2F4", fontWeight: 600, marginBottom: 8 }}>Turun BB Target 5kg</div>
                           <div style={{ fontSize: 10, color: "#9191A0", marginBottom: 6 }}>Mencapai: 2kg (40%)</div>
                           <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}><div style={{ width: "40%", height: "100%", background: "#34D399", borderRadius: 2 }}/></div>
                         </div>
                       </div>
                     </div>
                  )}

                  {activePreview === "Habit" && (
                    <div style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
                      <div style={{ background: "#0C0C0E", borderRadius: 10, padding: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        {[
                          { title: "Membaca 20 Halaman", streak: 12, arr: [1,1,1,1,1,1,1] },
                          { title: "Workout 30m", streak: 3, arr: [1,0,1,1,0,1,1] },
                          { title: "Meditasi Pagi", streak: 0, arr: [0,0,0,1,0,0,0] }
                        ].map((h, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, marginBottom: 12, borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                            <div>
                               <div style={{ fontSize: 13, color: "#F2F2F4", fontWeight: 500 }}>{h.title}</div>
                               <div style={{ fontSize: 11, color: h.streak > 0 ? "#A0AEC0" : "#5C5C6B", marginTop: 4, fontWeight: 600 }}>
                                  {h.streak > 0 ? `${h.streak} hari berturut` : "Belum mulai"}
                               </div>
                            </div>
                            <div style={{ display: "flex", gap: 3 }}>
                              {h.arr.map((done, k) => (
                                <div key={k} style={{ width: 14, height: 14, borderRadius: 4, background: done ? "#34D399" : "rgba(255,255,255,0.05)" }} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="fitur" style={{ padding: "64px 32px 80px", maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: "#34D399", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: 12 }}>FITUR UNGGULAN</div>
          <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 400, color: "#F2F2F4", margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            Semua yang Anda Butuhkan
          </h2>
          <p style={{ fontSize: 15, color: "#5C5C6B", margin: 0, maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
            Satu platform lengkap untuk manajemen waktu & produktivitas pribadi.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "#141417",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 18, padding: "24px",
                transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = `${f.color}35`;
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${f.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 14,
              }}>
                {f.icon === "sun"    && <Icons.Sun      size={20} style={{ color: f.color, opacity: 0.8 }} />}
                {f.icon === "cal"    && <Icons.Calendar size={20} style={{ color: f.color, opacity: 0.8 }} />}
                {f.icon === "target" && <Icons.Target   size={20} style={{ color: f.color, opacity: 0.8 }} />}
                {f.icon === "repeat" && <Icons.Repeat   size={20} style={{ color: f.color, opacity: 0.8 }} />}
                {f.icon === "cpu"    && <Icons.Cpu      size={20} style={{ color: f.color, opacity: 0.8 }} />}
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#F2F2F4" }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: 13, color: "#5C5C6B", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* ── CTA ── */}
      <section style={{ padding: "80px 32px 96px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            overflow: "hidden",
            margin: "0 auto 28px",
            boxShadow: "0 8px 32px rgba(52,211,153,0.25)",
          }}>
            <img src="/logos.png" alt="Rivanzee" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 400, color: "#F2F2F4", margin: "0 0 16px", letterSpacing: "-0.5px" }}>
            Mulai Perjalanan Produktifmu
          </h2>
          <p style={{ fontSize: 15, color: "#5C5C6B", lineHeight: 1.7, margin: "0 0 36px" }}>
            Gratis selamanya. Login dengan akun Google dan mulai rencanakan hidup yang lebih terarah sekarang.
          </p>
          <button
            onClick={() => signIn("google")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 36px",
              background: "linear-gradient(135deg, #34D399, #10B981)",
              color: "#052e16", border: "none", borderRadius: 14,
              cursor: "pointer", fontSize: 16, fontWeight: 700,
              transition: "all 0.25s",
              boxShadow: "0 6px 24px rgba(52,211,153,0.3)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(52,211,153,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(52,211,153,0.3)"; }}
          >
            <GoogleIcon size={20} />
            Masuk dengan Google — Gratis!
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 12,
        position: "relative", zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, overflow: "hidden" }}>
            <img src="/logos.png" alt="Rivanzee" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: 16, color: "#F2F2F4" }}>Personal Planner</span>
        </div>

        {/* Divider */}
        <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.08)" }} />

        {/* Credit */}
        <div style={{ fontSize: 13, color: "#5C5C6B" }}>
          Dibuat oleh <span style={{ fontWeight: 700, color: "#5C5C6B" }}>Rivanzi Hidayatullah</span>
        </div>
        <div style={{ fontSize: 11, color: "#38383F" }}>© 2026 Personal Planner — All rights reserved</div>
      </footer>
    </div>
  );
}
