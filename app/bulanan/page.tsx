"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import MonthCalendar from "@/components/MonthCalendar";
import { storage, addXP } from "@/lib/storage";
import { formatDate, generateId, getTodayString } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import type { MonthlyTarget } from "@/types";

const MONTH_NAMES = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

const card: React.CSSProperties = {
  background: "var(--theme-surface)",
  border: "1px solid var(--theme-border)",
  borderRadius: 16,
  padding: 24,
};

const navBtn: React.CSSProperties = {
  background: "var(--theme-surface-2)",
  border: "1px solid var(--theme-border)",
  borderRadius: 8, padding: "8px 14px",
  cursor: "pointer", fontSize: 15,
  color: "var(--theme-ink-2)",
  transition: "all 0.15s", fontFamily: "inherit",
};

export default function BulananPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [targets, setTargets] = useState<MonthlyTarget[]>([]);
  const [reflection, setReflection] = useState("");
  const [input, setInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [mounted, setMounted] = useState(false);
  const [aiReview, setAiReview] = useState<{apresiasi: string; evaluasi: string; saran_bulan_depan: string; saran_target_baru?: string[]} | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [addedAiTargets, setAddedAiTargets] = useState<Record<number, boolean>>({});

  const storageKey = `monthly-${year}-${month}`;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    const saved = storage.get<{ targets: MonthlyTarget[]; reflection: string }>(storageKey);
    setTargets(saved?.targets ?? []);
    setReflection(saved?.reflection ?? "");
  }, [storageKey, mounted]);

  const save = useCallback((newTargets: MonthlyTarget[], newReflection: string) => {
    storage.set(storageKey, { targets: newTargets, reflection: newReflection });
  }, [storageKey]);

  const addTarget = useCallback(() => {
    if (!input.trim()) return;
    const newTargets = [...targets, { id: generateId(), text: input.trim(), done: false }];
    setTargets(newTargets); save(newTargets, reflection); setInput("");
  }, [input, targets, reflection, save]);

  const toggleTarget = useCallback((id: string) => {
    const target = targets.find(t => t.id === id);
    if (!target) return;
    addXP(target.done ? -20 : 20);
    const newTargets = targets.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTargets(newTargets); save(newTargets, reflection);
  }, [targets, reflection, save]);

  const deleteTarget = useCallback((id: string) => {
    const newTargets = targets.filter(t => t.id !== id);
    setTargets(newTargets); save(newTargets, reflection);
  }, [targets, reflection, save]);

  const editTargetNote = useCallback((id: string) => {
    const target = targets.find(t => t.id === id);
    if (!target) return;
    const newNote = window.prompt("Tambahkan catatan untuk plan ini:", target.note || "");
    if (newNote !== null) {
      const newTargets = targets.map(t => t.id === id ? { ...t, note: newNote } : t);
      setTargets(newTargets); save(newTargets, reflection);
    }
  }, [targets, reflection, save]);

  const handleReflectionChange = useCallback((val: string) => {
    setReflection(val);
  }, []);

  const addTargetFromAI = useCallback((text: string, index: number) => {
    const newTargets = [...targets, { id: generateId(), text, done: false }];
    setTargets(newTargets); save(newTargets, reflection);
    setAddedAiTargets(prev => ({ ...prev, [index]: true }));
  }, [targets, reflection, save]);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      save(targets, reflection);
    }, 500);
    return () => clearTimeout(t);
  }, [reflection, targets, mounted, save]);

  const prevMonth = useCallback(() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }, [month]);
  const nextMonth = useCallback(() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }, [month]);

  const completedCount = useMemo(() => targets.filter(t => t.done).length, [targets]);
  const progressPct = useMemo(() => targets.length > 0 ? Math.round((completedCount / targets.length) * 100) : 0, [targets.length, completedCount]);

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">
        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "var(--theme-muted)", marginBottom: 6, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
            Perencanaan Bulanan
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 12 }}>
            <h1 style={{ margin: 0, fontFamily: '"DM Serif Display", serif', fontSize: "clamp(24px,3vw,34px)", fontWeight: 400, color: "var(--theme-ink)", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 10 }}>
              <Icons.Calendar size={28} style={{ color: "var(--theme-ink-2)", opacity: 0.4 }} />
              Rencana Bulanan
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={prevMonth} style={navBtn} onMouseEnter={e => e.currentTarget.style.background="var(--theme-surface)"} onMouseLeave={e => e.currentTarget.style.background="var(--theme-surface-2)"}>←</button>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--theme-ink)", minWidth: 150, textAlign: "center" as const, fontFamily: '"DM Serif Display", serif' }}>
                {MONTH_NAMES[month]} {year}
              </span>
              <button onClick={nextMonth} style={navBtn} onMouseEnter={e => e.currentTarget.style.background="var(--theme-surface)"} onMouseLeave={e => e.currentTarget.style.background="var(--theme-surface-2)"}>→</button>
              {(year !== today.getFullYear() || month !== today.getMonth()) && (
                <button onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
                  style={{ background: "var(--theme-amber)", color: "#1a0a00", border: "none", borderRadius: 8, padding: "8px 13px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
                  Bulan Ini
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={card}>
              <MonthCalendar year={year} month={month} selectedDate={selectedDate} onSelectDate={(d) => setSelectedDate(formatDate(d))} accentColor="var(--theme-amber)" />
            </div>

            {/* Refleksi */}
            <div style={card}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "var(--theme-ink)", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.BookOpen size={15} style={{ color: "var(--theme-ink-2)", opacity: 0.5 }} />
                Refleksi Bulan Ini
              </h3>
              <textarea
                value={reflection}
                onChange={(e) => handleReflectionChange(e.target.value)}
                placeholder={`Apa yang sudah baik di ${MONTH_NAMES[month]}? Apa yang bisa ditingkatkan?`}
                rows={6}
                style={{
                  width: "100%", background: "var(--theme-surface-2)",
                  border: "1px solid var(--theme-border)", borderRadius: 10,
                  padding: "12px 14px", fontSize: 14, color: "var(--theme-ink)",
                  resize: "vertical" as const, outline: "none",
                  fontFamily: '"Inter", sans-serif', lineHeight: 1.7,
                  boxSizing: "border-box" as const, transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "var(--theme-amber)"}
                onBlur={e => e.target.style.borderColor = "var(--theme-border)"}
              />
              <div style={{ fontSize: 11, color: "var(--theme-muted)", marginTop: 8, textAlign: "right" as const, marginBottom: 16 }}>Tersimpan otomatis</div>

              {/* AI Evaluator */}
              <div style={{ padding: 18, background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.12)", borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--theme-accent)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Icons.Cpu size={14} style={{ opacity: 0.7 }} />
                    Laporan Evaluasi AI
                  </h4>
                  <button
                    onClick={async () => {
                      setIsLoadingReview(true); setAiReview(null);
                      try {
                        const res = await fetch("/api/ai-review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ monthName: MONTH_NAMES[month], targets, reflection }) });
                        const data = await res.json();
                        if (data.error) throw new Error(data.error);
                        setAiReview(data);
                      } catch (err: any) { alert(err.message || "Gagal mendapatkan review."); }
                      finally { setIsLoadingReview(false); }
                    }}
                    disabled={isLoadingReview || targets.length === 0}
                    style={{
                      background: isLoadingReview || targets.length === 0 ? "var(--theme-surface-2)" : "var(--theme-accent)",
                      color: isLoadingReview || targets.length === 0 ? "var(--theme-muted)" : "#052e16",
                      border: "none", borderRadius: 8, padding: "6px 14px",
                      cursor: isLoadingReview || targets.length === 0 ? "not-allowed" : "pointer",
                      fontSize: 12, fontWeight: 700, fontFamily: "inherit",
                    }}
                  >
                    {isLoadingReview ? "Menganalisa..." : "Minta Evaluasi"}
                  </button>
                </div>
                {aiReview && (
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div><span style={{ fontSize: 12, fontWeight: 700, color: "var(--theme-accent)" }}>Apresiasi</span><p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--theme-ink-2)", lineHeight: 1.6 }}>{aiReview.apresiasi}</p></div>
                    <div><span style={{ fontSize: 12, fontWeight: 700, color: "var(--theme-amber)" }}>Analisa Objektif</span><p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--theme-ink-2)", lineHeight: 1.6 }}>{aiReview.evaluasi}</p></div>
                    <div><span style={{ fontSize: 12, fontWeight: 700, color: "var(--theme-coral)" }}>Rekomendasi</span><p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--theme-ink-2)", lineHeight: 1.6 }}>{aiReview.saran_bulan_depan}</p></div>
                    {aiReview.saran_target_baru && aiReview.saran_target_baru.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--theme-accent)" }}>Ide Target AI:</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                          {aiReview.saran_target_baru.map((target, idx) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(52,211,153,0.15)" }}>
                              <span style={{ fontSize: 13, color: "var(--theme-ink)" }}>{target}</span>
                              <button
                                onClick={() => addTargetFromAI(target, idx)}
                                disabled={addedAiTargets[idx]}
                                style={{
                                  background: addedAiTargets[idx] ? "transparent" : "rgba(52,211,153,0.15)",
                                  color: addedAiTargets[idx] ? "var(--theme-muted)" : "var(--theme-accent)",
                                  border: addedAiTargets[idx] ? "1px solid var(--theme-border)" : "1px solid transparent",
                                  borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700,
                                  cursor: addedAiTargets[idx] ? "default" : "pointer", transition: "all 0.2s", whiteSpace: "nowrap"
                                }}
                              >
                                {addedAiTargets[idx] ? "✔ Ditambahkan" : "+ Tambah"}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {targets.length === 0 && !aiReview && (
                  <div style={{ marginTop: 12, fontSize: 12, color: "var(--theme-muted)" }}>Tambahkan target terlebih dahulu untuk mendapatkan review AI.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
            <div style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.18)", borderRadius: 16, padding: 20 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "var(--theme-amber)", display: "flex", alignItems: "center", gap: 7 }}>
                <Icons.Award size={15} style={{ opacity: 0.7 }} />
                Target {MONTH_NAMES[month]}
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "var(--theme-muted)" }}>{completedCount}/{targets.length} selesai</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--theme-amber)" }}>{progressPct}%</span>
              </div>
              <div style={{ height: 6, background: "var(--theme-surface-2)", borderRadius: 99, marginBottom: 16, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg,#FBBF24,#F59E0B)", borderRadius: 99, transition: "width 0.4s ease" }} />
              </div>

              {/* Add target */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTarget()}
                  placeholder="Tambah target baru..."
                  style={{ flex: 1, background: "var(--theme-surface-2)", border: "1px solid var(--theme-border)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "var(--theme-ink)", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "var(--theme-amber)"}
                  onBlur={e => e.target.style.borderColor = "var(--theme-border)"}
                />
                <button onClick={addTarget} style={{ background: "var(--theme-amber)", color: "#1a0a00", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 700, fontSize: 16, fontFamily: "inherit" }}>+</button>
              </div>

              {/* Target list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {targets.map(target => (
                  <div key={target.id} style={{ display: "flex", flexDirection: "column", padding: "10px 12px", background: "var(--theme-surface)", border: "1px solid var(--theme-border)", borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => toggleTarget(target.id)} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${target.done ? "var(--theme-amber)" : "var(--theme-border-2)"}`, background: target.done ? "var(--theme-amber)" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#1a0a00", fontSize: 11 }}>
                        {target.done && "✓"}
                      </button>
                      <span style={{ flex: 1, fontSize: 13, color: target.done ? "var(--theme-muted)" : "var(--theme-ink)", textDecoration: target.done ? "line-through" : "none" }}>{target.text}</span>
                      <button onClick={() => editTargetNote(target.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0, opacity: 0.6 }} title="Edit Catatan">Catatan</button>
                      <button onClick={() => deleteTarget(target.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--theme-muted)", fontSize: 16, padding: "0 2px", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--theme-coral)"} onMouseLeave={e => e.currentTarget.style.color = "var(--theme-muted)"} title="Hapus">×</button>
                    </div>
                    {target.note && (
                      <div style={{ marginTop: 6, paddingLeft: 28, fontSize: 12, color: "var(--theme-muted)", display: "flex", alignItems: "start", gap: 6 }}>
                        <span style={{ fontStyle: "italic", lineHeight: 1.4 }}>{target.note}</span>
                      </div>
                    )}
                  </div>
                ))}
                {targets.length === 0 && (
                  <p style={{ fontSize: 13, color: "var(--theme-muted)", textAlign: "center", padding: "12px 0", margin: 0 }}>Belum ada target bulan ini</p>
                )}
              </div>

              {/* Migrate button */}
              {targets.length > 0 && completedCount < targets.length && (
                <div style={{ marginTop: 20, padding: 14, background: "var(--theme-surface)", borderRadius: 10, border: "1px dashed rgba(251,191,36,0.3)", textAlign: "center" as const }}>
                  <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--theme-muted)", lineHeight: 1.6 }}>Ada target yang belum selesai? Lanjutkan di bulan depan.</p>
                  <button
                    onClick={() => {
                      const unfinished = targets.filter(t => !t.done);
                      if (unfinished.length === 0) return;
                      const nextM = month === 11 ? 0 : month + 1;
                      const nextY = month === 11 ? year + 1 : year;
                      const nextKey = `monthly-${nextY}-${nextM}`;
                      const unfinishedWithNote = unfinished.map(t => ({ ...t, text: t.text.includes("(Tertunda dari") ? t.text : `${t.text} (Tertunda dari ${MONTH_NAMES[month]})` }));
                      const nextMonthData = storage.get<{ targets: MonthlyTarget[]; reflection: string }>(nextKey) || { targets: [], reflection: "" };
                      storage.set(nextKey, { ...nextMonthData, targets: [...nextMonthData.targets, ...unfinishedWithNote] });
                      const finishedOnly = targets.filter(t => t.done);
                      setTargets(finishedOnly); save(finishedOnly, reflection);
                      alert(`${unfinished.length} target dipindahkan ke bulan depan!`);
                    }}
                    style={{ background: "var(--theme-surface-2)", color: "var(--theme-amber)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: 12, transition: "all 0.2s", fontFamily: "inherit" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(251,191,36,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--theme-surface-2)"}
                  >
                    Pindahkan Tertunda ke Bulan Depan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
