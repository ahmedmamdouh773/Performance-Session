export function Badge({ mod }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 20,
        background: mod.accent.bg,
        color: mod.accent.fg,
        border: `1px solid ${mod.accent.border}`,
        letterSpacing: "0.3px",
      }}
    >
      {mod.label}
    </span>
  );
}
