"use client";

import { useState, useCallback, useMemo, useRef, useEffect, memo } from "react";
import { generateId } from "@/lib/utils";
import type { Task } from "@/types";
import { Icons } from "@/components/Icons";

interface TaskListProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
  title?: string;
  placeholder?: string;
  showPriority?: boolean;
  accentColor?: string;
}

const priorityColors: Record<string, { text: string; bg: string; border: string; label: string }> = {
  high:   { text: "#FB7185", bg: "rgba(251,113,133,0.1)",  border: "rgba(251,113,133,0.25)", label: "Tinggi" },
  medium: { text: "#FBBF24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)", label: "Sedang" },
  low:    { text: "#34D399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)", label: "Rendah" },
};

function parseTaskInput(raw: string, defaultPriority: "high" | "medium" | "low" = "medium") {
  let text = raw;
  let priority = defaultPriority;

  // Check priority flag
  if (/(?:^|\s)!(high|tinggi|urgent)\b/i.test(text)) {
    priority = "high";
    text = text.replace(/(?:^|\s)!(high|tinggi|urgent)\b/i, "");
  } else if (/(?:^|\s)!(med|medium|sedang)\b/i.test(text)) {
    priority = "medium";
    text = text.replace(/(?:^|\s)!(med|medium|sedang)\b/i, "");
  } else if (/(?:^|\s)!(low|rendah|santai)\b/i.test(text)) {
    priority = "low";
    text = text.replace(/(?:^|\s)!(low|rendah|santai)\b/i, "");
  }

  return {
    cleanedText: text.trim().replace(/\s+/g, " "),
    priority,
  };
}

