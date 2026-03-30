"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { generateId, formatDate } from "@/lib/utils";
import type { Habit } from "@/types";
import { addXP } from "@/lib/storage";

interface HabitTrackerProps {
  habits: Habit[];
  onUpdate: (habits: Habit[]) => void;
}

function getLast7Days(): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
}

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const ICON_OPTIONS = ["⭐", "💪", "📚", "🏃", "🧘", "💰", "🥗", "💧", "😴", "🎯"];

function HabitTracker({ habits, onUpdate }: HabitTrackerProps) {
  const [input, setInput] = useState("");
  const [inputIcon, setInputIcon] = useState("⭐");
  const last7Days = useMemo(() => getLast7Days(), []);

  const addHabit = useCallback(() => {
    if (!input.trim()) return;
    const newHabit: Habit = { id: generateId(), name: input.trim(), icon: inputIcon, doneDates: [] };
    onUpdate([...habits, newHabit]);
    setInput("");
  }, [input, inputIcon, habits, onUpdate]);

  const toggleDay = useCallback((habitId: string, date: Date) => {
    const dateStr = formatDate(date);
    onUpdate(
      habits.map((h) => {
        if (h.id !== habitId) return h;
        const done = h.doneDates.includes(dateStr);
        addXP(done ? -5 : 5);
        return { ...h, doneDates: done ? h.doneDates.filter((d) => d !== dateStr) : [...h.doneDates, dateStr] };
      })
    );
  }, [habits, onUpdate]);

  const deleteHabit = useCallback((id: string) => { onUpdate(habits.filter((h) => h.id !== id)); }, [habits, onUpdate]);

  const getStreak = useCallback((habit: Habit): number => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      if (habit.doneDates.includes(formatDate(d))) streak++;
      else break;
    }
    return streak;
  }, []);

  const todayStr = useMemo(() => formatDate(new Date()), []);

  return (
    <div>
      {/* ── Add Habit ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <select
          value={inputIcon}
          onChange={(e) => setInputIcon(e.target.value)}
          style={{
            background: "var(--theme-surface-2)",
            border: "1px solid var(--theme-border)",
            borderRadius: 8, padding: "8px 10px",
            fontSize: 16, cursor: "pointer", outline: "none", fontFamily: "inherit",
            color: "var(--theme-ink)", transition: "border-color 0.15s",
          }}
          onFocus={e => e.target.style.borderColor = "var(--theme-accent)"}
          onBlur={e => e.target.style.borderColor = "var(--theme-border)"}
        >
          {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
        </select>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
          placeholder="Tambah habit baru..."
          style={{
            flex: 1,
            background: "var(--theme-surface-2)",
            border: "1px solid var(--theme-border)",
            borderRadius: 8, padding: "8px 12px",
            fontSize: 14, color: "var(--theme-ink)", outline: "none",
            fontFamily: "inherit", transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--theme-accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--theme-border)")}
        />
        <button
          onClick={addHabit}
          style={{
            background: "var(--theme-accent)", color: "#052e16",
            border: "none", borderRadius: 8, padding: "8px 16px",
            fontSize: 16, cursor: "pointer", fontWeight: 700, fontFamily: "inherit",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          +
        </button>
      </div>

      {/* ── Header row ── */}
      {habits.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(7, 36px) 60px", gap: 4, marginBottom: 8, paddingRight: 36 }}>
          <div />
          {last7Days.map((d, i) => (
            <div key={i} style={{
              textAlign: "center", fontSize: 10,
              color: formatDate(d) === todayStr ? "var(--theme-accent)" : "var(--theme-muted)",
              fontWeight: formatDate(d) === todayStr ? 700 : 400,
            }}>
              <div style={{ letterSpacing: "0.03em" }}>{DAY_LABELS[(d.getDay() + 6) % 7]}</div>
              <div>{d.getDate()}</div>
            </div>
          ))}
          <div style={{ textAlign: "center", fontSize: 10, color: "var(--theme-muted)", letterSpacing: "0.04em" }}>STREAK</div>
        </div>
      )}

      {/* ── Habits list ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {habits.map((habit) => {
          const streak = getStreak(habit);
          return (
            <div
              key={habit.id}
              className="animate-fade-in"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr repeat(7, 36px) 36px",
                gap: 4, alignItems: "center",
                padding: "10px 12px",
                background: "var(--theme-surface-2)",
                border: "1px solid var(--theme-border)",
                borderRadius: 10,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--theme-border-2)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--theme-border)"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: 18 }}>{habit.icon}</span>
                <span style={{ fontSize: 13, color: "var(--theme-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                  {habit.name}
                </span>
                {streak > 0 && (
                  <span style={{
                    fontSize: 10,
                    background: streak >= 7 ? "rgba(255,215,0,0.12)" : "rgba(52,211,153,0.1)",
                    border: streak >= 7 ? "1px solid rgba(255,215,0,0.4)" : "none",
                    color: streak >= 7 ? "#FBBF24" : "var(--theme-accent)",
                    padding: "2px 6px", borderRadius: 10, fontWeight: 700, whiteSpace: "nowrap" as const,
                  }}>
                    🔥{streak}{streak >= 7 && " STREAK!"}
                  </span>
                )}
              </div>

              {last7Days.map((d, i) => {
                const dateStr = formatDate(d);
                const done = habit.doneDates.includes(dateStr);
                const isToday = todayStr === dateStr;
                return (
                  <button
                    key={i}
                    onClick={() => toggleDay(habit.id, d)}
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      border: `2px solid ${done ? "var(--theme-accent)" : isToday ? "rgba(52,211,153,0.3)" : "var(--theme-border)"}`,
                      background: done ? "var(--theme-accent)" : "transparent",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: done ? "#052e16" : "transparent",
                      fontSize: 14, transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (!done) { e.currentTarget.style.borderColor = "var(--theme-accent)"; e.currentTarget.style.background = "rgba(52,211,153,0.1)"; } }}
                    onMouseLeave={e => { if (!done) { e.currentTarget.style.borderColor = isToday ? "rgba(52,211,153,0.3)" : "var(--theme-border)"; e.currentTarget.style.background = "transparent"; } }}
                    title={d.toLocaleDateString("id-ID")}
                  >
                    {done && "✓"}
                  </button>
                );
              })}

              <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: streak >= 5 ? "var(--theme-accent)" : streak >= 3 ? "var(--theme-amber)" : "var(--theme-muted)" }}>
                {streak}/7
              </div>
              <button
                onClick={() => deleteHabit(habit.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--theme-muted)", fontSize: 18, padding: 2, lineHeight: 1, transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--theme-coral)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--theme-muted)")}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 0", color: "var(--theme-muted)", fontSize: 13 }}>
          Belum ada habit. Mulai lacak kebiasaanmu! 🌱
        </div>
      )}
    </div>
  );
}

export default memo(HabitTracker);
