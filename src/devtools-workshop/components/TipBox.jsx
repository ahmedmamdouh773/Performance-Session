import { T } from "../theme";

export function TipBox({ accent, children }) {
  const a = accent || T.blue;
  return (
    <div
      style={{
        background: a.bg,
        borderLeft: `3px solid ${a.fg}`,
        borderRadius: "0 8px 8px 0",
        padding: "10px 14px",
        marginTop: 16,
        fontSize: 13,
        color: a.fg,
        lineHeight: 1.6,
      }}
    >
      <strong>Team exercise: </strong>
      {children}
    </div>
  );
}
