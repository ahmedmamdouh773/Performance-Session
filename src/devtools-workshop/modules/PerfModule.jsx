import { useEffect, useState } from "react";
import { T } from "../theme";
import { MODULES, PERF_DATA } from "../data";
import { SectionCard } from "../components/SectionCard";
import { Step } from "../components/Step";
import { Code } from "../components/Code";
import { Btn } from "../components/Btn";
import { DemoBlock } from "../components/DemoBlock";
import { OpenDevToolsHint } from "../components/OpenDevToolsHint";
import { TopicTabs, Explain, ExplainHeading, ExplainList } from "../components/TopicTabs";

const isGoodSim = (m) => m.val <= m.good;
const simColor = (m) => (isGoodSim(m) ? T.green.fg : m.pct > 70 ? T.red.fg : T.amber.fg);
const simLabel = (m) => (isGoodSim(m) ? "Good" : m.pct > 70 ? "Poor" : "Needs improvement");

function SimulatedPerf() {
  const [metrics, setMetrics] = useState(null);
  return (
    <>
      <Btn variant="primary" onClick={() => setMetrics(PERF_DATA)}>
        Run simulation
      </Btn>
      <Btn onClick={() => setMetrics(null)}>Reset</Btn>
      <div style={{ marginTop: 16 }}>
        {!metrics ? (
          <p style={{ fontSize: 13, color: T.subtle }}>Click &quot;Run simulation&quot; to generate metrics</p>
        ) : (
          PERF_DATA.map((m, i) => {
            const c = simColor(m);
            return (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: T.textSec }}>
                    <strong style={{ color: T.text }}>{m.label}</strong> — {m.full}
                  </span>
                  <span style={{ color: c, fontWeight: 600, fontSize: 13 }}>
                    {m.val}
                    {m.unit} <span style={{ fontSize: 11, opacity: 0.8 }}>({simLabel(m)})</span>
                  </span>
                </div>
                <div style={{ height: 8, background: T.surface, borderRadius: 4, overflow: "hidden", border: `1px solid ${T.border}` }}>
                  <div style={{ height: "100%", width: `${m.pct}%`, background: c, borderRadius: 4, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

// Good/poor thresholds from web.dev vitals guidance (lower is better for all).
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  INP: { good: 200, poor: 500, unit: "ms" },
  FCP: { good: 1800, poor: 3000, unit: "ms" },
  TTFB: { good: 800, poor: 1800, unit: "ms" },
};

function rateMetric(name, val) {
  const t = THRESHOLDS[name];
  if (val == null || !t) return { color: T.subtle, label: "—" };
  if (val <= t.good) return { color: T.green.fg, label: "Good" };
  if (val <= t.poor) return { color: T.amber.fg, label: "Needs improvement" };
  return { color: T.red.fg, label: "Poor" };
}

function formatVal(name, val) {
  if (val == null) return "—";
  const t = THRESHOLDS[name];
  if (name === "CLS") return val.toFixed(3);
  return `${Math.round(val)}${t?.unit || ""}`;
}

function useRealVitals() {
  const [vitals, setVitals] = useState({ LCP: null, CLS: null, INP: null, FCP: null, TTFB: null });

  useEffect(() => {
    const observers = [];
    const safeObserve = (type, cb) => {
      try {
        const po = new PerformanceObserver(cb);
        po.observe({ type, buffered: true });
        observers.push(po);
      } catch {
        /* older browsers / unsupported entry types */
      }
    };

    safeObserve("largest-contentful-paint", (list) => {
      const last = list.getEntries().at(-1);
      if (last) setVitals((v) => ({ ...v, LCP: last.startTime }));
    });

    safeObserve("paint", (list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") setVitals((v) => ({ ...v, FCP: entry.startTime }));
      }
    });

    let clsValue = 0;
    safeObserve("layout-shift", (list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) clsValue += entry.value;
      }
      setVitals((v) => ({ ...v, CLS: clsValue }));
    });

    safeObserve("event", (list) => {
      let maxDur = 0;
      for (const entry of list.getEntries()) {
        if (entry.duration > maxDur) maxDur = entry.duration;
      }
      if (maxDur > 0) setVitals((v) => ({ ...v, INP: Math.max(v.INP || 0, maxDur) }));
    });

    const nav = performance.getEntriesByType("navigation")[0];
    if (nav) setVitals((v) => ({ ...v, TTFB: nav.responseStart }));

    return () => observers.forEach((po) => po.disconnect());
  }, []);

  return vitals;
}

function RealPerf() {
  const vitals = useRealVitals();
  const [lastMeasure, setLastMeasure] = useState(null);
  const [blocking, setBlocking] = useState(false);

  const blockMainThread = () => {
    setBlocking(true);
    setTimeout(() => {
      const start = performance.now();
      while (performance.now() - start < 500) {
        // Busy-wait to create a long task visible in the Performance recording.
      }
      setBlocking(false);
    }, 0);
  };

  const markAndMeasure = async () => {
    performance.mark("workshop:start");
    await new Promise((r) => setTimeout(r, 120));
    performance.mark("workshop:end");
    const entries = performance.measure("workshop:task", "workshop:start", "workshop:end");
    const duration = entries?.duration ?? 120;
    setLastMeasure(duration);
    console.log("performance.measure('workshop:task') →", duration.toFixed(1), "ms");
  };

  const order = ["LCP", "FCP", "TTFB", "INP", "CLS"];

  return (
    <>
      <Btn variant="danger" onClick={blockMainThread} disabled={blocking}>
        {blocking ? "Blocking…" : "Block main thread 500ms"}
      </Btn>
      <Btn variant="primary" onClick={markAndMeasure}>
        performance.mark / measure
      </Btn>
      <div style={{ marginTop: 16 }}>
        {order.map((name) => {
          const val = vitals[name];
          const r = rateMetric(name, val);
          const pct = val == null ? 0 : Math.min(100, (val / (THRESHOLDS[name].poor * 1.2)) * 100);
          return (
            <div key={name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: T.textSec }}>
                  <strong style={{ color: T.text }}>{name}</strong>
                </span>
                <span style={{ color: r.color, fontWeight: 600, fontSize: 13 }}>
                  {formatVal(name, val)} <span style={{ fontSize: 11, opacity: 0.8 }}>({r.label})</span>
                </span>
              </div>
              <div style={{ height: 6, background: T.surface, borderRadius: 4, overflow: "hidden", border: `1px solid ${T.border}` }}>
                <div style={{ height: "100%", width: `${pct}%`, background: r.color, borderRadius: 4, transition: "width 0.4s ease" }} />
              </div>
            </div>
          );
        })}
        <p style={{ fontSize: 12, color: T.textSec, marginTop: 10, lineHeight: 1.6 }}>
          INP only appears after you click/type on the page — try the blocking button and watch it jump.
        </p>
        {lastMeasure != null && (
          <p style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6 }}>
            Last <Code>performance.measure</Code>: <strong style={{ color: T.text }}>{lastMeasure.toFixed(1)} ms</strong>. Look for{" "}
            <Code>workshop:task</Code> in the Performance recording&apos;s Timings track.
          </p>
        )}
      </div>
    </>
  );
}

