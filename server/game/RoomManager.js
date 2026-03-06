const { v4: uuidv4 } = require("uuid");
const { MAX_PLAYERS, MIN_PLAYERS, ROOM_TTL_MS } = require("../config/constants");

// rooms: Map<code, RoomObject>
const rooms = new Map();

// Cleanup stale rooms every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (now - room.lastActivity > ROOM_TTL_MS) {
      rooms.delete(code);
      console.log(`🗑️  Room ${code} expired and removed`);
    }
  }
}, 10 * 60 * 1000);

function genRoomCode() {
  let code;
  do { code = String(Math.floor(1000 + Math.random() * 9000)); }
  while (rooms.has(code));
  return code;
}

/**
 * Create a new room.
 * Returns { room, error }
 */
function createRoom(ownerName, ownerId) {
  if (!ownerName || !ownerName.trim()) return { error: "Name is required." };
  const code = genRoomCode();
  const owner = {
    id: ownerId,
    name: ownerName.trim(),
    role: "player",   // player | host
    isOwner: true,
    socketId: null,
    joinedAt: Date.now(),
  };
  const room = {
    code,
    ownerId,
    hostId: ownerId,
    phase: "lobby",   // lobby | reveal | discuss | vote | result
    players: [owner],
    settings: {
      category: "Random Mix",
      difficulty: "medium",
      imposterCount: 1,
    },
    round: null,
    votes: {},
    messages: [],
    lastActivity: Date.now(),
  };
  rooms.set(code, room);
  console.log(`🏠 Room ${code} created by ${ownerName}`);
  return { room };
}

/**
 * Join an existing room.
 * Returns { room, player, error }
 */
function joinRoom(code, playerName, playerId) {
  const room = rooms.get(code);
  if (!room) return { error: "Room not found. Check the code!" };
  if (room.phase !== "lobby") return { error: "Game already in progress. Wait for the next round." };
  if (room.players.length >= MAX_PLAYERS) return { error: `Room is full (max ${MAX_PLAYERS} players).` };
  if (!playerName || !playerName.trim()) return { error: "Name is required." };

  const nameTaken = room.players.some(
    p => p.name.toLowerCase() === playerName.trim().toLowerCase()
  );
  if (nameTaken) return { error: "That name is taken — choose another!" };

  const player = {
    id: playerId,
    name: playerName.trim(),
    role: "player",
    isOwner: false,
    socketId: null,
    joinedAt: Date.now(),
  };
  room.players.push(player);
  room.lastActivity = Date.now();
  addMessage(room, `${player.name} joined the room 👋`);
  return { room, player };
}

/**
 * Remove a player from a room. Reassigns host/owner if needed.
 * Returns updated room or null if room is now empty.
 */
function leaveRoom(code, playerId) {
  const room = rooms.get(code);
  if (!room) return null;

  const leavingPlayer = room.players.find(p => p.id === playerId);
  if (leavingPlayer) {
    addMessage(room, `${leavingPlayer.name} left the room 👋`);
  }

  room.players = room.players.filter(p => p.id !== playerId);
  room.lastActivity = Date.now();

  if (room.players.length === 0) {
    rooms.delete(code);
    console.log(`🗑️  Room ${code} deleted (empty)`);
    return null;
  }

  // Reassign owner/host if they left
  if (room.ownerId === playerId) {
    room.ownerId = room.players[0].id;
    room.players[0].isOwner = true;
  }
  if (room.hostId === playerId) {
    room.hostId = room.ownerId;
  }

  return room;
}

/**
 * Update a player's socket ID (on connect/reconnect).
 */
function setPlayerSocket(code, playerId, socketId) {
  const room = rooms.get(code);
  if (!room) return;
  const player = room.players.find(p => p.id === playerId);
  if (player) { player.socketId = socketId; room.lastActivity = Date.now(); }
}

/**
 * Update room settings (host only — caller must verify).
 */
function updateSettings(code, settings) {
  const room = rooms.get(code);
  if (!room) return null;
  Object.assign(room.settings, settings);
  room.lastActivity = Date.now();
  return room;
}

/**
 * Claim host role (owner only).
 */
function claimHost(code, playerId) {
  const room = rooms.get(code);
  if (!room || room.ownerId !== playerId) return null;
  room.hostId = playerId;
  room.lastActivity = Date.now();
  return room;
}

function getRoom(code) { return rooms.get(code) || null; }

function addMessage(room, text) {
  room.messages = room.messages || [];
  room.messages.push({ text, ts: Date.now() });
  // Keep only last 20 messages
  if (room.messages.length > 20) room.messages.shift();
}

function touchRoom(code) {
  const room = rooms.get(code);
  if (room) room.lastActivity = Date.now();
}

module.exports = {
  createRoom, joinRoom, leaveRoom,
  setPlayerSocket, updateSettings, claimHost,
  getRoom, addMessage, touchRoom,
};
