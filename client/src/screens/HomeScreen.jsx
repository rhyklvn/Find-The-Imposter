import React from "react";
import TopBar from "../components/TopBar";
import { useStyles, GLOBAL_CSS } from "../styles/theme";
import { useGameStore } from "../store/useGameStore";

export default function HomeScreen({ onCreate, onJoin, onSingleDevice }) {
  const dark = useGameStore(s => s.dark);
  const S = useStyles(dark);
  const dm = dark;

  return (
    <div style={S.root}>
      <style>{GLOBAL_CSS(dark)}</style>
      <TopBar />
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 24 }}>

        <div style={{ fontSize: 68, marginBottom: 8, animation: "popIn 0.5s ease" }}>🕵️</div>
        <h1 style={S.h1}>
          <span style={{ background: "linear-gradient(90deg,#c77dff,#ff6b9d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Find the</span>
          <br /><span>Imposter</span>
        </h1>
        <p style={{ ...S.sub, marginBottom: 28 }}>Choose how you want to play:</p>

        {/* ── MULTIPLAYER MODE ── */}
        <div style={{ ...S.card, width: "100%", marginBottom: 12, background: dm ? "rgba(199,125,255,0.08)" : "rgba(199,125,255,0.04)", border: dm ? "1.5px solid rgba(199,125,255,0.25)" : "1.5px solid rgba(199,125,255,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 36 }}>📱</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: dm ? "#f0e8ff" : "#2d1b4e" }}>Multiplayer</div>
              <div style={{ fontSize: 12, color: dm ? "#b8a0cc" : "#8b6aaa", lineHeight: 1.4 }}>Each player uses their own phone</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {["🏠 Room code","🔄 Real-time sync","🔒 Private roles","🗳️ Voting phase"].map(t => (
              <span key={t} style={{ fontSize: 11, fontWeight: 700, background: dm ? "rgba(255,255,255,0.08)" : "#fff", color: dm ? "#d8c8ff" : "#7b4fc8", padding: "4px 10px", borderRadius: 12, border: dm ? "1px solid rgba(199,125,255,0.2)" : "1px solid #e6d6ff" }}>{t}</span>
            ))}
          </div>
          <button
            style={{ ...S.btn("linear-gradient(135deg,#c77dff,#ff6b9d)", "#fff", "rgba(199,125,255,0.5)"), fontSize: 16, padding: "14px", marginBottom: 8 }}
            onClick={onCreate}
          >
            🏠 Create Room
          </button>
          <button
            style={{ ...S.btn(dm ? "rgba(255,255,255,0.08)" : "#f8f0ff", dm ? "#d8c8ff" : "#7b4fc8", "rgba(160,100,220,0.1)"), border: `1.5px solid ${dm ? "rgba(199,125,255,0.2)" : "#e6d6ff"}`, fontSize: 16, padding: "14px" }}
            onClick={onJoin}
          >
            🔑 Join Room
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: dm ? "rgba(255,255,255,0.1)" : "#e6d6ff" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: dm ? "#b8a0cc" : "#8b6aaa" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: dm ? "rgba(255,255,255,0.1)" : "#e6d6ff" }} />
        </div>

        {/* ── SINGLE DEVICE MODE ── */}
        <div style={{ ...S.card, width: "100%", marginBottom: 20, background: dm ? "rgba(72,202,228,0.06)" : "rgba(72,202,228,0.04)", border: dm ? "1.5px solid rgba(72,202,228,0.25)" : "1.5px solid rgba(72,202,228,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 36 }}>🖥️</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: dm ? "#f0e8ff" : "#2d1b4e" }}>Single Device</div>
              <div style={{ fontSize: 12, color: dm ? "#b8a0cc" : "#8b6aaa", lineHeight: 1.4 }}>Pass one phone or laptop around</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {["👥 Add player names","🃏 Pass & reveal","⏱ Discussion timer","🎭 Imposter reveal"].map(t => (
              <span key={t} style={{ fontSize: 11, fontWeight: 700, background: dm ? "rgba(255,255,255,0.08)" : "#fff", color: dm ? "#b8e8ff" : "#0277bd", padding: "4px 10px", borderRadius: 12, border: dm ? "1px solid rgba(72,202,228,0.2)" : "1px solid #b3e5fc" }}>{t}</span>
            ))}
          </div>
          <button
            style={{ ...S.btn("linear-gradient(135deg,#48cae4,#0096c7)", "#fff", "rgba(72,202,228,0.4)"), fontSize: 16, padding: "14px" }}
            onClick={onSingleDevice}
          >
            🖥️ Single Device Mode
          </button>
        </div>

        {/* How to play tip */}
        <div style={{ padding: 14, borderRadius: 16, background: dm ? "rgba(255,255,255,0.03)" : "rgba(199,125,255,0.04)", border: dm ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(199,125,255,0.12)", width: "100%", marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>🇵🇭 Tagalog & English words</div>
          <div style={{ fontSize: 11, color: dm ? "#b8a0cc" : "#8b6aaa", lineHeight: 1.6 }}>
            Imposters get a <strong>hint</strong> instead of the secret word. Bluff your way through discussion!
          </div>
        </div>

      </div>
    </div>
  );
}
