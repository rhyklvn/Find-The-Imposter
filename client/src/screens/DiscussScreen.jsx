import React from "react";
import TopBar from "../components/TopBar";
import Timer from "../components/Timer";
import PlayerAvatar from "../components/PlayerAvatar";
import { useStyles, GLOBAL_CSS } from "../styles/theme";
import { useGameStore } from "../store/useGameStore";
import { useGameActions } from "../socket/useSocket";
import { CATEGORY_EMOJIS } from "../data/wordDataset";

export default function DiscussScreen({ onHome }) {
  const dark  = useGameStore(s => s.dark);
  const myId  = useGameStore(s => s.myId);
  const room  = useGameStore(s => s.room);
  const S = useStyles(dark);
  const dm = dark;
  const { goToVote, nextRound } = useGameActions();

  // Graceful fallback — never return null so screen is never blank
  const category  = room?.round?.category  || room?.settings?.category  || "Unknown";
  const difficulty = room?.round?.difficulty || room?.settings?.difficulty || "medium";
  const players   = room?.players || [];
  const isHost    = room?.hostId === myId;

  return (
    <div style={S.root}>
      <style>{GLOBAL_CSS(dark)}</style>
      <TopBar onBack={onHome} />
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column", alignItems: "center" }}>

        <div style={{ fontSize: 56, marginTop: 8, marginBottom: 4, animation: "popIn 0.5s ease" }}>🗣️</div>
        <h1 style={{ ...S.h1, fontSize: 24, marginBottom: 4 }}>Discussion Time!</h1>
        <p style={S.sub}>Everyone give clues. Find the imposter! 🔍</p>

        {/* Category badge */}
        <div style={{ ...S.card, width: "100%", textAlign: "center", background: "linear-gradient(135deg,#f8e0ff,#ffe0f0)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#9c27b0", marginBottom: 4 }}>Category</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#4a148c" }}>{CATEGORY_EMOJIS[category] || "🎯"} {category}</div>
          <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 6 }}>
            {["easy", "medium", "hard"].map(d => (
              <span key={d} style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 8,
                background: difficulty === d ? "#c77dff22" : "transparent",
                color: difficulty === d ? "#7b1fa2" : dm ? "#8870aa" : "#aaa",
                fontWeight: 700,
              }}>
                {d === "easy" ? "😊 Easy" : d === "medium" ? "🤔 Medium" : "😈 Hard"}
              </span>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div style={{ ...S.card, width: "100%" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom: 12 }}>
            ⏱ Discussion Timer
          </div>
          <Timer initialSeconds={60} />
        </div>

        {/* Players list */}
        <div style={{ ...S.card, width: "100%" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom: 10 }}>
            Players this round ({players.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {players.map(p => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 10px", borderRadius: 10,
                background: dm ? "rgba(255,255,255,0.05)" : "#f8f0ff",
                fontSize: 12, fontWeight: 700, color: dm ? "#d8c8ff" : "#7b4fc8",
              }}>
                <PlayerAvatar name={p.name} size={22} showName={false} />
                {p.name}
                {p.id === room?.hostId && (
                  <span style={{ fontSize: 10, background: "#fff9d6", color: "#b45309", padding: "1px 5px", borderRadius: 4 }}>Host</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Host controls */}
        {isHost ? (
          <div style={{ ...S.card, width: "100%", background: dm ? "rgba(199,125,255,0.08)" : "rgba(199,125,255,0.05)", border: "1.5px solid rgba(199,125,255,0.2)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: dm ? "#d8c8ff" : "#7b1fa2", marginBottom: 12 }}>👑 Host Controls</div>
            <button
              style={{ ...S.btn("linear-gradient(135deg,#ff6b9d,#c77dff)", "#fff", "rgba(199,125,255,0.5)"), fontSize: 15, padding: "14px", marginBottom: 10 }}
              onClick={() => goToVote()}
            >
              🗳️ Start Voting
            </button>
            <button
              style={{ ...S.btn("linear-gradient(135deg,#48cae4,#0096c7)", "#fff", "rgba(72,202,228,0.4)"), fontSize: 15, padding: "14px", marginBottom: 10 }}
              onClick={() => nextRound()}
            >
              🔄 Skip to Next Round
            </button>
            <button
              style={{ ...S.btn(dm ? "rgba(255,255,255,0.08)" : "#f8f0ff", dm ? "#d8c8ff" : "#7b4fc8", "rgba(160,100,220,0.1)"), border: `1.5px solid ${dm ? "rgba(199,125,255,0.2)" : "#e6d6ff"}`, fontSize: 14, padding: "12px" }}
              onClick={onHome}
            >
              🏠 Back to Home
            </button>
          </div>
        ) : (
          <div style={{ ...S.card, width: "100%", textAlign: "center", background: dm ? "rgba(255,255,255,0.03)" : "#fafafa" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: dm ? "#d8c8ff" : "#7b1fa2", marginBottom: 4 }}>
              Discuss with your group!
            </div>
            <div style={{ fontSize: 12, color: dm ? "#b8a0cc" : "#8b6aaa" }}>
              Waiting for host to start voting…
            </div>
            <button
              style={{ ...S.btn(dm ? "rgba(255,255,255,0.08)" : "#f8f0ff", dm ? "#d8c8ff" : "#7b4fc8", "rgba(160,100,220,0.1)"), border: `1.5px solid ${dm ? "rgba(199,125,255,0.2)" : "#e6d6ff"}`, fontSize: 13, padding: "10px", marginTop: 8 }}
              onClick={onHome}
            >
              🏠 Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
