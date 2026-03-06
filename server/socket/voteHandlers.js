const { getRoom } = require("../game/RoomManager");
const { tallyVotes } = require("../game/GameEngine");
const { broadcastRoom } = require("./roomHandlers");

function registerVoteHandlers(io, socket) {

  // ── SUBMIT VOTE ───────────────────────────────────────────────────────────
  socket.on("vote:submit", ({ code, playerId, suspectId }, cb) => {
    const room = getRoom(code);
    if (!room)                    return cb?.({ error: "Room not found." });
    if (room.phase !== "vote")    return cb?.({ error: "Not in voting phase." });
    if (room.votes[playerId])     return cb?.({ error: "You already voted." });

    // Verify voter is an active player (not host-only)
    const isActivePlayer = room.round?.roles?.[playerId];
    if (!isActivePlayer)          return cb?.({ error: "Hosts cannot vote." });

    // Verify suspect is a valid player in this round
    const validSuspect = room.round?.roles?.[suspectId];
    if (!validSuspect)            return cb?.({ error: "Invalid suspect." });

    room.votes[playerId] = suspectId;

    // Check if all active players have voted
    const activePlayers = Object.keys(room.round.roles);
    const allVoted = activePlayers.every(id => room.votes[id]);

    if (allVoted) {
      room.phase = "result";
      const { tally, mostVoted } = tallyVotes(room.votes);
      console.log(`🗳️  Room ${code} all voted. Most voted: ${mostVoted.join(", ")}`);
    }

    broadcastRoom(io, room);
    cb?.({ ok: true });
  });

  // ── HOST FORCE RESULT (skip waiting for all votes) ────────────────────────
  socket.on("vote:forceResult", ({ code, playerId }, cb) => {
    const room = getRoom(code);
    if (!room || room.hostId !== playerId) return cb?.({ error: "Not authorised." });
    if (room.phase !== "vote") return cb?.({ error: "Wrong phase." });

    room.phase = "result";
    broadcastRoom(io, room);
    cb?.({ ok: true });
  });
}

module.exports = registerVoteHandlers;
