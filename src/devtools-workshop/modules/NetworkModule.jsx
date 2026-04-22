import { useState } from "react";
import { T } from "../theme";
import { MODULES, NET_ROWS } from "../data";
import { SectionCard } from "../components/SectionCard";
import { Step } from "../components/Step";
import { Code } from "../components/Code";
import { Btn } from "../components/Btn";
import { DemoBlock } from "../components/DemoBlock";
import { OpenDevToolsHint } from "../components/OpenDevToolsHint";
import { TopicTabs, Explain, ExplainHeading, ExplainList } from "../components/TopicTabs";

const REAL_REQUESTS = [
  { key: "users", label: "GET users (200)", method: "GET", url: "https://jsonplaceholder.typicode.com/users" },
  { key: "not-found", label: "GET missing (404)", method: "GET", url: "https://jsonplaceholder.typicode.com/unknown/9999" },
  { key: "500", label: "GET 500", method: "GET", url: "https://httpbin.org/status/500" },
  { key: "slow", label: "GET slow (3s)", method: "GET", url: "https://httpbin.org/delay/3" },
  { key: "post", label: "POST body", method: "POST", url: "https://httpbin.org/post", body: { hello: "workshop", ts: "<now>" } },
  { key: "large", label: "GET large (~860KB)", method: "GET", url: "https://jsonplaceholder.typicode.com/photos" },
];

function classify(status, ms) {
  if (status === 0) return "fail";
  if (status >= 500 || status === 404 || status === 401) return "fail";
  if (ms > 1500) return "slow";
  return "ok";
}

