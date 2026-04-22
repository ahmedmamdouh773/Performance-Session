import { T } from "./theme";

export const MODULES = [
  { id: "console", label: "Console & Errors", accent: T.orange },
  { id: "network", label: "Network", accent: T.blue },
  { id: "perf", label: "Performance", accent: T.green },
  { id: "memory", label: "Memory Leaks", accent: T.amber },
  { id: "react", label: "React DevTools", accent: T.purple },
  { id: "cheat", label: "Cheat Sheet", accent: T.teal },
];

export const NET_ROWS = [
  { status: 200, method: "GET", path: "/api/v1/users", size: "3.2 KB", time: "124ms", type: "ok" },
  { status: 401, method: "POST", path: "/api/v1/sessions", size: "—", time: "88ms", type: "fail" },
  { status: 200, method: "GET", path: "/api/v1/projects", size: "28.4 KB", time: "1.8s", type: "slow" },
  { status: 500, method: "PUT", path: "/api/v1/users/42", size: "—", time: "212ms", type: "fail" },
  { status: 200, method: "GET", path: "/api/v1/dashboard/stats", size: "1.1 KB", time: "67ms", type: "ok" },
  { status: 304, method: "GET", path: "/static/main.js", size: "—", time: "18ms", type: "ok" },
];

export const PERF_DATA = [
  { label: "LCP", full: "Largest Contentful Paint", val: 3.4, unit: "s", pct: 68, good: 2.5, lowerGood: false },
  { label: "INP", full: "Interaction to Next Paint", val: 280, unit: "ms", pct: 56, good: 200, lowerGood: false },
  { label: "CLS", full: "Cumulative Layout Shift", val: 0.08, unit: "", pct: 20, good: 0.1, lowerGood: true },
  { label: "TTFB", full: "Time to First Byte", val: 890, unit: "ms", pct: 44, good: 800, lowerGood: false },
  { label: "Parse", full: "JS bundle parse time", val: 540, unit: "ms", pct: 90, good: 300, lowerGood: false },
];

export const CHEAT = [
  {
    title: "Shortcuts",
    color: T.teal,
    items: [
      ["Open DevTools", "F12 / Cmd+Opt+I"],
      ["Open Console", "Cmd+Opt+J"],
      ["Inspect element", "Cmd+Shift+C"],
      ["Command menu", "Cmd+Shift+P"],
      ["Toggle device", "Cmd+Shift+M"],
    ],
  },
  {
    title: "Console",
    color: T.orange,
    items: [
      ["Pretty-print", "console.dir(obj)"],
      ["Tabular data", "console.table(arr)"],
      ["Group logs", "console.group()"],
      ["Time a block", "console.time('x')"],
      ["Breakpoint", "debugger;"],
    ],
  },
  {
    title: "Network",
    color: T.blue,
    items: [
      ["Preserve log", "toolbar checkbox"],
      ["Filter type", "XHR / Fetch / JS"],
      ["Block request", "right-click → block"],
      ["Copy as cURL", "right-click request"],
      ["Replay", "right-click → replay"],
    ],
  },
  {
    title: "Performance",
    color: T.green,
    items: [
      ["Long task", "> 50ms"],
      ["Good LCP", "< 2.5s"],
      ["Good INP", "< 200ms"],
      ["Good CLS", "< 0.1"],
      ["Mark timing", "performance.mark()"],
    ],
  },
];

export const REACT_TIPS = [
  { icon: "⚛", title: "Components panel", desc: "Inspect the full React component tree. Click any component to see its current props, state, and hooks in the right panel.", accent: T.purple },
  { icon: "⏱", title: "Profiler tab", desc: "Record a session and see a flame chart of every render. Find which components re-render too often and why.", accent: T.blue },
  { icon: "🔍", title: "Highlight updates", desc: "Enable 'Highlight updates when components render' in settings. Components flash on re-render — find unnecessary ones instantly.", accent: T.orange },
  { icon: "🪝", title: "Hooks inspector", desc: "Expand any component in the tree to see all hooks (useState, useEffect, useRef) and their current values live.", accent: T.green },
  { icon: "📌", title: "$r in console", desc: "Select a component in React DevTools then type $r in the Console — you get a reference to that component instance.", accent: T.teal },
  { icon: "🚀", title: "Why did it render?", desc: "Install 'why-did-you-render' package to log exactly why a component re-rendered — prop change, state change, or context.", accent: T.amber },
];
