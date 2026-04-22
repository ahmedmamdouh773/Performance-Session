import { useState } from "react";
import { T } from "../theme";

export function TopicTabs({ accent, explanation, steps }) {
  const [tab, setTab] = useState("explanation");
  const a = accent || T.blue;

  const tabs = [
    { id: "explanation", label: "Explanation" },
    { id: "steps", label: "Steps" },
  ];

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: `1px solid ${T.border}`,
          marginBottom: 14,
        }}
      >
        {tabs.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                padding: "8px 14px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${isActive ? a.fg : "transparent"}`,
                color: isActive ? a.fg : T.textSec,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: -1,
                transition: "all 0.15s",
                letterSpacing: "0.3px",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div>{tab === "explanation" ? explanation : steps}</div>
    </div>
  );
}

export function Explain({ children }) {
  return (
    <div style={{ fontSize: 13, color: T.text, lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 10 }}>
      {children}
    </div>
  );
}

export function ExplainHeading({ children }) {
  return (
    <h4 style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: "6px 0 0 0", letterSpacing: "0.2px" }}>{children}</h4>
  );
}

export function ExplainList({ items }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((it, i) => (
        <li key={i} style={{ fontSize: 13, color: T.textSec, lineHeight: 1.7 }}>
          {it}
        </li>
      ))}
    </ul>
  );
}
