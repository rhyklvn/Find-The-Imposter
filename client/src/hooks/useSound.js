import { useCallback } from "react";
import { useGameStore } from "../store/useGameStore";

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (type === "flip")  { osc.frequency.value = 520; gain.gain.setValueAtTime(0.12, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18); }
    if (type === "next")  { osc.frequency.value = 660; gain.gain.setValueAtTime(0.1,  ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12); }
    if (type === "vote")  { osc.frequency.value = 440; gain.gain.setValueAtTime(0.1,  ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15); }
    if (type === "win")   { osc.type = "sine"; osc.frequency.setValueAtTime(330, ctx.currentTime); osc.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.3); gain.gain.setValueAtTime(0.12, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5); }
    if (type === "join")  { osc.frequency.value = 880; gain.gain.setValueAtTime(0.08, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15); }
    if (type === "leave") { osc.frequency.value = 220; gain.gain.setValueAtTime(0.08, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);  }
    osc.start(); osc.stop(ctx.currentTime + 0.7);
  } catch (e) { /* AudioContext blocked — ignore */ }
}

/**
 * Returns a sound(type) function that respects the mute toggle.
 */
export function useSound() {
  const muted = useGameStore(s => s.muted);
  return useCallback((type) => { if (!muted) playSound(type); }, [muted]);
}
