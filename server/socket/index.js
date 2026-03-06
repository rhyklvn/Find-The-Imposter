const registerRoomHandlers = require("./roomHandlers");
const registerGameHandlers = require("./gameHandlers");
const registerVoteHandlers = require("./voteHandlers");

/**
 * Called once on server start with the Socket.io server instance.
 * Registers all event handlers on every new connection.
 */
function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    registerRoomHandlers(io, socket);
    registerGameHandlers(io, socket);
    registerVoteHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} — ${reason}`);
      // roomHandlers listens for disconnect and cleans up
    });
  });
}

module.exports = registerSocketHandlers;
