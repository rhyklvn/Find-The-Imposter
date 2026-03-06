import React, { useState } from "react";
import TopBar from "../components/TopBar";
import { useStyles, GLOBAL_CSS } from "../styles/theme";
import { useGameStore } from "../store/useGameStore";
import { useRoomActions } from "../socket/useSocket";

export default function CreateScreen({ onBack, onCreated }) {
  const dark = useGameStore(s => s.dark);
  const setMyName = useGameStore(s => s.setMyName);
  const setRoom = useGameStore(s => s.setRoom);
  const S = useStyles(dark);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { createRoom } = useRoomActions();

  function handleCreate() {
    if (!name.trim()) { setError("Enter your name first!"); return; }
    setLoading(true);
    createRoom(name.trim(), (res) => {
      setLoading(false);
      if (res.error) { setError(res.error); return; }
      setMyName(name.trim());
      setRoom(res.room);
      onCreated();
    });
  }

  return (
    <div style={S.root}>
      <style>{GLOBAL_CSS(dark)}</style>
      <TopBar onBack={onBack} />
      <div style={S.wrap}>
        <h1 style={{ ...S.h1, fontSize: 26, textAlign: "left", marginBottom: 4 }}>🏠 Create a Room</h1>
        <p style={{ ...S.sub, textAlign: "left", marginBottom: 24 }}>You'll be the room owner. Share the code with friends!</p>

        <div style={S.card}>
          <label style={S.label}>Your Name</label>
          <input
            style={S.input}
            placeholder="Enter your name…"
            value={name}
            onChange={e => { setName(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleCreate()}
            maxLength={16}
            autoFocus
          />
          {error && <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: "#e57373" }}>⚠️ {error}</div>}
        </div>

        <button
          style={{ ...S.btn(name.trim() && !loading ? "linear-gradient(135deg,#c77dff,#ff6b9d)" : "#ddd", "#fff", "rgba(199,125,255,0.5)"), fontSize: 17, padding: "17px", cursor: name.trim() && !loading ? "pointer" : "default" }}
          disabled={!name.trim() || loading}
          onClick={handleCreate}
        >
          {loading ? "Creating…" : "🏠 Create Room"}
        </button>
      </div>
    </div>
  );
}