export function PerfModule() {
  const mod = MODULES[2];
  return (
    <SectionCard
      mod={mod}
      title="Performance Profiling"
      desc="Scenario: Your dashboard feels sluggish on load. Use the Performance panel to record a trace and find what's blocking the main thread."
      tip="Open Lighthouse on your project's main page. Identify the top 3 'Opportunities' and assign one to each team member to research and fix."
    >
      <TopicTabs
        accent={mod.accent}
        explanation={
          <Explain>
            <p>
              The browser renders your page on a single <strong style={{ color: T.text }}>main thread</strong>. Every <Code>setState</Code>,
              every click handler, every layout, every paint — they all line up and run one after another. If any single task takes too long,
              the page freezes: scroll stutters, clicks feel dead, animations jank. The{" "}
              <strong style={{ color: T.text }}>Performance</strong> panel is how we <em>see</em> that timeline.
            </p>
            <ExplainHeading>Core Web Vitals (how users experience speed)</ExplainHeading>
            <ExplainList
              items={[
                <><strong style={{ color: T.text }}>LCP</strong> — Largest Contentful Paint. When did the biggest visible element finish painting? Target ≤ <strong style={{ color: T.text }}>2.5s</strong>.</>,
                <><strong style={{ color: T.text }}>INP</strong> — Interaction to Next Paint. How laggy does the app feel when you click/type? Target ≤ <strong style={{ color: T.text }}>200ms</strong>.</>,
                <><strong style={{ color: T.text }}>CLS</strong> — Cumulative Layout Shift. How much does content jump around as it loads? Target ≤ <strong style={{ color: T.text }}>0.1</strong>.</>,
                <><strong style={{ color: T.text }}>FCP / TTFB</strong> — First Contentful Paint and Time To First Byte. Good supporting signals for a slow server vs a slow client.</>,
              ]}
            />
            <ExplainHeading>Reading a Performance recording</ExplainHeading>
            <ExplainList
              items={[
                <>The <strong style={{ color: T.text }}>flame chart</strong> reads top-down: parent calls are on top, children stack underneath. Wide bars = slow functions.</>,
                <><strong style={{ color: T.text }}>Long tasks</strong> (&gt; 50ms) are flagged with a red triangle — these are the ones that block input.</>,
                <>Activity colors: <strong style={{ color: "#f7d154" }}>yellow</strong> = scripting (JS), <strong style={{ color: "#a377ff" }}>purple</strong> = rendering/layout, <strong style={{ color: "#54b86f" }}>green</strong> = painting, <strong style={{ color: "#6fa8dc" }}>blue</strong> = loading.</>,
                <>Use the <Code>Bottom-Up</Code> and <Code>Call Tree</Code> tabs to see <em>which functions</em> ate the most time, aggregated.</>,
              ]}
            />
            <ExplainHeading>Lighthouse vs Performance panel</ExplainHeading>
            <ExplainList
              items={[
                <><strong style={{ color: T.text }}>Lighthouse</strong> — automated audit. Gives a 0–100 score + prioritized &quot;Opportunities&quot; (good for first pass and PR reviews).</>,
                <><strong style={{ color: T.text }}>Performance panel</strong> — manual recording. Use when you need to investigate <em>why</em> a specific interaction is slow.</>,
                <>Rule of thumb: Lighthouse tells you <em>what</em> to fix, Performance tells you <em>where</em>.</>,
              ]}
            />
            <ExplainHeading>Custom instrumentation</ExplainHeading>
            <p>
              When you care about a specific operation (a checkout flow, a chart render), wrap it in{" "}
              <Code>performance.mark(&apos;start&apos;)</Code> …{" "}
              <Code>performance.mark(&apos;end&apos;)</Code> →{" "}
              <Code>performance.measure(&apos;name&apos;, &apos;start&apos;, &apos;end&apos;)</Code>. Your named span shows up in the{" "}
              <Code>Timings</Code> track so you can see it next to everything else the browser is doing.
            </p>
          </Explain>
        }
        steps={
          <>
            <Step num={1}>
              Open DevTools → <strong style={{ color: T.text }}>Performance</strong> tab. Click the record button, interact with the page, then stop.
            </Step>
            <Step num={2}>
              Study the <strong style={{ color: T.text }}>flame chart</strong> — tasks over 50ms are highlighted in red. These block your UI.
            </Step>
            <Step num={3}>
              Check <strong style={{ color: T.text }}>Web Vitals</strong> markers: LCP (paint), CLS (layout shift), INP (interaction responsiveness).
            </Step>
            <Step num={4}>
              Run a <strong style={{ color: T.text }}>Lighthouse</strong> audit from the Lighthouse tab — you get a score and prioritized fixes.
            </Step>
            <Step num={5}>
              Instrument your code with <Code>performance.mark(&apos;start&apos;)</Code> and <Code>performance.measure()</Code> to pinpoint slow operations.
            </Step>
          </>
        }
      />

      <DemoBlock variant="simulated" hint="Canned Web Vitals — use this to explain LCP/INP/CLS and the good/poor thresholds before showing real numbers.">
        <SimulatedPerf />
      </DemoBlock>

      <DemoBlock variant="real" accent={mod.accent}>
        <OpenDevToolsHint panel="Performance">
          Vitals below come from <Code>PerformanceObserver</Code> on this page. Record a trace while you click &quot;Block main thread&quot; — the
          flame chart should show a red long-task.
        </OpenDevToolsHint>
        <RealPerf />
      </DemoBlock>
    </SectionCard>
  );
}
