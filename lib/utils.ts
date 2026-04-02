export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function getDayName(date: Date): string {
  return date.toLocaleDateString("id-ID", { weekday: "long" });
}

export function getMonthName(date: Date): string {
  return date.toLocaleDateString("id-ID", { month: "long" });
}

export function getWeekDates(weekOffset = 0): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7) + weekOffset * 7);
  
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function getMonthDates(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = (firstDay.getDay() + 6) % 7; // Monday first
  
  const dates: (Date | null)[] = [];
  
  // Padding before
  for (let i = 0; i < startPadding; i++) {
    dates.push(null);
  }
  
  // Actual days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    dates.push(new Date(year, month, d));
  }
  
  // Padding after (fill to complete weeks)
  while (dates.length % 7 !== 0) {
    dates.push(null);
  }
  
  return dates;
}

export function isSameDay(a: Date, b: Date): boolean {
  return formatDate(a) === formatDate(b);
}

export function getDaysUntilYearEnd(): number {
  const now = new Date();
  const yearEnd = new Date(now.getFullYear(), 11, 31);
  const diff = yearEnd.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getYearProgress(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);
  return Math.round(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100);
}

export function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    karier: "#C45B3A",
    kesehatan: "#2D5A3D",
    belajar: "#2A4A7F",
    keuangan: "#C17D2A",
  };
  return map[cat] ?? "#8B8680";
}

export function getCategoryLabel(cat: string): string {
  const map: Record<string, string> = {
    karier: "Karier",
    kesehatan: "Kesehatan",
    belajar: "Belajar",
    keuangan: "Keuangan",
  };
  return map[cat] ?? cat;
}

export function getCategoryIcon(cat: string): string {
  // Returns a short uppercase abbreviation instead of an emoji
  const map: Record<string, string> = {
    karier: "KAR",
    kesehatan: "KES",
    belajar: "BLJ",
    keuangan: "KEU",
  };
  return map[cat] ?? "—";
}
