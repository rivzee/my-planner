"use client";

import { useEffect, useState } from "react";

interface WelcomeAnimationProps {
  name?: string | null;
}

export default function WelcomeAnimation({ name }: WelcomeAnimationProps) {
  const [phase, setPhase] = useState<"hidden" | "enter" | "show" | "exit">("hidden");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const key = "rivanzee-welcomed-v3";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    // Start enter phase
    setPhase("enter");

    // Animate progress bar
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 25 + 15;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
      }
      setProgress(Math.min(prog, 100));
    }, 45);

    // Switch to show (full content)
    const showTimer = setTimeout(() => setPhase("show"), 150);

    // Start exit
    const exitTimer = setTimeout(() => setPhase("exit"), 1400);

    // Remove from DOM
    const removeTimer = setTimeout(() => setPhase("hidden"), 1900);

    return () => {
      clearInterval(interval);
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  const firstName = name?.split(" ")[0] ?? "Rivanzee";
  const hour = new Date().getHours();
  const timeLabel = hour < 10 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : hour < 18 ? "Selamat Sore" : "Selamat Malam";
  const timeEmoji = hour < 10 ? "🌤" : hour < 15 ? "☀" : hour < 18 ? "🌇" : "🌙";

  const isExiting = phase === "exit";
  const isEntering = phase === "enter";

  return (
    <>
      <style>{`
        @keyframes wa-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes wa-fade-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes wa-slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wa-logo-in {
          0%   { opacity: 0; transform: scale(0.6) translateY(10px); }
          70%  { opacity: 1; transform: scale(1.06) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes wa-name-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes wa-bar-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes wa-glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.06); }
        }
        @keyframes wa-orbit {
          from { transform: rotate(0deg) translateX(54px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(54px) rotate(-360deg); }
        }
        @keyframes wa-orbit-2 {
          from { transform: rotate(120deg) translateX(70px) rotate(-120deg); }
          to   { transform: rotate(480deg) translateX(70px) rotate(-480deg); }
        }
        @keyframes wa-orbit-3 {
          from { transform: rotate(240deg) translateX(88px) rotate(-240deg); }
          to   { transform: rotate(600deg) translateX(88px) rotate(-600deg); }
        }
        @keyframes wa-number {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wa-bg-slide {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        @keyframes wa-grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0); }
          60% { transform: translate(1%, 0); }
          70% { transform: translate(0, 1%); }
          80% { transform: translate(0, -1%); }
          90% { transform: translate(-1%, 1%); }
        }

        .wa-overlay {
          animation: wa-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .wa-overlay.exiting {
          animation: wa-fade-out 0.5s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        .wa-logo-wrap {
          animation: wa-logo-in 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) 0.1s both;
        }
        .wa-greeting {
          animation: wa-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }
        .wa-name {
          animation: wa-name-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }
        .wa-sub {
          animation: wa-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }
        .wa-bar-wrap {
          animation: wa-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
        }
        .wa-orbit-dot-1 {
          animation: wa-orbit 3s linear 0.5s infinite;
          position: absolute;
          width: 7px; height: 7px;
          background: #22C55E;
          border-radius: 50%;
          box-shadow: 0 0 8px 2px #22C55E80;
        }
        .wa-orbit-dot-2 {
          animation: wa-orbit-2 4s linear 0.5s infinite;
          position: absolute;
          width: 5px; height: 5px;
          background: #F59E0B;
          border-radius: 50%;
          box-shadow: 0 0 8px 2px #F59E0B80;
        }
        .wa-orbit-dot-3 {
          animation: wa-orbit-3 5s linear 0.5s infinite;
          position: absolute;
          width: 4px; height: 4px;
          background: #60A5FA;
          border-radius: 50%;
          box-shadow: 0 0 8px 2px #60A5FA80;
        }
        .wa-glow {
          animation: wa-glow-pulse 2.5s ease-in-out 0.5s infinite;
        }
      `}</style>

      <div
        className={`wa-overlay${isExiting ? " exiting" : ""}`}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          userSelect: "none",
          overflow: "hidden",
          // Dark, rich background
          background: "linear-gradient(145deg, #0A0A0B 0%, #0F1117 40%, #111820 100%)",
        }}
      >
        {/* ── Ambient background glow ── */}
        <div style={{
          position: "absolute",
          top: "20%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%", right: "20%",
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          top: "60%", left: "15%",
          width: 250, height: 250,
          background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* ── Grid lines (subtle tech texture) ── */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />

        {/* ── Center content ── */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>

          {/* Logo with orbiting dots */}
          <div className="wa-logo-wrap" style={{ position: "relative", marginBottom: 36 }}>
            {/* Glow ring */}
            <div className="wa-glow" style={{
              position: "absolute", inset: -18,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(22,163,74,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Orbit track rings */}
            <div style={{
              position: "absolute",
              inset: -30,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.04)",
            }} />
            <div style={{
              position: "absolute",
              inset: -46,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.03)",
            }} />
            <div style={{
              position: "absolute",
              inset: -64,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.025)",
            }} />

            {/* Orbiting dots */}
            <div style={{ position: "absolute", inset: "-30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="wa-orbit-dot-1" />
            </div>
            <div style={{ position: "absolute", inset: "-46px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="wa-orbit-dot-2" />
            </div>
            <div style={{ position: "absolute", inset: "-64px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="wa-orbit-dot-3" />
            </div>

            {/* Main logo */}
            <div style={{
              width: 80, height: 80,
              background: "linear-gradient(135deg, #16A34A 0%, #0D9488 100%)",
              borderRadius: 24,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 38,
              boxShadow: "0 0 0 1px rgba(22,163,74,0.3), 0 20px 60px rgba(22,163,74,0.3), 0 8px 24px rgba(0,0,0,0.5)",
              position: "relative",
            }}>
              📋
              {/* Shine overlay */}
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: 24,
                background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
                pointerEvents: "none",
              }} />
            </div>
          </div>

          {/* App name (small) */}
          <div className="wa-greeting" style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
            color: "rgba(22,163,74,0.9)",
            marginBottom: 14,
          }}>
            Rivanzee · Personal Planner
          </div>

          {/* Time greeting + name */}
          <div style={{ textAlign: "center" as const, marginBottom: 6 }}>
            <div className="wa-greeting" style={{
              fontSize: "clamp(13px, 2vw, 15px)",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 500,
              marginBottom: 8,
              letterSpacing: "0.04em",
            }}>
              {timeLabel} {timeEmoji}
            </div>
            <h1 className="wa-name" style={{
              margin: 0,
              fontFamily: '"DM Serif Display", serif',
              fontSize: "clamp(44px, 8vw, 68px)",
              fontWeight: 400,
              color: "#FAFAFA",
              letterSpacing: "-1.5px",
              lineHeight: 1.05,
            }}>
              {firstName}
            </h1>
          </div>

          {/* Tagline */}
          <p className="wa-sub" style={{
            margin: "16px 0 0",
            fontSize: 14,
            color: "rgba(255,255,255,0.32)",
            letterSpacing: "0.02em",
            fontWeight: 400,
          }}>
            Siap merencanakan hari yang lebih produktif?
          </p>

          {/* Progress bar */}
          <div className="wa-bar-wrap" style={{ marginTop: 40, width: 180 }}>
            <div style={{
              height: 2,
              background: "rgba(255,255,255,0.07)",
              borderRadius: 999,
              overflow: "hidden",
              position: "relative",
            }}>
              {/* Shimmer effect */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                animation: "wa-bg-slide 1.5s ease-in-out infinite",
              }} />
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #16A34A, #22C55E)",
                borderRadius: 999,
                transition: "width 0.12s ease",
                boxShadow: "0 0 8px rgba(22,163,74,0.6)",
              }} />
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              fontSize: 10,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.04em",
              fontWeight: 600,
            }}>
              <span>Memuat dashboard...</span>
              <span style={{
                color: progress >= 100 ? "rgba(34,197,94,0.8)" : "rgba(255,255,255,0.25)",
                transition: "color 0.3s",
              }}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>

        </div>

        {/* ── Bottom brand watermark ── */}
        <div style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10,
          color: "rgba(255,255,255,0.1)",
          letterSpacing: "0.15em",
          fontWeight: 600,
          textTransform: "uppercase" as const,
          whiteSpace: "nowrap" as const,
        }}>
          © {new Date().getFullYear()} Rivanzee · All Rights Reserved
        </div>

        {/* ── Corner decorations ── */}
        <div style={{ position: "absolute", top: 24, left: 24, width: 40, height: 40, borderTop: "1.5px solid rgba(255,255,255,0.08)", borderLeft: "1.5px solid rgba(255,255,255,0.08)", borderRadius: "4px 0 0 0" }} />
        <div style={{ position: "absolute", top: 24, right: 24, width: 40, height: 40, borderTop: "1.5px solid rgba(255,255,255,0.08)", borderRight: "1.5px solid rgba(255,255,255,0.08)", borderRadius: "0 4px 0 0" }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 40, height: 40, borderBottom: "1.5px solid rgba(255,255,255,0.08)", borderLeft: "1.5px solid rgba(255,255,255,0.08)", borderRadius: "0 0 0 4px" }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 40, height: 40, borderBottom: "1.5px solid rgba(255,255,255,0.08)", borderRight: "1.5px solid rgba(255,255,255,0.08)", borderRadius: "0 0 4px 0" }} />
      </div>
    </>
  );
}
