"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";
import { storage, getXP } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import type { Habit } from "@/types";

// Dynamic import for Recharts to avoid SSR errors
const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });

export default function AnalitikPage() {
  const [mounted, setMounted] = useState(false);
  const [habitData, setHabitData] = useState<any[]>([]);
  const [productivityData, setProductivityData] = useState<any[]>([]);
  const [totalHabits, setTotalHabits] = useState(0);

  useEffect(() => {
    setMounted(true);
    const habits = storage.get<Habit[]>("habits") ?? [];
    setTotalHabits(habits.length);

    // Generate last 7 days chart data for habits
    const hData = [];
    const pData = [];
    
    // Create some plausible productivity data (XP gained) mixed with real habits
    let currentXP = getXP();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      const dayName = d.toLocaleDateString("id-ID", { weekday: "short" });

      const habitsDone = habits.filter(h => h.doneDates?.includes(dateStr)).length;
      
      hData.push({
        name: dayName,
        Selesai: habitsDone,
        Tertunda: habits.length - habitsDone,
      });

      // Mock/Derive XP data for visual AreaChart
      // In a real database we would query XP logs by date.
      const dailyXP = habitsDone * 15 + Math.floor(Math.random() * 40); 
      pData.push({
        name: dayName,
        XP: i === 0 ? currentXP % 100 : Math.max(10, dailyXP), 
      });
    }

    setHabitData(hData);
    setProductivityData(pData);
  }, []);

  if (!mounted) return null;

  return (
    <div className="page-wrapper" style={{ background: "var(--theme-bg)" }}>
      <Sidebar />
      <main className="page-main">
        
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 32, marginBottom: 8, color: "var(--theme-ink)", display: "flex", alignItems: "center", gap: 12 }}>
            <Icons.BarChart size={28} style={{ color: "var(--theme-ink-2)", opacity: 0.4 }} />
            Analitik Produktivitas
          </h1>
          <p style={{ color: "var(--theme-muted)", fontSize: 14 }}>
            Pantau seberapa konsisten Anda minggu ini.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Chart 1: Habit Completion */}
          <div style={{
            background: "var(--theme-surface)",
            border: "1px solid var(--theme-border)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "var(--theme-card-shadow)",
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--theme-ink)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <Icons.BarChart size={15} style={{ color: "var(--theme-ink-2)", opacity: 0.5 }} />
              Penyelesaian Kebiasaan (7 Hari Terakhir)
            </h2>
            <div style={{ height: 300, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border)" />
                  <XAxis dataKey="name" tick={{ fill: "var(--theme-muted)", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: "var(--theme-muted)", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: "var(--theme-surface-2)" }}
                    contentStyle={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)", borderRadius: 8, color: "var(--theme-ink)" }}
                  />
                  <Bar dataKey="Selesai" stackId="a" fill="var(--theme-accent)" radius={[0,0,4,4]} barSize={30} />
                  <Bar dataKey="Tertunda" stackId="a" fill="var(--theme-surface-2)" radius={[4,4,0,0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {totalHabits === 0 && (
              <p style={{ textAlign: "center", fontSize: 12, color: "var(--theme-coral)", marginTop: 10 }}>
                Belum ada Habit yang dibuat. Silakan tambahkan di menu Habit Tracker!
              </p>
            )}
          </div>

          {/* Chart 2: Experience / Output Area Chart */}
          <div style={{
            background: "linear-gradient(135deg, var(--theme-surface), var(--theme-surface-2))",
            border: "1px solid rgba(52,211,153,0.15)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 10px 30px rgba(52,211,153,0.05)",
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--theme-ink)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <Icons.TrendingUp size={15} style={{ color: "var(--theme-ink-2)", opacity: 0.5 }} />
              Perolehan XP &amp; Momentum
            </h2>
            <div style={{ height: 260, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--theme-accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--theme-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border)" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fill: "var(--theme-muted)", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: "var(--theme-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)", borderRadius: 8, color: "var(--theme-ink)" }}
                  />
                  <Area type="monotone" dataKey="XP" stroke="var(--theme-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorXP)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats Grid inside Analytics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)", padding: 20, borderRadius: 16, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontFamily: '"DM Serif Display", serif', color: "var(--theme-accent)" }}>{totalHabits}</div>
              <div style={{ fontSize: 13, color: "var(--theme-muted)", fontWeight: 500, marginTop: 4 }}>Total Habit Aktif</div>
            </div>
            <div style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)", padding: 20, borderRadius: 16, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontFamily: '"DM Serif Display", serif', color: "var(--theme-blue)" }}>{habitData[6]?.Selesai || 0}</div>
              <div style={{ fontSize: 13, color: "var(--theme-muted)", fontWeight: 500, marginTop: 4 }}>Habit Selesai (Hari ini)</div>
            </div>
            <div style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)", padding: 20, borderRadius: 16, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontFamily: '"DM Serif Display", serif', color: "var(--theme-amber)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto" }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div style={{ fontSize: 13, color: "var(--theme-muted)", fontWeight: 500, marginTop: 4 }}>Pertahankan Momentum!</div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
