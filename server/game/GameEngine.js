const { getWordsByCategory, randomFrom } = require("./wordDataset");

/**
 * Fisher-Yates shuffle — unbiased.
 */
function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build round data.
 * Returns:
 *   { word, category, difficulty, imposterIds, roles }
 *   roles: { [playerId]: { type: "player"|"imposter", word?: string, hint?: string } }
 *
 * ANTI-CHEAT: server assigns roles. Each client receives ONLY their own role.
 */
function buildRound(players, settings) {
  const { category, difficulty, imposterCount } = settings;
  const words = getWordsByCategory(category);
  const wordEntry = randomFrom(words);
  const hint = wordEntry.hints[difficulty] || wordEntry.hints.medium;

  // Shuffle to randomise imposter placement
  const shuffled = fisherYates(players);

  // Pick N unique imposter indices, ensuring at least 1 non-imposter
  const safeMax = Math.min(imposterCount, shuffled.length - 1);
  const imposterIdxSet = new Set();
  while (imposterIdxSet.size < safeMax) {
    imposterIdxSet.add(Math.floor(Math.random() * shuffled.length));
  }

  const imposterIds = shuffled
    .filter((_, i) => imposterIdxSet.has(i))
    .map(p => p.id);

  const roles = {};
  shuffled.forEach((p, i) => {
    roles[p.id] = imposterIdxSet.has(i)
      ? { type: "imposter", hint }
      : { type: "player",   word: wordEntry.word };
  });

  return {
    word: wordEntry.word,
    category: wordEntry.category,
    difficulty,
    imposterIds,
    roles,      // full map — stays server-side
  };
}

/**
 * Tally votes.
 * Returns { tally: { [playerId]: count }, mostVoted: [playerId, ...] }
 */
function tallyVotes(votes) {
  const tally = {};
  Object.values(votes).forEach(id => { tally[id] = (tally[id] || 0) + 1; });
  const max = Math.max(0, ...Object.values(tally));
  const mostVoted = Object.keys(tally).filter(id => tally[id] === max);
  return { tally, mostVoted };
}

/**
 * Max imposters allowed for a given player count.
 */
function maxImpostersForCount(count) {
  return Math.min(3, Math.max(1, Math.floor((count - 1) / 2)));
}

module.exports = { buildRound, tallyVotes, maxImpostersForCount, fisherYates };
