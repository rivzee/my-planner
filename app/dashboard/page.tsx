"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";
const WelcomeAnimation = dynamic(() => import("@/components/WelcomeAnimation"), { ssr: false });

import { storage, getXP } from "@/lib/storage";
import { getTodayString, formatDate } from "@/lib/utils";
import type { Task, MonthlyTarget, Habit } from "@/types";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const LEVEL_UP_XP = 100;

// ── Stat Card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  href: string;
  isEmpty?: boolean;
}

function StatCard({ icon, label, value, sub, accent, href, isEmpty }: StatCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? accent : "var(--theme-surface)",
          border: `1px solid ${hovered ? accent : "var(--theme-border)"}`,
          borderRadius: 16,
          padding: "20px",
          cursor: "pointer",
          transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "translateY(-3px)" : "none",
          boxShadow: hovered ? `0 12px 32px ${accent}30` : "var(--theme-card-shadow)",
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        {/* Background blur effect on hover */}
        {hovered && (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${accent}08, ${accent}18)`, borderRadius: 16 }} />
        )}
        <div style={{ position: "relative" as const }}>
          <div style={{
            width: 40, height: 40,
            background: hovered ? "rgba(255,255,255,0.15)" : `${accent}14`,
            borderRadius: 11,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 14,
            color: hovered ? "white" : accent,
            transition: "all 0.22s",
          }}>
            {icon}
          </div>
          <div style={{
            fontSize: 26,
            fontFamily: '"DM Serif Display", serif',
            fontWeight: 400,
            color: hovered ? "white" : "var(--theme-ink)",
            lineHeight: 1,
            marginBottom: 5,
          }}>
            {isEmpty ? <span style={{ fontSize: 20, opacity: 0.4 }}>—</span> : value}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: hovered ? "rgba(255,255,255,0.9)" : "var(--theme-ink-2)" }}>
            {label}
          </div>
          {sub && (
            <div style={{ fontSize: 11, color: hovered ? "rgba(255,255,255,0.65)" : "var(--theme-muted)", marginTop: 3 }}>
              {sub}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Quick Link ─────────────────────────────────────────────────────────────
function QuickLink({ href, icon, label, desc, accent, hoverBg }: { href: string; icon: React.ReactNode; label: string; desc: string; accent: string; hoverBg?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 13,
          padding: "13px 16px",
          background: hovered ? (hoverBg ?? `${accent}08`) : "var(--theme-surface)",
          border: `1px solid ${hovered ? accent + "50" : "var(--theme-border)"}`,
          borderRadius: 13,
          cursor: "pointer",
          transition: "all 0.18s ease",
          transform: hovered ? "translateX(3px)" : "none",
          boxShadow: hovered ? "var(--theme-card-shadow-hover)" : "var(--theme-card-shadow)",
        }}
      >
        <div style={{
          width: 38, height: 38,
          background: hovered ? accent : `${accent}12`,
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          color: hovered ? "white" : accent,
          transition: "all 0.18s",
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: hovered ? accent : "var(--theme-ink)" }}>{label}</div>
          <div style={{ fontSize: 11.5, color: "var(--theme-muted)", marginTop: 2 }}>{desc}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hovered ? accent : "var(--theme-border)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.18s", flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </Link>
  );
}

// ── Progress Row ───────────────────────────────────────────────────────────
function ProgressRow({ label, done, total, pct, accent, href }: { label: string; done: number; total: number; pct: number; accent: string; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--theme-ink-2)" }}>{label}</span>
        <span style={{ fontSize: 12, color: total > 0 ? accent : "var(--theme-muted)", fontWeight: 700 }}>
          {total > 0 ? `${done}/${total} (${pct}%)` : "Belum ada data"}
        </span>
      </div>
      <div style={{ height: 6, background: "var(--theme-border)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: accent, borderRadius: 999, transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)", minWidth: total > 0 && done > 0 ? 4 : 0 }} />
      </div>
    </Link>
  );
}

// ── SVG Icons ──────────────────────────────────────────────────────────────
const SunIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>;
const CalIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const TargetIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const FireIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
const CheckIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const StarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const GridIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;

// ── Page ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  const [dailyDone, setDailyDone] = useState(0);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [weeklyFocus, setWeeklyFocus] = useState("");
  const [monthlyDone, setMonthlyDone] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [yearlyDone, setYearlyDone] = useState(0);
  const [yearlyTotal, setYearlyTotal] = useState(0);
  const [habitStreak, setHabitStreak] = useState(0);
  const [habitToday, setHabitToday] = useState(0);
  const [habitTotal, setHabitTotal] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    setMounted(true);

    const dailyTasks = storage.get<Task[]>("daily-tasks") ?? [];
    const dailyPriority = storage.get<Task[]>("daily-priority") ?? [];
    const allDaily = [...dailyTasks, ...dailyPriority];
    setDailyDone(allDaily.filter(t => t.done).length);
    setDailyTotal(allDaily.length);

    setWeeklyFocus(storage.get<string>("weekly-focus") ?? "");

    const now = new Date();
    const monthKey = `monthly-${now.getFullYear()}-${now.getMonth()}`;
    const monthTargets = storage.get<MonthlyTarget[]>(monthKey) ?? [];
    setMonthlyDone(monthTargets.filter(t => t.done).length);
    setMonthlyTotal(monthTargets.length);

    const yearKey = `yearly-goals-${now.getFullYear()}`;
    const yearGoals = storage.get<any[]>(yearKey) ?? [];
    setYearlyDone(yearGoals.filter((g: any) => g.done).length);
    setYearlyTotal(yearGoals.length);

    const habits = storage.get<Habit[]>("habits") ?? [];
    const today = getTodayString();
    setHabitTotal(habits.length);
    setHabitToday(habits.filter(h => h.doneDates?.includes(today)).length);

    let best = 0;
    habits.forEach(habit => {
      let streak = 0;
      const d = new Date();
      for (let i = 0; i < 30; i++) {
        if (habit.doneDates?.includes(formatDate(d))) { streak++; d.setDate(d.getDate() - 1); }
        else break;
      }
      if (streak > best) best = streak;
    });
    setHabitStreak(best);

    setXp(getXP());
  }, []);

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 10 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : hour < 18 ? "Selamat Sore" : "Selamat Malam";
  const firstName = session?.user?.name?.split(" ")[0] ?? "Pengguna";
  const dateStr = today.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const greetEmoji = hour < 10 ? "🌅" : hour < 15 ? "☀️" : hour < 18 ? "🌤️" : "🌙";

  const currentLevel = Math.floor(xp / LEVEL_UP_XP) + 1;
  const xpInLevel = xp % LEVEL_UP_XP;
  const xpPct = (xpInLevel / LEVEL_UP_XP) * 100;

  const dailyPct = dailyTotal > 0 ? Math.round((dailyDone / dailyTotal) * 100) : 0;
  const monthlyPct = monthlyTotal > 0 ? Math.round((monthlyDone / monthlyTotal) * 100) : 0;
  const yearlyPct = yearlyTotal > 0 ? Math.round((yearlyDone / yearlyTotal) * 100) : 0;
  const habitPct = habitTotal > 0 ? Math.round((habitToday / habitTotal) * 100) : 0;

  if (!mounted) return null;

  return (
    <div className="page-wrapper">
      <WelcomeAnimation name={session?.user?.name} />
      <Sidebar />
      <main className="page-main">

        {/* ── Header ── */}
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 12 }}>
          <div className="animate-fade-up">
            <div style={{ fontSize: 12, color: "var(--theme-muted)", marginBottom: 4, fontWeight: 500 }}>{dateStr}</div>
            <h1 style={{ margin: 0, fontFamily: '"DM Serif Display", serif', fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 400, color: "var(--theme-ink)", lineHeight: 1.2 }}>
              {greeting}, {firstName}! {greetEmoji}
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--theme-muted)" }}>
              Ikhtisar semua rencana & progres hari ini.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name ?? ""}
                width={42} height={42}
                style={{ borderRadius: "50%", border: "2px solid rgba(52,211,153,0.3)", flexShrink: 0 }}
              />
            )}
          </div>
        </div>

        {/* ── XP Banner ── */}
        <div
          className="animate-fade-up delay-100"
          style={{
            background: "linear-gradient(135deg, #065F46 0%, #064E3B 50%, #1E3A5F 100%)",
            borderRadius: 18,
            padding: "18px 24px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 18,
            flexWrap: "wrap" as const,
            boxShadow: "0 8px 24px rgba(22,163,74,0.25)",
            position: "relative" as const,
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", right: 60, bottom: -50, width: 100, height: 100, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />

          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: "10px 12px", backdropFilter: "blur(4px)", flexShrink: 0 }}>
            <StarIcon />
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontWeight: 600, marginTop: 2, textAlign: "center" as const }}>LV.{currentLevel}</div>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Level {currentLevel} — Explorer</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{xpInLevel}/{LEVEL_UP_XP} XP</span>
            </div>
            <div style={{ height: 7, background: "rgba(255,255,255,0.15)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${xpPct}%`, background: "rgba(255,255,255,0.9)", borderRadius: 999, transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textAlign: "right" as const, flexShrink: 0 }}>
            <div style={{ fontWeight: 700, color: "white", fontSize: 16 }}>{LEVEL_UP_XP - xpInLevel} XP</div>
            <div style={{ fontSize: 11, marginTop: 1 }}>menuju Level {currentLevel + 1}</div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="stats-grid-4 animate-fade-up delay-200">
          <StatCard
            icon={<SunIcon />} label="Tugas Harian"
            value={`${dailyDone}/${dailyTotal}`}
            sub={dailyTotal > 0 ? `${dailyPct}% selesai` : "Belum ada tugas"}
            accent="var(--theme-accent)" href="/harian"
            isEmpty={dailyTotal === 0}
          />
          <StatCard
            icon={<CalIcon />} label="Target Bulanan"
            value={`${monthlyDone}/${monthlyTotal}`}
            sub={monthlyTotal > 0 ? `${monthlyPct}% tercapai` : MONTH_NAMES[today.getMonth()]}
            accent="var(--theme-amber)" href="/bulanan"
            isEmpty={monthlyTotal === 0}
          />
          <StatCard
            icon={<TargetIcon />} label="Goals Tahunan"
            value={`${yearlyDone}/${yearlyTotal}`}
            sub={yearlyTotal > 0 ? `${yearlyPct}% tercapai` : `Tahun ${today.getFullYear()}`}
            accent="var(--theme-blue)" href="/tahunan"
            isEmpty={yearlyTotal === 0}
          />
          <StatCard
            icon={<FireIcon />} label="Habit Streak"
            value={`${habitStreak}`}
            sub={habitStreak > 0 ? "hari berturut-turut" : "Mulai kebiasaanmu"}
            accent="var(--theme-coral)" href="/habit"
            isEmpty={habitStreak === 0}
          />
        </div>

        {/* ── Two Column ── */}
        <div className="responsive-two-col animate-fade-up delay-300">

          {/* Left: Progress */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 18 }}>

            {/* Progress bars card */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, background: "rgba(22,163,74,0.1)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--theme-accent)" }}>
                  <GridIcon />
                </div>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--theme-ink)", fontFamily: "inherit" }}>Progres Hari Ini</h2>
              </div>
              <ProgressRow label="Tugas Harian" done={dailyDone} total={dailyTotal} pct={dailyPct} accent="var(--theme-accent)" href="/harian" />
              <ProgressRow label="Target Bulanan" done={monthlyDone} total={monthlyTotal} pct={monthlyPct} accent="var(--theme-amber)" href="/bulanan" />
              <ProgressRow label="Goals Tahunan" done={yearlyDone} total={yearlyTotal} pct={yearlyPct} accent="var(--theme-blue)" href="/tahunan" />
              <ProgressRow label="Habit Hari Ini" done={habitToday} total={habitTotal} pct={habitPct} accent="var(--theme-coral)" href="/habit" />
            </div>

            {/* Weekly focus */}
            {weeklyFocus && (
              <div className="card" style={{ padding: 22, background: "linear-gradient(135deg, var(--theme-surface), var(--theme-surface-2))", borderColor: "rgba(22,163,74,0.15)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--theme-accent)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>
                  🎯 Fokus Minggu Ini
                </div>
                <p style={{ margin: 0, fontSize: 14.5, color: "var(--theme-ink)", lineHeight: 1.65, fontStyle: "italic" }}>
                  &ldquo;{weeklyFocus}&rdquo;
                </p>
                <Link href="/mingguan" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 10, fontSize: 12, color: "var(--theme-accent)", fontWeight: 600, textDecoration: "none" }}>
                  Lihat Rencana Mingguan
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </Link>
              </div>
            )}

            {/* Empty state */}
            {dailyTotal === 0 && monthlyTotal === 0 && yearlyTotal === 0 && (
              <div className="card" style={{ padding: 28, textAlign: "center" as const, borderStyle: "dashed", background: "transparent" }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>🚀</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--theme-ink)", marginBottom: 6 }}>Mulai Rencanamu!</div>
                <div style={{ fontSize: 13, color: "var(--theme-muted)", lineHeight: 1.6 }}>
                  Belum ada tugas atau target. Yuk tambahkan rencana pertamamu!
                </div>
              </div>
            )}
          </div>

          {/* Right: Quick Links */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "var(--theme-ink)", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ color: "var(--theme-amber)" }}>⚡</span> Akses Cepat
            </h2>
            <QuickLink href="/harian" icon={<SunIcon />} label="Harian" desc="Tambah & selesaikan tugas hari ini" accent="var(--theme-accent)" />
            <QuickLink href="/mingguan" icon={<CalIcon />} label="Mingguan" desc="Atur fokus & rencana minggu ini" accent="#0EA5E9" />
            <QuickLink href="/bulanan" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            } label="Bulanan" desc="Pantau target & evaluasi bulan" accent="var(--theme-amber)" />
            <QuickLink href="/tahunan" icon={<TargetIcon />} label="Tahunan" desc="Goals besar & distribusi fokus hidup" accent="var(--theme-blue)" />
            <QuickLink href="/habit" icon={<CheckIcon />} label="Habit Tracker" desc="Jaga kebiasaan & raih streak baru" accent="var(--theme-coral)" />

            {/* Motivational card */}
            <div style={{
              marginTop: 4,
              background: "linear-gradient(135deg, #18181B, #27272A)",
              borderRadius: 14,
              padding: "18px 20px",
              color: "white",
              border: "1px solid #3F3F46",
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#71717A", marginBottom: 10 }}>
                ✨ Ingat Selalu
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, fontStyle: "italic", color: "#E4E4E7" }}>
                &ldquo;Disiplin adalah jembatan antara impian dan kenyataan.&rdquo;
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "#71717A" }}>— Jim Rohn</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
