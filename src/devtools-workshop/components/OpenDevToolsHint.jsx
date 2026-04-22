import { T } from "../theme";

export function OpenDevToolsHint({ panel, children }) {
  return (
    <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, margin: "0 0 10px 0" }}>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          background: T.surface,
          border: `1px solid ${T.border}`,
          padding: "1px 6px",
          borderRadius: 4,
          color: T.textSec,
          marginRight: 6,
        }}
      >
        F12 / ⌘⌥I
      </span>
      → <strong style={{ color: T.text }}>{panel}</strong> tab. {children}
    </p>
  );
}
