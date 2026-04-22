import { memo, useCallback, useEffect, useRef, useState } from "react";
import { T } from "../theme";
import { MODULES, REACT_TIPS } from "../data";
import { SectionCard } from "../components/SectionCard";
import { Step } from "../components/Step";
import { Code } from "../components/Code";
import { Btn } from "../components/Btn";
import { DemoBlock } from "../components/DemoBlock";
import { OpenDevToolsHint } from "../components/OpenDevToolsHint";
import { TopicTabs, Explain, ExplainHeading, ExplainList } from "../components/TopicTabs";

function SimulatedReactTips() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
      {REACT_TIPS.map((tip, i) => (
        <div
          key={i}
          role="button"
          tabIndex={0}
          onClick={() => setExpanded(expanded === i ? null : i)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setExpanded(expanded === i ? null : i);
            }
          }}
          style={{
            background: expanded === i ? tip.accent.bg : T.surface,
            border: `1px solid ${expanded === i ? tip.accent.border : T.border}`,
            borderRadius: 10,
            padding: "10px 12px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: expanded === i ? 8 : 0 }}>
            <span style={{ fontSize: 16 }}>{tip.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: expanded === i ? tip.accent.fg : T.text }}>{tip.title}</span>
          </div>
          {expanded === i && <p style={{ fontSize: 12, color: tip.accent.fg, lineHeight: 1.6, opacity: 0.9 }}>{tip.desc}</p>}
        </div>
      ))}
    </div>
  );
}

function useRenderCount() {
  const ref = useRef(0);
  ref.current += 1;
  return ref.current;
}

