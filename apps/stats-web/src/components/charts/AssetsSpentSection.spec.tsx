// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { AssetsSpentSection, DEPENDENCIES } from "@/components/charts/AssetsSpentSection";
import { USD_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import type { DashboardBlockStats } from "@/types";
import { render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(AssetsSpentSection.name, () => {
  it("shows the 24h and total USD spend, each with their own delta", () => {
    setup({
      now: mock<DashboardBlockStats>({ dailyUUsdSpent: 11_000_000, totalUUsdSpent: 568_000_000_000 }),
      compare: mock<DashboardBlockStats>({ dailyUUsdSpent: 10_000_000, totalUUsdSpent: 500_000_000_000 })
    });

    expect(screen.getByText("USD Spent (24h)")).toBeInTheDocument();
    expect(screen.getByText("Total spent USD")).toBeInTheDocument();
    expect(screen.getByText("+10.00%")).toBeInTheDocument();
    expect(screen.getByText("+13.60%")).toBeInTheDocument();
  });

  it("passes the USD denom to the chart, joined to the card row above it", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    expect(deps.SpendChartContainer.mock.calls.at(0)?.at(0)).toMatchObject({ denom: USD_DENOM, className: "rounded-t-none border-t-0" });
  });

  function setup(props: { now: DashboardBlockStats; compare: DashboardBlockStats }) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<AssetsSpentSection {...props} dependencies={deps} />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en-US">
          <TooltipProvider>{children}</TooltipProvider>
        </IntlProvider>
      )
    });

    return { deps, ...result };
  }
});
