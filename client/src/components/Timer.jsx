import React, { useState, useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import { useSound } from "../hooks/useSound";

export default function Timer({ initialSeconds = 60, onExpire }) {
  const [sec, setSec]         = useState(initialSeconds);
  const [active, setActive]   = useState(false);
  const [done, setDone]       = useState(false);
  const dark = useGameStore(s => s.dark);
  const sound = useSound();

  useEffect(() => {
    if (!active || done) return;
    if (sec <= 0) { setDone(true); setActive(false); sound("vote"); onExpire?.(); return; }
    const t = setTimeout(() => setSec(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [active, sec, done]);

  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  const color = sec <= 10 ? "#e53935" : (dark ? "#d8c8ff" : "#4a1d6b");

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 64, fontWeight: 900, fontVariantNumeric: "tabular-nums", color, letterSpacing: 2, lineHeight: 1, transition: "color 0.3s" }}>
        {mm}:{ss}
      </div>
      {done && <div style={{ fontSize: 14, fontWeight: 800, color: "#e53935", marginTop: 8, animation: "shake 0.5s ease" }}>⏰ Time's Up!</div>}
      <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "center" }}>
        <button
          onClick={() => setActive(a => !a)}
          style={{
            flex: 1, maxWidth: 160, padding: "12px", borderRadius: 14,
            fontWeight: 800, fontSize: 14, cursor: "pointer", border: "none",
            background: active ? "#ff6b9d22" : "linear-gradient(135deg,#c77dff,#ff6b9d)",
            color: active ? (dark ? "#ff6b9d" : "#c2185b") : "#fff",
            boxShadow: active ? "none" : "0 4px 16px rgba(199,125,255,0.4)",
          }}
        >{done ? "✓ Done" : active ? "⏸ Pause" : "▶ Start"}</button>
        <button
          onClick={() => { setSec(initialSeconds); setActive(false); setDone(false); }}
          style={{
            padding: "12px 16px", borderRadius: 14, fontWeight: 800, fontSize: 14,
            cursor: "pointer",
            border: dark ? "1.5px solid rgba(255,255,255,0.15)" : "1.5px solid #e6d6ff",
            background: "transparent", color: dark ? "#d8c8ff" : "#8b6aaa",
          }}
        >↺ Reset</button>
      </div>
    </div>
  );
}
