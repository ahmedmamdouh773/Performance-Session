import { T } from "./theme";

export const sharedStyles = {
  card: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "1.5rem", marginBottom: "1rem" },
  demoArea: { background: T.surface, borderRadius: 10, padding: "1rem", margin: "1rem 0", border: `1px solid ${T.border}` },
  demoLabel: { fontSize: 10, fontWeight: 700, color: T.subtle, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 },
  step: { display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" },
  stepNum: {
    minWidth: 24,
    height: 24,
    borderRadius: "50%",
    background: T.surface,
    border: `1px solid ${T.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    color: T.muted,
    flexShrink: 0,
  },
  stepText: { fontSize: 13, lineHeight: 1.7, color: T.text },
};
