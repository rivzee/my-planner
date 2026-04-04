// Storage prefix saat ini (bisa diubah saat user login)
let _userPrefix = "guest";
let _lastSyncedUser = ""; 
let _isSyncing = false;

// Pull data dari Vercel Postgres ke localStorage saat login
export async function setStorageUser(userId: string) {
  _userPrefix = userId;

  if (userId !== "guest" && _lastSyncedUser !== userId) {
    _lastSyncedUser = userId;
    try {
      _isSyncing = true;
      const res = await fetch(`/api/sync?userId=${userId}`);
      if (res.ok) {
        const { data } = await res.json();
        if (data && data.length > 0) {
          data.forEach((row: any) => {
            const localKey = `planner-${userId}-${row.key}`;
            localStorage.setItem(localKey, JSON.stringify(row.value));
          });
        }
      }
    } catch (e) {
      console.error("Failed to sync from PG:", e);
    } finally {
      _isSyncing = false;
    }
  }
}

export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(`planner-${_userPrefix}-${key}`);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, value: unknown) => {
    if (typeof window === "undefined") return;
    
    // Save locally for instant UI update
    localStorage.setItem(`planner-${_userPrefix}-${key}`, JSON.stringify(value));
    
    // Background sync to Postgres if logged in and not currently auto-syncing the load
    if (_userPrefix !== "guest" && !_isSyncing) {
      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: _userPrefix, key, value })
      }).catch(err => console.error("Sync failed:", err));
    }
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
