"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { Task } from "@/types";

interface CommandItem {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  action: () => void;
  category: "tugas" | "navigasi" | "aksi";
  keywords?: string;
}

// SVG Icons
const NavIcons = {
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  harian: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  target: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  habit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  focus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  analitik: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
};

function parseQuickTask(raw: string): { text: string; priority?: "high" | "medium" | "low" } {
  let clean = raw.trim();
  if (clean.startsWith("+") || clean.startsWith("t:")) {
    clean = clean.replace(/^[+t:]\s*/, "");
  }

  let priority: "high" | "medium" | "low" | undefined;
  if (/!(high|tinggi|urgent)\b/i.test(clean)) {
    priority = "high";
    clean = clean.replace(/!(high|tinggi|urgent)\b/i, "");
  } else if (/!(med|medium|sedang)\b/i.test(clean)) {
    priority = "medium";
    clean = clean.replace(/!(med|medium|sedang)\b/i, "");
  } else if (/!(low|rendah)\b/i.test(clean)) {
    priority = "low";
    clean = clean.replace(/!(low|rendah)\b/i, "");
  }

  return { text: clean.trim().replace(/\s+/g, " "), priority };
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleQuickAddTask = useCallback((raw: string) => {
    const { text, priority } = parseQuickTask(raw);
    if (!text) return;

    const currentTasks = storage.get<Task[]>("daily-tasks") || [];
    const newTask: Task = {
      id: generateId(),
      text,
      done: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    storage.set("daily-tasks", [...currentTasks, newTask]);
    window.dispatchEvent(new CustomEvent("task-added", { detail: newTask }));
  }, []);

  const baseCommands: CommandItem[] = useMemo(() => [
    // Navigation
    { id: "dashboard", label: "Dashboard", desc: "Overview & progres", icon: NavIcons.dashboard, action: () => router.push("/dashboard"), category: "navigasi", keywords: "home beranda utama" },
    { id: "harian", label: "Harian", desc: "Tugas & prioritas hari ini", icon: NavIcons.harian, action: () => router.push("/harian"), category: "navigasi", keywords: "daily tugas hari to-do" },
    { id: "mingguan", label: "Mingguan", desc: "Rencana minggu ini", icon: NavIcons.calendar, action: () => router.push("/mingguan"), category: "navigasi", keywords: "weekly minggu kalender" },
    { id: "bulanan", label: "Bulanan", desc: "Target bulan ini", icon: NavIcons.calendar, action: () => router.push("/bulanan"), category: "navigasi", keywords: "monthly bulan target" },
    { id: "tahunan", label: "Tahunan", desc: "Goals besar tahun ini", icon: NavIcons.target, action: () => router.push("/tahunan"), category: "navigasi", keywords: "yearly tahun goals resolusi" },
    { id: "habit", label: "Habit Tracker", desc: "Lacak kebiasaan & streak", icon: NavIcons.habit, action: () => router.push("/habit"), category: "navigasi", keywords: "kebiasaan streak habit" },
    { id: "fokus", label: "Focus Timer", desc: "Pomodoro & Deep Work", icon: NavIcons.focus, action: () => router.push("/fokus"), category: "navigasi", keywords: "timer pomodoro fokus deep work" },
    { id: "analitik", label: "Analitik", desc: "Statistik produktivitas", icon: NavIcons.analitik, action: () => router.push("/analitik"), category: "navigasi", keywords: "stats statistik grafik" },
    // Actions
    {
      id: "export", label: "Export Data Backup", desc: "Unduh backup JSON data planner", icon: NavIcons.download, category: "aksi", keywords: "backup unduh download simpan",
      action: () => {
        const data: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) data[key] = localStorage.getItem(key) || "";
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
    },
  ], [router]);

  // Dynamic commands list with Quick Add option
  const allItems = useMemo(() => {
    const trimmed = query.trim();
    const items: CommandItem[] = [];

    // If typing text, offer instant task creation as top item
    if (trimmed.length > 1) {
      const { text, priority } = parseQuickTask(trimmed);
      if (text) {
        items.push({
          id: "quick-add-task",
          label: `Tambah Tugas: "${text}"`,
          desc: priority ? `Prioritas: ${priority.toUpperCase()} • Tambah ke Harian` : "Simpan langsung ke rencana harian",
          icon: NavIcons.plus,
          category: "tugas",
          action: () => {
            handleQuickAddTask(trimmed);
          },
        });
      }
    }

    // Filtered navigation & action commands
    const q = trimmed.toLowerCase();
    const filteredBase = trimmed
      ? baseCommands.filter((c) =>
          c.label.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          (c.keywords?.toLowerCase().includes(q) ?? false)
        )
      : baseCommands;

    return [...items, ...filteredBase];
  }, [query, baseCommands, handleQuickAddTask]);

  // Keyboard listener for opening/closing
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected into view
  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, allItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          allItems[selectedIndex].action();
          setOpen(false);
        }
      }
    },
    [allItems, selectedIndex]
  );

  if (!open) return null;

  const taskItems = allItems.filter((c) => c.category === "tugas");
  const navItems = allItems.filter((c) => c.category === "navigasi");
  const actionItems = allItems.filter((c) => c.category === "aksi");

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          animation: "cmdFadeIn 0.1s ease-out",
        }}
      />

      {/* Palette Box */}
      <div
        style={{
          position: "fixed",
          top: "16%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(560px, 92vw)",
          background: "var(--theme-surface)",
          border: "1px solid var(--theme-border)",
          borderRadius: 14,
          boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
          zIndex: 10000,
          overflow: "hidden",
          animation: "cmdSlideIn 0.12s ease-out",
        }}
      >
        {/* Search Input Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 16px",
          borderBottom: "1px solid var(--theme-border)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--theme-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik tugas untuk menambah atau cari halaman..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 14,
              color: "var(--theme-ink)",
              fontFamily: "inherit",
            }}
          />
          <kbd style={{
            padding: "2px 6px",
            background: "var(--theme-surface-2)",
            border: "1px solid var(--theme-border)",
            borderRadius: 5,
            fontSize: 10.5,
            color: "var(--theme-muted)",
            fontWeight: 600,
          }}>ESC</kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} style={{ maxHeight: 360, overflowY: "auto", padding: "6px" }}>
          {allItems.length === 0 && (
            <div style={{ padding: "28px 16px", textAlign: "center", color: "var(--theme-muted)", fontSize: 13 }}>
              Tidak ditemukan untuk &quot;{query}&quot;
            </div>
          )}

          {/* Quick Task Section */}
          {taskItems.map((item) => {
            const idx = allItems.indexOf(item);
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.id}
                data-index={idx}
                onClick={() => { item.action(); setOpen(false); }}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  background: isSelected ? "var(--theme-surface-2)" : "transparent",
                  border: `1px solid ${isSelected ? "var(--theme-accent)" : "rgba(16,185,129,0.2)"}`,
                  borderRadius: 9,
                  cursor: "pointer",
                  marginBottom: 6,
                  textAlign: "left",
                  transition: "all 0.08s",
                  fontFamily: "inherit",
                }}
              >
                <div style={{
                  width: 30, height: 30,
                  borderRadius: 7,
                  background: "rgba(16,185,129,0.15)",
                  color: "var(--theme-accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--theme-ink)" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "var(--theme-accent)", marginTop: 1 }}>{item.desc}</div>
                </div>
                <kbd style={{ padding: "2px 6px", background: "rgba(16,185,129,0.15)", borderRadius: 4, fontSize: 10, color: "var(--theme-accent)", fontWeight: 700 }}>↵ Enter</kbd>
              </button>
            );
          })}

          {/* Navigation Section */}
          {navItems.length > 0 && (
            <>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--theme-muted)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 12px 3px" }}>
                Navigasi Halaman
              </div>
              {navItems.map((item) => {
                const idx = allItems.indexOf(item);
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    data-index={idx}
                    onClick={() => { item.action(); setOpen(false); }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 12px",
                      background: isSelected ? "var(--theme-surface-2)" : "transparent",
                      border: isSelected ? "1px solid var(--theme-border-2)" : "1px solid transparent",
                      borderRadius: 8,
                      cursor: "pointer",
                      marginBottom: 1,
                      textAlign: "left",
                      transition: "all 0.08s",
                      fontFamily: "inherit",
                    }}
                  >
                    <div style={{
                      width: 28, height: 28,
                      borderRadius: 7,
                      background: isSelected ? "rgba(255,255,255,0.06)" : "transparent",
                      border: "1px solid var(--theme-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isSelected ? "var(--theme-ink)" : "var(--theme-muted)",
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: isSelected ? "var(--theme-ink)" : "var(--theme-ink-2)" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "var(--theme-muted)" }}>{item.desc}</div>
                    </div>
                    {isSelected && (
                      <kbd style={{ padding: "1px 5px", background: "var(--theme-surface-3)", border: "1px solid var(--theme-border)", borderRadius: 4, fontSize: 10, color: "var(--theme-ink-2)" }}>↵</kbd>
                    )}
                  </button>
                );
              })}
            </>
          )}

          {/* Action Section */}
          {actionItems.length > 0 && (
            <>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--theme-muted)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 12px 3px" }}>
                Aksi & Utilitas
              </div>
              {actionItems.map((item) => {
                const idx = allItems.indexOf(item);
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    data-index={idx}
                    onClick={() => { item.action(); setOpen(false); }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 12px",
                      background: isSelected ? "var(--theme-surface-2)" : "transparent",
                      border: isSelected ? "1px solid var(--theme-border-2)" : "1px solid transparent",
                      borderRadius: 8,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.08s",
                      fontFamily: "inherit",
                    }}
                  >
                    <div style={{
                      width: 28, height: 28,
                      borderRadius: 7,
                      background: isSelected ? "rgba(255,255,255,0.06)" : "transparent",
                      border: "1px solid var(--theme-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isSelected ? "var(--theme-ink)" : "var(--theme-muted)",
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: isSelected ? "var(--theme-ink)" : "var(--theme-ink-2)" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "var(--theme-muted)" }}>{item.desc}</div>
                    </div>
                    {isSelected && (
                      <kbd style={{ padding: "1px 5px", background: "var(--theme-surface-3)", border: "1px solid var(--theme-border)", borderRadius: 4, fontSize: 10, color: "var(--theme-ink-2)" }}>↵</kbd>
                    )}
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Footer Hint */}
        <div style={{
          borderTop: "1px solid var(--theme-border)",
          padding: "9px 16px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 11,
          color: "var(--theme-muted)",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <kbd style={{ padding: "1px 4px", background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 3, fontSize: 10 }}>↑↓</kbd> navigasi
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <kbd style={{ padding: "1px 4px", background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 3, fontSize: 10 }}>↵</kbd> pilih / tambah
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <kbd style={{ padding: "1px 4px", background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 3, fontSize: 10 }}>esc</kbd> tutup
          </span>
        </div>
      </div>

      <style>{`
        @keyframes cmdFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cmdSlideIn { from { opacity: 0; transform: translateX(-50%) translateY(-6px) scale(0.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
      `}</style>
    </>
  );
}
