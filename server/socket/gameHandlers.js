const { getRoom, addMessage } = require("../game/RoomManager");
const { buildRound } = require("../game/GameEngine");
const { broadcastRoom, safeRoom } = require("./roomHandlers");
const { MIN_PLAYERS } = require("../config/constants");

function registerGameHandlers(io, socket) {

  // ── START GAME (host only) ────────────────────────────────────────────────
  socket.on("game:start", ({ code, playerId }, cb) => {
    const room = getRoom(code);
    if (!room)                       return cb?.({ error: "Room not found." });
    if (room.hostId !== playerId)    return cb?.({ error: "Only the host can start the game." });
    if (room.phase !== "lobby")      return cb?.({ error: "Game already in progress." });

    const activePlayers = room.players.filter(p => p.role === "player");
    if (activePlayers.length < MIN_PLAYERS) {
      return cb?.({ error: `Need at least ${MIN_PLAYERS} players to start.` });
    }

    // Build round — all role data stays server-side
    const round = buildRound(activePlayers, room.settings);
    room.round = round;
    room.votes = {};
    room.phase = "reveal";

    console.log(`🎮 Room ${code} started — word: ${round.word}`);
    addMessage(room, "Game started! Check your card 🃏");

    // Broadcast phase change to whole room (no roles in this broadcast)
    broadcastRoom(io, room);

    // ── PRIVATE role delivery — each player gets ONLY their own role ─────────
    room.players.forEach(player => {
      const playerSocket = [...(io.sockets.sockets.values())]
        .find(s => s.data.playerId === player.id && s.data.roomCode === code);

      if (!playerSocket) return;

      const role = round.roles[player.id];
      if (role) {
        // Player or imposter — send private role
        playerSocket.emit("game:yourRole", {
          type:  role.type,
          word:  role.type === "player"   ? role.word : undefined,
          hint:  role.type === "imposter" ? role.hint : undefined,
        });
      } else {
        // This player is the host — no role
        playerSocket.emit("game:yourRole", { type: "host" });
      }
    });

    cb?.({ ok: true });
  });

  // ── ADVANCE TO DISCUSS (host only) ────────────────────────────────────────
  socket.on("game:discuss", ({ code, playerId }, cb) => {
    const room = getRoom(code);
    if (!room || room.hostId !== playerId) return cb?.({ error: "Not authorised." });
    if (room.phase !== "reveal") return cb?.({ error: "Wrong phase." });

    room.phase = "discuss";
    broadcastRoom(io, room);
    cb?.({ ok: true });
  });

  // ── ADVANCE TO VOTE (host only) ───────────────────────────────────────────
  socket.on("game:vote", ({ code, playerId }, cb) => {
    const room = getRoom(code);
    if (!room || room.hostId !== playerId) return cb?.({ error: "Not authorised." });
    if (room.phase !== "discuss") return cb?.({ error: "Wrong phase." });

    room.phase = "vote";
    broadcastRoom(io, room);
    cb?.({ ok: true });
  });

  // ── NEXT ROUND / BACK TO LOBBY (host only) ────────────────────────────────
  socket.on("game:nextRound", ({ code, playerId }, cb) => {
    const room = getRoom(code);
    if (!room || room.hostId !== playerId) return cb?.({ error: "Not authorised." });

    room.phase = "lobby";
    room.round = null;
    room.votes = {};
    broadcastRoom(io, room);
    cb?.({ ok: true });
  });
}

module.exports = registerGameHandlers;