function SimulatedNetwork() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const dotColor = { ok: T.green.fg, fail: T.red.fg, slow: T.amber.fg };
  const rowColor = { ok: T.green.fg, fail: T.red.fg, slow: T.amber.fg };

  const simulate = () => {
    if (busy) return;
    setBusy(true);
    setRows([]);
    NET_ROWS.forEach((r, i) => setTimeout(() => setRows((p) => [...p, r]), i * 250));
    setTimeout(() => setBusy(false), NET_ROWS.length * 250 + 100);
  };

  return (
    <>
      <Btn variant="primary" onClick={simulate} disabled={busy}>
        {busy ? "Loading…" : "Simulate API calls"}
      </Btn>
      <Btn onClick={() => setRows([])}>Clear</Btn>
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" }}>
          <thead>
            <tr>
              {["Status", "Method", "Endpoint", "Size", "Time"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "5px 10px",
                    fontSize: 11,
                    color: T.muted,
                    borderBottom: `1px solid ${T.border}`,
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "14px 10px", color: T.subtle, fontFamily: "inherit", fontSize: 13 }}>
                  Click &quot;Simulate API calls&quot; to see requests
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, color: rowColor[r.type] }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: dotColor[r.type],
                        marginRight: 6,
                      }}
                    />
                    {r.status}
                  </td>
                  <td style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, color: T.textSec }}>{r.method}</td>
                  <td style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, color: T.text }}>{r.path}</td>
                  <td style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, color: T.textSec }}>{r.size}</td>
                  <td style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, color: rowColor[r.type] }}>{r.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function humanSize(bytes) {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function RealNetwork() {
  const [log, setLog] = useState([]);
  const [pending, setPending] = useState({});
  const dotColor = { ok: T.green.fg, fail: T.red.fg, slow: T.amber.fg };
  const rowColor = { ok: T.green.fg, fail: T.red.fg, slow: T.amber.fg };

  const run = async (req) => {
    setPending((p) => ({ ...p, [req.key]: true }));
    const started = performance.now();
    let status = 0;
    let bytes = null;
    let error = null;
    try {
      const init = { method: req.method };
      if (req.method === "POST") {
        init.headers = { "Content-Type": "application/json" };
        init.body = JSON.stringify({ ...req.body, ts: new Date().toISOString() });
      }
      const res = await fetch(req.url, init);
      status = res.status;
      const text = await res.text();
      bytes = new Blob([text]).size;
    } catch (e) {
      error = e.message || String(e);
    }
    const ms = Math.round(performance.now() - started);
    setPending((p) => ({ ...p, [req.key]: false }));
    setLog((prev) =>
      [
        {
          id: `${req.key}-${Date.now()}`,
          status,
          method: req.method,
          url: req.url,
          size: bytes,
          ms,
          type: classify(status, ms),
          error,
        },
        ...prev,
      ].slice(0, 12),
    );
  };

  const runAll = async () => {
    for (const r of REAL_REQUESTS) {
      run(r);
      await new Promise((r) => setTimeout(r, 120));
    }
  };

  return (
    <>
      {REAL_REQUESTS.map((r) => (
        <Btn key={r.key} variant={r.method === "POST" ? "success" : "primary"} onClick={() => run(r)} disabled={pending[r.key]}>
          {pending[r.key] ? "…" : r.label}
        </Btn>
      ))}
      <Btn onClick={runAll}>Run all</Btn>
      <Btn onClick={() => setLog([])}>Clear</Btn>
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" }}>
          <thead>
            <tr>
              {["Status", "Method", "URL", "Size", "Time"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "5px 10px",
                    fontSize: 11,
                    color: T.muted,
                    borderBottom: `1px solid ${T.border}`,
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {log.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "14px 10px", color: T.subtle, fontFamily: "inherit", fontSize: 13 }}>
                  Fire a request — and watch your real Network tab at the same time.
                </td>
              </tr>
            ) : (
              log.map((r) => (
                <tr key={r.id}>
                  <td style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, color: rowColor[r.type] }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: dotColor[r.type],
                        marginRight: 6,
                      }}
                    />
                    {r.status || "ERR"}
                  </td>
                  <td style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, color: T.textSec }}>{r.method}</td>
                  <td
                    style={{
                      padding: "6px 10px",
                      borderBottom: `1px solid ${T.border}`,
                      color: T.text,
                      maxWidth: 360,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={r.url}
                  >
                    {r.url.replace(/^https?:\/\//, "")}
                  </td>
                  <td style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, color: T.textSec }}>{humanSize(r.size)}</td>
                  <td style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, color: rowColor[r.type] }}>{r.ms}ms</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function NetworkModule() {
  const mod = MODULES[1];
  return (
    <SectionCard
      mod={mod}
      title="Network Monitoring"
      desc="Scenario: An API call fails intermittently in production. The Network tab shows every request — its status, payload, headers, and response."
      tip="Reproduce a 401 or 500 error in your actual project. Read the response body together — the server usually tells you exactly what went wrong."
    >
      <TopicTabs
        accent={mod.accent}
        explanation={
          <Explain>
            <p>
              The <strong style={{ color: T.text }}>Network</strong> panel records every resource the page asks for — HTML, JS, CSS, images,
              fonts, and (most importantly for us) <Code>fetch</Code> / <Code>XHR</Code> API calls and WebSocket frames. When an API is
              &quot;broken&quot;, the truth is almost always sitting in one of these rows.
            </p>
            <ExplainHeading>What each column tells you</ExplainHeading>
            <ExplainList
              items={[
                <><strong style={{ color: T.text }}>Status</strong> — 2xx ok, 3xx redirect, 4xx you sent something wrong, 5xx server broke.</>,
                <><strong style={{ color: T.text }}>Type</strong> — <Code>fetch</Code>, <Code>xhr</Code>, <Code>document</Code>, <Code>script</Code>, etc. Filter by <Code>Fetch/XHR</Code> to hide asset noise.</>,
                <><strong style={{ color: T.text }}>Size</strong> — top number = transferred (over the wire), bottom = uncompressed. A huge delta = gzip is doing its job.</>,
                <><strong style={{ color: T.text }}>Time</strong> — total request duration. The waterfall bar shows <em>where</em> that time went.</>,
                <><strong style={{ color: T.text }}>Initiator</strong> — which file/line triggered this request. Great for &quot;why are we calling this?&quot;.</>,
              ]}
            />
            <ExplainHeading>The request drawer (click any row)</ExplainHeading>
            <ExplainList
              items={[
                <><strong style={{ color: T.text }}>Headers</strong> — auth tokens, cookies, content-type, CORS, cache directives.</>,
                <><strong style={{ color: T.text }}>Payload</strong> — what the client sent (query params + JSON body).</>,
                <><strong style={{ color: T.text }}>Preview / Response</strong> — what the server returned. The server usually explains what&apos;s wrong here — read it.</>,
                <><strong style={{ color: T.text }}>Timing</strong> — breakdown: queued → stalled → DNS → connect → TLS → TTFB → download. Tells you if it&apos;s a network issue or a server issue.</>,
              ]}
            />
            <ExplainHeading>Features worth knowing</ExplainHeading>
            <ExplainList
              items={[
                <><Code>Preserve log</Code> — keep requests across navigation / reloads. Essential for login + redirect flows.</>,
                <><Code>Disable cache</Code> — reproduce what a first-time visitor sees.</>,
                <><Code>Throttling</Code> — simulate Slow 3G / Fast 3G / offline to catch spinners that never end and broken retry logic.</>,
                <>Right-click → <Code>Copy as cURL / fetch</Code> — reproduce a failing call in terminal or Postman in 2 seconds.</>,
                <>Right-click → <Code>Block request URL</Code> — fake an outage without touching the server.</>,
              ]}
            />
            <ExplainHeading>Common symptoms → likely cause</ExplainHeading>
            <ExplainList
              items={[
                "401 / 403 — token missing, expired, or wrong scope. Check Headers → Authorization.",
                "CORS error in Console but nothing in Network — the preflight (OPTIONS) failed. Filter by Method: OPTIONS.",
                "Long green \"Waiting (TTFB)\" bar — the server is slow. Not a frontend problem.",
                "Duplicate requests for the same URL — missing dependency array, or request not cached.",
              ]}
            />
          </Explain>
        }
        steps={
          <>
            <Step num={1}>
              Open DevTools → <strong style={{ color: T.text }}>Network</strong> tab. Enable &quot;Preserve log&quot; so requests survive navigation.
            </Step>
            <Step num={2}>
              Filter by <Code>XHR/Fetch</Code> to isolate API calls. Use the search bar to find a specific endpoint.
            </Step>
            <Step num={3}>
              Click any request → inspect <strong style={{ color: T.text }}>Headers</strong> (auth tokens),{" "}
              <strong style={{ color: T.text }}>Payload</strong> (what was sent), <strong style={{ color: T.text }}>Response</strong> (what came back).
            </Step>
            <Step num={4}>
              Check the <strong style={{ color: T.text }}>Timing</strong> sub-tab — breaks down TTFB, download time, and queue wait time.
            </Step>
            <Step num={5}>
              Use the <strong style={{ color: T.text }}>Throttle</strong> dropdown to simulate &quot;Slow 3G&quot;, then replay your user flow to find
              breakage.
            </Step>
          </>
        }
      />

      <DemoBlock variant="simulated" hint="Canned responses drip in every 250ms — use this to explain statuses & colors without network flakiness.">
        <SimulatedNetwork />
      </DemoBlock>

      <DemoBlock variant="real" accent={mod.accent}>
        <OpenDevToolsHint panel="Network">
          Each button fires a real <Code>fetch()</Code> against a public API. Filter by <Code>Fetch/XHR</Code>, then click the request to inspect
          Headers, Payload, Response, and Timing.
        </OpenDevToolsHint>
        <RealNetwork />
      </DemoBlock>
    </SectionCard>
  );
}
