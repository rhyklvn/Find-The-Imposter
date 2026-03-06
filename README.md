# 🕵️ Find the Imposter — Multiplayer

A real-time multiplayer social deduction party game built with React + Node.js + Socket.io.

## Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React 18, Vite, Zustand       |
| Backend  | Node.js, Express, Socket.io 4 |
| Realtime | WebSockets via Socket.io      |

---

## Quick Start (One Command)

### 1. Install everything
```bash
npm run install:all
```

### 2. Set up environment files
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3. Run everything together
```bash
npm run dev
```

That's it. Both the server and client start together in one terminal.
Open `http://localhost:5173` in your browser.

---

## Testing Multiplayer on Real Phones

Find your computer's local IP:

**Mac/Linux:**
```bash
ipconfig getifaddr en0
```

**Windows:**
```bash
ipconfig
# Look for IPv4 Address under your Wi-Fi adapter
```

Then update both `.env` files with your IP (e.g. `192.168.1.5`):

`server/.env`:
```
CLIENT_ORIGIN=http://192.168.1.5:5173
```

`client/.env`:
```
VITE_SERVER_URL=http://192.168.1.5:3001
```

Re-run `npm run dev`, then open `http://192.168.1.5:5173` on any phone on the same Wi-Fi.

---

## Game Flow

```
HOME → Create Room (get 4-digit code)
     → Join Room   (enter code on other phones)

LOBBY   → Host configures settings → Start Game
REVEAL  → Each player taps their card privately
DISCUSS → 60s timer · everyone gives clues
VOTE    → Each player votes on their own phone
RESULT  → Imposter revealed · Play again
```
