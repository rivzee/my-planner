"use client";

import { useState } from "react";
import { generateId } from "@/lib/utils";
import type { Task } from "@/types";
import { addXP } from "@/lib/storage";

interface TaskListProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
  title?: string;
  placeholder?: string;
  showPriority?: boolean;
  accentColor?: string;
}

const priorityColors: Record<string, string> = {
  high:   "var(--theme-coral)",
  medium: "var(--theme-amber)",
  low:    "var(--theme-accent)",
};

const priorityLabels: Record<string, string> = {
  high:   "Tinggi",
  medium: "Sedang",
  low:    "Rendah",
};

export default function TaskList({
  tasks,
  onUpdate,
  title = "Tugas",
  placeholder = "Tambah tugas baru...",
  showPriority = false,
  accentColor = "var(--theme-accent)",
}: TaskListProps) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: generateId(),
      text: input.trim(),
      done: false,
      priority: showPriority ? priority : undefined,
      createdAt: new Date().toISOString(),
    };
    onUpdate([...tasks, newTask]);
    setInput("");
  };

  const toggleTask = (id: string) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;
    const isDone = tasks[taskIndex].done;
    addXP(isDone ? -10 : 10);
    onUpdate(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: string) => {
    onUpdate(tasks.filter((t) => t.id !== id));
  };

  const pendingTasks = tasks.filter((t) => !t.done);
  const doneTasks = tasks.filter((t) => t.done);

  return (
    <div>
      {title && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--theme-ink)" }}>{title}</h3>
          <span style={{
            fontSize: 11,
            background: `${accentColor}18`,
            color: accentColor,
            padding: "2px 8px",
            borderRadius: 20,
            fontWeight: 600,
          }}>
            {pendingTasks.length} pending
          </span>
        </div>
      )}

      {/* ── Input row ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {showPriority && (
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
            style={{
              background: "var(--theme-surface-2)",
              border: "1px solid var(--theme-border)",
              borderRadius: 8,
              padding: "8px 10px",
              fontSize: 12,
              color: "var(--theme-ink-2)",
              cursor: "pointer",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = accentColor}
            onBlur={e => e.target.style.borderColor = "var(--theme-border)"}
          >
            <option value="high">🔴 Tinggi</option>
            <option value="medium">🟡 Sedang</option>
            <option value="low">🟢 Rendah</option>
          </select>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: "var(--theme-surface-2)",
            border: "1px solid var(--theme-border)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 14,
            color: "var(--theme-ink)",
            outline: "none",
            transition: "border-color 0.15s",
            fontFamily: "inherit",
          }}
          onFocus={(e) => (e.target.style.borderColor = accentColor)}
          onBlur={(e) => (e.target.style.borderColor = "var(--theme-border)")}
        />
        <button
          onClick={addTask}
          style={{
            background: accentColor,
            color: accentColor === "var(--theme-accent)" ? "#052e16" : "white",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 16,
            cursor: "pointer",
            fontWeight: 700,
            transition: "opacity 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          +
        </button>
      </div>

      {/* ── Pending tasks ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {pendingTasks.map((task) => (
          <div
            key={task.id}
            className="animate-fade-in"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: "var(--theme-surface-2)",
              border: "1px solid var(--theme-border)",
              borderRadius: 10,
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--theme-border-2)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--theme-border)"}
          >
            <button
              onClick={() => toggleTask(task.id)}
              style={{
                width: 20, height: 20, borderRadius: 6,
                border: `2px solid ${accentColor}50`,
                background: "transparent",
                cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${accentColor}20`;
                e.currentTarget.style.borderColor = accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = `${accentColor}50`;
              }}
            />
            {showPriority && task.priority && (
              <span style={{
                fontSize: 10,
                background: `${priorityColors[task.priority]}18`,
                color: priorityColors[task.priority],
                padding: "2px 7px",
                borderRadius: 4,
                fontWeight: 600,
                whiteSpace: "nowrap" as const,
              }}>
                {priorityLabels[task.priority]}
              </span>
            )}
            <span style={{ flex: 1, fontSize: 14, color: "var(--theme-ink)" }}>{task.text}</span>
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                background: "none", border: "none",
                cursor: "pointer", color: "var(--theme-border-2)",
                fontSize: 18, padding: "0 2px", lineHeight: 1,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--theme-coral)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--theme-border-2)")}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* ── Done tasks ── */}
      {doneTasks.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 10, color: "var(--theme-muted)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 6, textTransform: "uppercase" as const }}>
            ✓ Selesai ({doneTasks.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {doneTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  background: "var(--theme-surface)",
                  border: "1px solid var(--theme-border)",
                  borderRadius: 8,
                  opacity: 0.55,
                }}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  style={{
                    width: 20, height: 20, borderRadius: 6,
                    border: `2px solid ${accentColor}`,
                    background: accentColor,
                    cursor: "pointer", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: accentColor === "var(--theme-accent)" ? "#052e16" : "white",
                    fontSize: 11,
                  }}
                >
                  ✓
                </button>
                <span style={{ flex: 1, fontSize: 13, color: "var(--theme-muted)", textDecoration: "line-through" }}>
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--theme-muted)", fontSize: 16, padding: "0 2px", lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div style={{ textAlign: "center", padding: "24px 0", color: "var(--theme-muted)", fontSize: 13 }}>
          Belum ada tugas. Tambahkan tugas pertamamu! 🚀
        </div>
      )}
    </div>
  );
}
