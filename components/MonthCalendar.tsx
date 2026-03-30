"use client";

import { formatDate, isSameDay, getMonthDates } from "@/lib/utils";

interface MonthCalendarProps {
  year: number;
  month: number;
  markedDates?: string[];
  onSelectDate?: (date: Date) => void;
  selectedDate?: string;
  accentColor?: string;
}

const DAY_HEADERS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function MonthCalendar({
  year,
  month,
  markedDates = [],
  onSelectDate,
  selectedDate,
  accentColor = "var(--theme-accent)",
}: MonthCalendarProps) {
  const dates = getMonthDates(year, month);
  const today = new Date();

  return (
    <div>
      {/* Day headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
          marginBottom: 8,
        }}
      >
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--theme-muted)",
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
        }}
      >
        {dates.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} />;
          }

          const dateStr = formatDate(date);
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate === dateStr;
          const isMarked = markedDates.includes(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate?.(date)}
              style={{
                position: "relative",
                height: 36,
                borderRadius: 8,
                border: isSelected
                  ? `2px solid ${accentColor}`
                  : isToday
                  ? `2px solid ${accentColor}40`
                  : "2px solid transparent",
                background: isSelected
                  ? accentColor
                  : isToday
                  ? `${accentColor}10`
                  : "transparent",
                color: isSelected
                  ? "white"
                  : isToday
                  ? accentColor
                  : "var(--theme-muted)",
                fontSize: 13,
                fontWeight: isToday || isSelected ? 700 : 400,
                cursor: onSelectDate ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              {date.getDate()}
              {isMarked && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 3,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: isSelected ? "white" : accentColor,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
