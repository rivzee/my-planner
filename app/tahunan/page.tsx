"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import GoalCard from "@/components/GoalCard";
import { storage } from "@/lib/storage";
import { generateId, getDaysUntilYearEnd, getYearProgress, getCategoryColor, getCategoryIcon, getCategoryLabel } from "@/lib/utils";
import type { Goal } from "@/types";

const CATEGORIES: Array<{ id: "karier" | "kesehatan" | "belajar" | "keuangan"; label: string }> = [
  { id: "karier", label: "Karier" },
  { id: "kesehatan", label: "Kesehatan" },
  { id: "belajar", label: "Belajar" },
  { id: "keuangan", label: "Keuangan" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--theme-surface-2)",
  border: "1px solid var(--theme-border)",
  borderRadius: 8, padding: "10px 12px",
  fontSize: 14, color: "var(--theme-ink)",
  outline: "none", boxSizing: "border-box" as const,
  fontFamily: "inherit", transition: "border-color 0.2s",
};

export default function TahunanPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "karier" as "karier"|"kesehatan"|"belajar"|"keuangan", target: "", progress: 0 });
  const [activeCategory, setActiveCategory] = useState<string>("semua");

  const currentYear = new Date().getFullYear();
  const daysLeft = getDaysUntilYearEnd();
  const yearProgress = getYearProgress();

  useEffect(() => {
    setMounted(true);
    const saved = storage.get<Goal[]>("yearly-goals") ?? [];
    setGoals(saved);
  }, []);

  useEffect(() => { if (!mounted) return; storage.set("yearly-goals", goals); }, [goals, mounted]);

  const addGoal = () => {
    if (!form.title.trim()) return;
    const newGoal: Goal = { id: generateId(), title: form.title.trim(), category: form.category, target: form.target, progress: form.progress, year: currentYear };
    setGoals([...goals, newGoal]);
    setForm({ title: "", category: "karier", target: "", progress: 0 });
    setShowForm(false);
  };

  const updateGoal = (updated: Goal) => { setGoals(goals.map(g => g.id === updated.id ? updated : g)); };
  const deleteGoal = (id: string) => { setGoals(goals.filter(g => g.id !== id)); };

  const filteredGoals = activeCategory === "semua" ? goals : goals.filter(g => g.category === activeCategory);
  const avgProgress = goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0;

  const statCards = [
    { value: daysLeft, label: "Hari Tersisa", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", color: "var(--theme-accent)" },
    { value: `${yearProgress}%`, label: "Tahun Berjalan", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)", color: "var(--theme-amber)" },
    { value: goals.length, label: "Total Goals", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)", color: "var(--theme-blue)" },
    { value: `${avgProgress}%`, label: "Avg Progress", bg: "rgba(251,113,133,0.1)", border: "rgba(251,113,133,0.2)", color: "var(--theme-coral)" },
  ];

  const card: React.CSSProperties = {
    background: "var(--theme-surface)",
    border: "1px solid var(--theme-border)",
    borderRadius: 16, padding: "20px 24px",
  };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">
        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "var(--theme-muted)", marginBottom: 6, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
            Perencanaan Tahunan
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 12 }}>
            <h1 style={{ margin: 0, fontFamily: '"DM Serif Display", serif', fontSize: "clamp(24px,3vw,34px)", fontWeight: 400, color: "var(--theme-ink)", letterSpacing: "-0.5px" }}>
              Goals {currentYear} 🎯
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{ background: "linear-gradient(135deg, var(--theme-accent-2), var(--theme-accent))", color: "#052e16", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 12px rgba(52,211,153,0.3)", fontFamily: "inherit", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              + Tambah Goal
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="stats-grid-4" style={{ marginBottom: 20 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "20px 16px", textAlign: "center" as const }}>
              <div style={{ fontSize: 32, fontFamily: '"DM Serif Display", serif', fontWeight: 400, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--theme-muted)", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Distribusi Kategori ── */}
        {goals.length > 0 && (() => {
          const categoryStats = CATEGORIES.map(cat => {
            const catGoals = goals.filter(g => g.category === cat.id);
            return { ...cat, count: catGoals.length, percentage: (catGoals.length / goals.length) * 100 };
          });
          return (
            <div style={{ ...card, marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--theme-ink)" }}>📊 Distribusi Fokus Tahun Ini</span>
              <div style={{ display: "flex", height: 10, borderRadius: 99, overflow: "hidden", margin: "12px 0 10px", background: "var(--theme-surface-2)" }}>
                {categoryStats.map(stat => stat.count > 0 && (
                  <div key={stat.id} title={`${stat.label}: ${stat.count} goals (${Math.round(stat.percentage)}%)`} style={{ width: `${stat.percentage}%`, background: getCategoryColor(stat.id) }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const }}>
                {categoryStats.map(stat => (
                  <div key={stat.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--theme-muted)" }}>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: getCategoryColor(stat.id) }} />
                    {stat.label} ({Math.round(stat.percentage)}%)
                  </div>
                ))}
              </div>
              {categoryStats.some(s => s.percentage >= 60) && (
                <div style={{ marginTop: 10, fontSize: 12, color: "var(--theme-amber)", background: "rgba(251,191,36,0.08)", padding: "8px 12px", borderRadius: 8, border: "1px dashed rgba(251,191,36,0.3)" }}>
                  💡 <b>Saran:</b> Fokus terlalu dominan di satu kategori. Pertimbangkan menyeimbangkan aspek hidup lainnya.
                </div>
              )}
            </div>
          );
        })()}

        {/* ── Year Progress Bar ── */}
        <div style={{ ...card, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--theme-ink)" }}>Progress Waktu Berjalan {currentYear}</span>
            <span style={{ fontSize: 13, color: "var(--theme-muted)" }}>Jan → Des</span>
          </div>
          <div style={{ height: 8, background: "var(--theme-surface-2)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${yearProgress}%`, background: "linear-gradient(90deg, var(--theme-accent), var(--theme-amber), var(--theme-coral))", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* ── Add Goal Form ── */}
        {showForm && (
          <div className="animate-fade-in" style={{ ...card, marginBottom: 24 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "var(--theme-ink)" }}>Tambah Goal Baru</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--theme-muted)", display: "block", marginBottom: 6 }}>Judul Goal *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Contoh: Baca 24 buku tahun ini" style={inputStyle} onFocus={e => e.target.style.borderColor = "var(--theme-accent)"} onBlur={e => e.target.style.borderColor = "var(--theme-border)"} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--theme-muted)", display: "block", marginBottom: 6 }}>Kategori</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as typeof form.category }))} style={{ ...inputStyle, cursor: "pointer" }}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{getCategoryIcon(c.id)} {c.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--theme-muted)", display: "block", marginBottom: 6 }}>Target / Deskripsi</label>
              <input value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} placeholder="Tambahkan detail target spesifik..." style={inputStyle} onFocus={e => e.target.style.borderColor = "var(--theme-accent)"} onBlur={e => e.target.style.borderColor = "var(--theme-border)"} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--theme-muted)", display: "block", marginBottom: 6 }}>Progress Awal: {form.progress}%</label>
              <input type="range" min="0" max="100" value={form.progress} onChange={e => setForm(f => ({ ...f, progress: parseInt(e.target.value) }))} style={{ width: "100%", accentColor: "var(--theme-accent)" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={addGoal} style={{ background: "var(--theme-accent)", color: "#052e16", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit" }}>
                Simpan Goal
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: "var(--theme-surface-2)", color: "var(--theme-muted)", border: "1px solid var(--theme-border)", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "inherit" }}>
                Batal
              </button>
            </div>
          </div>
        )}

        {/* ── Category Filter ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" as const }}>
          <button onClick={() => setActiveCategory("semua")} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${activeCategory === "semua" ? "var(--theme-accent)" : "var(--theme-border)"}`, background: activeCategory === "semua" ? "rgba(52,211,153,0.15)" : "var(--theme-surface-2)", color: activeCategory === "semua" ? "var(--theme-accent)" : "var(--theme-muted)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s" }}>
            🏆 Semua
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${activeCategory === cat.id ? getCategoryColor(cat.id) : "var(--theme-border)"}`, background: activeCategory === cat.id ? `${getCategoryColor(cat.id)}20` : "var(--theme-surface-2)", color: activeCategory === cat.id ? getCategoryColor(cat.id) : "var(--theme-muted)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s" }}>
              {getCategoryIcon(cat.id)} {cat.label}
            </button>
          ))}
        </div>

        {/* ── Goals Grid ── */}
        {filteredGoals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 0", color: "var(--theme-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🎯</div>
            <p style={{ margin: 0, fontSize: 16 }}>
              {activeCategory === "semua" ? "Belum ada goals. Tambahkan goals pertamamu!" : `Belum ada goals untuk kategori ${getCategoryLabel(activeCategory)}`}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filteredGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onUpdate={updateGoal} onDelete={deleteGoal} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
