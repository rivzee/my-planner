"use client";

import { useState, useCallback } from "react";
import type { AIResult, PlannerData } from "@/types";

interface AIRecommendationProps {
  plannerData: PlannerData;
}

export default function AIRecommendation({ plannerData }: AIRecommendationProps) {
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRekomendasi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-rekomendasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plannerData),
      });
      if (!res.ok) throw new Error("Gagal mendapatkan rekomendasi");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [plannerData]);

  return (
    <div style={{
      background: "var(--theme-surface)",
      border: "1px solid var(--theme-border)",
      borderRadius: 16,
      padding: 20,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 120, height: 120, borderRadius: "50%",
        background: "rgba(52,211,153,0.05)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--theme-ink)" }}>
            ✨ Rekomendasi AI
          </h3>
          <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--theme-muted)", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ background: "linear-gradient(135deg,#4285F4,#34A853,#FBBC05,#EA4335)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>G</span>
            Powered by Gemini AI
          </p>
        </div>
        <button
          onClick={getRekomendasi}
          disabled={loading}
          style={{
            background: loading
              ? "var(--theme-surface-2)"
              : "linear-gradient(135deg, var(--theme-accent-2), var(--theme-accent))",
            color: loading ? "var(--theme-muted)" : "#052e16",
            border: "none",
            borderRadius: 10,
            padding: "9px 16px",
            fontSize: 12,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
            boxShadow: loading ? "none" : "0 2px 10px rgba(52,211,153,0.3)",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          {loading ? (
            <><span className="animate-pulse-soft">⏳</span> Menganalisis...</>
          ) : (
            <>✦ Analisis</>
          )}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          background: "rgba(251,113,133,0.1)",
          border: "1px solid rgba(251,113,133,0.2)",
          borderRadius: 10, padding: 12,
          fontSize: 13, color: "var(--theme-coral)",
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div style={{ textAlign: "center", padding: "24px 0", color: "var(--theme-muted)", fontSize: 13 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🤖</div>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Klik tombol di atas untuk mendapatkan rekomendasi personal dari AI.
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--theme-muted)", opacity: 0.7 }}>
            AI akan menganalisis tugas, habit, dan goals kamu.
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Prioritas */}
          <div style={{ background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 10, padding: 14 }}>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, color: "var(--theme-accent)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
              🎯 Prioritas Hari Ini
            </p>
            <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 5 }}>
              {result.prioritas.map((p, i) => (
                <li key={i} style={{ fontSize: 13, color: "var(--theme-ink-2)", lineHeight: 1.55 }}>{p}</li>
              ))}
            </ol>
          </div>

          {/* Saran Jadwal */}
          <div style={{ background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 10, padding: 14 }}>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "var(--theme-amber)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
              🕐 Saran Jadwal
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--theme-ink-2)", lineHeight: 1.65 }}>{result.saran_jadwal}</p>
          </div>

          {/* Pengingat */}
          <div style={{ background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 10, padding: 14 }}>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "var(--theme-blue)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
              🔔 Pengingat
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--theme-ink-2)", lineHeight: 1.65 }}>{result.pengingat}</p>
          </div>

          {/* Motivasi */}
          <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 10, padding: 14 }}>
            <p style={{ margin: 0, fontSize: 14, color: "var(--theme-accent)", fontStyle: "italic", lineHeight: 1.7, fontFamily: '"DM Serif Display", serif' }}>
              &ldquo;{result.motivasi}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
