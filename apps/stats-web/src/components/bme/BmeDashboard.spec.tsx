// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { BmeDashboard, DEPENDENCIES } from "@/components/bme/BmeDashboard";
import { COLLATERAL_RATIO_DENOM, NET_AKT_BURNED_DENOM, OUTSTANDING_ACT_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import type { BmeStatusHistoryEntry } from "@/queries";
import type { BmeDashboardData, BmePeriodData } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(BmeDashboard.name, () => {
  it("defaults to the Summary tab, charting Outstanding ACT, Vault AKT Balance, Net AKT Burned, and Collateral Ratio", () => {
    const { deps } = setup({ dashboardData: mock<BmeDashboardData>({ now: mock<BmePeriodData>(), compare: mock<BmePeriodData>() }) });

    expect(screen.getByRole("tab", { name: "Summary" })).toHaveAttribute("data-state", "active");
    const denoms = deps.SpendChartContainer.mock.calls.map(call => call.at(0)?.denom);
    expect(denoms).toEqual(expect.arrayContaining([OUTSTANDING_ACT_DENOM, NET_AKT_BURNED_DENOM, COLLATERAL_RATIO_DENOM]));
  });

  it("hides the Summary panel, and so Collateral Ratio with it, once a different activity tab is active", () => {
    const { container } = setup({ dashboardData: mock<BmeDashboardData>({ now: mock<BmePeriodData>(), compare: mock<BmePeriodData>() }) });
    const summaryTrigger = screen.getByRole("tab", { name: "Summary" });
    const summaryPanel = container.querySelector(`[aria-labelledby="${summaryTrigger.id}"]`);

    fireEvent.mouseDown(screen.getByRole("tab", { name: "AKT Burn & ACT Mint" }));

    expect(summaryPanel).toHaveAttribute("hidden");
  });

  it("switches to the AKT Burn & ACT Mint tab, with its own AKT/ACT switcher defaulting to AKT burned", () => {
    setup({ dashboardData: mock<BmeDashboardData>({ now: mock<BmePeriodData>(), compare: mock<BmePeriodData>() }) });

    fireEvent.mouseDown(screen.getByRole("tab", { name: "AKT Burn & ACT Mint" }));

    expect(screen.getByRole("tab", { name: "AKT Burned for ACT" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "ACT Minted" })).toHaveAttribute("data-state", "inactive");
  });

  it("shows AKT Burned for ACT's all-time total on its tab, converted from micro units, not the daily figure", () => {
    setup({
      dashboardData: mock<BmeDashboardData>({
        now: mock<BmePeriodData>({ totalAktBurnedForAct: 5_000_000, dailyAktBurnedForAct: 999_000_000 }),
        compare: mock<BmePeriodData>({ totalAktBurnedForAct: 4_000_000 })
      })
    });

    fireEvent.mouseDown(screen.getByRole("tab", { name: "AKT Burn & ACT Mint" }));

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("999")).not.toBeInTheDocument();
    expect(screen.getByText("+25.00%")).toBeInTheDocument();
  });

  it("switches to the ACT Burn & AKT Remint tab, with its own ACT/AKT switcher defaulting to ACT burned", () => {
    setup({ dashboardData: mock<BmeDashboardData>({ now: mock<BmePeriodData>(), compare: mock<BmePeriodData>() }) });

    fireEvent.mouseDown(screen.getByRole("tab", { name: "ACT Burn & AKT Remint" }));

    expect(screen.getByRole("tab", { name: "ACT Burned for AKT" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "AKT Reminted" })).toHaveAttribute("data-state", "inactive");
  });

  it("shows the circuit breaker status inline next to the activity tabs, on every tab, not just Summary", () => {
    const statusHistory = [mock<BmeStatusHistoryEntry>({ newStatus: "mint_status_halt" })];
    const { deps } = setup({ dashboardData: mock<BmeDashboardData>({ now: mock<BmePeriodData>(), compare: mock<BmePeriodData>() }), statusHistory });

    expect(screen.getByText("Circuit Breaker Status")).toBeInTheDocument();
    expect(deps.BmeStatusBadge.mock.calls.at(0)?.at(0)).toMatchObject({ status: "mint_status_halt", size: "sm" });

    fireEvent.mouseDown(screen.getByRole("tab", { name: "ACT Burn & AKT Remint" }));

    expect(screen.getByText("Circuit Breaker Status")).toBeInTheDocument();
  });

  it("shows the Learn more tiles at the bottom of the Summary tab", () => {
    setup({ dashboardData: mock<BmeDashboardData>({ now: mock<BmePeriodData>(), compare: mock<BmePeriodData>() }) });

    expect(screen.getByText("Learn more")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read the post/ })).toHaveAttribute(
      "href",
      "https://akash.network/blog/what-burn-mint-equilibrium-means-for-akash/"
    );
    expect(screen.getByRole("link", { name: /View the proposal/ })).toHaveAttribute("href", "https://akash.network/roadmap/aep-76/");
  });

  it("falls back to an 'unknown' status when there's no history yet", () => {
    const { deps } = setup({ dashboardData: mock<BmeDashboardData>({ now: mock<BmePeriodData>(), compare: mock<BmePeriodData>() }), statusHistory: [] });

    expect(deps.BmeStatusBadge.mock.calls.at(0)?.at(0)).toMatchObject({ status: "unknown" });
  });

  function setup(input: { dashboardData: BmeDashboardData; statusHistory?: BmeStatusHistoryEntry[] }) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<BmeDashboard dashboardData={input.dashboardData} statusHistory={input.statusHistory ?? []} dependencies={deps} />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en-US">
          <TooltipProvider>{children}</TooltipProvider>
        </IntlProvider>
      )
    });

    return { deps, ...result };
  }
});
