import { useEffect, useState } from "react";
import { T } from "../theme";
import { MODULES } from "../data";
import { SectionCard } from "../components/SectionCard";
import { Step } from "../components/Step";
import { Code } from "../components/Code";
import { Btn } from "../components/Btn";
import { DemoBlock } from "../components/DemoBlock";
import { OpenDevToolsHint } from "../components/OpenDevToolsHint";
import { TopicTabs, Explain, ExplainHeading, ExplainList } from "../components/TopicTabs";

function MemBar({ label, pct, value, barCol }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
      <span style={{ fontSize: 13, color: T.textSec, minWidth: 120 }}>{label}</span>
      <div style={{ flex: 1, height: 12, background: T.surface, borderRadius: 6, overflow: "hidden", border: `1px solid ${T.border}` }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: barCol(pct),
            borderRadius: 6,
            transition: "width 0.4s ease, background 0.4s ease",
          }}
        />
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 12, color: barCol(pct), minWidth: 50, textAlign: "right", fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

const barCol = (pct) => (pct > 70 ? T.red.fg : pct > 40 ? T.amber.fg : T.green.fg);

function SimulatedMemory() {
  const [heap, setHeap] = useState(18);
  const [evCount, setEvCount] = useState(4);
  const [detached, setDetached] = useState(0);
  const [leaks, setLeaks] = useState(0);

  const heapPct = Math.min((heap / 200) * 100, 100);
  const evPct = Math.min((evCount / 200) * 100, 100);
  const dnPct = Math.min((detached / 100) * 100, 100);

  const statusMsg =
    leaks === 0
      ? "Memory looks healthy. Click 'Simulate leak' to see what a leak looks like."
      : heapPct > 60
        ? "Critical: heap growing uncontrolled — app will eventually freeze or crash."
        : "Leak detected: event listeners accumulating. Not yet critical but will worsen.";

  const statusCol = heapPct > 60 ? T.red.fg : heapPct > 35 ? T.amber.fg : T.green.fg;

  return (
    <>
      <Btn
        variant="danger"
        onClick={() => {
          setLeaks((l) => l + 1);
          setHeap((h) => Math.min(h + 12 + Math.random() * 10, 200));
          setEvCount((e) => e + 8 + Math.floor(Math.random() * 5));
          setDetached((d) => d + 3 + Math.floor(Math.random() * 4));
        }}
      >
        Simulate leak (+)
      </Btn>
      <Btn
        variant="success"
        onClick={() => {
          setLeaks(0);
          setHeap((h) => Math.max(18, h * 0.4));
          setEvCount(4);
          setDetached(0);
        }}
      >
        Simulate GC / fix
      </Btn>
      <Btn
        onClick={() => {
          setLeaks(0);
          setHeap(18);
          setEvCount(4);
          setDetached(0);
        }}
      >
        Reset
      </Btn>
      <div style={{ marginTop: 16 }}>
        <MemBar label="Heap used" pct={heapPct} value={`${Math.round(heap)} MB`} barCol={barCol} />
        <MemBar label="Event listeners" pct={evPct} value={evCount} barCol={barCol} />
        <MemBar label="Detached nodes" pct={dnPct} value={detached} barCol={barCol} />
        <p style={{ fontSize: 12, color: statusCol, marginTop: 8, lineHeight: 1.5 }}>{statusMsg}</p>
      </div>
    </>
  );
}

// Module-level refs so they survive unmounts and show up in heap snapshots.
const CHUNK_SIZE = 100_000;
const leakedChunks = [];
const listenerBag = [];

