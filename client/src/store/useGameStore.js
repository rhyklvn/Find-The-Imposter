import { create } from "zustand";

function genPlayerId() {
  // Persist across page reloads so reconnect works
  const stored = sessionStorage.getItem("imposter_pid");
  if (stored) return stored;
  const id = Math.random().toString(36).slice(2, 10);
  sessionStorage.setItem("imposter_pid", id);
  return id;
}

export const useGameStore = create((set, get) => ({
  // ── Identity ──────────────────────────────────────────────────────────────
  myId:   genPlayerId(),
  myName: "",
  setMyName: (name) => set({ myName: name }),

  // ── Room ──────────────────────────────────────────────────────────────────
  room:     null,
  roomCode: "",
  setRoom: (room) => set({ room, roomCode: room?.code || "" }),
  clearRoom: () => set({ room: null, roomCode: "", myRole: null }),

  // ── Role (private — received via socket "game:yourRole") ─────────────────
  // { type: "player"|"imposter"|"host", word?: string, hint?: string }
  myRole: null,
  setMyRole: (role) => set({ myRole: role }),
  clearRole: () => set({ myRole: null }),

  // ── UI Preferences ────────────────────────────────────────────────────────
  dark:  false,
  muted: false,
  toggleDark:  () => set(s => ({ dark:  !s.dark  })),
  toggleMuted: () => set(s => ({ muted: !s.muted })),

  // ── Connection ────────────────────────────────────────────────────────────
  connectionStatus: "idle", // idle | connected | disconnected | error
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

  // ── Local vote state (UI only, not synced) ────────────────────────────────
  myVote:   null,
  voteSent: false,
  setMyVote:   (id)  => set({ myVote: id }),
  setVoteSent: (val) => set({ voteSent: val }),
  resetVote: () => set({ myVote: null, voteSent: false }),

  // ── Convenience selectors ─────────────────────────────────────────────────
  get me()           { return get().room?.players?.find(p => p.id === get().myId); },
  get isHost()       { return get().room?.hostId  === get().myId; },
  get isOwner()      { return get().room?.ownerId === get().myId; },
  get activePlayers(){ return (get().room?.players || []).filter(p => get().room?.round?.roles?.[p.id]); },
}));
