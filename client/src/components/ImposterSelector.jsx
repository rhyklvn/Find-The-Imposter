import React from "react";
import { useGameStore } from "../store/useGameStore";

/**
 * Dynamic imposter picker that enforces player-count rules.
 * Props: value, onChange, playerCount, dark
 */
export default function ImposterSelector({ value, onChange, playerCount, dark }) {
  const dm = dark;
  const maxImposters = Math.min(3, Math.max(1, Math.floor((playerCount - 1) / 2)));
  const allowedOptions = playerCount >= 6 ? [1, 2, 3] : [1, 2];

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        {allowedOptions.map(n => {
          const isSelected = value === n;
          const isDisabled = n > maxImposters;
          return (
            <button
              key={n}
              onClick={() => !isDisabled && onChange(n)}
              style={{
                flex: 1, padding: "10px 4px", borderRadius: 14,
                cursor: isDisabled ? "not-allowed" : "pointer",
                border: isSelected ? "2.5px solid #c77dff" : "2.5px solid #eee",
                background: isSelected ? "#f0e0ff" : (dm ? "rgba(255,255,255,0.04)" : "#fafafa"),
                boxShadow: isSelected ? "0 4px 12px rgba(199,125,255,0.3)" : "none",
                opacity: isDisabled ? 0.35 : 1,
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              }}
            >
              <span style={{ fontSize: 18, filter: isDisabled ? "grayscale(1)" : "none" }}>
                {"🕵️".repeat(n)}
              </span>
              <span style={{ fontWeight: 900, fontSize: 11, color: isSelected ? "#7b1fa2" : isDisabled ? "#ccc" : "#999" }}>
                {n} {n === 1 ? "Imposter" : "Imposters"}
              </span>
              {isDisabled && <span style={{ fontSize: 9, color: "#ccc" }}>🔒</span>}
            </button>
          );
        })}
      </div>
      {playerCount >= 3 && playerCount < 6 && (
        <p style={{ fontSize: 11, color: dm ? "#8870aa" : "#aaa", marginTop: 8, marginBottom: 0, textAlign: "center" }}>
          💡 {6 - playerCount} more player{6 - playerCount !== 1 ? "s" : ""} to unlock 3 imposters
        </p>
      )}
    </div>
  );
}
