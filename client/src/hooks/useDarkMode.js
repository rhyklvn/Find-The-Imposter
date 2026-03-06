import { useGameStore } from "../store/useGameStore";

/**
 * Thin wrapper around the store's dark value.
 * Could be extended to persist to localStorage if desired.
 */
export function useDarkMode() {
  const dark = useGameStore(s => s.dark);
  const toggleDark = useGameStore(s => s.toggleDark);
  return { dark, toggleDark };
}
