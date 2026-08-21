// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { DashboardTabs, DEPENDENCIES } from "@/app/(home)/DashboardTabs";
import type { DashboardData, MarketData } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(DashboardTabs.name, () => {
  it("renders a trigger for all seven tabs", () => {
    setup();

    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Asset Spent" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Network Resources" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Resources Leased" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Assets Spent (AKT)" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "BME" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Blockchain" })).toBeInTheDocument();
  });

  it("shows the Overview tab's content by default and forwards dashboard and market data to it", () => {
    const { deps, dashboardData, marketData } = setup();

    expect(deps.Dashboard.mock.calls.at(0)?.at(0)).toMatchObject({ dashboardData, marketData });
  });

  it("switches to a placeholder when a not-yet-built tab is selected, replacing the Overview panel", () => {
    setup();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "BME" }));

    expect(screen.getByText("This section is being rebuilt to match the updated design. Check back soon.")).toBeInTheDocument();
    expect(screen.queryByRole("tabpanel", { name: "Overview" })).not.toBeInTheDocument();
  });

  it("returns to the Overview tab's content after visiting another tab", () => {
    const { deps } = setup();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Blockchain" }));
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Overview" }));

    expect(deps.Dashboard).toHaveBeenCalled();
    expect(screen.getByRole("tabpanel", { name: "Overview" })).toBeInTheDocument();
  });

  function setup(input?: { dependencies?: Partial<typeof DEPENDENCIES> }) {
    const deps = MockComponents(DEPENDENCIES, input?.dependencies);
    const dashboardData = mock<DashboardData>();
    const marketData = mock<MarketData>();
    const result = render(<DashboardTabs dashboardData={dashboardData} marketData={marketData} dependencies={deps} />);

    return { deps, dashboardData, marketData, ...result };
  }
});
