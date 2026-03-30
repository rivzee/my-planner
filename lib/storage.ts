// Storage prefix saat ini (bisa diubah saat user login)
let _userPrefix = "guest";

export function setStorageUser(userId: string) {
  _userPrefix = userId;
}

export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(`planner-${_userPrefix}-${key}`);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, value: unknown) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`planner-${_userPrefix}-${key}`, JSON.stringify(value));
  },
  remove: (key: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`planner-${_userPrefix}-${key}`);
  },
};

// Global Gamification Helpers
export const getXP = (): number => {
  return storage.get<number>("user-xp") || 0;
};

export const addXP = (amount: number) => {
  if (typeof window === "undefined") return;
  const currentXP = getXP();
  const nextXP = Math.max(0, currentXP + amount); // Biar tidak minus
  storage.set("user-xp", nextXP);
  // Pancarkan event agar Sidebar menangkap perubahannya dan Toast memunculkan notifikasi
  window.dispatchEvent(new CustomEvent("xp-changed", { detail: { amount } }));
};