function NaiveChild({ label, onPing }) {
  const count = useRenderCount();
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: 12,
        color: T.textSec,
      }}
    >
      <div style={{ color: T.text, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div>
        renders: <strong style={{ color: T.red.fg }}>{count}</strong>
      </div>
      <button
        type="button"
        onClick={onPing}
        style={{
          marginTop: 8,
          padding: "4px 10px",
          fontSize: 12,
          background: "transparent",
          color: T.textSec,
          border: `1px solid ${T.border}`,
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ping parent
      </button>
    </div>
  );
}

const MemoChild = memo(function MemoChild({ label, onPing }) {
  const count = useRenderCount();
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: 12,
        color: T.textSec,
      }}
    >
      <div style={{ color: T.text, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div>
        renders: <strong style={{ color: T.green.fg }}>{count}</strong>
      </div>
      <button
        type="button"
        onClick={onPing}
        style={{
          marginTop: 8,
          padding: "4px 10px",
          fontSize: 12,
          background: "transparent",
          color: T.textSec,
          border: `1px solid ${T.border}`,
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ping parent
      </button>
    </div>
  );
});

function RealReactDemo() {
  const [tick, setTick] = useState(0);
  const [auto, setAuto] = useState(false);
  const [pings, setPings] = useState(0);

  useEffect(() => {
    if (!auto) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, [auto]);

  // Unstable: new function on every parent render → breaks memo.
  const unstablePing = () => setPings((p) => p + 1);
  // Stable: same identity across renders → memo holds.
  const stablePing = useCallback(() => setPings((p) => p + 1), []);

  return (
    <>
      <Btn variant="primary" onClick={() => setTick((t) => t + 1)}>
        Force parent re-render
      </Btn>
      <Btn variant={auto ? "danger" : "default"} onClick={() => setAuto((a) => !a)}>
        {auto ? "Stop auto-tick" : "Auto-tick every 500ms"}
      </Btn>
      <p style={{ fontSize: 12, color: T.textSec, marginTop: 6, lineHeight: 1.6 }}>
        parent tick: <strong style={{ color: T.text }}>{tick}</strong> · total pings:{" "}
        <strong style={{ color: T.text }}>{pings}</strong>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginTop: 10 }}>
        <NaiveChild label="Naive child" onPing={unstablePing} />
        <MemoChild label="React.memo + useCallback" onPing={stablePing} />
        <MemoChild label="React.memo + UNSTABLE prop" onPing={unstablePing} />
      </div>
    </>
  );
}

export function ReactModule() {
  const mod = MODULES[4];
  return (
    <SectionCard
      mod={mod}
      title="React DevTools"
      desc="Install the React DevTools browser extension (Chrome/Firefox) to unlock React-specific debugging: component trees, state inspection, re-render profiling, and more."
      tip="Open React DevTools Profiler, click Record, interact with your app, then stop. Find the tallest bars — those are your most expensive renders."
    >
      <TopicTabs
        accent={mod.accent}
        explanation={
          <Explain>
            <p>
              React DevTools is a browser extension that adds two panels to the regular DevTools:{" "}
              <strong style={{ color: T.text }}>Components</strong> (inspect the live tree) and{" "}
              <strong style={{ color: T.text }}>Profiler</strong> (measure renders). It turns React from a black box into something you can
              actually debug — you can see props, state, context, and hooks, and figure out <em>why</em> a component re-rendered.
            </p>
            <ExplainHeading>Why re-renders matter</ExplainHeading>
            <p>
              React re-renders a component when its state changes, its parent re-renders, or a context it consumes changes. Each render
              runs the component function again and diffs the returned JSX. That&apos;s usually cheap — but do it on a deeply nested tree,
              or inside a big list, or on every keystroke, and it shows up as lag.
            </p>
            <ExplainHeading>The Components panel</ExplainHeading>
            <ExplainList
              items={[
                "Click any node to see its current props, state, and hook values — all editable live.",
                <>In ⚙️ settings enable <strong style={{ color: T.text }}>Highlight updates when components render</strong>. Components flash on every render — unnecessary flashing = unnecessary work.</>,
                <>Use the search box to jump to a component by name; the <Code>&lt;&gt;</Code> icon opens it in Sources.</>,
              ]}
            />
            <ExplainHeading>The Profiler panel</ExplainHeading>
            <ExplainList
              items={[
                "Click record → interact with the app → stop. You get a commit-by-commit flame chart of every render.",
                <>Wide yellow bars = expensive renders. Click one to see <strong style={{ color: T.text }}>&quot;Why did this render?&quot;</strong> — props changed, state changed, hook changed, or parent re-rendered.</>,
                <>The <Code>Ranked</Code> view sorts components by render time so the worst offenders float to the top.</>,
              ]}
            />
            <ExplainHeading>Common fixes once you&apos;ve identified waste</ExplainHeading>
            <ExplainList
              items={[
                <><Code>React.memo(Component)</Code> — skip the re-render if props are shallow-equal.</>,
                <><Code>useCallback(fn, deps)</Code> — keep a function reference stable so memoized children don&apos;t re-render.</>,
                <><Code>useMemo(() =&gt; …, deps)</Code> — cache expensive computations or object literals passed as props.</>,
                <>Move state <em>down</em> — if only one child cares about a piece of state, lift it out of the parent so siblings don&apos;t re-render.</>,
                <>Avoid inline objects / arrays as props when the child is memoized (<Code>{"style={{...}}"}</Code> is a new object every render).</>,
              ]}
            />
            <ExplainHeading>Watch out for</ExplainHeading>
            <ExplainList
              items={[
                "Memoizing everything. Memo has its own cost — only reach for it when the Profiler actually shows a problem.",
                <>Passing an <em>unstable</em> callback into a <Code>memo</Code> child. The memo does nothing because the prop changes every render. (The demo below shows exactly this.)</>,
                "Context providers that put a new object into `value` every render — every consumer re-renders.",
              ]}
            />
          </Explain>
        }
        steps={
          <>
            <Step num={1}>
              Install the <strong style={{ color: T.text }}>React Developer Tools</strong> extension from the Chrome Web Store or Firefox Add-ons.
            </Step>
            <Step num={2}>
              Open DevTools — you&apos;ll see two new tabs: <Code>Components</Code> and <Code>Profiler</Code>.
            </Step>
            <Step num={3}>
              In <strong style={{ color: T.text }}>Components</strong>, click any node in the tree to inspect its current props, state, and hook values
              live.
            </Step>
            <Step num={4}>
              In <strong style={{ color: T.text }}>Profiler</strong>, record a session then look at the flame chart for expensive renders.
            </Step>
            <Step num={5}>
              Enable &quot;Highlight updates&quot; in settings — components flash when they re-render, making unnecessary renders obvious.
            </Step>
          </>
        }
      />

      <DemoBlock variant="simulated" label="Cheatsheet — click to expand">
        <SimulatedReactTips />
      </DemoBlock>

      <DemoBlock variant="real" accent={mod.accent}>
        <OpenDevToolsHint panel="Components / Profiler">
          In React DevTools → ⚙️ settings → enable <strong>Highlight updates when components render</strong>. Then click &quot;Auto-tick&quot;.
          The naive child and the memo child with an <em>unstable</em> callback will flash on every tick; the memo child with a stable{" "}
          <Code>useCallback</Code> will not.
        </OpenDevToolsHint>
        <RealReactDemo />
      </DemoBlock>
    </SectionCard>
  );
}
