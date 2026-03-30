"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import WeekGrid from "@/components/WeekGrid";
import { storage } from "@/lib/storage";
import { getWeekDates, formatDate, getDayName } from "@/lib/utils";
import type { Task } from "@/types";

const card: React.CSSProperties = {
  background: "var(--theme-surface)",
  border: "1px solid var(--theme-border)",
  borderRadius: 16,
  padding: 24,
};

const cardTitle: React.CSSProperties = {
  margin: "0 0 16px",
  fontSize: 16,
  fontWeight: 700,
  color: "var(--theme-ink)",
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const navBtn: React.CSSProperties = {
  background: "var(--theme-surface-2)",
  border: "1px solid var(--theme-border)",
  borderRadius: 8,
  padding: "8px 14px",
  cursor: "pointer",
  fontSize: 15,
  color: "var(--theme-ink-2)",
  transition: "all 0.15s",
  fontFamily: "inherit",
};

export default function MingguanPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeklyFocus, setWeeklyFocus] = useState("");
  const [mounted, setMounted] = useState(false);

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const weekStart = useMemo(() => weekDates[0].toLocaleDateString("id-ID", { day: "numeric", month: "short" }), [weekDates]);
  const weekEnd = useMemo(() => weekDates[6].toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }), [weekDates]);

  useEffect(() => {
    setMounted(true);
    const saved = storage.get<Task[]>("weekly-tasks") ?? [];
    const savedFocus = storage.get<string>("weekly-focus") ?? "";
    setTasks(saved);
    setWeeklyFocus(savedFocus);
  }, []);

  useEffect(() => { if (!mounted) return; storage.set("weekly-tasks", tasks); }, [tasks, mounted]);

  const handleFocusChange = useCallback((value: string) => {
    setWeeklyFocus(value);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      storage.set("weekly-focus", weeklyFocus);
    }, 500);
    return () => clearTimeout(t);
  }, [weeklyFocus, mounted]);

  const doneTasks = useMemo(() => tasks.filter(t => t.done).length, [tasks]);
  const pendingTasks = useMemo(() => tasks.filter(t => !t.done).length, [tasks]);

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">

        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "var(--theme-muted)", marginBottom: 6, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
            Perencanaan Mingguan
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 12 }}>
            <h1 style={{ margin: 0, fontFamily: '"DM Serif Display", serif', fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 400, color: "var(--theme-ink)", letterSpacing: "-0.5px" }}>
              Rencana Minggu Ini 📅
            </h1>
            {/* Week nav */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setWeekOffset(w => w - 1)} style={navBtn} onMouseEnter={e => e.currentTarget.style.background = "var(--theme-surface-3)"} onMouseLeave={e => e.currentTarget.style.background = "var(--theme-surface-2)"}>←</button>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--theme-ink-2)", minWidth: 160, textAlign: "center" as const }}>
                {weekStart} — {weekEnd}
              </span>
              <button onClick={() => setWeekOffset(w => w + 1)} style={navBtn} onMouseEnter={e => e.currentTarget.style.background = "var(--theme-surface-3)"} onMouseLeave={e => e.currentTarget.style.background = "var(--theme-surface-2)"}>→</button>
              {weekOffset !== 0 && (
                <button
                  onClick={() => { setWeekOffset(0); setSelectedDate(formatDate(new Date())); }}
                  style={{ background: "var(--theme-accent)", color: "#052e16", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}
                >
                  Sekarang
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Week Calendar ── */}
        <div style={{ ...card, marginBottom: 20 }}>
          <WeekGrid weekDates={weekDates} tasks={tasks} selectedDate={selectedDate} onSelectDate={(d) => setSelectedDate(formatDate(d))} />
        </div>

        {/* ── Content ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
          {/* Left */}
          <div style={card}>
            <h2 style={cardTitle}><span style={{ fontSize: 18 }}>📋</span> Daftar Tugas Mingguan</h2>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--theme-muted)", lineHeight: 1.6 }}>
              Tugas fleksibel minggu ini — dikerjakan kapan saja sebelum akhir minggu.
            </p>
            <TaskList tasks={tasks} onUpdate={setTasks} title="" placeholder="Tambah tugas untuk minggu ini..." accentColor="var(--theme-blue)" />
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Focus */}
            <div style={card}>
              <h3 style={cardTitle}><span style={{ fontSize: 18 }}>🎯</span> Fokus Minggu Ini</h3>
              <textarea
                value={weeklyFocus}
                onChange={(e) => handleFocusChange(e.target.value)}
                placeholder="Apa yang paling penting untuk diselesaikan minggu ini?"
                rows={4}
                style={{
                  width: "100%", background: "var(--theme-surface-2)",
                  border: "1px solid var(--theme-border)", borderRadius: 10,
                  padding: "12px 14px", fontSize: 14, color: "var(--theme-ink)",
                  resize: "none" as const, outline: "none",
                  fontFamily: '"Inter", sans-serif', lineHeight: 1.7,
                  boxSizing: "border-box" as const, transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--theme-blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--theme-border)")}
              />
            </div>

            {/* Stats */}
            <div style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 16, padding: 20 }}>
              <h3 style={{ ...cardTitle, marginBottom: 14 }}><span>📊</span> Statistik</h3>
              {[
                { label: "Total Tugas", value: tasks.length, color: "var(--theme-blue)" },
                { label: "Selesai", value: doneTasks, color: "var(--theme-accent)" },
                { label: "Pending", value: pendingTasks, color: "var(--theme-coral)" },
              ].map(stat => (
                <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--theme-border)" }}>
                  <span style={{ fontSize: 13, color: "var(--theme-muted)" }}>{stat.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
