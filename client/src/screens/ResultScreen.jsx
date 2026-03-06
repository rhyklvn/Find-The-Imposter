import React, { useState } from "react";
import TopBar from "../components/TopBar";
import PlayerAvatar, { avatarStyle } from "../components/PlayerAvatar";
import Confetti from "../components/Confetti";
import { useStyles, GLOBAL_CSS } from "../styles/theme";
import { useGameStore } from "../store/useGameStore";
import { useGameActions } from "../socket/useSocket";
import { CATEGORY_EMOJIS } from "../data/wordDataset";

export default function ResultScreen({ onHome }) {
  const dark   = useGameStore(s => s.dark);
  const myId   = useGameStore(s => s.myId);
  const room   = useGameStore(s => s.room);
  const S = useStyles(dark);
  const dm = dark;
  const { nextRound } = useGameActions();
  const [confetti] = useState(true);

  const isHost = room?.hostId === myId;

  // Result data comes as top-level fields on safeRoom during result phase
  const imposterIds   = room?.imposterIds   || [];
  const word          = room?.roundWord     || "?";
  const category      = room?.roundCategory || room?.settings?.category || "?";
  const imposters     = (room?.players || []).filter(p => imposterIds.includes(p.id));
  const allPlayers    = room?.players || [];

  // Vote tally
  const tally = {};
  Object.values(room?.votes || {}).forEach(id => { tally[id] = (tally[id] || 0) + 1; });
  const maxVotes  = Math.max(0, ...Object.values(tally));
  const mostVoted = Object.keys(tally).filter(id => tally[id] === maxVotes && maxVotes > 0);

  // Players who participated in the round (had roles)
  const roundPlayerIds = room?.round?.playerIds || [];
  const activePlayers  = roundPlayerIds.length > 0
    ? allPlayers.filter(p => roundPlayerIds.includes(p.id))
    : allPlayers;

  return (
    <div style={S.root}>
      <style>{GLOBAL_CSS(dark)}</style>
      {confetti && <Confetti />}
      <TopBar onBack={onHome} />
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column", alignItems: "center" }}>

        <div style={{ fontSize: 64, marginTop: 16, marginBottom: 4, animation: "shake 0.6s ease" }}>🎭</div>
        <h1 style={{ ...S.h1, fontSize: 24, marginBottom: 4 }}>
          THE IMPOSTER{imposters.length > 1 ? "S WERE" : " WAS"}…
        </h1>

        {/* Imposter reveal */}
        {imposters.length > 0 ? imposters.map(p => {
          const av = avatarStyle(p.name);
          return (
            <div key={p.id} style={{ ...S.card, width: "100%", textAlign: "center", animation: "spotlight 0.6s ease", border: `2px solid ${av.border}`, background: av.bg }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: av.bg, border: `3px solid ${av.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 26, color: av.text, margin: "0 auto 10px", boxShadow: `0 4px 20px ${av.shadow}` }}>
                {p.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: av.text, letterSpacing: 1 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: av.text, opacity: 0.7, marginTop: 4 }}>🕵️ The Imposter</div>
            </div>
          );
        }) : (
          <div style={{ ...S.card, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🤷</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: dm ? "#d8c8ff" : "#7b1fa2" }}>No imposter data yet</div>
          </div>
        )}

        {/* Secret word */}
        <div style={{ ...S.card, width: "100%", textAlign: "center", background: "linear-gradient(135deg,#E6D6FF,#D6F0FF)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#0277bd", marginBottom: 6 }}>The Secret Word Was</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#1a5276" }}>{word}</div>
          <div style={{ fontSize: 12, color: "#0277bd", opacity: 0.7, marginTop: 4 }}>{CATEGORY_EMOJIS[category] || "🎯"} {category}</div>
        </div>

        {/* Vote tally */}
        {Object.keys(tally).length > 0 && (
          <div style={{ ...S.card, width: "100%" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: dm ? "#d8c8ff" : "#3d1c6e", marginBottom: 12 }}>🗳️ Vote Results</div>
            {activePlayers.map(p => {
              const votes = tally[p.id] || 0;
              const isTop = mostVoted.includes(p.id);
              const isImp = imposterIds.includes(p.id);
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 14, marginBottom: 6, background: isImp ? (dm ? "rgba(255,107,157,0.12)" : "#ffe0ec") : isTop ? (dm ? "rgba(255,152,0,0.12)" : "#fff8e1") : (dm ? "rgba(255,255,255,0.03)" : "#fafafa"), border: isImp ? "2px solid #ff6b9d" : isTop ? "2px solid #ff9800" : "2px solid transparent" }}>
                  <PlayerAvatar name={p.name} size={32} />
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontWeight: 900, fontSize: 14, color: "#c77dff" }}>{votes} vote{votes !== 1 ? "s" : ""}</span>
                    {isImp && <span style={{ fontSize: 12, background: "#ff6b9d22", color: "#c2185b", padding: "2px 8px", borderRadius: 8, fontWeight: 700 }}>🕵️ Imposter</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* All players */}
        <div style={{ ...S.card, width: "100%" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom: 10 }}>All players</div>
          {allPlayers.map(p => {
            const wasInRound = roundPlayerIds.length === 0 || roundPlayerIds.includes(p.id);
            const isImp = imposterIds.includes(p.id);
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <PlayerAvatar name={p.name} size={28} />
                <span style={{ fontSize: 12, fontWeight: 700, color: isImp ? "#c2185b" : wasInRound ? "#2e7d32" : "#b45309", background: isImp ? "#ffe0ec" : wasInRound ? "#d6ffe8" : "#fff9d6", padding: "3px 10px", borderRadius: 8 }}>
                  {!wasInRound ? "👑 Host" : isImp ? "🕵️ Imposter" : "😊 Player"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div style={{ ...S.card, width: "100%", background: dm ? "rgba(199,125,255,0.08)" : "rgba(199,125,255,0.05)", border: "1.5px solid rgba(199,125,255,0.2)" }}>
          {isHost ? (
            <>
              <button style={{ ...S.btn("linear-gradient(135deg,#c77dff,#ff6b9d)", "#fff", "rgba(199,125,255,0.5)"), fontSize: 16, padding: "16px", marginBottom: 10 }} onClick={() => nextRound()}>
                🔄 Play Again!
              </button>
              <button style={{ ...S.btn(dm ? "rgba(255,255,255,0.08)" : "#f8f0ff", dm ? "#d8c8ff" : "#7b4fc8", "rgba(160,100,220,0.1)"), border: `1.5px solid ${dm ? "rgba(199,125,255,0.2)" : "#e6d6ff"}`, fontSize: 14, padding: "12px" }} onClick={onHome}>
                🏠 Back to Home
              </button>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", fontSize: 13, color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom: 12 }}>Waiting for host to start next round…</div>
              <button style={{ ...S.btn(dm ? "rgba(255,255,255,0.08)" : "#f8f0ff", dm ? "#d8c8ff" : "#7b4fc8", "rgba(160,100,220,0.1)"), border: `1.5px solid ${dm ? "rgba(199,125,255,0.2)" : "#e6d6ff"}`, fontSize: 14, padding: "12px" }} onClick={onHome}>
                🏠 Back to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
