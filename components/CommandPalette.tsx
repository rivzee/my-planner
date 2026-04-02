"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  action: () => void;
  category: "navigasi" | "aksi";
  keywords?: string;
}

// SVG Icons
const NavIcons = {
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  harian: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  target: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  habit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  focus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  analitik: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const commands: CommandItem[] = [
    // Navigation
    { id: "dashboard", label: "Dashboard", desc: "Overview & progres", icon: NavIcons.dashboard, action: () => router.push("/dashboard"), category: "navigasi", keywords: "home beranda utama" },
    { id: "harian", label: "Harian", desc: "Tugas & prioritas hari ini", icon: NavIcons.harian, action: () => router.push("/harian"), category: "navigasi", keywords: "daily tugas hari" },
    { id: "mingguan", label: "Mingguan", desc: "Rencana minggu ini", icon: NavIcons.calendar, action: () => router.push("/mingguan"), category: "navigasi", keywords: "weekly minggu" },
    { id: "bulanan", label: "Bulanan", desc: "Target bulan ini", icon: NavIcons.edit, action: () => router.push("/bulanan"), category: "navigasi", keywords: "monthly bulan target" },
    { id: "tahunan", label: "Tahunan", desc: "Goals besar tahun ini", icon: NavIcons.target, action: () => router.push("/tahunan"), category: "navigasi", keywords: "yearly tahun goals resolusi" },
    { id: "habit", label: "Habit Tracker", desc: "Lacak kebiasaanmu", icon: NavIcons.habit, action: () => router.push("/habit"), category: "navigasi", keywords: "kebiasaan streak" },
    { id: "fokus", label: "Focus Timer", desc: "Pomodoro & Deep Work", icon: NavIcons.focus, action: () => router.push("/fokus"), category: "navigasi", keywords: "timer pomodoro fokus" },
    { id: "analitik", label: "Analitik", desc: "Statistik produktivitas", icon: NavIcons.analitik, action: () => router.push("/analitik"), category: "navigasi", keywords: "stats statistik grafik" },
    // Actions
    {
      id: "export", label: "Export Data", desc: "Unduh backup data planner", icon: NavIcons.download, category: "aksi", keywords: "backup unduh download simpan",
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
        a.download = `rivanzee-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
    },
  ];

  const filtered = query.trim()
    ? commands.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.label.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          (c.keywords?.toLowerCase().includes(q) ?? false)
        );
      })
    : commands;

  const navItems = filtered.filter((c) => c.category === "navigasi");
  const actionItems = filtered.filter((c) => c.category === "aksi");
  const allItems = [...navItems, ...actionItems];

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selected index when query changes
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

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          zIndex: 9999,
          animation: "cmdFadeIn 0.12s ease-out",
        }}
      />

      {/* Palette */}
      <div
        style={{
          position: "fixed",
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(560px, 92vw)",
          background: "var(--theme-surface)",
          border: "1px solid var(--theme-border)",
          borderRadius: 16,
          boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
          zIndex: 10000,
          overflow: "hidden",
          animation: "cmdSlideIn 0.15s ease-out",
        }}
      >
        {/* Search Input */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--theme-border)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--theme-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari halaman atau aksi..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 15,
              color: "var(--theme-ink)",
              fontFamily: "inherit",
            }}
          />
          <kbd style={{
            padding: "3px 8px",
            background: "var(--theme-surface-2)",
            border: "1px solid var(--theme-border)",
            borderRadius: 6,
            fontSize: 11,
            color: "var(--theme-muted)",
            fontFamily: "inherit",
            fontWeight: 600,
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: 360, overflowY: "auto", padding: "6px" }}>
          {allItems.length === 0 && (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--theme-muted)", fontSize: 13 }}>
              Tidak ditemukan hasil untuk &quot;{query}&quot;
            </div>
          )}

          {navItems.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--theme-muted)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 12px 4px" }}>
                Navigasi
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
                      padding: "10px 12px",
                      background: isSelected ? "var(--theme-surface-2)" : "transparent",
                      border: isSelected ? "1px solid var(--theme-border)" : "1px solid transparent",
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "all 0.08s",
                      fontFamily: "inherit",
                      textAlign: "left",
                    }}
                  >
                    <div style={{
                      width: 34, height: 34,
                      borderRadius: 9,
                      background: isSelected ? "rgba(52,211,153,0.1)" : "var(--theme-surface-2)",
                      border: "1px solid var(--theme-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isSelected ? "var(--theme-accent)" : "var(--theme-muted)",
                      flexShrink: 0,
                      transition: "all 0.08s",
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "var(--theme-ink)" : "var(--theme-ink-2)" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "var(--theme-muted)", marginTop: 1 }}>{item.desc}</div>
                    </div>
                    {isSelected && (
                      <kbd style={{ padding: "2px 6px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 5, fontSize: 10, color: "var(--theme-accent)", fontWeight: 700 }}>↵</kbd>
                    )}
                  </button>
                );
              })}
            </>
          )}

          {actionItems.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--theme-muted)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 12px 4px" }}>
                Aksi
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
                      padding: "10px 12px",
                      background: isSelected ? "var(--theme-surface-2)" : "transparent",
                      border: isSelected ? "1px solid var(--theme-border)" : "1px solid transparent",
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "all 0.08s",
                      fontFamily: "inherit",
                      textAlign: "left",
                    }}
                  >
                    <div style={{
                      width: 34, height: 34,
                      borderRadius: 9,
                      background: isSelected ? "rgba(52,211,153,0.1)" : "var(--theme-surface-2)",
                      border: "1px solid var(--theme-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isSelected ? "var(--theme-accent)" : "var(--theme-muted)",
                      flexShrink: 0,
                      transition: "all 0.08s",
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "var(--theme-ink)" : "var(--theme-ink-2)" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "var(--theme-muted)", marginTop: 1 }}>{item.desc}</div>
                    </div>
                    {isSelected && (
                      <kbd style={{ padding: "2px 6px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 5, fontSize: 10, color: "var(--theme-accent)", fontWeight: 700 }}>↵</kbd>
                    )}
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          borderTop: "1px solid var(--theme-border)",
          padding: "10px 18px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 11,
          color: "var(--theme-muted)",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <kbd style={{ padding: "1px 5px", background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>↑</kbd>
            <kbd style={{ padding: "1px 5px", background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>↓</kbd>
            navigasi
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <kbd style={{ padding: "1px 5px", background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>↵</kbd>
            pilih
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <kbd style={{ padding: "1px 5px", background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>esc</kbd>
            tutup
          </span>
        </div>
      </div>

      <style>{`
        @keyframes cmdFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cmdSlideIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
