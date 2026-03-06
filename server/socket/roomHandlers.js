const {
  createRoom, joinRoom, leaveRoom,
  setPlayerSocket, updateSettings, claimHost,
  getRoom, addMessage,
} = require("../game/RoomManager");
const { maxImpostersForCount } = require("../game/GameEngine");
const { MIN_PLAYERS } = require("../config/constants");

/**
 * Broadcast the safe room state to all members of a room.
 */
function broadcastRoom(io, room) {
  if (!room) return;
  const safe = safeRoom(room);
  io.to(room.code).emit("room:update", safe);
}

/**
 * Strip server-only fields before sending to clients.
 * Safe round metadata (category, difficulty, playerIds) is included so
 * the discuss/vote/result screens can render — but NO words, hints, or roles.
 */
function safeRoom(room) {
  const hasRound = !!room.round;
  const isResult = room.phase === "result";
  return {
    code:      room.code,
    ownerId:   room.ownerId,
    hostId:    room.hostId,
    phase:     room.phase,
    players:   room.players.map(({ id, name, role, isOwner }) => ({ id, name, role, isOwner })),
    settings:  room.settings,
    votes:     room.votes,
    messages:  (room.messages || []).slice(-10),
    // Safe round metadata — no words/hints/roles
    round: hasRound ? {
      category:  room.round.category,
      difficulty: room.round.difficulty,
      playerIds:  Object.keys(room.round.roles || {}),
    } : null,
    // Full reveal only on result phase
    imposterIds:   isResult ? room.round?.imposterIds : undefined,
    roundWord:     isResult ? room.round?.word        : undefined,
    roundCategory: isResult ? room.round?.category    : undefined,
  };
}

function registerRoomHandlers(io, socket) {

  // ── CREATE ROOM ─────────────────────────────────────────────────────────
  socket.on("room:create", ({ playerName, playerId }, cb) => {
    const { room, error } = createRoom(playerName, playerId);
    if (error) return cb({ error });

    setPlayerSocket(room.code, playerId, socket.id);
    socket.join(room.code);
    socket.data.roomCode = room.code;
    socket.data.playerId = playerId;

    console.log(`🏠 ${playerName} created room ${room.code}`);
    cb({ room: safeRoom(room) });
  });

  // ── JOIN ROOM ────────────────────────────────────────────────────────────
  socket.on("room:join", ({ code, playerName, playerId }, cb) => {
    const { room, player, error } = joinRoom(code, playerName, playerId);
    if (error) return cb({ error });

    setPlayerSocket(code, playerId, socket.id);
    socket.join(code);
    socket.data.roomCode = code;
    socket.data.playerId = playerId;

    console.log(`👤 ${playerName} joined room ${code}`);
    broadcastRoom(io, room);
    cb({ room: safeRoom(room) });
  });

  // ── LEAVE ROOM ───────────────────────────────────────────────────────────
  socket.on("room:leave", ({ code, playerId }, cb) => {
    const room = leaveRoom(code, playerId);
    socket.leave(code);
    if (room) {
      const activePlayers = room.players.filter(p => p.role === "player");
      const max = maxImpostersForCount(activePlayers.length);
      if (room.settings.imposterCount > max) room.settings.imposterCount = max;
      broadcastRoom(io, room);
    }
    if (cb) cb({ ok: true });
  });

  // ── DISCONNECT (auto-leave) ───────────────────────────────────────────────
  socket.on("disconnect", () => {
    const { roomCode, playerId } = socket.data;
    if (!roomCode || !playerId) return;
    const room = leaveRoom(roomCode, playerId);
    if (room) {
      const activePlayers = room.players.filter(p => p.role === "player");
      const max = maxImpostersForCount(activePlayers.length);
      if (room.settings.imposterCount > max) room.settings.imposterCount = max;
      broadcastRoom(io, room);
    }
  });

  // ── RECONNECT ────────────────────────────────────────────────────────────
  socket.on("room:reconnect", ({ code, playerId }, cb) => {
    const room = getRoom(code);
    if (!room) return cb({ error: "Room no longer exists." });
    const player = room.players.find(p => p.id === playerId);
    if (!player) return cb({ error: "You are no longer in this room." });

    setPlayerSocket(code, playerId, socket.id);
    socket.join(code);
    socket.data.roomCode = code;
    socket.data.playerId = playerId;
    cb({ room: safeRoom(room) });
  });

  // ── UPDATE SETTINGS (host only) ───────────────────────────────────────────
  socket.on("room:settings", ({ code, playerId, settings }, cb) => {
    const room = getRoom(code);
    if (!room) return cb?.({ error: "Room not found." });
    if (room.hostId !== playerId) return cb?.({ error: "Only the host can change settings." });

    const activePlayers = room.players.filter(p => p.role === "player");
    const max = maxImpostersForCount(activePlayers.length);
    if (settings.imposterCount && settings.imposterCount > max) {
      settings.imposterCount = max;
    }

    const updated = updateSettings(code, settings);
    broadcastRoom(io, updated);
    cb?.({ ok: true });
  });

  // ── CLAIM HOST (owner only) ────────────────────────────────────────────────
  socket.on("room:claimHost", ({ code, playerId }, cb) => {
    const room = claimHost(code, playerId);
    if (!room) return cb?.({ error: "Not authorised." });
    broadcastRoom(io, room);
    cb?.({ ok: true });
  });
}

module.exports = registerRoomHandlers;
module.exports.safeRoom = safeRoom;
module.exports.broadcastRoom = broadcastRoom;
