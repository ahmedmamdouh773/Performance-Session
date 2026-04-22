import { T } from "../theme";
import { CHEAT } from "../data";
import { sharedStyles as s } from "../sharedStyles";
import { Code } from "../components/Code";

export function CheatSheet() {
  return (
    <div style={s.card}>
      <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16, color: T.text }}>DevTools Quick Reference</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {CHEAT.map((sec) => (
          <div key={sec.title} style={{ background: sec.color.bg, border: `1px solid ${sec.color.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: sec.color.fg,
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              {sec.title}
            </div>
            {sec.items.map(([label, shortcut]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 12,
                  padding: "5px 0",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <span style={{ color: T.text }}>{label}</span>
                <code style={{ fontFamily: "monospace", fontSize: 11, color: sec.color.fg, opacity: 0.85 }}>{shortcut}</code>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: "14px 16px", background: T.purple.bg, border: `1px solid ${T.purple.border}`, borderRadius: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.purple.fg, marginBottom: 6 }}>React-specific workflow</p>
        <p style={{ fontSize: 13, color: T.purple.fg, lineHeight: 1.7, opacity: 0.9 }}>
          Use the <strong>React DevTools Profiler</strong> for re-render analysis → wrap expensive components in <Code>React.memo()</Code> → use{" "}
          <Code>useCallback</Code> to stabilize function props → use <Code>useMemo</Code> for expensive calculations. Always check the "Components"
          panel to confirm state changes happen where you expect.
        </p>
      </div>
    </div>
  );
}
