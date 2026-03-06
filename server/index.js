require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const registerSocketHandlers = require("./socket");

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CLIENT_ORIGIN, methods: ["GET", "POST"] },
  pingTimeout: 20000,
  pingInterval: 10000,
});

// Register all socket event handlers
registerSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`🕵️  Imposter Game server running on port ${PORT}`);
  console.log(`   Client origin: ${CLIENT_ORIGIN}`);
});
