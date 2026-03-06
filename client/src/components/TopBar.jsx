import React from "react";
import { useGameStore } from "../store/useGameStore";

export default function TopBar({ onBack }) {
  const dark        = useGameStore(s => s.dark);
  const muted       = useGameStore(s => s.muted);
  const toggleDark  = useGameStore(s => s.toggleDark);
  const toggleMuted = useGameStore(s => s.toggleMuted);

  const iconBtn = {
    background: dark ? "rgba(255,255,255,0.1)" : "rgba(160,100,220,0.1)",
    border:     dark ? "1.5px solid rgba(255,255,255,0.18)" : "1.5px solid rgba(199,125,255,0.28)",
    borderRadius: 10, width: 34, height: 34, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 17, transition: "all 0.2s", flexShrink: 0, padding: 0, lineHeight: 1,
  };

  return (
    <div style={{
      width: "100%", maxWidth: 480,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 18px 6px",
    }}>
      <div style={{ width: 36, display: "flex", alignItems: "center" }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 22, padding: 4, color: dark ? "#d8c8ff" : "#7b4fc8", lineHeight: 1,
          }}>←</button>
        )}
      </div>

      <div style={{
        fontSize: 18, fontWeight: 900,
        background: "linear-gradient(90deg,#c77dff,#ff6b9d)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        letterSpacing: -0.5, userSelect: "none",
      }}>Find the Imposter</div>

      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button style={iconBtn} onClick={toggleMuted} title={muted ? "Unmute" : "Mute"}>
          {muted ? "🔇" : "🔊"}
        </button>
        <button style={iconBtn} onClick={toggleDark} title={dark ? "Light mode" : "Dark mode"}>
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}
