"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import HabitTrackerComponent from "@/components/HabitTracker";
import { storage } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import type { Habit } from "@/types";

export default function HabitPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = storage.get<Habit[]>("habits") ?? [];
    setHabits(saved);
  }, []);

  useEffect(() => { if (!mounted) return; storage.set("habits", habits); }, [habits, mounted]);

  const today = useMemo(() => formatDate(new Date()), []);
  const getStreak = useCallback((habit: Habit): number => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      if (habit.doneDates.includes(formatDate(d))) streak++;
      else break;
    }
    return streak;
  }, []);

  const bestStreak = useMemo(() => habits.length > 0 ? Math.max(...habits.map(getStreak)) : 0, [habits, getStreak]);
  const todayCompleted = useMemo(() => habits.filter(h => h.doneDates.includes(today)).length, [habits, today]);
  const todayPct = useMemo(() => habits.length > 0 ? Math.round((todayCompleted / habits.length) * 100) : 0, [habits.length, todayCompleted]);

  const card: React.CSSProperties = useMemo(() => ({
    background: "var(--theme-surface)",
    border: "1px solid var(--theme-border)",
    borderRadius: 16,
    padding: 24,
  }), []);

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">
        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "var(--theme-muted)", marginBottom: 6, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
            Habit Tracker
          </div>
          <h1 style={{ margin: "0 0 6px", fontFamily: '"DM Serif Display", serif', fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 400, color: "var(--theme-ink)", letterSpacing: "-0.5px" }}>
            Lacak Kebiasaanmu 🔁
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "var(--theme-muted)" }}>
            Konsistensi adalah bahan bakar dari semua pencapaian besar.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="stats-grid-3" style={{ marginBottom: 20 }}>
          {[
            { value: todayCompleted, label: "Selesai Hari Ini", sub: `dari ${habits.length} habit`, bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", color: "var(--theme-accent)" },
            { value: bestStreak, label: "Streak Terbaik", sub: "hari berturut-turut", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)", color: "var(--theme-amber)" },
            { value: habits.length, label: "Total Habit", sub: "yang dilacak", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)", color: "var(--theme-blue)" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "20px 16px", textAlign: "center" as const }}>
              <div style={{ fontSize: 36, fontFamily: '"DM Serif Display", serif', fontWeight: 400, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--theme-ink-2)", marginTop: 4, fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "var(--theme-muted)", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Progress Bar ── */}
        {habits.length > 0 && (
          <div style={{ ...card, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--theme-ink)" }}>Progress Hari Ini</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--theme-accent)" }}>{todayCompleted}/{habits.length} ({todayPct}%)</span>
            </div>
            <div style={{ height: 8, background: "var(--theme-surface-2)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${todayPct}%`,
                background: "linear-gradient(90deg, var(--theme-accent-2), var(--theme-accent))",
                borderRadius: 99, transition: "width 0.5s ease",
                boxShadow: "0 0 8px rgba(52,211,153,0.4)",
              }} />
            </div>
          </div>
        )}

        {/* ── Habit Grid ── */}
        <div style={card}>
          <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "var(--theme-ink)", display: "flex", alignItems: "center", gap: 8 }}>
            <span>📊</span> 7 Hari Terakhir
          </h2>
          <HabitTrackerComponent habits={habits} onUpdate={setHabits} />
        </div>

        {/* ── Tips ── */}
        <div style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.12)", borderRadius: 16, padding: 20, marginTop: 20 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "var(--theme-accent)" }}>💡 Tips Habit Tracker</h3>
          <ul style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Mulai dengan 2-3 habit kecil yang mudah dilakukan setiap hari",
              "Lakukan habit di waktu yang sama setiap hari (habit stacking)",
              "Jangan lewatkan 2 hari berturut-turut — satu hari bolos itu wajar",
              "Rayakan setiap streak kecil untuk menjaga motivasi",
            ].map((tip, i) => (
              <li key={i} style={{ fontSize: 13, color: "var(--theme-muted)", lineHeight: 1.6 }}>{tip}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
