"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import { addXP } from "@/lib/storage";
import { Icons } from "@/components/Icons";

const FOCUS_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

type Mode = "focus" | "shortBreak" | "longBreak";

export default function FokusPage() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<Mode>("focus");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleComplete = useCallback(() => {
    setIsActive(false);
    
    // Play a friendly browser beep (using SpeechSynthesis as fallback audio alert)
    try {
      if ("speechSynthesis" in window) {
        const msg = new SpeechSynthesisUtterance("Sesi selesai!");
        msg.lang = "id-ID";
        window.speechSynthesis.speak(msg);
      }
    } catch (e) {
      console.log("Audio not supported");
    }

    if (mode === "focus") {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      // Reward XP!
      const xpReward = 50; 
      addXP(xpReward);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 4000);
      
      // Auto switch to break
      if (newSessions % 4 === 0) {
        setMode("longBreak");
        setTimeLeft(LONG_BREAK);
      } else {
        setMode("shortBreak");
        setTimeLeft(SHORT_BREAK);
      }
    } else {
      // Break is over, back to focus
      setMode("focus");
      setTimeLeft(FOCUS_TIME);
    }
  }, [mode, sessionsCompleted]);

  const toggleTimer = () => setIsActive(!isActive);

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === "focus") setTimeLeft(FOCUS_TIME);
    if (newMode === "shortBreak") setTimeLeft(SHORT_BREAK);
    if (newMode === "longBreak") setTimeLeft(LONG_BREAK);
  };

  const getPercentage = () => {
    let total = FOCUS_TIME;
    if (mode === "shortBreak") total = SHORT_BREAK;
    if (mode === "longBreak") total = LONG_BREAK;
    return (timeLeft / total) * 100;
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="page-wrapper" style={{ background: "var(--theme-bg)" }}>
      <Sidebar />
      <main className="page-main" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        
        <div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
          
          <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 32, marginBottom: 8, color: "var(--theme-ink)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Icons.Timer size={28} style={{ color: "var(--theme-ink-2)", opacity: 0.4 }} />
            Focus Timer
          </h1>
          <p style={{ color: "var(--theme-muted)", fontSize: 15, marginBottom: 40 }}>
            Fokus sejenak. Tingkatkan produktivitas & dapatkan XP.
          </p>

          <div style={{ 
            background: "var(--theme-surface)", 
            border: "1px solid var(--theme-border)", 
            borderRadius: 24, 
            padding: 40,
            boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
            position: "relative"
          }}>
            
            {showReward && (
              <div className="animate-fade-in" style={{
                position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
                background: "linear-gradient(135deg, var(--theme-accent), var(--theme-accent-2))",
                color: "#fff", padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700,
                boxShadow: "0 4px 15px rgba(22,163,74,0.3)", zIndex: 10
              }}>
                +50 XP Didapatkan!
              </div>
            )}

            {/* Mode Selectors */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40 }}>
              {(["focus", "shortBreak", "longBreak"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  style={{
                    background: mode === m ? "var(--theme-surface-2)" : "transparent",
                    color: mode === m ? "var(--theme-ink)" : "var(--theme-muted)",
                    border: "none",
                    borderRadius: 12,
                    padding: "8px 16px",
                    fontSize: 14,
                    fontWeight: mode === m ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {m === "focus" && "Fokus (25m)"}
                  {m === "shortBreak" && "Istirahat (5m)"}
                  {m === "longBreak" && "Istirahat Panjang (15m)"}
                </button>
              ))}
            </div>

            {/* Circle Timer */}
            <div style={{ position: "relative", width: 280, height: 280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="280" height="280" viewBox="0 0 280 280" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
                <circle cx="140" cy="140" r="130" fill="none" stroke="var(--theme-surface-2)" strokeWidth="6" />
                <circle 
                  cx="140" cy="140" r="130" fill="none" 
                  stroke={mode === "focus" ? "var(--theme-accent)" : "var(--theme-blue)"} 
                  strokeWidth="6" strokeLinecap="round" 
                  strokeDasharray={2 * Math.PI * 130}
                  strokeDashoffset={(2 * Math.PI * 130) * ((100 - getPercentage()) / 100)}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                <div style={{ fontSize: 72, fontWeight: 700, fontFamily: '"DM Serif Display", serif', color: mode === "focus" ? "var(--theme-ink)" : "var(--theme-blue)", lineHeight: 1, letterSpacing: "-2px" }}>
                  {formattedTime}
                </div>
                {mode === "focus" && (
                  <div style={{ fontSize: 13, color: "var(--theme-muted)", marginTop: 8, fontWeight: 500 }}>
                    Sesi ke-{sessionsCompleted + 1}
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 40 }}>
              <button
                onClick={toggleTimer}
                style={{
                  background: isActive 
                    ? "var(--theme-surface-2)" 
                    : "linear-gradient(135deg, var(--theme-accent-2), var(--theme-accent))",
                  color: isActive ? "var(--theme-ink)" : "#052e16",
                  border: "none", borderRadius: 16,
                  padding: "16px 32px", fontSize: 16, fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: isActive ? "none" : "0 4px 15px rgba(52,211,153,0.3)",
                  minWidth: 140,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {isActive ? <><Icons.Pause size={16} /> Jeda</> : <><Icons.Play size={16} /> Mulai</>}
              </button>
              
              <button
                onClick={() => {
                  if(mode === "focus") setTimeLeft(FOCUS_TIME);
                  else if(mode === "shortBreak") setTimeLeft(SHORT_BREAK);
                  else setTimeLeft(LONG_BREAK);
                  setIsActive(false);
                }}
                style={{
                  background: "transparent",
                  color: "var(--theme-muted)",
                  border: "1px solid var(--theme-border)", 
                  borderRadius: 16,
                  padding: "16px", fontSize: 16,
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icons.RotateCcw size={18} />
              </button>
            </div>
            
          </div>
          
        </div>
      </main>
    </div>
  );
}
