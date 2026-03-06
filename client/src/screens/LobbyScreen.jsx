import React from "react";
import TopBar from "../components/TopBar";
import PlayerAvatar from "../components/PlayerAvatar";
import ImposterSelector from "../components/ImposterSelector";
import { useStyles, GLOBAL_CSS } from "../styles/theme";
import { useGameStore } from "../store/useGameStore";
import { useRoomActions, useGameActions } from "../socket/useSocket";
import { CATEGORIES, CATEGORY_EMOJIS } from "../data/wordDataset";

export default function LobbyScreen({ onLeave }) {
  const dark    = useGameStore(s => s.dark);
  const myId    = useGameStore(s => s.myId);
  const room    = useGameStore(s => s.room);
  const S = useStyles(dark);
  const dm = dark;

  const { updateSettings, claimHost, leaveRoom } = useRoomActions();
  const { startGame } = useGameActions();

  if (!room) return null;

  const isHost  = room.hostId  === myId;
  const isOwner = room.ownerId === myId;
  const activePlayers = room.players; // everyone in lobby is a potential player
  const shortfall = Math.max(0, 3 - activePlayers.length);
  const canStart  = isHost && activePlayers.length >= 3;
  const { category, difficulty, imposterCount } = room.settings;

  function handleLeave() {
    leaveRoom(() => onLeave());
  }

  return (
    <div style={S.root}>
      <style>{GLOBAL_CSS(dark)}</style>
      <TopBar onBack={handleLeave} />
      <div style={S.wrap}>

        {/* Room Code Banner */}
        <div style={{ ...S.card, background: "linear-gradient(135deg,#c77dff22,#ff6b9d22)", border: "2px solid rgba(199,125,255,0.3)", textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom: 4 }}>Room Code</div>
          <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: 8, background: "linear-gradient(90deg,#c77dff,#ff6b9d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{room.code}</div>
          <div style={{ fontSize: 12, color: dm ? "#b8a0cc" : "#8b6aaa", marginTop: 4 }}>Share this code with friends 👆</div>
        </div>

        {/* Players */}
        <div style={S.card}>
          <div style={{ ...S.h2, marginBottom: 12 }}>👥 Players ({room.players.length})</div>
          {room.players.map(p => {
            const isMe      = p.id === myId;
            const isThisHost  = p.id === room.hostId;
            const isThisOwner = p.id === room.ownerId;
            const av = { text: `hsl(${Array.from(p.name).reduce((h,c)=>(h*31+c.charCodeAt(0))%360,0)},55%,38%)` };
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 14, marginBottom: 6, background: isMe ? (dm ? "rgba(199,125,255,0.15)" : "rgba(199,125,255,0.08)") : (dm ? "rgba(255,255,255,0.03)" : "#fafafa"), border: isMe ? `1.5px solid ${av.text}` : "1.5px solid transparent" }}>
                <PlayerAvatar name={p.name} size={38} />
                <div style={{ display: "flex", gap: 4 }}>
                  {isMe        && <span style={{ fontSize: 11, fontWeight: 700, background: "#e6d6ff", color: "#7b1fa2", padding: "3px 8px", borderRadius: 8 }}>You</span>}
                  {isThisHost  && <span style={{ fontSize: 11, fontWeight: 700, background: "#fff9d6", color: "#b45309", padding: "3px 8px", borderRadius: 8 }}>👑 Host</span>}
                  {isThisOwner && !isThisHost && <span style={{ fontSize: 11, fontWeight: 700, background: "#d6f0ff", color: "#0277bd", padding: "3px 8px", borderRadius: 8 }}>🏠 Owner</span>}
                </div>
              </div>
            );
          })}
          {room.players.length === 1 && <div style={{ textAlign: "center", padding: "12px 0", color: dm ? "#b8a0cc" : "#8b6aaa", fontSize: 13 }}>Waiting for friends to join… 👀</div>}
        </div>

        {/* Activity log */}
        {(room.messages || []).length > 0 && (
          <div style={{ ...S.card, padding: "12px 16px" }}>
            {(room.messages).slice(-3).map((m, i) => (
              <div key={i} style={{ fontSize: 12, color: dm ? "#b8a0cc" : "#8b6aaa", padding: "3px 0", borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>{m.text}</div>
            ))}
          </div>
        )}

        {/* Claim host */}
        {isOwner && !isHost && (
          <button style={{ ...S.btn("linear-gradient(135deg,#ffd166,#ff9f1c)", "#fff"), marginBottom: 8 }} onClick={() => claimHost()}>
            👑 Claim Host Role
          </button>
        )}

        {/* Host settings */}
        {isHost && (
          <div style={S.card}>
            <div style={S.h2}>⚙️ Settings</div>
            <p style={{ fontSize: 12, color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom: 14, marginTop: 4 }}>Only the host can change these.</p>

            <label style={S.label}>Category</label>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <select style={S.select} value={category} onChange={e => updateSettings({ category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_EMOJIS[c] || "🎯"} {c}</option>)}
              </select>
              <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 12, color: dm ? "#b8a0cc" : "#8b6aaa" }}>▼</div>
            </div>

            <label style={S.label}>Hint Difficulty</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[
                { key: "easy",   emoji: "😊", col: "#D6FFE8", border: "#6fcf97", text: "#2e7d32" },
                { key: "medium", emoji: "🤔", col: "#FFF9D6", border: "#f2c94c", text: "#b45309" },
                { key: "hard",   emoji: "😈", col: "#FFD6E7", border: "#eb5757", text: "#b91c1c" },
              ].map(d => (
                <button key={d.key} onClick={() => updateSettings({ difficulty: d.key })} style={{
                  flex: 1, padding: "10px 4px", borderRadius: 14, cursor: "pointer",
                  border: difficulty === d.key ? `2.5px solid ${d.border}` : "2.5px solid #eee",
                  background: difficulty === d.key ? d.col : "#fafafa",
                  boxShadow: difficulty === d.key ? `0 4px 12px ${d.border}44` : "none",
                  transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                }}>
                  <span style={{ fontSize: 18 }}>{d.emoji}</span>
                  <span style={{ fontWeight: 900, fontSize: 11, color: difficulty === d.key ? d.text : "#999" }}>{d.key.charAt(0).toUpperCase() + d.key.slice(1)}</span>
                </button>
              ))}
            </div>

            <label style={S.label}>Imposters</label>
            <ImposterSelector
              value={imposterCount}
              onChange={v => updateSettings({ imposterCount: v })}
              playerCount={activePlayers.length}
              dark={dark}
            />
          </div>
        )}

        {/* Validation warning */}
        {isHost && activePlayers.length > 0 && activePlayers.length < 3 && (
          <div style={S.warningBox}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#e57373" }}>
              Add at least {shortfall} more player{shortfall !== 1 ? "s" : ""} to start the game.
            </span>
          </div>
        )}

        {/* Start button */}
        {isHost && (
          <button
            onClick={() => startGame()}
            disabled={!canStart}
            style={{
              ...S.btn(canStart ? "linear-gradient(135deg,#c77dff,#ff6b9d)" : (dm ? "rgba(255,255,255,0.08)" : "#e0e0e0"), canStart ? "#fff" : (dm ? "#555" : "#aaa"), "rgba(199,125,255,0.5)"),
              fontSize: 17, padding: "17px", cursor: canStart ? "pointer" : "not-allowed",
            }}
          >
            {activePlayers.length === 0 ? "👥 Waiting for players…"
              : activePlayers.length < 3 ? `⚠️ Need ${shortfall} more player${shortfall !== 1 ? "s" : ""}`
              : `🚀 Start Game (${activePlayers.length} players)`}
          </button>
        )}

        {!isHost && (
          <div style={{ ...S.card, textAlign: "center", background: dm ? "rgba(199,125,255,0.08)" : "rgba(199,125,255,0.05)", border: "1.5px dashed rgba(199,125,255,0.3)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: dm ? "#d8c8ff" : "#7b1fa2", marginBottom: 4 }}>Waiting for host to start…</div>
            <div style={{ fontSize: 12, color: dm ? "#b8a0cc" : "#8b6aaa" }}>The host is configuring settings.</div>
          </div>
        )}
      </div>
    </div>
  );
}
