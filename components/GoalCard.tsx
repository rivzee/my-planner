"use client";

import { memo } from "react";
import type { Goal } from "@/types";
import { getCategoryColor, getCategoryIcon, getCategoryLabel } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
  onUpdate: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
  const color = getCategoryColor(goal.category);
  const icon = getCategoryIcon(goal.category);
  const label = getCategoryLabel(goal.category);

  const adjustProgress = (delta: number) => {
    const newProgress = Math.max(0, Math.min(100, goal.progress + delta));
    onUpdate({ ...goal, progress: newProgress });
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        background: "var(--theme-surface)",
        border: "1px solid var(--theme-border)",
        borderRadius: 14,
        padding: 16,
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.4)";
        e.currentTarget.style.borderColor = "var(--theme-border-2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "var(--theme-border)";
      }}
    >
      {/* Subtle left border accent */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: color, borderRadius: "14px 0 0 14px", opacity: 0.4 }} />

      <div style={{ paddingLeft: 8 }}>
        {/* Category badge + delete */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 10, background: "var(--theme-surface-2)",
            color: "var(--theme-ink-2)", border: "1px solid var(--theme-border)",
            padding: "2px 8px", borderRadius: 4, fontWeight: 700,
            letterSpacing: "0.06em", marginBottom: 8,
          }}>
            {icon}
          </span>
          <button
            onClick={() => onDelete(goal.id)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--theme-muted)", fontSize: 18, padding: 2, lineHeight: 1, transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--theme-coral)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--theme-muted)")}
          >
            ×
          </button>
        </div>

        {/* Title */}
        <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--theme-ink)", lineHeight: 1.4 }}>
          {goal.title}
        </h4>
        {goal.target && (
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--theme-muted)" }}>{goal.target}</p>
        )}

        {/* Progress bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: "var(--theme-muted)" }}>Progress</span>
            <span style={{ fontSize: 13, fontWeight: 700, color }}>{goal.progress}%</span>
          </div>
          <div style={{ height: 6, background: "var(--theme-surface-2)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${goal.progress}%`,
              background: `linear-gradient(90deg, ${color}70, ${color})`,
              borderRadius: 99, transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
          {[-10, -5, +5, +10].map((delta) => (
            <button
              key={delta}
              onClick={() => adjustProgress(delta)}
              style={{
                background: delta > 0 ? `${color}15` : "var(--theme-surface-2)",
                color: delta > 0 ? color : "var(--theme-muted)",
                border: `1px solid ${delta > 0 ? `${color}30` : "var(--theme-border)"}`,
                borderRadius: 6, padding: "4px 8px",
                fontSize: 11, cursor: "pointer", fontWeight: 600,
                transition: "all 0.15s", fontFamily: "inherit",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {delta > 0 ? `+${delta}` : delta}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(GoalCard);