if (typeof window !== "undefined") {
  window.__workshopLeak = { leakedChunks, listenerBag };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function useHeapSize() {
  const [size, setSize] = useState(() => performance.memory?.usedJSHeapSize ?? null);
  useEffect(() => {
    if (!performance.memory) return undefined;
    const id = setInterval(() => setSize(performance.memory.usedJSHeapSize), 750);
    return () => clearInterval(id);
  }, []);
  return size;
}

function RealMemory() {
  const [chunks, setChunks] = useState(leakedChunks.length);
  const [listeners, setListeners] = useState(listenerBag.length);
  const heap = useHeapSize();

  const leakOnce = () => {
    const payload = new Array(CHUNK_SIZE).fill(0).map((_, i) => ({
      id: i,
      tag: "leaked",
      ts: Date.now(),
    }));
    leakedChunks.push(payload);
    setChunks(leakedChunks.length);
  };

  const dropLeak = () => {
    leakedChunks.length = 0;
    setChunks(0);
  };

  const addListener = () => {
    const heavy = new Array(50_000).fill("retained-by-closure");
    const handler = () => {
      // Reference `heavy` so it survives inside the listener's closure.
      void heavy.length;
    };
    window.addEventListener("resize", handler);
    listenerBag.push({ type: "resize", handler, heavy });
    setListeners(listenerBag.length);
  };

  const removeListener = () => {
    const last = listenerBag.pop();
    if (last) window.removeEventListener(last.type, last.handler);
    setListeners(listenerBag.length);
  };

  const estBytes = chunks * CHUNK_SIZE * 32;
  return (
    <>
      <Btn variant="danger" onClick={leakOnce}>
        + leak 100k objects
      </Btn>
      <Btn variant="success" onClick={dropLeak}>
        Drop references
      </Btn>
      <Btn variant="danger" onClick={addListener}>
        + listener (with closure)
      </Btn>
      <Btn variant="success" onClick={removeListener}>
        Remove listener
      </Btn>

      <div style={{ marginTop: 16, fontSize: 13, color: T.textSec, lineHeight: 1.8 }}>
        <div>
          Leaked chunks kept alive: <strong style={{ color: T.text }}>{chunks}</strong> (~{formatBytes(estBytes)} estimated)
        </div>
        <div>
          Orphaned listeners: <strong style={{ color: T.text }}>{listeners}</strong>
        </div>
        {heap != null && (
          <div>
            <Code>performance.memory.usedJSHeapSize</Code>: <strong style={{ color: T.text }}>{formatBytes(heap)}</strong>
          </div>
        )}
        <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>
          Tip: in the real Console, type <Code>__workshopLeak</Code> to inspect the retained arrays directly.
        </div>
      </div>
    </>
  );
}

export function MemoryModule() {
  const mod = MODULES[3];
  return (
    <SectionCard
      mod={mod}
      title="Memory Leaks"
      desc="Scenario: Your SPA slows down after extended use, especially after navigating between routes. Memory is being allocated and never freed."
      tip="Find a useEffect in your project that adds an event listener. Confirm it returns a cleanup function that removes it. Missing cleanup = memory leak."
    >
      <TopicTabs
        accent={mod.accent}
        explanation={
          <Explain>
            <p>
              JavaScript has automatic <strong style={{ color: T.text }}>garbage collection</strong>: an object is freed when nothing still
              references it. A <strong style={{ color: T.text }}>memory leak</strong> is the opposite — an object nobody needs anymore is
              still being held onto (usually by accident), so the GC can&apos;t reclaim it. Do that enough times and the heap grows forever
              until the tab freezes or crashes.
            </p>
            <ExplainHeading>Classic leak patterns (all of these are in real codebases)</ExplainHeading>
            <ExplainList
              items={[
                <><Code>addEventListener</Code> without a matching <Code>removeEventListener</Code> on unmount. The listener keeps the closure — and everything it captured — alive.</>,
                <><Code>setInterval</Code> / <Code>setTimeout</Code> that&apos;s never cleared. The callback and its closure live as long as the timer does.</>,
                <>Subscriptions (WebSocket, RxJS, event emitters, Firebase) without a corresponding <Code>unsubscribe</Code>.</>,
                <>Module-level arrays / maps used as caches that only ever grow (<Code>const cache = []</Code> at file top).</>,
                <>Detached DOM nodes — you removed an element from the page, but a JS variable still points at it.</>,
                <>Closures capturing large data: a tiny handler that happens to reference a huge parent-scope variable.</>,
              ]}
            />
            <ExplainHeading>How to investigate (Heap snapshot workflow)</ExplainHeading>
            <ExplainList
              items={[
                "1. Take a baseline snapshot on a clean page.",
                "2. Do the suspicious action 5–10 times (open/close a modal, navigate back and forth).",
                "3. Trigger GC (trash-can icon) and take a second snapshot.",
                <>4. Switch the view to <Code>Comparison</Code> — the <Code>#Delta</Code> column shows what <em>grew</em> between snapshots. If a specific constructor keeps going up, that&apos;s your suspect.</>,
                <>5. Click an instance → look at <strong style={{ color: T.text }}>Retainers</strong> (bottom panel). That&apos;s the chain of references keeping it alive. Follow it to find the culprit code.</>,
              ]}
            />
            <ExplainHeading>Other Memory tab profilers</ExplainHeading>
            <ExplainList
              items={[
                <><strong style={{ color: T.text }}>Allocation instrumentation on timeline</strong> — records every allocation. Blue bars = survived, grey = GC&apos;d. Tall blue = leak candidate.</>,
                <><strong style={{ color: T.text }}>Allocation sampling</strong> — low-overhead, good for long sessions. Shows <em>which functions</em> allocated the most memory.</>,
                <><Code>performance.memory.usedJSHeapSize</Code> — a quick runtime check you can log from code.</>,
              ]}
            />
            <ExplainHeading>React-specific rule</ExplainHeading>
            <p>
              Anything you set up in <Code>useEffect</Code> that can outlive the component{" "}
              <strong style={{ color: T.text }}>must</strong> be cleaned up in the returned function: timers, listeners, subscriptions,
              observers. If the effect has no cleanup and it&apos;s not just computing a value, it&apos;s a leak waiting to happen.
            </p>
          </Explain>
        }
        steps={
          <>
            <Step num={1}>
              Open DevTools → <strong style={{ color: T.text }}>Memory</strong> tab. Take a &quot;Heap snapshot&quot; as your baseline.
            </Step>
            <Step num={2}>Reproduce the suspected leak: navigate to a component and back, repeat 5 times. Take a second snapshot.</Step>
            <Step num={3}>
              Switch view to <strong style={{ color: T.text }}>&quot;Comparison&quot;</strong> and filter by <Code># New</Code> — see what was allocated
              and not freed.
            </Step>
            <Step num={4}>
              Common causes: <Code>addEventListener</Code> without cleanup, <Code>setInterval</Code> never cleared, closures retaining large objects.
            </Step>
            <Step num={5}>
              In React: always return cleanup from <Code>useEffect</Code>. Example: <Code>{"return () => clearInterval(id)"}</Code>.
            </Step>
          </>
        }
      />

      <DemoBlock variant="simulated" hint="State-only — use this to explain what leak symptoms look like before taking real snapshots.">
        <SimulatedMemory />
      </DemoBlock>

      <DemoBlock variant="real" accent={mod.accent}>
        <OpenDevToolsHint panel="Memory">
          Take a <strong>Heap snapshot</strong>, click &quot;+ leak 100k objects&quot; a few times, take a <strong>second snapshot</strong>,
          then switch to <Code>Comparison</Code>. Search for <Code>leaked</Code> — you should see the retained arrays. Click &quot;Drop
          references&quot; and snapshot again to confirm they&apos;re gone.
        </OpenDevToolsHint>
        <RealMemory />
      </DemoBlock>
    </SectionCard>
  );
}
