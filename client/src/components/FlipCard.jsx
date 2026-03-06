import React, { useRef, useEffect } from "react";

const FLIP_CSS = `
  .fi-scene{perspective:1200px;width:100%;max-width:320px;margin:0 auto;-webkit-tap-highlight-color:transparent;user-select:none;}
  .fi-inner{position:relative;width:100%;padding-bottom:130%;transform-style:preserve-3d;transition:transform 0.55s cubic-bezier(0.45,0.05,0.55,0.95);will-change:transform;border-radius:28px;cursor:pointer;}
  .fi-inner.fi-flipped{transform:rotateY(180deg);cursor:default;}
  .fi-inner:not(.fi-flipped):hover{transform:rotateY(5deg) scale(1.018);}
  .fi-face{position:absolute;inset:0;border-radius:28px;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;}
  .fi-front{background:linear-gradient(135deg,#E6D6FF 0%,#D6F0FF 100%);box-shadow:0 8px 32px rgba(140,100,220,0.18),0 2px 8px rgba(0,0,0,0.06);padding:24px;}
  .fi-back{transform:rotateY(180deg);box-shadow:0 8px 40px rgba(140,100,220,0.22);}
  @keyframes fi-pulse{from{box-shadow:0 0 0 0 rgba(199,125,255,0.4)}to{box-shadow:0 0 0 10px rgba(199,125,255,0)}}
  .fi-inner.fi-flipped .fi-back{animation:fi-pulse 0.4s ease-out 0.5s 1 forwards;}
`;

let cssInjected = false;
function injectCss() {
  if (cssInjected) return; cssInjected = true;
  const tag = document.createElement("style"); tag.textContent = FLIP_CSS; document.head.appendChild(tag);
}

export default function FlipCard({ playerKey, flipped, onFlip, front, back }) {
  const innerRef = useRef(null);
  const lockedRef = useRef(false);

  useEffect(() => { injectCss(); }, []);

  // Reset card when playerKey changes
  useEffect(() => {
    const el = innerRef.current; if (!el) return;
    el.style.transition = "none"; el.classList.remove("fi-flipped"); lockedRef.current = false;
    requestAnimationFrame(() => requestAnimationFrame(() => { if (el) el.style.transition = ""; }));
  }, [playerKey]);

  useEffect(() => {
    const el = innerRef.current; if (!el || !flipped) return;
    el.classList.add("fi-flipped");
  }, [flipped]);

  function handleClick() {
    if (lockedRef.current || flipped) return;
    lockedRef.current = true;
    const el = innerRef.current; if (!el) return;
    el.classList.add("fi-flipped");
    setTimeout(() => { if (onFlip) onFlip(); }, 600);
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
