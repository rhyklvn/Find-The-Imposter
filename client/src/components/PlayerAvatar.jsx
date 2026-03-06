import React from "react";

function nameToHue(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

export function avatarStyle(name) {
  const hue = nameToHue(name);
  return {
    bg:     `hsl(${hue},65%,88%)`,
    text:   `hsl(${hue},55%,38%)`,
    border: `hsl(${hue},55%,72%)`,
    shadow: `hsla(${hue},65%,70%,0.35)`,
  };
}

export default function PlayerAvatar({ name, size = 36, showName = true, badge = "" }) {
  const av = avatarStyle(name);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: av.bg, border: `2px solid ${av.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: Math.round(size * 0.38), color: av.text,
        flexShrink: 0, boxShadow: `0 2px 8px ${av.shadow}`, letterSpacing: -0.5,
        position: "relative",
      }}>
        {name.slice(0, 2).toUpperCase()}
        {badge && (
          <span style={{ position: "absolute", bottom: -4, right: -4, fontSize: 12, lineHeight: 1 }}>
            {badge}
          </span>
        )}
      </div>
      {showName && (
        <span style={{ fontWeight: 800, color: av.text, fontSize: 15 }}>{name}</span>
      )}
    </div>
  );
}
