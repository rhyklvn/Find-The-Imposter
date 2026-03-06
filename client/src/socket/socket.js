import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

// Single shared socket instance — do not re-create on re-renders
const socket = io(SERVER_URL, {
  autoConnect: false,   // connect manually when the player joins/creates a room
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