function TaskList({
  tasks,
  onUpdate,
  title = "Tugas",
  placeholder = "Tambah tugas... ketik !high atau #tag",
  showPriority = false,
  accentColor = "var(--theme-accent)",
}: TaskListProps) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pendingTasks = useMemo(() => tasks.filter((t) => !t.done), [tasks]);
  const doneTasks = useMemo(() => tasks.filter((t) => t.done), [tasks]);

  const addTask = useCallback(() => {
    if (!input.trim()) return;
    const parsed = parseTaskInput(input, priority);
    if (!parsed.cleanedText) return;

    const newTask: Task = {
      id: generateId(),
      text: parsed.cleanedText,
      done: false,
      priority: showPriority ? parsed.priority : undefined,
      createdAt: new Date().toISOString(),
    };

    onUpdate([...tasks, newTask]);
    setInput("");
    setSelectedIndex(-1);
  }, [input, priority, showPriority, tasks, onUpdate]);

  const toggleTask = useCallback((id: string) => {
    onUpdate(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, [tasks, onUpdate]);

  const deleteTask = useCallback((id: string) => {
    onUpdate(tasks.filter((t) => t.id !== id));
    setSelectedIndex(-1);
  }, [tasks, onUpdate]);

  // Keyboard navigation (j/k, x, d, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in input or other fields
      const isInputFocused = document.activeElement === inputRef.current ||
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";

      if (e.key === "/" && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      if (isInputFocused) {
        if (e.key === "Escape") {
          inputRef.current?.blur();
        }
        return;
      }

      if (pendingTasks.length === 0) return;

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < pendingTasks.length - 1 ? prev + 1 : 0));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : pendingTasks.length - 1));
      } else if (e.key === "x" || e.key === " ") {
        if (selectedIndex >= 0 && selectedIndex < pendingTasks.length) {
          e.preventDefault();
          toggleTask(pendingTasks[selectedIndex].id);
          if (selectedIndex >= pendingTasks.length - 1) {
            setSelectedIndex(Math.max(0, pendingTasks.length - 2));
          }
        }
      } else if (e.key === "d" || e.key === "Delete") {
        if (selectedIndex >= 0 && selectedIndex < pendingTasks.length) {
          e.preventDefault();
          deleteTask(pendingTasks[selectedIndex].id);
        }
      } else if (e.key === "Escape") {
        setSelectedIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pendingTasks, selectedIndex, toggleTask, deleteTask]);

  return (
    <div ref={containerRef} style={{ outline: "none" }}>
      {/* ── Header ── */}
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "var(--theme-ink)" }}>{title}</h3>
            <span style={{
              fontSize: 11,
              background: "rgba(255,255,255,0.05)",
              color: "var(--theme-ink-2)",
              border: "1px solid var(--theme-border)",
              padding: "1px 7px",
              borderRadius: 6,
              fontWeight: 500,
            }}>
              {pendingTasks.length} pending
            </span>
          </div>

          <div style={{ fontSize: 11, color: "var(--theme-muted)", display: "flex", alignItems: "center", gap: 6 }}>
            <span>Navigasi</span>
            <kbd style={{ fontSize: 9.5, padding: "1px 5px", background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 4, color: "var(--theme-ink-2)" }}>j/k</kbd>
            <kbd style={{ fontSize: 9.5, padding: "1px 5px", background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 4, color: "var(--theme-ink-2)" }}>x</kbd>
          </div>
        </div>
      )}

      {/* ── Input row ── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--theme-surface-2)",
          border: "1px solid var(--theme-border)",
          borderRadius: 10,
          padding: "4px 6px 4px 12px",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--theme-border-2)";
          e.currentTarget.style.boxShadow = "0 0 0 1px var(--theme-border-2)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--theme-border)";
          e.currentTarget.style.boxShadow = "none";
        }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder={placeholder}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 13.5,
              color: "var(--theme-ink)",
              fontFamily: "inherit",
              padding: "6px 0",
            }}
          />

          {showPriority && (
            <div style={{ display: "flex", gap: 4 }}>
              {(["low", "medium", "high"] as const).map((p) => {
                const isSelected = priority === p;
                const conf = priorityColors[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    style={{
                      background: isSelected ? conf.bg : "transparent",
                      border: `1px solid ${isSelected ? conf.border : "transparent"}`,
                      borderRadius: 6,
                      padding: "3px 7px",
                      fontSize: 10.5,
                      fontWeight: 500,
                      color: isSelected ? conf.text : "var(--theme-muted)",
                      cursor: "pointer",
                      transition: "all 0.12s ease",
                      lineHeight: 1.2,
                    }}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={addTask}
            disabled={!input.trim()}
            style={{
              background: input.trim() ? "var(--theme-accent)" : "rgba(255,255,255,0.05)",
              color: input.trim() ? "#052e16" : "var(--theme-muted)",
              border: "none",
              borderRadius: 7,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: input.trim() ? "pointer" : "not-allowed",
              transition: "all 0.15s ease",
              fontFamily: "inherit",
            }}
          >
            Tambah
          </button>
        </div>

        {/* Quick Helper Hint */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5, padding: "0 2px", fontSize: 10.5, color: "var(--theme-muted)" }}>
          <span>Tips: Ketik <code style={{ color: "var(--theme-ink-2)" }}>!high</code> untuk prioritas tinggi, tekan <code style={{ color: "var(--theme-ink-2)" }}>/</code> untuk tambah cepat.</span>
        </div>
      </div>

      {/* ── Pending Tasks ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {pendingTasks.map((task, idx) => {
          const isSelected = idx === selectedIndex;
          const prio = task.priority ? priorityColors[task.priority] : null;

          return (
            <div
              key={task.id}
              onClick={() => setSelectedIndex(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                background: isSelected ? "var(--theme-surface-3)" : "var(--theme-surface)",
                border: isSelected ? "1px solid var(--theme-border-2)" : "1px solid var(--theme-border)",
                borderLeft: isSelected ? "2px solid var(--theme-accent)" : "1px solid var(--theme-border)",
                borderRadius: 8,
                transition: "all 0.1s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = "var(--theme-surface-2)";
                  e.currentTarget.style.borderColor = "var(--theme-border-2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = "var(--theme-surface)";
                  e.currentTarget.style.borderColor = "var(--theme-border)";
                }
              }}
            >
              {/* Tactile Checkbox */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTask(task.id);
                }}
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: 5,
                  border: "1.5px solid var(--theme-border-2)",
                  background: "transparent",
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--theme-accent)";
                  e.currentTarget.style.background = "rgba(16,185,129,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--theme-border-2)";
                  e.currentTarget.style.background = "transparent";
                }}
              />

              {/* Priority badge if any */}
              {prio && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: prio.text,
                  background: prio.bg,
                  border: `1px solid ${prio.border}`,
                  padding: "1px 6px",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                }}>
                  {prio.label}
                </span>
              )}

              {/* Task text */}
              <span style={{
                flex: 1,
                fontSize: 13.5,
                color: "var(--theme-ink)",
                lineHeight: 1.4,
              }}>
                {task.text}
              </span>

              {/* Delete button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
                title="Hapus (d)"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--theme-muted)",
                  fontSize: 15,
                  padding: "2px 4px",
                  lineHeight: 1,
                  borderRadius: 4,
                  opacity: isSelected ? 1 : 0.4,
                  transition: "all 0.12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.color = "var(--theme-coral)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = isSelected ? "1" : "0.4";
                  e.currentTarget.style.color = "var(--theme-muted)";
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Done Tasks ── */}
      {doneTasks.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{
            fontSize: 10,
            color: "var(--theme-muted)",
            fontWeight: 600,
            letterSpacing: "0.06em",
            marginBottom: 6,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span>Selesai</span>
            <span style={{ opacity: 0.6 }}>({doneTasks.length})</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {doneTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 12px",
                  background: "var(--theme-surface)",
                  border: "1px solid var(--theme-border)",
                  borderRadius: 7,
                  opacity: 0.55,
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "0.55"}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: 5,
                    border: "1.5px solid var(--theme-accent)",
                    background: "var(--theme-accent)",
                    cursor: "pointer",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#052e16",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </button>
                <span style={{
                  flex: 1,
                  fontSize: 13,
                  color: "var(--theme-muted)",
                  textDecoration: "line-through",
                  lineHeight: 1.4,
                }}>
                  {task.text}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--theme-muted)",
                    fontSize: 14,
                    padding: "2px 4px",
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div style={{ textAlign: "center", padding: "24px 0", color: "var(--theme-muted)", fontSize: 13 }}>
          <Icons.FileText size={28} style={{ margin: "0 auto 8px", display: "block", opacity: 0.3, color: "var(--theme-ink-2)" }} />
          Tidak ada tugas. Ketik di atas atau tekan <code style={{ color: "var(--theme-ink-2)" }}>/</code> untuk menambah.
        </div>
      )}
    </div>
  );
}

export default memo(TaskList);
