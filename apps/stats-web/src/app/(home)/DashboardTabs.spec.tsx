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
    expect(screen.getByRole("tab", { name: "Assets Spent" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Network Resources" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Resources Leased" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "BME" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Blockchain" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Provider Network" })).toBeInTheDocument();
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
  });

  it("shows the Network Capacity title and section when the Network Resources tab is selected", () => {
    const { deps, dashboardData } = setup();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Network Resources" }));

    expect(screen.getByText("Network Capacity")).toBeInTheDocument();
    expect(deps.NetworkCapacitySection.mock.calls.at(0)?.at(0)).toEqual({ networkCapacity: dashboardData.networkCapacity });
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
  });

  it("shows the BME section when that tab is selected", () => {
    const { deps } = setup();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "BME" }));

    expect(deps.BmeSection).toHaveBeenCalled();
  });

  it("shows the Blockchain title and section, passing it the chain stats, when that tab is selected", () => {
    const { deps, dashboardData } = setup();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Blockchain" }));

    expect(screen.getByRole("heading", { name: "Blockchain" })).toBeInTheDocument();
    expect(deps.BlockchainSection.mock.calls.at(0)?.at(0)).toEqual({ chainStats: dashboardData.chainStats });
  });

  it("shows the Ecosystem section when that tab is selected", () => {
    const { deps } = setup();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Provider Network" }));

    expect(deps.EcosystemSection).toHaveBeenCalled();
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
