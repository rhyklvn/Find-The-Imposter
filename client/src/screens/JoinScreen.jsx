import React, { useState } from "react";
import TopBar from "../components/TopBar";
import { useStyles, GLOBAL_CSS } from "../styles/theme";
import { useGameStore } from "../store/useGameStore";
import { useRoomActions } from "../socket/useSocket";
import { useSound } from "../hooks/useSound";

export default function JoinScreen({ onBack, onJoined }) {
  const dark = useGameStore(s => s.dark);
  const setMyName = useGameStore(s => s.setMyName);
  const setRoom = useGameStore(s => s.setRoom);
  const S = useStyles(dark);
  const sound = useSound();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { joinRoom } = useRoomActions();

  function handleJoin() {
    if (!name.trim()) { setError("Enter your name."); return; }
    if (code.length !== 4) { setError("Enter the 4-digit room code."); return; }
    setLoading(true);
    joinRoom(code.trim(), name.trim(), (res) => {
      setLoading(false);
      if (res.error) { setError(res.error); return; }
      setMyName(name.trim());
      setRoom(res.room);
      sound("join");
      onJoined();
    });
  }

  return (
    <div style={S.root}>
      <style>{GLOBAL_CSS(dark)}</style>
      <TopBar onBack={onBack} />
      <div style={S.wrap}>
        <h1 style={{ ...S.h1, fontSize: 26, textAlign: "left", marginBottom: 4 }}>🔑 Join a Room</h1>
        <p style={{ ...S.sub, textAlign: "left", marginBottom: 24 }}>Ask the room owner for their 4-digit code.</p>

        <div style={S.card}>
          <label style={S.label}>Your Name</label>
          <input style={{ ...S.input, marginBottom: 16 }} placeholder="Enter your name…" value={name} onChange={e => { setName(e.target.value); setError(""); }} maxLength={16} autoFocus />
          <label style={S.label}>Room Code</label>
          <input
            style={S.input}
            placeholder="4-digit code (e.g. 4837)"
            value={code}
            onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleJoin()}
            inputMode="numeric"
            maxLength={4}
          />
          {error && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 12, background: "#fff5f5", border: "1.5px solid #ffcdd2", fontSize: 13, fontWeight: 700, color: "#e57373" }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        <button
          style={{ ...S.btn((name.trim() && code.length === 4 && !loading) ? "linear-gradient(135deg,#c77dff,#ff6b9d)" : "#ddd", "#fff", "rgba(199,125,255,0.5)"), fontSize: 17, padding: "17px", cursor: (name.trim() && code.length === 4 && !loading) ? "pointer" : "default" }}
          disabled={!name.trim() || code.length !== 4 || loading}
          onClick={handleJoin}
        >
          {loading ? "Joining…" : "🔑 Join Room"}
        </button>
      </div>
    </div>
  );
}
