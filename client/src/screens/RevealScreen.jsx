import React, { useState } from "react";
import TopBar from "../components/TopBar";
import FlipCard from "../components/FlipCard";
import PlayerAvatar, { avatarStyle } from "../components/PlayerAvatar";
import { useStyles, GLOBAL_CSS } from "../styles/theme";
import { useGameStore } from "../store/useGameStore";
import { useGameActions } from "../socket/useSocket";
import { useSound } from "../hooks/useSound";

export default function RevealScreen({ onHome }) {
  const dark   = useGameStore(s => s.dark);
  const myId   = useGameStore(s => s.myId);
  const myName = useGameStore(s => s.myName);
  const myRole = useGameStore(s => s.myRole);
  const room   = useGameStore(s => s.room);
  const S = useStyles(dark);
  const sound = useSound();
  const { goToDiscuss } = useGameActions();

  const [revealed, setRevealed]   = useState(false);
  const [hidden, setHidden]       = useState(false);

  if (!room) return null;
  const isHost     = room.hostId === myId;
  const isImposter = myRole?.type === "imposter";
  const av = avatarStyle(myName || "?");

  const frontFace = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <PlayerAvatar name={myName || "?"} size={56} showName={false} />
      <div style={{ fontWeight: 900, fontSize: 18, color: av.text }}>{myName}</div>
      <div style={{ fontSize: 13, color: "#8b6aaa", marginTop: 4, textAlign: "center", lineHeight: 1.5 }}>
        Tap to reveal your role<br /><span style={{ fontSize: 11 }}>🔒 Keep it secret!</span>
      </div>
      <div style={{ fontSize: 36, marginTop: 8, animation: "pulse 2s ease infinite" }}>👆</div>
    </div>
  );

  const backFace = myRole?.type === "host" ? (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "linear-gradient(135deg,#f8f0ff,#fff0f7)" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>👑</div>
      <div style={{ fontWeight: 900, fontSize: 18, color: "#7b1fa2", marginBottom: 8 }}>Host</div>
      <div style={{ fontSize: 13, color: "#8b6aaa", textAlign: "center" }}>You're observing this round.<br />Watch and let players discuss!</div>
    </div>
  ) : isImposter ? (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "linear-gradient(135deg,#1a1025,#3d0a3d)" }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>🕵️</div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#c77dff", marginBottom: 8 }}>You are the</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: "#ff6b9d", letterSpacing: 1, marginBottom: 16 }}>IMPOSTER</div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(199,125,255,0.7)", marginBottom: 6 }}>Your Hint</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", background: "rgba(255,255,255,0.1)", padding: "12px 20px", borderRadius: 14, textAlign: "center" }}>{myRole.hint}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 12, textAlign: "center" }}>Use your hint to bluff!<br />Don't get caught 😈</div>
    </div>
  ) : (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "linear-gradient(135deg,#e3f8e8,#d6f0ff)" }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>😊</div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#0277bd", marginBottom: 8 }}>The secret word is</div>
      <div style={{ fontSize: 30, fontWeight: 900, color: "#1a5276", background: "white", padding: "14px 22px", borderRadius: 14, textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>{myRole?.word}</div>
      <div style={{ fontSize: 11, color: "#0277bd", marginTop: 12, textAlign: "center", opacity: 0.7 }}>Give clues — find the imposter! 🔍</div>
    </div>
  );

  return (
    <div style={S.root}>
      <style>{GLOBAL_CSS(dark)}</style>
      <TopBar onBack={onHome} />
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={{ ...S.h1, fontSize: 20, marginBottom: 0, textAlign: "left" }}>🃏 Your Card</h1>
          <span style={{ fontSize: 12, fontWeight: 700, color: dark ? "#b8a0cc" : "#8b6aaa", background: dark ? "rgba(255,255,255,0.08)" : "rgba(199,125,255,0.08)", padding: "6px 12px", borderRadius: 10 }}>Room {room.code}</span>
        </div>

        {!revealed && !hidden && (
          <FlipCard playerKey={myId} flipped={false} onFlip={() => { sound("flip"); setRevealed(true); }} front={frontFace} back={backFace} />
        )}
        {revealed && !hidden && (
          <>
            <div style={{ width: "100%", maxWidth: 320, borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 40px rgba(140,100,220,0.22)", marginBottom: 16 }}>{backFace}</div>
            <button style={{ ...S.btn("#fff", dark ? "#c77dff" : "#7b1fa2", "rgba(199,125,255,0.15)"), border: "2px solid rgba(199,125,255,0.3)", marginBottom: 8 }} onClick={() => setHidden(true)}>
              🔒 Hide Card
            </button>
          </>
        )}
        {hidden && (
          <div style={{ width: "100%", maxWidth: 320, borderRadius: 28, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: dark ? "#1a1025" : "#2d1b4e", boxShadow: "0 8px 40px rgba(0,0,0,0.3)", marginBottom: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <div style={{ fontWeight: 900, fontSize: 16, color: "rgba(255,255,255,0.6)" }}>Card Hidden</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Safe to pass your phone</div>
          </div>
        )}

        {isHost && (
          <div style={{ ...S.card, width: "100%", textAlign: "center", marginTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: dark ? "#b8a0cc" : "#8b6aaa", marginBottom: 12 }}>👑 Host Controls</div>
            <button style={{ ...S.btn("linear-gradient(135deg,#c77dff,#ff6b9d)", "#fff", "rgba(199,125,255,0.5)"), marginBottom: 0 }} onClick={() => goToDiscuss()}>
              🗣️ Everyone's Ready → Start Discussion
            </button>
          </div>
        )}
        {!isHost && (
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 13, color: dark ? "#b8a0cc" : "#8b6aaa" }}>
            Waiting for host to start discussion…
          </div>
        )}

        <div style={{ ...S.card, width: "100%", marginTop: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: dark ? "#b8a0cc" : "#8b6aaa", marginBottom: 10 }}>Players this round</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {room.players.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.05)" : "#f8f0ff", fontSize: 12, fontWeight: 700, color: dark ? "#d8c8ff" : "#7b4fc8" }}>
                <PlayerAvatar name={p.name} size={22} showName={false} />
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
