"use client";

import { useState, useCallback } from "react";
import type { Habit } from "@/types";
import { formatDate } from "@/lib/utils";

interface HabitReview {
  name: string;
  status: "excellent" | "good" | "needs_attention" | "critical";
  feedback: string;
  action_step: string;
}

interface CoachResult {
  overall_score: string;
  overall_verdict: string;
  habit_reviews: HabitReview[];
  pattern_insight: string;
  challenge: string;
  encouragement: string;
}

interface AIHabitCoachProps {
  habits: Habit[];
}

const statusConfig: Record<string, { bg: string; border: string; color: string; icon: string; label: string }> = {
  excellent: { bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", color: "#34D399", icon: "🌟", label: "Sempurna" },
  good: { bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)", color: "#60A5FA", icon: "👍", label: "Bagus" },
  needs_attention: { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", color: "#FBBF24", icon: "⚡", label: "Perlu Perhatian" },
  critical: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", color: "#F87171", icon: "🔴", label: "Kritis" },
};

const scoreColors: Record<string, string> = {
  "A+": "#34D399", "A": "#34D399",
  "B+": "#60A5FA", "B": "#60A5FA",
  "C": "#FBBF24",
  "D": "#F87171",
};

export default function AIHabitCoach({ habits }: AIHabitCoachProps) {
  const [result, setResult] = useState<CoachResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Prepare habit data with streaks
      const habitsData = habits.map(h => {
        let streak = 0;
        const now = new Date();
        for (let i = 0; i < 30; i++) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          if (h.doneDates?.includes(formatDate(d))) streak++;
          else break;
        }

        // Count completed in last 7 days
        let completedThisWeek = 0;
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          if (h.doneDates?.includes(formatDate(d))) completedThisWeek++;
        }

        return {
          name: h.name,
          streak,
          completedThisWeek,
          totalDone: h.doneDates?.length || 0,
        };
      });

      const res = await fetch("/api/ai-habit-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habits: habitsData }),
      });
      if (!res.ok) throw new Error("Gagal mendapatkan coaching");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [habits]);

  return (
    <div style={{
      background: "linear-gradient(135deg, var(--theme-surface), var(--theme-surface-2))",
      border: "1px solid rgba(52,211,153,0.12)",
      borderRadius: 16,
      padding: 22,
      marginTop: 20,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient */}
      <div style={{ position: "absolute", top: -30, left: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(52,211,153,0.03)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: result ? 18 : 0 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--theme-ink)", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <line x1="16" y1="8" x2="2" y2="22" />
              <line x1="17.5" y1="15" x2="9" y2="15" />
            </svg>
            AI Habit Coach
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--theme-muted)", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ background: "linear-gradient(135deg,#4285F4,#34A853,#FBBC05,#EA4335)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>G</span>
            Analisis kebiasaan oleh Gemini AI
          </p>
        </div>
        <button
          onClick={analyze}
          disabled={loading || habits.length === 0}
          style={{
            background: loading ? "var(--theme-surface-2)" : "linear-gradient(135deg, var(--theme-accent-2), var(--theme-accent))",
            color: loading ? "var(--theme-muted)" : "#052e16",
            border: "none", borderRadius: 10,
            padding: "9px 16px", fontSize: 12,
            cursor: loading || habits.length === 0 ? "not-allowed" : "pointer",
            fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s",
            boxShadow: loading ? "none" : "0 2px 12px rgba(52,211,153,0.3)",
            fontFamily: "inherit",
            opacity: habits.length === 0 ? 0.5 : 1,
          }}
          onMouseEnter={e => { if (!loading && habits.length > 0) e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          {loading ? (
            <><span className="animate-pulse-soft">⏳</span> Menganalisis...</>
          ) : result ? (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Refresh</>
          ) : (
            <>✦ Analisis Habit</>
          )}
        </button>
      </div>

      {/* Empty state */}
      {!result && !loading && !error && habits.length > 0 && (
        <div style={{ textAlign: "center", padding: "16px 0 8px", color: "var(--theme-muted)", fontSize: 13 }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Klik tombol di atas untuk mendapatkan analisis mendalam tentang pola kebiasaanmu dari AI Coach.
          </p>
        </div>
      )}

      {habits.length === 0 && !result && (
        <div style={{ textAlign: "center", padding: "16px 0 8px", color: "var(--theme-muted)", fontSize: 13 }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Tambahkan habit terlebih dahulu untuk mendapatkan coaching dari AI.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.2)", borderRadius: 10, padding: 12, fontSize: 13, color: "var(--theme-coral)", marginTop: 12 }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Overall Score Banner */}
          <div style={{
            background: "linear-gradient(135deg, #0F172A, #1E293B)",
            borderRadius: 14,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: 14,
              background: `rgba(${result.overall_score.startsWith("A") ? "52,211,153" : result.overall_score.startsWith("B") ? "96,165,250" : result.overall_score === "C" ? "251,191,36" : "239,68,68"},0.1)`,
              border: `2px solid ${scoreColors[result.overall_score] || "#6B7280"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: scoreColors[result.overall_score] || "#6B7280", fontFamily: '"DM Serif Display", serif' }}>
                {result.overall_score}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#6B7280", marginBottom: 4 }}>Skor Keseluruhan</div>
              <p style={{ margin: 0, fontSize: 14, color: "#E5E7EB", fontWeight: 600, lineHeight: 1.5 }}>{result.overall_verdict}</p>
            </div>
          </div>

          {/* Habit Reviews */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--theme-ink-2)", marginBottom: 8 }}>Review per Habit</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {result.habit_reviews.map((review, i) => {
                const cfg = statusConfig[review.status] || statusConfig.good;
                return (
                  <div key={i} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 14 }}>{cfg.icon}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--theme-ink)", flex: 1 }}>{review.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: cfg.color, letterSpacing: "0.06em", padding: "2px 7px", borderRadius: 5, background: `${cfg.border}` }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 6px", fontSize: 12.5, color: "var(--theme-ink-2)", lineHeight: 1.55 }}>{review.feedback}</p>
                    <p style={{ margin: 0, fontSize: 11.5, color: cfg.color, fontWeight: 600 }}>→ {review.action_step}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pattern Insight */}
          <div style={{ background: "rgba(96,165,250,0.06)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(96,165,250,0.12)" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--theme-blue)", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Pola yang Terdeteksi
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--theme-ink-2)", lineHeight: 1.65 }}>{result.pattern_insight}</p>
          </div>

          {/* Challenge */}
          <div style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.06), rgba(245,158,11,0.03))",
            borderRadius: 12, padding: "14px 16px",
            border: "1px solid rgba(251,191,36,0.15)",
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--theme-amber)", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Tantangan Minggu Depan
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--theme-amber)", lineHeight: 1.6, fontWeight: 600 }}>{result.challenge}</p>
          </div>

          {/* Encouragement */}
          <div style={{ background: "rgba(52,211,153,0.05)", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(52,211,153,0.12)" }}>
            <p style={{ margin: 0, fontSize: 14, color: "var(--theme-accent)", fontStyle: "italic", lineHeight: 1.7, fontFamily: '"DM Serif Display", serif' }}>
              &ldquo;{result.encouragement}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
