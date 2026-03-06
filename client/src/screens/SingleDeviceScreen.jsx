import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { CATEGORIES, CATEGORY_EMOJIS } from "../data/wordDataset";

// ── Word Dataset ──────────────────────────────────────────────────────────────
const WORD_DATASET = [
  {word:"Adobo",category:"Foods",hints:{easy:"Kitchen",medium:"Sour",hard:"Vinegar"}},
  {word:"Sinigang",category:"Foods",hints:{easy:"Bowl",medium:"Tamarind",hard:"Sour"}},
  {word:"Lechon",category:"Foods",hints:{easy:"Celebration",medium:"Crispy",hard:"Fire"}},
  {word:"Kare-Kare",category:"Foods",hints:{easy:"Stew",medium:"Peanut",hard:"Brown"}},
  {word:"Sisig",category:"Foods",hints:{easy:"Sizzling",medium:"Plate",hard:"Smoke"}},
  {word:"Pizza",category:"Foods",hints:{easy:"Delivery",medium:"Slice",hard:"Oven"}},
  {word:"Burger",category:"Foods",hints:{easy:"Bun",medium:"Stack",hard:"Sesame"}},
  {word:"Ramen",category:"Foods",hints:{easy:"Noodles",medium:"Broth",hard:"Steam"}},
  {word:"Pancit",category:"Foods",hints:{easy:"Noodles",medium:"Birthday",hard:"Long"}},
  {word:"Lumpia",category:"Foods",hints:{easy:"Roll",medium:"Wrapper",hard:"Crunch"}},
  {word:"Halo-Halo",category:"Foods",hints:{easy:"Cold",medium:"Shaved",hard:"Ice"}},
  {word:"Balut",category:"Foods",hints:{easy:"Egg",medium:"Duck",hard:"Shell"}},
  {word:"Tapsilog",category:"Foods",hints:{easy:"Breakfast",medium:"Tapa",hard:"Silog"}},
  {word:"Champorado",category:"Foods",hints:{easy:"Chocolate",medium:"Porridge",hard:"Morning"}},
  {word:"Dinuguan",category:"Foods",hints:{easy:"Dark",medium:"Pork",hard:"Blood"}},
  {word:"Bibingka",category:"Foods",hints:{easy:"Christmas",medium:"Clay pot",hard:"Charcoal"}},
  {word:"Puto",category:"Foods",hints:{easy:"Steamed",medium:"White",hard:"Fluffy"}},
  {word:"Tocino",category:"Foods",hints:{easy:"Sweet",medium:"Pink",hard:"Cure"}},
  {word:"Elephant",category:"Animals",hints:{easy:"Africa",medium:"Trunk",hard:"Memory"}},
  {word:"Dolphin",category:"Animals",hints:{easy:"Ocean",medium:"Jump",hard:"Echo"}},
  {word:"Penguin",category:"Animals",hints:{easy:"Cold",medium:"Waddle",hard:"Tuxedo"}},
  {word:"Tiger",category:"Animals",hints:{easy:"Jungle",medium:"Stripes",hard:"Stalk"}},
  {word:"Tarsier",category:"Animals",hints:{easy:"Small",medium:"Eyes",hard:"Night"}},
  {word:"Octopus",category:"Animals",hints:{easy:"Ocean",medium:"Ink",hard:"Arms"}},
  {word:"Whale",category:"Animals",hints:{easy:"Sea",medium:"Massive",hard:"Song"}},
  {word:"Chameleon",category:"Animals",hints:{easy:"Lizard",medium:"Blend",hard:"Shift"}},
  {word:"Flamingo",category:"Animals",hints:{easy:"Pink",medium:"One leg",hard:"Balance"}},
  {word:"Giraffe",category:"Animals",hints:{easy:"Tall",medium:"Savanna",hard:"Reach"}},
  {word:"Panda",category:"Animals",hints:{easy:"China",medium:"Bamboo",hard:"Rare"}},
  {word:"Cheetah",category:"Animals",hints:{easy:"Africa",medium:"Speed",hard:"Blur"}},
  {word:"Peacock",category:"Animals",hints:{easy:"Bird",medium:"Feathers",hard:"Display"}},
  {word:"Mango",category:"Fruits",hints:{easy:"Tropical",medium:"Yellow",hard:"Sun"}},
  {word:"Durian",category:"Fruits",hints:{easy:"Smell",medium:"Spiky",hard:"Banned"}},
  {word:"Watermelon",category:"Fruits",hints:{easy:"Summer",medium:"Green",hard:"Seed"}},
  {word:"Banana",category:"Fruits",hints:{easy:"Yellow",medium:"Peel",hard:"Curve"}},
  {word:"Avocado",category:"Fruits",hints:{easy:"Green",medium:"Toast",hard:"Pit"}},
  {word:"Coconut",category:"Fruits",hints:{easy:"Beach",medium:"Shell",hard:"Thirst"}},
  {word:"Jackfruit",category:"Fruits",hints:{easy:"Giant",medium:"Sticky",hard:"Pulled"}},
  {word:"Dragonfruit",category:"Fruits",hints:{easy:"Pink",medium:"Speckled",hard:"Bloom"}},
  {word:"Lanzones",category:"Fruits",hints:{easy:"Cluster",medium:"Sweet",hard:"Peel"}},
  {word:"Rambutan",category:"Fruits",hints:{easy:"Hairy",medium:"Red",hard:"Lychee"}},
  {word:"Pineapple",category:"Fruits",hints:{easy:"Tropical",medium:"Crown",hard:"Rings"}},
  {word:"Calamansi",category:"Fruits",hints:{easy:"Sour",medium:"Tiny",hard:"Squeeze"}},
  {word:"Basketball",category:"Sports",hints:{easy:"Hoop",medium:"Bounce",hard:"Net"}},
  {word:"Volleyball",category:"Sports",hints:{easy:"Net",medium:"Spike",hard:"Rally"}},
  {word:"Swimming",category:"Sports",hints:{easy:"Pool",medium:"Float",hard:"Breath"}},
  {word:"Boxing",category:"Sports",hints:{easy:"Ring",medium:"Glove",hard:"Jab"}},
  {word:"Football",category:"Sports",hints:{easy:"Goal",medium:"Kick",hard:"Offside"}},
  {word:"Tennis",category:"Sports",hints:{easy:"Court",medium:"Serve",hard:"Love"}},
  {word:"Arnis",category:"Sports",hints:{easy:"Stick",medium:"Strike",hard:"Rattan"}},
  {word:"Surfing",category:"Sports",hints:{easy:"Wave",medium:"Balance",hard:"Tube"}},
  {word:"Badminton",category:"Sports",hints:{easy:"Racket",medium:"Shuttle",hard:"Feather"}},
  {word:"Gymnastics",category:"Sports",hints:{easy:"Flip",medium:"Vault",hard:"Stick"}},
  {word:"Laptop",category:"Technology",hints:{easy:"Desk",medium:"Screen",hard:"Battery"}},
  {word:"Smartphone",category:"Technology",hints:{easy:"Pocket",medium:"Tap",hard:"Swipe"}},
  {word:"Drone",category:"Technology",hints:{easy:"Sky",medium:"Camera",hard:"Hover"}},
  {word:"Robot",category:"Technology",hints:{easy:"Machine",medium:"Arm",hard:"Servo"}},
  {word:"VR Headset",category:"Technology",hints:{easy:"Virtual",medium:"Immersive",hard:"Latency"}},
  {word:"ChatGPT",category:"Technology",hints:{easy:"AI",medium:"Chat",hard:"Token"}},
  {word:"WiFi",category:"Technology",hints:{easy:"Network",medium:"Router",hard:"Signal"}},
  {word:"Power Bank",category:"Technology",hints:{easy:"Charge",medium:"Portable",hard:"Brick"}},
  {word:"Philippines",category:"Countries",hints:{easy:"Islands",medium:"Archipelago",hard:"Luzon"}},
  {word:"Japan",category:"Countries",hints:{easy:"Sushi",medium:"Cherry blossom",hard:"Wa"}},
  {word:"Brazil",category:"Countries",hints:{easy:"Carnival",medium:"Amazon",hard:"Samba"}},
  {word:"Italy",category:"Countries",hints:{easy:"Pasta",medium:"Colosseum",hard:"Papal"}},
  {word:"Egypt",category:"Countries",hints:{easy:"Pyramid",medium:"Desert",hard:"Pharaoh"}},
  {word:"France",category:"Countries",hints:{easy:"Paris",medium:"Baguette",hard:"Beret"}},
  {word:"South Korea",category:"Countries",hints:{easy:"K-pop",medium:"Seoul",hard:"Han"}},
  {word:"Mexico",category:"Countries",hints:{easy:"Taco",medium:"Aztec",hard:"Mural"}},
  {word:"Jeepney",category:"Filipino Culture",hints:{easy:"Transport",medium:"Colorful",hard:"Pasada"}},
  {word:"Bayanihan",category:"Filipino Culture",hints:{easy:"Community",medium:"Help",hard:"Damayan"}},
  {word:"Parol",category:"Filipino Culture",hints:{easy:"Christmas",medium:"Star",hard:"Lantern"}},
  {word:"Barong Tagalog",category:"Filipino Culture",hints:{easy:"Formal",medium:"Pineapple",hard:"Piña"}},
  {word:"Sinulog",category:"Filipino Culture",hints:{easy:"Festival",medium:"Cebu",hard:"Ati-Atihan"}},
  {word:"Jollibee",category:"Filipino Culture",hints:{easy:"Fastfood",medium:"Bee",hard:"Chickenjoy"}},
  {word:"Taho",category:"Filipino Culture",hints:{easy:"Morning",medium:"Sweet",hard:"Arnibal"}},
  {word:"Bahay Kubo",category:"Filipino Culture",hints:{easy:"Bamboo",medium:"Nipa",hard:"Stilts"}},
  {word:"Taylor Swift",category:"Celebrities",hints:{easy:"Albums",medium:"Era",hard:"Easter egg"}},
  {word:"Manny Pacquiao",category:"Celebrities",hints:{easy:"Boxing",medium:"Senator",hard:"Pound"}},
  {word:"BTS",category:"Celebrities",hints:{easy:"K-pop",medium:"ARMY",hard:"Bangtan"}},
  {word:"Lebron James",category:"Celebrities",hints:{easy:"NBA",medium:"Ring",hard:"Chalk"}},
  {word:"Vice Ganda",category:"Celebrities",hints:{easy:"Comedy",medium:"Noontime",hard:"Beks"}},
  {word:"Blackpink",category:"Celebrities",hints:{easy:"K-pop",medium:"YG",hard:"Blink"}},
  {word:"Anne Curtis",category:"Celebrities",hints:{easy:"Actress",medium:"Showtime",hard:"Birit"}},
  {word:"Rainbow",category:"Nature",hints:{easy:"Colors",medium:"Rain",hard:"Refract"}},
  {word:"Volcano",category:"Nature",hints:{easy:"Lava",medium:"Erupt",hard:"Magma"}},
  {word:"Typhoon",category:"Nature",hints:{easy:"Storm",medium:"Signal",hard:"Eye"}},
  {word:"Waterfall",category:"Nature",hints:{easy:"Falls",medium:"Mist",hard:"Plunge"}},
  {word:"Coral Reef",category:"Nature",hints:{easy:"Ocean",medium:"Coral",hard:"Bleach"}},
  {word:"Aurora Borealis",category:"Nature",hints:{easy:"Northern",medium:"Solar",hard:"Curtain"}},
  {word:"Doctor",category:"Professions",hints:{easy:"Hospital",medium:"Stethoscope",hard:"Rounds"}},
  {word:"Chef",category:"Professions",hints:{easy:"Kitchen",medium:"Knife",hard:"Mise"}},
  {word:"Pilot",category:"Professions",hints:{easy:"Plane",medium:"Cockpit",hard:"Altimeter"}},
  {word:"Astronaut",category:"Professions",hints:{easy:"Space",medium:"Orbit",hard:"EVA"}},
  {word:"Firefighter",category:"Professions",hints:{easy:"Fire",medium:"Hose",hard:"Flashover"}},
  {word:"Programmer",category:"Professions",hints:{easy:"Code",medium:"Debug",hard:"Loop"}},
  {word:"Barista",category:"Professions",hints:{easy:"Coffee",medium:"Foam",hard:"Pull"}},
  {word:"Refrigerator",category:"Household Objects",hints:{easy:"Cold",medium:"Hum",hard:"Freon"}},
  {word:"Mirror",category:"Household Objects",hints:{easy:"Reflect",medium:"Vanity",hard:"Silvering"}},
  {word:"Clock",category:"Household Objects",hints:{easy:"Time",medium:"Tick",hard:"Escapement"}},
  {word:"Umbrella",category:"Household Objects",hints:{easy:"Rain",medium:"Canopy",hard:"Ribs"}},
  {word:"Rice Cooker",category:"Household Objects",hints:{easy:"Rice",medium:"Steam",hard:"Click"}},
  {word:"Electric Fan",category:"Household Objects",hints:{easy:"Cool",medium:"Blade",hard:"Oscillate"}},
  {word:"Harry Potter",category:"Movies & Characters",hints:{easy:"Wizard",medium:"Wand",hard:"Horcrux"}},
  {word:"Avengers",category:"Movies & Characters",hints:{easy:"Marvel",medium:"Infinity",hard:"Snap"}},
  {word:"Encanto",category:"Movies & Characters",hints:{easy:"Family",medium:"Gift",hard:"Casita"}},
  {word:"Lion King",category:"Movies & Characters",hints:{easy:"Africa",medium:"Pride",hard:"Hakuna"}},
  {word:"Spider-Man",category:"Movies & Characters",hints:{easy:"Web",medium:"New York",hard:"Tingling"}},
  {word:"Naruto",category:"Movies & Characters",hints:{easy:"Ninja",medium:"Ramen",hard:"Believe"}},
  {word:"Goku",category:"Movies & Characters",hints:{easy:"Saiyan",medium:"Power up",hard:"Ki"}},
  {word:"Doraemon",category:"Movies & Characters",hints:{easy:"Robot",medium:"Pocket",hard:"Nobita"}},
  {word:"Boracay",category:"Places",hints:{easy:"Beach",medium:"White sand",hard:"Sail"}},
  {word:"Palawan",category:"Places",hints:{easy:"Paradise",medium:"Underground",hard:"Karst"}},
  {word:"Eiffel Tower",category:"Places",hints:{easy:"Paris",medium:"Iron",hard:"Rivet"}},
  {word:"Colosseum",category:"Places",hints:{easy:"Rome",medium:"Gladiator",hard:"Arch"}},
  {word:"Sagada",category:"Places",hints:{easy:"Mountain",medium:"Coffin",hard:"Fog"}},
  {word:"Siargao",category:"Places",hints:{easy:"Surf",medium:"Island",hard:"Barrel"}},
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getWordsByCategory(cat) {
  if (cat === "Random Mix") return WORD_DATASET;
  return WORD_DATASET.filter(w => w.category === cat);
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function nameToHue(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}
function avatarStyle(name) {
  const hue = nameToHue(name);
  return {
    bg: `hsl(${hue},65%,88%)`,
    text: `hsl(${hue},55%,38%)`,
    border: `hsl(${hue},55%,72%)`,
    shadow: `hsla(${hue},65%,70%,0.35)`,
  };
}

// ── Sound ─────────────────────────────────────────────────────────────────────
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (type === "flip")   { osc.frequency.value = 520; gain.gain.setValueAtTime(0.12, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18); }
    if (type === "next")   { osc.frequency.value = 660; gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12); }
    if (type === "shuffle"){ osc.frequency.value = 440; osc.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.15); gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25); }
    if (type === "win")    { osc.type="sine"; osc.frequency.setValueAtTime(330, ctx.currentTime); osc.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.3); gain.gain.setValueAtTime(0.12, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5); }
    osc.start(); osc.stop(ctx.currentTime + 0.7);
  } catch(e) {}
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const colors = ["#FFD6E7","#E6D6FF","#D6F0FF","#D6FFE8","#FFE5D6","#FFF9D6","#ff6b9d","#c77dff","#48cae4"];
    const ps = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      color: randomFrom(colors),
      size: 8 + Math.random() * 8,
      shape: Math.random() > 0.5 ? "circle" : "square",
    }));
    setParticles(ps);
    const t = setTimeout(() => setParticles([]), 4500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, overflow:"hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:"-20px",
          width:p.size, height:p.size,
          borderRadius: p.shape === "circle" ? "50%" : "2px",
          background: p.color,
          animation:`confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

// ── Smooth Flip Card ──────────────────────────────────────────────────────────
const FLIP_CSS = `
  .fi-scene {
    perspective: 1200px;
    width: 100%;
    max-width: 340px;
    margin: 0 auto;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .fi-inner {
    position: relative;
    width: 100%;
    padding-bottom: 130%;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.45, 0.05, 0.55, 0.95);
    will-change: transform;
    border-radius: 28px;
    cursor: pointer;
  }
  .fi-inner.fi-flipped {
    transform: rotateY(180deg);
    cursor: default;
  }
  .fi-inner:not(.fi-flipped):hover {
    transform: rotateY(6deg) scale(1.018);
    transition: transform 0.25s ease;
  }
  .fi-face {
    position: absolute;
    inset: 0;
    border-radius: 28px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .fi-front {
    background: linear-gradient(135deg, #E6D6FF 0%, #D6F0FF 100%);
    box-shadow: 0 8px 32px rgba(140,100,220,0.18), 0 2px 8px rgba(0,0,0,0.06);
    padding: 24px;
  }
  .fi-back {
    transform: rotateY(180deg);
    box-shadow: 0 8px 40px rgba(140,100,220,0.22);
  }
  .fi-inner.fi-flipped .fi-back {
    animation: fi-pulse 0.4s ease-out 0.55s 1 forwards;
  }
  @keyframes fi-pulse {
    from { box-shadow: 0 0 0 0 rgba(199,125,255,0.5); }
    to   { box-shadow: 0 0 0 14px rgba(199,125,255,0); }
  }
`;

let flipCssInjected = false;
function injectFlipCss() {
  if (flipCssInjected) return;
  flipCssInjected = true;
  const tag = document.createElement("style");
  tag.textContent = FLIP_CSS;
  document.head.appendChild(tag);
}

function FlipCard({ playerKey, flipped, onFlip, front, back }) {
  const innerRef = useRef(null);
  const lockedRef = useRef(false);

  useEffect(() => { injectFlipCss(); }, []);

  // Reset card instantly when player changes
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.classList.remove("fi-flipped");
    lockedRef.current = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (el) el.style.transition = "";
      });
    });
  }, [playerKey]);

  // Apply flip when parent says so
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !flipped) return;
    el.classList.add("fi-flipped");
  }, [flipped]);

  function handleClick() {
    if (lockedRef.current || flipped) return;
    lockedRef.current = true;
    const el = innerRef.current;
    if (!el) return;
    el.classList.add("fi-flipped");
    setTimeout(() => { if (onFlip) onFlip(); }, 620);
  }

  return (
    <div className="fi-scene">
      <div ref={innerRef} className="fi-inner" onClick={handleClick}>
        <div className="fi-face fi-front">{front}</div>
        <div className="fi-face fi-back">{back}</div>
      </div>
    </div>
  );
}

// ── TopBar ────────────────────────────────────────────────────────────────────
function TopBar({ onBack, dark, setDark, muted, setMuted }) {
  const dm = dark;
  const iconBtn = {
    background: dm ? "rgba(255,255,255,0.1)" : "rgba(160,100,220,0.1)",
    border: dm ? "1.5px solid rgba(255,255,255,0.18)" : "1.5px solid rgba(199,125,255,0.28)",
    borderRadius: 10, width: 34, height: 34, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 17, transition: "all 0.2s", flexShrink: 0, padding: 0, lineHeight: 1,
  };
  const logo = {
    fontSize: 18, fontWeight: 900,
    background: "linear-gradient(90deg,#c77dff,#ff6b9d)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    letterSpacing: -0.5, userSelect: "none",
  };
  return (
    <div style={{
      width: "100%", maxWidth: 480,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 18px 6px",
    }}>
      <div style={{ width: 36, display: "flex", alignItems: "center" }}>
        {onBack ? (
          <button onClick={onBack} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 22, padding: 4, color: dm ? "#d8c8ff" : "#7b4fc8", lineHeight: 1,
          }}>←</button>
        ) : null}
      </div>
      <div style={logo}>Find the Imposter</div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {setMuted && (
          <button style={iconBtn} onClick={() => setMuted(m => !m)} title={muted ? "Unmute" : "Mute"}>
            {muted ? "🔇" : "🔊"}
          </button>
        )}
        {setDark && (
          <button style={iconBtn} onClick={() => setDark(d => !d)} title={dark ? "Light mode" : "Dark mode"}>
            {dark ? "☀️" : "🌙"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── PlayerAvatar ──────────────────────────────────────────────────────────────
function PlayerAvatar({ name, size = 36, showName = true }) {
  const av = avatarStyle(name);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: av.bg, border: `2px solid ${av.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: Math.round(size * 0.38), color: av.text,
        flexShrink: 0, boxShadow: `0 2px 8px ${av.shadow}`, letterSpacing: -0.5,
      }}>{name.slice(0,2).toUpperCase()}</div>
      {showName && <span style={{ fontWeight: 800, color: av.text, fontSize: 15 }}>{name}</span>}
    </div>
  );
}

