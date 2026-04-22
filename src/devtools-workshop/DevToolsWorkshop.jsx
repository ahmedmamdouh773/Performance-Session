import { useState } from "react";
import { T } from "./theme";
import { MODULES } from "./data";
import { WorkshopHeader } from "./components/WorkshopHeader";
import { WorkshopTabs } from "./components/WorkshopTabs";
import { ConsoleModule } from "./modules/ConsoleModule";
import { NetworkModule } from "./modules/NetworkModule";
import { PerfModule } from "./modules/PerfModule";
import { MemoryModule } from "./modules/MemoryModule";
import { ReactModule } from "./modules/ReactModule";
import { CheatSheet } from "./modules/CheatSheet";

export default function DevToolsWorkshop() {
  const [active, setActive] = useState("console");

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: T.bg,
        minHeight: "100vh",
        padding: "2rem 1.5rem",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <WorkshopHeader />
      <WorkshopTabs modules={MODULES} active={active} onSelect={setActive} />

      {active === "console" && <ConsoleModule />}
      {active === "network" && <NetworkModule />}
      {active === "perf" && <PerfModule />}
      {active === "memory" && <MemoryModule />}
      {active === "react" && <ReactModule />}
      {active === "cheat" && <CheatSheet />}
    </div>
  );
}
