import { T } from "../theme";

export function WorkshopHeader() {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: T.surface,
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          🛠
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.4px" }}>
            Browser DevTools Workshop
          </h1>
          <p style={{ fontSize: 12, color: T.subtle, marginTop: 2 }}>React Edition · Intermediate · All demos are simulated</p>
        </div>
      </div>
      <p style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, maxWidth: 560, marginTop: 8 }}>
        Practical debugging & monitoring for React teams. Work through each module with your real browser DevTools open alongside.
      </p>
    </div>
  );
}