// ── Discussion Timer ──────────────────────────────────────────────────────────
function LocalTimer({ initialSeconds = 60, dark: dm }) {
  const [sec, setSec] = useState(initialSeconds);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active || done) return;
    if (sec <= 0) { setDone(true); setActive(false); return; }
    const t = setTimeout(() => setSec(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [active, sec, done]);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss2 = String(sec % 60).padStart(2, "0");
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontSize: 60, fontWeight: 900, letterSpacing: 2,
        color: sec <= 10 ? "#e53935" : dm ? "#d8c8ff" : "#3d1c6e",
        fontVariantNumeric: "tabular-nums", lineHeight: 1, transition: "color 0.3s",
      }}>{mm}:{ss2}</div>
      {done && <div style={{ fontSize: 14, fontWeight: 800, color: "#e53935", marginTop: 6, animation: "shake 0.5s ease" }}>⏰ Time's Up! Proceed to vote.</div>}
      <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "center" }}>
        <button
          onClick={() => setActive(a => !a)}
          style={{
            flex: 1, maxWidth: 150, padding: "12px", borderRadius: 14, fontWeight: 800,
            fontSize: 14, cursor: "pointer", border: active ? "2px solid #48cae4" : "none",
            background: active ? (dm ? "rgba(72,202,228,0.15)" : "#fff") : "linear-gradient(135deg,#48cae4,#0096c7)",
            color: active ? "#0096c7" : "#fff",
            boxShadow: active ? "none" : "0 4px 16px rgba(72,202,228,0.4)",
          }}>{done ? "✓ Done" : active ? "⏸ Pause" : "▶ Start"}</button>
        <button
          onClick={() => { setSec(initialSeconds); setActive(false); setDone(false); }}
          style={{
            padding: "12px 16px", borderRadius: 14, fontWeight: 800, fontSize: 14,
            cursor: "pointer", border: dm ? "1.5px solid rgba(199,125,255,0.3)" : "1.5px solid #e6d6ff",
            background: "transparent", color: dm ? "#b8a0cc" : "#8b6aaa",
          }}>↺ Reset</button>
      </div>
    </div>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────────────
