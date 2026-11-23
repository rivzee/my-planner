"use client";

import React, { useState } from "react";

interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
}

/**
 * MyPlanner Official Master Logo (Gemini Generation)
 * Isometric 3D "M" monogram with ascending Emerald arrow and white focus diamond.
 * TasteSkill Micro-interaction: tactile 180ms ease-out lift & specular highlight.
 */
export default function Logo({
  size = 32,
  className = "",
  style = {},
  interactive = true,
}: LogoProps) {
  const [hovered, setHovered] = useState(false);

  const borderRadius = Math.round(size * 0.22);

  return (
    <div
      className={className}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      style={{
        width: size,
        height: size,
        borderRadius,
        overflow: "hidden",
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: hovered
          ? "0 4px 14px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(16, 185, 129, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
          : "0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        background: "#090A0E",
        border: `1px solid ${hovered ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.08)"}`,
        transform: hovered ? "translateY(-1px) scale(1.02)" : "translateY(0) scale(1)",
        transition:
          "transform 180ms cubic-bezier(0.16, 1, 0.3, 1), border-color 180ms ease-out, box-shadow 180ms ease-out",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
    >
      <img
        src="/logos.png"
        alt="MyPlanner"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 180ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}
