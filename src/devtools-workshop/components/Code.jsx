import { T } from "../theme";

export function Code({ children }) {
  return (
    <code
      style={{
        fontFamily: "monospace",
        fontSize: 12,
        background: T.surface,
        border: `1px solid ${T.border}`,
        padding: "2px 7px",
        borderRadius: 5,
        color: T.teal.fg,
      }}
    >
      {children}
    </code>
  );
}
