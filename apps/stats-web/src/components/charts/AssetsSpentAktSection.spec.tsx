// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { AssetsSpentAktSection, DEPENDENCIES } from "@/components/charts/AssetsSpentAktSection";
import { AKT_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import type { DashboardBlockStats } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(AssetsSpentAktSection.name, () => {
  it("orders ACT first and AKT second, but keeps AKT active by default", () => {
    setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    const tabs = screen.getAllByRole("tab");
    expect(tabs.map(tab => tab.getAttribute("aria-label"))).toEqual(["ACT Spent", "AKT Spent"]);
    expect(screen.getByRole("tab", { name: "AKT Spent" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "ACT Spent" })).toHaveAttribute("data-state", "inactive");
  });

  it("shows AKT's total by default, not ACT's", () => {
    const { deps } = setup({
      now: mock<DashboardBlockStats>({ totalUAktSpent: 2_810_000_000_000, totalUActSpent: 2_130_000_000_000 }),
      compare: mock<DashboardBlockStats>({ totalUAktSpent: 2_800_000_000_000, totalUActSpent: 2_100_000_000_000 })
    });

    expect(screen.getByText("2.81M")).toBeInTheDocument();
    expect(deps.SpendChartContainer.mock.calls.find(call => call.at(0)?.denom === AKT_DENOM)).toBeDefined();
  });

  it("switches to ACT's total and chart when the ACT Spent tab is selected", () => {
    const { container } = setup({
      now: mock<DashboardBlockStats>({ totalUAktSpent: 2_810_000_000_000, totalUActSpent: 2_130_000_000_000 }),
      compare: mock<DashboardBlockStats>({ totalUAktSpent: 2_800_000_000_000, totalUActSpent: 2_100_000_000_000 })
    });

    fireEvent.mouseDown(screen.getByRole("tab", { name: "ACT Spent" }));

    expect(container.textContent).toContain("$2.13M");
    expect(screen.getByRole("tab", { name: "ACT Spent" })).toHaveAttribute("data-state", "active");
  });

  it("computes each tab's total delta as now-vs-compare, not a fixed placeholder", () => {
    const { container } = setup({
      now: mock<DashboardBlockStats>({ totalUAktSpent: 11_000_000, totalUActSpent: 12_000_000 }),
      compare: mock<DashboardBlockStats>({ totalUAktSpent: 10_000_000, totalUActSpent: 10_000_000 })
    });

    expect(container.textContent).toContain("+10.00%");

    fireEvent.mouseDown(screen.getByRole("tab", { name: "ACT Spent" }));

    expect(container.textContent).toContain("+20.00%");
  });

  it("joins each chart to the card row above it, with no gap and no double border between them", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    for (const call of deps.SpendChartContainer.mock.calls) {
      expect(call.at(0)).toMatchObject({ className: "rounded-t-none border-t-0" });
    }
  });

  function setup(props: { now: DashboardBlockStats; compare: DashboardBlockStats }) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<AssetsSpentAktSection {...props} dependencies={deps} />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en-US">
          <TooltipProvider>{children}</TooltipProvider>
        </IntlProvider>
      )
    });

    return { deps, ...result };
  }
});
