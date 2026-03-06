module.exports = {
  MAX_PLAYERS: 12,
  MIN_PLAYERS: 3,
  ROOM_CODE_LENGTH: 4,
  DISCUSSION_TIMER_SECONDS: 60,
  // Room is deleted from memory if idle for this long (ms)
  ROOM_TTL_MS: parseInt(process.env.ROOM_TTL_MS || "3600000", 10), // 1 hour
  // Imposter count rules: key = min players required
  IMPOSTER_RULES: [
    { minPlayers: 3, maxImposters: 2 },
    { minPlayers: 6, maxImposters: 3 },
  ],
};
