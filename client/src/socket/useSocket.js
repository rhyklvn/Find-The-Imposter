import { useEffect, useCallback } from "react";
import socket from "./socket";
import { useGameStore } from "../store/useGameStore";

/**
 * Connects the socket and registers all server → client listeners.
 * Call this once at the App level.
 */
export function useSocketListeners() {
  const { setRoom, setMyRole, setConnectionStatus } = useGameStore();

  useEffect(() => {
    socket.on("connect", () => {
      setConnectionStatus("connected");
      // Attempt to reconnect to an in-progress room on socket reconnect
      const { roomCode, myId } = useGameStore.getState();
      if (roomCode && myId) {
        socket.emit("room:reconnect", { code: roomCode, playerId: myId }, (res) => {
          if (res?.room) setRoom(res.room);
        });
      }
    });

    socket.on("disconnect", () => setConnectionStatus("disconnected"));
    socket.on("connect_error", () => setConnectionStatus("error"));

    // Server broadcasts room state to all members
    socket.on("room:update", (room) => {
      setRoom(room);
    });

    // Private: only this socket receives its role
    socket.on("game:yourRole", (role) => {
      setMyRole(role);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("room:update");
      socket.off("game:yourRole");
    };
  }, []);
}

// ── Emit helpers (used in screens/components) ─────────────────────────────

export function useRoomActions() {
  const { myId, roomCode } = useGameStore();

  const createRoom = useCallback((playerName, cb) => {
    if (!socket.connected) socket.connect();
    socket.emit("room:create", { playerName, playerId: myId }, cb);
  }, [myId]);

  const joinRoom = useCallback((code, playerName, cb) => {
    if (!socket.connected) socket.connect();
    socket.emit("room:join", { code, playerName, playerId: myId }, cb);
  }, [myId]);

  const leaveRoom = useCallback((cb) => {
    socket.emit("room:leave", { code: roomCode, playerId: myId }, cb);
  }, [myId, roomCode]);

  const updateSettings = useCallback((settings, cb) => {
    socket.emit("room:settings", { code: roomCode, playerId: myId, settings }, cb);
  }, [myId, roomCode]);

  const claimHost = useCallback((cb) => {
    socket.emit("room:claimHost", { code: roomCode, playerId: myId }, cb);
  }, [myId, roomCode]);

  return { createRoom, joinRoom, leaveRoom, updateSettings, claimHost };
}

export function useGameActions() {
  const { myId, roomCode } = useGameStore();

  const startGame    = useCallback((cb) => socket.emit("game:start",    { code: roomCode, playerId: myId }, cb), [myId, roomCode]);
  const goToDiscuss  = useCallback((cb) => socket.emit("game:discuss",  { code: roomCode, playerId: myId }, cb), [myId, roomCode]);
  const goToVote     = useCallback((cb) => socket.emit("game:vote",     { code: roomCode, playerId: myId }, cb), [myId, roomCode]);
  const nextRound    = useCallback((cb) => socket.emit("game:nextRound",{ code: roomCode, playerId: myId }, cb), [myId, roomCode]);

  return { startGame, goToDiscuss, goToVote, nextRound };
}

export function useVoteActions() {
  const { myId, roomCode } = useGameStore();

  const submitVote   = useCallback((suspectId, cb) => socket.emit("vote:submit",      { code: roomCode, playerId: myId, suspectId }, cb), [myId, roomCode]);
  const forceResult  = useCallback((cb)            => socket.emit("vote:forceResult", { code: roomCode, playerId: myId }, cb),            [myId, roomCode]);

  return { submitVote, forceResult };
}
