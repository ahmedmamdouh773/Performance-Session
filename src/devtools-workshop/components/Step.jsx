import { sharedStyles as s } from "../sharedStyles";

export function Step({ num, children }) {
  return (
    <div style={s.step}>
      <div style={s.stepNum}>{num}</div>
      <div style={s.stepText}>{children}</div>
    </div>
  );
}
