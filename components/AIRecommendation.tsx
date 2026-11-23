"use client";

import { useState, useCallback } from "react";
import type { AIResult, PlannerData } from "@/types";

interface AIRecommendationProps {
  plannerData: PlannerData;
  onAddPriority?: (text: string) => void;
  onAddTask?: (text: string) => void;
}

export default function AIRecommendation({ plannerData, onAddPriority, onAddTask }: AIRecommendationProps) {
  const [addedPriority, setAddedPriority] = useState<Record<number, boolean>>({});
  const [addedTask, setAddedTask] = useState<Record<number, boolean>>({});
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
      setAddedPriority({});
      setAddedTask({});
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
      borderRadius: 12,
      padding: 18,
      position: "relative",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "var(--theme-ink)" }}>
            Sintesis Alur Kerja
          </h3>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--theme-muted)" }}>
            Saran penjadwalan & prioritas kontekstual
          </p>
        </div>
        <button
          onClick={getRekomendasi}
          disabled={loading}
          style={{
            background: loading ? "var(--theme-surface-2)" : "var(--theme-accent)",
            color: loading ? "var(--theme-muted)" : "#052e16",
            border: "none",
            borderRadius: 7,
            padding: "6px 12px",
            fontSize: 11.5,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "opacity 0.15s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {loading ? "Menyusun..." : "Sintesis"}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          background: "rgba(251,113,133,0.08)",
          border: "1px solid rgba(251,113,133,0.2)",
          borderRadius: 8,
          padding: 10,
          fontSize: 12,
          color: "var(--theme-coral)",
          marginBottom: 10,
        }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div style={{ textAlign: "center", padding: "18px 0", color: "var(--theme-muted)", fontSize: 12 }}>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            Klik &ldquo;Sintesis&rdquo; untuk merangkum beban kerja dan saran penjadwalan hari ini.
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Prioritas */}
          <div style={{ background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 12 }}>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, color: "var(--theme-accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Fokus Utama Hari Ini
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {result.prioritas.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 12.5, color: "var(--theme-ink-2)" }}>
                  <span style={{ flex: 1 }}>{i + 1}. {p}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {onAddPriority && (
                      <button
                        onClick={() => {
                          onAddPriority(p);
                          setAddedPriority(prev => ({ ...prev, [i]: true }));
                        }}
                        disabled={addedPriority[i]}
                        style={{
                          background: addedPriority[i] ? "transparent" : "rgba(251,113,133,0.1)",
                          color: addedPriority[i] ? "var(--theme-muted)" : "var(--theme-coral)",
                          border: `1px solid ${addedPriority[i] ? "var(--theme-border)" : "rgba(251,113,133,0.2)"}`,
                          borderRadius: 5, padding: "3px 7px", fontSize: 10, fontWeight: 600,
                          cursor: addedPriority[i] ? "default" : "pointer",
                        }}
                      >
                        {addedPriority[i] ? "✓ Ditambah" : "+ Prioritas"}
                      </button>
                    )}
                    {onAddTask && (
                      <button
                        onClick={() => {
                          onAddTask(p);
                          setAddedTask(prev => ({ ...prev, [i]: true }));
                        }}
                        disabled={addedTask[i]}
                        style={{
                          background: addedTask[i] ? "transparent" : "var(--theme-surface-3)",
                          color: addedTask[i] ? "var(--theme-muted)" : "var(--theme-ink)",
                          border: "1px solid var(--theme-border)",
                          borderRadius: 5, padding: "3px 7px", fontSize: 10, fontWeight: 600,
                          cursor: addedTask[i] ? "default" : "pointer",
                        }}
                      >
                        {addedTask[i] ? "✓" : "+ Task"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saran Jadwal */}
          {result.saran_jadwal && (
            <div style={{ background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 12 }}>
              <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "var(--theme-blue)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Rekomendasi Jadwal
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--theme-ink-2)", lineHeight: 1.6 }}>
                {result.saran_jadwal}
              </p>
            </div>
          )}

          {/* Pengingat */}
          {result.pengingat && (
            <div style={{ background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 12 }}>
              <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "var(--theme-amber)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Pengingat
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--theme-ink-2)", lineHeight: 1.5 }}>
                {result.pengingat}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