const PAGES = { HOME: "HOME", HOW_TO: "HOW_TO", SETUP: "SETUP", REVEAL: "REVEAL", DISCUSS: "DISCUSS", VOTE: "VOTE", RESULT: "RESULT" };

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SINGLE DEVICE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function SingleDeviceScreen({ onHome }) {
  const dark = useGameStore(s => s.dark);
  const [muted, setMuted] = useState(false);
  const [page, setPage] = useState(PAGES.HOME);

  // ── Setup state ──
  const [nameInput, setNameInput] = useState("");
  const [players, setPlayers] = useState([]);
  const [category, setCategory] = useState("Random Mix");
  const [difficulty, setDifficulty] = useState("medium");
  const [imposterCount, setImposterCount] = useState(1);

  // ── Game state ──
  const [gameData, setGameData] = useState(null);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [revealedSet, setRevealedSet] = useState(new Set());
  const [cardHidden, setCardHidden] = useState(false);
  const [allRevealed, setAllRevealed] = useState(false);

  // ── Vote state ──
  const [votes, setVotes] = useState({});
  const [votingPlayer, setVotingPlayer] = useState(0);
  const [votingDone, setVotingDone] = useState(false);

  // ── Result state ──
  const [resultRevealed, setResultRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // ── Shuffle animation ──
  const [shuffling, setShuffling] = useState(false);

  const nextBlockedRef = useRef(false);
  const dm = dark;

  const sound = useCallback((t) => { if (!muted) playSound(t); }, [muted]);

  // ── Derived ──
  const maxImposters = Math.min(3, Math.max(1, Math.floor((players.length - 1) / 2)));
  const allowedImposters = players.length >= 6 ? [1,2,3] : [1,2];

  useEffect(() => {
    if (imposterCount > maxImposters) setImposterCount(maxImposters);
  }, [players.length, maxImposters, imposterCount]);

  // ── Styles ──
  const S = {
    root: {
      minHeight: "100vh",
      background: dm
        ? "linear-gradient(135deg,#1a1025 0%,#1e0f1e 40%,#0e1a26 80%,#0e1f18 100%)"
        : "linear-gradient(135deg,#f8f0ff 0%,#fff0f7 40%,#f0faff 80%,#f0fff8 100%)",
      fontFamily: "'Nunito','Varela Round',system-ui,sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 0 60px", transition: "background 0.3s",
      color: dm ? "#f0e8ff" : "#2d1b4e",
    },
    wrap: { width: "100%", maxWidth: 480, padding: "0 20px" },
    card: {
      background: dm ? "rgba(255,255,255,0.06)" : "#fff",
      borderRadius: 24, padding: 24,
      boxShadow: dm
        ? "0 4px 24px rgba(0,0,0,0.4),0 1px 4px rgba(0,0,0,0.2)"
        : "0 4px 24px rgba(160,100,220,0.1),0 1px 4px rgba(0,0,0,0.05)",
      marginBottom: 16,
      border: dm ? "1px solid rgba(255,255,255,0.08)" : "none",
    },
    btn: (bg, color = "#fff", shadow = "rgba(0,0,0,0.1)") => ({
      background: bg, color, border: "none", borderRadius: 16,
      padding: "15px 24px", fontSize: 16, fontWeight: 800, cursor: "pointer",
      boxShadow: `0 4px 20px ${shadow}`,
      transition: "transform 0.15s,box-shadow 0.15s",
      width: "100%", marginBottom: 12, letterSpacing: 0.2,
    }),
    input: {
      background: dm ? "rgba(255,255,255,0.08)" : "#f8f0ff",
      border: dm ? "2px solid rgba(199,125,255,0.3)" : "2px solid #e6d6ff",
      borderRadius: 14, padding: "14px 18px", fontSize: 16, fontWeight: 600,
      color: dm ? "#f0e8ff" : "#4a1d6b",
      outline: "none", width: "100%", boxSizing: "border-box",
      transition: "border-color 0.2s",
    },
    select: {
      background: dm ? "rgba(255,255,255,0.08)" : "#f8f0ff",
      border: dm ? "2px solid rgba(199,125,255,0.3)" : "2px solid #e6d6ff",
      borderRadius: 14, padding: "14px 18px", fontSize: 15, fontWeight: 700,
      color: dm ? "#f0e8ff" : "#4a1d6b",
      outline: "none", width: "100%", cursor: "pointer",
      appearance: "none", boxSizing: "border-box",
    },
    h1: { fontSize: 34, fontWeight: 900, textAlign: "center", lineHeight: 1.15, marginBottom: 8, color: dm ? "#f0e8ff" : "#2d1b4e" },
    h2: { fontSize: 20, fontWeight: 800, color: dm ? "#d8c8ff" : "#3d1c6e", marginBottom: 4 },
    sub: { fontSize: 14, color: dm ? "#b8a0cc" : "#8b6aaa", textAlign: "center", marginBottom: 24, lineHeight: 1.5 },
    label: { fontSize: 12, fontWeight: 700, color: dm ? "#b8a0cc" : "#8b6aaa", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 },
  };

  const GLOBAL_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
    * { box-sizing:border-box; }
    button:hover  { transform:translateY(-2px)!important; box-shadow:0 8px 28px rgba(160,100,220,0.22)!important; }
    button:active { transform:translateY(0)!important; }
    input:focus, select:focus { border-color:#c77dff!important; }
    ::-webkit-scrollbar { width:6px; }
    ::-webkit-scrollbar-thumb { background:${dm?"#4a3060":"#e0c8ff"}; border-radius:3px; }
    @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes popIn     { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
    @keyframes shake     { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
    @keyframes spotlight { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
    @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
    @keyframes shuffleAnim { 0%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} 100%{transform:translateX(0)} }
  `;

  // ── Setup helpers ──
  function addPlayer() {
    const n = nameInput.trim();
    if (!n || players.find(p => p.toLowerCase() === n.toLowerCase())) return;
    if (players.length >= 12) return;
    setPlayers(prev => [...prev, n]);
    setNameInput("");
  }
  function removePlayer(name) {
    setPlayers(prev => prev.filter(p => p !== name));
  }
  function shufflePlayers() {
    sound("shuffle");
    setShuffling(true);
    setTimeout(() => {
      setPlayers(p => fisherYates(p));
      setShuffling(false);
    }, 300);
  }

  // ── Game helpers ──
  function buildGameData(playerList, cat, diff, nImposters) {
    const words = getWordsByCategory(cat);
    const wordEntry = randomFrom(words);
    const shuffledPlayers = fisherYates(playerList); // always shuffle reveal order
    const selectedHint = wordEntry.hints[diff] || wordEntry.hints.medium;
    const imposterIdxSet = new Set();
    while (imposterIdxSet.size < Math.min(nImposters, shuffledPlayers.length - 1)) {
      imposterIdxSet.add(Math.floor(Math.random() * shuffledPlayers.length));
    }
    const roles = shuffledPlayers.map((player, i) =>
      imposterIdxSet.has(i)
        ? { player, role: "imposter", hint: selectedHint }
        : { player, role: "player", word: wordEntry.word }
    );
    return { wordEntry, difficulty: diff, roles };
  }

  function resetRoundState() {
    setCurrentPlayerIdx(0);
    setRevealedSet(new Set());
    setCardHidden(false);
    setAllRevealed(false);
    setVotes({});
    setVotingPlayer(0);
    setVotingDone(false);
    setResultRevealed(false);
    nextBlockedRef.current = false;
  }

  function startGame() {
    if (players.length < 3) return;
    const data = buildGameData(players, category, difficulty, imposterCount);
    setGameData(data);
    resetRoundState();
    setPage(PAGES.REVEAL);
  }

  function newRound() {
    const data = buildGameData(players, category, difficulty, imposterCount);
    setGameData(data);
    resetRoundState();
    setPage(PAGES.REVEAL);
  }

  function resetGame() {
    resetRoundState();
    setPage(PAGES.SETUP);
  }

  const handleFlipDone = useCallback((playerName) => {
    sound("flip");
    setRevealedSet(prev => new Set([...prev, playerName]));
    setTimeout(() => { nextBlockedRef.current = false; }, 80);
  }, [sound]);

  const handleHideCard = useCallback(() => {
    setCardHidden(true);
  }, []);

  const handleNext = useCallback(() => {
    if (nextBlockedRef.current) return;
    nextBlockedRef.current = true;
    setCardHidden(false);
    sound("next");
    const next = currentPlayerIdx + 1;
    if (next >= (gameData?.roles.length ?? 0)) {
      setAllRevealed(true);
    } else {
      setCurrentPlayerIdx(next);
    }
  }, [currentPlayerIdx, gameData, sound]);

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (page === PAGES.HOME) return (
    <div style={S.root}>
      <style>{GLOBAL_CSS}</style>
      <TopBar dark={dark} setDark={() => {}} muted={muted} setMuted={setMuted} onBack={onHome} />
      <div style={{ ...S.wrap, display:"flex", flexDirection:"column", alignItems:"center", paddingTop:32 }}>
        <div style={{ fontSize:72, marginBottom:12, animation:"popIn 0.5s ease" }}>🕵️</div>
        <h1 style={S.h1}>
          <span style={{ background:"linear-gradient(90deg,#c77dff,#ff6b9d)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Find the</span>
          <br/><span style={{ color: dm ? "#f0e8ff" : "#2d1b4e" }}>Imposter</span>
        </h1>
        <p style={S.sub}>A social deduction party game for<br/>friends &amp; family ✨</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:36 }}>
          {["🍕 300+ Words","🇵🇭 Tagalog & English","👥 3–12 Players","🕵️ Multi-Imposter"].map(t => (
            <span key={t} style={{ background: dm ? "rgba(255,255,255,0.08)" : "#fff", borderRadius:20, padding:"7px 14px", fontSize:12, fontWeight:700, color: dm ? "#d8c8ff" : "#7b4fc8", boxShadow:"0 2px 12px rgba(160,100,220,0.15)" }}>{t}</span>
          ))}
        </div>
        <button style={{ ...S.btn("linear-gradient(135deg,#c77dff,#ff6b9d)","#fff","rgba(199,125,255,0.5)"), fontSize:18, padding:"18px" }}
          onClick={() => setPage(PAGES.SETUP)}>🎮 Start Game</button>
        <button style={{ ...S.btn(dm?"rgba(255,255,255,0.08)":"#fff", dm?"#d8c8ff":"#8b6aaa","rgba(160,100,220,0.12)"), border: dm?"1.5px solid rgba(199,125,255,0.25)":"2px solid #e6d6ff" }}
          onClick={() => setPage(PAGES.HOW_TO)}>📖 How To Play</button>
      </div>
    </div>
  );

  // ── HOW TO PLAY ───────────────────────────────────────────────────────────
  if (page === PAGES.HOW_TO) return (
    <div style={S.root}>
      <style>{GLOBAL_CSS}</style>
      <TopBar onBack={() => setPage(PAGES.HOME)} dark={dark} muted={muted} setMuted={setMuted} />
      <div style={S.wrap}>
        <h1 style={{ ...S.h1, fontSize:26, textAlign:"left", marginBottom:20 }}>📖 How To Play</h1>
        {[
          { icon:"1️⃣", title:"Add Players", desc:"Enter 3–12 player names. Use the shuffle button to randomize the order or re-shuffle the imposter role." },
          { icon:"2️⃣", title:"Choose Settings", desc:"Pick a category, hint difficulty, and number of imposters (1–3)." },
          { icon:"3️⃣", title:"Reveal Cards", desc:"Pass the phone around. Each player taps their card privately. Players see the secret word — imposters get only a vague hint!" },
          { icon:"4️⃣", title:"Discuss!", desc:"Everyone gives one clue about the word. Imposters must bluff using just their hint!" },
          { icon:"5️⃣", title:"Vote & Reveal", desc:"Use the 60-second timer, then vote for who you think is the imposter. The dramatic reveal follows!" },
        ].map(s => (
          <div key={s.title} style={{ ...S.card, display:"flex", gap:16, alignItems:"flex-start" }}>
            <span style={{ fontSize:26, lineHeight:1.3 }}>{s.icon}</span>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color: dm ? "#d8c8ff" : "#3d1c6e", marginBottom:3 }}>{s.title}</div>
              <div style={{ fontSize:13, color: dm ? "#b8a0cc" : "#8b6aaa", lineHeight:1.5 }}>{s.desc}</div>
            </div>
          </div>
        ))}
        <button style={{ ...S.btn("linear-gradient(135deg,#c77dff,#ff6b9d)","#fff","rgba(199,125,255,0.5)") }}
          onClick={() => setPage(PAGES.SETUP)}>🎮 Let's Play!</button>
      </div>
    </div>
  );

  // ── SETUP ─────────────────────────────────────────────────────────────────
  if (page === PAGES.SETUP) return (
    <div style={S.root}>
      <style>{GLOBAL_CSS}</style>
      <TopBar onBack={() => setPage(PAGES.HOME)} dark={dark} muted={muted} setMuted={setMuted} />
      <div style={S.wrap}>
        <h1 style={{ ...S.h1, fontSize:24, textAlign:"left", marginBottom:18 }}>⚙️ Game Setup</h1>

        {/* Add Players */}
        <div style={S.card}>
          <div style={S.h2}>👥 Players</div>
          <p style={{ fontSize:12, color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom:12, marginTop:2 }}>Minimum 3 to start</p>
          <div style={{ display:"flex", gap:10, marginBottom:4 }}>
            <input
              style={{ ...S.input, flex:1, marginBottom:0 }}
              placeholder="Enter player name…"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addPlayer()}
              maxLength={20}
            />
            <button onClick={addPlayer} disabled={!nameInput.trim()} style={{
              background: nameInput.trim() ? "linear-gradient(135deg,#c77dff,#ff6b9d)" : (dm ? "rgba(255,255,255,0.08)" : "#e0d0f0"),
              color:"#fff", border:"none", borderRadius:14, padding:"0 20px",
              fontWeight:800, fontSize:22, cursor: nameInput.trim() ? "pointer" : "default",
              boxShadow: nameInput.trim() ? "0 4px 16px rgba(199,125,255,0.4)" : "none",
              transition:"all 0.2s", flexShrink:0,
            }}>+</button>
          </div>
        </div>

        {/* Player list */}
        {players.length > 0 && (
          <div style={S.card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={S.h2}>Players ({players.length})</div>
              <div style={{ display:"flex", gap:8 }}>
                {/* Shuffle Players */}
                <button
                  onClick={shufflePlayers}
                  title="Shuffle player order"
                  style={{
                    background: dm ? "rgba(199,125,255,0.15)" : "#f0e6ff",
                    color: dm ? "#c77dff" : "#7b4fc8", border:"none", borderRadius:10,
                    padding:"7px 13px", fontWeight:700, fontSize:12, cursor:"pointer",
                    transition:"all 0.2s",
                    animation: shuffling ? "shuffleAnim 0.3s ease" : "none",
                  }}>🔀 Shuffle</button>
                {/* Re-assign Imposter (shuffle who gets imposter role) */}
                <button
                  onClick={() => {
                    sound("shuffle");
                    // Visual cue only — imposter will be re-assigned on startGame
                    // Flash a hint to the user
                    setShuffling(true);
                    setTimeout(() => setShuffling(false), 400);
                  }}
                  title="Randomly re-assign who opens first (imposter role shuffled on Start)"
                  style={{
                    background: dm ? "rgba(255,107,157,0.15)" : "#ffe0ec",
                    color: dm ? "#ff6b9d" : "#c2185b", border:"none", borderRadius:10,
                    padding:"7px 13px", fontWeight:700, fontSize:12, cursor:"pointer",
                    transition:"all 0.2s",
                  }}>🕵️ Re-roll</button>
              </div>
            </div>
            <p style={{ fontSize:11, color: dm ? "#8870aa" : "#aaa", marginBottom:10, marginTop:-4 }}>
              🔀 Shuffle = randomize order &nbsp;·&nbsp; 🕵️ Re-roll = new imposter on next Start
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:8, animation: shuffling ? "shuffleAnim 0.3s ease" : "none" }}>
              {players.map((name, i) => {
                const av = avatarStyle(name);
                return (
                  <div key={name} style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    background: av.bg, borderRadius:14, padding:"10px 14px",
                    boxShadow:`0 2px 8px ${av.shadow}`, border:`1.5px solid ${av.border}22`,
                    animation:"fadeUp 0.25s ease",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{
                        width:28, height:28, borderRadius:"50%", background:"#fff",
                        border:`2px solid ${av.border}`, display:"flex", alignItems:"center",
                        justifyContent:"center", fontWeight:900, fontSize:11, color:av.text, flexShrink:0,
                      }}>{name.slice(0,2).toUpperCase()}</div>
                      <span style={{ fontWeight:800, fontSize:14, color:av.text }}>{name}</span>
                    </div>
                    <button onClick={() => removePlayer(name)} style={{
                      background:"rgba(255,255,255,0.75)", border:"none", borderRadius:8,
                      width:26, height:26, cursor:"pointer", color:av.text, fontWeight:900, fontSize:14,
                    }}>×</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category */}
        <div style={S.card}>
          <div style={S.h2}>📂 Category</div>
          <p style={{ fontSize:12, color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom:10, marginTop:2 }}>Word category for this round</p>
          <div style={{ position:"relative" }}>
            <select value={category} onChange={e => setCategory(e.target.value)} style={S.select}>
              {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_EMOJIS[c]||"🎯"} {c}</option>)}
            </select>
            <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", fontSize:15 }}>▾</span>
          </div>
        </div>

        {/* Hint Difficulty */}
        <div style={S.card}>
          <div style={S.h2}>🎯 Hint Difficulty</div>
          <p style={{ fontSize:12, color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom:12, marginTop:2 }}>How obvious is the imposter's hint?</p>
          <div style={{ display:"flex", gap:8 }}>
            {[
              { key:"easy",   label:"Easy",   emoji:"😊", col:"#D6FFE8", border:"#6fcf97", text:"#2e7d32" },
              { key:"medium", label:"Medium", emoji:"🤔", col:"#FFF9D6", border:"#f2c94c", text:"#b45309" },
              { key:"hard",   label:"Hard",   emoji:"😈", col:"#FFD6E7", border:"#eb5757", text:"#b91c1c" },
            ].map(d => (
              <button key={d.key} onClick={() => setDifficulty(d.key)} style={{
                flex:1, padding:"11px 4px", borderRadius:14, cursor:"pointer",
                border: difficulty===d.key ? `2.5px solid ${d.border}` : "2.5px solid #eee",
                background: difficulty===d.key ? d.col : (dm ? "rgba(255,255,255,0.04)" : "#fafafa"),
                boxShadow: difficulty===d.key ? `0 4px 12px ${d.border}44` : "none",
                transition:"all 0.2s", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              }}>
                <span style={{ fontSize:20 }}>{d.emoji}</span>
                <span style={{ fontWeight:900, fontSize:12, color: difficulty===d.key ? d.text : (dm ? "#888" : "#999") }}>{d.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Imposters */}
        <div style={S.card}>
          <div style={S.h2}>🕵️ Imposters</div>
          <p style={{ fontSize:12, color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom:12, marginTop:2 }}>
            How many imposters this round?
            {players.length < 3 && <span style={{ color:"#e57373", fontWeight:700 }}> (add players to unlock)</span>}
          </p>
          <div style={{ display:"flex", gap:8 }}>
            {allowedImposters.map(n => {
              const isSelected = imposterCount === n;
              const isDisabled = n > maxImposters;
              return (
                <button key={n} onClick={() => !isDisabled && setImposterCount(n)} style={{
                  flex:1, padding:"12px 4px", borderRadius:14,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  border: isSelected ? "2.5px solid #c77dff" : "2.5px solid #eee",
                  background: isSelected ? "#f0e0ff" : isDisabled ? (dm ? "rgba(255,255,255,0.02)" : "#f5f5f5") : (dm ? "rgba(255,255,255,0.04)" : "#fafafa"),
                  boxShadow: isSelected ? "0 4px 12px rgba(199,125,255,0.3)" : "none",
                  opacity: isDisabled ? 0.35 : 1,
                  transition:"all 0.2s", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                }}>
                  <span style={{ fontSize:22 }}>{"🕵️".repeat(n)}</span>
                  <span style={{ fontWeight:900, fontSize:12, color: isSelected ? "#7b1fa2" : (dm ? "#888" : "#999") }}>
                    {n} {n===1?"Imposter":"Imposters"}
                  </span>
                  {isDisabled && <span style={{ fontSize:10, color:"#ccc" }}>🔒 Need more</span>}
                </button>
              );
            })}
          </div>
          {players.length >= 3 && players.length < 6 && (
            <p style={{ fontSize:11, color: dm ? "#8870aa" : "#aaa", marginTop:10, marginBottom:0, textAlign:"center" }}>
              💡 Add {6 - players.length} more player{6 - players.length !== 1 ? "s" : ""} to unlock 3 imposters
            </p>
          )}
        </div>

        {/* Warning */}
        {players.length > 0 && players.length < 3 && (
          <div style={{
            background: dm ? "rgba(229,115,115,0.15)" : "#fff5f5",
            border:"1.5px solid #ffcdd2", borderRadius:16, padding:"12px 16px",
            marginBottom:12, display:"flex", alignItems:"center", gap:10,
          }}>
            <span style={{ fontSize:18 }}>⚠️</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#e57373" }}>
              Add at least {3 - players.length} more player{3 - players.length !== 1 ? "s" : ""} to start.
            </span>
          </div>
        )}

        <button
          onClick={startGame}
          disabled={players.length < 3}
          style={{
            ...S.btn(
              players.length >= 3 ? "linear-gradient(135deg,#c77dff,#ff6b9d)" : (dm ? "rgba(255,255,255,0.08)" : "#e0e0e0"),
              players.length >= 3 ? "#fff" : (dm ? "#555" : "#aaa"),
              players.length >= 3 ? "rgba(199,125,255,0.5)" : "none"
            ),
            fontSize:17, padding:"17px",
            cursor: players.length >= 3 ? "pointer" : "not-allowed",
          }}
        >
          {players.length === 0
            ? "👥 Add players to start"
            : players.length < 3
              ? `⚠️ Need ${3 - players.length} more player${3 - players.length !== 1 ? "s" : ""}`
              : `🚀 Start Game (${players.length} players)`}
        </button>
      </div>
    </div>
  );

  // ── REVEAL ────────────────────────────────────────────────────────────────
  if (page === PAGES.REVEAL && gameData) {
    const { roles } = gameData;
    const currentRole  = roles[currentPlayerIdx];
    const currentName  = currentRole?.player;
    const isRevealed   = revealedSet.has(currentName);
    const isImposter   = isRevealed && currentRole?.role === "imposter";
    const currentWord  = isRevealed ? currentRole?.word : null;
    const currentHint  = isRevealed ? currentRole?.hint : null;
    const playerKey    = `${currentPlayerIdx}-${currentName}`;
    const av           = avatarStyle(currentName || "?");

    // All cards done → move to discuss
    if (allRevealed) {
      return (
        <div style={S.root}>
          <style>{GLOBAL_CSS}</style>
          {showConfetti && <Confetti />}
          <TopBar dark={dark} muted={muted} setMuted={setMuted} />
          <div style={{ ...S.wrap, display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ fontSize:64, marginTop:16, marginBottom:8, animation:"popIn 0.5s ease" }}>🎉</div>
            <h1 style={{ ...S.h1, fontSize:26, marginBottom:6 }}>All Cards Revealed!</h1>
            <p style={S.sub}>Time to discuss! Set the timer and start talking. 🗣️</p>

            <div style={{ ...S.card, width:"100%", textAlign:"center", background: dm ? "rgba(199,125,255,0.1)" : "linear-gradient(135deg,#f8e0ff,#ffe0f0)" }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#9c27b0", marginBottom:6 }}>Category</div>
              <div style={{ fontSize:18, fontWeight:900, color: dm ? "#d8c8ff" : "#4a148c" }}>{CATEGORY_EMOJIS[category]||"🎯"} {category}</div>
              <div style={{ marginTop:8, display:"flex", justifyContent:"center", gap:6 }}>
                {[{key:"easy",label:"Easy",emoji:"😊",bg:"#D6FFE8",col:"#2e7d32"},{key:"medium",label:"Medium",emoji:"🤔",bg:"#FFF9D6",col:"#b45309"},{key:"hard",label:"Hard",emoji:"😈",bg:"#FFD6E7",col:"#b91c1c"}].map(d => (
                  <span key={d.key} style={{ padding:"3px 12px", borderRadius:20, fontSize:11, fontWeight:800, background: difficulty===d.key ? d.bg : "rgba(255,255,255,0.4)", color: difficulty===d.key ? d.col : "#ccc" }}>{d.emoji} {d.label}</span>
                ))}
              </div>
            </div>

            <div style={{ ...S.card, width:"100%", textAlign:"center" }}>
              <div style={{ fontSize:13, fontWeight:700, color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom:10, letterSpacing:1 }}>⏱ DISCUSSION TIMER</div>
              <LocalTimer initialSeconds={60} dark={dm} />
            </div>

            <button style={{ ...S.btn("linear-gradient(135deg,#ff6b9d,#c77dff)","#fff","rgba(199,125,255,0.5)"), fontSize:16 }}
              onClick={() => { sound("next"); setPage(PAGES.VOTE); }}>
              🗳️ Proceed to Vote
            </button>
            <button style={{ ...S.btn("linear-gradient(135deg,#c77dff,#ff6b9d)","#fff","rgba(199,125,255,0.5)"), fontSize:15 }}
              onClick={newRound}>🔄 New Round</button>
            <button style={{ ...S.btn(dm?"rgba(255,255,255,0.08)":"#fff",dm?"#d8c8ff":"#8b6aaa","rgba(160,100,220,0.12)"), border: dm?"1.5px solid rgba(199,125,255,0.2)":"2px solid #e6d6ff" }}
              onClick={resetGame}>⚙️ Change Settings</button>
            <button style={{ ...S.btn(dm?"rgba(255,100,100,0.12)":"#fff","#e57373","rgba(220,100,100,0.1)"), border:"2px solid #ffd6d6" }}
              onClick={() => { setPlayers([]); setPage(PAGES.HOME); }}>🏠 Home</button>
          </div>
        </div>
      );
    }

    // Active card reveal
    const cardBack = (
      <div style={{
        width:"100%", height:"100%", position:"absolute", inset:0,
        borderRadius:28, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", padding:24,
        background: isImposter
          ? "linear-gradient(135deg,#ffe0e0,#ffd6e7)"
          : "linear-gradient(135deg,#d6ffe8,#d6f0ff)",
      }}>
        <div style={{ fontSize:48, marginBottom:10 }}>{isImposter ? "🕵️" : "😊"}</div>
        <div style={{ fontWeight:900, fontSize:11, letterSpacing:2, textTransform:"uppercase", color: isImposter ? "#c62828" : "#2e7d32", marginBottom:6, opacity:0.75 }}>
          {isImposter ? "⚠️ You are" : "✅ You are"}
        </div>
        <div style={{ fontWeight:900, fontSize: isImposter ? 30 : 24, color: isImposter ? "#b71c1c" : "#1b5e20", marginBottom:16, textAlign:"center" }}>
          {isImposter ? "THE IMPOSTER" : "A Player"}
        </div>
        <div style={{
          background:"rgba(255,255,255,0.85)", borderRadius:16, padding:"14px 20px",
          textAlign:"center", width:"100%",
          animation: isRevealed ? "fadeUp 0.35s ease 0.1s both" : "none",
        }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#888", marginBottom:4 }}>
            {isImposter ? "Your Hint" : "Secret Word"}
          </div>
          <div style={{ fontWeight:900, fontSize:24, color: isImposter ? "#c62828" : "#1565c0" }}>
            {isImposter ? currentHint : currentWord}
          </div>
          {isImposter && <div style={{ fontSize:11, color:"#aaa", marginTop:6, fontStyle:"italic" }}>Blend in — don't get caught!</div>}
        </div>
        <div style={{ fontSize:11, color:"#bbb", marginTop:14, fontStyle:"italic" }}>Memorize, then hide or pass ↓</div>
      </div>
    );

    const cardFront = (
      <>
        <div style={{
          width:60, height:60, borderRadius:"50%",
          background: av.bg, border:`3px solid ${av.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontWeight:900, fontSize:22, color:av.text, marginBottom:14,
          boxShadow:`0 4px 16px ${av.shadow}`,
        }}>{(currentName||"?").slice(0,2).toUpperCase()}</div>
        <div style={{ fontWeight:900, fontSize:20, color:"#3d1c6e", marginBottom:4 }}>{currentName}</div>
        <div style={{ fontWeight:600, fontSize:13, color:"#9b7acc" }}>Tap to reveal your role</div>
        <div style={{ marginTop:18, background:"rgba(255,255,255,0.75)", borderRadius:12, padding:"7px 18px", fontSize:12, color:"#8b6aaa", fontWeight:700 }}>
          🔒 Keep it private!
        </div>
      </>
    );

    return (
      <div style={S.root}>
        <style>{GLOBAL_CSS}</style>
        {showConfetti && <Confetti />}
        <TopBar onBack={resetGame} dark={dark} muted={muted} setMuted={setMuted} />

        <div style={S.wrap}>
          {/* Progress bar */}
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
            {roles.map((r, i) => {
              const done   = revealedSet.has(r.player) && i < currentPlayerIdx;
              const active = i === currentPlayerIdx;
              return (
                <div key={i} style={{
                  flex:1, height:5, borderRadius:3,
                  background: done ? "linear-gradient(90deg,#c77dff,#ff6b9d)" : active ? "#e6d6ff" : "#f0e8ff",
                  transition:"background 0.4s",
                }}/>
              );
            })}
          </div>

          {/* Name + counter */}
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:12, color:"#9b7acc", fontWeight:600, marginBottom:2 }}>
              Player {currentPlayerIdx+1} of {roles.length}
            </div>
            <PlayerAvatar name={currentName} size={40} showName={true} />
          </div>

          {/* Card */}
          {!cardHidden ? (
            <FlipCard
              playerKey={playerKey}
              flipped={isRevealed}
              onFlip={() => handleFlipDone(currentName)}
              front={cardFront}
              back={cardBack}
            />
          ) : (
            <div style={{ width:"100%", maxWidth:340, margin:"0 auto", paddingBottom:"130%", position:"relative" }}>
              <div style={{
                position:"absolute", inset:0, borderRadius:28,
                background:"linear-gradient(135deg,#2d1b4e,#4a1d6b)",
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                boxShadow:"0 8px 32px rgba(45,27,78,0.35)",
              }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🔒</div>
                <div style={{ fontWeight:900, fontSize:18, color:"#fff", marginBottom:6 }}>Card Hidden</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>Pass to next player</div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ marginTop:20 }}>
            {!isRevealed && !cardHidden && (
              <button style={{ ...S.btn("linear-gradient(135deg,#c77dff,#ff6b9d)","#fff","rgba(199,125,255,0.4)"), fontSize:16 }}
                onClick={() => { document.querySelector(".fi-inner:not(.fi-flipped)")?.click(); }}>
                🃏 Reveal My Card
              </button>
            )}
            {isRevealed && !cardHidden && (
              <button style={{ ...S.btn("#fff","#7b1fa2","rgba(160,100,220,0.15)"), border:"2px solid #e6d6ff", fontSize:15 }}
                onClick={handleHideCard}>
                🙈 Hide Card
              </button>
            )}
            {cardHidden && (
              <button style={{ ...S.btn("linear-gradient(135deg,#48cae4,#0096c7)","#fff","rgba(72,202,228,0.4)"), fontSize:16 }}
                onClick={handleNext}>
                {currentPlayerIdx+1 < roles.length
                  ? `➡️ Next: ${roles[currentPlayerIdx+1]?.player}`
                  : "🎉 Start Discussion!"}
              </button>
            )}
          </div>

          {/* Player queue badges */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", marginTop:12 }}>
            {roles.map((r, i) => {
              const av2    = avatarStyle(r.player);
              const isDone = i < currentPlayerIdx && revealedSet.has(r.player);
              const isAct  = i === currentPlayerIdx;
              const isNxt  = i === currentPlayerIdx + 1;
              return (
                <div key={r.player} style={{
                  background: isAct ? av2.bg : isDone ? (dm ? "rgba(255,255,255,0.04)" : "#f4f4f4") : (dm ? "rgba(255,255,255,0.03)" : "#fff"),
                  border: isAct ? `2px solid ${av2.border}` : isNxt ? "2px dashed #c9b8e8" : "2px solid #eee",
                  borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:800,
                  color: isAct ? av2.text : isDone ? "#bbb" : isNxt ? "#b8a0d8" : "#ddd",
                  transition:"all 0.3s", boxShadow: isAct ? `0 2px 8px ${av2.shadow}` : "none",
                }}>
                  {isDone ? "✓ " : isAct ? "● " : ""}{r.player}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── VOTE ──────────────────────────────────────────────────────────────────
  if (page === PAGES.VOTE && gameData) {
    const { roles } = gameData;
    const voter = roles[votingPlayer];
    const voterName = voter?.player;

    if (votingDone) {
      const tally = {};
      roles.forEach(r => { tally[r.player] = 0; });
      Object.values(votes).forEach(v => { if (tally[v] !== undefined) tally[v]++; });
      const maxVotes = Math.max(...Object.values(tally));
      const mostVoted = Object.entries(tally).filter(([,v]) => v === maxVotes).map(([k]) => k);

      return (
        <div style={S.root}>
          <style>{GLOBAL_CSS}</style>
          <TopBar dark={dark} muted={muted} setMuted={setMuted} />
          <div style={{ ...S.wrap, display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ fontSize:56, marginTop:12, marginBottom:8 }}>🗳️</div>
            <h1 style={{ ...S.h1, fontSize:24, marginBottom:4 }}>Vote Results</h1>
            <p style={S.sub}>Most votes: <b>{mostVoted.join(", ")}</b></p>
            <div style={{ ...S.card, width:"100%" }}>
              {roles.map(r => (
                <div key={r.player} style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  background: mostVoted.includes(r.player) ? "#fff0e0" : (dm ? "rgba(255,255,255,0.04)" : "#fafafa"),
                  borderRadius:14, padding:"12px 16px", marginBottom:8,
                  border: mostVoted.includes(r.player) ? "2px solid #ff9800" : "2px solid #eee",
                }}>
                  <PlayerAvatar name={r.player} size={32}/>
                  <span style={{ fontWeight:900, fontSize:16, color:"#c77dff" }}>{tally[r.player]} vote{tally[r.player]!==1?"s":""}</span>
                </div>
              ))}
            </div>
            <button style={{ ...S.btn("linear-gradient(135deg,#ff6b9d,#c77dff)","#fff","rgba(199,125,255,0.5)"), fontSize:17 }}
              onClick={() => { sound("win"); setResultRevealed(false); setPage(PAGES.RESULT); }}>
              🎭 Reveal the Imposter!
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={S.root}>
        <style>{GLOBAL_CSS}</style>
        <TopBar dark={dark} muted={muted} setMuted={setMuted} />
        <div style={S.wrap}>
          <div style={{ display:"flex", gap:6, marginBottom:16 }}>
            {roles.map((_, i) => (
              <div key={i} style={{ flex:1, height:5, borderRadius:3, background: i < votingPlayer ? "linear-gradient(90deg,#c77dff,#ff6b9d)" : i===votingPlayer ? "#e6d6ff" : "#f0e8ff", transition:"background 0.4s" }}/>
            ))}
          </div>

          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:12, color:"#9b7acc", fontWeight:600, marginBottom:6 }}>Voter {votingPlayer+1} of {roles.length}</div>
            <PlayerAvatar name={voterName} size={44}/>
            <div style={{ fontSize:14, color: dm ? "#b8a0cc" : "#8b6aaa", marginTop:6 }}>{voterName}, who do you suspect?</div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
            {roles.filter(r => r.player !== voterName).map(r => {
              const av2 = avatarStyle(r.player);
              const selected = votes[voterName] === r.player;
              return (
                <button key={r.player}
                  onClick={() => { sound("next"); setVotes(v => ({...v, [voterName]: r.player})); }}
                  style={{
                    display:"flex", alignItems:"center", gap:12,
                    background: selected ? av2.bg : (dm ? "rgba(255,255,255,0.05)" : "#fff"),
                    border: selected ? `2.5px solid ${av2.border}` : "2.5px solid #eee",
                    borderRadius:16, padding:"14px 18px", cursor:"pointer",
                    boxShadow: selected ? `0 4px 16px ${av2.shadow}` : "0 2px 8px rgba(0,0,0,0.04)",
                    transition:"all 0.2s", width:"100%",
                  }}>
                  <div style={{ width:38, height:38, borderRadius:"50%", background: av2.bg, border:`2px solid ${av2.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, color:av2.text, flexShrink:0 }}>
                    {r.player.slice(0,2).toUpperCase()}
                  </div>
                  <span style={{ fontWeight:800, fontSize:16, color: selected ? av2.text : (dm ? "#f0e8ff" : "#3d1c6e") }}>{r.player}</span>
                  {selected && <span style={{ marginLeft:"auto", fontSize:18 }}>✓</span>}
                </button>
              );
            })}
          </div>

          <button
            disabled={!votes[voterName]}
            onClick={() => {
              sound("next");
              if (votingPlayer + 1 >= roles.length) {
                setVotingDone(true);
              } else {
                setVotingPlayer(v => v + 1);
              }
            }}
            style={{
              ...S.btn(
                votes[voterName] ? "linear-gradient(135deg,#48cae4,#0096c7)" : "#ddd",
                "#fff", votes[voterName] ? "rgba(72,202,228,0.4)" : "none"
              ),
              fontSize:16, cursor: votes[voterName] ? "pointer" : "default",
            }}>
            {votingPlayer + 1 < roles.length ? `➡️ Next Voter: ${roles[votingPlayer+1]?.player}` : "🗳️ See Results"}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (page === PAGES.RESULT && gameData) {
    const { roles } = gameData;
    const imposters = roles.filter(r => r.role === "imposter");

    return (
      <div style={S.root}>
        <style>{GLOBAL_CSS}</style>
        {showConfetti && <Confetti />}
        <TopBar dark={dark} muted={muted} setMuted={setMuted} />
        <div style={{ ...S.wrap, display:"flex", flexDirection:"column", alignItems:"center" }}>

          {!resultRevealed ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginTop:40 }}>
              <div style={{ fontSize:72, marginBottom:16, animation:"shake 0.6s ease infinite" }}>🎭</div>
              <h1 style={{ ...S.h1, fontSize:26, marginBottom:8 }}>The Imposter Was…</h1>
              <p style={S.sub}>Are you ready for the dramatic reveal?</p>
              <button style={{ ...S.btn("linear-gradient(135deg,#ff6b9d,#c77dff)","#fff","rgba(199,125,255,0.5)"), fontSize:18, padding:"18px" }}
                onClick={() => {
                  sound("win");
                  setResultRevealed(true);
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 4500);
                }}>
                🥁 Reveal Now!
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontSize:72, marginTop:24, marginBottom:8, animation:"popIn 0.5s ease" }}>🎭</div>
              <h1 style={{ ...S.h1, fontSize:26, marginBottom:4 }}>THE IMPOSTER{imposters.length>1?"S WERE":" WAS"}…</h1>

              {imposters.map(imp => {
                const av2 = avatarStyle(imp.player);
                return (
                  <div key={imp.player} style={{
                    ...S.card, width:"100%", textAlign:"center",
                    animation:"spotlight 0.6s ease",
                    border:`2px solid ${av2.border}`, background: av2.bg,
                  }}>
                    <div style={{ width:68, height:68, borderRadius:"50%", background:"#fff", border:`3px solid ${av2.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:24, color:av2.text, margin:"0 auto 10px", boxShadow:`0 4px 20px ${av2.shadow}` }}>
                      {imp.player.slice(0,2).toUpperCase()}
                    </div>
                    <div style={{ fontSize:26, fontWeight:900, color:av2.text }}>{imp.player}</div>
                    <div style={{ fontSize:13, color:av2.text, opacity:0.7, marginTop:4 }}>🕵️ The Imposter</div>
                    <div style={{ fontSize:12, color:av2.text, opacity:0.6, marginTop:2 }}>Their hint was: <b>{imp.hint}</b></div>
                  </div>
                );
              })}

              <div style={{ ...S.card, width:"100%", textAlign:"center", background: dm ? "rgba(199,125,255,0.1)" : "linear-gradient(135deg,#E6D6FF,#D6F0FF)" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#0277bd", marginBottom:6 }}>The Secret Word Was</div>
                <div style={{ fontSize:30, fontWeight:900, color: dm ? "#d8c8ff" : "#1a5276" }}>{gameData.wordEntry.word}</div>
                <div style={{ fontSize:12, color:"#0277bd", opacity:0.7, marginTop:4 }}>{CATEGORY_EMOJIS[category]||"🎯"} {category}</div>
              </div>

              <div style={{ ...S.card, width:"100%" }}>
                <div style={{ fontSize:13, fontWeight:700, color: dm ? "#b8a0cc" : "#8b6aaa", marginBottom:10 }}>All roles revealed</div>
                {roles.map(r => {
                  const isImp = r.role === "imposter";
                  const av2 = avatarStyle(r.player);
                  return (
                    <div key={r.player} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${dm?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)"}` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background:av2.bg, border:`1.5px solid ${av2.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:11, color:av2.text }}>
                          {r.player.slice(0,2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight:800, fontSize:14, color: dm ? "#f0e8ff" : "#2d1b4e" }}>{r.player}</span>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <span style={{ fontSize:12, fontWeight:700, color: isImp ? "#c2185b" : "#2e7d32", background: isImp ? "#ffe0ec" : "#d6ffe8", padding:"3px 10px", borderRadius:8 }}>
                          {isImp ? "🕵️ Imposter" : "😊 Player"}
                        </span>
                        {isImp && <div style={{ fontSize:11, color: dm ? "#b8a0cc" : "#8b6aaa", marginTop:2 }}>Hint: {r.hint}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button style={{ ...S.btn("linear-gradient(135deg,#c77dff,#ff6b9d)","#fff","rgba(199,125,255,0.5)"), fontSize:16, padding:"15px" }}
                onClick={newRound}>
                🔄 Play Again!
              </button>
              <button style={{ ...S.btn(dm?"rgba(255,255,255,0.08)":"#fff",dm?"#d8c8ff":"#8b6aaa","rgba(160,100,220,0.1)"), border: dm?"1.5px solid rgba(199,125,255,0.2)":"2px solid #e6d6ff", fontSize:14, padding:"12px" }}
                onClick={resetGame}>
                ⚙️ Change Settings
              </button>
              <button style={{ ...S.btn(dm?"rgba(255,100,100,0.12)":"#fff","#e57373","rgba(220,100,100,0.1)"), border:"2px solid #ffd6d6", fontSize:14, padding:"12px" }}
                onClick={() => { setPlayers([]); setPage(PAGES.HOME); }}>
                🏠 Home
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}