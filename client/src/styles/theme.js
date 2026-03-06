/**
 * Returns the shared style object S.
 * Call useSStyles(dark) inside any component.
 */
export function useStyles(dark) {
  const dm = dark;
  return {
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
    h1: {
      fontSize: 32, fontWeight: 900, textAlign: "center",
      lineHeight: 1.15, marginBottom: 8,
      color: dm ? "#f0e8ff" : "#2d1b4e",
    },
    h2: { fontSize: 20, fontWeight: 800, color: dm ? "#d8c8ff" : "#3d1c6e", marginBottom: 4 },
    sub: { fontSize: 14, color: dm ? "#b8a0cc" : "#8b6aaa", textAlign: "center", marginBottom: 20, lineHeight: 1.5 },
    label: {
      fontSize: 12, fontWeight: 700,
      color: dm ? "#b8a0cc" : "#8b6aaa",
      display: "block", marginBottom: 6,
      textTransform: "uppercase", letterSpacing: 0.8,
    },
    warningBox: {
      background: dm ? "rgba(229,115,115,0.15)" : "#fff5f5",
      border: "1.5px solid #ffcdd2",
      borderRadius: 16, padding: "12px 16px", marginBottom: 12,
      display: "flex", alignItems: "center", gap: 10,
    },
    iconBtn: {
      background: dm ? "rgba(255,255,255,0.1)" : "rgba(160,100,220,0.1)",
      border: dm ? "1.5px solid rgba(255,255,255,0.18)" : "1.5px solid rgba(199,125,255,0.28)",
      borderRadius: 10, width: 34, height: 34, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 17, transition: "all 0.2s", flexShrink: 0, padding: 0, lineHeight: 1,
    },
  };
}

export const GLOBAL_CSS = (dm) => `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; }
  button:hover  { transform: translateY(-2px)!important; box-shadow: 0 8px 28px rgba(160,100,220,0.22)!important; }
  button:active { transform: translateY(0)!important; }
  input:focus, select:focus { border-color: #c77dff!important; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: ${dm ? "#4a3060" : "#e0c8ff"}; border-radius: 3px; }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes popIn     { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes shake     { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
  @keyframes spotlight { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
`;
