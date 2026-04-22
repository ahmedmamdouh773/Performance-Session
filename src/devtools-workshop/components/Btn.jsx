import { T } from "../theme";

export function Btn({ onClick, variant = "default", children, disabled }) {
  const variants = {
    default: { border: T.border, color: T.textSec, bg: T.surface },
    danger: { border: T.red.border, color: T.red.fg, bg: T.red.bg },
    primary: { border: T.blue.border, color: T.blue.fg, bg: T.blue.bg },
    success: { border: T.green.border, color: T.green.fg, bg: T.green.bg },
  };
  const v = variants[variant] || variants.default;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 14px",
        border: `1px solid ${v.border}`,
        borderRadius: 8,
        background: v.bg,
        fontSize: 13,
        cursor: disabled ? "not-allowed" : "pointer",
        color: v.color,
        marginRight: 8,
        marginBottom: 6,
        fontFamily: "inherit",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}
