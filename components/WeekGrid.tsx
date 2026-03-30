"use client";

import { formatDate } from "@/lib/utils";
import type { Task } from "@/types";

interface WeekGridProps {
  weekDates: Date[];
  tasks: Task[];
  onSelectDate: (date: Date) => void;
  selectedDate: string;
  accentColor?: string;
}

const DAY_NAMES = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function WeekGrid({
  weekDates,
  tasks,
  onSelectDate,
  selectedDate,
  accentColor = "var(--theme-accent)",
}: WeekGridProps) {
  const today = formatDate(new Date());

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
      {weekDates.map((date, i) => {
        const dateStr = formatDate(date);
        const isToday = dateStr === today;
        const isSelected = dateStr === selectedDate;

        return (
          <button
            key={dateStr}
            onClick={() => onSelectDate(date)}
            style={{
              padding: "12px 8px",
              borderRadius: 12,
              border: isSelected
                ? `2px solid ${accentColor}`
                : isToday
                ? `2px solid ${accentColor}40`
                : "2px solid var(--theme-border)",
              background: isSelected
                ? accentColor
                : isToday
                ? `${accentColor}10`
                : "var(--theme-surface-2)",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => {
              if (!isSelected) e.currentTarget.style.borderColor = accentColor;
            }}
            onMouseLeave={e => {
              if (!isSelected) e.currentTarget.style.borderColor = isToday ? `${accentColor}40` : "var(--theme-border)";
            }}
          >
            <div style={{
              fontSize: 10, fontWeight: 600,
              color: isSelected ? "rgba(255,255,255,0.65)" : "var(--theme-muted)",
              marginBottom: 4, letterSpacing: "0.04em",
            }}>
              {DAY_NAMES[(date.getDay() + 6) % 7].substring(0, 3).toUpperCase()}
            </div>
            <div style={{
              fontSize: 20, fontWeight: 700,
              color: isSelected ? "white" : isToday ? accentColor : "var(--theme-ink)",
              fontFamily: '"DM Serif Display", serif',
            }}>
              {date.getDate()}
            </div>
            {isToday && !isSelected && (
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: accentColor, margin: "4px auto 0" }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
