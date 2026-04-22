import { T } from "../theme";
import { sharedStyles as s } from "../sharedStyles";
import { Badge } from "./Badge";
import { TipBox } from "./TipBox";

export function SectionCard({ mod, title, desc, children, tip }) {
  return (
    <div style={s.card}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Badge mod={mod} />
      </div>
      <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, color: T.text }}>{title}</h2>
      <p style={{ fontSize: 13, color: T.textSec, marginBottom: 18, lineHeight: 1.6 }}>{desc}</p>
      {children}
      {tip && <TipBox accent={mod.accent}>{tip}</TipBox>}
    </div>
  );
}
