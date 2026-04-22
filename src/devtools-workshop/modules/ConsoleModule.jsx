import { useState, useRef } from "react";
import { T } from "../theme";
import { MODULES } from "../data";
import { SectionCard } from "../components/SectionCard";
import { Step } from "../components/Step";
import { Code } from "../components/Code";
import { Btn } from "../components/Btn";
import { DemoBlock } from "../components/DemoBlock";
import { OpenDevToolsHint } from "../components/OpenDevToolsHint";
import { TopicTabs, Explain, ExplainHeading, ExplainList } from "../components/TopicTabs";

const SIMULATED_USERS = [
  { id: 1, name: "Sara Hassan", email: "sara@example.com", role: "admin" },
  { id: 2, name: "Omar Nasser", email: "omar@example.com", role: "editor" },
  { id: 3, name: "Lina Khalil", email: "lina@example.com", role: "viewer" },
];

function SimulatedConsole() {
  const [lines, setLines] = useState([{ t: "info", text: "// Simulated DevTools console output" }]);
  const ref = useRef(null);
  const push = (newLines) => {
    setLines((p) => [...p, ...newLines]);
    setTimeout(() => {
      if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    }, 40);
  };
  const colors = { err: "#f87171", warn: "#fbbf24", info: "#60a5fa", log: "#c8c8d8" };

  return (
    <>
      <Btn
        variant="danger"
        onClick={() =>
          push([
            { t: "err", text: "Uncaught TypeError: Cannot read properties of undefined (reading 'userId')" },
            { t: "err", text: "    at processUserData (Dashboard.jsx:147:22)" },
            { t: "err", text: "    at handleButtonClick (Dashboard.jsx:89:5)" },
            { t: "log", text: "// Fix: check if data exists before accessing .userId" },
          ])
        }
      >
        TypeError
      </Btn>
      <Btn
        variant="danger"
        onClick={() =>
          push([
            { t: "err", text: "Uncaught ReferenceError: userData is not defined" },
            { t: "err", text: "    at renderProfile (Profile.jsx:34:12)" },
            { t: "log", text: "// Fix: variable declared inside if-block, used outside its scope" },
          ])
        }
      >
        ReferenceError
      </Btn>
      <Btn
        onClick={() =>
          push([
            { t: "warn", text: 'Warning: Each child in a list should have a unique "key" prop.' },
            { t: "warn", text: "    Check the render method of `UserList`. [React]" },
          ])
        }
      >
        Warning
      </Btn>
      <Btn
        variant="primary"
        onClick={() =>
          push([
            { t: "info", text: "console.table(users) →" },
            { t: "log", text: "┌─────┬──────────────┬───────────────────────┬──────────┐" },
            { t: "log", text: "│ id  │ name         │ email                 │ role     │" },
            { t: "log", text: "├─────┼──────────────┼───────────────────────┼──────────┤" },
            { t: "log", text: "│  1  │ Sara Hassan  │ sara@example.com      │ admin    │" },
            { t: "log", text: "│  2  │ Omar Nasser  │ omar@example.com      │ editor   │" },
            { t: "log", text: "│  3  │ Lina Khalil  │ lina@example.com      │ viewer   │" },
            { t: "log", text: "└─────┴──────────────┴───────────────────────┴──────────┘" },
          ])
        }
      >
        Table
      </Btn>
      <Btn onClick={() => setLines([{ t: "info", text: "// Simulated DevTools console output" }])}>Clear</Btn>
      <div
        ref={ref}
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          background: "#060608",
          color: "#c8c8d8",
          borderRadius: 8,
          padding: 10,
          minHeight: 90,
          maxHeight: 170,
          overflowY: "auto",
          marginTop: 10,
          border: `1px solid ${T.border}`,
        }}
      >
        {lines.map((l, i) => (
          <div key={i} style={{ color: colors[l.t], whiteSpace: "pre", lineHeight: 1.6 }}>
            {l.text}
          </div>
        ))}
      </div>
    </>
  );
}

function RealConsole() {
  const [lastAction, setLastAction] = useState(null);

  const mark = (label) => setLastAction(label);

  const logError = () => {
    console.error(new TypeError("Cannot read properties of undefined (reading 'userId')"));
    mark("console.error(new TypeError(...))");
  };
  const logWarn = () => {
    console.warn("Deprecated API: `getUserSync` will be removed in v3. Use `getUser(id)` instead.");
    mark('console.warn("Deprecated API: ...")');
  };
  const logTable = () => {
    console.table(SIMULATED_USERS);
    mark("console.table(users)");
  };
  const logGroup = () => {
    console.group("checkout flow");
    console.log("step 1: validate cart");
    console.log("step 2: charge card");
    console.warn("step 3: email receipt failed — retrying");
    console.groupEnd();
    mark("console.group / groupEnd");
  };
  const logTime = () => {
    console.time("heavy-loop");
    let sum = 0;
    for (let i = 0; i < 2_000_000; i++) sum += i;
    console.timeEnd("heavy-loop");
    mark(`console.time("heavy-loop") — sum=${sum}`);
  };
  const logCount = () => {
    console.count("click");
    mark('console.count("click")');
  };
  const logTrace = () => {
    function inner() {
      console.trace("tracing call site");
    }
    function outer() {
      inner();
    }
    outer();
    mark("console.trace() from outer → inner");
  };
  const throwUncaught = () => {
    setTimeout(() => {
      throw new Error("Simulated crash: payment service unreachable");
    }, 0);
    mark("throw new Error (uncaught, via setTimeout)");
  };
  const runDebugger = () => {
    const order = { id: "ord_42", total: 129.9, items: 3 };
    // Pause here in the Sources panel to inspect `order`.
    // eslint-disable-next-line no-debugger
    debugger;
    console.log("resumed after debugger — order:", order);
    mark("debugger; (pauses if DevTools is open)");
  };

  return (
    <>
      <Btn variant="danger" onClick={logError}>console.error</Btn>
      <Btn onClick={logWarn}>console.warn</Btn>
      <Btn variant="primary" onClick={logTable}>console.table</Btn>
      <Btn onClick={logGroup}>console.group</Btn>
      <Btn onClick={logTime}>console.time</Btn>
      <Btn onClick={logCount}>console.count</Btn>
      <Btn onClick={logTrace}>console.trace</Btn>
      <Btn variant="danger" onClick={throwUncaught}>throw (uncaught)</Btn>
      <Btn variant="success" onClick={runDebugger}>debugger;</Btn>
      <p style={{ fontSize: 12, color: T.textSec, marginTop: 10, lineHeight: 1.6 }}>
        {lastAction ? (
          <>
            Last call: <code style={{ fontFamily: "monospace", color: T.teal.fg }}>{lastAction}</code>. Check your real Console — you should see
            a new entry (with file + line).
          </>
        ) : (
          "Click any button above — it fires a real call on the real `console` API."
        )}
      </p>
    </>
  );
}

