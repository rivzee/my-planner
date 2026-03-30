"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{
        width: 38,
        height: 38,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--theme-surface-2)",
        border: "1px solid var(--theme-border)",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: 16,
        color: "var(--theme-ink)",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
      title={isDark ? "Beralih ke Light Mode" : "Beralih ke Dark Mode"}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--theme-surface)";
        e.currentTarget.style.borderColor = "var(--theme-border-2)";
        e.currentTarget.style.transform = "scale(1.05) rotate(15deg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--theme-surface-2)";
        e.currentTarget.style.borderColor = "var(--theme-border)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
