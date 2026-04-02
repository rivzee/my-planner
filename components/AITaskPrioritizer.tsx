"use client";

import { useState, useCallback } from "react";
import type { Task } from "@/types";

interface PrioritizedTask {
  task: string;
  urgency: "tinggi" | "sedang" | "rendah";
  estimated_time: string;
  reason: string;
  tip: string;
}

interface PrioritizeResult {
  analysis: string;
  optimized_order: PrioritizedTask[];
  time_block_suggestion: string;
  productivity_tip: string;
}

interface AITaskPrioritizerProps {
  priorityTasks: Task[];
  regularTasks: Task[];
}

const urgencyConfig: Record<string, { bg: string; border: string; color: string; label: string }> = {
  tinggi: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", color: "#F87171", label: "URGENT" },
  sedang: { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", color: "#FBBF24", label: "MEDIUM" },
  rendah: { bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)", color: "#60A5FA", label: "LOW" },
};

export default function AITaskPrioritizer({ priorityTasks, regularTasks }: AITaskPrioritizerProps) {
  const [result, setResult] = useState<PrioritizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const totalPending = [...priorityTasks, ...regularTasks].filter(t => !t.done).length;

  const analyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const res = await fetch("/api/ai-prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: {
            priority: priorityTasks.map(t => ({ text: t.text, done: t.done, priority: t.priority })),
            regular: regularTasks.map(t => ({ text: t.text, done: t.done, priority: t.priority })),
          },
          context: {
            day: now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" }),
            time: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          },
        }),
      });
      if (!res.ok) throw new Error("Gagal menganalisis");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResult(json);
      setExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [priorityTasks, regularTasks]);

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
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(251,191,36,0.04)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: result ? 16 : 0 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--theme-ink)", display: "flex", alignItems: "center", gap: 7 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--theme-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            AI Prioritizer
          </h3>
          <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--theme-muted)" }}>
            {totalPending > 0 ? `${totalPending} tugas pending — Optimasi urutan?` : "Tidak ada tugas pending"}
          </p>
        </div>
        <button
          onClick={analyze}
          disabled={loading || totalPending === 0}
          style={{
            background: loading ? "var(--theme-surface-2)" : "linear-gradient(135deg, #D97706, #F59E0B)",
            color: loading ? "var(--theme-muted)" : "#451A03",
            border: "none", borderRadius: 10,
            padding: "8px 14px", fontSize: 11.5,
            cursor: loading || totalPending === 0 ? "not-allowed" : "pointer",
            fontWeight: 700, display: "flex", alignItems: "center", gap: 5,
            transition: "all 0.2s",
            boxShadow: loading ? "none" : "0 2px 10px rgba(245,158,11,0.25)",
            fontFamily: "inherit",
            opacity: totalPending === 0 ? 0.5 : 1,
          }}
          onMouseEnter={e => { if (!loading && totalPending > 0) e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          {loading ? (
            <><span className="animate-pulse-soft">⏳</span> Menganalisis...</>
          ) : (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Optimasi</>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.2)", borderRadius: 10, padding: 12, fontSize: 13, color: "var(--theme-coral)", marginTop: 12 }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && expanded && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Analysis */}
          <div style={{ background: "var(--theme-surface-2)", borderRadius: 10, padding: "10px 14px", border: "1px solid var(--theme-border)" }}>
            <p style={{ margin: 0, fontSize: 13, color: "var(--theme-ink-2)", lineHeight: 1.6 }}>{result.analysis}</p>
          </div>

          {/* Optimized order */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--theme-amber)", marginBottom: 2 }}>
              Urutan Optimal
            </div>
            {result.optimized_order.map((item, i) => {
              const cfg = urgencyConfig[item.urgency] || urgencyConfig.sedang;
              return (
                <div key={i} style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{
                      width: 22, height: 22,
                      background: `${cfg.border}`,
                      borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, color: cfg.color,
                    }}>{i + 1}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--theme-ink)", flex: 1 }}>{item.task}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: cfg.color, letterSpacing: "0.06em", padding: "2px 6px", borderRadius: 4, background: `${cfg.border}` }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--theme-muted)", marginBottom: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {item.estimated_time}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "var(--theme-ink-2)", lineHeight: 1.5 }}>{item.reason}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--theme-accent)", fontStyle: "italic" }}>💡 {item.tip}</p>
                </div>
              );
            })}
          </div>

          {/* Time block */}
          <div style={{ background: "var(--theme-surface-2)", borderRadius: 10, padding: "10px 14px", border: "1px solid var(--theme-border)" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--theme-blue)", marginBottom: 6 }}>
              Saran Time Block
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--theme-ink-2)", lineHeight: 1.65 }}>{result.time_block_suggestion}</p>
          </div>

          {/* Productivity tip */}
          <div style={{ background: "rgba(52,211,153,0.06)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(52,211,153,0.15)" }}>
            <p style={{ margin: 0, fontSize: 13, color: "var(--theme-accent)", lineHeight: 1.65, fontStyle: "italic" }}>
              ✦ {result.productivity_tip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
