"use client";

import { useState, useCallback } from "react";

interface BriefingData {
  sapaan: string;
  ringkasan: string;
  fokus_utama: string;
  insight: string;
  motivasi: string;
}

interface DailyBriefingProps {
  userName?: string;
  tasks: { pending: string[]; done: string[] };
  habits: Array<{ name: string; streak: number }>;
  monthlyTargets: Array<{ text: string; done: boolean }>;
  weeklyFocus: string;
  xp: number;
  level: number;
  onAddPriority?: (text: string) => void;
}

// Shimmer loading skeleton
function ShimmerLine({ width = "100%", height = 14 }: { width?: string; height?: number }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 6,
        background: "linear-gradient(90deg, var(--theme-surface-2) 25%, var(--theme-border) 50%, var(--theme-surface-2) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s infinite",
      }}
    />
  );
}

export default function DailyBriefing({
  userName, tasks, habits, monthlyTargets, weeklyFocus, xp, level, onAddPriority
}: DailyBriefingProps) {
  const [data, setData] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [addedFokus, setAddedFokus] = useState(false);

  const fetchBriefing = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, tasks, habits, monthlyTargets, weeklyFocus, xp, level }),
      });
      if (!res.ok) throw new Error("Gagal memuat briefing");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [userName, tasks, habits, monthlyTargets, weeklyFocus, xp, level]);

  if (dismissed) return null;

  return (
    <div
      className="animate-fade-up delay-100"
      style={{
        background: "linear-gradient(135deg, #0C1220 0%, #111827 40%, #0F1A12 100%)",
        borderRadius: 20,
        padding: 0,
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(52,211,153,0.12)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Animated ambient background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(52,211,153,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 80% 30%, rgba(96,165,250,0.04) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", right: -40, top: -40,
        width: 180, height: 180, borderRadius: "50%",
        background: "rgba(52,211,153,0.04)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ padding: "20px 24px 0", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.05))",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(52,211,153,0.2)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#E5E7EB", letterSpacing: "-0.3px" }}>Daily Briefing</div>
            <div style={{ fontSize: 10, color: "#6B7280", display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
              <span style={{ background: "linear-gradient(135deg,#4285F4,#34A853,#FBBC05,#EA4335)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>G</span>
              Powered by Gemini AI
            </div>
          </div>
        </div>

        {data && (
          <button
            onClick={() => setDismissed(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#4B5563", fontSize: 16, lineHeight: 1, padding: 4 }}
          >✕</button>
        )}
      </div>

      {/* Content area */}
      <div style={{ padding: "16px 24px 20px", position: "relative" }}>
        {/* Empty state */}
        {!data && !loading && !error && (
          <div style={{ textAlign: "center", padding: "12px 0 8px" }}>
            <p style={{ margin: "0 0 14px", fontSize: 13.5, color: "#9CA3AF", lineHeight: 1.6 }}>
              Dapatkan ringkasan cerdas tentang harimu — tugas, habit, dan strategi terbaik yang dipersonalisasi oleh AI.
            </p>
            <button
              onClick={fetchBriefing}
              style={{
                background: "linear-gradient(135deg, #059669, #10B981)",
                color: "#fff",
                border: "none", borderRadius: 12,
                padding: "11px 28px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
                display: "inline-flex", alignItems: "center", gap: 7,
                fontFamily: "inherit",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(16,185,129,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(16,185,129,0.3)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Mulai Briefing Hari Ini
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
            <ShimmerLine width="70%" height={16} />
            <ShimmerLine width="100%" />
            <ShimmerLine width="90%" />
            <div style={{ height: 8 }} />
            <ShimmerLine width="50%" height={12} />
            <ShimmerLine width="100%" />
            <div style={{ height: 8 }} />
            <ShimmerLine width="60%" height={12} />
            <ShimmerLine width="85%" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: 14, fontSize: 13, color: "#F87171" }}>
            {error}
            <button onClick={fetchBriefing} style={{ display: "block", marginTop: 8, background: "none", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "6px 14px", color: "#F87171", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              Coba Lagi
            </button>
          </div>
        )}

        {/* Result */}
        {data && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Sapaan */}
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#E5E7EB", lineHeight: 1.5, fontFamily: '"DM Serif Display", serif' }}>
              {data.sapaan}
            </p>

            {/* Ringkasan */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#6B7280", marginBottom: 6 }}>Ringkasan</div>
              <p style={{ margin: 0, fontSize: 13, color: "#D1D5DB", lineHeight: 1.7 }}>{data.ringkasan}</p>
            </div>

            {/* Fokus Utama */}
            <div style={{ background: "rgba(52,211,153,0.06)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(52,211,153,0.12)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#34D399", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                  Fokus Utama
                </div>
                <p style={{ margin: 0, fontSize: 13.5, color: "#A7F3D0", lineHeight: 1.6, fontWeight: 600 }}>{data.fokus_utama}</p>
              </div>
              {onAddPriority && (
                <button
                  onClick={() => {
                    onAddPriority(data.fokus_utama);
                    setAddedFokus(true);
                  }}
                  disabled={addedFokus}
                  style={{
                    background: addedFokus ? "transparent" : "rgba(251,113,133,0.1)",
                    color: addedFokus ? "rgba(255,255,255,0.4)" : "var(--theme-coral)",
                    border: addedFokus ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                    borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 700,
                    cursor: addedFokus ? "default" : "pointer", transition: "all 0.2s",
                    whiteSpace: "nowrap"
                  }}
                >
                  {addedFokus ? "✔ Di-Prioritas" : "+ Prioritaskan"}
                </button>
              )}
            </div>

            {/* Insight */}
            <div style={{ background: "rgba(96,165,250,0.05)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(96,165,250,0.1)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#60A5FA", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Insight
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#93C5FD", lineHeight: 1.65 }}>{data.insight}</p>
            </div>

            {/* Motivasi */}
            <div style={{ background: "rgba(251,191,36,0.04)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(251,191,36,0.08)" }}>
              <p style={{ margin: 0, fontSize: 14, color: "#FCD34D", fontStyle: "italic", lineHeight: 1.7, fontFamily: '"DM Serif Display", serif' }}>
                &ldquo;{data.motivasi}&rdquo;
              </p>
            </div>

            {/* Refresh button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={fetchBriefing}
                disabled={loading}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, padding: "6px 14px",
                  fontSize: 11, fontWeight: 600, color: "#6B7280",
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 5,
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.2)"; e.currentTarget.style.color = "#34D399"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#6B7280"; }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
