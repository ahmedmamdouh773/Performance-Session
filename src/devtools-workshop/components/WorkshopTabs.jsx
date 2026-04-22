import { T } from "../theme";

export function WorkshopTabs({ modules, active, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", flexWrap: "wrap" }}>
      {modules.map((m) => {
        const isActive = active === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            style={{
              padding: "7px 14px",
              border: `1px solid ${isActive ? m.accent.border : T.border}`,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              background: isActive ? m.accent.bg : T.surface,
              color: isActive ? m.accent.fg : T.textSec,
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
