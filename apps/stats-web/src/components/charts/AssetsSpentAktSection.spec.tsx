// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { AssetsSpentAktSection, DEPENDENCIES } from "@/components/charts/AssetsSpentAktSection";
import type { DashboardBlockStats } from "@/types";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(AssetsSpentAktSection.name, () => {
  it("shows total AKT spent, converted from micro-denomination, labeled as AKT", () => {
    const { container } = setup({
      now: mock<DashboardBlockStats>({ totalUAktSpent: 2_810_000_000_000, totalUActSpent: 0 }),
      compare: mock<DashboardBlockStats>({ totalUAktSpent: 2_800_000_000_000, totalUActSpent: 0 })
    });

    expect(container.textContent).toContain("2.81M");
    expect(container.textContent).toContain("AKT");
  });

  it("shows total ACT spent as a USD-styled amount, labeled as ACT", () => {
    const { container } = setup({
      now: mock<DashboardBlockStats>({ totalUAktSpent: 0, totalUActSpent: 2_130_000_000_000 }),
      compare: mock<DashboardBlockStats>({ totalUAktSpent: 0, totalUActSpent: 2_100_000_000_000 })
    });

    expect(container.textContent).toContain("$2.13M");
    expect(container.textContent).toContain("ACT");
  });

  it("computes each card's delta as now-vs-compare, not a fixed placeholder", () => {
    const { container } = setup({
      now: mock<DashboardBlockStats>({ totalUAktSpent: 11_000_000, totalUActSpent: 12_000_000 }),
      compare: mock<DashboardBlockStats>({ totalUAktSpent: 10_000_000, totalUActSpent: 10_000_000 })
    });

    expect(container.textContent).toContain("+10.00%");
    expect(container.textContent).toContain("+20.00%");
  });

  it("renders the AKT daily-spend chart", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    expect(deps.AktSpendChartContainer).toHaveBeenCalled();
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
