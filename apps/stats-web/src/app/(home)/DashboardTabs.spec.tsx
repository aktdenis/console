// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { DashboardTabs, DEPENDENCIES } from "@/app/(home)/DashboardTabs";
import type { DashboardData, MarketData } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(DashboardTabs.name, () => {
  it("renders a trigger for all six tabs", () => {
    setup();

    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Assets Spent" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Network Resources" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Resources Leased" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "BME" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Blockchain" })).toBeInTheDocument();
  });

  it("shows the Overview tab's content by default and forwards dashboard and market data to it", () => {
    const { deps, dashboardData, marketData } = setup();

    expect(deps.Dashboard.mock.calls.at(0)?.at(0)).toMatchObject({ dashboardData, marketData });
  });

  it("shows both the USD and AKT&ACT Assets Spent titles and sections when that tab is selected", () => {
    const { deps, dashboardData } = setup();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Assets Spent" }));

    expect(screen.getByRole("heading", { name: "Assets Spent (USD)" })).toBeInTheDocument();
    expect(deps.AssetsSpentSection.mock.calls.at(0)?.at(0)).toEqual({ now: dashboardData.now, compare: dashboardData.compare });
    expect(screen.getByRole("heading", { name: "Assets Spent (AKT&ACT)" })).toBeInTheDocument();
    expect(deps.AssetsSpentAktSection.mock.calls.at(0)?.at(0)).toEqual({ now: dashboardData.now, compare: dashboardData.compare });
    expect(screen.queryByText("This section is being rebuilt to match the updated design. Check back soon.")).not.toBeInTheDocument();
  });

  it("shows the Network Capacity title and section when the Network Resources tab is selected", () => {
    const { deps, dashboardData } = setup();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Network Resources" }));

    expect(screen.getByText("Network Capacity")).toBeInTheDocument();
    expect(deps.NetworkCapacitySection.mock.calls.at(0)?.at(0)).toEqual({ networkCapacity: dashboardData.networkCapacity });
    expect(screen.queryByText("This section is being rebuilt to match the updated design. Check back soon.")).not.toBeInTheDocument();
  });

  it("shows the leased-versus-total capacity card, titled Resources Leased, above the Leases and Resource Usage sections", () => {
    const { deps, dashboardData } = setup();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Resources Leased" }));

    expect(screen.getByRole("heading", { name: "Resources Leased" })).toBeInTheDocument();
    expect(deps.ResourcesLeasedCapacityCard.mock.calls.at(0)?.at(0)).toEqual({
      now: dashboardData.now,
      networkCapacity: dashboardData.networkCapacity
    });
    expect(screen.getByRole("heading", { name: "Leases" })).toBeInTheDocument();
    expect(deps.LeasesSection.mock.calls.at(0)?.at(0)).toEqual({ now: dashboardData.now, compare: dashboardData.compare });
    expect(screen.getByRole("heading", { name: "Resource Usage" })).toBeInTheDocument();
    expect(deps.ResourcesLeasedSection.mock.calls.at(0)?.at(0)).toEqual({ now: dashboardData.now, compare: dashboardData.compare });
    expect(screen.queryByText("This section is being rebuilt to match the updated design. Check back soon.")).not.toBeInTheDocument();
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
