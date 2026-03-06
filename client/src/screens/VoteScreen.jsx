import React from "react";
import TopBar from "../components/TopBar";
import PlayerAvatar, { avatarStyle } from "../components/PlayerAvatar";
import { useStyles, GLOBAL_CSS } from "../styles/theme";
import { useGameStore } from "../store/useGameStore";
import { useVoteActions } from "../socket/useSocket";
import { useSound } from "../hooks/useSound";

export default function VoteScreen({ onHome }) {
  const dark     = useGameStore(s => s.dark);
  const myId     = useGameStore(s => s.myId);
  const myRole   = useGameStore(s => s.myRole);
  const room     = useGameStore(s => s.room);
  const myVote   = useGameStore(s => s.myVote);
  const voteSent = useGameStore(s => s.voteSent);
  const setMyVote   = useGameStore(s => s.setMyVote);
  const setVoteSent = useGameStore(s => s.setVoteSent);
  const S = useStyles(dark);
  const sound = useSound();
  const { submitVote, forceResult } = useVoteActions();
  const isHost = room?.hostId === myId;

  if (!room?.round) return null;

  const activePlayers = Object.keys(room.round.roles || {})
    .map(id => room.players.find(p => p.id === id))
    .filter(Boolean);

  const voteCount = Object.keys(room.votes || {}).length;

  function handleVote(suspectId) {
    if (voteSent) return;
    setMyVote(suspectId);
    sound("vote");
  }

  function handleSubmit() {
    if (!myVote || voteSent) return;
    setVoteSent(true);
    submitVote(myVote, (res) => {
      if (res?.error) { setVoteSent(false); }
    });
  }

  return (
    <div style={S.root}>
      <style>{GLOBAL_CSS(dark)}</style>
      <TopBar />
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 48, marginTop: 8, marginBottom: 4 }}>🗳️</div>
        <h1 style={{ ...S.h1, fontSize: 24, marginBottom: 4 }}>Vote!</h1>
        <p style={S.sub}>Who do you think is the imposter? 🤔</p>

        {voteSent ? (
          <div style={{ ...S.card, width: "100%", textAlign: "center", background: dark ? "rgba(102,187,106,0.1)" : "#d6ffe8", border: "2px solid #6fcf97" }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>✅</div>
            <div style={{ fontWeight: 900, fontSize: 15, color: "#2e7d32", marginBottom: 4 }}>Vote submitted!</div>
            <div style={{ fontSize: 13, color: dark ? "#b8a0cc" : "#8b6aaa" }}>
              You voted for <strong>{room.players.find(p => p.id === myVote)?.name || "?"}</strong>
            </div>
            <div style={{ fontSize: 12, color: dark ? "#8870aa" : "#aaa", marginTop: 6 }}>
              {voteCount} / {activePlayers.length} voted
            </div>
          </div>
        ) : !myRole || myRole.type === "host" ? (
          <div style={{ ...S.card, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>👑</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: dark ? "#d8c8ff" : "#7b1fa2" }}>You're the host this round.</div>
            <div style={{ fontSize: 13, color: dark ? "#b8a0cc" : "#8b6aaa", marginTop: 4 }}>
              {voteCount} / {activePlayers.length} voted
            </div>
          </div>
        ) : (
          <>
            <div style={{ ...S.card, width: "100%" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: dark ? "#b8a0cc" : "#8b6aaa", marginBottom: 12 }}>Tap to select, then submit:</div>
              {activePlayers.filter(p => p.id !== myId).map(p => {
                const av = avatarStyle(p.name);
                const selected = myVote === p.id;
                return (
                  <button key={p.id} onClick={() => handleVote(p.id)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 16, marginBottom: 8,
                    background: selected ? av.bg : (dark ? "rgba(255,255,255,0.04)" : "#fafafa"),
                    border: selected ? `2.5px solid ${av.border}` : "2.5px solid #eee",
                    cursor: "pointer", transition: "all 0.2s",
                    boxShadow: selected ? `0 4px 16px ${av.shadow}` : "none",
                  }}>
                    <PlayerAvatar name={p.name} size={36} showName={false} />
                    <span style={{ fontWeight: 800, fontSize: 16, color: selected ? av.text : (dark ? "#f0e8ff" : "#2d1b4e"), flex: 1, textAlign: "left" }}>{p.name}</span>
                    {selected && <span style={{ fontSize: 18 }}>✓</span>}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!myVote}
              style={{ ...S.btn(myVote ? "linear-gradient(135deg,#c77dff,#ff6b9d)" : (dark ? "rgba(255,255,255,0.08)" : "#e0e0e0"), myVote ? "#fff" : (dark ? "#555" : "#aaa"), "rgba(199,125,255,0.5)"), cursor: myVote ? "pointer" : "not-allowed" }}
            >🗳️ Submit Vote</button>
          </>
        )}

        {/* Vote progress bar */}
        <div style={{ ...S.card, width: "100%", marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: dark ? "#b8a0cc" : "#8b6aaa", marginBottom: 10 }}>
            Votes: {voteCount} / {activePlayers.length}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {activePlayers.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < voteCount ? "linear-gradient(90deg,#c77dff,#ff6b9d)" : "#e6d6ff", transition: "background 0.4s" }} />
            ))}
          </div>
        </div>

        {isHost && (
          <button style={{ ...S.btn("linear-gradient(135deg,#ff6b9d,#c77dff)", "#fff", "rgba(199,125,255,0.5)"), fontSize: 13, marginTop: 4 }} onClick={() => forceResult()}>
            Skip → Reveal Result
          </button>
        )}
        <button style={{ ...S.btn(dark ? "rgba(255,255,255,0.08)" : "#f8f0ff", dark ? "#d8c8ff" : "#7b4fc8", "rgba(160,100,220,0.1)"), border: `1.5px solid ${dark ? "rgba(199,125,255,0.2)" : "#e6d6ff"}`, fontSize: 13, padding: "11px", marginTop: 4 }} onClick={onHome}>
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}
