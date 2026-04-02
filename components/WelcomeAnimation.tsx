"use client";

import { useEffect, useState } from "react";

interface WelcomeAnimationProps {
  name?: string | null;
}

export default function WelcomeAnimation({ name }: WelcomeAnimationProps) {
  const [phase, setPhase] = useState<"hidden" | "card-in" | "card-show" | "card-expand" | "exit">("hidden");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const key = "rivanzee-welcomed-v4";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    // Phase 1: Card flies in
    setPhase("card-in");

    // Animate progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 18 + 10;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
      }
      setProgress(Math.min(prog, 100));
    }, 60);

    // Phase 2: Card fully shown with content
    const showTimer = setTimeout(() => setPhase("card-show"), 400);

    // Phase 3: Card expands and fades
    const expandTimer = setTimeout(() => setPhase("card-expand"), 2400);

    // Phase 4: Remove
    const removeTimer = setTimeout(() => setPhase("hidden"), 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(showTimer);
      clearTimeout(expandTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  const firstName = name?.split(" ")[0] ?? "Rivanzee";
  const hour = new Date().getHours();
  const timeLabel = hour < 10 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : hour < 18 ? "Selamat Sore" : "Selamat Malam";

  return (
    <>
      <style>{`
        /* ── Overlay ── */
        @keyframes wa-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes wa-overlay-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        /* ── Card entrance ── */
        @keyframes wa-card-enter {
          0% {
            opacity: 0;
            transform: perspective(1200px) rotateX(25deg) translateY(80px) scale(0.7);
            filter: blur(8px);
          }
          50% {
            opacity: 1;
            filter: blur(1px);
          }
          80% {
            transform: perspective(1200px) rotateX(-3deg) translateY(-8px) scale(1.02);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: perspective(1200px) rotateX(0deg) translateY(0) scale(1);
            filter: blur(0);
          }
        }

        /* ── Card expand out ── */
        @keyframes wa-card-expand {
          0% {
            opacity: 1;
            transform: perspective(1200px) rotateX(0deg) scale(1);
            filter: blur(0);
          }
          40% {
            opacity: 1;
            transform: perspective(1200px) rotateX(-2deg) scale(1.08);
          }
          100% {
            opacity: 0;
            transform: perspective(1200px) rotateX(8deg) scale(1.5);
            filter: blur(12px);
          }
        }

        /* ── Logo pulse ── */
        @keyframes wa-logo-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }

        /* ── Shimmer sweep on card ── */
        @keyframes wa-shimmer {
          0%   { transform: translateX(-150%) rotate(25deg); }
          100% { transform: translateX(250%) rotate(25deg);  }
        }

        /* ── Glow ring ── */
        @keyframes wa-ring-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.1); }
        }

        /* ── Text reveals ── */
        @keyframes wa-text-up {
          from { opacity: 0; transform: translateY(18px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }

        /* ── Progress bar glow ── */
        @keyframes wa-bar-glow {
          0%, 100% { box-shadow: 0 0 6px rgba(34,197,94,0.4); }
          50%      { box-shadow: 0 0 14px rgba(34,197,94,0.7); }
        }

        /* ── Particle float ── */
        @keyframes wa-particle-1 {
          0%   { opacity: 0; transform: translate(0, 0) scale(0); }
          20%  { opacity: 1; transform: translate(-30px, -40px) scale(1); }
          100% { opacity: 0; transform: translate(-60px, -90px) scale(0.3); }
        }
        @keyframes wa-particle-2 {
          0%   { opacity: 0; transform: translate(0, 0) scale(0); }
          20%  { opacity: 1; transform: translate(35px, -35px) scale(1); }
          100% { opacity: 0; transform: translate(70px, -80px) scale(0.3); }
        }
        @keyframes wa-particle-3 {
          0%   { opacity: 0; transform: translate(0, 0) scale(0); }
          25%  { opacity: 1; transform: translate(-20px, -50px) scale(1); }
          100% { opacity: 0; transform: translate(-45px, -110px) scale(0.2); }
        }
        @keyframes wa-particle-4 {
          0%   { opacity: 0; transform: translate(0, 0) scale(0); }
          25%  { opacity: 1; transform: translate(25px, -55px) scale(1); }
          100% { opacity: 0; transform: translate(55px, -120px) scale(0.2); }
        }

        .wa-overlay-enter {
          animation: wa-overlay-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .wa-overlay-exit {
          animation: wa-overlay-out 0.8s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        .wa-card-entering {
          animation: wa-card-enter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .wa-card-shown {
          animation: none;
          opacity: 1;
          transform: perspective(1200px) rotateX(0deg) translateY(0) scale(1);
        }
        .wa-card-expanding {
          animation: wa-card-expand 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <div
        className={phase === "exit" || phase === "card-expand" ? "wa-overlay-exit" : "wa-overlay-enter"}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          overflow: "hidden",
          background: "linear-gradient(145deg, #07080A 0%, #0B0E14 40%, #0E1219 100%)",
        }}
      >
        {/* ── Background ambient ── */}
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(22,163,74,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", right: "25%",
          width: 350, height: 350,
          background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* ── Grid texture ── */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          pointerEvents: "none",
        }} />

        {/* ═══════ THE CARD ═══════ */}
        <div
          className={
            phase === "card-in" ? "wa-card-entering" :
            phase === "card-expand" || phase === "exit" ? "wa-card-expanding" :
            "wa-card-shown"
          }
          style={{
            position: "relative",
            width: "min(380px, 88vw)",
            background: "linear-gradient(165deg, rgba(20,25,30,0.95) 0%, rgba(14,18,24,0.98) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 28,
            padding: "44px 36px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: `
              0 0 0 1px rgba(22,163,74,0.08),
              0 4px 16px rgba(0,0,0,0.4),
              0 16px 48px rgba(0,0,0,0.5),
              0 32px 80px rgba(0,0,0,0.3),
              inset 0 1px 0 rgba(255,255,255,0.06)
            `,
            transformStyle: "preserve-3d" as const,
            willChange: "transform, opacity",
            zIndex: 2,
          }}
        >
          {/* Card shimmer sweep */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 28,
            overflow: "hidden", pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute",
              top: -40, left: -40, width: "60%", height: "200%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
              animation: "wa-shimmer 2.5s ease-in-out 0.8s infinite",
            }} />
          </div>

          {/* ── Logo Area ── */}
          <div style={{ position: "relative", marginBottom: 28 }}>
            {/* Glow ring behind logo */}
            <div style={{
              position: "absolute", inset: -16, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)",
              animation: "wa-ring-pulse 2.5s ease-in-out infinite",
              pointerEvents: "none",
            }} />

            {/* Floating particles */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", width: 6, height: 6,
              borderRadius: "50%", background: "#22C55E",
              boxShadow: "0 0 8px #22C55E80",
              animation: "wa-particle-1 2.5s ease-out 0.6s infinite",
            }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%", width: 5, height: 5,
              borderRadius: "50%", background: "#60A5FA",
              boxShadow: "0 0 8px #60A5FA80",
              animation: "wa-particle-2 2.8s ease-out 0.9s infinite",
            }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%", width: 4, height: 4,
              borderRadius: "50%", background: "#FBBF24",
              boxShadow: "0 0 8px #FBBF2480",
              animation: "wa-particle-3 3s ease-out 1.2s infinite",
            }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%", width: 3, height: 3,
              borderRadius: "50%", background: "#C084FC",
              boxShadow: "0 0 6px #C084FC80",
              animation: "wa-particle-4 3.2s ease-out 1.5s infinite",
            }} />

            {/* Logo image */}
            <div style={{
              width: 96, height: 96,
              borderRadius: 26,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 0 0 1px rgba(22,163,74,0.25), 0 12px 40px rgba(22,163,74,0.25), 0 4px 16px rgba(0,0,0,0.4)",
              animation: "wa-logo-float 3s ease-in-out 0.5s infinite",
            }}>
              <img
                src="/logos.png"
                alt="Rivanzee"
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {/* Shine overlay */}
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: 26,
                background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%)",
                pointerEvents: "none",
              }} />
            </div>
          </div>

          {/* ── Brand Name ── */}
          <div style={{
            animation: phase !== "card-in" ? "wa-text-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both" : "none",
            opacity: phase === "card-in" ? 0 : undefined,
          }}>
            <div style={{
              fontFamily: '"DM Serif Display", serif',
              fontSize: 28,
              color: "#FAFAFA",
              letterSpacing: "-0.5px",
              textAlign: "center",
              lineHeight: 1.2,
            }}>
              Rivanzee
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "rgba(34,197,94,0.8)",
              textAlign: "center",
              marginTop: 6,
            }}>
              Personal Planner
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{
            width: 40, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
            margin: "20px 0",
            animation: phase !== "card-in" ? "wa-text-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both" : "none",
            opacity: phase === "card-in" ? 0 : undefined,
          }} />

          {/* ── Greeting ── */}
          <div style={{
            animation: phase !== "card-in" ? "wa-text-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.25s both" : "none",
            opacity: phase === "card-in" ? 0 : undefined,
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
              marginBottom: 6,
            }}>
              {timeLabel} 👋
            </div>
            <div style={{
              fontFamily: '"DM Serif Display", serif',
              fontSize: "clamp(28px, 5vw, 38px)",
              color: "#FAFAFA",
              letterSpacing: "-1px",
              lineHeight: 1.1,
            }}>
              {firstName}
            </div>
          </div>

          {/* ── Subtitle ── */}
          <p style={{
            margin: "14px 0 0",
            fontSize: 13,
            color: "rgba(255,255,255,0.25)",
            textAlign: "center",
            lineHeight: 1.5,
            animation: phase !== "card-in" ? "wa-text-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.35s both" : "none",
            opacity: phase === "card-in" ? 0 : undefined,
          }}>
            Siap merencanakan hari yang lebih produktif?
          </p>

          {/* ── Progress Bar ── */}
          <div style={{
            marginTop: 28,
            width: "100%",
            animation: phase !== "card-in" ? "wa-text-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.4s both" : "none",
            opacity: phase === "card-in" ? 0 : undefined,
          }}>
            <div style={{
              height: 3,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 999,
              overflow: "hidden",
              position: "relative",
            }}>
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #16A34A, #22C55E, #34D399)",
                borderRadius: 999,
                transition: "width 0.15s ease",
                animation: "wa-bar-glow 1.5s ease-in-out infinite",
              }} />
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
              fontSize: 10,
              color: "rgba(255,255,255,0.18)",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}>
              <span>Memuat dashboard...</span>
              <span style={{
                color: progress >= 100 ? "rgba(34,197,94,0.7)" : "rgba(255,255,255,0.22)",
                transition: "color 0.3s",
              }}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom watermark ── */}
        <div style={{
          position: "absolute",
          bottom: 28, left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10,
          color: "rgba(255,255,255,0.08)",
          letterSpacing: "0.15em",
          fontWeight: 600,
          textTransform: "uppercase" as const,
          whiteSpace: "nowrap" as const,
        }}>
          © {new Date().getFullYear()} Rivanzee · All Rights Reserved
        </div>

        {/* ── Corner accents ── */}
        <div style={{ position: "absolute", top: 24, left: 24, width: 36, height: 36, borderTop: "1.5px solid rgba(255,255,255,0.06)", borderLeft: "1.5px solid rgba(255,255,255,0.06)", borderRadius: "4px 0 0 0" }} />
        <div style={{ position: "absolute", top: 24, right: 24, width: 36, height: 36, borderTop: "1.5px solid rgba(255,255,255,0.06)", borderRight: "1.5px solid rgba(255,255,255,0.06)", borderRadius: "0 4px 0 0" }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 36, height: 36, borderBottom: "1.5px solid rgba(255,255,255,0.06)", borderLeft: "1.5px solid rgba(255,255,255,0.06)", borderRadius: "0 0 0 4px" }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 36, height: 36, borderBottom: "1.5px solid rgba(255,255,255,0.06)", borderRight: "1.5px solid rgba(255,255,255,0.06)", borderRadius: "0 0 4px 0" }} />
      </div>
    </>
  );
}
