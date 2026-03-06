import React, { useEffect, useState } from "react";
import { useGameStore } from "./store/useGameStore";
import { useSocketListeners } from "./socket/useSocket";

import HomeScreen         from "./screens/HomeScreen";
import CreateScreen       from "./screens/CreateScreen";
import JoinScreen         from "./screens/JoinScreen";
import LobbyScreen        from "./screens/LobbyScreen";
import RevealScreen       from "./screens/RevealScreen";
import DiscussScreen      from "./screens/DiscussScreen";
import VoteScreen         from "./screens/VoteScreen";
import ResultScreen       from "./screens/ResultScreen";
import SingleDeviceScreen from "./screens/SingleDeviceScreen";

const SCREEN = {
  HOME:          "HOME",
  CREATE:        "CREATE",
  JOIN:          "JOIN",
  LOBBY:         "LOBBY",
  REVEAL:        "REVEAL",
  DISCUSS:       "DISCUSS",
  VOTE:          "VOTE",
  RESULT:        "RESULT",
  SINGLE_DEVICE: "SINGLE_DEVICE",
};

export default function App() {
  useSocketListeners();

  const room      = useGameStore(s => s.room);
  const clearRoom = useGameStore(s => s.clearRoom);
  const clearRole = useGameStore(s => s.clearRole);
  const resetVote = useGameStore(s => s.resetVote);

  const [screen, setScreen] = useState(SCREEN.HOME);

  // When the server pushes a phase change, sync the screen automatically.
  // Only applies when we are already inside a multiplayer game (not single-device).
  useEffect(() => {
    if (!room) return;
    // Don't interfere with single-device flow
    if (screen === SCREEN.SINGLE_DEVICE) return;

    const phaseMap = {
      lobby:   SCREEN.LOBBY,
      reveal:  SCREEN.REVEAL,
      discuss: SCREEN.DISCUSS,
      vote:    SCREEN.VOTE,
      result:  SCREEN.RESULT,
    };
    const next = phaseMap[room.phase];
    if (next && next !== screen) {
      if (room.phase === "vote") resetVote();
      setScreen(next);
    }
  }, [room?.phase]);

  function goHome() {
    clearRoom();
    clearRole();
    resetVote();
    setScreen(SCREEN.HOME);
  }

  switch (screen) {
    case SCREEN.HOME:
      return (
        <HomeScreen
          onCreate={() => setScreen(SCREEN.CREATE)}
          onJoin={() => setScreen(SCREEN.JOIN)}
          onSingleDevice={() => setScreen(SCREEN.SINGLE_DEVICE)}
        />
      );

    case SCREEN.CREATE:
      return (
        <CreateScreen
          onBack={() => setScreen(SCREEN.HOME)}
          onCreated={() => setScreen(SCREEN.LOBBY)}
        />
      );

    case SCREEN.JOIN:
      return (
        <JoinScreen
          onBack={() => setScreen(SCREEN.HOME)}
          onJoined={() => setScreen(SCREEN.LOBBY)}
        />
      );

    case SCREEN.LOBBY:
      return <LobbyScreen onLeave={goHome} />;

    case SCREEN.REVEAL:
      return <RevealScreen onHome={goHome} />;

    case SCREEN.DISCUSS:
      return <DiscussScreen onHome={goHome} />;

    case SCREEN.VOTE:
      return <VoteScreen onHome={goHome} />;

    case SCREEN.RESULT:
      return <ResultScreen onHome={goHome} />;

    case SCREEN.SINGLE_DEVICE:
      return <SingleDeviceScreen onHome={goHome} />;

    default:
      return (
        <HomeScreen
          onCreate={() => setScreen(SCREEN.CREATE)}
          onJoin={() => setScreen(SCREEN.JOIN)}
          onSingleDevice={() => setScreen(SCREEN.SINGLE_DEVICE)}
        />
      );
  }
}