export function ConsoleModule() {
  const mod = MODULES[0];
  return (
    <SectionCard
      mod={mod}
      title="Console & Error Debugging"
      desc="Scenario: A button crashes silently in production. Users see nothing, but the feature is broken. Use the Console panel to find and understand the error."
      tip="After triggering an error, read the stack trace together as a team. Identify which file and line caused it, then discuss the fix."
    >
      <TopicTabs
        accent={mod.accent}
        explanation={
          <Explain>
            <p>
              The <strong style={{ color: T.text }}>Console</strong> is the browser&apos;s live feed of what your app is saying — every{" "}
              <Code>console.log</Code>, warning, and uncaught exception ends up here, tagged with the file and line that produced it. It&apos;s
              usually the <em>first place</em> you should look when something feels broken.
            </p>
            <ExplainHeading>Message levels you&apos;ll see</ExplainHeading>
            <ExplainList
              items={[
                <><Code>log</Code> / <Code>info</Code> — neutral diagnostics (white / blue).</>,
                <><Code>warn</Code> — yellow, &quot;this still works but please fix it&quot; (deprecations, bad keys).</>,
                <><Code>error</Code> — red, something actually failed. Comes with a <strong style={{ color: T.text }}>stack trace</strong>.</>,
                <><strong style={{ color: T.text }}>Uncaught</strong> — an exception nobody caught. These often silently break a feature.</>,
              ]}
            />
            <ExplainHeading>Reading a stack trace</ExplainHeading>
            <p>
              The top line is the error + message. Each line below is &quot;who called who&quot;, most recent first. Click any{" "}
              <Code>file.jsx:line:col</Code> link and DevTools jumps straight to that line in the Sources panel — that&apos;s where you start
              debugging.
            </p>
            <ExplainHeading>Useful console APIs (not just log)</ExplainHeading>
            <ExplainList
              items={[
                <><Code>console.table(arr)</Code> — render arrays/objects as a sortable table instead of squinting at <Code>[Object]</Code>.</>,
                <><Code>console.group / groupEnd</Code> — nest related logs so they don&apos;t drown each other.</>,
                <><Code>console.time / timeEnd</Code> — quick &quot;how long did that take&quot; without a profiler.</>,
                <><Code>console.count(label)</Code> — how many times did we hit this line? Great for catching double-renders.</>,
                <><Code>console.trace()</Code> — print the stack <em>without</em> throwing. Answers &quot;who called this?&quot;.</>,
                <><Code>debugger;</Code> — a breakpoint you can check into git. Execution pauses here <em>only when DevTools is open</em>.</>,
              ]}
            />
            <ExplainHeading>Common team pitfalls</ExplainHeading>
            <ExplainList
              items={[
                "Swallowing errors in try/catch without logging — the console stays clean, but the feature is broken.",
                "Leaving third-party noise unfiltered. Use the dropdown → filter to \"Errors\" or a text filter to cut through the noise.",
                "Reading only the first line of a stack trace. The cause is usually 2–4 frames down, in your code, not in a library.",
              ]}
            />
          </Explain>
        }
        steps={
          <>
            <Step num={1}>
              Open DevTools → <strong style={{ color: T.text }}>Console</strong> tab (<Code>F12</Code> or <Code>Cmd+Option+J</Code>). Clear any existing logs.
            </Step>
            <Step num={2}>Click the error buttons below — these simulate real bugs you&apos;d see in a React app.</Step>
            <Step num={3}>In the real Console, each error links to the file + line number. Click it to jump to the Sources panel.</Step>
            <Step num={4}>
              Use <Code>console.table(data)</Code> to inspect arrays/objects cleanly. Try &quot;Log user table&quot; below.
            </Step>
            <Step num={5}>
              Filter noise: use the Console dropdown to show only <Code>Errors</Code>. Add <Code>debugger;</Code> in code to pause execution.
            </Step>
          </>
        }
      />

      <DemoBlock variant="simulated" hint="Annotated for the slide — each button pushes a canned stack trace into this in-page terminal.">
        <SimulatedConsole />
      </DemoBlock>

      <DemoBlock variant="real" accent={mod.accent}>
        <OpenDevToolsHint panel="Console">
          Each button fires a real call on <Code>window.console</Code> — your actual DevTools should light up, including file + line.
        </OpenDevToolsHint>
        <RealConsole />
      </DemoBlock>
    </SectionCard>
  );
}
