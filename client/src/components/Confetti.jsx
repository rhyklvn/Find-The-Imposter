import React, { useState, useEffect } from "react";

const COLORS = ["#FFD6E7","#E6D6FF","#D6F0FF","#D6FFE8","#FFE5D6","#FFF9D6","#ff6b9d","#c77dff","#48cae4"];

export default function Confetti({ durationMs = 4500 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const ps = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? "circle" : "rect",
    }));
    setParticles(ps);
    const t = setTimeout(() => setParticles([]), durationMs);
    return () => clearTimeout(t);
  }, []);

  if (!particles.length) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: "-20px",
          width: p.size, height: p.size,
          borderRadius: p.shape === "circle" ? "50%" : "2px",
          background: p.color,
          animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}
