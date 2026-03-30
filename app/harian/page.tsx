"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import AIRecommendation from "@/components/AIRecommendation";
import WelcomeAnimation from "@/components/WelcomeAnimation";
import { storage } from "@/lib/storage";
import { getDayName } from "@/lib/utils";
import type { Task, PlannerData } from "@/types";

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

export default function HarianPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [priorityTasks, setPriorityTasks] = useState<Task[]>([]);
  const [note, setNote] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTasks = storage.get<Task[]>("daily-tasks") ?? [];
    const savedPriority = storage.get<Task[]>("daily-priority") ?? [];
    const savedNote = storage.get<string>("daily-note") ?? "";
    setTasks(savedTasks);
    setPriorityTasks(savedPriority);
    setNote(savedNote);
  }, []);

  useEffect(() => { if (!mounted) return; storage.set("daily-tasks", tasks); }, [tasks, mounted]);
  useEffect(() => { if (!mounted) return; storage.set("daily-priority", priorityTasks); }, [priorityTasks, mounted]);

  const handleNoteChange = (value: string) => {
    setNote(value);
    storage.set("daily-note", value);
  };

  const today = new Date();
  const dayName = getDayName(today);
  const dateStr = today.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const hour = today.getHours();
  const greeting = hour < 10 ? "Pagi" : hour < 15 ? "Siang" : hour < 18 ? "Sore" : "Malam";

  const plannerData: PlannerData = {
    tasks: {
      pending: [...tasks, ...priorityTasks].filter(t => !t.done).map(t => t.text),
      done: [...tasks, ...priorityTasks].filter(t => t.done).map(t => t.text),
    },
    habits: [],
    goals: [],
    context: {
      day: `${dayName}, ${dateStr}`,
      time: today.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      focusAreas: ["Produktivitas Harian"],
    },
  };

  const completedCount = [...tasks, ...priorityTasks].filter(t => t.done).length;
  const totalCount = tasks.length + priorityTasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="page-wrapper">
      <WelcomeAnimation name={session?.user?.name} />
      <Sidebar />
      <main className="page-main">

        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "var(--theme-muted)", marginBottom: 6, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
            {dayName}, {dateStr}
          </div>
          <h1 style={{ margin: "0 0 6px", fontFamily: '"DM Serif Display", serif', fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 400, color: "var(--theme-ink)", letterSpacing: "-0.5px" }}>
            Selamat {greeting}! ☀️
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "var(--theme-muted)" }}>
            Rencana harian — tetap fokus dan selesaikan satu per satu.
          </p>

          {/* Progress bar */}
          {totalCount > 0 && (
            <div style={{ marginTop: 20, maxWidth: 420 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "var(--theme-muted)", fontWeight: 500 }}>
                  {completedCount}/{totalCount} tugas selesai
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--theme-accent)" }}>
                  {progressPct}%
                </span>
              </div>
              <div style={{ height: 6, background: "var(--theme-surface-2)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${progressPct}%`,
                  background: "linear-gradient(90deg, var(--theme-accent-2), var(--theme-accent))",
                  borderRadius: 99, transition: "width 0.5s ease",
                  boxShadow: "0 0 8px rgba(52,211,153,0.4)",
                }} />
              </div>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="responsive-two-col">
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={card}>
              <h2 style={cardTitle}>
                <span style={{ fontSize: 18 }}>🔥</span> Prioritas Utama
              </h2>
              <TaskList tasks={priorityTasks} onUpdate={setPriorityTasks} title="" placeholder="Tambah prioritas utama hari ini..." showPriority={true} accentColor="var(--theme-coral)" />
            </div>

            <div style={card}>
              <h2 style={cardTitle}>
                <span style={{ fontSize: 18 }}>📋</span> Daftar Tugas
              </h2>
              <TaskList tasks={tasks} onUpdate={setTasks} title="" placeholder="Tambah tugas hari ini..." accentColor="var(--theme-accent)" />
            </div>

            <div style={card}>
              <h2 style={cardTitle}>
                <span style={{ fontSize: 18 }}>📝</span> Catatan Bebas
              </h2>
              <textarea
                value={note}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Tulis catatan, refleksi, atau ide bebas di sini..."
                rows={6}
                style={{
                  width: "100%",
                  background: "var(--theme-surface-2)",
                  border: "1px solid var(--theme-border)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  fontSize: 14,
                  color: "var(--theme-ink)",
                  resize: "vertical" as const,
                  outline: "none",
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1.7,
                  boxSizing: "border-box" as const,
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--theme-accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--theme-border)")}
              />
              <div style={{ fontSize: 11, color: "var(--theme-muted)", marginTop: 8, textAlign: "right" as const }}>
                {note.length} karakter · Tersimpan otomatis
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 32 }}>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 14, padding: "18px 16px", textAlign: "center" as const }}>
                <div style={{ fontSize: 32, fontFamily: '"DM Serif Display", serif', fontWeight: 400, color: "var(--theme-ink)" }}>{completedCount}</div>
                <div style={{ fontSize: 12, color: "var(--theme-muted)", marginTop: 4, fontWeight: 500 }}>Selesai</div>
              </div>
              <div style={{ background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.2)", borderRadius: 14, padding: "18px 16px", textAlign: "center" as const }}>
                <div style={{ fontSize: 32, fontFamily: '"DM Serif Display", serif', fontWeight: 400, color: "var(--theme-ink)" }}>{totalCount - completedCount}</div>
                <div style={{ fontSize: 12, color: "var(--theme-muted)", marginTop: 4, fontWeight: 500 }}>Pending</div>
              </div>
            </div>

            {/* AI Recommendation */}
            <AIRecommendation plannerData={plannerData} />
          </div>
        </div>
      </main>
    </div>
  );
}
