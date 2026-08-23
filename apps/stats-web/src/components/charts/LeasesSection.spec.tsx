// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { DEPENDENCIES, LeasesSection } from "@/components/charts/LeasesSection";
import { LEASE_COUNT_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import type { DashboardBlockStats } from "@/types";
import { render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(LeasesSection.name, () => {
  it("shows new, total, and active leases, each with their own delta", () => {
    setup({
      now: mock<DashboardBlockStats>({ dailyLeaseCount: 12, totalLeaseCount: 1_000, activeLeaseCount: 803 }),
      compare: mock<DashboardBlockStats>({ dailyLeaseCount: 10, totalLeaseCount: 988, activeLeaseCount: 800 })
    });

    expect(screen.getByText("New leases (24h)")).toBeInTheDocument();
    expect(screen.getByText("Total leases")).toBeInTheDocument();
    expect(screen.getByText("Active leases")).toBeInTheDocument();
    expect(screen.getByText("+20.00%")).toBeInTheDocument();
    expect(screen.getByText("803")).toBeInTheDocument();
  });

  it("computes new leases as the totalLeaseCount delta between now and compare, not dailyLeaseCount", () => {
    const { container } = setup({
      now: mock<DashboardBlockStats>({ dailyLeaseCount: 12, totalLeaseCount: 1_000 }),
      compare: mock<DashboardBlockStats>({ dailyLeaseCount: 10, totalLeaseCount: 988 })
    });

    expect(container.textContent).toContain("12");
  });

  it("renders the leases chart with the lease-count denom, so it gets the same range toggle as assets spent", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    expect(deps.SpendChartContainer.mock.calls.at(0)?.at(0)).toMatchObject({ denom: LEASE_COUNT_DENOM });
  });

  function setup(props: { now: DashboardBlockStats; compare: DashboardBlockStats }) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<LeasesSection {...props} dependencies={deps} />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en-US">
          <TooltipProvider>{children}</TooltipProvider>
        </IntlProvider>
      )
    });

    return { deps, ...result };
  }
});
