// Task types
export interface Task {
  id: string;
  text: string;
  done: boolean;
  priority?: "high" | "medium" | "low";
  category?: string;
  createdAt: string;
}

// Habit types
export interface Habit {
  id: string;
  name: string;
  icon: string;
  doneDates: string[]; // ISO date strings
}

// Goal types
export interface Goal {
  id: string;
  title: string;
  category: "karier" | "kesehatan" | "belajar" | "keuangan";
  progress: number; // 0-100
  target: string;
  year: number;
}

// AI types
export interface AIResult {
  prioritas: string[];
  saran_jadwal: string;
  pengingat: string;
  motivasi: string;
}

// Quote type
export interface Quote {
  text: string;
  author: string;
}

// Weekly focus
export interface WeeklyNote {
  date: string;
  note: string;
}

// Monthly target
export interface MonthlyTarget {
  id: string;
  text: string;
  done: boolean;
  note?: string; // Catatan opsional jika pencapaian melebihi target atau ada hal penting
}

// Planner context for AI
export interface PlannerData {
  tasks: {
    pending: string[];
    done: string[];
  };
  habits: Array<{
    name: string;
    streak: number;
  }>;
  goals: Array<{
    title: string;
    progress: number;
    cat: string;
  }>;
  context: {
    day: string;
    time: string;
    focusAreas: string[];
  };
}
