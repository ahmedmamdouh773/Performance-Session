import { T } from "../theme";

export function DemoBlock({ variant = "simulated", accent, label, hint, children }) {
  const isReal = variant === "real";
  const a = accent || T.blue;
  const borderColor = isReal ? a.fg : T.border;
  const labelColor = isReal ? a.fg : T.muted;
  const labelText = label || (isReal ? "Real example — open DevTools now" : "Simulated walk-through");
  const bg = isReal ? a.bg : T.surface;

  return (
    <div
      style={{
        background: bg,
        borderRadius: 10,
        padding: "1rem",
        margin: "1rem 0",
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 10,
          fontWeight: 700,
          color: labelColor,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: isReal ? a.fg : T.subtle,
          }}
        />
        <span>{labelText}</span>
      </div>
      {hint && (
        <p style={{ fontSize: 12, color: isReal ? a.fg : T.textSec, opacity: 0.9, marginBottom: 10, lineHeight: 1.5 }}>{hint}</p>
      )}
      {children}
    </div>
  );
}
