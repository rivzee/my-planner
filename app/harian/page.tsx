"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import { Icons } from "@/components/Icons";
import AIRecommendation from "@/components/AIRecommendation";
import AITaskPrioritizer from "@/components/AITaskPrioritizer";

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

  const handleNoteChange = useCallback((value: string) => {
    setNote(value);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      storage.set("daily-note", note);
    }, 500);
    return () => clearTimeout(t);
  }, [note, mounted]);

  const handleAddPriority = useCallback((text: string) => {
    if (!priorityTasks.some(t => t.text === text) && !tasks.some(t => t.text === text)) {
      setPriorityTasks(prev => [...prev, {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text,
        done: false,
        priority: "high",
        createdAt: new Date().toISOString()
      }]);
    }
  }, [priorityTasks, tasks]);

  const handleAddTask = useCallback((text: string) => {
    if (!priorityTasks.some(t => t.text === text) && !tasks.some(t => t.text === text)) {
      setTasks(prev => [...prev, {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text,
        done: false,
        priority: "medium", // Default for regular task
        createdAt: new Date().toISOString()
      }]);
    }
  }, [priorityTasks, tasks]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0]; // Just as a dependency boundary if needed, though today won't change
  }, []);

  const { dayName, dateStr, greeting, plannerData } = useMemo(() => {
    const d = new Date();
    const dName = getDayName(d);
    const dStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const h = d.getHours();
    const greet = h < 10 ? "Pagi" : h < 15 ? "Siang" : h < 18 ? "Sore" : "Malam";
    
    const pData: PlannerData = {
      tasks: {
        pending: [...tasks, ...priorityTasks].filter(t => !t.done).map(t => t.text),
        done: [...tasks, ...priorityTasks].filter(t => t.done).map(t => t.text),
      },
      habits: [],
      goals: [],
      context: {
        day: `${dName}, ${dStr}`,
        time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        focusAreas: ["Produktivitas Harian"],
      },
    };
    return { dayName: dName, dateStr: dStr, greeting: greet, plannerData: pData };
  }, [tasks, priorityTasks, todayStr]);

  const completedCount = useMemo(() => [...tasks, ...priorityTasks].filter(t => t.done).length, [tasks, priorityTasks]);
  const totalCount = useMemo(() => tasks.length + priorityTasks.length, [tasks, priorityTasks]);
  const progressPct = useMemo(() => totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0, [totalCount, completedCount]);

  return (
    <div className="page-wrapper">

      <Sidebar />
      <main className="page-main">

        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "var(--theme-muted)", marginBottom: 6, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
            {dayName}, {dateStr}
          </div>
          <h1 style={{ margin: "0 0 6px", fontFamily: '"DM Serif Display", serif', fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 400, color: "var(--theme-ink)", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 10 }}>
            <Icons.Sun size={28} style={{ color: "var(--theme-ink-2)", opacity: 0.4 }} />
            Selamat {greeting}.
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
                <Icons.Flame size={15} style={{ color: "var(--theme-ink-2)", opacity: 0.5 }} />
                Prioritas Utama
              </h2>
              <TaskList tasks={priorityTasks} onUpdate={setPriorityTasks} title="" placeholder="Tambah prioritas utama hari ini..." showPriority={true} accentColor="var(--theme-coral)" />
            </div>

            <div style={card}>
              <h2 style={cardTitle}>
                <Icons.List size={15} style={{ color: "var(--theme-ink-2)", opacity: 0.5 }} />
                Daftar Tugas
              </h2>
              <TaskList tasks={tasks} onUpdate={setTasks} title="" placeholder="Tambah tugas hari ini..." accentColor="var(--theme-accent)" />
            </div>

            <div style={card}>
              <h2 style={cardTitle}>
                <Icons.Edit size={15} style={{ color: "var(--theme-ink-2)", opacity: 0.5 }} />
                Catatan Bebas
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

            {/* AI Task Prioritizer */}
            <AITaskPrioritizer
              priorityTasks={priorityTasks}
              regularTasks={tasks}
            />

            {/* AI Recommendation */}
            <AIRecommendation 
              plannerData={plannerData} 
              onAddPriority={handleAddPriority} 
              onAddTask={handleAddTask}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
