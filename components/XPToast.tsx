"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  id: number;
  amount: number;
}

export default function XPToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    let nextId = 0;

    const handleXPChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const amount = customEvent.detail?.amount;

      if (typeof amount === "number" && amount > 0) {
        const id = nextId++;
        setToasts((prev) => [...prev, { id, amount }]);

        // Hapus toast setelah animasi selesai (misal 2.5 detik)
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 2500);
      }
    };

    window.addEventListener("xp-changed", handleXPChange);
    return () => window.removeEventListener("xp-changed", handleXPChange);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes toast-slide-up {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          20% { opacity: 1; transform: translateY(0) scale(1.05); }
          30% { transform: translateY(0) scale(1); }
          80% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.95); }
        }
        .xp-toast-anim {
          animation: toast-slide-up 2.3s ease-out forwards;
        }
      `}</style>
      
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="xp-toast-anim"
          style={{
            background: "linear-gradient(135deg, #2D5A3D, #4D9A63)",
            color: "white",
            padding: "12px 20px",
            borderRadius: 100,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 24px rgba(45,90,61,0.25), 0 2px 8px rgba(45,90,61,0.15)",
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          <span style={{ fontSize: 18 }}>⭐</span>
          <span>+{toast.amount} XP</span>
        </div>
      ))}
    </div>
  );
}
